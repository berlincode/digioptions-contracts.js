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
const maximumBlockRangeDefault = 172800;
exports.maximumBlockRangeDefault = maximumBlockRangeDefault;
const numConcurrencyDefault = 2;
exports.numConcurrencyDefault = numConcurrencyDefault;
function blockIteratorReverse(fromBlock, toBlock, maximumBlockRange) {
    let done = false;
    const iterations = Math.max(Math.floor((toBlock - fromBlock) / maximumBlockRange) + 1, 0);
    return {
        next: function () {
            const value = {
                fromBlock: Math.max(toBlock - maximumBlockRange + 1, fromBlock),
                toBlock: toBlock
            };
            if (toBlock < fromBlock) {
                done = true;
            }
            toBlock = toBlock - maximumBlockRange;
            return { value: value, done: done };
        },
        iterations: function () {
            return iterations;
        },
        [Symbol.iterator]: function () { return this; } // iterable protocol
    };
}
exports.blockIteratorReverse = blockIteratorReverse;
/* getPastEvents:
 *    similar to contract.getPastEvents() but iterates over a given block
 *    range in small chunks that are not larger that maximumBlockRange
 *    returns an array of array of events
 */
function getPastEvents(contract, fromBlock, toBlock, eventNameAndFilterList, { numConcurrency = numConcurrencyDefault, maximumBlockRange = maximumBlockRangeDefault, progressCallback = null, /* returns a value between 0 and 1 */ blockIterator = blockIteratorReverse, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let eventLists = new Array(eventNameAndFilterList.length).fill([]);
        let iteratorIdx = 0; // fill eventLists in-order
        let iterationsFinished = 0; // for progress calculation
        let error = null;
        const iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);
        //for (let [eventName, _filter] of eventNameAndFilterList) {
        //  console.log('getPastEvents', eventName, fromBlock, toBlock);
        //}
        function worker() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let blockRange of iterator) {
                    const iteratorIdxCurrent = iteratorIdx++;
                    // create an empty array for each eventNameAndFilter
                    let eventsNew = new Array(eventNameAndFilterList.length).fill([]);
                    for (const [idx, eventNameAndFilter] of eventNameAndFilterList.entries()) {
                        const [eventName, filter] = eventNameAndFilter;
                        if (error) {
                            // if any worker has has an error we stop this one too
                            return;
                        }
                        try {
                            eventsNew[idx] = yield contract.getPastEvents(eventName, {
                                filter: filter,
                                fromBlock: blockRange.fromBlock,
                                toBlock: blockRange.toBlock
                            });
                        }
                        catch (err) {
                            error = err;
                            throw new Error(error);
                        }
                        eventLists[idx][iteratorIdxCurrent] = eventsNew[idx];
                        if (eventName === 'PositionChange') {
                            console.log('xx', idx, eventName, filter, eventsNew[idx].length);
                        }
                    }
                    /* update progress */
                    iterationsFinished++;
                    if (progressCallback) {
                        // call progressCallback after each blockRange
                        progressCallback(iterationsFinished / iterator.iterations(), eventsNew); // events might not be in order
                    }
                }
            });
        }
        // create/start numConcurrency worker() promises - all will use the same idential iterator
        const workers = new Array(numConcurrency).fill(0).map(worker);
        yield Promise.all(workers); // reject immediately if any of the promises reject 
        if (error) {
            throw new Error(error);
        }
        // join all list of events for each eventNameAndFilter
        return eventLists.map(function (x) { return [].concat.apply([], x); });
    });
}
exports.getPastEvents = getPastEvents;
