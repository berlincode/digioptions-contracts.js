// vim: sts=2:ts=2:sw=2
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([
    ], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (node and other environments that support module.exports)
    module.exports = factory(
    );
  }else {
    // Global (browser)
    root.digioptionsContractsConstants = factory(
    );
  }
}(this, function () {

  return {
    optionPayout: 1000000000, // TODO remove payout per successful option (in wei)
    userState: {
      USER_NONE: 0,
      USER_EXISTS: 1,
      USER_PAYED_OUT: 2
    },
    contractType: {
      CONTRACT_UNKNOWN: 0,
      CONTRACT_DIGIOPTIONSMARKETS: 1,
      CONTRACT_DIGIOPTIONSMARKETLISTER: 2
    },
    typeDuration: {
      0: 'yearly',
      1: 'monthly',
      2: 'weekly',
      3: 'daily',
      4: 'hourly',
      5: 'short term' // TODO better name
    }
  };
}));
