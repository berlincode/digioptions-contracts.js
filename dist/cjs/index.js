"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionMarkets = exports.versionMarketLister = exports.versionToString = exports.versionFromInt = exports.signOrderOffer = exports.orderOfferToHash = exports.marketHash = exports.getPastEvents = exports.getMarketDataList = exports.getMarketCreateEvents = exports.marketSearchSetup = exports.filterEventsByExpirationDatetime = exports.sortPositionChangeEventsByDatetime = exports.sortMarketCreateEventsByExpirationDatetime = exports.marketListerInfoToMarketListerDescription = exports.getContractInfo = exports.digioptionsMarketListerAbi = exports.digioptionsMarketsAbi = exports.marketStartMaxIntervalBeforeExpiration = void 0;
const web3Utils = __importStar(require("web3-utils"));
const factsigner_1 = __importDefault(require("factsigner"));
const ethLibAccount = __importStar(require("eth-lib/lib/account"));
const constants_1 = require("./constants");
const events_1 = require("./events");
Object.defineProperty(exports, "getPastEvents", { enumerable: true, get: function () { return events_1.getPastEvents; } });
const digioptions_markets_abi_1 = __importDefault(require("./digioptions_markets_abi"));
exports.digioptionsMarketsAbi = digioptions_markets_abi_1.default;
const digioptions_market_lister_abi_1 = __importDefault(require("./digioptions_market_lister_abi"));
exports.digioptionsMarketListerAbi = digioptions_market_lister_abi_1.default;
/* returns a promise */
function parseContractInfo(web3, contractAddr, contractInfo) {
    const type = Number(contractInfo[0]);
    const versionMarketLister = contractInfo[1];
    const versionMarkets = contractInfo[2];
    const marketsAddr = web3.utils.padLeft(web3.utils.toHex(contractInfo[3]), 40); // convert to sane ethereum address
    const blockCreated = Number(contractInfo[4]);
    const timestampCreatedMarkets = Number(contractInfo[5]);
    const offerMaxBlocksIntoFuture = Number(contractInfo[6]);
    const atomicOptionPayoutWeiExpBN = web3Utils.toBN(contractInfo[7]);
    const existingMarkets = web3Utils.toBN(contractInfo[8]);
    const contractMarkets = new web3.eth.Contract((0, digioptions_markets_abi_1.default)(), marketsAddr);
    const contractMarketLister = ((type === constants_1.contractType.DIGIOPTIONSMARKETS) ?
        null
        :
            new web3.eth.Contract((0, digioptions_market_lister_abi_1.default)(), contractAddr));
    let blockCreatedMarkets;
    let blockCreatedMarketLister;
    let prom;
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
/* returns a promise */
function getContractInfo(web3, contractAddr) {
    // use any contract abi for calling getContractInfo()
    const contract = new web3.eth.Contract((0, digioptions_markets_abi_1.default)(), contractAddr);
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
    const listerValues = contractListerInfo.listerValues;
    const signerDataList = contractListerInfo.signerDataList;
    const versionMarketLister = Number(listerValues[0]);
    const ownerAddr = web3Utils.padLeft(web3Utils.toHex(listerValues[1]), 40); // convert to sane ethereum address
    const transactionFeeTotalMax = listerValues[2];
    const transactionFee0Min = listerValues[3];
    const transactionFee1Min = listerValues[4];
    const transactionFeeSignerMin = listerValues[5];
    const openDelaySeconds = listerValues[6];
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
const marketStartMaxIntervalBeforeExpiration = [
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
function marketSearchSetup(contractInfo, blockTimestampLatest, toBlock, { // options
limitPerFetch = null, filterFunc = function () { return true; }, filterMarketCategories = null, // e.g [factsigner.constants.marketCategory.CRYPTO, factsigner.constants.marketCategory.FINANCE],
filterMarketIntervals = null, expirationDatetimeStart = 0, expirationDatetimeEnd = constants_1.expirationDatetimeMax, } = {}) {
    //  options = Object.assign({}, marketSearchOptions, options||{});
    return {
        contract: contractInfo.contractMarketLister || contractInfo.contractMarkets,
        eventName: contractInfo.contractMarketLister ? 'MarketCreateLister' : 'MarketCreate',
        fromBlock: contractInfo.blockCreatedMarketLister || contractInfo.blockCreatedMarkets,
        timestampCreatedMarkets: contractInfo.timestampCreatedMarkets,
        expirationDatetimeStart: expirationDatetimeStart,
        expirationDatetimeEnd: expirationDatetimeEnd,
        toBlock: toBlock,
        limitPerFetch: limitPerFetch,
        filterFunc: filterFunc,
        filterMarketCategories: filterMarketCategories,
        filterMarketIntervals: filterMarketIntervals,
        marketIntervalMin: Math.min.apply(null, filterMarketIntervals || constants_1.marketIntervalsAll),
        eventsRemainingReady: [],
        eventsRemaining: [],
        exhaustedGetPastEvents: false,
        exhausted: false,
    };
}
exports.marketSearchSetup = marketSearchSetup;
function getMarketCreateEvents(marketSearch) {
    marketSearch = Object.assign({}, marketSearch); // shallow copy
    /* if possible serve directly from cache */
    if ((marketSearch.limitPerFetch && (marketSearch.eventsRemainingReady.length >= marketSearch.limitPerFetch)) ||
        marketSearch.exhaustedGetPastEvents) {
        //console.log('return from cache');
        const events = marketSearch.eventsRemainingReady.slice(0, marketSearch.limitPerFetch);
        // updated (copy of) marketSearch
        marketSearch.eventsRemainingReady = marketSearch.eventsRemainingReady.slice(marketSearch.limitPerFetch);
        marketSearch.exhausted = marketSearch.exhaustedGetPastEvents && (marketSearch.eventsRemainingReady.length == 0);
        return Promise.resolve([
            events,
            marketSearch
        ]);
    }
    const filter = {};
    if (marketSearch.filterMarketIntervals) {
        filter.marketInterval = marketSearch.filterMarketIntervals;
    }
    if (marketSearch.filterMarketCategories) {
        filter.marketCategory = marketSearch.filterMarketCategories;
    }
    let events = [];
    return (0, events_1.getPastEvents)(marketSearch.contract, marketSearch.fromBlock, // fromBlock
    marketSearch.toBlock, // toBlock
    [
        [
            marketSearch.eventName,
            filter
        ]
    ], {
        timestampStop: 0,
        progressCallback: function (progress, eventsList, blockInfo, final, exhausted, nextToBlock) {
            const eventsNew = filterEventsByExpirationDatetime(eventsList[0], // result from the first (and only) eventNameAndFilter
            marketSearch.expirationDatetimeStart, //expirationDatetimeStart
            marketSearch.expirationDatetimeEnd //expirationDatetimeEnd
            );
            let eventsReady;
            if (final && exhausted) {
                // we can savely just add all events
                eventsReady = marketSearch.eventsRemaining.concat(eventsNew);
                marketSearch.eventsRemaining = [];
            }
            else if (blockInfo && blockInfo.timestamp) {
                // blockInfo might be null only if eventsList does not contain any events
                eventsReady = [];
                const eventsRemainingOld = marketSearch.eventsRemaining;
                marketSearch.eventsRemaining = [];
                // only return values where we are sure that they are in order
                const timestamp = blockInfo.timestamp + marketStartMaxIntervalBeforeExpiration[marketSearch.marketIntervalMin];
                for (const evt of eventsRemainingOld) {
                    if (evt.returnValues.expirationDatetime > timestamp) {
                        // we can only return values where we are sure that they are in order
                        eventsReady.push(evt);
                    }
                    else {
                        marketSearch.eventsRemaining.push(evt);
                    }
                }
                for (const evt of eventsNew) {
                    if (evt.returnValues.expirationDatetime > timestamp) {
                        // we can only return values where we are sure that they are in order
                        eventsReady.push(evt);
                    }
                    else {
                        marketSearch.eventsRemaining.push(evt);
                    }
                }
            }
            else {
                eventsReady = [];
            }
            const eventsReadySorted = sortMarketCreateEventsByExpirationDatetime(eventsReady);
            if (marketSearch.limitPerFetch) {
                marketSearch.eventsRemainingReady = marketSearch.eventsRemainingReady.concat(eventsReadySorted);
                if (marketSearch.limitPerFetch > events.length) {
                    const maxElementsToAdd = marketSearch.limitPerFetch - events.length;
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
function getMarketDataList(web3, contractAddr, userAddr, options) {
    const contract = new web3.eth.Contract((0, digioptions_markets_abi_1.default)(), contractAddr);
    let marketDataListAll = [];
    let marketSearch;
    let blockTimestampLatest;
    let toBlock;
    return web3.eth.getBlock('latest')
        .then(function (blockHeader) {
        blockTimestampLatest = blockHeader.timestamp;
        toBlock = blockHeader.number;
        return contract.methods.getContractInfo().call();
    })
        .then(function (contractInfo) {
        return parseContractInfo(web3, contractAddr, contractInfo);
    })
        .then(function (contractInfo) {
        marketSearch = marketSearchSetup(contractInfo, blockTimestampLatest, toBlock, options);
        return true; // dummy value
    })
        .then(function () {
        return getMarketCreateEvents(marketSearch);
    })
        .then(function (result) {
        const events = result[0];
        marketSearch = result[1]; //marketSearchNew
        //console.log('events', events);
        const marketKeys = events.map(function (evt) { return evt.returnValues.marketKey; });
        //console.log('marketKeys', contractAddr, marketKeys);
        const contract = marketSearch.contract;
        if (marketKeys.length == 0) {
            //console.log('TODO handle me 1'); // TODO handle
            return [];
        }
        return contract.methods.getMarketDataListByMarketKeys(userAddr, marketKeys)
            .call({});
    })
        .then(function (marketDataList) {
        marketDataListAll = marketDataListAll.concat(marketDataList.filter(marketSearch.filterFunc));
        return marketDataListAll;
    });
}
exports.getMarketDataList = getMarketDataList;
/* similar to factsigner's factHash() but with additional data to hash */
function marketHash(marketBaseData) {
    factsigner_1.default.validateDataForMarketHash(marketBaseData);
    // Split up string by '\0' (utf8ToHex() does not handle '\0'),
    // call utf8ToHex(), join string with '00'
    // and call keccak256().
    // This works with trailing '\0' (and strings that look like hex e.g. '0xff')
    const underlyingParts = marketBaseData.underlyingString.split('\0');
    const underlyingHex = '0x' + underlyingParts.map(function (part) { return web3Utils.utf8ToHex(part).replace(/^0x/, ''); }).join('00');
    const underlyingHash = web3Utils.keccak256(underlyingHex);
    const args = [
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
    let hex, i;
    let result = '';
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
    const messageHashHex = web3Utils.keccak256('0x' +
        // TODO other prefix
        stringHexEncode('\x19Ethereum Signed Message:\n32') +
        valueHex);
    const signature = ethLibAccount.sign(messageHashHex, privateKey);
    const vrs = ethLibAccount.decodeSignature(signature);
    return {
        v: parseInt(vrs[0]),
        r: vrs[1],
        s: vrs[2],
    };
}
function signOrderOffer(offer, privateKey) {
    return signOfferHash(orderOfferToHash(offer), privateKey);
}
exports.signOrderOffer = signOrderOffer;
function versionFromInt(ver) {
    const verBn = web3Utils.toBN(ver);
    const mask = web3Utils.toBN('0xffff');
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
const versionMarketLister = {
    major: 0,
    minor: 53,
    bugfix: 0
};
exports.versionMarketLister = versionMarketLister;
const versionMarkets = {
    major: 0,
    minor: 53,
    bugfix: 0
};
exports.versionMarkets = versionMarkets;
//# sourceMappingURL=index.js.map