/*
 Digital Option Exchange Contract used by https://www.digioptions.com

 Get the most recent version from: https://www.digioptions.com/digioptions.sol.txt

 Version 0.22.0

 Copyright (c) digioptions.com (http://www.digioptions.com)

 Designed to work with signatures from https://factsigner.com

*/

pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;


contract DigioptionsMarkets {

    enum State {USER_NONE, USER_EXISTS, USER_PAYED_OUT}
    //each option is worth 1000000000 wei in case of win
    uint256 constant PAYOUT_PER_OPTION = 1000000000;

    struct Position {
        State state; // just to remember which user was alweday added
        // TODO rename positions to e.g. rangePos?
        mapping(uint16 => int256) positions; // TODO maybe list is cheaper?
    }

    // TODO reorder to save space/gas
    struct MarketBaseData {
        /* constant core market data - part of marketFactHash calculation */
        /* order is important for signature generation/check */

        bytes32 underlying;
        uint64 expirationDatetime; /* used for sorting contracts */
        int8 ndigit;
        uint8 baseUnitExp;
        uint32 objectionPeriod; /* e.g. 3600 seconds */
        int256[] strikes;
        uint256 transactionFee; /* currently not used */

        address signerAddr; /* address used to check the signed result (e.g. of realitykeys) */
    }

    struct MarketData {
        MarketBaseData marketBaseData;
        int16 winningOptionID;
        bytes32 marketFactHash;
        State state;
    }

    /* we use a simple linked list to sort contracts by expirationDatetime date */
    struct Market {
        bytes32 previous;
        bool testMarket;

        /* on market settlement winningOptionID is set to a value >= 0 */
        int16 winningOptionID;

        MarketBaseData marketBaseData;
        mapping(address => Position) userState;

        /* for settlement calculation we need a list of all users */
        address[] users;
//        mapping(address => State) userState; // just to remember which user was alweday added
    }

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct OrderOffer {
        bytes32 marketFactHash;
        uint16 optionID;
        uint256 pricePerOption;
        int256 size;
        uint256 orderID;
        uint256 blockExpires;
        address addr;// TODO rename orderOwnerAddr?
    }

    struct OrderOfferSigned {
        OrderOffer orderOffer;
        Signature signature;
    }

    /* variables */
    address public ownerAddr;
    mapping(address => uint256) liquidityUser;
    Market head; /* we use only head.previous */
    mapping(bytes32 => Market) markets;

    mapping(bytes32 => int256) offersAccepted; // remember how many options from an offer are already traded

    event MarketCreate(bytes32 marketFactHash);
    event MarketSettlement(bytes32 marketFactHash);
    // this may result in liquidity change
    event PositionChange(address indexed addr, bytes32 indexed marketFactHash, uint256 datetime, int16 optionID, uint256 pricePerOption, int256 size);
    event LiquidityAddWithdraw(address indexed addr, uint256 datetime, int256 amount);

    /* This is the constructor */
    constructor () public {
        ownerAddr = msg.sender;
    }

    function createMarket (
        MarketBaseData marketBaseData,
        bool testMarket,
        Signature signature
    ) public
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

        require(msg.sender == ownerAddr, "Sender not authorized.");

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
            // TODO is this correct for negative strikes?
            assert((marketBaseData.strikes[cnt] % int256(10**uint256((int256(marketBaseData.baseUnitExp)-marketBaseData.ndigit)))) == 0);
        }


        /* find the right place to insert */
        while (previous.marketBaseData.expirationDatetime > marketBaseData.expirationDatetime) {
            market = previous;
            previous = markets[market.previous];
        }

        /* using memory for struct before commiting to storage */
        Market memory newMarket;
        newMarket.previous = market.previous; /* marketFactHash previous */
        newMarket.testMarket = testMarket;
        newMarket.winningOptionID = -1; // no optionID has won yet

        newMarket.marketBaseData = marketBaseData;

        /* insert */
        markets[marketFactHash] = newMarket;
        market.previous = marketFactHash;

        emit MarketCreate(marketFactHash);
    }

    function getMarketDataList (
// TODO reorder arguments?
        bool filterTestMarkets, // default: true // if true all test markets are filtered out
        bool filterNoTradedMarkets, // default: false // filter out all markets the the uses (msg.sender) has not traded
        uint64 expirationDatetime,
        uint16 len,
        bytes32[] marketFactHashLast // if list is empty we start at head - otherwise we continue to list after marketFactHashLast[0]
    )
        public
        view
        returns (MarketData[] marketList)
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
                    (filterTestMarkets && markets[market.previous].testMarket) ||
                    (filterNoTradedMarkets && (markets[market.previous].userState[msg.sender].state != State.USER_NONE))
                )) {
                marketList[idx] = getMarketData(market.previous);
                idx++;
            }
            market = markets[market.previous];
        }
        return marketList;
    }

    function setTestMarket (bytes32 marketFactHash, bool testMarket) public {
        require(msg.sender == ownerAddr, "Sender not authorized.");

        markets[marketFactHash].testMarket = testMarket;
    }

    // TODO should events have the same name as the corresponding functions?
    function liquidityAdd () public payable {
        if (msg.value > 0) {
            liquidityUser[msg.sender] += msg.value;
            emit LiquidityAddWithdraw(msg.sender, block.timestamp, int256(msg.value));
        }
    }

    function liquidityWithdraw (uint256 amount) public {
        require (amount <= liquidityUser[msg.sender], "Not enough liquidity.");
        /* Remember to reduce the liquidity BEFORE */
        /* sending to prevent re-entrancy attacks */
        liquidityUser[msg.sender] -= amount;
        msg.sender.transfer(amount);
        emit LiquidityAddWithdraw(msg.sender, block.timestamp, int256(-amount));
    }

    /* returns all data that was required at market creation and additionally int16 winningOptionID */
    function getMarketData (bytes32 marketFactHash)
        public
        view
        returns (MarketData marketData)
    {
        marketData.marketBaseData = markets[marketFactHash].marketBaseData;
        marketData.winningOptionID = markets[marketFactHash].winningOptionID;
        marketData.marketFactHash = marketFactHash;
        marketData.state = markets[marketFactHash].userState[msg.sender].state;
// TODO return testMarket?
        return marketData;
    }

