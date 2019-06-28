/*
 User Driven Option Markets Contract used by https://www.digioptions.com

 Copyright (c) [www.digioptions.com](https://www.digioptions.com)

 Designed to work with signatures from [www.factsigner.com](https://www.factsigner.com)

 Public repository:
 https://github.com/berlincode/digioptions-contracts.js

 elastic.code@gmail.com
 mail@digioptions.com

*/

pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;

import "./DigiOptionsBaseInterface.sol";
import "./DigiOptionsMarkets.sol";
import "./SafeMath.sol";


contract DigiOptionsMarketLister is DigiOptionsBaseInterface {
    using SafeMath for uint256;
    using SafeMath for int256;

    uint256 public version = (
        (0 << 32) + /* major */
        (46 << 16) + /* minor */
        0 /* bugfix */
    );

    /* constants which are set during construction */
    address public owner;
    DigiOptionsMarkets public digiOptionsMarkets;

    /* control varialbles */
    uint16 public openDelaySeconds = 100;
    uint64 public transactionFeeMax = 10 finney; // 0.01 = 1.0%

    /* we use a simple linked list to sort contracts by expirationDatetime date */
    struct Market {
        bytes32 baseMarketHashPrevious;
        bytes32 marketHash;
        uint64 expirationDatetime; /* used for sorting contracts */ // TODO we may use expirationDatetime from main markets contract
        bool testMarket;
    }

    /* variables */
    Market internal head; /* we use only head.baseMarketHashPrevious */
    mapping(bytes32 => Market) internal markets;

    struct MarketBest {
        bytes32 marketHash;
        uint64 transactionFee0;
        uint40 time;
        uint16 openDelaySeconds;
    }
    mapping(bytes32 => MarketBest) internal marketsBest;

    modifier onlyOwner() {
        // TODO
        //require(msg.sender == owner, "Only owner can call this function.");
        require((msg.sender == owner) || (tx.origin == owner), "Only owner can call this function.");
        _;
    }

    event MarketCreateLister(
        bytes32 baseMarketHash,
        uint64 indexed expirationDatetime,
        bytes32 indexed underlying,
        uint8 indexed typeDuration,
        uint16 openDelaySeconds
    );

    constructor (DigiOptionsMarkets addr) public {
        owner = msg.sender;
        digiOptionsMarkets = addr;
    }

    // default fallback
    function() external payable {
        revert();
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
            ContractType.CONTRACT_DIGIOPTIONSMARKETLISTER, // == 2
            version,
            digiOptionsMarkets.version(), // versionMarkets
            address(digiOptionsMarkets)
        );
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
        returns (DigiOptionsMarkets.MarketData[] memory marketList)
    {
        Market memory market;
        marketList = new MarketData[](len);
        uint256 idx = 0;

        if (marketHashLast.length == 0) {
            market = head;
        } else {
            market = markets[calcBaseMarketHash(digiOptionsMarkets.getMarketData(marketHashLast[0]))];
        }

        MarketData memory marketDataPrev = digiOptionsMarkets.getMarketData(markets[market.baseMarketHashPrevious].marketHash);

        while (
            (idx < len) &&
            (marketDataPrev.marketBaseData.expirationDatetime > 0) &&
            (marketDataPrev.marketBaseData.expirationDatetime >= expirationDatetime)
        ) {
            marketDataPrev.testMarket = markets[market.baseMarketHashPrevious].testMarket;

            if (!
                (
                    (filterTestMarkets && marketDataPrev.testMarket) ||
                    (filterNoTradedMarkets && (marketDataPrev.userState != UserState.USER_NONE))
                )) {
                marketList[idx] = marketDataPrev;
                idx++;
            }

            market = markets[market.baseMarketHashPrevious];
            marketDataPrev = digiOptionsMarkets.getMarketData(markets[market.baseMarketHashPrevious].marketHash);
        }
        return marketList;
    }

    function calcBaseMarketHash (
        MarketData memory marketData
    ) public pure
    returns (bytes32 baseMarketHash)
    {
        DigiOptionsMarkets.MarketBaseData memory marketBaseData = marketData.marketBaseData;

        /* baseMarketHash is similar to marketHash but does not contain all elements. It's basically a factHash with added typeDuration */
        return keccak256(
            abi.encodePacked(
                marketBaseData.baseUnitExp, /* e.g. 18 -> baseUnit = 10**18 = 1000000000000000000 */
                marketBaseData.underlying, /* 'name' ascii encoded string as bytes32 */
                marketBaseData.ndigit, /* 'ndigit' number of digits (may be negative) */
                marketBaseData.objectionPeriod, /* e.g. 3600 seconds */
                marketBaseData.expirationDatetime, /* 'settlement' unix epoch seconds UTC */

                marketBaseData.typeDuration
            )
        );

    }

    function registerMarket (
        bytes32 marketHash,
        bool testMarket
    ) public
    onlyOwner // TODO remove this restriction
    {
        DigiOptionsMarkets.MarketData memory marketData = digiOptionsMarkets.getMarketData(marketHash);
        DigiOptionsMarkets.MarketBaseData memory marketBaseData = marketData.marketBaseData;

        assert(marketBaseData.expirationDatetime != 0);

        bytes32 baseMarketHash = calcBaseMarketHash(marketData);

        if (
            ((uint256(marketBaseData.transactionFee0)).add(uint256(marketBaseData.transactionFee1)) <= transactionFeeMax) &&
            (marketBaseData.feeTaker0 == owner)
            // TODO check signerAddr etc (if onlyOwner is removed)
            ){
            if (marketsBest[baseMarketHash].openDelaySeconds == 0) {
                // does not yet exist
                marketsBest[baseMarketHash] = MarketBest(
                    {
                    marketHash: marketHash,
                    transactionFee0: marketBaseData.transactionFee0,
                    time: uint40(block.timestamp),
                    openDelaySeconds: openDelaySeconds
                    }
                );

                /* find the right place to insert */
                Market storage market = head;
                while (markets[market.baseMarketHashPrevious].expirationDatetime > marketBaseData.expirationDatetime) {
                    market = markets[market.baseMarketHashPrevious];
                }

                /* using memory for struct before commiting to storage */
                Market memory newMarket;

                newMarket = Market(
                    {
                    marketHash: marketHash,
                    baseMarketHashPrevious: market.baseMarketHashPrevious,
                    /* expirationDatetime is used for sorting contracts */
                    expirationDatetime: marketBaseData.expirationDatetime,
                    /* only contract owner may set testMarket */
                    testMarket: testMarket && (msg.sender == owner)
                    }
                );

                /* insert */
                markets[baseMarketHash] = newMarket;
                market.baseMarketHashPrevious = baseMarketHash;

                // emit only once for each market (even if it will be replaced later)
                emit MarketCreateLister(
                    baseMarketHash,
                    marketBaseData.expirationDatetime,
                    marketBaseData.underlying,
                    marketBaseData.typeDuration,
                    openDelaySeconds
                );
            } else if (
                (marketBaseData.transactionFee0 > marketsBest[baseMarketHash].transactionFee0) &&
                (block.timestamp <= marketsBest[baseMarketHash].time + marketsBest[baseMarketHash].openDelaySeconds)
            ){
                MarketBest storage marketBest = marketsBest[baseMarketHash];
                marketBest.marketHash = marketHash;
                marketBest.transactionFee0 = marketBaseData.transactionFee0;
            }
        }
    }

    // TODO use this?
    function getMarketData (bytes32 marketHash)
        public
        view
        returns (MarketData memory marketData_)
    {
        /* same as DigiOptionsMarkets' getMarketData() but with set testMarket property */
        DigiOptionsMarkets.MarketData memory marketData = digiOptionsMarkets.getMarketData(marketHash);
        bytes32 baseMarketHash = calcBaseMarketHash(marketData);
        marketData.testMarket = markets[baseMarketHash].testMarket;

        return marketData;
    }

    function setTestMarket (bytes32 marketHash, bool testMarket) public onlyOwner {
        DigiOptionsMarkets.MarketData memory marketData = digiOptionsMarkets.getMarketData(marketHash);
        bytes32 baseMarketHash = calcBaseMarketHash(marketData);

        markets[baseMarketHash].testMarket = testMarket;
    }

    function setOpenDelaySeconds (uint16 openDelaySeconds_) public onlyOwner {
        if (openDelaySeconds_ > 0) {
            openDelaySeconds = openDelaySeconds_;
        }
    }

    function setTransactionFeeMax (uint64 transactionFeeMax_) public onlyOwner {
        transactionFeeMax = transactionFeeMax_;
    }
}
