"use strict";
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarketCreateEvents = exports.marketSearchSetup = void 0;
const constants_js_1 = require("./constants.js");
const events_js_1 = require("./events.js");
function sortEventsByExpirationDatetime(events) {
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
        // then try to sort by eventKey to get a deterministic dehavior
        if (evtB.returnValues.marketKey > evtA.returnValues.marketKey)
            return -1;
        if (evtB.returnValues.marketKey < evtA.returnValues.marketKey)
            return 1;
        return 0;
    });
}
function filterEventsByExpirationDatetime(events, expirationDatetimeStart, expirationDatetimeEnd) {
    // both ends (expirationDatetimeStart and expirationDatetimeEnd) included
    expirationDatetimeStart = expirationDatetimeStart || 0;
    expirationDatetimeEnd = expirationDatetimeEnd || (constants_js_1.expirationDatetimeMax + 1);
    return events.filter(function (evt) { return (evt.returnValues.expirationDatetime >= expirationDatetimeStart) && (evt.returnValues.expirationDatetime <= expirationDatetimeEnd); });
}
const dividers = [
    0,
    190 * 24 * 60 * 60,
    // no QUATERLY support
    45 * 24 * 60 * 60,
    8 * 24 * 60 * 60,
    36 * 60 * 60,
    2 * 60 * 60,
    15 * 60 // TODO SHORT_TERM: 6
];
const maxFuture = [
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
// default options
const marketSearchOptions = {
    //fromBlock, /* optional */
    //toBlock /* optional */
    //limitPerFetch: 20; // TODO add as option
    filterFunc: function () { return true; },
    filtersMax: 100,
    marketInterval: null,
    filterMarketCategories: null,
    //filterMarketCategories: [factsigner.constants.marketCategory.FINANCE],
    filterMarketIntervals: null
};
function marketSearchSetup(contractDescription, expirationDatetimeEnd, /* ether expirationDatetimeEnd OR blockTimestampLatest must be supplied */ blockTimestampLatest, toBlock, options) {
    const contractMarkets = contractDescription.contractMarkets;
    const contractMarketLister = contractDescription.contractMarketLister;
    const timestampCreatedMarkets = contractDescription.timestampCreatedMarkets;
    const fromBlock = contractDescription.blockCreated; //TODO is this the right
    options = Object.assign({}, marketSearchOptions, options || {});
    const filterMarketIntervals = options.filterMarketIntervals || constants_js_1.marketIntervalsAll;
    return {
        contractMarkets: contractMarkets,
        contractMarketLister: contractMarketLister,
        timestampCreatedMarkets: timestampCreatedMarkets,
        marketIntervalsSorted: filterMarketIntervals,
        expirationDatetimeEnd: expirationDatetimeEnd || constants_js_1.expirationDatetimeMax,
        // contains timestamps that are already included
        filterMarketIntervalsTimestamp: filterMarketIntervals.map(function (marketInterval) {
            // calculate (fake) last values to start with
            const divider = dividers[marketInterval];
            if (expirationDatetimeEnd) {
                return (Math.floor(expirationDatetimeEnd / divider) + 1) * divider;
            }
            // TODO +1?
            return (Math.floor((blockTimestampLatest + maxFuture[marketInterval]) / divider)) * divider;
        }),
        fromBlock: fromBlock || 0,
        toBlock: toBlock || 'latest',
        filterFunc: options.filterFunc,
        filtersMax: options.filtersMax,
        filterMarketCategories: options.filterMarketCategories,
        filterMarketIntervals: filterMarketIntervals,
        eventsRemainingReady: [],
        eventsRemaining: [],
        exhausted: false
    };
}
exports.marketSearchSetup = marketSearchSetup;
function getMarketCreateEventsIntern(contractDescription, marketSearch, expirationDatetimeStart, limit // TODO as part of options
) {
    expirationDatetimeStart = expirationDatetimeStart || marketSearch.timestampCreatedMarkets; // TODO
    const contractMarkets = marketSearch.contractMarkets;
    const contractMarketLister = marketSearch.contractMarketLister;
    const marketIntervalsSorted = marketSearch.marketIntervalsSorted;
    const filterMarketIntervalsTimestamp = marketSearch.filterMarketIntervalsTimestamp.slice(); // make a copy // TODO copy neccessary
    const expirationDatetimeEnd = marketSearch.expirationDatetimeEnd;
    const fromBlock = marketSearch.fromBlock;
    const toBlock = marketSearch.toBlock;
    const filtersMax = marketSearch.filtersMax;
    const expirationDatetimeFilterList = [];
    let maxValue, maxIndex;
    while (expirationDatetimeFilterList.length < filtersMax) {
        maxValue = filterMarketIntervalsTimestamp[0];
        maxIndex = 0;
        for (let i = 1; i < filterMarketIntervalsTimestamp.length; i++) {
            if (filterMarketIntervalsTimestamp[i] > maxValue) {
                maxIndex = i;
                maxValue = filterMarketIntervalsTimestamp[i];
            }
        }
        if (maxValue < expirationDatetimeStart) {
            break;
        }
        const marketInterval = marketIntervalsSorted[maxIndex];
        const divider = dividers[marketInterval];
        const x = Math.floor(filterMarketIntervalsTimestamp[maxIndex] / divider) - 1; // TODO rename / remove floor
        if (x >= 0) // TODO remove / should not be negative
            expirationDatetimeFilterList.push((x << 8) + marketInterval); // TODO switch
        filterMarketIntervalsTimestamp[maxIndex] = x * divider;
    }
    /* if possible serve directly from cache */
    if ((limit && (marketSearch.eventsRemainingReady.length >= limit)) ||
        (expirationDatetimeFilterList.length == 0)) {
        //console.log('return from cache');
        const events = marketSearch.eventsRemainingReady.slice(0, limit);
        const eventsRemainingReady = marketSearch.eventsRemainingReady.slice(limit);
        return Promise.resolve([
            events,
            // return updated marketSearch
            Object.assign({}, marketSearch, {
                eventsRemainingReady: eventsRemainingReady,
                exhausted: (expirationDatetimeFilterList.length === 0) && (eventsRemainingReady.length === 0)
            }),
        ]);
    }
    const eventName = contractMarketLister ? 'MarketCreateLister' : 'MarketCreate';
    const contract = contractMarketLister || contractMarkets;
    //console.log('expirationDatetimeFilterList:', expirationDatetimeFilterList.map(function(filterValue){return '0x'+filterValue.toString(16);}).join(',\n'));
    //console.log('expirationDatetimeFilterList.length:', expirationDatetimeFilterList.length);
    const filter = {
        expirationDatetimeFilter: expirationDatetimeFilterList
    };
    if (marketSearch.filterMarketCategories)
        filter.marketCategory = marketSearch.filterMarketCategories;
    return (0, events_js_1.getPastEvents)(contract, fromBlock, // fromBlock
    toBlock, // toBlock
    [
        [
            eventName,
            filter
        ]
    ])
        .then(function (eventsNew) {
        const eventsSorted = sortEventsByExpirationDatetime(filterEventsByExpirationDatetime(eventsNew.concat(marketSearch.eventsRemainingReady, marketSearch.eventsRemaining), expirationDatetimeStart, //expirationDatetimeStart
        expirationDatetimeEnd //expirationDatetimeEnd
        ));
        // TODO we can only return values where we are sure that they are in order
        const timestamp = Math.max.apply(null, filterMarketIntervalsTimestamp);
        let eventsRemainingReady = [];
        let eventsRemaining = [];
        let events = [];
        for (let idx = 0; idx < eventsSorted.length; idx++) {
            const evt = eventsSorted[idx];
            if (evt.returnValues.expirationDatetime < timestamp) {
                // TODO we can only return values where we are sure that they are in order
                eventsRemaining.push(evt);
            }
            else {
                events.push(evt);
            }
        }
        //maxValue, // TODO
        //console.log('limit', limit);
        if (limit) {
            eventsRemainingReady = events.slice(limit);
            events = events.slice(0, limit);
            //console.log('cache remain:', eventsRemainingReady.length, 'limit', limit);
        }
        return ([
            events,
            // return updated marketSearch
            Object.assign({}, marketSearch, {
                filterMarketIntervalsTimestamp: filterMarketIntervalsTimestamp,
                eventsRemainingReady: eventsRemainingReady,
                eventsRemaining: eventsRemaining,
                exhausted: (expirationDatetimeFilterList.length < filtersMax) && (eventsRemainingReady.length === 0)
            })
        ]);
    });
}
/* search for market creation events until (at least) one of the following points is true:
 *
 * limit is reached (if limit is given)
 * search is exhausted (expirationDatetimeStart or blockCreated is reached)
 * TODO
 */
function getMarketCreateEvents(contractDescription, marketSearch, expirationDatetimeStart, limit // TODO as part of options
) {
    let eventsAll = [];
    function loop() {
        return getMarketCreateEventsIntern(contractDescription, marketSearch, expirationDatetimeStart, limit)
            .then(function (results) {
            const events = results[0];
            marketSearch = results[1];
            eventsAll = eventsAll.concat(events);
            if (marketSearch.exhausted || (eventsAll.length > 0)) {
                return [eventsAll, marketSearch];
            }
            return loop();
        });
    }
    return loop();
}
exports.getMarketCreateEvents = getMarketCreateEvents;
