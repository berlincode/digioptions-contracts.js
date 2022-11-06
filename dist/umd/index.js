// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "web3-utils", "factsigner", "eth-lib/lib/account", "./constants", "./constants", "./events", "./digioptions_markets_abi", "./digioptions_market_lister_abi"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.versionMarkets = exports.versionMarketLister = exports.versionToString = exports.versionFromInt = exports.signOrderOffer = exports.orderOfferToHash = exports.marketHash = exports.getPastEvents = exports.getMarketCreateEvents = exports.marketSearchSetup = exports.filterEventsByExpirationDatetime = exports.sortPositionChangeEventsByDatetime = exports.sortMarketCreateEventsByExpirationDatetime = exports.marketListerInfoToMarketListerDescription = exports.getContractInfo = exports.digioptionsMarketListerAbi = exports.digioptionsMarketsAbi = exports.marketStartMaxIntervalBeforeExpiration = exports.constants = exports.parseContractInfo = void 0;
    var web3Utils = __importStar(require("web3-utils"));
    var factsigner_1 = __importDefault(require("factsigner"));
    var ethLibAccount = __importStar(require("eth-lib/lib/account"));
    var constants = __importStar(require("./constants"));
    exports.constants = constants;
    var constants_1 = require("./constants");
    var events_1 = require("./events");
    exports.getPastEvents = events_1.getPastEvents;
    var digioptions_markets_abi_1 = __importDefault(require("./digioptions_markets_abi"));
    exports.digioptionsMarketsAbi = digioptions_markets_abi_1["default"];
    var digioptions_market_lister_abi_1 = __importDefault(require("./digioptions_market_lister_abi"));
    exports.digioptionsMarketListerAbi = digioptions_market_lister_abi_1["default"];
    /* returns a promise */
    function parseContractInfo(web3, contractAddr, contractInfo) {
        var type = Number(contractInfo[0]);
        var versionMarketLister = contractInfo[1];
        var versionMarkets = contractInfo[2];
        var marketsAddr = web3.utils.padLeft(web3.utils.toHex(contractInfo[3]), 40); // convert to sane ethereum address
        var blockCreated = Number(contractInfo[4]);
        var timestampCreatedMarkets = Number(contractInfo[5]);
        var offerMaxBlocksIntoFuture = Number(contractInfo[6]);
        var atomicOptionPayoutWeiExpBN = web3Utils.toBN(contractInfo[7]);
        var existingMarkets = web3Utils.toBN(contractInfo[8]);
        var contractMarkets = new web3.eth.Contract((0, digioptions_markets_abi_1["default"])(), marketsAddr);
        var contractMarketLister = ((type === constants_1.contractType.DIGIOPTIONSMARKETS) ?
            null
            :
                new web3.eth.Contract((0, digioptions_market_lister_abi_1["default"])(), contractAddr));
        var blockCreatedMarkets;
        var blockCreatedMarketLister;
        var prom;
        if (type === constants_1.contractType.DIGIOPTIONSMARKETS) {
            prom = Promise.resolve();
            blockCreatedMarkets = blockCreated;
            blockCreatedMarketLister = null;
        }
        else {
            // we have only blockCreated from contractMarketLister
            // so we fetch blockCreated from contractMarkets
            prom = contractMarkets.methods.getContractInfo().call()
                .then(function (contractInfo) {
                blockCreatedMarkets = Number(contractInfo[4]);
                blockCreatedMarketLister = blockCreated;
                return Promise.resolve();
            });
        }
        return prom
            .then(function () {
            return {
                contractAddr: contractAddr,
                contractType: type,
                contractMarkets: contractMarkets,
                contractMarketLister: contractMarketLister,
                contract: contractMarketLister || contractMarkets,
                versionMarketLister: (type !== constants_1.contractType.DIGIOPTIONSMARKETS) && versionFromInt(versionMarketLister),
                // constant values for markets contract
                marketsAddr: marketsAddr,
                versionMarkets: versionFromInt(versionMarkets),
                timestampCreatedMarkets: timestampCreatedMarkets,
                blockCreatedMarkets: blockCreatedMarkets,
                blockCreatedMarketLister: blockCreatedMarketLister,
                offerMaxBlocksIntoFuture: offerMaxBlocksIntoFuture,
                atomicOptionPayoutWeiExpBN: atomicOptionPayoutWeiExpBN,
                atomicOptionPayoutWeiBN: web3Utils.toBN('10').pow(atomicOptionPayoutWeiExpBN),
                atomicOptionsPerFullOptionBN: web3Utils.toBN('10').pow(web3Utils.toBN('18').sub(atomicOptionPayoutWeiExpBN)),
                // variable value which may change if new markets are opened
                existingMarkets: existingMarkets
            };
        });
    }
    exports.parseContractInfo = parseContractInfo;
    /* returns a promise */
    function getContractInfo(web3, contractAddr) {
        // use any contract abi for calling getContractInfo()
        var contract = new web3.eth.Contract((0, digioptions_markets_abi_1["default"])(), contractAddr);
        return contract.methods.getContractInfo().call()
            .then(function (contractInfo) {
            if (!contractInfo) {
                throw new Error('reading contract info/version failed');
            }
            return parseContractInfo(web3, contract.options.address, contractInfo);
        });
    }
    exports.getContractInfo = getContractInfo;
    function marketListerInfoToMarketListerDescription(web3, contractListerInfo) {
        var listerValues = contractListerInfo.listerValues;
        var signerDataList = contractListerInfo.signerDataList;
        var versionMarketLister = Number(listerValues[0]);
        var ownerAddr = web3Utils.padLeft(web3Utils.toHex(listerValues[1]), 40); // convert to sane ethereum address
        var transactionFeeTotalMax = listerValues[2];
        var transactionFee0Min = listerValues[3];
        var transactionFee1Min = listerValues[4];
        var transactionFeeSignerMin = listerValues[5];
        var openDelaySeconds = listerValues[6];
        return {
            listerValues: {
                versionMarketLister: versionMarketLister,
                ownerAddr: ownerAddr,
                transactionFeeTotalMax: transactionFeeTotalMax,
                transactionFee0Min: transactionFee0Min,
                transactionFee1Min: transactionFee1Min,
                transactionFeeSignerMin: transactionFeeSignerMin,
                openDelaySeconds: openDelaySeconds
            },
            signerDataList: signerDataList.map(function (signerData) {
                return {
                    signerAddr: web3.utils.toChecksumAddress(signerData.signerAddr),
                    value: web3Utils.toHex(signerData.value)
                };
            })
        };
    }
    exports.marketListerInfoToMarketListerDescription = marketListerInfoToMarketListerDescription;
    function sortMarketCreateEventsByExpirationDatetime(events) {
        // the first element will contain the market with the highest expiration date
        return events.sort(function (evtA, evtB) {
            // first try to sort by expirationDatetime
            if (evtB.returnValues.expirationDatetime !== evtA.returnValues.expirationDatetime) {
                return evtB.returnValues.expirationDatetime - evtA.returnValues.expirationDatetime;
            }
            // then sort by marketInterval (e.g. monthly before daily)
            if (evtB.returnValues.marketInterval !== evtA.returnValues.marketInterval) {
                return evtA.returnValues.marketInterval - evtB.returnValues.marketInterval;
            }
            // then sort by underlyingString
            if (evtB.returnValues.underlyingString !== evtA.returnValues.underlyingString) {
                if (evtB.returnValues.underlyingString > evtA.returnValues.underlyingString)
                    return -1;
                return 1;
            }
            // then try to sort by marketKey to get a deterministic dehavior
            if (evtB.returnValues.marketKey !== evtA.returnValues.marketKey) {
                if (evtB.returnValues.marketKey > evtA.returnValues.marketKey)
                    return -1;
                return 1;
            }
            return 0;
        });
    }
    exports.sortMarketCreateEventsByExpirationDatetime = sortMarketCreateEventsByExpirationDatetime;
    function sortPositionChangeEventsByDatetime(events) {
        // the first element will contain the event with the most recent date
        return events.sort(function (evtA, evtB) {
            // first try to sort by datetime
            if (evtA.returnValues.datetime !== evtB.returnValues.datetime) {
                return evtB.returnValues.datetime - evtA.returnValues.datetime;
            }
            // then try to sort by id to get a deterministic dehavior
            if (evtB.id !== evtA.id) {
                if (evtB.id > evtA.id)
                    return -1;
                return 1;
            }
            return 0;
        });
    }
    exports.sortPositionChangeEventsByDatetime = sortPositionChangeEventsByDatetime;
    function filterEventsByExpirationDatetime(events, expirationDatetimeStart, expirationDatetimeEnd) {
        // both ends (expirationDatetimeStart and expirationDatetimeEnd) included
        expirationDatetimeStart = expirationDatetimeStart || 0;
        expirationDatetimeEnd = expirationDatetimeEnd || constants_1.expirationDatetimeMax;
        return events.filter(function (evt) { return (evt.returnValues.expirationDatetime >= expirationDatetimeStart) && (evt.returnValues.expirationDatetime <= expirationDatetimeEnd); });
    }
    exports.filterEventsByExpirationDatetime = filterEventsByExpirationDatetime;
    var marketStartMaxIntervalBeforeExpiration = [
        0,
        730 * 24 * 60 * 60,
        190 * 24 * 60 * 60,
        // no QUATERLY support
        45 * 24 * 60 * 60,
        8 * 24 * 60 * 60,
        36 * 60 * 60,
        2 * 60 * 60, // TODO HOURLY: 5,
        //15 * 60// TODO SHORT_TERM: 6
    ];
    exports.marketStartMaxIntervalBeforeExpiration = marketStartMaxIntervalBeforeExpiration;
    function marketSearchSetup(contractInfo, blockTimestampLatest, toBlock, _a) {
        //  options = Object.assign({}, marketSearchOptions, options||{});
        var _b = _a === void 0 ? {} : _a, // options
        _c = _b.limitPerFetch, // options
        limitPerFetch = _c === void 0 ? null : _c, _d = _b.filterMarketCategories, filterMarketCategories = _d === void 0 ? null : _d, // e.g [factsigner.constants.marketCategory.CRYPTO, factsigner.constants.marketCategory.FINANCE],
        _e = _b.filterMarketIntervals, // e.g [factsigner.constants.marketCategory.CRYPTO, factsigner.constants.marketCategory.FINANCE],
        filterMarketIntervals = _e === void 0 ? null : _e, _f = _b.expirationDatetimeStart, expirationDatetimeStart = _f === void 0 ? 0 : _f, _g = _b.expirationDatetimeEnd, expirationDatetimeEnd = _g === void 0 ? constants_1.expirationDatetimeMax : _g, _h = _b.maximumBlockRange, maximumBlockRange = _h === void 0 ? events_1.maximumBlockRangeDefault : _h;
        return {
            contract: contractInfo.contractMarketLister || contractInfo.contractMarkets,
            eventName: contractInfo.contractMarketLister ? 'MarketCreateLister' : 'MarketCreate',
            fromBlock: contractInfo.blockCreatedMarketLister || contractInfo.blockCreatedMarkets,
            timestampCreatedMarkets: contractInfo.timestampCreatedMarkets,
            expirationDatetimeStart: expirationDatetimeStart,
            expirationDatetimeEnd: expirationDatetimeEnd,
            maximumBlockRange: maximumBlockRange,
            toBlock: toBlock,
            limitPerFetch: limitPerFetch,
            filterMarketCategories: filterMarketCategories,
            filterMarketIntervals: filterMarketIntervals,
            marketIntervalMin: Math.min.apply(null, filterMarketIntervals || constants_1.marketIntervalsAll),
            eventsRemainingReady: [],
            eventsRemaining: [],
            exhaustedGetPastEvents: false,
            exhausted: false
        };
    }
    exports.marketSearchSetup = marketSearchSetup;
    function getMarketCreateEvents(marketSearch) {
        marketSearch = Object.assign({}, marketSearch); // shallow copy
        /* if possible serve directly from cache */
        if ((marketSearch.limitPerFetch && (marketSearch.eventsRemainingReady.length >= marketSearch.limitPerFetch)) ||
            marketSearch.exhaustedGetPastEvents) {
            //console.log('return from cache');
            var events_2 = marketSearch.eventsRemainingReady.slice(0, marketSearch.limitPerFetch);
            // updated (copy of) marketSearch
            marketSearch.eventsRemainingReady = marketSearch.eventsRemainingReady.slice(marketSearch.limitPerFetch);
            marketSearch.exhausted = marketSearch.exhaustedGetPastEvents && (marketSearch.eventsRemainingReady.length == 0);
            return Promise.resolve([
                events_2,
                marketSearch
            ]);
        }
        var filter = {};
        if (marketSearch.filterMarketIntervals) {
            filter.marketInterval = marketSearch.filterMarketIntervals;
        }
        if (marketSearch.filterMarketCategories) {
            filter.marketCategory = marketSearch.filterMarketCategories;
        }
        var events = [];
        return (0, events_1.getPastEvents)(marketSearch.contract, marketSearch.fromBlock, // fromBlock
        marketSearch.toBlock, // toBlock
        [
            [
                marketSearch.eventName,
                filter
            ]
        ], {
            maximumBlockRange: marketSearch.maximumBlockRange,
            timestampStop: 0,
            progressCallback: function (progress, eventsList, blockInfo, final, exhausted, nextToBlock) {
                var e_1, _a, e_2, _b;
                var eventsNew = filterEventsByExpirationDatetime(eventsList[0], // result from the first (and only) eventNameAndFilter
                marketSearch.expirationDatetimeStart, //expirationDatetimeStart
                marketSearch.expirationDatetimeEnd //expirationDatetimeEnd
                );
                var eventsReady;
                if (final && exhausted) {
                    // we can savely just add all events
                    eventsReady = marketSearch.eventsRemaining.concat(eventsNew);
                    marketSearch.eventsRemaining = [];
                }
                else if (blockInfo && blockInfo.timestamp) {
                    // blockInfo might be null only if eventsList does not contain any events
                    eventsReady = [];
                    var eventsRemainingOld = marketSearch.eventsRemaining;
                    marketSearch.eventsRemaining = [];
                    // only return values where we are sure that they are in order
                    var timestamp = blockInfo.timestamp + marketStartMaxIntervalBeforeExpiration[marketSearch.marketIntervalMin];
                    try {
                        for (var eventsRemainingOld_1 = __values(eventsRemainingOld), eventsRemainingOld_1_1 = eventsRemainingOld_1.next(); !eventsRemainingOld_1_1.done; eventsRemainingOld_1_1 = eventsRemainingOld_1.next()) {
                            var evt = eventsRemainingOld_1_1.value;
                            if (evt.returnValues.expirationDatetime > timestamp) {
                                // we can only return values where we are sure that they are in order
                                eventsReady.push(evt);
                            }
                            else {
                                marketSearch.eventsRemaining.push(evt);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (eventsRemainingOld_1_1 && !eventsRemainingOld_1_1.done && (_a = eventsRemainingOld_1["return"])) _a.call(eventsRemainingOld_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    try {
                        for (var eventsNew_1 = __values(eventsNew), eventsNew_1_1 = eventsNew_1.next(); !eventsNew_1_1.done; eventsNew_1_1 = eventsNew_1.next()) {
                            var evt = eventsNew_1_1.value;
                            if (evt.returnValues.expirationDatetime > timestamp) {
                                // we can only return values where we are sure that they are in order
                                eventsReady.push(evt);
                            }
                            else {
                                marketSearch.eventsRemaining.push(evt);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (eventsNew_1_1 && !eventsNew_1_1.done && (_b = eventsNew_1["return"])) _b.call(eventsNew_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                else {
                    eventsReady = [];
                }
                var eventsReadySorted = sortMarketCreateEventsByExpirationDatetime(eventsReady);
                if (marketSearch.limitPerFetch) {
                    marketSearch.eventsRemainingReady = marketSearch.eventsRemainingReady.concat(eventsReadySorted);
                    if (marketSearch.limitPerFetch > events.length) {
                        var maxElementsToAdd = marketSearch.limitPerFetch - events.length;
                        events = events.concat(marketSearch.eventsRemainingReady.slice(0, maxElementsToAdd));
                        marketSearch.eventsRemainingReady = marketSearch.eventsRemainingReady.slice(maxElementsToAdd);
                    }
                }
                else {
                    // no limit so just add all events
                    events = events.concat(eventsReadySorted);
                }
                if (final) {
                    // updated (copy of) marketSearch
                    marketSearch.toBlock = nextToBlock;
                    marketSearch.exhaustedGetPastEvents = exhausted;
                    marketSearch.exhausted = marketSearch.exhaustedGetPastEvents && (marketSearch.eventsRemainingReady.length == 0);
                }
                if ((marketSearch.limitPerFetch) && (marketSearch.limitPerFetch <= events.length)) {
                    return false; // stop
                }
                return true; // do not stop getPastEvents()
            }
        })
            .then(function ( /*eventsList*/) {
            return ([
                events,
                marketSearch
            ]);
        });
    }
    exports.getMarketCreateEvents = getMarketCreateEvents;
    /* similar to factsigner's factHash() but with additional data to hash */
    function marketHash(marketBaseData) {
        factsigner_1["default"].validateDataForMarketHash(marketBaseData);
        // Split up string by '\0' (utf8ToHex() does not handle '\0'),
        // call utf8ToHex(), join string with '00'
        // and call keccak256().
        // This works with trailing '\0' (and strings that look like hex e.g. '0xff')
        var underlyingParts = marketBaseData.underlyingString.split('\0');
        var underlyingHex = '0x' + underlyingParts.map(function (part) { return web3Utils.utf8ToHex(part).replace(/^0x/, ''); }).join('00');
        var underlyingHash = web3Utils.keccak256(underlyingHex);
        var args = [
            { t: 'bytes32', v: underlyingHash },
            { t: 'uint40', v: marketBaseData.expirationDatetime },
            { t: 'uint24', v: marketBaseData.objectionPeriod },
            { t: 'uint8', v: marketBaseData.config },
            { t: 'uint8', v: marketBaseData.marketCategory },
            { t: 'uint8', v: marketBaseData.baseUnitExp },
            { t: 'int8', v: marketBaseData.ndigit },
            { t: 'uint8', v: marketBaseData.marketInterval },
            { t: 'address', v: marketBaseData.feeTaker0 },
            { t: 'address', v: marketBaseData.feeTaker1 },
            { t: 'address', v: marketBaseData.signerAddr },
            { t: 'uint8', v: marketBaseData.transactionFee0 },
            { t: 'uint8', v: marketBaseData.transactionFee1 },
            { t: 'uint8', v: marketBaseData.transactionFeeSigner }
        ];
        // take special care of strikes int128 array
        // see: https://github.com/ethereumjs/ethereumjs-abi/issues/27
        // see: https://github.com/ethereumjs/ethereumjs-abi/pull/47
        marketBaseData.strikes.map(function (val) {
            // repack out int128 as bytes32
            // TODO check if this works with negative strikes
            //args.push({t: 'bytes32', v: web3.utils.leftPad(addr, 64)val});
            args.push({ t: 'int256', v: val });
            //args.push({t: 'int128', v: val});
        });
        return web3Utils.soliditySha3.apply(this, args);
    }
    exports.marketHash = marketHash;
    function orderOfferToHash(order) {
        return web3Utils.soliditySha3({ t: 'address', v: order.marketsAddr }, { t: 'bytes32', v: order.marketHash }, { t: 'uint16', v: order.optionID }, { t: 'bool', v: order.buy }, { t: 'uint256', v: order.price }, { t: 'int256', v: order.size }, { t: 'uint256', v: order.offerID }, { t: 'uint256', v: order.blockExpires }, 
        // we do not need the address for the order itself, since the address is impliclitly
        // available via the signature
        // but if the address is contained, we can use this hash for order tracking too
        { t: 'address', v: order.offerOwner });
    }
    exports.orderOfferToHash = orderOfferToHash;
    function stringHexEncode(str) {
        var hex, i;
        var result = '';
        for (i = 0; i < str.length; i++) {
            hex = str.charCodeAt(i).toString(16);
            result += ('0' + hex).slice(-2);
        }
        return result;
    }
    /* for signing offers */ // TODO move to digioptions? / rename signOffer
    function signOfferHash(valueHex, privateKey) {
        valueHex = valueHex.replace(/^0x/, '');
        if (valueHex.length != 32 * 2)
            throw new Error('invalid valueHex');
        var messageHashHex = web3Utils.keccak256('0x' +
            // TODO other prefix
            stringHexEncode('\x19Ethereum Signed Message:\n32') +
            valueHex);
        var signature = ethLibAccount.sign(messageHashHex, privateKey);
        var vrs = ethLibAccount.decodeSignature(signature);
        return {
            v: parseInt(vrs[0]),
            r: vrs[1],
            s: vrs[2]
        };
    }
    function signOrderOffer(offer, privateKey) {
        return signOfferHash(orderOfferToHash(offer), privateKey);
    }
    exports.signOrderOffer = signOrderOffer;
    function versionFromInt(ver) {
        var verBn = web3Utils.toBN(ver);
        var mask = web3Utils.toBN('0xffff');
        return ({
            major: verBn.ushrn(32).uand(mask).toNumber(),
            minor: verBn.ushrn(16).uand(mask).toNumber(),
            bugfix: verBn.uand(mask).toNumber()
        });
    }
    exports.versionFromInt = versionFromInt;
    function versionToString(ver) {
        return (ver.major + '.' +
            ver.minor + '.' +
            ver.bugfix);
    }
    exports.versionToString = versionToString;
    var versionMarketLister = {
        major: 0,
        minor: 53,
        bugfix: 0
    };
    exports.versionMarketLister = versionMarketLister;
    var versionMarkets = {
        major: 0,
        minor: 53,
        bugfix: 0
    };
    exports.versionMarkets = versionMarkets;
});
//# sourceMappingURL=index.js.map