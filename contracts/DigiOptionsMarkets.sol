/*
 freedex-protocol / User Driven Option Markets Contract used by https://www.digioptions.com

 Designed to work with signatures from [www.factsigner.com](https://www.factsigner.com)

 Public repository:
 https://github.com/berlincode/digioptions-contracts.js

 elastic.code@gmail.com
 mail@digioptions.com


 MIT License

 Copyright (c) digioptions.com (https://www.digioptions.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

*/

pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

import "./DigiOptionsBaseInterface.sol";
import "./DigiOptionsLib.sol";
import "./SafeCast.sol";
import "factsigner/contracts/FactsignerDefines.sol";
import "factsigner/contracts/FactsignerVerify.sol";
//import_"@openzeppelin/contracts/math/SafeMath.sol";
//import_"@openzeppelin/contracts/drafts/SignedSafeMath.sol";
import "./SafeMath.sol";
import "./SignedSafeMath.sol";


contract DigiOptionsMarkets is DigiOptionsBaseInterface {
    using SafeCast for int256;
    using SafeCast for uint256;
    using SafeCast for int128;
    using SafeCast for uint128;
    using SafeMath for uint256;
    using SignedSafeMath for int256;

    uint256 constant private VERSION = (
        (0 << 32) + /* major */
        (50 << 16) + /* minor */
        0 /* bugfix */
    );
    uint256 constant private OFFER_MAX_BLOCKS_INTO_FUTURE = 12;

    // each nanoOption is worth 10**9 = 1000000000 wei in case of win
    uint256 constant private ATOMIC_OPTION_PAYOUT_WEI_EXP = 9;
    int256 constant private ATOMIC_OPTION_PAYOUT_WEI = int256(uint256(10)**ATOMIC_OPTION_PAYOUT_WEI_EXP);

    uint8 constant private RANGESTATE_NOT_USED = 0;
    uint8 constant private RANGESTATE_TRADED = 1;
    uint8 constant private RANGESTATE_PAYED_OUT = 2;

    int256 constant private INT256_MAX = int256(~(uint256(1) << 255));

    struct Position {
        int128 value;
        uint8 rangeState;
    }

    struct Market {
        DigiOptionsLib.MarketState marketState;
        DigiOptionsLib.MarketBaseData marketBaseData;
        mapping(address => mapping(uint256 => Position)) positions; // position mapping for each user

        mapping(bytes32 => uint256)  offersAccepted; // remember how many options from an offer are already taken
    }

    struct OrderOffer {
        bytes32 marketHash;
        uint16 optionID;
        bool buy; // does the offer owner want to buy or sell options
        uint256 pricePerOption;
        uint256 size;
        uint256 offerID;
        uint256 blockExpires;
        address offerOwner;
    }

    struct OrderOfferSigned {
        OrderOffer orderOffer;
        DigiOptionsLib.Signature signature;
    }

    /* variables */
    uint256 private timestamp;
    uint256 private blockNumber;
    uint256 private existingMarkets; /* one bit for each marketCategory and marketInterval */

    mapping(address => uint256) internal liquidityUser;
    mapping(bytes32 => Market) internal markets;

    mapping(address => uint32) internal userMarketsIdx;

    event MarketCreate(
        bytes32 marketKey, /* marketsContract stores marketHash ; marketListerContract stores baseMarketHash */
        uint48 indexed expirationDatetimeFilter,
        uint40 expirationDatetime,
        uint8 indexed marketInterval,
        uint8 indexed marketCategory,
        string underlyingString
    );
    event MarketSettlement(
        bytes32 marketHash
    );
    // this may result in liquidity change
    event LiquidityAddWithdraw(address indexed addr, uint256 datetime, int256 amount);
    event PositionChange(
        // TODO optimize order for storage density?
        uint256 indexed buyer,
        uint256 indexed seller,
        bytes32 indexed marketHash,
        uint256 datetime, // TODO we might remove this and use info from block
        uint16 optionID,
        uint256 pricePerOption,
        uint256 size,
        bytes32 offerHash
    );

    /* This is the constructor */
    constructor ()
        public
    {
        blockNumber = block.number;
        timestamp = block.timestamp;
    }

    /* TODO re-enabled after 0x-tools support solc-0.6.0
    // default fallback
    receive ()
        external
        payable
    {
        liquidityAdd();
    }
    */

    function getContractInfo (
    )
        external
        override
        virtual
        returns (uint256[] memory contractInfoValues)
    {
        uint256[] memory infoValues = new uint[](uint256(DigiOptionsLib.InfoValues.MAX));

        infoValues[uint256(DigiOptionsLib.InfoValues.CONTRACT_TYPE_IDX)] = uint256(DigiOptionsLib.ContractType.DIGIOPTIONSMARKETS);
        infoValues[uint256(DigiOptionsLib.InfoValues.VERSION_MARKET_LISTER_IDX)] = 0; // versionMarketLister
        infoValues[uint256(DigiOptionsLib.InfoValues.VERSION_MARKETS_IDX)] = VERSION; // versionMarkets
        infoValues[uint256(DigiOptionsLib.InfoValues.DIGIOPTIONS_MARKETS_ADDR_IDX)] = uint256(address(this)); // digiOptionsMarketsAddr
        infoValues[uint256(DigiOptionsLib.InfoValues.BLOCK_NUMBER_CREATED_IDX)] = blockNumber; // blockNumberCreated
        infoValues[uint256(DigiOptionsLib.InfoValues.TIMESTAMP_MARKET_CREATED_IDX)] = timestamp; // timestampMarketsCreated
        infoValues[uint256(DigiOptionsLib.InfoValues.OFFER_MAX_BLOCKS_INTO_FUTURE_IDX)] = OFFER_MAX_BLOCKS_INTO_FUTURE;
        infoValues[uint256(DigiOptionsLib.InfoValues.ATOMIC_OPTION_PAYOUT_WEI_EXP_IDX)] = ATOMIC_OPTION_PAYOUT_WEI_EXP;
        infoValues[uint256(DigiOptionsLib.InfoValues.EXISTING_MARKETS)] = existingMarkets;

        return infoValues;
    }

    // TODO test
    function liquidityGet()
        public
        view
        returns (uint256 liquidity)
    {
        return liquidityUser[msg.sender];
    }

    function liquidityWithdraw (uint256 amount) external {
        require (amount <= liquidityUser[msg.sender], "Not enough liquidity.");

        /* Remember to reduce the liquidity BEFORE */
        /* sending to prevent re-entrancy attacks */
        liquidityUser[msg.sender] = liquidityUser[msg.sender].sub(amount);
        msg.sender.transfer(amount);
        emit LiquidityAddWithdraw(msg.sender, block.timestamp, int256(-amount));
    }

    /* returns all relevant market data - if marketHash does not exist marketBaseData.expirationDatetime is 0*/
    function getMarketDataByMarketHash (
        address addr, // marketData.userState for this address
        bytes32 marketHash
    )
        public
        view
        override
        virtual
        returns (DigiOptionsLib.MarketData memory marketData)
    {
        Market storage market = markets[marketHash];
        DigiOptionsLib.MarketBaseData memory marketBaseData = market.marketBaseData;
        DigiOptionsLib.MarketState memory marketState = market.marketState;

        return DigiOptionsLib.MarketData({
            marketBaseData: marketBaseData,
            marketState: marketState,
            marketHash: marketHash,
            userState: getUserState(addr, market),
            testMarket: false // only used by MarketLister
        });
    }

    function getMarketBaseDataByMarketHash (bytes32 marketHash)
        public
        view
        returns (DigiOptionsLib.MarketBaseData memory marketBaseData)
    {
        Market storage market = markets[marketHash];
        return market.marketBaseData;
    }

    function getMarketDataListByMarketKeys (
        address addr, // marketData.userState for this address
        bytes32[] calldata marketKeys // marketsContract uses marketHash / marketListerContract uses baseMarketHash
    )
        external
        view
        override
        virtual
        returns (DigiOptionsLib.MarketData[] memory marketDataList)
    {
        marketDataList = new DigiOptionsLib.MarketData[](marketKeys.length);
        uint256 idx;

        for (idx= 0 ; idx < marketKeys.length ; idx++) {
            marketDataList[idx] = getMarketDataByMarketHash(addr, marketKeys[idx]);
        }
        return marketDataList;
    }

    function calcMarketInterval (
        uint40 expirationDatetime
    )
        external
        view
        override
        virtual
        returns (uint8 interval)
    {
        return DigiOptionsLib.calcMarketInterval(expirationDatetime);
    }

    function getUserState (
        address addr,
        Market storage market
    )
        internal
        view
        returns (DigiOptionsLib.UserState userState)
    {
        mapping(uint256 => Position) storage positions = market.positions[addr];

        if (market.marketState.settled){
            Position memory winningPosition = positions[market.marketState.winningOptionID];
            if (
                (winningPosition.rangeState == RANGESTATE_PAYED_OUT) ||
                ((winningPosition.rangeState == RANGESTATE_TRADED) && (winningPosition.value == 0))  // TODO fixme == 0
                ){
                return DigiOptionsLib.UserState.PAYED_OUT;
            }
        }
        // TODO this is not correct for named markets
        for (uint256 optionID = 0; optionID <= market.marketBaseData.strikes.length; optionID++) {
            if (positions[optionID].rangeState > RANGESTATE_NOT_USED) {
                return DigiOptionsLib.UserState.EXISTS;
            }
        }
        return DigiOptionsLib.UserState.NONE;
    }

    function getLiquidityAndPositions (bytes32 marketHash)
        external
        view
        returns (uint256 liquidity, Position[] memory positions, DigiOptionsLib.UserState userState)
    {
        Market storage market = markets[marketHash];
        DigiOptionsLib.MarketBaseData memory marketBaseData = market.marketBaseData;

        // return user's total contract liquidity and positions for selected market
        // TODO this is not correct for named markets
        positions = new Position[](marketBaseData.strikes.length + 1);

        for (uint256 optionID = 0; optionID <= marketBaseData.strikes.length; optionID++) {
            positions[optionID] = market.positions[msg.sender][optionID];
        }
        return (
            liquidityUser[msg.sender],
            positions,
            getUserState(msg.sender, market)
        );
    }

    function liquidityAdd ()
        public
        payable
    {
        if (msg.value > 0) {
            liquidityUser[msg.sender] = liquidityUser[msg.sender].add(msg.value);
            emit LiquidityAddWithdraw(msg.sender, block.timestamp, int256(msg.value));
        }
    }

    function createMarket (
        DigiOptionsLib.MarketBaseData memory marketBaseData,
        bool testMarket,
        FactsignerVerify.Signature memory signature
    )
        public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
        override
        returns (bytes32 marketHash)
    {
        assert(marketBaseData.expirationDatetime != 0);

        { // scope here to safe stack space
        bytes32 factHash = DigiOptionsLib.calcFactHash(marketBaseData);
        require(
            FactsignerVerify.verifyFactsignerMessage(
                factHash,
                signature
            ) == marketBaseData.signerAddr,
            "Signature invalid."
        );

        marketHash = DigiOptionsLib.calcMarketHash(marketBaseData);
        }

        /* Check that the market does not already exists */
        if (markets[marketHash].marketBaseData.expirationDatetime != 0)
            return marketHash;

        assert(marketBaseData.baseUnitExp == 18); // TODO remove this in the future

        assert(marketBaseData.marketCategory < 64); // limit marketCategory (for now)

        // TODO finney
        assert((uint256(marketBaseData.transactionFee0)).add(uint256(marketBaseData.transactionFee1)).add(uint256(marketBaseData.transactionFeeSigner)) <= 50 finney); // max 5%

        uint256 cnt; // TODO rename optionID
        if ((marketBaseData.config & uint8(FactsignerDefines.ConfigMask.ConfigMarketTypeIsStrikedMask)) != 0) {
            /* striked market */
            /* check that we have at least one strike */
            assert(marketBaseData.strikes.length > 0);
            assert(marketBaseData.strikes.length < 32765); // our first optionID is 0

            /* check strikes are ordered */
            for (cnt = 1; cnt < marketBaseData.strikes.length; cnt++) {
                assert(marketBaseData.strikes[cnt-1] < marketBaseData.strikes[cnt]);
            }

            /* check that the final settlement precision high enough for the supplied strikes */
            assert(int16(marketBaseData.baseUnitExp) >= marketBaseData.ndigit);
            for (cnt = 0; cnt < marketBaseData.strikes.length; cnt++) {
                assert((marketBaseData.strikes[cnt] % int256(10**uint256((int256(marketBaseData.baseUnitExp)-marketBaseData.ndigit)))) == 0);
            }
        } else {
            /* named market */
            /* check that we have at least two named ranges */
            assert(marketBaseData.strikes.length > 1);
            assert(marketBaseData.strikes.length <= 32765); // our first optionID is 0
        }
        assert(marketBaseData.marketCategory < 32); // limit marketCategory (for now)

        uint256 existingMarketsBit = (1 << uint256(marketBaseData.marketInterval)) << (marketBaseData.marketCategory * 8);
        if (existingMarkets & existingMarketsBit == 0) {
            existingMarkets = existingMarkets | existingMarketsBit;
        }

        uint8 marketIntervalForEventFilter = DigiOptionsLib.calcMarketInterval(marketBaseData.expirationDatetime);
        if ((marketBaseData.config & uint8(FactsignerDefines.ConfigMask.ConfigIntervalTypeIsUsedMask) != 0)) {
            /* interval used */
            assert(marketBaseData.marketInterval == marketIntervalForEventFilter);
        } else {
            /* interval unused */
            assert(marketBaseData.marketInterval == uint8(FactsignerDefines.MarketInterval.NONE));
        }

        markets[marketHash].marketBaseData = marketBaseData;


        emit MarketCreate(
            marketHash, // marketKey
            ((marketBaseData.expirationDatetime/DigiOptionsLib.getDivider(marketIntervalForEventFilter)) << 8) + marketIntervalForEventFilter,
            marketBaseData.expirationDatetime,
            marketBaseData.marketInterval,
            marketBaseData.marketCategory,
            marketBaseData.underlyingString
        );
        return marketHash;
    }

    function settlement (
        bytes32 marketHash, /* market to settle */
        FactsignerVerify.Signature memory signature,
        int256 value,
        address[] memory users,
        bytes32[] memory offerHash
    )
        public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    {
        Market storage market = markets[marketHash];

        /* anybody with access to the signed value (from signerAddr) can settle the market */

        require(
            FactsignerVerify.verifyFactsignerMessage(
                keccak256(
                    abi.encodePacked(
                        DigiOptionsLib.calcFactHash(market.marketBaseData),
                        value,
                        uint16(FactsignerDefines.SettlementType.FINAL)
                    )
                ),
                signature
            ) == market.marketBaseData.signerAddr,
            "Signature invalid."
        );

        // just return if already settled
        if (market.marketState.settled)
            return;

        uint256 winningOptionID;
        uint256 cnt;
        if ((market.marketBaseData.config & uint8(FactsignerDefines.ConfigMask.ConfigMarketTypeIsStrikedMask)) != 0) {
            /* striked market */
            winningOptionID = market.marketBaseData.strikes.length;
            for (cnt = 0; cnt < market.marketBaseData.strikes.length; cnt++) {
                if (value < market.marketBaseData.strikes[cnt]) {
                    winningOptionID = cnt;
                    break;
                }
            }
        } else {
            /* named market */
            winningOptionID = 0; // default in case nothing matches
            for (cnt = 0; cnt < market.marketBaseData.strikes.length; cnt++) {
                if (value == market.marketBaseData.strikes[cnt]) {
                    winningOptionID = cnt;
                    break;
                }
            }
        }
        // TODO one transaction
        market.marketState.winningOptionID = uint16(winningOptionID);
        market.marketState.settled = true;

        emit MarketSettlement(marketHash);

// TODO handle payout
/*
        // TODO split fee and add fee to feeTaker1, too
        uint256 microOptionsTraded = market.fee.div( // TODO rename
            uint256(market.marketBaseData.transactionFee0).add(uint256(market.marketBaseData.transactionFee1))..add(uint256(marketBaseData.transactionFeeSigner))
        );
        //liquidityUser[market.marketBaseData.feeTaker0] = liquidityUser[market.marketBaseData.feeTaker0].add(market.fee);
*/
        // TODO rename feeT
        uint256 feeT = uint256(market.marketBaseData.transactionFee0).add(uint256(market.marketBaseData.transactionFee1)).add(uint256(market.marketBaseData.transactionFeeSigner));
        if (feeT > 0){ // TODO remove?
            // TODO rename a
            uint256 a = uint256(market.marketState.fee) / feeT;
            liquidityUser[market.marketBaseData.feeTaker0] = liquidityUser[market.marketBaseData.feeTaker0].add(a.mul(market.marketBaseData.transactionFee0));
            liquidityUser[market.marketBaseData.feeTaker1] = liquidityUser[market.marketBaseData.feeTaker1].add(a.mul(market.marketBaseData.transactionFee1));
            liquidityUser[market.marketBaseData.signerAddr] = liquidityUser[market.marketBaseData.signerAddr].add(a.mul(market.marketBaseData.transactionFeeSigner));
        }
/*
        liquidityUser[market.marketBaseData.feeTaker1] = liquidityUser[market.marketBaseData.feeTaker1].add(microOptionsTraded.mul(market.marketBaseData.transactionFee1));

        // emit event once if all users have been payed out
        //emit MarketSettlement(marketHash);
*/

        freeLiquidity(
            marketHash,
            users,
            offerHash // TODO offerHash
        );
    }

    function freeLiquidity(
        bytes32 marketHash,
        address[] memory users,
        bytes32[] memory offerHash
    )
        public
    {
        Market storage market = markets[marketHash];

        DigiOptionsLib.MarketState memory marketState = market.marketState;

        // TODO fetch marketState once
        uint16 winningOptionID = marketState.winningOptionID;
        require(marketState.settled == true, "Market not yet settled.");

        uint256 idx;
        int256 minPosition;
        for (idx = 0; idx < users.length; idx++) {

            address user = users[idx];
            //mapping(uint256 => Position) storage positions = market.positions[user];

            if (getUserState(user, market) != DigiOptionsLib.UserState.PAYED_OUT) {

                minPosition = getMinPosition(
                    market,
                    user
                );

                int256 result = int256(market.positions[user][winningOptionID].value).sub(minPosition);

                market.positions[user][winningOptionID].rangeState = RANGESTATE_PAYED_OUT;
            
                liquidityUser[user] = liquidityUser[user].add(result.mul(ATOMIC_OPTION_PAYOUT_WEI).castToUint());
/*
                emit PositionChange(
                    //uint256(buyer) + uint256(market.userData[msg.sender].state),
                    uint256(buyer),
                    uint256(seller),
                    orderOffer.marketHash,
                    block.timestamp,
                    orderOffer.optionID,
                    orderOffer.pricePerOption,
                    sizeAcceptPossible,
                    offerHash
                );
*/
            }

        }
    }

    function orderExecuteTest (
        OrderOfferSigned memory orderOfferSigned,
        uint256 sizeAccept // TODO rename to sizeAcceptMax?
    )
        public
        view
        returns (
            uint256 sizeAcceptPossible,
            bytes32 offerHash,
            int256 liquidityOfferOwner, // only valid if sizeAcceptPossible > 0
            int256 liquidityOfferTaker, // only valid if sizeAcceptPossible > 0
            uint256 transactionFeeAmount // only valid if sizeAcceptPossible > 0
        )
    {

        OrderOffer memory orderOffer = orderOfferSigned.orderOffer;
        Market storage market = markets[orderOffer.marketHash];

        offerHash = keccak256(
            abi.encodePacked(
                address(this), // this checks that the signature is valid only for this contract
                orderOffer.marketHash,
                orderOffer.optionID,
                orderOffer.buy,
                orderOffer.pricePerOption,
                orderOffer.size,
                orderOffer.offerID,
                orderOffer.blockExpires,
                orderOffer.offerOwner
            )
        );
        if (!(
                (DigiOptionsLib.verifyOffer(
                    offerHash,
                    orderOfferSigned.signature
                ) == orderOffer.offerOwner)
            )) {
            sizeAccept = 0;
            // TODO return immediately?
        }

        if (market.offersAccepted[offerHash].add(sizeAccept) > orderOffer.size)
            sizeAccept = orderOffer.size.sub(market.offersAccepted[offerHash]);

        uint256 value = sizeAccept.mul(orderOffer.pricePerOption);
// TODO precalcuate
        transactionFeeAmount = sizeAccept.mul(
            uint256(market.marketBaseData.transactionFee0).add(uint256(market.marketBaseData.transactionFee1)).add(uint256(market.marketBaseData.transactionFeeSigner))
        );


        liquidityOfferOwner = getLiquidityAfterTrade(
            market,
            orderOffer.buy,
            orderOffer,
            orderOffer.offerOwner,
            sizeAccept,
            value
        );
        liquidityOfferTaker = getLiquidityAfterTrade(
            market,
            !orderOffer.buy,
            orderOffer,
            msg.sender,
            sizeAccept,
            value
        ).sub(transactionFeeAmount.castToInt());

        if (!(
                (orderOffer.optionID <= market.marketBaseData.strikes.length) && // TODO depends on striked or named market?
                (block.number <= orderOffer.blockExpires) &&
                (block.number.add(OFFER_MAX_BLOCKS_INTO_FUTURE) >= orderOffer.blockExpires) &&
                // offerTaker and offerOwner must not be the same (because liquidity is calculated seperately)
                (orderOffer.offerOwner != msg.sender) &&
                (liquidityOfferOwner >= int256(0)) &&
                (liquidityOfferTaker >= int256(0))
            )) {
            sizeAccept = 0;
        }
        return (
            sizeAccept,
            offerHash,
            liquidityOfferOwner, // only valid if sizeAcceptPossible > 0
            liquidityOfferTaker, // only valid if sizeAcceptPossible > 0
            transactionFeeAmount // only valid if sizeAcceptPossible > 0
        );
    }

    function orderExecuteSingle (
        OrderOfferSigned memory orderOfferSigned,
        uint256 sizeAcceptMax /* maximum */
    )
        private
        returns (uint256 sizeAcceptRemain)
    {
        OrderOffer memory orderOffer;

        orderOffer = orderOfferSigned.orderOffer;
        bytes32 offerHash;
        uint256 sizeAcceptPossible;

        Market storage market = markets[orderOffer.marketHash];

        address buyer; // buys options / money giver
        address seller; // sells options / money getter
        if (orderOffer.buy) {
            buyer = orderOffer.offerOwner;
            seller = msg.sender;
        } else {
            buyer = msg.sender;
            seller = orderOffer.offerOwner;
        }

        int256 liquidityOfferOwner; // only valid if sizeAcceptPossible > 0
        int256 liquidityOfferTaker; // only valid if sizeAcceptPossible > 0
        uint256 transactionFeeAmount; // only valid if sizeAcceptPossible > 0
        (
            sizeAcceptPossible,
            offerHash,
            liquidityOfferOwner, // only valid if sizeAcceptPossible > 0
            liquidityOfferTaker, // only valid if sizeAcceptPossible > 0
            transactionFeeAmount // only valid if sizeAcceptPossible > 0
        ) = orderExecuteTest (
            orderOfferSigned,
            sizeAcceptMax
        );
        if (sizeAcceptPossible == 0) {
            return sizeAcceptMax;
        }

        liquidityUser[orderOffer.offerOwner] = liquidityOfferOwner.castToUint();
        liquidityUser[msg.sender] = liquidityOfferTaker.castToUint();
        market.marketState.fee = uint256(market.marketState.fee).add(transactionFeeAmount).castToUint128(); // TODO

        {
        // update positions
        Position memory pos;
        {
            mapping(uint256 => Position) storage positions = market.positions[buyer];
            pos = positions[orderOffer.optionID];
            pos.rangeState = RANGESTATE_TRADED;
            pos.value = int256(pos.value).add(int256(sizeAcceptPossible)).castToInt128();
            positions[orderOffer.optionID] = pos;
        }

        {
            mapping(uint256 => Position) storage positions = market.positions[seller];
            pos = positions[orderOffer.optionID];
            pos.value = int256(pos.value).sub(int256(sizeAcceptPossible)).castToInt128();
            pos.rangeState = RANGESTATE_TRADED;
            positions[orderOffer.optionID] = pos;
        }
        }

        // remember that (some amount of) the offers is taken
        market.offersAccepted[offerHash] = market.offersAccepted[offerHash].add(sizeAcceptPossible);

        emit PositionChange(
            //uint256(buyer) + uint256(market.userData[msg.sender].state),
            uint256(buyer),
            uint256(seller),
            orderOffer.marketHash,
            block.timestamp,
            orderOffer.optionID,
            orderOffer.pricePerOption,
            sizeAcceptPossible,
            offerHash
        );

        return sizeAcceptMax.sub(sizeAcceptPossible);
    }

    // OrderOfferSigned array should contain only sell orders or only buys orders for the same optionID and marketHash (not mixed)
    function orderExecute (
        OrderOfferSigned[] memory orderOfferSignedList,
        uint256 sizeAcceptMax /* maximum for all supplied orderOfferSigned structs */
    )
        public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    {
        OrderOfferSigned memory orderOfferSigned;

        for (uint256 orderOfferIdx=0; orderOfferIdx < orderOfferSignedList.length; orderOfferIdx++) {
            orderOfferSigned = orderOfferSignedList[orderOfferIdx];

            //Market storage market = markets[orderOfferSigned.orderOffer.marketHash];

            sizeAcceptMax = orderExecuteSingle (
                orderOfferSigned,
                sizeAcceptMax
            );
        }
    }

    function getLiquidityAfterTrade(
        Market storage market,
        bool isBuyer,
        OrderOffer memory orderOffer,
        address userAddr,
        uint256 sizeAccept,
        uint256 value
    )
        internal
        view
        returns (int256 _liquidity)
    {
        int256 liquidity = liquidityUser[userAddr].castToInt();
        int256 sizeAccept_;

        if (! isBuyer) {
            liquidity = liquidity.add(value.castToInt()); // seller gets money
            sizeAccept_ = int256(0).sub(sizeAccept.castToInt());
        } else {
            liquidity = liquidity.sub(value.castToInt()); // buyer pays money
            sizeAccept_ = sizeAccept.castToInt();
        }

        int256 minPositionBeforeTrade;
        int256 minPositionAfterTrade;
        (minPositionBeforeTrade, minPositionAfterTrade) = getMinPositionAfterTrade(
            market,
            userAddr,
            orderOffer.optionID,
            sizeAccept_
        );

        liquidity = liquidity.add((minPositionAfterTrade.sub(minPositionBeforeTrade)).mul(ATOMIC_OPTION_PAYOUT_WEI));

        return liquidity;
    }

    function getMinPositionAfterTrade (
        Market storage market,
        address userAddr,
        /* optional to calc the minimal position after a change */
        uint16 optionID,
        int256 positionChange
    ) internal view
        returns (int256 minPositionBeforeTrade_, int256 minPositionAfterTrade_)
    {
        int256 minPositionBeforeTrade = INT256_MAX;
        int256 minPositionAfterTrade = INT256_MAX;

        uint256 length = market.marketBaseData.strikes.length;
        mapping(uint256 => Position) storage positions = market.positions[userAddr];
        int256 position;
        for (uint256 s = 0; s <= length; s++) {

            position = positions[s].value;
            if (position < minPositionBeforeTrade)
                minPositionBeforeTrade = position;

            if (s == optionID)
                position = position.add(positionChange);

            if (position < minPositionAfterTrade)
                minPositionAfterTrade = position;
        }
        return (minPositionBeforeTrade, minPositionAfterTrade);
    }

    function getMinPosition (
        Market storage market,
        address userAddr
    ) internal view
        returns (int256 minPosition_)
    {
        int256 minPosition = INT256_MAX;

        uint256 length = market.marketBaseData.strikes.length;
        mapping(uint256 => Position) storage positions = market.positions[userAddr];
        int256 position;
        for (uint256 s = 0; s <= length; s++) {

            position = positions[s].value;
            if (position < minPosition)
                minPosition = position;

        }
        return (minPosition);
    }

}
