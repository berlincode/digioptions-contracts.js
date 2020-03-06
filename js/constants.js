// vim: sts=2:ts=2:sw=2
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([
      'factsigner'
    ], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (node and other environments that support module.exports)
    module.exports = factory(
      require('factsigner')
    );
  }else {
    // Global (browser)
    root.digioptionsContractsConstants = factory(
      root.factsigner
    );
  }
}(this, function (factsigner) {
  var atomicOptionPayoutWeiExp = 9; // TODO remove this and take it directly from contract info

  return {
    userState: {
      NONE: 0,
      EXISTS: 1,
      PAYED_OUT: 2
    },
    contractType: {
      UNKNOWN: 0,
      DIGIOPTIONSMARKETS: 1,
      DIGIOPTIONSMARKETLISTER: 2
    },
    baseUnitExpDefault: 18,

    expirationDatetimeMax: 0xffffffffff, // contract uses 40 bits for expirationDatetime

    /* the smallest buyable fractional option results in a potential payout
     * of 10**atomicOptionPayoutWeiExp wei */
    atomicOptionPayoutWeiExp: atomicOptionPayoutWeiExp, // TODO remove this and take it directly from contract info

    /* 10**atomicOptionsPerFullOptionExp atomic options result in a potential payout of 1 eth */
    atomicOptionsPerFullOptionExp: 18-atomicOptionPayoutWeiExp, // TODO remove this and take it directly from contract info

    /* all intervals that may be used by digiOptions */
    marketIntervalsAll: [
      // TODO add all
      factsigner.constants.marketInterval.DAILY,
      factsigner.constants.marketInterval.WEEKLY,
      factsigner.constants.marketInterval.MONTHLY,
      factsigner.constants.marketInterval.YEARLY
    ]
  };
}));
