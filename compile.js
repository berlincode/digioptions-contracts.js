#!/usr/bin/env node
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
/* eslint-disable no-console */

// this is very similar to
// solcjs --bin --abi --optimize contracts/DigiOptionsMarkets.sol
//
// except that it wraps the output into js modules (CommonJS, AMD, Browser)

const files = [
  'contracts/DigiOptionsMarkets.sol',
  'contracts/DigiOptionsMarketLister.sol',
  'contracts/DigiOptionsBaseInterface.sol',
  'contracts/SafeCast.sol',
  'contracts/SafeMath.sol'
];

var fs = require('fs');
var solc = require('solc');

var wrap_data_into_module = function(fname, varname, data){

  data = data.replace(/\n/g, '\n  '); // additional indent by 2 spaces

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

  /* eslint-disable quotes */
  var data = ` + data + `;
  /* eslint-enable quotes */
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

const contract_json = JSON.stringify({
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
});

fs.writeFileSync('contract.json', contract_json);

const output = JSON.parse(solc.compileStandardWrapper(contract_json));

if (typeof(output.errors) !== 'undefined')
  console.log(output.errors);

var generate = function(filenameSol, contractName, baseName){
  const file_bin = 'js/' + baseName + '_bin.js';
  const file_abi = 'js/' + baseName + '_abi.js';

  unlink([file_abi, file_bin]);
  // bytecode is wrapped inside quotes so that it is json compatible (and a json-fetch from web app works)
  wrap_data_into_module(file_bin, baseName + '_bin', '"' + output.contracts[filenameSol][contractName].evm.bytecode.object + '"');
  wrap_data_into_module(file_abi, baseName + '_abi', JSON.stringify(output.contracts[filenameSol][contractName].abi, null, 2));
};


try {
  generate('contracts/DigiOptionsMarkets.sol', 'DigiOptionsMarkets', 'digioptions_markets');
  generate('contracts/DigiOptionsMarketLister.sol', 'DigioptionsMarketLister', 'digioptions_market_lister');
  console.log('wrote contract abi/bin successfully');
} catch(err) {
  console.log('ERROR: failed to write contract abi/bin:', err);
}
