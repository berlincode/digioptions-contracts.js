
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_market_lister_abi = factory();
  }
})(this, function(){

  var data = [{"constant":true,"inputs":[],"name":"CONTRACT_VERSION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"components":[{"name":"underlying","type":"bytes32"},{"name":"expirationDatetime","type":"uint64"},{"name":"ndigit","type":"int8"},{"name":"baseUnitExp","type":"uint8"},{"name":"objectionPeriod","type":"uint32"},{"name":"strikes","type":"int256[]"},{"name":"transactionFee","type":"uint256"},{"name":"signerAddr","type":"address"}],"name":"marketBaseData","type":"tuple"},{"name":"testMarket","type":"bool"},{"components":[{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"signature","type":"tuple"}],"name":"createMarket","outputs":[{"name":"_marketFactHash","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"filterTestMarkets","type":"bool"},{"name":"filterNoTradedMarkets","type":"bool"},{"name":"expirationDatetime","type":"uint64"},{"name":"len","type":"uint16"},{"name":"marketFactHashLast","type":"bytes32[]"}],"name":"getMarketDataList","outputs":[{"components":[{"components":[{"name":"underlying","type":"bytes32"},{"name":"expirationDatetime","type":"uint64"},{"name":"ndigit","type":"int8"},{"name":"baseUnitExp","type":"uint8"},{"name":"objectionPeriod","type":"uint32"},{"name":"strikes","type":"int256[]"},{"name":"transactionFee","type":"uint256"},{"name":"signerAddr","type":"address"}],"name":"marketBaseData","type":"tuple"},{"components":[{"name":"winningOptionID","type":"uint16"},{"name":"settled","type":"bool"},{"name":"testMarket","type":"bool"},{"name":"typeDuration","type":"uint8"}],"name":"data","type":"tuple"},{"name":"marketFactHash","type":"bytes32"},{"name":"userState","type":"uint8"}],"name":"marketList","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"digioptions","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"addr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]; // eslint-disable-line quotes
  return function(){
    return data;
  };
});
