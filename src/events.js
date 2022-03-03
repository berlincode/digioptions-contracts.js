// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */

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
    [Symbol.iterator]: function() {return this;} // iterable protocol
  };
}

/* getPastEvents:
 *    similar to contract.getPastEvents() but iterates over a given block
 *    range in small chunks that are not larger that maximumBlockRange
 */
async function getPastEvents(
  contract,
  fromBlock,
  toBlock,
  eventNameAndFilterList,
  {
    numConcurrency = numConcurrencyDefault,
    maximumBlockRange = maximumBlockRangeDefault,
    blockIterator = blockIteratorReverse,
    progressCallback = null, /* returns a value between 0 and 1 */
  } = {}
){
  let eventLists = [];
  let iteratorIdx = 0; // fill eventLists in-order
  let iterationsFinished = 0; // for progress calculation

  async function worker(iterator) {
    for (let item of iterator) {
      const iteratorIdxCurrent = iteratorIdx++;
      let eventsNew = [];

      for (let [eventName, filter] of eventNameAndFilterList) {
        eventsNew = eventsNew.concat(
          await contract.getPastEvents(eventName, {
            filter: filter,
            fromBlock: item.fromBlock,
            toBlock: item.toBlock
          })
        );
      }
      eventLists[iteratorIdxCurrent] = eventsNew;

      /* update progress */
      iterationsFinished++;
      if (progressCallback){
        progressCallback(iterationsFinished/iterator.iterations(), eventsNew); // events might not be in order
      }
    }
  }

  const iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);
  // create/start numConcurrency worker() promises with the the same idential iterator 
  const workers = new Array(numConcurrency).fill(iterator).map(worker);

  await Promise.allSettled(workers);

  // join all lists
  return [].concat.apply([], eventLists);
}

export {
  // defaults
  maximumBlockRangeDefault,
  numConcurrencyDefault,
  // functions
  blockIteratorReverse,
  getPastEvents,
};
