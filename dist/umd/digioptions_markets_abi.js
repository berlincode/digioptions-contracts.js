(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    // vim: sts=2:ts=2:sw=2
    /* eslint-disable quotes */
    var data = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
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
                    "internalType": "string",
                    "name": "underlyingString",
                    "type": "string"
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
                    "internalType": "uint256",
                    "name": "buyer",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "seller",
                    "type": "uint256"
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
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "marketHash",
                    "type": "bytes32"
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
            "name": "freeLiquidity",
            "outputs": [],
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
                    "components": [
                        {
                            "internalType": "int128",
                            "name": "value",
                            "type": "int128"
                        },
                        {
                            "internalType": "uint8",
                            "name": "rangeState",
                            "type": "uint8"
                        }
                    ],
                    "internalType": "struct DigiOptionsMarkets.Position[]",
                    "name": "positions",
                    "type": "tuple[]"
                },
                {
                    "internalType": "enum DigiOptionsLib.UserState",
                    "name": "userState",
                    "type": "uint8"
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
                }
            ],
            "name": "getMarketBaseDataByMarketHash",
            "outputs": [
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
            "name": "liquidityAdd",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "liquidityAddFor",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "liquidityGet",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "liquidity",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "liquidityWithdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
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
                            "internalType": "struct DigiOptionsLib.Signature",
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
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
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
                            "internalType": "struct DigiOptionsLib.Signature",
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
            "name": "settlement",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    /* eslint-enable quotes */
    function default_1() {
        return data;
    }
    exports["default"] = default_1;
});
//# sourceMappingURL=digioptions_markets_abi.js.map