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
  // see https://binaries.soliditylang.org/bin/list.json
  // fetch binaries from e.g. https://binaries.soliditylang.org/bin/soljson-v0.8.12+commit.f00d7308.js
  //solcVersion: '0.7.4+commit.3f05b770',
  //solcVersion: '0.7.6+commit.7338295f',
  //solcVersion: '0.8.0+commit.c7dfd78e',
  //solcVersion: '0.8.1+commit.df193b15',
  //solcVersion: '0.8.2+commit.661d1103',
  //solcVersion: '0.8.3+commit.8d00100c',
  //solcVersion: '0.8.4+commit.c7e474f2',
  //solcVersion: '0.8.5+commit.a4f2e591',
  //solcVersion: '0.8.6+commit.11564f7e',
  //
  //solcVersion: '0.8.7+commit.e28d00a7',
  //solcVersion: '0.8.8+commit.dddeac2f',
  //solcVersion: '0.8.9+commit.e5eed63a',
  //solcVersion: '0.8.10+commit.fc410830',
  solcVersion: '0.8.12+commit.f00d7308',
  compilerSettings: {
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

function wrap_data_into_module(fname, data){

  //data = data.replace(/\n/g, '\n  '); // additional indent by 2 spaces

  fs.writeFileSync(
    fname,
    `// vim: sts=2:ts=2:sw=2
/* eslint-disable quotes */
const data = ` + data + `;
/* eslint-enable quotes */
export default function(){
  return data;
}
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

  const file_bin = path.join(__dirname, '..', 'src', baseName + '_bin.js');
  const file_abi = path.join(__dirname, '..', 'src', baseName + '_abi.js');

  unlink([file_abi, file_bin]);
  // bytecode is wrapped inside quotes so that it is json compatible (and a json-fetch from web app works)
  wrap_data_into_module(file_bin, '"' + input.compilerOutput.evm.bytecode.object + '"');
  wrap_data_into_module(file_abi, JSON.stringify(input.compilerOutput.abi, null, 2));
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
