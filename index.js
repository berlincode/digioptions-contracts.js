// vim: sts=2:ts=2:sw=2
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([
      './digioptions_markets_abi',
      './digioptions_markets_bin'
    ], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (node and other environments that support module.exports)
    module.exports = factory(
      require('./digioptions_markets_abi'),
      require('./digioptions_markets_bin')
    );
  }else {
    // Global (browser)
    root.digioptionsContracts = factory(
      root.digioptions_markets_abi,
      root.digioptions_markets_bin
    );
  }
}(this, function (digioptions_markets_abi, digioptions_markets_bin) {
  return {
    digioptions_markets_abi: digioptions_markets_abi,
    digioptions_markets_bin: digioptions_markets_bin
  };
}));
