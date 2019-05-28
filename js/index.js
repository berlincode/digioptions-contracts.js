// vim: sts=2:ts=2:sw=2
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([
      'web3',
      'factsigner',
      './digioptions_markets_abi',
      './digioptions_market_lister_abi'
    ], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (node and other environments that support module.exports)
    module.exports = factory(
      require('web3'),
      require('factsigner'),
      require('./digioptions_markets_abi'),
      require('./digioptions_market_lister_abi')
    );
  }else {
    // Global (browser)
    root.digioptionsContracts = factory(
      root.web3, // we expect that the whole Web3 was loaded an use only the utils from it
      root.factsigner,
      root.digioptions_markets_abi,
      root.digioptions_market_lister_abi
    );
  }
}(this, function (Web3, factsigner, digioptionsMarketsAbi, digioptionsMarketListerAbi) {

  var web3 = new Web3();

  /* similar to factsigner's factHash() but with adding additional data to hash */
  function marketHash(marketBaseData){

    var args = [
      {t: 'uint8', v: marketBaseData.baseUnitExp},
      {t: 'bytes32', v: marketBaseData.underlying},
      {t: 'int8', v: marketBaseData.ndigit},
      {t: 'uint32', v: marketBaseData.objectionPeriod},
      {t: 'uint40', v: marketBaseData.expirationDatetime},

      {t: 'uint8', v: marketBaseData.typeDuration},
      {t: 'address', v: marketBaseData.feeTaker0},
      {t: 'address', v: marketBaseData.feeTaker1},
      {t: 'address', v: marketBaseData.signerAddr},
      {t: 'uint64', v: marketBaseData.transactionFee0},
      {t: 'uint64', v: marketBaseData.transactionFee1}
    ];
  
    // take special care of out strikes int128 array 
    // see: https://github.com/ethereumjs/ethereumjs-abi/issues/27
    // see: https://github.com/ethereumjs/ethereumjs-abi/pull/47
    marketBaseData.strikes.map(
      function(val){
        // repack out int128 as bytes32
        //args.push({t: 'bytes32', v: web3.utils.leftPad(addr, 64)val});
        args.push({t: 'int256', v: val});
        //args.push({t: 'int128', v: val});
      }
    );

    return web3.utils.soliditySha3.apply(this, args);
  }

  var orderOfferToHash = function(order){
    return web3.utils.soliditySha3(
      {t: 'address', v: order.marketsAddr},
      {t: 'bytes32', v: order.marketHash},
      {t: 'uint16', v: order.optionID},
      {t: 'bool', v: order.buy},
      {t: 'uint256', v: order.price},
      {t: 'int256', v: order.size},
      {t: 'uint256', v: order.offerID},
      {t: 'uint256', v: order.blockExpires},
      // we do not need the address for the order itself, since the address is impliclitly
      // available via the signature
      // but if the address is contained, we can use this hash for order tracking too
      {t: 'address', v: order.offerOwner}
    );
  };

  var signOrder = function(web3, privateKey, order) {
    var orderOfferHash = orderOfferToHash(order);
    // sign order (add r, s, v)
    var sig = factsigner.sign(web3, privateKey, orderOfferHash);
    var orderSigned = Object.assign({}, order, sig);
    orderSigned.v = parseInt(orderSigned.v); // TODO convert from '0x1c' to int
    return orderSigned;
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
  
  var payoutPerNanoOptionExp = web3.utils.toBN('9');
  var nanoOptionsPerOptionExp = web3.utils.toBN('9');

  return {
    digioptionsMarketsAbi: digioptionsMarketsAbi,
    digioptionsMarketListerAbi: digioptionsMarketListerAbi,
    marketHash: marketHash,
    orderOfferToHash: orderOfferToHash,
    signOrder: signOrder,
    optionPayout: 1000000000, // TODO remove payout per successful option (in wei)
    // payoutPerNanoOption * nanoOptionsPerOption should be 10**18 (1 ether in wei)
    payoutPerNanoOptionExp: payoutPerNanoOptionExp,
    nanoOptionsPerOptionExp: nanoOptionsPerOptionExp,
    payoutPerNanoOption: web3.utils.toBN('10').pow(payoutPerNanoOptionExp), // == 1000000000 (in wei)
    nanoOptionsPerOption: web3.utils.toBN('10').pow(payoutPerNanoOptionExp), // == 1000000000
    versionToInt: versionToInt,
    versionFromInt: versionFromInt,
    versionToString: versionToString,
    versionMarketLister: {
      major: 0,
      minor: 46,
      bugfix: 0
    },
    versionMarkets: {
      major: 0,
      minor: 46,
      bugfix: 0
    },
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
