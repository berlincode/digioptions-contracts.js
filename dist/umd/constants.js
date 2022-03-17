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
        define(["require", "exports", "factsigner"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.marketIntervalsAll = exports.atomicOptionsPerFullOptionExp = exports.atomicOptionPayoutWeiExp = exports.expirationDatetimeMax = exports.baseUnitExpDefault = exports.contractType = exports.userState = void 0;
    var factsigner_1 = __importDefault(require("factsigner"));
    var userState = {
        NONE: 0,
        EXISTS: 1,
        PAYED_OUT: 2
    };
    exports.userState = userState;
    var contractType = {
        UNKNOWN: 0,
        DIGIOPTIONSMARKETS: 1,
        DIGIOPTIONSMARKETLISTER: 2
    };
    exports.contractType = contractType;
    var baseUnitExpDefault = 18;
    exports.baseUnitExpDefault = baseUnitExpDefault;
    var expirationDatetimeMax = 0xffffffffff; // contract uses 40 bits for expirationDatetime
    exports.expirationDatetimeMax = expirationDatetimeMax;
    /* the smallest buyable fractional option results in a potential payout
     * of 10**atomicOptionPayoutWeiExp wei */
    var atomicOptionPayoutWeiExp = 9; // TODO remove this and take it directly from contract info
    exports.atomicOptionPayoutWeiExp = atomicOptionPayoutWeiExp;
    /* 10**atomicOptionsPerFullOptionExp atomic options result in a potential payout of 1 eth */
    var atomicOptionsPerFullOptionExp = 18 - atomicOptionPayoutWeiExp; // TODO remove this and take it directly from contract info
    exports.atomicOptionsPerFullOptionExp = atomicOptionsPerFullOptionExp;
    /* all intervals that may be used by digiOptions */
    var marketIntervalsAll = [
        // TODO add all
        factsigner_1["default"].constants.marketInterval.DAILY,
        factsigner_1["default"].constants.marketInterval.WEEKLY,
        factsigner_1["default"].constants.marketInterval.MONTHLY,
        factsigner_1["default"].constants.marketInterval.YEARLY
    ];
    exports.marketIntervalsAll = marketIntervalsAll;
});
//# sourceMappingURL=constants.js.map