/*
 User Driven Option Markets Contract used by https://www.digioptions.com

 Copyright (c) [www.digioptions.com](https://www.digioptions.com)

 Designed to work with signatures from [www.factsigner.com](https://www.factsigner.com)

 Public repository:
 https://github.com/berlincode/digioptions-contracts.js

 elastic.code@gmail.com
 mail@digioptions.com

*/

pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "./DigiOptionsBaseInterface.sol";
import "./SafeMath.sol";
import "./SafeCast.sol";


contract DigiOptionsMarkets is DigiOptionsBaseInterface {
    using SafeCast for int;
    using SafeCast for uint;
    using SafeMath for uint256;
    using SafeMath for int256;

    uint256 public version = (
        (0 << 32) + /* major */
        (46 << 16) + /* minor */
        1 /* bugfix */
    );

    //each nanoOption is worth 1000000000 wei in case of win,
    // so one whole option is worth 1 ether in case of win
    int256 constant public PAYOUT_PER_NANOOPTION = 1000000000;

    struct UserData { // TODO rename
        UserState state; // just to remember which user was already added
        mapping(uint16 => int256) positions;
    }

    /* we use a simple linked list to sort contracts by expirationDatetime date */
    struct Market {
        bytes32 marketHashPrevious;

        Data data;
        MarketBaseData marketBaseData;
        mapping(address => UserData) userData;

        /* for settlement calculation we need a list of all users */
        address[] users;
        uint256 fee;
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
        Signature signature;
    }

    /* variables */
    mapping(address => uint256) internal liquidityUser;
    Market internal head; /* we use only head.marketHashPrevious */
    mapping(bytes32 => Market) internal markets;

    mapping(bytes32 => uint256) internal offersAccepted; // remember how many options from an offer are already traded
    mapping(address => bytes32[]) internal userMarkets; // keep track which markets a user is invested
    mapping(address => uint32) internal userMarketsIdx;

    event MarketCreate(bytes32 marketHash, uint64 indexed expirationDatetime, bytes32 indexed underlying, uint8 indexed typeDuration);
    event MarketSettlement(bytes32 marketHash);
    // this may result in liquidity change
    event LiquidityAddWithdraw(address indexed addr, uint256 datetime, int256 amount);
    event PositionChange(
        // TODO optimize order for storage density?
        address indexed buyer,
        address indexed seller,
        bytes32 indexed marketHash,
        uint256 datetime, // TODO we might remove this and use info from block
        uint16 optionID,
        uint256 pricePerOption,
        uint256 size,
        bytes32 offerHash
    );

    /* This is the constructor */
    //constructor () public {
    //}

    // default fallback
    function() external payable {
        liquidityAdd();
    }

    function getContractInfo (
    ) external
    returns (
        ContractType contractType,
        uint256 versionMarketLister,
        uint256 versionMarkets,
        address digiOptionsMarketsAddr
    )
    {
        return (
            ContractType.CONTRACT_DIGIOPTIONSMARKETS, // == 1
            0,
            version,
            address(this)
        );
    }

    function liquidityWithdraw (uint256 amount) external {
        require (amount <= liquidityUser[msg.sender], "Not enough liquidity.");
        /* Remember to reduce the liquidity BEFORE */
        /* sending to prevent re-entrancy attacks */
        liquidityUser[msg.sender] = liquidityUser[msg.sender].sub(amount);
        msg.sender.transfer(amount);
        emit LiquidityAddWithdraw(msg.sender, block.timestamp, int256(-amount));
    }

    function getMarketDataList (
        bool filterTestMarkets, // default: true // if true all test markets are filtered out
        bool filterNoTradedMarkets, // default: false // filter out all markets the the uses (msg.sender) has not traded
        uint64 expirationDatetime,
        uint16 len,
        bytes32[] calldata marketHashLast // if list is empty we start at head - otherwise we continue to list after marketHashLast[0]
    )
        external
        view
        returns (MarketData[] memory marketList)
    {
        Market memory market;
        marketList = new MarketData[](len);
        uint256 idx = 0;

        if (marketHashLast.length == 0) {
            market = head;
        } else {
            market = markets[marketHashLast[0]];
        }

        MarketData memory marketDataPrev = getMarketData(market.marketHashPrevious);

        while (
            (idx < len) &&
            (marketDataPrev.marketBaseData.expirationDatetime > 0) &&
            (marketDataPrev.marketBaseData.expirationDatetime >= expirationDatetime)
        ) {
            if (!
                (
                    //(filterTestMarkets && marketDataPrev.testMarket) ||
                    (filterNoTradedMarkets && (marketDataPrev.userState != UserState.USER_NONE))
                )) {
                marketList[idx] = marketDataPrev;
                idx++;
            }
            market = markets[market.marketHashPrevious];
            marketDataPrev = getMarketData(market.marketHashPrevious);
        }
        return marketList;
    }

    function getLiquidityAndPositions (bytes32 marketHash)
        external
        view
        returns (uint256 liquidity, int256[] memory positions, UserState userState)
    {
        // return user's total contract liquidity and positions for selected market
        int256[] memory positionsOptionID = new int256[](markets[marketHash].marketBaseData.strikes.length + 1);
        for (uint16 optionID = 0; optionID <= markets[marketHash].marketBaseData.strikes.length; optionID++) {
            positionsOptionID[optionID] = markets[marketHash].userData[msg.sender].positions[optionID];
        }
        return (liquidityUser[msg.sender], positionsOptionID, markets[marketHash].userData[msg.sender].state);
    }

    function getNumUsersToPayout(
        bytes32 marketHash
    )
        external
        view
        returns (uint256 numUsersToPayout)
    {
        return markets[marketHash].users.length;
    }

    function calcTypeDuration (
        uint64 expirationDatetime
    ) public view
    returns (uint8 factHash)
    {
        uint8 typeDuration = 5;
        uint256 secondsUntilExpiration = uint256(expirationDatetime).sub(uint256(block.timestamp));
        if (secondsUntilExpiration > 3888000) // > 45 days
            typeDuration = 0;
        else if (secondsUntilExpiration > 8 * 24 * 60 * 60) // > 9 days
            typeDuration = 1;
        else if (secondsUntilExpiration > 36 * 60 * 60) // > 36 hours
            typeDuration = 2;
        else if (secondsUntilExpiration > 2 * 60 * 60) // > 2 hours
            typeDuration = 3;
        else if (secondsUntilExpiration > 15 * 60) // > 15 min
            typeDuration = 4;

        return typeDuration;
    }

    function liquidityAdd () public payable {
        if (msg.value > 0) {
            liquidityUser[msg.sender] = liquidityUser[msg.sender].add(msg.value);
            emit LiquidityAddWithdraw(msg.sender, block.timestamp, int256(msg.value));
        }
    }

    function createMarket (
        MarketBaseData memory marketBaseData,
        bool testMarket,
        Signature memory signature
    ) public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    returns (bytes32 _marketHash)
    {
        assert(marketBaseData.expirationDatetime != 0);

        require(
            verify(
                calcFactHash(marketBaseData),
                signature
            ) == marketBaseData.signerAddr,
            "Signature invalid."
        );

        assert(marketBaseData.typeDuration == calcTypeDuration(marketBaseData.expirationDatetime));

        bytes32 marketHash = keccak256(
            abi.encodePacked(
                marketBaseData.baseUnitExp, /* e.g. 18 -> baseUnit = 10**18 = 1000000000000000000 */
                marketBaseData.underlying, /* 'name' ascii encoded string as bytes32 */
                marketBaseData.ndigit, /* 'ndigit' number of digits (may be negative) */
                marketBaseData.objectionPeriod, /* e.g. 3600 seconds */
                marketBaseData.expirationDatetime, /* 'settlement' unix epoch seconds UTC */

                marketBaseData.typeDuration,
                marketBaseData.feeTaker0,
                marketBaseData.feeTaker1,
                marketBaseData.signerAddr, /* address used to check the signed result (e.g. of factsigner) */

                marketBaseData.transactionFee0, /* fee in wei for every ether of value (payed by orderTaker) */
                marketBaseData.transactionFee1, /* fee in wei for every ether of value (payed by orderTaker) */
                marketBaseData.strikes
            )
        );

        /* Check that the market does not already exists */
        if (markets[marketHash].marketBaseData.expirationDatetime != 0)
            return marketHash;

        assert(marketBaseData.baseUnitExp == 18); // TODO remove this in the future

        /* check that we have at least one strike */
        assert(marketBaseData.strikes.length > 0);
        assert(marketBaseData.strikes.length <= 32765); // our first optionID is 0
        assert((uint256(marketBaseData.transactionFee0)).add(uint256(marketBaseData.transactionFee1)) <= 50 finney); // max 5%

        /* check strikes are ordered */
        uint16 cnt;
        for (cnt = 1; cnt < marketBaseData.strikes.length; cnt++) {
            assert(marketBaseData.strikes[cnt-1] < marketBaseData.strikes[cnt]);
        }

        /* check that the final settlement precision high enough for the supplied strikes */
        assert(int16(marketBaseData.baseUnitExp) >= marketBaseData.ndigit);
        for (cnt = 0; cnt < marketBaseData.strikes.length; cnt++) {
            assert((marketBaseData.strikes[cnt] % int256(10**uint256((int256(marketBaseData.baseUnitExp)-marketBaseData.ndigit)))) == 0);
        }

        /* find the right place to insert */
        Market storage market = head;
        while (markets[market.marketHashPrevious].marketBaseData.expirationDatetime > marketBaseData.expirationDatetime) {
            market = markets[market.marketHashPrevious];
        }

        /* using memory for struct before commiting to storage */
        Market memory newMarket;
        newMarket.marketHashPrevious = market.marketHashPrevious;

        newMarket.data = Data(
            {
            // winningOptionID is only valid if settled == true
            winningOptionID: 0,
            settled: false
            }
        );

        newMarket.marketBaseData = marketBaseData;

        /* insert */
        markets[marketHash] = newMarket;
        market.marketHashPrevious = marketHash;

        emit MarketCreate(
            marketHash,
            marketBaseData.expirationDatetime,
            marketBaseData.underlying,
            marketBaseData.typeDuration
        );
        return marketHash;
    }

    /* returns all relevant market data - if marketHash does not exist marketBaseData.expirationDatetime is 0*/
    function getMarketData (bytes32 marketHash)
        public
        view
        returns (MarketData memory marketData)
    {
        Market storage market = markets[marketHash];
        return MarketData({
            marketBaseData: market.marketBaseData,
            data: market.data,
            marketHash: marketHash,
            userState: market.userData[msg.sender].state,
            testMarket: false // only used by MarketLister
        });
    }

    function calcFactHash (
        MarketBaseData memory marketBaseData
    ) public pure // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    returns (bytes32 factHash)
    {
        return keccak256(
            abi.encodePacked(
                marketBaseData.baseUnitExp, /* e.g. 18 -> baseUnit = 10**18 = 1000000000000000000 */
                marketBaseData.underlying, /* 'name' ascii encoded string as bytes32 */
                marketBaseData.ndigit, /* 'ndigit' number of digits (may be negative) */
                marketBaseData.objectionPeriod, /* e.g. 3600 seconds */
                marketBaseData.expirationDatetime /* 'settlement' unix epoch seconds UTC */
            )
        );
    }

    function settlement (
        bytes32 marketHash, /* market to settle */
        Signature memory signature,
        int256 value,
        uint256 maxNumUsersToPayout
    ) public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    {
        Market storage market = markets[marketHash];

        /* anybody with access to the signed value (from signerAddr) can settle the market */

        require(
            verify(
                keccak256(
                    abi.encodePacked(
                        calcFactHash(market.marketBaseData),
                        value,
                        uint16(0) // signature type: signature_final == 0
                    )
                ),
                signature
            ) == markets[marketHash].marketBaseData.signerAddr,
            "Signature invalid."
        );

        // just return if already settled
        if (markets[marketHash].data.settled)
            return;

        uint16 winningOptionID = uint16(market.marketBaseData.strikes.length);
        for (uint16 cnt = 0; cnt < market.marketBaseData.strikes.length; cnt++) {
            if (value < market.marketBaseData.strikes[cnt]) {
                winningOptionID = cnt;
                break;
            }
        }
        markets[marketHash].data.winningOptionID = winningOptionID;
        markets[marketHash].data.settled = true;

        if ((markets[marketHash].users.length == 0)) {
            // emit event once
            emit MarketSettlement(marketHash);
        } else {
            // TODO remove this function and call settlement separately?
            settlementPayOut(
                marketHash,
                maxNumUsersToPayout
            );
	}
    }

    function settlementPayOut(
        bytes32 marketHash,
        uint256 maxNumUsersToPayout
    ) public // TODO make external (later)
    {
        Market storage market = markets[marketHash];
        uint16 winningOptionID = markets[marketHash].data.winningOptionID;
        require(markets[marketHash].data.settled == true, "Market not yet settled.");

        uint256 idx;
        for (idx = 0; idx < maxNumUsersToPayout; idx++) {
            if (markets[marketHash].users.length == 0)
                break;

            address user = market.users[market.users.length - 1];
            market.users.length -= 1;

            int256 minPosition;
            int256 minPositionAfterTrade;
            (minPosition, minPositionAfterTrade) = getMinPosition(
                marketHash,
                user,
                0,
                0
            );

            int256 result = market.userData[user].positions[winningOptionID].sub(minPosition);

            market.userData[user].state = UserState.USER_PAYED_OUT;
            liquidityUser[user] = liquidityUser[user].add(result.mul(PAYOUT_PER_NANOOPTION).castToUint());
        }
        if ((idx > 0) && (markets[marketHash].users.length == 0)) {
            // TODO split fee and add fee to feeTaker1, too
            liquidityUser[market.marketBaseData.feeTaker0] = liquidityUser[market.marketBaseData.feeTaker0].add(market.fee);
            // emit event once if all users have been payed out
            emit MarketSettlement(marketHash);
        }
    }

    function orderExecuteTest (
        OrderOfferSigned memory orderOfferSigned,
        uint256 sizeAccept // TODO rename to sizeAcceptMax?
    ) public view returns (
        uint256 sizeAcceptPossible,
        bytes32 offerHash,
        int256 liquidityOfferOwner, // only valid if sizeAcceptPossible > 0
        int256 liquidityOfferTaker, // only valid if sizeAcceptPossible > 0
        uint256 transactionFeeAmount // only valid if sizeAcceptPossible > 0
    )
    {
        OrderOffer memory orderOffer = orderOfferSigned.orderOffer;
        bytes32 offerHash_ = keccak256(
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
        if (offersAccepted[offerHash_].add(sizeAccept) > orderOffer.size)
            sizeAccept = orderOffer.size.sub(offersAccepted[offerHash_]);

        uint256 value = sizeAccept.mul(orderOffer.pricePerOption);
        uint256 transactionFeeAmount_ = value.mul(
            uint256(markets[orderOffer.marketHash].marketBaseData.transactionFee0).add(uint256(markets[orderOffer.marketHash].marketBaseData.transactionFee1))
        ).div(1 ether);

        liquidityOfferOwner = getLiquidityAfterTrade(
            orderOffer.buy,
            orderOffer,
            orderOffer.offerOwner,
            sizeAccept,
            value
        );
        liquidityOfferTaker = getLiquidityAfterTrade(
            !orderOffer.buy,
            orderOffer,
            msg.sender,
            sizeAccept,
            value
        ).sub(transactionFeeAmount_.castToInt());

        if (!(
                (verify(
                    offerHash_,
                    orderOfferSigned.signature
                ) == orderOffer.offerOwner) &&
                (orderOffer.optionID <= markets[orderOffer.marketHash].marketBaseData.strikes.length) &&
                (block.number <= orderOffer.blockExpires) &&
                (block.number.add(12) >= orderOffer.blockExpires) &&
                // offerTaker and offerOwner must not be the same (because liquidity is calculated seperately)
                (orderOffer.offerOwner != msg.sender) &&
                (liquidityOfferOwner >= int256(0)) &&
                (liquidityOfferTaker >= int256(0))
            )) {
            sizeAccept = 0;
        }
        return (
            sizeAccept,
            offerHash_,
            liquidityOfferOwner, // only valid if sizeAcceptPossible > 0
            liquidityOfferTaker, // only valid if sizeAcceptPossible > 0
            transactionFeeAmount_ // only valid if sizeAcceptPossible > 0
        );
    }

    // OrderOfferSigned array should contain only sell orders or only buys orders for the same optionID an marketHash (not mixed)
    function orderExecute (
        OrderOfferSigned[] memory orderOfferSignedList,
        uint256 sizeAcceptMax /* maximum for all supplied orderOfferSigned structs */
    ) public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    {
        uint256 sizeAcceptMax_ = sizeAcceptMax;

        for (uint256 orderOfferIdx=0; orderOfferIdx < orderOfferSignedList.length; orderOfferIdx++) {
            OrderOffer memory orderOffer = orderOfferSignedList[orderOfferIdx].orderOffer;
            bytes32 offerHash;
            uint256 sizeAcceptPossible;

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
                orderOfferSignedList[orderOfferIdx],
                sizeAcceptMax_
            );
            if (sizeAcceptPossible != 0) {

                liquidityUser[orderOffer.offerOwner] = liquidityOfferOwner.castToUint();
                liquidityUser[msg.sender] = liquidityOfferTaker.castToUint();
                markets[orderOffer.marketHash].fee = markets[orderOffer.marketHash].fee.add(transactionFeeAmount); // TODO

                // update positions
                markets[orderOffer.marketHash].userData[buyer].positions[orderOffer.optionID] =
                    markets[orderOffer.marketHash].userData[buyer].positions[orderOffer.optionID].add(int256(sizeAcceptPossible));
                markets[orderOffer.marketHash].userData[seller].positions[orderOffer.optionID] =
                    markets[orderOffer.marketHash].userData[seller].positions[orderOffer.optionID].sub(int256(sizeAcceptPossible));

                // remember that (some amount of) the offers is taken
                offersAccepted[offerHash] = offersAccepted[offerHash].add(sizeAcceptPossible);

                // remember user for final settlement calculation
                if (markets[orderOffer.marketHash].userData[msg.sender].state== UserState.USER_NONE) {
                    markets[orderOffer.marketHash].userData[msg.sender].state = UserState.USER_EXISTS;
                    markets[orderOffer.marketHash].users.push(msg.sender);
                    userMarkets[msg.sender].push(orderOffer.marketHash);
                }
                if (markets[orderOffer.marketHash].userData[orderOffer.offerOwner].state == UserState.USER_NONE) {
                    markets[orderOffer.marketHash].userData[orderOffer.offerOwner].state = UserState.USER_EXISTS;
                    markets[orderOffer.marketHash].users.push(orderOffer.offerOwner);
                    userMarkets[orderOffer.offerOwner].push(orderOffer.marketHash);
                }

                emit PositionChange(
                    buyer,
                    seller,
                    orderOffer.marketHash,
                    block.timestamp,
                    orderOffer.optionID,
                    orderOffer.pricePerOption,
                    sizeAcceptPossible,
                    offerHash
                );

                sizeAcceptMax_ = sizeAcceptMax_.sub(sizeAcceptPossible);
            }
        }
    }

    function getLiquidityAfterTrade(
        bool isBuyer,
        OrderOffer memory orderOffer,
        address userAddr,
        uint256 sizeAccept,
        uint256 value
    ) internal view
        returns (
        int256 _liquidity
    )
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
        (minPositionBeforeTrade, minPositionAfterTrade) = getMinPosition(
            orderOffer.marketHash,
            userAddr,
            orderOffer.optionID,
            sizeAccept_
        );

        liquidity = liquidity.add((minPositionAfterTrade.sub(minPositionBeforeTrade)).mul(PAYOUT_PER_NANOOPTION));

        return liquidity;
    }

    function getMinPosition (
        bytes32 marketHash,
        address userAddr,
        /* optional to calc the minimal position after a change */
        uint16 optionID,
        int256 positionChange
    ) internal view returns (int256 minPositionBeforeTrade_, int256 minPositionAfterTrade_)
    {
        int256 minPositionBeforeTrade = int256(~((uint256(1) << 255))); // INT256_MAX
        int256 minPositionAfterTrade = int256(~((uint256(1) << 255))); // INT256_MAX

        for (uint16 s = 0; s <= markets[marketHash].marketBaseData.strikes.length; s++) {

            int256 position = markets[marketHash].userData[userAddr].positions[s];
            if (position < minPositionBeforeTrade)
                minPositionBeforeTrade = position;

            if (s == optionID)
                position = position.add(positionChange);

            if (position < minPositionAfterTrade)
                minPositionAfterTrade = position;
        }
        return (minPositionBeforeTrade, minPositionAfterTrade);
    }

    /* internal functions */
    function verify(
        bytes32 message,
        Signature memory signature
    ) internal pure returns (address addr)
    {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(
            abi.encodePacked(
                prefix,
                message
            )
        );
        address signer = ecrecover(
            prefixedHash,
            signature.v,
            signature.r,
            signature.s
        );
        return signer;
    }

}
