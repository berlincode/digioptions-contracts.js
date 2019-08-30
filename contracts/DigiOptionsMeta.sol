/*
 User Driven Option Markets Contract used by https://www.digioptions.com

 This is just a helper contract which allows to create, register ans settle
 multiple markets within one transaction.

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
import "./DigiOptionsMarkets.sol";
import "./DigiOptionsMarketLister.sol";


contract DigiOptionsMeta {

    uint256 public version = (
        (0 << 32) + /* major */
        (46 << 16) + /* minor */
        0 /* bugfix */
    );

    /* This is the constructor */
    //constructor () public {
    //}

    // default fallback
    function() external payable {
        revert();
    }

    struct CreateAndRegisterData {
        DigiOptionsMarkets digiOptionsMarkets;
        DigiOptionsMarketLister[] digiOptionsMarketLister;
        DigiOptionsMarkets.MarketBaseData marketBaseData;
        bool testMarket;
        DigiOptionsMarkets.Signature signature;
    }

    struct SettlementData {
        DigiOptionsMarkets digiOptionsMarkets;
        bytes32 marketHash; /* market to settle */
        DigiOptionsBaseInterface.Signature signature;
        int256 value;
        uint256 maxNumUsersToPayout;
    }

    function createRegisterAndSettlement (
        CreateAndRegisterData[] memory createAndRegisterDataList,
        SettlementData[] memory settlementDataList
    ) public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    {
        
        for (uint256 createAndRegisterDataIdx=0; createAndRegisterDataIdx < createAndRegisterDataList.length; createAndRegisterDataIdx++) {
            CreateAndRegisterData memory createAndRegisterData = createAndRegisterDataList[createAndRegisterDataIdx];

            bytes32 marketHash = createAndRegisterData.digiOptionsMarkets.createMarket(
                createAndRegisterData.marketBaseData,
                createAndRegisterData.testMarket,
                createAndRegisterData.signature
            );

            for (uint256 marketListerIdx=0; marketListerIdx < createAndRegisterData.digiOptionsMarketLister.length; marketListerIdx++) {

                createAndRegisterData.digiOptionsMarketLister[marketListerIdx].registerMarket(
                    marketHash,
                    createAndRegisterData.testMarket
                );
            }
        }
        for (uint256 settlementDataIdx=0; settlementDataIdx < settlementDataList.length; settlementDataIdx++) {
            SettlementData memory settlementData = settlementDataList[settlementDataIdx];
            settlementData.digiOptionsMarkets.settlement(
                settlementData.marketHash, /* market to settle */
                settlementData.signature,
                settlementData.value,
                settlementData.maxNumUsersToPayout
            );
        }
    }

}