/*
    function getPositionsx (bytes32 marketFactHash, address user)
        public
        view
        returns (int256[] positions)
    {
        int256[] memory positionsAll = new int256[](markets[marketFactHash].marketBaseData.strikes.length + 1);
        for (uint16 optionID = 0; optionID <= markets[marketFactHash].marketBaseData.strikes.length; optionID++) {
            positionsAll[optionID] = markets[marketFactHash].userState[user].positions[optionID];
        }
        return positionsAll;
    }
*/

    function getLiquidityAndPositions (bytes32 marketFactHash, address user)
        public
        view
        returns (uint256 liquidity, int256[] positions, State state)
    {
        // return user's total contract liquidity and positions for selected market
        int256[] memory positionsOptionID = new int256[](markets[marketFactHash].marketBaseData.strikes.length + 1);
        for (uint16 optionID = 0; optionID <= markets[marketFactHash].marketBaseData.strikes.length; optionID++) {
            positionsOptionID[optionID] = markets[marketFactHash].userState[user].positions[optionID];
        }
// TODO return of liquidityUser[user] (should be first our last argument since it belongs to all markets of this contract
        return (liquidityUser[user], positionsOptionID, markets[marketFactHash].userState[user].state);
    }

    function settlement (
        bytes32 marketFactHash, /* market to settle */
        Signature signature,
        int256 value,
        uint256 maxNumUsersToPayout
    ) public
    {
        require(markets[marketFactHash].winningOptionID == -1, "Market already settled.");

        /* anybody with access to the signature-value-combination can settle the market */
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

// TODO typconvertierungen vereinfachen?
        Market storage market = markets[marketFactHash];
        int16 winningOptionID = int16(market.marketBaseData.strikes.length);
        for (uint16 cnt = 0; cnt < market.marketBaseData.strikes.length; cnt++) {
            if (value < market.marketBaseData.strikes[cnt]) {
                winningOptionID = int16(cnt); // our first optionID is 1
                break;
            }
        }
        markets[marketFactHash].winningOptionID = winningOptionID;
        emit MarketSettlement(marketFactHash);

        // TODO remove this function and call settlement separately?
        settlementPayOut(
            marketFactHash,
            maxNumUsersToPayout
        );
    }

    function getNumUsersToPayout(
        bytes32 marketFactHash
    )
        public
        view
        returns (uint256 numUsersToPayout)
    {
        return markets[marketFactHash].users.length;
    }

    function settlementPayOut(
        bytes32 marketFactHash,
        uint256 maxNumUsersToPayout
    ) public
    {
        Market storage market = markets[marketFactHash];
        int16 winningOptionID = markets[marketFactHash].winningOptionID;
        require(winningOptionID >= 0, "Market not yet settled.");

        for (uint256 idx = 0; idx < maxNumUsersToPayout; idx++) {
            if (markets[marketFactHash].users.length == 0)
                return;

            address user = market.users[market.users.length - 1];
            market.users.length -= 1;

            uint256 result = 0; // TODO rename result
            for (uint16 optionID = 0; optionID <= market.marketBaseData.strikes.length; optionID++) {
                if ((optionID == uint16(winningOptionID)) && (market.userState[user].positions[optionID] > int256(0))) {
                    result += uint256(market.userState[user].positions[optionID]);
                } else if ((optionID != uint16(winningOptionID)) && (market.userState[user].positions[optionID] < int256(0))) {
// rename positions -> optionsCount?
                    result += uint256(-market.userState[user].positions[optionID]);
                }
            }
            market.userState[user].state = State.USER_PAYED_OUT;
            liquidityUser[user] += result * PAYOUT_PER_OPTION;
            // emit a PositionChange with negative (optionID+1) to signal final payout
            // this is like a sell for PAYOUT_PER_OPTION
            emit PositionChange(user, marketFactHash, block.timestamp, -(winningOptionID+1), PAYOUT_PER_OPTION, -market.userState[user].positions[uint16(winningOptionID)]); // TODO sign?
        }
    }

    function orderExecuteTestList (
        OrderOfferSigned[] orderOfferSignedList,
        int256 sizeAcceptMax /* maximum for all supplied orderOfferSigned structs */
    ) public view returns (int256[] sizeAcceptPossibleList)
    {
        // TODO this checks each orderOfferSigned structs independently !
        sizeAcceptPossibleList = new int256[](orderOfferSignedList.length);
        bytes32 orderHash;
        int256 sizeAcceptPossible;

        for (uint256 orderOfferIdx=0; orderOfferIdx < orderOfferSignedList.length; orderOfferIdx++) {
            (sizeAcceptPossible, orderHash) = orderExecuteTest(orderOfferSignedList[orderOfferIdx], sizeAcceptMax);
            sizeAcceptPossibleList[orderOfferIdx] = sizeAcceptPossible;
        }
        return sizeAcceptPossibleList;
    }

    function orderExecuteTest (
        OrderOfferSigned orderOfferSigned,
        int256 sizeAccept
    ) public view returns (int256 sizeAcceptPossible, bytes32 orderHash)
    {
        OrderOffer memory orderOffer = orderOfferSigned.orderOffer;
        orderHash = keccak256(
            abi.encodePacked(
                address(this), // this checks that the signature is valid for this contract
                orderOffer.marketFactHash,
                orderOffer.optionID,
                orderOffer.pricePerOption,
                orderOffer.size,
                orderOffer.orderID,
                orderOffer.blockExpires,
                orderOffer.addr
            )
        );
        // TODO simplify
        if ((orderOffer.size > 0) && (sizeAccept < 0)) {
            if (offersAccepted[orderHash]-sizeAccept > orderOffer.size)
                sizeAccept = offersAccepted[orderHash] - orderOffer.size;
        } else if ((orderOffer.size < 0) && (sizeAccept > 0)) {
            if (offersAccepted[orderHash]-sizeAccept < orderOffer.size)
                sizeAccept = offersAccepted[orderHash] - orderOffer.size;
        } else {
            sizeAccept = 0;
        }

        if (!(
                (verify(
                    orderHash,
                    orderOfferSigned.signature
                ) == orderOffer.addr) &&
                (orderOffer.optionID <= markets[orderOffer.marketFactHash].marketBaseData.strikes.length) &&
                (block.number <= orderOffer.blockExpires) &&
                (orderOffer.addr != msg.sender) && // TODO fix and remove this in the future?
                checkLiquidity (
                    orderOffer,
                    orderOffer.addr,
                    -sizeAccept
                ) &&
                checkLiquidity (
                    orderOffer,
                    msg.sender,
                    sizeAccept
                )
            )) {
            sizeAccept = 0;
        }
        return (sizeAccept, orderHash);
    }

    function orderExecute (
        OrderOfferSigned[] orderOfferSignedList,
        int256 sizeAcceptMax /* maximum for all supplied orderOfferSigned structs */
    ) public payable
    {
        liquidityAdd(); // ether may be supplied with order

        for (uint256 orderOfferIdx=0; orderOfferIdx < orderOfferSignedList.length; orderOfferIdx++) {
            OrderOffer memory orderOffer = orderOfferSignedList[orderOfferIdx].orderOffer;
            bytes32 orderHash;
            int256 sizeAccept;

            (sizeAccept, orderHash) = orderExecuteTest (
                orderOfferSignedList[orderOfferIdx],
                sizeAcceptMax
            );

            if (sizeAccept != 0) {
                sizeAcceptMax -= sizeAccept;

                // TODO should we have a special order here
                //markets[orderOffer.marketFactHash].userState[msg.sender].positions[orderOffer.optionID] += sizeAccept;
                liquidityUser[msg.sender] = uint256(
                    int256(liquidityUser[msg.sender]) + // TODO ugly /prevent overflow
                    (-sizeAccept) * int256(orderOffer.pricePerOption) + // pays money
                    maxLossOrMinWinChangeAfterTrade (
                        orderOffer,
                        msg.sender,
                        sizeAccept
                    )
                );

                //markets[orderOffer.marketFactHash].userState[orderOffer.addr].positions[orderOffer.optionID] -= sizeAccept;
                liquidityUser[orderOffer.addr] = uint256(
                    int256(liquidityUser[orderOffer.addr]) + // TODO ugly /prevent overflow
                    sizeAccept * int256(orderOffer.pricePerOption) + // gets money
                    maxLossOrMinWinChangeAfterTrade (
                        orderOffer,
                        orderOffer.addr,
                        -sizeAccept
                    )
                );
                // update positions after we have called maxLossOrMinWinChangeAfterTrade()
                markets[orderOffer.marketFactHash].userState[orderOffer.addr].positions[orderOffer.optionID] -= sizeAccept;
                markets[orderOffer.marketFactHash].userState[msg.sender].positions[orderOffer.optionID] += sizeAccept;

                offersAccepted[orderHash] -= sizeAccept; // remember that some of market makers signed offers are already used

                // remember user for final settlement calculation
                if (markets[orderOffer.marketFactHash].userState[msg.sender].state== State.USER_NONE) {
                    markets[orderOffer.marketFactHash].userState[msg.sender].state = State.USER_EXISTS;
                    markets[orderOffer.marketFactHash].users.push(msg.sender);
                }
                if (markets[orderOffer.marketFactHash].userState[orderOffer.addr].state == State.USER_NONE) {
                    markets[orderOffer.marketFactHash].userState[orderOffer.addr].state = State.USER_EXISTS;
                    markets[orderOffer.marketFactHash].users.push(orderOffer.addr);
                }


                emit PositionChange(
                    msg.sender,
                    orderOffer.marketFactHash,
                    block.timestamp,
                    int16(orderOffer.optionID),
                    orderOffer.pricePerOption,
                    sizeAccept
                );
                emit PositionChange(
                    orderOffer.addr,
                    orderOffer.marketFactHash,
                    block.timestamp,
                    int16(orderOffer.optionID),
                    orderOffer.pricePerOption,
                    -sizeAccept
                );

            }
        }
    }

    function maxLossOrMinWinChangeAfterTrade (
        OrderOffer orderOffer,
        address userAddr,
        int256 positionChange
    ) public view returns (int256 maxLossOrMinWin) // TODO private?
    {
// a negative value means that (more) liquidity has to be blocked, while
// a positive value means that ..
        return
            maxLossOrMinWinAfterTrade( // after trade
                orderOffer.marketFactHash,
                userAddr,
                orderOffer.optionID,
                positionChange
            ) -
            maxLossOrMinWinAfterTrade( // before trade
                orderOffer.marketFactHash,
                userAddr,
                0,
                0
            );
    }

    function maxLossOrMinWinAfterTrade (
        bytes32 marketFactHash,
        address userAddr,
        uint16 optionID,
        int256 positionChange
    ) public view returns (int256 maxLossOrMinWin)
    {
// if negative liquidity has to be blocked,
// if positive, there is a win in any case
        int256 minPosition = int256(~((uint256(1) << 255))); // INT256_MAX
//int256 constant INT256_MIN = int256((uint256(1) << 255));
//int256 constant INT256_MAX = int256(~((uint256(1) << 255)));

        //if (markets[marketFactHash].userState[userAddr].paidOut) // TODO maybe not ok here, but where?
        //    return 0;
// TODO rename s somehow
        for (uint16 s = 0; s <= markets[marketFactHash].marketBaseData.strikes.length; s++) {

            int256 position = markets[marketFactHash].userState[userAddr].positions[s];
            if (s == optionID)
                position += positionChange;

            if (position < minPosition)
                minPosition = position;
        }
        return minPosition * int256(PAYOUT_PER_OPTION);
    }

    /* internal functions */
    function verify(
        bytes32 message,
        Signature signature
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

    function checkLiquidity (
        OrderOffer orderOffer,
        address userAddr,
        int256 sizeAccept
    ) internal view returns (bool success)
    {
        return (
            (
                int256(liquidityUser[userAddr]) +
                maxLossOrMinWinChangeAfterTrade (
                    orderOffer,
                    userAddr,
                    sizeAccept
                ) -
                sizeAccept * int256(orderOffer.pricePerOption)
            ) >= 0
        );
    }


}
