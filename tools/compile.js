#!/usr/bin/env node
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const Compiler = require('@0x/sol-compiler').Compiler;

const optionsDefault = {
  artifactsDir: path.join(__dirname, '..', 'artifacts'),
  contractsDir: path.join(__dirname, '..', 'contracts'),
  //isOfflineMode: true,
  // see https://solc-bin.ethereum.org/bin/list.json
  //solcVersion: '0.7.4+commit.3f05b770',
  solcVersion: '0.7.6+commit.7338295f',
  compilerSettings: {
    //evmVersion: 'byzantium', // for thundercore (as of 2020-05)
    //remappings: [
    //],
    optimizer: {
      enabled: true,
      runs: 20000,
      details: {
        yul: true,
        deduplicate: true,
        cse: true,
        constantOptimizer: true
      }
    },
    outputSelection: {
      '*': {
        '*': [
          'abi',
          'evm.bytecode.object',
          'evm.bytecode.sourceMap',
          'evm.deployedBytecode.object',
          'evm.deployedBytecode.sourceMap'
        ]
      }
    }
  },
  contracts: [
    'DigiOptionsMarkets',
    'DigiOptionsMarketLister',
    'DigiOptionsMeta.sol',
    'DigiOptionsTest.sol'
  ]
};

function wrap_data_into_module(fname, varname, data){

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

}

function unlink(files){
  for (let file of files){
    if (fs.existsSync(file))
      fs.unlinkSync(file);
  }
}

function getSizeHex(hexString){
  return hexString.replace(/^0x/, '').length / 2;
}

function generate(filenameJson, baseName){
  const input = JSON.parse(fs.readFileSync(filenameJson));

  const file_bin = path.join(__dirname, '..', 'js', baseName + '_bin.js');
  const file_abi = path.join(__dirname, '..', 'js', baseName + '_abi.js');

  unlink([file_abi, file_bin]);
  // bytecode is wrapped inside quotes so that it is json compatible (and a json-fetch from web app works)
  wrap_data_into_module(file_bin, baseName + '_bin', '"' + input.compilerOutput.evm.bytecode.object + '"');
  wrap_data_into_module(file_abi, baseName + '_abi', JSON.stringify(input.compilerOutput.abi, null, 2));
}

async function compile(optArgs){
  unlink([
    path.join(__dirname, '..', 'artifacts', 'DigiOptionsMarketLister.json'),
    path.join(__dirname, '..', 'artifacts', 'DigiOptionsMarkets.json'),
    path.join(__dirname, '..', 'artifacts', 'DigiOptionsMeta.json'),
    path.join(__dirname, '..', 'artifacts', 'DigiOptionsTest.json'),
  ]);
  const compiler = new Compiler(optArgs);
  await compiler.compileAsync();

  generate(path.join(__dirname, '..', 'artifacts', 'DigiOptionsMarkets.json'), 'digioptions_markets');
  generate(path.join(__dirname, '..', 'artifacts', 'DigiOptionsMarketLister.json'), 'digioptions_market_lister');
  generate(path.join(__dirname, '..', 'artifacts', 'DigiOptionsMeta.json'), 'digioptions_meta');

  for (var filenameJson of [
    path.join(__dirname, '..', 'artifacts', 'DigiOptionsMarketLister.json'),
    path.join(__dirname, '..', 'artifacts', 'DigiOptionsMarkets.json'),
  ]){
    console.log(path.basename(filenameJson), 'bytecode bytes        ', getSizeHex(JSON.parse(fs.readFileSync(filenameJson)).compilerOutput.evm.bytecode.object));
    console.log(path.basename(filenameJson), 'deployedBytecode bytes', getSizeHex(JSON.parse(fs.readFileSync(filenameJson)).compilerOutput.evm.deployedBytecode.object));
  }

  console.log('wrote contract abi/bin successfully');
}

if (require.main === module) {

  try {
    compile(optionsDefault);
  } catch(err) {
    console.log('ERROR: failed to write contract abi/bin:', err);
    process.exit(1);
  }

} else {
  //console.log('required as a module');
  module.exports = {
    compile: compile,
    optionsDefault: optionsDefault,
  };
}
