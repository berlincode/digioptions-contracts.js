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
    progressCallback = null, /* returns a value between 0 and 1 */
    blockIterator = blockIteratorReverse,
  } = {}
){
  let eventLists = [];
  let iteratorIdx = 0; // fill eventLists in-order
  let iterationsFinished = 0; // for progress calculation
  let error = null;

  const iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);

  //for (let [eventName, _filter] of eventNameAndFilterList) {
  //  console.log('getPastEvents', eventName, fromBlock, toBlock);
  //}

  async function worker() {
    for (let blockRange of iterator) {
      const iteratorIdxCurrent = iteratorIdx++;
      let eventsNew = [];

      for (let [eventName, filter] of eventNameAndFilterList) {
        if (error){
          // if any worker has has an error we stop this one too
          return;
        }
        try {
          eventsNew = eventsNew.concat(
            await contract.getPastEvents(
              eventName,
              {
                filter: filter,
                fromBlock: blockRange.fromBlock,
                toBlock: blockRange.toBlock
              }
            )
          );
        } catch (err) {
          error = err;
          throw new Error(error);
        }
      }
      eventLists[iteratorIdxCurrent] = eventsNew;

      /* update progress */
      iterationsFinished++;
      if (progressCallback){
        // call progressCallback after each blockRange
        progressCallback(iterationsFinished/iterator.iterations(), eventsNew); // events might not be in order
      }
    }
  }

  // create/start numConcurrency worker() promises - all will use the same idential iterator
  const workers = new Array(numConcurrency).fill(0).map(worker);

  await Promise.all(workers); // reject immediately if any of the promises reject 

  if (error){
    throw new Error(error);
  }

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
