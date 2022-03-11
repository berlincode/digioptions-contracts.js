// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
import factsigner from 'factsigner';
const userState = {
    NONE: 0,
    EXISTS: 1,
    PAYED_OUT: 2
};
const contractType = {
    UNKNOWN: 0,
    DIGIOPTIONSMARKETS: 1,
    DIGIOPTIONSMARKETLISTER: 2
};
const baseUnitExpDefault = 18;
const expirationDatetimeMax = 0xffffffffff; // contract uses 40 bits for expirationDatetime
/* the smallest buyable fractional option results in a potential payout
 * of 10**atomicOptionPayoutWeiExp wei */
const atomicOptionPayoutWeiExp = 9; // TODO remove this and take it directly from contract info
/* 10**atomicOptionsPerFullOptionExp atomic options result in a potential payout of 1 eth */
const atomicOptionsPerFullOptionExp = 18 - atomicOptionPayoutWeiExp; // TODO remove this and take it directly from contract info
/* all intervals that may be used by digiOptions */
const marketIntervalsAll = [
    // TODO add all
    factsigner.constants.marketInterval.DAILY,
    factsigner.constants.marketInterval.WEEKLY,
    factsigner.constants.marketInterval.MONTHLY,
    factsigner.constants.marketInterval.YEARLY
];
export { userState, contractType, baseUnitExpDefault, expirationDatetimeMax, atomicOptionPayoutWeiExp, atomicOptionsPerFullOptionExp, marketIntervalsAll, };
