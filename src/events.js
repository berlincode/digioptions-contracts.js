// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */

import {makeBatchRequestPromise, getPastEventsForBatchRequest, getBlockForBatchRequest} from './batch';

const maximumBlockRangeDefault = 172800;
const numConcurrencyDefault = 2;

function blockIteratorReverse(fromBlock, toBlock, maximumBlockRange) {

  let done = false;
  const iterations = Math.max(Math.floor((toBlock-fromBlock)/maximumBlockRange)+1, 0);

  return {
    next: function() { // iterator protocol

      const value = {
        fromBlock: Math.max(toBlock-maximumBlockRange+1, fromBlock),
        toBlock: toBlock
      };

      if (toBlock < fromBlock){
        done = true;
      }

      toBlock = toBlock - maximumBlockRange;

      return {value: value, done: done};
    },
    iterations: function(){ // custom method for progress calculation
      return iterations;
    },
    stop: function(){
      done = true;
    },
    [Symbol.iterator]: function() {return this;} // iterable protocol
  };
}

/* push in arrays with and index and get back them back concatenated in order */
function inOrderArrayProducer() {
  const dataArrays = [];
  let idxStartNext = 0;

  return {
    getAll: function() {
      return [].concat.apply([], dataArrays);
    },
    getNew: function() { // returns all in order
      let idxEnd = idxStartNext;
      while(dataArrays[idxEnd] !== undefined){
        idxEnd ++;
      }
      console.log('---', idxStartNext, idxEnd);
      const array = [].concat.apply([], dataArrays.slice(idxStartNext, idxEnd));
      idxStartNext = idxEnd;
      return array;
    },
    push: function(idx, dataArray){ // custom method for progress calculation
      dataArrays[idx] = dataArray;
    },
  };
}

/* getPastEvents:
 *    similar to contract.getPastEvents() but iterates over a given block
 *    range in small chunks that are not larger that maximumBlockRange
 *    returns an array of array of events
 */
async function getPastEvents(
  contract,
  fromBlock,
  toBlock,
  eventNameAndFilterList,
  {
    numConcurrency = numConcurrencyDefault,
    maximumBlockRange = maximumBlockRangeDefault,
    progressCallback = null, /* returns a value between 0 and 1 */
    blockIterator = blockIteratorReverse,
    progressCallbackDebounce = 350, // in milliseconds
    timestampStop = null, // stop iterator if timestamp is reached (unix epoch)
  } = {}
){
  const eventLists = new Array(eventNameAndFilterList.length).fill(null).map(() => inOrderArrayProducer()); 
  const iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);

  let iteratorIdx = 0; // fill eventLists in-order
  let iterationsFinished = 0; // for progress calculation
  let error = null; // stop all workers on error 
  let nextCallAllowed = 0; // for callback debouning

  //for (let [eventName, _filter] of eventNameAndFilterList) {
  //  console.log('getPastEvents', eventName, fromBlock, toBlock);
  //}

  async function worker() {
    for (let blockRange of iterator) {
      const iteratorIdxCurrent = iteratorIdx++;

      for (const [idx, eventNameAndFilter] of eventNameAndFilterList.entries()) {
        const [eventName, filter] = eventNameAndFilter;
        if (error){
          // if any worker has has an error we stop this one too
          return;
        }
        try {

          const callsAndParams = [
            getPastEventsForBatchRequest(
              contract, 
              eventName,
              {
                filter: filter,
                fromBlock: blockRange.fromBlock,
                toBlock: blockRange.toBlock
              }
            )
          ];

          if ((timestampStop !== null) && (idx===0)) {
            // additionally fetch block info (for timestamp) with BatchRequest of first entry in eventNameAndFilterList
            callsAndParams.push(
              [getBlockForBatchRequest(contract), blockRange.fromBlock]
            );
          }
          const results = await makeBatchRequestPromise(
            new contract.BatchRequest(),
            callsAndParams
          );
          eventLists[idx].push(iteratorIdxCurrent, results[0]); // result[0] is from getPastEvents

          if (results[1] && results[1].timestamp && (results[1].timestamp <= timestampStop)) {
            // stop iterator
            iterator.stop();
          }

        } catch (err) {
          error = err;
          throw new Error(error);
        }
      }

      /* update progress */
      iterationsFinished++;
      if (progressCallback){
        // call progressCallback ?

        const now = Date.now();
        if (now > nextCallAllowed) {
          nextCallAllowed = now + progressCallbackDebounce;

          // TODO better estimate if timestampStop is used
          progressCallback(
            iterationsFinished/iterator.iterations(), // progress
            eventLists.map(function(x){return x.getNew();}),
            false, // final
          );
        }
      }
    }
  }

  // create/start numConcurrency worker() promises - all will use the same idential iterator
  const workers = new Array(numConcurrency).fill(0).map(worker);

  await Promise.all(workers); // reject immediately if any of the promises reject 

  /* final progressCallback */
  if (progressCallback){
    progressCallback(
      1, // progress
      eventLists.map(function(x){return x.getNew();}),
      true // final
    );
  }

  if (error){
    throw new Error(error);
  }

  // join all list of events for each eventNameAndFilter
  return eventLists.map(function(x){return x.getAll();});
}

export {
  // defaults
  maximumBlockRangeDefault,
  numConcurrencyDefault,
  // functions
  blockIteratorReverse,
  getPastEvents,
};
