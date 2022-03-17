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
     *    returns an array of array of events
     */
    function getPastEvents(contract, fromBlock, toBlock, eventNameAndFilterList, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.numConcurrency, numConcurrency = _c === void 0 ? numConcurrencyDefault : _c, _d = _b.maximumBlockRange, maximumBlockRange = _d === void 0 ? maximumBlockRangeDefault : _d, _e = _b.progressCallback, progressCallback = _e === void 0 ? null : _e, /* returns a value between 0 and 1 */ _f = _b.blockIterator, /* returns a value between 0 and 1 */ blockIterator = _f === void 0 ? blockIteratorReverse : _f, _g = _b.progressCallbackDebounce, progressCallbackDebounce = _g === void 0 ? 350 : _g;
        return __awaiter(this, void 0, void 0, function () {
            //for (let [eventName, _filter] of eventNameAndFilterList) {
            //  console.log('getPastEvents', eventName, fromBlock, toBlock);
            //}
            function worker() {
                return __awaiter(this, void 0, void 0, function () {
                    var iterator_1, iterator_1_1, blockRange, iteratorIdxCurrent, eventsNew, _a, _b, _c, idx, eventNameAndFilter, _d, eventName, filter, _e, _f, err_1, e_1_1, now, e_2_1;
                    var e_2, _g, e_1, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                _j.trys.push([0, 15, 16, 17]);
                                iterator_1 = __values(iterator), iterator_1_1 = iterator_1.next();
                                _j.label = 1;
                            case 1:
                                if (!!iterator_1_1.done) return [3 /*break*/, 14];
                                blockRange = iterator_1_1.value;
                                iteratorIdxCurrent = iteratorIdx++;
                                eventsNew = new Array(eventNameAndFilterList.length).fill(null).map(function () { return []; });
                                _j.label = 2;
                            case 2:
                                _j.trys.push([2, 10, 11, 12]);
                                _a = (e_1 = void 0, __values(eventNameAndFilterList.entries())), _b = _a.next();
                                _j.label = 3;
                            case 3:
                                if (!!_b.done) return [3 /*break*/, 9];
                                _c = __read(_b.value, 2), idx = _c[0], eventNameAndFilter = _c[1];
                                _d = __read(eventNameAndFilter, 2), eventName = _d[0], filter = _d[1];
                                if (error) {
                                    // if any worker has has an error we stop this one too
                                    return [2 /*return*/];
                                }
                                _j.label = 4;
                            case 4:
                                _j.trys.push([4, 6, , 7]);
                                _e = eventsNew;
                                _f = idx;
                                return [4 /*yield*/, contract.getPastEvents(eventName, {
                                        filter: filter,
                                        fromBlock: blockRange.fromBlock,
                                        toBlock: blockRange.toBlock
                                    })];
                            case 5:
                                _e[_f] = _j.sent();
                                return [3 /*break*/, 7];
                            case 6:
                                err_1 = _j.sent();
                                error = err_1;
                                throw new Error(error);
                            case 7:
                                eventLists[idx][iteratorIdxCurrent] = eventsNew[idx];
                                _j.label = 8;
                            case 8:
                                _b = _a.next();
                                return [3 /*break*/, 3];
                            case 9: return [3 /*break*/, 12];
                            case 10:
                                e_1_1 = _j.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 12];
                            case 11:
                                try {
                                    if (_b && !_b.done && (_h = _a["return"])) _h.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                                return [7 /*endfinally*/];
                            case 12:
                                /* update progress */
                                iterationsFinished++;
                                if (progressCallback) {
                                    now = Date.now();
                                    if (now > nextCallAllowed) {
                                        nextCallAllowed = now + progressCallbackDebounce;
                                        progressCallback(iterationsFinished / iterator.iterations(), eventsNew); // events might not be in order
                                    }
                                }
                                _j.label = 13;
                            case 13:
                                iterator_1_1 = iterator_1.next();
                                return [3 /*break*/, 1];
                            case 14: return [3 /*break*/, 17];
                            case 15:
                                e_2_1 = _j.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 17];
                            case 16:
                                try {
                                    if (iterator_1_1 && !iterator_1_1.done && (_g = iterator_1["return"])) _g.call(iterator_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                                return [7 /*endfinally*/];
                            case 17: return [2 /*return*/];
                        }
                    });
                });
            }
            var eventLists, iteratorIdx, iterationsFinished, error, nextCallAllowed, iterator, workers;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        eventLists = new Array(eventNameAndFilterList.length).fill(null).map(function () { return []; });
                        iteratorIdx = 0;
                        iterationsFinished = 0;
                        error = null;
                        nextCallAllowed = 0;
                        iterator = blockIterator(fromBlock, toBlock, maximumBlockRange);
                        workers = new Array(numConcurrency).fill(0).map(worker);
                        return [4 /*yield*/, Promise.all(workers)];
                    case 1:
                        _h.sent(); // reject immediately if any of the promises reject 
                        if (error) {
                            throw new Error(error);
                        }
                        // join all list of events for each eventNameAndFilter
                        return [2 /*return*/, eventLists.map(function (x) { return [].concat.apply([], x); })];
                }
            });
        });
    }
    exports.getPastEvents = getPastEvents;
});
//# sourceMappingURL=events.js.map