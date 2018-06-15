
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_markets_bin = factory();
  }
})(this, function(){

  return "608060405234801561001057600080fd5b5060008054600160a060020a0319163317905560c6806100316000396000f300608060405260043610603e5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416639c675eaa81146043575b600080fd5b348015604e57600080fd5b506055607e565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b60005473ffffffffffffffffffffffffffffffffffffffff16815600a165627a7a72305820e08db83027407f0875ca2e8b0d4063f9c6f98a2470fe8d9cddb81fbae11a71bf0029"; // eslint-disable-line quotes
});
