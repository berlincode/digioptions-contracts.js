// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */

import * as web3Utils from 'web3-utils';
import factsigner from 'factsigner';
import * as ethLibAccount from 'eth-lib/lib/account';

import {contractType, expirationDatetimeMax, marketIntervalsAll} from './constants';
import {getPastEvents} from './events.js';
import digioptionsMarketsAbi from './digioptions_markets_abi';
import digioptionsMarketListerAbi from './digioptions_market_lister_abi';

/* returns a promise */
function contractInfoToContractDescription(web3, contractAddr, contractInfo){
  const type = Number(contractInfo[0]);
  const versionMarketLister = contractInfo[1];
  const versionMarkets = contractInfo[2];
  const marketsAddr = web3.utils.padLeft(web3.utils.toHex(contractInfo[3]), 40); // convert to sane ethereum address
  const blockCreated = Number(contractInfo[4]);
  const timestampCreatedMarkets = Number(contractInfo[5]);
  const offerMaxBlocksIntoFuture = Number(contractInfo[6]);
  const atomicOptionPayoutWeiExpBN = web3Utils.toBN(contractInfo[7]);
  const existingMarkets = web3Utils.toBN(contractInfo[8]);

  const contractMarkets = new web3.eth.Contract(
    digioptionsMarketsAbi(),
    marketsAddr
  );
  const contractMarketLister = ((type === contractType.DIGIOPTIONSMARKETS)?
    null
    :
    new web3.eth.Contract(
      digioptionsMarketListerAbi(),
      contractAddr
    )
  );

  let blockCreatedMarkets;
  let blockCreatedMarketLister;

  let prom;
  if (type === contractType.DIGIOPTIONSMARKETS){
    prom = Promise.resolve();
    blockCreatedMarkets = blockCreated;
    blockCreatedMarketLister = null; 
  } else {
    // we have only blockCreated from contractMarketLister
    // so we fetch blockCreated from contractMarkets
    prom = contractMarkets.methods.getContractInfo().call()
      .then(function(contractInfo){
        blockCreatedMarkets = Number(contractInfo[4]);
        blockCreatedMarketLister = blockCreated; 
        return Promise.resolve();
      });
  }

  return prom
    .then(function(){
      return {
        contractAddr: contractAddr,
        contractType: type,

        contractMarkets: contractMarkets,
        contractMarketLister: contractMarketLister,

        contract: contractMarketLister || contractMarkets, // TODO can we remove this?
        versionMarketLister: (type !== contractType.DIGIOPTIONSMARKETS) && versionFromInt(versionMarketLister),

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
function getContractInfo(web3, contractAddr){
  // use any contract abi for calling getContractInfo()
  const contract = new web3.eth.Contract(
    digioptionsMarketsAbi(),
    contractAddr
  );

  return contract.methods.getContractInfo().call()
    .then(function(contractInfo) {
      if (! contractInfo){
        throw new Error('reading contract info/version failed');
      }
      return contractInfoToContractDescription(
        web3,
        contract.options.address,
        contractInfo
      );
    });
}

function marketListerInfoToMarketListerDescription(web3, contractListerInfo){
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
    signerDataList: signerDataList.map(
      function(signerData){
        return {
          signerAddr: web3.utils.toChecksumAddress(signerData.signerAddr),
          value: web3Utils.toHex(signerData.value)
        };
      })
  };
}

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
  filterMarketCategories: null, // e.g [factsigner.constants.marketCategory.CRYPTO, factsigner.constants.marketCategory.FINANCE],
  filterMarketIntervals: null
};

function marketSearchSetup(
  contractDescription,
  expirationDatetimeEnd, /* ether expirationDatetimeEnd OR blockTimestampLatest must be supplied */
  blockTimestampLatest,
  toBlock,
  options
){
  const contractMarkets = contractDescription.contractMarkets;
  const contractMarketLister = contractDescription.contractMarketLister;
  const timestampCreatedMarkets = contractDescription.timestampCreatedMarkets;
  const fromBlock = contractDescription.blockCreated; //TODO is this the right

  options = Object.assign({}, marketSearchOptions, options||{});

  const filterMarketIntervals = options.filterMarketIntervals || marketIntervalsAll;

  return {
    contractMarkets: contractMarkets,
    contractMarketLister: contractMarketLister,
    timestampCreatedMarkets: timestampCreatedMarkets,
    marketIntervalsSorted: filterMarketIntervals, // TODO rename
    expirationDatetimeEnd: expirationDatetimeEnd || expirationDatetimeMax,
    // contains timestamps that are already included
    filterMarketIntervalsTimestamp: filterMarketIntervals.map(function(marketInterval){ // same order as filterMarketIntervals
      // calculate (fake) last values to start with
      const divider = dividers[marketInterval];
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
  while (expirationDatetimeFilterList.length < filtersMax){

    maxValue = filterMarketIntervalsTimestamp[0];
    maxIndex = 0;

    for (let i = 1; i < filterMarketIntervalsTimestamp.length; i++) {
      if (filterMarketIntervalsTimestamp[i] > maxValue) {
        maxIndex = i;
        maxValue = filterMarketIntervalsTimestamp[i];
      }
    }
    if (maxValue < expirationDatetimeStart){
      break;
    }

    const marketInterval = marketIntervalsSorted[maxIndex];
    const divider = dividers[marketInterval];

    const x = Math.floor(filterMarketIntervalsTimestamp[maxIndex]/divider)-1; // TODO rename / remove floor
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

  const eventName = contractMarketLister? 'MarketCreateLister' : 'MarketCreate';
  const contract = contractMarketLister || contractMarkets;

  //console.log('expirationDatetimeFilterList:', expirationDatetimeFilterList.map(function(filterValue){return '0x'+filterValue.toString(16);}).join(',\n'));
  //console.log('expirationDatetimeFilterList.length:', expirationDatetimeFilterList.length);

  const filter = {
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
    .then(function(eventsNewList){
      const eventsNew = eventsNewList[0]; // result from the first (and only) eventNameAndFilter
      const eventsSorted = sortEventsByExpirationDatetime(
        filterEventsByExpirationDatetime(
          eventsNew.concat(marketSearch.eventsRemainingReady, marketSearch.eventsRemaining),
          expirationDatetimeStart, //expirationDatetimeStart
          expirationDatetimeEnd //expirationDatetimeEnd
        )
      );

      // TODO we can only return values where we are sure that they are in order
      const timestamp = Math.max.apply(null, filterMarketIntervalsTimestamp);

      let eventsRemainingReady = [];
      let eventsRemaining = [];
      let events = [];
      for (let idx=0; idx < eventsSorted.length ; idx++){
        const evt = eventsSorted[idx];
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
  let eventsAll = [];

  function loop(){
    return getMarketCreateEventsIntern(
      contractDescription,
      marketSearch,
      expirationDatetimeStart,
      limit
    )
      .then(function(results) {
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

function getMarketDataList(web3, contractAddr, userAddr, expirationDatetime, options){
  const limitPerFetch = 20; // TODO
  const contract = new web3.eth.Contract(digioptionsMarketsAbi(), contractAddr);
  let marketDataListAll = [];
  let marketSearch;
  let contractDescription;

  function marketLoop(){
    return getMarketCreateEvents(
      contractDescription,
      marketSearch,
      expirationDatetime, /* expirationDatetimeStart */
      limitPerFetch //limit /* optional */
    )
      .then(function(result) {
        const events = result[0];
        marketSearch = result[1]; //marketSearchNew

        //console.log('events', events);
        const marketKeys = events.map(function(evt){return evt.returnValues.marketKey;});
        //console.log('marketKeys', contractAddr, marketKeys);
        const contract = marketSearch.contractMarketLister || marketSearch.contractMarkets;
        if (marketKeys.length == 0){
          //console.log('TODO handle me 1'); // TODO handle
          return [];
        }
        return contract.methods.getMarketDataListByMarketKeys(userAddr, marketKeys)
          .call({});
      })
      .then(function(marketDataList) {
        marketDataListAll = marketDataListAll.concat(marketDataList.filter(marketSearch.filterFunc));
        if (marketSearch.exhausted){ // TODO
          return marketDataListAll;
        }

        return marketLoop();
      });
  }

  let blockTimestampLatest;
  let toBlock;
  return web3.eth.getBlock('latest')
    .then(function(blockHeader) {
      blockTimestampLatest = blockHeader.timestamp;
      toBlock = blockHeader.number;
      return contract.methods.getContractInfo().call();
    })
    .then(function(contractInfo) {
      return contractInfoToContractDescription(
        web3,
        contractAddr,
        contractInfo
      );
    })
    .then(function(contractDescription) {

      marketSearch = marketSearchSetup(
        contractDescription,
        null, //expirationDatetimeEnd,
        blockTimestampLatest,
        toBlock,
        options
      );
      return true; // dummy value
    })
    .then(function() {
      return marketLoop();
    });
}


/* similar to factsigner's factHash() but with additional data to hash */
function marketHash(marketBaseData){

  factsigner.validateDataForMarketHash(marketBaseData);

  // Split up string by '\0' (utf8ToHex() does not handle '\0'),
  // call utf8ToHex(), join string with '00'
  // and call keccak256().
  // This works with trailing '\0' (and strings that look like hex e.g. '0xff')
  const underlyingParts = marketBaseData.underlyingString.split('\0');
  const underlyingHex = '0x' + underlyingParts.map(function(part){return web3Utils.utf8ToHex(part).replace(/^0x/, '');}).join('00');
  const underlyingHash = web3Utils.keccak256(underlyingHex);

  const args = [
    {t: 'bytes32', v: underlyingHash},
    {t: 'uint40', v: marketBaseData.expirationDatetime},
    {t: 'uint24', v: marketBaseData.objectionPeriod},
    {t: 'uint8', v: marketBaseData.config},
    {t: 'uint8', v: marketBaseData.marketCategory},

    {t: 'uint8', v: marketBaseData.baseUnitExp},
    {t: 'int8', v: marketBaseData.ndigit},

    {t: 'uint8', v: marketBaseData.marketInterval},
    {t: 'address', v: marketBaseData.feeTaker0},
    {t: 'address', v: marketBaseData.feeTaker1},
    {t: 'address', v: marketBaseData.signerAddr},
    {t: 'uint8', v: marketBaseData.transactionFee0},
    {t: 'uint8', v: marketBaseData.transactionFee1},
    {t: 'uint8', v: marketBaseData.transactionFeeSigner}
  ];

  // take special care of strikes int128 array
  // see: https://github.com/ethereumjs/ethereumjs-abi/issues/27
  // see: https://github.com/ethereumjs/ethereumjs-abi/pull/47
  marketBaseData.strikes.map(
    function(val){
      // repack out int128 as bytes32
      // TODO check if this works with negative strikes
      //args.push({t: 'bytes32', v: web3.utils.leftPad(addr, 64)val});
      args.push({t: 'int256', v: val});
      //args.push({t: 'int128', v: val});
    }
  );

  return web3Utils.soliditySha3.apply(this, args);
}

function orderOfferToHash(order){
  return web3Utils.soliditySha3(
    {t: 'address', v: order.marketsAddr},
    {t: 'bytes32', v: order.marketHash},
    {t: 'uint16', v: order.optionID},
    {t: 'bool', v: order.buy},
    {t: 'uint256', v: order.price},
    {t: 'int256', v: order.size},
    {t: 'uint256', v: order.offerID},
    {t: 'uint256', v: order.blockExpires},
    // we do not need the address for the order itself, since the address is impliclitly
    // available via the signature
    // but if the address is contained, we can use this hash for order tracking too
    {t: 'address', v: order.offerOwner}
  );
}

function stringHexEncode(str){
  let hex, i;

  let result = '';
  for (i=0; i<str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ('0'+hex).slice(-2);
  }

  return result;
}

/* for signing offers */ // TODO move to digioptions? / rename signOffer
function signOfferHash(valueHex, privateKey) {
  valueHex = valueHex.replace(/^0x/, '');

  if (valueHex.length != 32*2)
    throw new Error('invalid valueHex');

  const messageHashHex = web3Utils.keccak256(
    '0x' +
    // TODO other prefix
    stringHexEncode('\x19Ethereum Signed Message:\n32') +
    valueHex
  );
  const signature = ethLibAccount.sign(messageHashHex, privateKey);
  const vrs = ethLibAccount.decodeSignature(signature);
  return {
    v: parseInt(vrs[0]), // TODO convert from '0x1c' to int
    r: vrs[1],
    s: vrs[2],
  };
}

function signOrderOffer(offer, privateKey) {
  return signOfferHash(orderOfferToHash(offer), privateKey);
}

function versionFromInt(ver){
  const verBn = web3Utils.toBN(ver);
  const mask = web3Utils.toBN('0xffff');
  return ({
    major: verBn.ushrn(32).uand(mask).toNumber(),
    minor: verBn.ushrn(16).uand(mask).toNumber(),
    bugfix: verBn.uand(mask).toNumber()
  });
}

function versionToString(ver){
  return (
    ver.major + '.' +
    ver.minor + '.' +
    ver.bugfix
  );
}

const versionMarketLister = {
  major: 0,
  minor: 53,
  bugfix: 0
};
const versionMarkets = {
  major: 0,
  minor: 53,
  bugfix: 0
};

export {
  digioptionsMarketsAbi,
  digioptionsMarketListerAbi,
  contractInfoToContractDescription,
  getContractInfo,
  marketListerInfoToMarketListerDescription,
  sortEventsByExpirationDatetime,
  filterEventsByExpirationDatetime,
  marketSearchSetup,
  getMarketCreateEvents,
  getMarketDataList,
  marketHash,
  orderOfferToHash,
  signOrderOffer,
  versionFromInt,
  versionToString,
  versionMarketLister,
  versionMarkets,
};
