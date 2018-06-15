#!/usr/bin/env node
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
/* eslint-disable no-console */

// this is very similar to
// solcjs --bin --abi --optimize DigiOptions.sol
//
// except that it wraps the output into js modules (CommonJS, AMD, Browser)

var fs = require('fs');
var solc = require('solc');

function camelCaseToUnderscore(str) {
  return str.replace(/\W+/g, '-')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

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


var filenames = ['Digioptions.sol'];
for (var i in filenames) {
  var filename = filenames[i];

  if (fs.existsSync(filename + '.bytecode'))
    fs.unlink(filename + '.bytecode');

  if (fs.existsSync(filename + '.interface'))
    fs.unlink(filename + '.interface');

  var input = fs.readFileSync(filename, 'utf8');
  var output = solc.compile(input, 1); // 1 activates the optimizer
  if (typeof(output.errors) !== 'undefined')
    console.log(output.errors);

  for (var contractName in output.contracts) {
    var fileNameBase = contractName;
    if (contractName.indexOf(':') >= 0)
      fileNameBase = contractName.split(':')[1];

    // code and ABI that are needed by web3
    console.log(fileNameBase);

    // bytecode is wrapped inside quotes so that it is json compatible (and a json-fetch from web app works)
    // additionally use .json ending so that we can require the files
    //fs.writeFileSync(fileNameBase + '.bin.json', '"' + output.contracts[contractName].bytecode + '"\n', 'utf8');
    //fs.writeFileSync(fileNameBase + '.abi.json', output.contracts[contractName].interface, 'utf8');
    wrap_data_into_module(camelCaseToUnderscore(fileNameBase) + '_bin.js', camelCaseToUnderscore(fileNameBase) + '_bin', '"' + output.contracts[contractName].bytecode + '"');
    wrap_data_into_module(camelCaseToUnderscore(fileNameBase) + '_abi.js', camelCaseToUnderscore(fileNameBase) + '_abi', output.contracts[contractName].interface);
  }
}

