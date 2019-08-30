
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
          "internalType": "int256",
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
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        }
      ],
      "name": "getLiquidityAndPositions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "liquidity",
          "type": "uint256"
        },
        {
          "internalType": "int256[]",
          "name": "positions",
          "type": "int256[]"
        },
        {
          "internalType": "enum DigiOptionsBaseInterface.UserState",
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
          "internalType": "uint256",
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
                  "internalType": "bytes32",
                  "name": "marketHash",
                  "type": "bytes32"
                },
                {
                  "internalType": "uint16",
                  "name": "optionID",
                  "type": "uint16"
                },
                {
                  "internalType": "bool",
                  "name": "buy",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "pricePerOption",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "size",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "offerID",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "blockExpires",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "offerOwner",
                  "type": "address"
                }
              ],
              "internalType": "struct DigiOptionsMarkets.OrderOffer",
              "name": "orderOffer",
              "type": "tuple"
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
          "internalType": "struct DigiOptionsMarkets.OrderOfferSigned",
          "name": "orderOfferSigned",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "sizeAccept",
          "type": "uint256"
        }
      ],
      "name": "orderExecuteTest",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "sizeAcceptPossible",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "offerHash",
          "type": "bytes32"
        },
        {
          "internalType": "int256",
          "name": "liquidityOfferOwner",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "liquidityOfferTaker",
          "type": "int256"
        },
        {
          "internalType": "uint256",
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
          "internalType": "uint64",
          "name": "expirationDatetime",
          "type": "uint64"
        }
      ],
      "name": "calcTypeDuration",
      "outputs": [
        {
          "internalType": "uint8",
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
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
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
      "name": "createMarket",
      "outputs": [
        {
          "internalType": "bytes32",
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
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        }
      ],
      "name": "getNumUsersToPayout",
      "outputs": [
        {
          "internalType": "uint256",
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
      "constant": false,
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "bytes32",
                  "name": "marketHash",
                  "type": "bytes32"
                },
                {
                  "internalType": "uint16",
                  "name": "optionID",
                  "type": "uint16"
                },
                {
                  "internalType": "bool",
                  "name": "buy",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "pricePerOption",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "size",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "offerID",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "blockExpires",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "offerOwner",
                  "type": "address"
                }
              ],
              "internalType": "struct DigiOptionsMarkets.OrderOffer",
              "name": "orderOffer",
              "type": "tuple"
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
          "internalType": "struct DigiOptionsMarkets.OrderOfferSigned[]",
          "name": "orderOfferSignedList",
          "type": "tuple[]"
        },
        {
          "internalType": "uint256",
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
        }
      ],
      "name": "calcFactHash",
      "outputs": [
        {
          "internalType": "bytes32",
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
          "internalType": "bytes32",
          "name": "marketHash",
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
          "internalType": "bytes32",
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
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "datetime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
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
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "marketHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "datetime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "optionID",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "pricePerOption",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "size",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
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
