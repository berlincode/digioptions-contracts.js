
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
      "constant": true,
      "inputs": [],
      "name": "version",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "contract DigiOptionsMarkets",
              "name": "digiOptionsMarkets",
              "type": "address"
            },
            {
              "internalType": "contract DigiOptionsMarketLister[]",
              "name": "digiOptionsMarketLister",
              "type": "address[]"
            },
            {
              "components": [
                {
                  "internalType": "bytes32",
                  "name": "underlying",
                  "type": "bytes32"
                },
                {
                  "internalType": "uint40",
                  "name": "expirationDatetime",
                  "type": "uint40"
                },
                {
                  "internalType": "int8",
                  "name": "ndigit",
                  "type": "int8"
                },
                {
                  "internalType": "uint8",
                  "name": "baseUnitExp",
                  "type": "uint8"
                },
                {
                  "internalType": "uint32",
                  "name": "objectionPeriod",
                  "type": "uint32"
                },
                {
                  "internalType": "address",
                  "name": "signerAddr",
                  "type": "address"
                },
                {
                  "internalType": "uint8",
                  "name": "typeDuration",
                  "type": "uint8"
                },
                {
                  "internalType": "uint64",
                  "name": "transactionFee0",
                  "type": "uint64"
                },
                {
                  "internalType": "address",
                  "name": "feeTaker0",
                  "type": "address"
                },
                {
                  "internalType": "uint64",
                  "name": "transactionFee1",
                  "type": "uint64"
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
              "internalType": "struct DigiOptionsBaseInterface.MarketBaseData",
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
              "internalType": "struct DigiOptionsBaseInterface.Signature",
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
              "internalType": "struct DigiOptionsBaseInterface.Signature",
              "name": "signature",
              "type": "tuple"
            },
            {
              "internalType": "int256",
              "name": "value",
              "type": "int256"
            },
            {
              "internalType": "uint256",
              "name": "maxNumUsersToPayout",
              "type": "uint256"
            }
          ],
          "internalType": "struct DigiOptionsMeta.SettlementData[]",
          "name": "settlementDataList",
          "type": "tuple[]"
        }
      ],
      "name": "createRegisterAndSettlement",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    }
  ];
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
