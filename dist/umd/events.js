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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.getPastEvents = exports.blockIteratorReverse = exports.numConcurrencyDefault = exports.maximumBlockRangeDefault = void 0;
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
                    var value = {
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
                }
            },
            _a[Symbol.iterator] = function () { return this; } // iterable protocol
        ,
            _a;
    }
    exports.blockIteratorReverse = blockIteratorReverse;
    /* getPastEvents:
     *    similar to contract.getPastEvents() but iterates over a given block
     *    range in small chunks that are not larger that maximumBlockRange
     */
    function getPastEvents(contract, fromBlock, toBlock, eventNameAndFilterList, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.numConcurrency, numConcurrency = _c === void 0 ? numConcurrencyDefault : _c, _d = _b.maximumBlockRange, maximumBlockRange = _d === void 0 ? maximumBlockRangeDefault : _d, _e = _b.progressCallback, progressCallback = _e === void 0 ? null : _e, /* returns a value between 0 and 1 */ _f = _b.blockIterator, /* returns a value between 0 and 1 */ blockIterator = _f === void 0 ? blockIteratorReverse : _f;
        return __awaiter(this, void 0, void 0, function () {
            //for (let [eventName, _filter] of eventNameAndFilterList) {
            //  console.log('getPastEvents', eventName, fromBlock, toBlock);
            //}
            function worker() {
                return __awaiter(this, void 0, void 0, function () {
                    var _i, iterator_1, blockRange, iteratorIdxCurrent, eventsNew, _a, eventNameAndFilterList_1, _b, eventName, filter, _c, _d, err_1;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _i = 0, iterator_1 = iterator;
                                _e.label = 1;
                            case 1:
                                if (!(_i < iterator_1.length)) return [3 /*break*/, 9];
                                blockRange = iterator_1[_i];
                                iteratorIdxCurrent = iteratorIdx++;
                                eventsNew = [];
                                _a = 0, eventNameAndFilterList_1 = eventNameAndFilterList;
                                _e.label = 2;
                            case 2:
                                if (!(_a < eventNameAndFilterList_1.length)) return [3 /*break*/, 7];
                                _b = eventNameAndFilterList_1[_a], eventName = _b[0], filter = _b[1];
                                if (error) {
                                    // if any worker has has an error we stop this one too
                                    return [2 /*return*/];
                                }
                                _e.label = 3;
                            case 3:
                                _e.trys.push([3, 5, , 6]);
                                _d = (_c = eventsNew).concat;
                                return [4 /*yield*/, contract.getPastEvents(eventName, {
                                        filter: filter,
                                        fromBlock: blockRange.fromBlock,
                                        toBlock: blockRange.toBlock
                                    })];
                            case 4:
                                eventsNew = _d.apply(_c, [_e.sent()]);
                                return [3 /*break*/, 6];
                            case 5:
                                err_1 = _e.sent();
                                error = err_1;
                                throw new Error(error);
                            case 6:
                                _a++;
                                return [3 /*break*/, 2];
                            case 7:
                                eventLists[iteratorIdxCurrent] = eventsNew;
                                /* update progress */
                                iterationsFinished++;
                                if (progressCallback) {
                                    // call progressCallback after each blockRange
                                    progressCallback(iterationsFinished / iterator.iterations(), eventsNew); // events might not be in order
                                }
                                _e.label = 8;
                            case 8:
                                _i++;
                                return [3 /*break*/, 1];
                            case 9: return [2 /*return*/];
                        }
                    });
                });
            }
            var eventLists, iteratorIdx, iterationsFinished, error, iterator, workers;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        eventLists = [];
                        iteratorIdx = 0;
                        iterationsFinished = 0;
                        error = null;
                        iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);
                        workers = new Array(numConcurrency).fill(0).map(worker);
                        return [4 /*yield*/, Promise.all(workers)];
                    case 1:
                        _g.sent(); // reject immediately if any of the promises reject 
                        if (error) {
                            throw new Error(error);
                        }
                        // join all lists
                        return [2 /*return*/, [].concat.apply([], eventLists)];
                }
            });
        });
    }
    exports.getPastEvents = getPastEvents;
});
