
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_meta_abi = factory();
  }
})(this, function(){

  /* eslint-disable quotes */
  var data = [
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "contract DigiOptionsMarkets",
              "name": "digiOptionsMarkets",
              "type": "address"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "underlyingString",
                  "type": "string"
                },
                {
                  "internalType": "uint40",
                  "name": "expirationDatetime",
                  "type": "uint40"
                },
                {
                  "internalType": "uint24",
                  "name": "objectionPeriod",
                  "type": "uint24"
                },
                {
                  "internalType": "uint8",
                  "name": "config",
                  "type": "uint8"
                },
                {
                  "internalType": "uint8",
                  "name": "marketCategory",
                  "type": "uint8"
                },
                {
                  "internalType": "uint8",
                  "name": "baseUnitExp",
                  "type": "uint8"
                },
                {
                  "internalType": "int8",
                  "name": "ndigit",
                  "type": "int8"
                },
                {
                  "internalType": "address",
                  "name": "signerAddr",
                  "type": "address"
                },
                {
                  "internalType": "uint8",
                  "name": "marketInterval",
                  "type": "uint8"
                },
                {
                  "internalType": "uint8",
                  "name": "transactionFee0",
                  "type": "uint8"
                },
                {
                  "internalType": "uint8",
                  "name": "transactionFee1",
                  "type": "uint8"
                },
                {
                  "internalType": "uint8",
                  "name": "transactionFeeSigner",
                  "type": "uint8"
                },
                {
                  "internalType": "address",
                  "name": "feeTaker0",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "feeTaker1",
                  "type": "address"
                },
                {
                  "internalType": "int128[]",
                  "name": "strikes",
                  "type": "int128[]"
                }
              ],
              "internalType": "struct DigiOptionsLib.MarketBaseData",
              "name": "marketBaseData",
              "type": "tuple"
            },
            {
              "internalType": "bool",
              "name": "testMarket",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "uint8",
                  "name": "v",
                  "type": "uint8"
                },
                {
                  "internalType": "bytes32",
                  "name": "r",
                  "type": "bytes32"
                },
                {
                  "internalType": "bytes32",
                  "name": "s",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct FactsignerVerify.Signature",
              "name": "signature",
              "type": "tuple"
            }
          ],
          "internalType": "struct DigiOptionsMeta.CreateAndRegisterData[]",
          "name": "createAndRegisterDataList",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "internalType": "contract DigiOptionsMarkets",
              "name": "digiOptionsMarkets",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "components": [
                {
                  "internalType": "uint8",
                  "name": "v",
                  "type": "uint8"
                },
                {
                  "internalType": "bytes32",
                  "name": "r",
                  "type": "bytes32"
                },
                {
                  "internalType": "bytes32",
                  "name": "s",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct FactsignerVerify.Signature",
              "name": "signature",
              "type": "tuple"
            },
            {
              "internalType": "int256",
              "name": "value",
              "type": "int256"
            },
            {
              "internalType": "address[]",
              "name": "users",
              "type": "address[]"
            },
            {
              "internalType": "bytes32[]",
              "name": "offerHash",
              "type": "bytes32[]"
            }
          ],
          "internalType": "struct DigiOptionsMeta.SettlementData[]",
          "name": "settlementDataList",
          "type": "tuple[]"
        }
      ],
      "name": "createRegisterAndSettlement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
