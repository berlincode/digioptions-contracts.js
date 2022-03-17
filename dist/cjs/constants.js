"use strict";
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketIntervalsAll = exports.atomicOptionsPerFullOptionExp = exports.atomicOptionPayoutWeiExp = exports.expirationDatetimeMax = exports.baseUnitExpDefault = exports.contractType = exports.userState = void 0;
const factsigner_1 = __importDefault(require("factsigner"));
const userState = {
    NONE: 0,
    EXISTS: 1,
    PAYED_OUT: 2
};
exports.userState = userState;
const contractType = {
    UNKNOWN: 0,
    DIGIOPTIONSMARKETS: 1,
    DIGIOPTIONSMARKETLISTER: 2
};
exports.contractType = contractType;
const baseUnitExpDefault = 18;
exports.baseUnitExpDefault = baseUnitExpDefault;
const expirationDatetimeMax = 0xffffffffff; // contract uses 40 bits for expirationDatetime
exports.expirationDatetimeMax = expirationDatetimeMax;
/* the smallest buyable fractional option results in a potential payout
 * of 10**atomicOptionPayoutWeiExp wei */
const atomicOptionPayoutWeiExp = 9; // TODO remove this and take it directly from contract info
exports.atomicOptionPayoutWeiExp = atomicOptionPayoutWeiExp;
/* 10**atomicOptionsPerFullOptionExp atomic options result in a potential payout of 1 eth */
const atomicOptionsPerFullOptionExp = 18 - atomicOptionPayoutWeiExp; // TODO remove this and take it directly from contract info
exports.atomicOptionsPerFullOptionExp = atomicOptionsPerFullOptionExp;
/* all intervals that may be used by digiOptions */
const marketIntervalsAll = [
    // TODO add all
    factsigner_1.default.constants.marketInterval.DAILY,
    factsigner_1.default.constants.marketInterval.WEEKLY,
    factsigner_1.default.constants.marketInterval.MONTHLY,
    factsigner_1.default.constants.marketInterval.YEARLY
];
exports.marketIntervalsAll = marketIntervalsAll;
//# sourceMappingURL=constants.js.map