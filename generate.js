#!/usr/bin/env node
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
/* eslint-disable no-console */

// this is very similar to
// solcjs --bin --abi --optimize DigiOptions.sol
//
// except that it wraps the output into js modules (CommonJS, AMD, Browser)

const files = [
  'contracts/DigiOptions.sol',
  'contracts/DigiOptionsMarketLister.sol',
  'contracts/DigiOptionsBaseInterface.sol',
  'contracts/SafeCast.sol',
  'contracts/SafeMath.sol'
];

var fs = require('fs');
var solc = require('solc');

var wrap_data_into_module = function(fname, varname, data){

  fs.writeFileSync(
    fname,
    `
(function (global, factory) {
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function () { return factory(); } );

  } else if ( typeof module !== 'undefined' && module.exports ) {
    // Node and other environments that support module.exports
    module.exports = factory();

  } else {
    // Browser
    global.` + varname + ` = factory();
  }
})(this, function(){

  var data = ` + data + `; // eslint-disable-line quotes
  return function(){
    return data;
  };
});
`,
    'utf8');

};

var unlink = function(files){
  for (let file of files){
    if (fs.existsSync(file))
      fs.unlinkSync(file);
  }
};

var input = {};
for (let file of files)
  input[file] = {content: fs.readFileSync(file, 'utf8')};

var output = JSON.parse(solc.compileStandardWrapper(JSON.stringify({
  language: 'Solidity',
  settings: {
    optimizer: {
      enabled: true
    },
    outputSelection: {
      '*': {
        '*': ['metadata', 'evm.bytecode', 'abi']
      },
    }
  },
  sources: input
})));

if (typeof(output.errors) !== 'undefined')
  console.log(output.errors);

var generate = function(filenameSol, contractName, baseName){
  const file_bin = baseName + '_bin.js';
  const file_abi = baseName + '_abi.js';

  unlink([file_abi, file_bin]);
  // bytecode is wrapped inside quotes so that it is json compatible (and a json-fetch from web app works)
  wrap_data_into_module(file_bin, baseName + '_bin', '"' + output.contracts[filenameSol][contractName].evm.bytecode.object + '"');
  wrap_data_into_module(file_abi, baseName + '_abi', JSON.stringify(output.contracts[filenameSol][contractName].abi));
};


try {
  generate('contracts/DigiOptions.sol', 'DigiOptions', 'digioptions_markets');
  generate('contracts/DigiOptionsMarketLister.sol', 'DigioptionsMarketLister', 'digioptions_market_lister');
  console.log('wrote contract abi/bin successfully');
} catch(err) {
  console.log('ERROR: failed to write contract abi/bin:', err);
}
