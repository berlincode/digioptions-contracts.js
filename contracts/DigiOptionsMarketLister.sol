pragma solidity 0.5.6;
pragma experimental ABIEncoderV2;

import "./DigiOptions.sol";


contract DigioptionsMarketLister {
    /* public variables / constants */
    uint256 public constant CONTRACT_VERSION = (
        (0 << 32) + /* major */
        (41 << 16) + /* minor */
        1 /* bugfix */
    );

    // TODO time uint256 public constant CONTRACT_VERSION = (

    struct MarketBest {
        bytes32 marketFactHash;
        uint256 transactionFee; // DigiOptions.MarketBaseData.transactionFee
        uint256 time; 
    }
    mapping(bytes32 => MarketBest) internal marketsBest;

    address public owner;
    DigiOptions public digioptions;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    uint256 transactionFeeDefault; // DigiOptions.MarketBaseData.transactionFee

    //event MarketCreate(bytes32 marketFactHash, bytes32 indexed underlying, uint8 indexed typeDuration);

    constructor (DigiOptions addr) public {
        owner = msg.sender;
        digioptions = addr;
        transactionFeeDefault = 1; // TODO DigiOptions.MarketBaseData.transactionFee
    }

    // TODO set transactionFeeDefault

    function createMarket (
        DigiOptions.MarketBaseData memory marketBaseData,
        bool testMarket,
        DigiOptions.Signature memory signature
    ) public
    //TODO onlyOwner // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    returns (bytes32 _marketFactHash)
    {
        bytes32 marketFactHash = digioptions.createMarket(
            marketBaseData,
            testMarket,
            signature
        );

        /* baseFactHash is similar to marketFactHash but does not contain .... TODO */
        bytes32 baseFactHash = keccak256(
            abi.encodePacked(
                /* sorted alphabetically */
                marketBaseData.baseUnitExp, /* e.g. 18 -> baseUnit = 10**18 = 1000000000000000000 */
                marketBaseData.underlying, /* 'name' ascii encoded string as bytes32 */
                marketBaseData.ndigit, /* 'ndigit' number of digits (may be negative) */
                marketBaseData.objectionPeriod, /* e.g. 3600 seconds */
                marketBaseData.expirationDatetime /* 'settlement' unix epoch seconds UTC */
            )
        );

        if (marketBaseData.transactionFee > marketsBest[baseFactHash].transactionFee){ // TODO replace with anteil
            marketsBest[baseFactHash] = MarketBest({
                marketFactHash: marketFactHash,
                transactionFee: marketBaseData.transactionFee, // TODO replace with anteil
                time: block.timestamp // TODO do not update each time
            });
            //emit MarketCreate(marketFactHash, marketBaseData.underlying, typeDuration);
        }
        return marketFactHash;
    }

    function getMarketDataList (
        bool filterTestMarkets, // default: true // if true all test markets are filtered out
        bool filterNoTradedMarkets, // default: false // filter out all markets the the uses (msg.sender) has not traded
        uint64 expirationDatetime,
        uint16 len,
        bytes32[] memory marketFactHashLast // if list is empty we start at head - otherwise we continue to list after marketFactHashLast[0]
    )
        //external
        public
        view
        returns (DigiOptions.MarketData[] memory marketList)
    {
        return digioptions.getMarketDataList(
            filterTestMarkets, // default: true // if true all test markets are filtered out
            filterNoTradedMarkets, // default: false // filter out all markets the the uses (msg.sender) has not traded
            expirationDatetime,
            len,
            marketFactHashLast // if list is empty we start at head - otherwise we continue to list after marketFactHashLast[0]
        );
    }
}
