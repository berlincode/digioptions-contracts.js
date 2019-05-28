
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_markets_abi = factory();
  }
})(this, function(){

  /* eslint-disable quotes */
  var data = [
    {
      "constant": true,
      "inputs": [],
      "name": "PAYOUT_PER_NANOOPTION",
      "outputs": [
        {
          "name": "",
          "type": "int256"
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
      "name": "getLiquidityAndPositions",
      "outputs": [
        {
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "name": "positions",
          "type": "int256[]"
        },
        {
          "name": "userState",
          "type": "uint8"
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
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "liquidityWithdraw",
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
                  "name": "marketHash",
                  "type": "bytes32"
                },
                {
                  "name": "optionID",
                  "type": "uint16"
                },
                {
                  "name": "buy",
                  "type": "bool"
                },
                {
                  "name": "pricePerOption",
                  "type": "uint256"
                },
                {
                  "name": "size",
                  "type": "uint256"
                },
                {
                  "name": "offerID",
                  "type": "uint256"
                },
                {
                  "name": "blockExpires",
                  "type": "uint256"
                },
                {
                  "name": "offerOwner",
                  "type": "address"
                }
              ],
              "name": "orderOffer",
              "type": "tuple"
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
          "name": "orderOfferSigned",
          "type": "tuple"
        },
        {
          "name": "sizeAccept",
          "type": "uint256"
        }
      ],
      "name": "orderExecuteTest",
      "outputs": [
        {
          "name": "sizeAcceptPossible",
          "type": "uint256"
        },
        {
          "name": "offerHash",
          "type": "bytes32"
        },
        {
          "name": "liquidityOfferOwner",
          "type": "int256"
        },
        {
          "name": "liquidityOfferTaker",
          "type": "int256"
        },
        {
          "name": "transactionFeeAmount",
          "type": "uint256"
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
          "name": "marketData",
          "type": "tuple"
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
          "name": "expirationDatetime",
          "type": "uint64"
        }
      ],
      "name": "calcTypeDuration",
      "outputs": [
        {
          "name": "factHash",
          "type": "uint8"
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
          "name": "marketHash",
          "type": "bytes32"
        },
        {
          "name": "maxNumUsersToPayout",
          "type": "uint256"
        }
      ],
      "name": "settlementPayOut",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
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
      "name": "settlement",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
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
      "constant": true,
      "inputs": [
        {
          "name": "marketHash",
          "type": "bytes32"
        }
      ],
      "name": "getNumUsersToPayout",
      "outputs": [
        {
          "name": "numUsersToPayout",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "liquidityAdd",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
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
      "constant": false,
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "name": "marketHash",
                  "type": "bytes32"
                },
                {
                  "name": "optionID",
                  "type": "uint16"
                },
                {
                  "name": "buy",
                  "type": "bool"
                },
                {
                  "name": "pricePerOption",
                  "type": "uint256"
                },
                {
                  "name": "size",
                  "type": "uint256"
                },
                {
                  "name": "offerID",
                  "type": "uint256"
                },
                {
                  "name": "blockExpires",
                  "type": "uint256"
                },
                {
                  "name": "offerOwner",
                  "type": "address"
                }
              ],
              "name": "orderOffer",
              "type": "tuple"
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
          "name": "orderOfferSignedList",
          "type": "tuple[]"
        },
        {
          "name": "sizeAcceptMax",
          "type": "uint256"
        }
      ],
      "name": "orderExecute",
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
        }
      ],
      "name": "calcFactHash",
      "outputs": [
        {
          "name": "factHash",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
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
          "name": "marketHash",
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
        }
      ],
      "name": "MarketCreate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "marketHash",
          "type": "bytes32"
        }
      ],
      "name": "MarketSettlement",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "addr",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "datetime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "int256"
        }
      ],
      "name": "LiquidityAddWithdraw",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "marketHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "datetime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "optionID",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "pricePerOption",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "size",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "offerHash",
          "type": "bytes32"
        }
      ],
      "name": "PositionChange",
      "type": "event"
    }
  ];
  /* eslint-enable quotes */
  return function(){
    return data;
  };
});
