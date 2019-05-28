
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
              "components": [
                {
                  "name": "winningOptionID",
                  "type": "uint16"
                },
                {
                  "name": "settled",
                  "type": "bool"
                }
              ],
              "name": "data",
              "type": "tuple"
            },
            {
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "name": "userState",
              "type": "uint8"
            },
            {
              "name": "testMarket",
              "type": "bool"
            }
          ],
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
              "components": [
                {
                  "name": "winningOptionID",
                  "type": "uint16"
                },
                {
                  "name": "settled",
                  "type": "bool"
                }
              ],
              "name": "data",
              "type": "tuple"
            },
            {
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "name": "userState",
              "type": "uint8"
            },
            {
              "name": "testMarket",
              "type": "bool"
            }
          ],
          "name": "marketData",
          "type": "tuple"
        }
      ],
      "name": "calcBaseMarketHash",
      "outputs": [
        {
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
          "name": "marketHash",
          "type": "bytes32"
        },
        {
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
      "inputs": [
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
      "name": "createMarket",
      "outputs": [
        {
          "name": "_marketHash",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "getContractInfo",
      "outputs": [
        {
          "name": "contractType",
          "type": "uint8"
        },
        {
          "name": "versionMarketLister",
          "type": "uint256"
        },
        {
          "name": "versionMarkets",
          "type": "uint256"
        },
        {
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
          "name": "marketHash",
          "type": "bytes32"
        },
        {
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
          "name": "filterTestMarkets",
          "type": "bool"
        },
        {
          "name": "filterNoTradedMarkets",
          "type": "bool"
        },
        {
          "name": "expirationDatetime",
          "type": "uint64"
        },
        {
          "name": "len",
          "type": "uint16"
        },
        {
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
              "components": [
                {
                  "name": "winningOptionID",
                  "type": "uint16"
                },
                {
                  "name": "settled",
                  "type": "bool"
                }
              ],
              "name": "data",
              "type": "tuple"
            },
            {
              "name": "marketHash",
              "type": "bytes32"
            },
            {
              "name": "userState",
              "type": "uint8"
            },
            {
              "name": "testMarket",
              "type": "bool"
            }
          ],
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
          "name": "baseMarketHash",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "expirationDatetime",
          "type": "uint64"
        },
        {
          "indexed": true,
          "name": "underlying",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "typeDuration",
          "type": "uint8"
        },
        {
          "indexed": false,
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
