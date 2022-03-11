// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */

import {expirationDatetimeMax, marketIntervalsAll} from './constants.js';
import {getPastEvents} from './events.js';

function sortEventsByExpirationDatetime(events){
  // the first element will contain the market with the highest expiration date
  return events.sort(function(evtA, evtB){
    // first try to sort by expirationDatetime
    if (evtB.returnValues.expirationDatetime !== evtA.returnValues.expirationDatetime){
      return evtB.returnValues.expirationDatetime - evtA.returnValues.expirationDatetime;
    }

    // then sort by marketInterval (e.g. monthly before daily)
    if (evtB.returnValues.marketInterval !== evtA.returnValues.marketInterval){
      return evtA.returnValues.marketInterval - evtB.returnValues.marketInterval;
    }

    // then sort by underlyingString
    if (evtB.returnValues.underlyingString !== evtA.returnValues.underlyingString){
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

function filterEventsByExpirationDatetime(events, expirationDatetimeStart, expirationDatetimeEnd){
  // both ends (expirationDatetimeStart and expirationDatetimeEnd) included
  expirationDatetimeStart = expirationDatetimeStart || 0;
  expirationDatetimeEnd = expirationDatetimeEnd || (expirationDatetimeMax+1);
  return events.filter(function(evt){return (evt.returnValues.expirationDatetime >= expirationDatetimeStart) && (evt.returnValues.expirationDatetime <= expirationDatetimeEnd);});
}

const dividers = [ // TODO rename into step... or segmentSizeSeconds ...
  0, // marketInterval.NONE // TODO how to handle?
  190 * 24 * 60 * 60, // YEARLY // TODO 190
  // no QUATERLY support
  45 * 24 * 60 * 60, // MONTHLY
  8 * 24 * 60 * 60, // WEEKLY
  36 * 60 * 60, // DAILY
  2 * 60 * 60, // TODO HOURLY: 5,
  15 * 60// TODO SHORT_TERM: 6
];

const maxFuture = [ // TODO rename into step... or segmentSizeSeconds ...
  0, // marketInterval.NONE // TODO how to handle?
  730 * 24 * 60 * 60,
  190 * 24 * 60 * 60, // YEARLY // TODO 190
  // no QUATERLY support
  45 * 24 * 60 * 60, // MONTHLY
  8 * 24 * 60 * 60, // WEEKLY
  36 * 60 * 60, // DAILY
  2 * 60 * 60, // TODO HOURLY: 5,
  //15 * 60// TODO SHORT_TERM: 6
];

// default options
const marketSearchOptions = {
  //fromBlock, /* optional */
  //toBlock /* optional */
  //limitPerFetch: 20; // TODO add as option
  filterFunc: function(){return true;},
  filtersMax: 100,
  marketInterval: null, // TODO
  filterMarketCategories: null, // e.g [factsigner.constants.marketCategory.CRYPTO]
  //filterMarketCategories: [factsigner.constants.marketCategory.FINANCE],
  filterMarketIntervals: null
};

function marketSearchSetup(
  contractDescription,
  expirationDatetimeEnd, /* ether expirationDatetimeEnd OR blockTimestampLatest must be supplied */
  blockTimestampLatest,
  toBlock,
  options
){
  var contractMarkets = contractDescription.contractMarkets;
  var contractMarketLister = contractDescription.contractMarketLister;
  var timestampCreatedMarkets = contractDescription.timestampCreatedMarkets;
  var fromBlock = contractDescription.blockCreated; //TODO is this the right

  options = Object.assign({}, marketSearchOptions, options||{});

  var filterMarketIntervals = options.filterMarketIntervals || marketIntervalsAll;

  return {
    contractMarkets: contractMarkets,
    contractMarketLister: contractMarketLister,
    timestampCreatedMarkets: timestampCreatedMarkets,
    marketIntervalsSorted: filterMarketIntervals, // TODO rename
    expirationDatetimeEnd: expirationDatetimeEnd || expirationDatetimeMax,
    // contains timestamps that are already included
    filterMarketIntervalsTimestamp: filterMarketIntervals.map(function(marketInterval){ // same order as filterMarketIntervals
      // calculate (fake) last values to start with
      var divider = dividers[marketInterval];
      if (expirationDatetimeEnd){
        return (Math.floor(expirationDatetimeEnd/divider)+1) * divider;
      }
      // TODO +1?
      return (Math.floor((blockTimestampLatest+maxFuture[marketInterval])/divider)) * divider;
    }),
    fromBlock: fromBlock || 0,
    toBlock: toBlock || 'latest',

    filterFunc: options.filterFunc,
    filtersMax: options.filtersMax,
    filterMarketCategories: options.filterMarketCategories,
    filterMarketIntervals: filterMarketIntervals,

    eventsRemainingReady: [], // these events are ready to serve
    eventsRemaining: [], // there might be still some events to be served before these events
    exhausted: false
  };
}

function getMarketCreateEventsIntern(
  contractDescription,
  marketSearch,
  expirationDatetimeStart,
  limit // TODO as part of options
){
  expirationDatetimeStart = expirationDatetimeStart || marketSearch.timestampCreatedMarkets; // TODO
  var contractMarkets = marketSearch.contractMarkets;
  var contractMarketLister = marketSearch.contractMarketLister;
  var marketIntervalsSorted = marketSearch.marketIntervalsSorted;
  var filterMarketIntervalsTimestamp = marketSearch.filterMarketIntervalsTimestamp.slice(); // make a copy // TODO copy neccessary
  var expirationDatetimeEnd = marketSearch.expirationDatetimeEnd;
  var fromBlock = marketSearch.fromBlock;
  var toBlock = marketSearch.toBlock;
  var filtersMax = marketSearch.filtersMax;

  var expirationDatetimeFilterList = [];

  var maxValue, maxIndex;
  while (expirationDatetimeFilterList.length < filtersMax){

    maxValue = filterMarketIntervalsTimestamp[0];
    maxIndex = 0;

    for (var i = 1; i < filterMarketIntervalsTimestamp.length; i++) {
      if (filterMarketIntervalsTimestamp[i] > maxValue) {
        maxIndex = i;
        maxValue = filterMarketIntervalsTimestamp[i];
      }
    }
    if (maxValue < expirationDatetimeStart){
      break;
    }

    var marketInterval = marketIntervalsSorted[maxIndex];
    var divider = dividers[marketInterval];

    var x = Math.floor(filterMarketIntervalsTimestamp[maxIndex]/divider)-1; // TODO rename / remove floor
    if (x >= 0) // TODO remove / should not be negative
      expirationDatetimeFilterList.push((x << 8) + marketInterval); // TODO switch
    filterMarketIntervalsTimestamp[maxIndex] = x*divider;
  }


  /* if possible serve directly from cache */
  if (
    (limit && (marketSearch.eventsRemainingReady.length >= limit)) ||
    (expirationDatetimeFilterList.length == 0)
  ){
    //console.log('return from cache');
    var events = marketSearch.eventsRemainingReady.slice(0, limit);
    var eventsRemainingReady = marketSearch.eventsRemainingReady.slice(limit);
    return Promise.resolve([
      events,
      // return updated marketSearch
      Object.assign({}, marketSearch, {
        eventsRemainingReady: eventsRemainingReady,
        exhausted: (expirationDatetimeFilterList.length === 0) && (eventsRemainingReady.length === 0)
      }),
    ]);
  }

  var eventName = contractMarketLister? 'MarketCreateLister' : 'MarketCreate';
  var contract = contractMarketLister || contractMarkets;

  //console.log('expirationDatetimeFilterList:', expirationDatetimeFilterList.map(function(filterValue){return '0x'+filterValue.toString(16);}).join(',\n'));
  //console.log('expirationDatetimeFilterList.length:', expirationDatetimeFilterList.length);

  var filter = {
    expirationDatetimeFilter: expirationDatetimeFilterList
  };
  if (marketSearch.filterMarketCategories)
    filter.marketCategory = marketSearch.filterMarketCategories;

  return getPastEvents(
    contract,
    fromBlock, // fromBlock
    toBlock, // toBlock
    [ //  eventNameAndFilterList,
      [
        eventName,
        filter
      ]
    ]
  )
    .then(function(eventsNew){
      var eventsSorted = sortEventsByExpirationDatetime(
        filterEventsByExpirationDatetime(
          eventsNew.concat(marketSearch.eventsRemainingReady, marketSearch.eventsRemaining),
          expirationDatetimeStart, //expirationDatetimeStart
          expirationDatetimeEnd //expirationDatetimeEnd
        )
      );

      // TODO we can only return values where we are sure that they are in order
      var timestamp = Math.max.apply(null, filterMarketIntervalsTimestamp);

      var eventsRemainingReady = [];
      var eventsRemaining = [];
      var events = [];
      for (var idx=0; idx < eventsSorted.length ; idx++){
        var evt = eventsSorted[idx];
        if(evt.returnValues.expirationDatetime < timestamp){
          // TODO we can only return values where we are sure that they are in order
          eventsRemaining.push(evt);
        } else {
          events.push(evt);
        }
      }

      //maxValue, // TODO
      //console.log('limit', limit);
      if (limit){
        eventsRemainingReady = events.slice(limit);
        events = events.slice(0, limit);
        //console.log('cache remain:', eventsRemainingReady.length, 'limit', limit);
      }
      return([
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
function getMarketCreateEvents(
  contractDescription,
  marketSearch,
  expirationDatetimeStart,
  limit // TODO as part of options
){
  var eventsAll = [];

  function loop(){
    return getMarketCreateEventsIntern(
      contractDescription,
      marketSearch,
      expirationDatetimeStart,
      limit
    )
      .then(function(results) {
        var events = results[0];
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

export {
  marketSearchSetup,
  getMarketCreateEvents,
};
