
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
      "constant": true,
      "inputs": [],
      "name": "openDelaySeconds",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        }
      ],
      "name": "getMarketData",
      "outputs": [
        {
          "components": [
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
              "components": [
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
              "internalType": "struct DigiOptionsBaseInterface.Data",
              "name": "data",
              "type": "tuple"
            },
            {
              "internalType": "bytes32",
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "internalType": "enum DigiOptionsBaseInterface.UserState",
              "name": "userState",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "testMarket",
              "type": "bool"
            }
          ],
          "internalType": "struct DigiOptionsBaseInterface.MarketData",
          "name": "marketData_",
          "type": "tuple"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
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
          "internalType": "uint64",
          "name": "transactionFeeMax_",
          "type": "uint64"
        }
      ],
      "name": "setTransactionFeeMax",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "components": [
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
              "components": [
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
              "internalType": "struct DigiOptionsBaseInterface.Data",
              "name": "data",
              "type": "tuple"
            },
            {
              "internalType": "bytes32",
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "internalType": "enum DigiOptionsBaseInterface.UserState",
              "name": "userState",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "testMarket",
              "type": "bool"
            }
          ],
          "internalType": "struct DigiOptionsBaseInterface.MarketData",
          "name": "marketData",
          "type": "tuple"
        }
      ],
      "name": "calcBaseMarketHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "baseMarketHash",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "constant": false,
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
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "transactionFeeMax",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "getContractInfo",
      "outputs": [
        {
          "internalType": "enum DigiOptionsBaseInterface.ContractType",
          "name": "contractType",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "versionMarketLister",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "versionMarkets",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "digiOptionsMarketsAddr",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
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
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
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
          "internalType": "uint16",
          "name": "openDelaySeconds_",
          "type": "uint16"
        }
      ],
      "name": "setOpenDelaySeconds",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bool",
          "name": "filterTestMarkets",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "filterNoTradedMarkets",
          "type": "bool"
        },
        {
          "internalType": "uint64",
          "name": "expirationDatetime",
          "type": "uint64"
        },
        {
          "internalType": "uint16",
          "name": "len",
          "type": "uint16"
        },
        {
          "internalType": "bytes32[]",
          "name": "marketHashLast",
          "type": "bytes32[]"
        }
      ],
      "name": "getMarketDataList",
      "outputs": [
        {
          "components": [
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
              "components": [
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
              "internalType": "struct DigiOptionsBaseInterface.Data",
              "name": "data",
              "type": "tuple"
            },
            {
              "internalType": "bytes32",
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "internalType": "enum DigiOptionsBaseInterface.UserState",
              "name": "userState",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "testMarket",
              "type": "bool"
            }
          ],
          "internalType": "struct DigiOptionsBaseInterface.MarketData[]",
          "name": "marketList",
          "type": "tuple[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "digiOptionsMarkets",
      "outputs": [
        {
          "internalType": "contract DigiOptionsMarkets",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract DigiOptionsMarkets",
          "name": "addr",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "baseMarketHash",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "expirationDatetime",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "underlying",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "typeDuration",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "openDelaySeconds",
          "type": "uint16"
        }
      ],
      "name": "MarketCreateLister",
      "type": "event"
    }
  ];
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
