"use strict";
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPastEvents = exports.blockIteratorReverse = exports.numConcurrencyDefault = exports.maximumBlockRangeDefault = void 0;
const batch_1 = require("./batch");
const maximumBlockRangeDefault = 172800;
exports.maximumBlockRangeDefault = maximumBlockRangeDefault;
const numConcurrencyDefault = 2;
exports.numConcurrencyDefault = numConcurrencyDefault;
function blockIteratorReverse(fromBlock, toBlock, maximumBlockRange) {
    let done = false;
    const iterations = Math.max(Math.floor((toBlock - fromBlock) / maximumBlockRange) + 1, 0);
    return {
        next: function () {
            if (toBlock < fromBlock) {
                done = true;
            }
            if (done) {
                return { value: {}, done: done };
            }
            const value = {
                fromBlock: Math.max(toBlock - maximumBlockRange + 1, fromBlock),
                toBlock: toBlock
            };
            toBlock = toBlock - maximumBlockRange;
            return { value: value, done: done };
        },
        iterations: function () {
            return iterations;
        },
        isExhausted: function () {
            return (toBlock < fromBlock);
        },
        nextToBlock: function () {
            return toBlock; // use only if not exhausted
        },
        stop: function () {
            done = true;
        },
        [Symbol.iterator]: function () { return this; } // iterable protocol
    };
}
exports.blockIteratorReverse = blockIteratorReverse;
/* push in arrays with and index and get back them back concatenated in order */
function inOrderArrayProducer() {
    const dataArrays = [];
    let idxStartNext = 0;
    function getIdxEnd() {
        // returns the last index+1 of continous filled area
        let idxEnd = idxStartNext;
        while (dataArrays[idxEnd] !== undefined) {
            idxEnd++;
        }
        return idxEnd;
    }
    return {
        getAll: function () {
            return [].concat.apply([], dataArrays);
        },
        getNew: function () {
            const idxEnd = getIdxEnd();
            const array = [].concat.apply([], dataArrays.slice(idxStartNext, idxEnd));
            idxStartNext = idxEnd;
            return array;
        },
        getLast: function () {
            // returns null if nothing to return
            const idxEnd = getIdxEnd();
            if (idxEnd > idxStartNext) {
                idxStartNext = idxEnd;
                return dataArrays[idxEnd - 1];
            }
            return null;
        },
        push: function (idx, dataArray) {
            dataArrays[idx] = dataArray;
        },
    };
}
/* getPastEvents:
 *    similar to contract.getPastEvents() but iterates over a given block
 *    range in small chunks that are not larger that maximumBlockRange
 *    returns an array of array of events
 */
function getPastEvents(contract, fromBlock, toBlock, eventNameAndFilterList, { numConcurrency = numConcurrencyDefault, maximumBlockRange = maximumBlockRangeDefault, progressCallback = null, /* returns a value between 0 and 1 */ blockIterator = blockIteratorReverse, progressCallbackDebounce = 350, // in milliseconds
timestampStop = null, // stop iterator if timestamp is reached (unix epoch) / set to 0 to just get the block information
 } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventLists = new Array(eventNameAndFilterList.length).fill(null).map(() => inOrderArrayProducer());
        const blockInfos = inOrderArrayProducer();
        const iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);
        let iteratorIdx = 0; // fill eventLists in-order
        let iterationsFinished = 0; // for progress calculation
        let error = null; // stop all workers on error 
        let nextCallAllowed = 0; // for callback debouning
        //for (let [eventName, _filter] of eventNameAndFilterList) {
        //  console.log('getPastEvents', eventName, fromBlock, toBlock);
        //}
        function worker() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let blockRange of iterator) {
                    const iteratorIdxCurrent = iteratorIdx++;
                    const eventNewList = new Array(eventNameAndFilterList.length).fill(null).map(() => []);
                    let block = null;
                    for (const [idx, eventNameAndFilter] of eventNameAndFilterList.entries()) {
                        const [eventName, filter] = eventNameAndFilter;
                        if (error) {
                            // if any worker has has an error we stop this one too
                            return;
                        }
                        try {
                            const callsAndParams = [
                                (0, batch_1.getPastEventsForBatchRequest)(contract, eventName, {
                                    filter: filter,
                                    fromBlock: blockRange.fromBlock,
                                    toBlock: blockRange.toBlock
                                })
                            ];
                            if ((timestampStop !== null) && (idx === 0)) {
                                // additionally make getBlock() call (for timestamp) with BatchRequest of first entry in eventNameAndFilterList
                                callsAndParams.push([(0, batch_1.getBlockForBatchRequest)(contract), blockRange.fromBlock]);
                            }
                            const results = yield (0, batch_1.makeBatchRequestPromise)(new contract.BatchRequest(), callsAndParams);
                            eventNewList[idx] = results[0]; // result[0] is from getPastEvents
                            if (results[1] && results[1].timestamp) {
                                block = results[1]; // result[0] is from getBlock
                                if (block.timestamp <= timestampStop) {
                                    // stop iterator
                                    iterator.stop();
                                }
                            }
                        }
                        catch (err) {
                            error = err;
                            throw new Error(error);
                        }
                    }
                    // add all events for the same blockRange at once
                    for (const [idx, eventList] of eventLists.entries()) {
                        eventList.push(iteratorIdxCurrent, eventNewList[idx]);
                    }
                    blockInfos.push(iteratorIdxCurrent, { number: blockRange.fromBlock, timestamp: block && block.timestamp });
                    /* update progress */
                    iterationsFinished++;
                    if (progressCallback) {
                        // call progressCallback ?
                        const now = Date.now();
                        if (now > nextCallAllowed) {
                            nextCallAllowed = now + progressCallbackDebounce;
                            if (progressCallback(iterationsFinished / iterator.iterations(), // progress // TODO better estimate if timestampStop is used
                            eventLists.map(function (x) { return x.getNew(); }), blockInfos.getLast(), // might be null
                            false) == false) {
                                iterator.stop(); // stop if progressCallback returns false
                            }
                        }
                    }
                }
            });
        }
        // create/start numConcurrency worker() promises - all will use the same idential iterator
        const workers = new Array(numConcurrency).fill(0).map(worker);
        yield Promise.all(workers); // reject immediately if any of the promises reject 
        const blockInfo = blockInfos.getLast(); // might be null
        let exhausted = iterator.isExhausted();
        if (timestampStop !== null) {
            if (blockInfo && blockInfo.timestamp && (blockInfo.timestamp <= timestampStop)) {
                exhausted = true;
            }
        }
        /* final progressCallback */
        if (progressCallback) {
            progressCallback(1, // progress
            eventLists.map(function (x) { return x.getNew(); }), blockInfo, // might be null
            true, // final
            // extra arguments if final == true
            exhausted, iterator.nextToBlock());
        }
        if (error) {
            throw new Error(error);
        }
        // join all list of events for each eventNameAndFilter
        return eventLists.map(function (x) { return x.getAll(); });
    });
}
exports.getPastEvents = getPastEvents;
//# sourceMappingURL=events.js.map