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

pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

//import "./DigiOptionsBaseInterface.sol";
import "./DigiOptionsMarkets.sol";
import "./DigiOptionsMarketLister.sol";
import "./DigiOptionsLib.sol";


contract DigiOptionsMeta {

    /* This is the constructor */
    //constructor () public {
    //}

    /* TODO re-enabled after 0x-tools support solc-0.6.0
    // default fallback
    receive () external payable {
        revert();
    }
    */

    struct CreateAndRegisterData {
        DigiOptionsMarkets digiOptionsMarkets;
        DigiOptionsLib.MarketBaseData marketBaseData;
        bool testMarket;
        FactsignerVerify.Signature signature;
    }

    struct SettlementData {
        DigiOptionsMarkets digiOptionsMarkets;
        bytes32 marketHash; /* market to settle */
        FactsignerVerify.Signature signature;
        int256 value;
        address[] users;
        bytes32[] offerHash;
    }

    function createRegisterAndSettlement (
        CreateAndRegisterData[] memory createAndRegisterDataList,
        SettlementData[] memory settlementDataList
    ) public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
    {

        for (uint256 createAndRegisterDataIdx=0; createAndRegisterDataIdx < createAndRegisterDataList.length; createAndRegisterDataIdx++) {
            CreateAndRegisterData memory createAndRegisterData = createAndRegisterDataList[createAndRegisterDataIdx];

            /*
            uint256[] memory infoValues = createAndRegisterData.digiOptionsMarkets.getContractInfo();
            DigiOptionsMarkets digiOptionsMarketsX = DigiOptionsMarkets(address(infoValues[uint256(DigiOptionsLib.InfoValues.DIGIOPTIONS_MARKETS_ADDR_IDX)]));
            if (infoValues[uint256(DigiOptionsLib.InfoValues.CONTRACT_TYPE_IDX)] == uint256(DigiOptionsLib.ContractType.DIGIOPTIONSMARKETLISTER))
            {
            }
            bytes32 marketHash = createAndRegisterData.digiOptionsMarkets.createMarket(
                createAndRegisterData.marketBaseData,
                createAndRegisterData.testMarket,
                createAndRegisterData.signature
            );


                createAndRegisterData.digiOptionsMarketLister[marketListerIdx].registerMarket(
                    marketHash,
                    createAndRegisterData.testMarket
                );
            */

            createAndRegisterData.digiOptionsMarkets.createMarket(
                createAndRegisterData.marketBaseData,
                createAndRegisterData.testMarket,
                createAndRegisterData.signature
            );
        }
        for (uint256 settlementDataIdx=0; settlementDataIdx < settlementDataList.length; settlementDataIdx++) {
            SettlementData memory settlementData = settlementDataList[settlementDataIdx];
            settlementData.digiOptionsMarkets.settlement(
                settlementData.marketHash, // market to settle
                settlementData.signature,
                settlementData.value,
                settlementData.users,
                settlementData.offerHash
            );
        }
    }

}
