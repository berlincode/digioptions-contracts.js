// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "web3-core-method"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.getBlockForBatchRequest = exports.getPastEventsForBatchRequest = exports.makeBatchRequestPromise = void 0;
    var web3_core_method_1 = __importDefault(require("web3-core-method"));
    /**
     * make a promisified "BatchRequest"
     * @param {Object} batch - a new BatchRequest instance (create with e.g. 'new web3.BatchRequest()')
     * @param {Array} callsAndParams - each array element must contain a tuple of a call request function and its params
     * @return {Object} - promise that returns an array which contains a result for each request
     */
    function makeBatchRequestPromise(batch, callsAndParams) {
        var promises = callsAndParams.map(function (callAndParam) {
            var call = callAndParam[0];
            var params = callAndParam[1];
            return new Promise(function (res, rej) {
                var req = call(params, function (err, data) {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res(data);
                    }
                });
                batch.add(req);
            });
        });
        batch.execute();
        return Promise.all(promises);
    }
    exports.makeBatchRequestPromise = makeBatchRequestPromise;
    // similar to BaseContract.getPastEvents but intended for use
    // with BatchRequest
    // returns request function and function params
    function getPastEventsForBatchRequest(contract, eventName, options) {
        var subOptions = contract._generateEventOptions(eventName, options);
        var getPastLogs = new web3_core_method_1["default"]({
            name: 'getPastLogs',
            call: 'eth_getLogs',
            params: 1,
            //inputFormatter: [formatters.inputLogFormatter],
            inputFormatter: [contract.extend.formatters.inputLogFormatter],
            outputFormatter: contract._decodeEventABI.bind(subOptions.event)
        });
        var call = getPastLogs.buildCall();
        return [call.request, subOptions.params];
    }
    exports.getPastEventsForBatchRequest = getPastEventsForBatchRequest;
    // allow the use of getBlock() with a BatchRequest without a web3 instance (e.g. web3.eth.getBlock.request)
    function getBlockForBatchRequest(contract) {
        var blockCall = function (args) {
            return (typeof args[0] === 'string' && args[0].indexOf('0x') === 0) ? 'eth_getBlockByHash' : 'eth_getBlockByNumber';
        };
        var getBlock = new web3_core_method_1["default"]({
            name: 'getBlockByNumber',
            call: blockCall,
            params: 2,
            inputFormatter: [contract.extend.formatters.inputBlockNumberFormatter, function (val) { return !!val; }],
            outputFormatter: contract.extend.formatters.outputBlockFormatter
        });
        var call = getBlock.buildCall();
        return call.request;
    }
    exports.getBlockForBatchRequest = getBlockForBatchRequest;
});
//# sourceMappingURL=batch.js.map