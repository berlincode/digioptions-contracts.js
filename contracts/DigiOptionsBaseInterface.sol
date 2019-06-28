pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;

/*
    Base data structures and the interface functions that
    are implemente by both contracts (DigiOptionsMarkets and
    DigioptionsMarketLister)
*/


contract DigiOptionsBaseInterface {

    enum ContractType {
        CONTRACT_UNKNOWN,
        CONTRACT_DIGIOPTIONSMARKETS, // == 1
        CONTRACT_DIGIOPTIONSMARKETLISTER // == 2
    }

    uint256 public version;

    enum UserState {USER_NONE, USER_EXISTS, USER_PAYED_OUT}

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct Data {
        /* winningOptionID is only valid if settled == true */
        uint16 winningOptionID;
        bool settled;
    }

    struct MarketBaseData {
        /* constant core market data, part of marketHash calculation */

        bytes32 underlying;
        uint40 expirationDatetime; /* used for sorting contracts */
        int8 ndigit;
        uint8 baseUnitExp;
        uint32 objectionPeriod; /* e.g. 3600 seconds */

        address signerAddr; /* address used to check the signed result (e.g. of factsigner) */

        uint8 typeDuration;
        uint64 transactionFee0; /* fee in wei for every ether of value (payed by orderTaker) */
        address feeTaker0;
        uint64 transactionFee1; /* fee in wei for every ether of value (payed by orderTaker) */
        address feeTaker1;
        int128[] strikes;
    }

    struct MarketData {
        MarketBaseData marketBaseData;
        Data data;
        bytes32 marketHash;
        UserState userState;
        bool testMarket; // only used by MarketLister
    }

    function getContractInfo (
    )
        external
        returns (
            ContractType contractType,
            uint256 versionMarketLister,
            uint256 versionMarkets,
            address digiOptionsMarketsAddr
        );

    function getMarketDataList (
        bool filterTestMarkets, // default: true // if true all test markets are filtered out
        bool filterNoTradedMarkets, // default: false // filter out all markets the the uses (msg.sender) has not traded
        uint64 expirationDatetime,
        uint16 len,
        bytes32[] calldata marketHashLast // if list is empty we start at head - otherwise we continue to list after marketHashLast[0]
    )
        external
        view
        returns (MarketData[] memory marketList);
}
