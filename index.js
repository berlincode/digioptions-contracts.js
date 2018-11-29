// vim: sts=2:ts=2:sw=2
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([
      'web3',
      'factsigner',
      './digioptions_markets_abi'
    ], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (node and other environments that support module.exports)
    module.exports = factory(
      require('web3'),
      require('factsigner'),
      require('./digioptions_markets_abi')
    );
  }else {
    // Global (browser)
    root.digioptionsContracts = factory(
      root.Web3, // we expect that the whole Web3 was loaded an use only the utils from it
      root.factsigner,
      root.digioptions_markets_abi
    );
  }
}(this, function (Web3, factsigner, digioptionsMarketsAbi) {

  var orderOfferToHash = function(order){
    return Web3.utils.soliditySha3(
      {t: 'address', v: order.marketsAddr},
      {t: 'bytes32', v: order.marketFactHash},
      {t: 'uint16', v: order.optionID},
      {t: 'bool', v: order.buy},
      {t: 'uint256', v: order.price},
      {t: 'int256', v: order.size},
      {t: 'uint256', v: order.orderID},
      {t: 'uint256', v: order.blockExpires},
      // we do not need the address for the order itself, since the address is impliclitly
      // available via the signature
      // but if the addess is contained, we can use this hash for order tracking too
      {t: 'address', v: order.offerOwner}
    );
  };

  var signOrder = function(web3, order, address) {
    var orderOfferHash = orderOfferToHash(order);
    // sign order (add r, s, v)
    return factsigner.sign(web3, address, orderOfferHash)
      .then(function(sig){
        return Object.assign({}, order, sig);
      });
  };

  var versionToInt = function(ver){
    return (
      (ver.major << 32) +
      (ver.minor << 16) +
      (ver.bugfix)
    );
  };

  var versionFromInt = function(ver){
    return ({
      major: (ver >> 32) & 0xffff,
      minor: (ver >> 16) & 0xffff,
      bugfix: ver & 0xffff
    });
  };

  var versionToString = function(ver){
    return (
      ver.major + '.' +
      ver.minor + '.' +
      ver.bugfix
    );
  };
  
  var payoutPerNanoOptionExp = Web3.utils.toBN('9');
  var nanoOptionsPerOptionExp = Web3.utils.toBN('9');

  return {
    digioptionsMarketsAbi: digioptionsMarketsAbi,
    orderOfferToHash: orderOfferToHash,
    signOrder: signOrder,
    optionPayout: 1000000000, // TODO remove payout per successful option (in wei)
    // payoutPerNanoOption * nanoOptionsPerOption should be 10**18 (1 ether in wei)
    payoutPerNanoOptionExp: payoutPerNanoOptionExp,
    nanoOptionsPerOptionExp: nanoOptionsPerOptionExp,
    payoutPerNanoOption: Web3.utils.toBN('10').pow(payoutPerNanoOptionExp), // == 1000000000 (in wei)
    nanoOptionsPerOption: Web3.utils.toBN('10').pow(payoutPerNanoOptionExp), // == 1000000000
    versionToInt: versionToInt,
    versionFromInt: versionFromInt,
    versionToString: versionToString,
    version: {
      major: 0,
      minor: 41,
      bugfix: 0
    },
    userState: {
      USER_NONE: 0,
      USER_EXISTS: 1,
      USER_PAYED_OUT: 2
    }
  };
}));
