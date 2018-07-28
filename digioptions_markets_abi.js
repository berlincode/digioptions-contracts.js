
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_markets_abi = factory();
  }
})(this, function(){

  return [{"constant":false,"inputs":[{"name":"marketFactHash","type":"bytes32"},{"name":"signature","type":"bytes32[3]"},{"name":"value","type":"int256"}],"name":"expire","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"marketFactHash","type":"bytes32"},{"name":"signature","type":"bytes32[3]"},{"name":"value","type":"int256"}],"name":"settlement","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"marketFactHash","type":"bytes32"},{"name":"user","type":"address"}],"name":"getMarket","outputs":[{"name":"positions","type":"int256[]"},{"name":"liquidity","type":"uint256"},{"name":"maxLossOrMinWin","type":"int256"},{"name":"paidOut","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"marketFactHash","type":"bytes32"},{"name":"userAddr","type":"address"},{"name":"optionID","type":"uint16"},{"name":"positionChange","type":"int256"}],"name":"maxLossOrMinWinChangeAfterTrade","outputs":[{"name":"maxLossOrMinWin","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"marketFactHash","type":"bytes32"},{"name":"optionID","type":"uint16"},{"name":"pricePerOption","type":"uint256"},{"name":"size","type":"int256"},{"name":"orderID","type":"uint256"},{"name":"blockExpires","type":"uint256"},{"name":"addr","type":"address"},{"name":"signature","type":"bytes32[3]"},{"name":"matchSize","type":"int256"}],"name":"orderMatchTest","outputs":[{"name":"success","type":"bool"},{"name":"orderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"marketFactHash","type":"bytes32"},{"name":"userAddr","type":"address"},{"name":"optionID","type":"uint16"},{"name":"positionChange","type":"int256"}],"name":"maxLossOrMinWinAfterTrade","outputs":[{"name":"maxLossOrMinWin","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"marketFactHash","type":"bytes32"},{"name":"optionID","type":"uint16"},{"name":"pricePerOption","type":"uint256"},{"name":"size","type":"int256"},{"name":"orderID","type":"uint256"},{"name":"blockExpires","type":"uint256"},{"name":"addr","type":"address"},{"name":"signature","type":"bytes32[3]"},{"name":"matchSize","type":"int256"}],"name":"orderMatch","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"marketFactHash","type":"bytes32"}],"name":"disableMarket","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ownerAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"marketFactHash","type":"bytes32"}],"name":"settlementPayOut","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"addFunds","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"settlementDatetime","type":"uint64"},{"name":"underlying","type":"bytes32"},{"name":"transactionFee","type":"uint256"},{"name":"ndigit","type":"int8"},{"name":"signature","type":"bytes32[3]"},{"name":"signerAddr","type":"address"},{"name":"strikes","type":"int256[]"}],"name":"createMarket","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"userAddr","type":"address"}],"name":"getLiquidity","outputs":[{"name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"marketFactHash","type":"bytes32"}],"name":"getMarketBaseData","outputs":[{"name":"settlementDatetime","type":"uint64"},{"name":"underlying","type":"bytes32"},{"name":"transactionFee","type":"uint256"},{"name":"ndigit","type":"int8"},{"name":"signerAddr","type":"address"},{"name":"strikes","type":"int256[]"},{"name":"winningOptionID","type":"int16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"returnDisabled","type":"bool"},{"name":"settlementDatetime","type":"uint64"},{"name":"len","type":"uint16"}],"name":"getMarketList","outputs":[{"name":"marketList","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"marketFactHash","type":"bytes32"}],"name":"marketExists","outputs":[{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"returnDisabled","type":"bool"},{"name":"settlementDatetime","type":"uint64"},{"name":"len","type":"uint16"},{"name":"marketFactHashLast","type":"bytes32"}],"name":"getMarketListNext","outputs":[{"name":"marketList","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"marketFactHash","type":"bytes32"}],"name":"CreateMarket","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"marketFactHash","type":"bytes32"}],"name":"Settlement","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"marketFactHash","type":"bytes32"},{"indexed":false,"name":"optionID","type":"uint16"},{"indexed":false,"name":"matchSize","type":"int256"}],"name":"PositionChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":true,"name":"time","type":"uint256"},{"indexed":false,"name":"amount","type":"int256"}],"name":"AddWithdrawFunds","type":"event"}]; // eslint-disable-line quotes
});
