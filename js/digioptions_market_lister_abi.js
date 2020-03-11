
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_market_lister_abi = factory();
  }
})(this, function(){

  /* eslint-disable quotes */
  var data = [
    {
      "inputs": [
        {
          "internalType": "contract DigiOptionsMarkets",
          "name": "addr",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "marketKey",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "uint48",
          "name": "expirationDatetimeFilter",
          "type": "uint48"
        },
        {
          "indexed": false,
          "internalType": "uint40",
          "name": "expirationDatetime",
          "type": "uint40"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "marketInterval",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "marketCategory",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "openDelaySeconds",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "underlyingString",
          "type": "string"
        }
      ],
      "name": "MarketCreateLister",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint40",
          "name": "expirationDatetime",
          "type": "uint40"
        }
      ],
      "name": "calcMarketInterval",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "interval",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
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
              "internalType": "uint32",
              "name": "transactionFee0",
              "type": "uint32"
            },
            {
              "internalType": "address",
              "name": "feeTaker0",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "transactionFee1",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "transactionFeeSigner",
              "type": "uint32"
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
      "name": "createMarket",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractInfo",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "contractInfoValues",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        }
      ],
      "name": "getMarketDataByMarketHash",
      "outputs": [
        {
          "components": [
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
                  "internalType": "uint32",
                  "name": "transactionFee0",
                  "type": "uint32"
                },
                {
                  "internalType": "address",
                  "name": "feeTaker0",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "transactionFee1",
                  "type": "uint32"
                },
                {
                  "internalType": "uint32",
                  "name": "transactionFeeSigner",
                  "type": "uint32"
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
              "components": [
                {
                  "internalType": "uint128",
                  "name": "fee",
                  "type": "uint128"
                },
                {
                  "internalType": "uint16",
                  "name": "winningOptionID",
                  "type": "uint16"
                },
                {
                  "internalType": "bool",
                  "name": "settled",
                  "type": "bool"
                }
              ],
              "internalType": "struct DigiOptionsLib.MarketState",
              "name": "marketState",
              "type": "tuple"
            },
            {
              "internalType": "bytes32",
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "internalType": "enum DigiOptionsLib.UserState",
              "name": "userState",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "testMarket",
              "type": "bool"
            }
          ],
          "internalType": "struct DigiOptionsLib.MarketData",
          "name": "marketData",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "internalType": "bytes32[]",
          "name": "marketKeys",
          "type": "bytes32[]"
        }
      ],
      "name": "getMarketDataListByMarketKeys",
      "outputs": [
        {
          "components": [
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
                  "internalType": "uint32",
                  "name": "transactionFee0",
                  "type": "uint32"
                },
                {
                  "internalType": "address",
                  "name": "feeTaker0",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "transactionFee1",
                  "type": "uint32"
                },
                {
                  "internalType": "uint32",
                  "name": "transactionFeeSigner",
                  "type": "uint32"
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
              "components": [
                {
                  "internalType": "uint128",
                  "name": "fee",
                  "type": "uint128"
                },
                {
                  "internalType": "uint16",
                  "name": "winningOptionID",
                  "type": "uint16"
                },
                {
                  "internalType": "bool",
                  "name": "settled",
                  "type": "bool"
                }
              ],
              "internalType": "struct DigiOptionsLib.MarketState",
              "name": "marketState",
              "type": "tuple"
            },
            {
              "internalType": "bytes32",
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "internalType": "enum DigiOptionsLib.UserState",
              "name": "userState",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "testMarket",
              "type": "bool"
            }
          ],
          "internalType": "struct DigiOptionsLib.MarketData[]",
          "name": "marketDataList",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMarketListerInfo",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "listerValues",
          "type": "uint256[]"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "signerAddr",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "internalType": "struct DigiOptionsMarketLister.SignerData[]",
          "name": "signerDataList",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "testMarket",
          "type": "bool"
        }
      ],
      "name": "registerMarket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
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
              "internalType": "uint32",
              "name": "transactionFee0",
              "type": "uint32"
            },
            {
              "internalType": "address",
              "name": "feeTaker0",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "transactionFee1",
              "type": "uint32"
            },
            {
              "internalType": "uint32",
              "name": "transactionFeeSigner",
              "type": "uint32"
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
        }
      ],
      "name": "registerMarketTest",
      "outputs": [
        {
          "internalType": "bool",
          "name": "registerPossible",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "signerAddr",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "setSigner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "testMarket",
          "type": "bool"
        }
      ],
      "name": "setTestMarket",
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
