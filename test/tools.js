// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */

const fs = require('fs');
const path = require('path');

const Web3 = require('web3');
//const web3Utils = require('web3-utils');
const ganache = require('ganache-core');

const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');
const SolCompilerArtifactAdapter = require('@0x/sol-trace').SolCompilerArtifactAdapter;
const RevertTraceSubprovider = require('@0x/sol-trace').RevertTraceSubprovider;
const CoverageSubprovider = require('@0x/sol-coverage').CoverageSubprovider;
const ProfilerSubprovider = require('@0x/sol-profiler').ProfilerSubprovider;

const helpers = require('../js/helpers.js');

//const digioptionsContracts = require('../js/index.js');

//const contractMarketsBytecode = require('../js/digioptions_markets_bin.js')();

async function serverListen(server, port, host) {
  // wrap listen
  let promise = await new Promise((resolve/*, reject*/) => {
    server.listen(port, host, () => {
      resolve();
    });
  })
    .catch(err => {throw err;});

  return promise;
}

function TestBase(){
  this.host = '127.0.0.1';
  this.port = 8545;
  this.server = null;

  this.providerEngine = null;
  this.coverageSubprovider = null;
  this.profilerSubprovider = null;
  this.revertTraceSubprovider = null;

  this.accounts = null;
  this.gasStatistics = null;
}

TestBase.prototype.start = async function(options){
  this.server = ganache.server(
    Object.assign({}, options, {
      // default options
      gasLimit: 10000000, // high block gas limit for testing (even unoptimized contracts)
      allowUnlimitedContractSize: true, // disable EIP-170
    })
  );
  await serverListen(this.server, this.port, this.host);

  const defaultFromAddress = '0x0000000000000000000000000000000000000000';
  const artifactAdapter = new SolCompilerArtifactAdapter(
    path.join(__dirname, '..', 'artifacts'), /* artifactsPath */
    path.join(__dirname, '..', 'contracts') /* contractsPath */
  );
  this.coverageSubprovider = new CoverageSubprovider(artifactAdapter, defaultFromAddress);
  this.profilerSubprovider = new ProfilerSubprovider(artifactAdapter, defaultFromAddress);
  this.revertTraceSubprovider = new RevertTraceSubprovider(artifactAdapter, defaultFromAddress);

  //this.profilerSubprovider.start();
  this.profilerSubprovider.stop();

  this.providerEngine = new ProviderEngine();
  //this.providerEngine.addProvider(this.coverageSubprovider);
  this.providerEngine.addProvider(this.profilerSubprovider);
  //this.providerEngine.addProvider(this.revertTraceSubprovider);
  this.providerEngine.addProvider(new RpcSubprovider({rpcUrl: `http://${this.host}:${this.port}`}));
  this.providerEngine.start();

  this.web3 = new Web3(
    //ganache.provider(options),
    //new Web3.providers.HttpProvider(`http://${this.host}:${this.port}`),
    this.providerEngine,
    null,
    {
      defaultBlock: 'latest',
      transactionConfirmationBlocks: 1,
      transactionBlockTimeout: 5
    }
  );

  this.accounts = await this.web3.eth.getAccounts();

  this.gasStatistics = new helpers.GasStatistics(this.web3);
};

TestBase.prototype.stop = async function(){
  this.providerEngine.stop();
  //this.profilerSubprovider.stop();
  this.server.close();
};

TestBase.prototype.writeCoverage = function(title){
  //await coverageSubprovider.writeCoverageAsync();
  const fnameCoverage = 'coverage_' + title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '.json';
  const finalCoverage = this.coverageSubprovider._coverageCollector._collector.getFinalCoverage();
  fs.writeFileSync(path.join('coverage', fnameCoverage), JSON.stringify(finalCoverage, null, '\t'));
};

TestBase.prototype.writeProfiler = function(title){
  //await profilerSubprovider.writeProfilerOutputAsync();
  const fnameProfiler = 'coverage_' + title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '.json';
  const finalProfiler = this.profilerSubprovider._profilerCollector._collector.getFinalCoverage();
  fs.writeFileSync(path.join('profiler', fnameProfiler), JSON.stringify(finalProfiler, null, '\t'));
};

TestBase.prototype.writeGasStatistics = function(title){
  const fnameGasStatistics = 'gasStatistics_' + title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '.json';
  fs.writeFileSync(path.join('test', 'gasStatistics', fnameGasStatistics), this.gasStatistics.getJsonString());
};

exports.TestBase = TestBase;
