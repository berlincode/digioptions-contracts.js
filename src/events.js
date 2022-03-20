// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */

import {makeBatchRequestPromise, getPastEventsForBatchRequest, getBlockForBatchRequest} from './web3helpers';

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
  let eventLists = new Array(eventNameAndFilterList.length).fill(null).map(() => []); 
  let iteratorIdx = 0; // fill eventLists in-order
  let iterationsFinished = 0; // for progress calculation
  let error = null;
  let nextCallAllowed = 0;

  const iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);

  //for (let [eventName, _filter] of eventNameAndFilterList) {
  //  console.log('getPastEvents', eventName, fromBlock, toBlock);
  //}

  async function worker() {
    for (let blockRange of iterator) {
      const iteratorIdxCurrent = iteratorIdx++;
      // create an empty array for each eventNameAndFilter
      let eventsNew = new Array(eventNameAndFilterList.length).fill(null).map(() => []); 

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

          if (timestampStop && (idx===0)) {
            // additionally fetch block info (for timestamp) with BatchRequest of first entry in eventNameAndFilterList
            callsAndParams.push(
              [getBlockForBatchRequest(contract), blockRange.fromBlock]
            );
          }
          const results = await makeBatchRequestPromise(
            new contract.BatchRequest(),
            callsAndParams
          );
          eventsNew[idx] = results[0]; // result from getPastEvents

          if (results[1] && results[1].timestamp && (results[1].timestamp < timestampStop)) {
            // stop iterator
            iterator.stop();
          }

        } catch (err) {
          error = err;
          throw new Error(error);
        }
        eventLists[idx][iteratorIdxCurrent] = eventsNew[idx];
      }

      /* update progress */
      iterationsFinished++;
      if (progressCallback){
        // call progressCallback ?

        const now = Date.now();
        if (now > nextCallAllowed) {
          nextCallAllowed = now + progressCallbackDebounce;

          progressCallback(iterationsFinished/iterator.iterations(), eventsNew); // events might not be in order
        }
      }
    }
  }

  // create/start numConcurrency worker() promises - all will use the same idential iterator
  const workers = new Array(numConcurrency).fill(0).map(worker);

  await Promise.all(workers); // reject immediately if any of the promises reject 

  if (error){
    throw new Error(error);
  }

  // join all list of events for each eventNameAndFilter
  return eventLists.map(function(x){return [].concat.apply([], x);});
}

export {
  // defaults
  maximumBlockRangeDefault,
  numConcurrencyDefault,
  // functions
  blockIteratorReverse,
  getPastEvents,
};
