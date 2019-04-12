/*
 User Driven Option Markets Contract used by https://www.digioptions.com

 Version 0.41.2

 Copyright (c) [www.digioptions.com](https://www.digioptions.com)

 Designed to work with signatures from [www.factsigner.com](https://www.factsigner.com)

 Public repository:
 https://github.com/berlincode/digioptions-contracts.js

 elastic.code@gmail.com
 mail@digioptions.com

*/

import "./SafeMath.sol";
import "./SafeCast.sol";

pragma solidity 0.5.6;
pragma experimental ABIEncoderV2;


contract DigiOptions {
    using SafeCast for int;
    using SafeCast for uint;
    using SafeMath for uint256;
    using SafeMath for int256;

    /* public variables / constants */
    uint256 public constant CONTRACT_VERSION = (
        (0 << 32) + /* major */
        (42 << 16) + /* minor */
        2 /* bugfix */
    );
    //each nanoOption is worth 1000000000 wei in case of win,
    // so one whole option is worth 1 ether in case of win
    int256 constant public PAYOUT_PER_NANOOPTION = 1000000000;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    enum UserState {USER_NONE, USER_EXISTS, USER_PAYED_OUT}

    struct UserData { // TODO rename
        UserState state; // just to remember which user was already added
        mapping(uint16 => int256) positions;
        uint256 feePayed;
    }

    struct MarketBaseData {
        /* constant core market data, part of marketFactHash calculation */

        bytes32 underlying;
        uint64 expirationDatetime; /* used for sorting contracts */
        int8 ndigit;
        uint8 baseUnitExp;
        uint32 objectionPeriod; /* e.g. 3600 seconds */
        int256[] strikes;
        uint256 transactionFee; /* fee in wei for every ether of value (payed by orderTaker) */

        address signerAddr; /* address used to check the signed result (e.g. of factsigner) */
    }

    struct MarketData {
        MarketBaseData marketBaseData;
        Data data;
        bytes32 marketFactHash;
        UserState userState;
    }

    struct Data {
        /* winningOptionID is only valid if settled == true */
        uint16 winningOptionID;
        bool settled;
        bool testMarket;
        uint8 typeDuration;
    }

    /* we use a simple linked list to sort contracts by expirationDatetime date */
    struct Market {
        bytes32 previous;

        Data data;
        MarketBaseData marketBaseData;
        mapping(address => UserData) userData;

        /* for settlement calculation we need a list of all users */
        address[] users;
    }

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct OrderOffer {
        bytes32 marketFactHash;
        uint16 optionID;
        bool buy; // does the offer owner want to buy or sell options
        uint256 pricePerOption;
        uint256 size;
        uint256 orderID;
        uint256 blockExpires;
        address offerOwner;
    }

    struct OrderOfferSigned {
        OrderOffer orderOffer;
        Signature signature;
    }

    /* variables */
    mapping(address => uint256) internal liquidityUser;
    Market internal head; /* we use only head.previous */
    mapping(bytes32 => Market) internal markets;

    mapping(bytes32 => uint256) internal offersAccepted; // remember how many options from an offer are already traded
    mapping(address => bytes32[]) internal userMarkets; // keep track which markets a user is invested
    mapping(address => uint32) internal userMarketsIdx;

    event MarketCreate(bytes32 marketFactHash, bytes32 indexed underlying, uint8 indexed typeDuration);
    event MarketSettlement(bytes32 marketFactHash);
    // this may result in liquidity change
    event LiquidityAddWithdraw(address indexed addr, uint256 datetime, int256 amount);
    event PositionChange(
        address indexed addr,
        bytes32 indexed marketFactHash,
        uint256 datetime,
        bool buy,
        uint16 optionID,
        uint256 pricePerOption,
        uint256 size,
        bytes32 offerHash
    );

    /* This is the constructor */
    constructor () public {
        owner = msg.sender;
    }

    // default fallback
    function() external payable {
        liquidityAdd();
    }

    function liquidityWithdraw (uint256 amount) external {
        require (amount <= liquidityUser[msg.sender], "Not enough liquidity.");
        /* Remember to reduce the liquidity BEFORE */
        /* sending to prevent re-entrancy attacks */
        liquidityUser[msg.sender] = liquidityUser[msg.sender].sub(amount);
        msg.sender.transfer(amount);
        emit LiquidityAddWithdraw(msg.sender, block.timestamp, int256(-amount));
    }

    function createMarket (
        MarketBaseData memory marketBaseData,
        bool testMarket,
        Signature memory signature
    ) public
    onlyOwner // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    returns (bytes32 _marketFactHash)
    {
        bytes32 marketFactHash = keccak256(
            abi.encodePacked(
                /* sorted alphabetically */
                marketBaseData.baseUnitExp, /* e.g. 18 -> baseUnit = 10**18 = 1000000000000000000 */
                marketBaseData.underlying, /* 'name' ascii encoded string as bytes32 */
                marketBaseData.ndigit, /* 'ndigit' number of digits (may be negative) */
                marketBaseData.objectionPeriod, /* e.g. 3600 seconds */
                marketBaseData.expirationDatetime /* 'settlement' unix epoch seconds UTC */
            )
        );

        /* Check that the market does not already exists */
        require(markets[marketFactHash].marketBaseData.expirationDatetime == 0, "Market already exists.");

        assert(marketBaseData.expirationDatetime != 0);

        require(
            verify(
                marketFactHash,
                signature
            ) == marketBaseData.signerAddr,
            "Signature invalid."
        );

        Market storage market = head;
        Market storage previous = markets[market.previous];

        /* check that we have at least one strike */
        assert(marketBaseData.strikes.length > 0);

        assert(marketBaseData.baseUnitExp == 18); // TODO remove this in the future

        assert(marketBaseData.strikes.length <= 32765); // our first optionID is 0

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
        while (previous.marketBaseData.expirationDatetime > marketBaseData.expirationDatetime) {
            market = previous;
            previous = markets[market.previous];
        }
        uint8 typeDuration = 5;
        uint256 secondsUntilExpiration = uint256(marketBaseData.expirationDatetime).sub(uint256(block.timestamp));
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

        /* using memory for struct before commiting to storage */
        Market memory newMarket;
        newMarket.previous = market.previous; /* marketFactHash previous */

        newMarket.data = Data({
            testMarket: testMarket,
            // winningOptionID is only valid if settled == true
            winningOptionID: 0,
            settled: false,
            typeDuration: typeDuration//,
            //feePayed: 0
        });

        newMarket.marketBaseData = marketBaseData;

        /* insert */
        markets[marketFactHash] = newMarket;
        market.previous = marketFactHash;

        emit MarketCreate(marketFactHash, marketBaseData.underlying, typeDuration);
        return marketFactHash;
    }

    function getMarketDataList (
        bool filterTestMarkets, // default: true // if true all test markets are filtered out
        bool filterNoTradedMarkets, // default: false // filter out all markets the the uses (msg.sender) has not traded
        uint64 expirationDatetime,
        uint16 len,
        bytes32[] calldata marketFactHashLast // if list is empty we start at head - otherwise we continue to list after marketFactHashLast[0]
    )
        external
        view
        returns (MarketData[] memory marketList)
    {
        Market memory market;
        marketList = new MarketData[](len);
        uint256 idx = 0;

        if (marketFactHashLast.length == 0) {
            market = head;
        } else {
            market = markets[marketFactHashLast[0]];
        }

        while (
            (idx < len) &&
            (markets[market.previous].marketBaseData.expirationDatetime > 0) &&
            (markets[market.previous].marketBaseData.expirationDatetime >= expirationDatetime)
        ) {
            if (!
                (
                    (filterTestMarkets && markets[market.previous].data.testMarket) ||
                    (filterNoTradedMarkets && (markets[market.previous].userData[msg.sender].state != UserState.USER_NONE))
                )) {
                marketList[idx] = getMarketData(market.previous);
                idx++;
            }
            market = markets[market.previous];
        }
        return marketList;
    }

    function setTestMarket (bytes32 marketFactHash, bool testMarket) public onlyOwner {
        markets[marketFactHash].data.testMarket = testMarket;
    }

    function liquidityAdd () public payable {
        if (msg.value > 0) {
            liquidityUser[msg.sender] = liquidityUser[msg.sender].add(msg.value);
            emit LiquidityAddWithdraw(msg.sender, block.timestamp, int256(msg.value));
        }
    }

    function getLiquidityAndPositions (bytes32 marketFactHash, address user)
        external
        view
        returns (uint256 liquidity, int256[] memory positions, UserState userState)
    {
        // return user's total contract liquidity and positions for selected market
        int256[] memory positionsOptionID = new int256[](markets[marketFactHash].marketBaseData.strikes.length + 1);
        for (uint16 optionID = 0; optionID <= markets[marketFactHash].marketBaseData.strikes.length; optionID++) {
            positionsOptionID[optionID] = markets[marketFactHash].userData[user].positions[optionID];
        }
        return (liquidityUser[user], positionsOptionID, markets[marketFactHash].userData[user].state);
    }

    /* returns all relevant market data */
    function getMarketData (bytes32 marketFactHash)
        public
        view
        returns (MarketData memory marketData)
    {
        Market storage market = markets[marketFactHash];
        return MarketData({
            marketBaseData: market.marketBaseData,
            data: market.data,
            marketFactHash: marketFactHash,
            userState: market.userData[msg.sender].state // TODO not (yet) used - can maybe removed?
        });
    }

    function settlement (
        bytes32 marketFactHash, /* market to settle */
        Signature memory signature,
        int256 value,
        uint256 maxNumUsersToPayout
    ) public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    {
        require(markets[marketFactHash].data.settled == false, "Market already settled.");

        /* anybody with access to the signed value (from signerAddr) can settle the market */
        require(
            verify(
                keccak256(
                    abi.encodePacked(
                        marketFactHash,
                        value,
                        uint16(0) // signature type: signature_final == 0
                    )
                ),
                signature
            ) == markets[marketFactHash].marketBaseData.signerAddr,
            "Signature invalid."
        );

        Market storage market = markets[marketFactHash];
        uint16 winningOptionID = uint16(market.marketBaseData.strikes.length);
        for (uint16 cnt = 0; cnt < market.marketBaseData.strikes.length; cnt++) {
            if (value < market.marketBaseData.strikes[cnt]) {
                winningOptionID = cnt;
                break;
            }
        }
        markets[marketFactHash].data.winningOptionID = winningOptionID;
        markets[marketFactHash].data.settled = true;

        if ((markets[marketFactHash].users.length == 0)) {
            // emit event once
            emit MarketSettlement(marketFactHash);
        } else {
            // TODO remove this function and call settlement separately?
            settlementPayOut(
                marketFactHash,
                maxNumUsersToPayout
            );
	}
    }

    function getNumUsersToPayout(
        bytes32 marketFactHash
    )
        external
        view
        returns (uint256 numUsersToPayout)
    {
        return markets[marketFactHash].users.length;
    }

    function settlementPayOut(
        bytes32 marketFactHash,
        uint256 maxNumUsersToPayout
    ) public // TODO make external (later)
    {
        Market storage market = markets[marketFactHash];
        uint16 winningOptionID = markets[marketFactHash].data.winningOptionID;
        require(markets[marketFactHash].data.settled == true, "Market not yet settled.");

        uint256 idx;
        for (idx = 0; idx < maxNumUsersToPayout; idx++) {
            if (markets[marketFactHash].users.length == 0)
                break;

            address user = market.users[market.users.length - 1];
            market.users.length -= 1;

            int256 minPosition;
            int256 minPositionAfterTrade;
            (minPosition, minPositionAfterTrade) = getMinPosition(
                marketFactHash,
                user,
                0,
                0
            );

            int256 result = market.userData[user].positions[winningOptionID].sub(minPosition);

            market.userData[user].state = UserState.USER_PAYED_OUT;
            liquidityUser[user] = liquidityUser[user].add(result.mul(PAYOUT_PER_NANOOPTION).castToUint());
        }
        if ((idx > 0) && (markets[marketFactHash].users.length == 0)) {
            // emit event once if all users have been payed out
            emit MarketSettlement(marketFactHash);
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
                orderOffer.marketFactHash,
                orderOffer.optionID,
                orderOffer.buy,
                orderOffer.pricePerOption,
                orderOffer.size,
                orderOffer.orderID,
                orderOffer.blockExpires,
                orderOffer.offerOwner
            )
        );
        if (offersAccepted[offerHash_].add(sizeAccept) > orderOffer.size)
            sizeAccept = orderOffer.size.sub(offersAccepted[offerHash_]);

        uint256 value = sizeAccept.mul(orderOffer.pricePerOption);
        uint256 transactionFeeAmount_ = value.mul(markets[orderOffer.marketFactHash].marketBaseData.transactionFee).div(1 ether);

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
                (orderOffer.optionID <= markets[orderOffer.marketFactHash].marketBaseData.strikes.length) &&
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
            orderOffer.marketFactHash,
            userAddr,
            orderOffer.optionID,
            sizeAccept_
        );

        liquidity = liquidity.add((minPositionAfterTrade.sub(minPositionBeforeTrade)).mul(PAYOUT_PER_NANOOPTION));

        return liquidity;
    }

    // OrderOfferSigned array should contain only sell orders or only buys orders for the same optionID an marketFactHash (not mixed)
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
                liquidityUser[owner] = liquidityUser[owner].add(transactionFeeAmount);

                // update positions
                markets[orderOffer.marketFactHash].userData[buyer].positions[orderOffer.optionID] =
                    markets[orderOffer.marketFactHash].userData[buyer].positions[orderOffer.optionID].add(int256(sizeAcceptPossible));
                markets[orderOffer.marketFactHash].userData[seller].positions[orderOffer.optionID] =
                    markets[orderOffer.marketFactHash].userData[seller].positions[orderOffer.optionID].sub(int256(sizeAcceptPossible));

                // remember that (some amount of) the offers is taken
                offersAccepted[offerHash] = offersAccepted[offerHash].add(sizeAcceptPossible);

                // remember user for final settlement calculation
                if (markets[orderOffer.marketFactHash].userData[msg.sender].state== UserState.USER_NONE) {
                    markets[orderOffer.marketFactHash].userData[msg.sender].state = UserState.USER_EXISTS;
                    markets[orderOffer.marketFactHash].users.push(msg.sender);
                    userMarkets[msg.sender].push(orderOffer.marketFactHash);
                }
                if (markets[orderOffer.marketFactHash].userData[orderOffer.offerOwner].state == UserState.USER_NONE) {
                    markets[orderOffer.marketFactHash].userData[orderOffer.offerOwner].state = UserState.USER_EXISTS;
                    markets[orderOffer.marketFactHash].users.push(orderOffer.offerOwner);
                    userMarkets[orderOffer.offerOwner].push(orderOffer.marketFactHash);
                }

                emit PositionChange(
                    buyer,
                    orderOffer.marketFactHash,
                    block.timestamp,
                    true, // buy
                    orderOffer.optionID,
                    orderOffer.pricePerOption,
                    sizeAcceptPossible,
                    offerHash
                );
                emit PositionChange(
                    seller,
                    orderOffer.marketFactHash,
                    block.timestamp,
                    false, // buy
                    orderOffer.optionID,
                    orderOffer.pricePerOption,
                    sizeAcceptPossible,
                    bytes32(0)
                );

                sizeAcceptMax_ = sizeAcceptMax_.sub(sizeAcceptPossible);
            }
        }
    }

    function getMinPosition (
        bytes32 marketFactHash,
        address userAddr,
        /* optional to calc the minimal position after a change */
        uint16 optionID,
        int256 positionChange
    ) internal view returns (int256 minPositionBeforeTrade_, int256 minPositionAfterTrade_)
    {
        int256 minPositionBeforeTrade = int256(~((uint256(1) << 255))); // INT256_MAX
        int256 minPositionAfterTrade = int256(~((uint256(1) << 255))); // INT256_MAX

        for (uint16 s = 0; s <= markets[marketFactHash].marketBaseData.strikes.length; s++) {

            int256 position = markets[marketFactHash].userData[userAddr].positions[s];
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
