
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
              "name": "digiOptionsMarkets",
              "type": "address"
            },
            {
              "name": "digiOptionsMarketLister",
              "type": "address[]"
            },
            {
              "components": [
                {
                  "name": "underlying",
                  "type": "bytes32"
                },
                {
                  "name": "expirationDatetime",
                  "type": "uint40"
                },
                {
                  "name": "ndigit",
                  "type": "int8"
                },
                {
                  "name": "baseUnitExp",
                  "type": "uint8"
                },
                {
                  "name": "objectionPeriod",
                  "type": "uint32"
                },
                {
                  "name": "signerAddr",
                  "type": "address"
                },
                {
                  "name": "typeDuration",
                  "type": "uint8"
                },
                {
                  "name": "transactionFee0",
                  "type": "uint64"
                },
                {
                  "name": "feeTaker0",
                  "type": "address"
                },
                {
                  "name": "transactionFee1",
                  "type": "uint64"
                },
                {
                  "name": "feeTaker1",
                  "type": "address"
                },
                {
                  "name": "strikes",
                  "type": "int128[]"
                }
              ],
              "name": "marketBaseData",
              "type": "tuple"
            },
            {
              "name": "testMarket",
              "type": "bool"
            },
            {
              "components": [
                {
                  "name": "v",
                  "type": "uint8"
                },
                {
                  "name": "r",
                  "type": "bytes32"
                },
                {
                  "name": "s",
                  "type": "bytes32"
                }
              ],
              "name": "signature",
              "type": "tuple"
            }
          ],
          "name": "createAndRegisterDataList",
          "type": "tuple[]"
        },
        {
          "components": [
            {
              "name": "digiOptionsMarkets",
              "type": "address"
            },
            {
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "components": [
                {
                  "name": "v",
                  "type": "uint8"
                },
                {
                  "name": "r",
                  "type": "bytes32"
                },
                {
                  "name": "s",
                  "type": "bytes32"
                }
              ],
              "name": "signature",
              "type": "tuple"
            },
            {
              "name": "value",
              "type": "int256"
            },
            {
              "name": "maxNumUsersToPayout",
              "type": "uint256"
            }
          ],
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
