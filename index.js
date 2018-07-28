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
    digioptions_markets_bin: digioptions_markets_bin,
    orderToHash: function(web3_utils, order){
      return web3_utils.soliditySha3(
        {t: 'address', v: order.marketsAddr},
        {t: 'bytes32', v: order.marketFactHash},
        {t: 'uint16', v: order.optionID},
        {t: 'uint256', v: order.price},
        {t: 'int256', v: order.size},
        {t: 'uint256', v: order.orderID},
        {t: 'uint256', v: order.blockExpires}
      );
    },
    baseUnitExp: 18, // used for strikes and settlement
    optionPayout: 1000000000 // payout per successful option (in wei) 
  };
}));
