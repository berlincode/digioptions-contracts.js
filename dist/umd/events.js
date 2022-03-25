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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./batch"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.getPastEvents = exports.blockIteratorReverse = exports.numConcurrencyDefault = exports.maximumBlockRangeDefault = void 0;
    var batch_1 = require("./batch");
    var maximumBlockRangeDefault = 172800;
    exports.maximumBlockRangeDefault = maximumBlockRangeDefault;
    var numConcurrencyDefault = 2;
    exports.numConcurrencyDefault = numConcurrencyDefault;
    function blockIteratorReverse(fromBlock, toBlock, maximumBlockRange) {
        var _a;
        var done = false;
        var iterations = Math.max(Math.floor((toBlock - fromBlock) / maximumBlockRange) + 1, 0);
        return _a = {
                next: function () {
                    if (toBlock < fromBlock) {
                        done = true;
                    }
                    if (done) {
                        return { value: {}, done: done };
                    }
                    var value = {
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
                }
            },
            _a[Symbol.iterator] = function () { return this; } // iterable protocol
        ,
            _a;
    }
    exports.blockIteratorReverse = blockIteratorReverse;
    /* push in arrays with and index and get back them back concatenated in order */
    function inOrderArrayProducer() {
        var dataArrays = [];
        var idxStartNext = 0;
        function getIdxEnd() {
            // returns the last index+1 of continous filled area
            var idxEnd = idxStartNext;
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
                var idxEnd = getIdxEnd();
                var array = [].concat.apply([], dataArrays.slice(idxStartNext, idxEnd));
                idxStartNext = idxEnd;
                return array;
            },
            getLast: function () {
                // returns null if nothing to return
                var idxEnd = getIdxEnd();
                if (idxEnd > idxStartNext) {
                    idxStartNext = idxEnd;
                    return dataArrays[idxEnd - 1];
                }
                return null;
            },
            push: function (idx, dataArray) {
                dataArrays[idx] = dataArray;
            }
        };
    }
    /* getPastEvents:
     *    similar to contract.getPastEvents() but iterates over a given block
     *    range in small chunks that are not larger that maximumBlockRange
     *    returns an array of array of events
     */
    function getPastEvents(contract, fromBlock, toBlock, eventNameAndFilterList, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.numConcurrency, numConcurrency = _c === void 0 ? numConcurrencyDefault : _c, _d = _b.maximumBlockRange, maximumBlockRange = _d === void 0 ? maximumBlockRangeDefault : _d, _e = _b.progressCallback, progressCallback = _e === void 0 ? null : _e, /* returns a value between 0 and 1 */ _f = _b.blockIterator, /* returns a value between 0 and 1 */ blockIterator = _f === void 0 ? blockIteratorReverse : _f, _g = _b.progressCallbackDebounce, progressCallbackDebounce = _g === void 0 ? 350 : _g, // in milliseconds
        _h = _b.timestampStop, // in milliseconds
        timestampStop = _h === void 0 ? null : _h;
        return __awaiter(this, void 0, void 0, function () {
            //for (let [eventName, _filter] of eventNameAndFilterList) {
            //  console.log('getPastEvents', eventName, fromBlock, toBlock);
            //}
            function worker() {
                return __awaiter(this, void 0, void 0, function () {
                    var iterator_1, iterator_1_1, blockRange, iteratorIdxCurrent, eventNewList, block, _a, _b, _c, idx, eventNameAndFilter, _d, eventName, filter, callsAndParams, results, err_1, e_1_1, _e, _f, _g, idx, eventList, now, e_2_1;
                    var e_2, _h, e_1, _j, e_3, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                _l.trys.push([0, 14, 15, 16]);
                                iterator_1 = __values(iterator), iterator_1_1 = iterator_1.next();
                                _l.label = 1;
                            case 1:
                                if (!!iterator_1_1.done) return [3 /*break*/, 13];
                                blockRange = iterator_1_1.value;
                                iteratorIdxCurrent = iteratorIdx++;
                                eventNewList = new Array(eventNameAndFilterList.length).fill(null).map(function () { return []; });
                                block = null;
                                _l.label = 2;
                            case 2:
                                _l.trys.push([2, 9, 10, 11]);
                                _a = (e_1 = void 0, __values(eventNameAndFilterList.entries())), _b = _a.next();
                                _l.label = 3;
                            case 3:
                                if (!!_b.done) return [3 /*break*/, 8];
                                _c = __read(_b.value, 2), idx = _c[0], eventNameAndFilter = _c[1];
                                _d = __read(eventNameAndFilter, 2), eventName = _d[0], filter = _d[1];
                                if (error) {
                                    // if any worker has has an error we stop this one too
                                    return [2 /*return*/];
                                }
                                _l.label = 4;
                            case 4:
                                _l.trys.push([4, 6, , 7]);
                                callsAndParams = [
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
                                return [4 /*yield*/, (0, batch_1.makeBatchRequestPromise)(new contract.BatchRequest(), callsAndParams)];
                            case 5:
                                results = _l.sent();
                                eventNewList[idx] = results[0]; // result[0] is from getPastEvents
                                if (results[1] && results[1].timestamp) {
                                    block = results[1]; // result[0] is from getBlock
                                    if (block.timestamp <= timestampStop) {
                                        // stop iterator
                                        iterator.stop();
                                    }
                                }
                                return [3 /*break*/, 7];
                            case 6:
                                err_1 = _l.sent();
                                error = err_1;
                                throw new Error(error);
                            case 7:
                                _b = _a.next();
                                return [3 /*break*/, 3];
                            case 8: return [3 /*break*/, 11];
                            case 9:
                                e_1_1 = _l.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 11];
                            case 10:
                                try {
                                    if (_b && !_b.done && (_j = _a["return"])) _j.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                                return [7 /*endfinally*/];
                            case 11:
                                try {
                                    // add all events for the same blockRange at once
                                    for (_e = (e_3 = void 0, __values(eventLists.entries())), _f = _e.next(); !_f.done; _f = _e.next()) {
                                        _g = __read(_f.value, 2), idx = _g[0], eventList = _g[1];
                                        eventList.push(iteratorIdxCurrent, eventNewList[idx]);
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_f && !_f.done && (_k = _e["return"])) _k.call(_e);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                                blockInfos.push(iteratorIdxCurrent, { number: blockRange.fromBlock, timestamp: block && block.timestamp });
                                /* update progress */
                                iterationsFinished++;
                                if (progressCallback) {
                                    now = Date.now();
                                    if (now > nextCallAllowed) {
                                        nextCallAllowed = now + progressCallbackDebounce;
                                        if (progressCallback(iterationsFinished / iterator.iterations(), // progress // TODO better estimate if timestampStop is used
                                        eventLists.map(function (x) { return x.getNew(); }), blockInfos.getLast(), // might be null
                                        false) == false) {
                                            iterator.stop(); // stop if progressCallback returns false
                                        }
                                    }
                                }
                                _l.label = 12;
                            case 12:
                                iterator_1_1 = iterator_1.next();
                                return [3 /*break*/, 1];
                            case 13: return [3 /*break*/, 16];
                            case 14:
                                e_2_1 = _l.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 16];
                            case 15:
                                try {
                                    if (iterator_1_1 && !iterator_1_1.done && (_h = iterator_1["return"])) _h.call(iterator_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                                return [7 /*endfinally*/];
                            case 16: return [2 /*return*/];
                        }
                    });
                });
            }
            var eventLists, blockInfos, iterator, iteratorIdx, iterationsFinished, error, nextCallAllowed, workers, blockInfo, exhausted;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        eventLists = new Array(eventNameAndFilterList.length).fill(null).map(function () { return inOrderArrayProducer(); });
                        blockInfos = inOrderArrayProducer();
                        iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);
                        iteratorIdx = 0;
                        iterationsFinished = 0;
                        error = null;
                        nextCallAllowed = 0;
                        workers = new Array(numConcurrency).fill(0).map(worker);
                        return [4 /*yield*/, Promise.all(workers)];
                    case 1:
                        _j.sent(); // reject immediately if any of the promises reject 
                        blockInfo = blockInfos.getLast();
                        exhausted = iterator.isExhausted();
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
                        return [2 /*return*/, eventLists.map(function (x) { return x.getAll(); })];
                }
            });
        });
    }
    exports.getPastEvents = getPastEvents;
});
//# sourceMappingURL=events.js.map