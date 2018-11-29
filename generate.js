#!/usr/bin/env node
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
/* eslint-disable no-console */

// this is very similar to
// solcjs --bin --abi --optimize DigiOptions.sol
//
// except that it wraps the output into js modules (CommonJS, AMD, Browser)

const file_bin = 'digioptions_markets_bin.js';
const file_abi = 'digioptions_markets_abi.js';
const file = 'Digioptions.sol';
const contractName = 'DigiOptions';

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

  return ` + data + `; // eslint-disable-line quotes
});
`,
    'utf8');

};

if (fs.existsSync(file_bin))
  fs.unlinkSync(file_bin);

if (fs.existsSync(file_abi))
  fs.unlinkSync(file_abi);


var input = {};
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

try {
  // bytecode is wrapped inside quotes so that it is json compatible (and a json-fetch from web app works)
  wrap_data_into_module(file_bin, 'digioptions_markets_bin', '"' + output.contracts[file][contractName].evm.bytecode.object + '"');
  wrap_data_into_module(file_abi, 'digioptions_markets_abi', JSON.stringify(output.contracts[file][contractName].abi));
  console.log('writing contract abi/bin of source', file);
} catch(err) {
  console.log('ERROR: failed to write contract abi/bin of source:', file, err);
}
