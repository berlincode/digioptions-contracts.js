
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.digioptions_market_lister_bin = factory();
  }
})(this, function(){

  return "608060405234801561001057600080fd5b506040516020806101da833981018060405261002f9190810190610078565b60008054336001600160a01b031991821617909155600180549091166001600160a01b03929092169190911781556002556100c6565b600061007182516100af565b9392505050565b60006020828403121561008a57600080fd5b60006100968484610065565b949350505050565b60006100a9826100ba565b92915050565b60006100a98261009e565b6001600160a01b031690565b610105806100d56000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80638da5cb5b146037578063f8933880146051575b600080fd5b603d6062565b604051604891906094565b60405180910390f35b60576071565b6040516048919060a6565b6000546001600160a01b031681565b6001546001600160a01b031681565b60878160b2565b82525050565b60878160c2565b6020810160a082846080565b92915050565b6020810160a08284608d565b60006001600160a01b03821660a0565b600060a08260b256fea265627a7a7230582075bab8c61f4a89a46e89940f8ddcdd2c173d6cd8377ca96f17603c9f723a53d16c6578706572696d656e74616cf50037"; // eslint-disable-line quotes
});