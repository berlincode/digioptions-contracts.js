// vim: sts=2:ts=2:sw=2
/* eslint-env mocha, es6 */

const fs = require('fs');

const web3Utils = require('web3-utils');
const assert = require('assert');

const factsigner = require('factsigner');

const digioptionsContracts = require('../js/index.js');
const TestBase = require('./tools.js').TestBase;
//const helpers = require('../js/helpers.js');


const contractMarketsBytecode = require('../dist/cjs/digioptions_markets_bin.js').default();
const contractMarketListerBytecode = require('../dist/cjs/digioptions_market_lister_bin.js').default();
const contractMetaBytecode = require('../dist/cjs/digioptions_meta_bin.js').default();

const digioptionsMetaAbi = require('../dist/cjs/digioptions_meta_abi.js').default();

const epochSecondsStart = 946684800; // Fri, 01 Jan 2000 00:00:00 GMT
const addrZero = '0x0000000000000000000000000000000000000000';


//before('initialize variables', function(done) {
//  done();
//});
const logger = {
  log: function(/*message*/) {
    //console.log(message);
  }
};

async function setup(){
  var dateStart = new Date(0); // The 0 is the key, which sets the date to the epoch
  dateStart.setUTCSeconds(epochSecondsStart);

  const options = {
    logger: logger,
    //gasPrice: 20000000000,
    //gasLimit: 0x47E7C4,
    accounts: [
      {
        index: 0,
        secretKey: '0x6d535de64aed7dc208ef828a09b52585f6e4a14ca9966ef54df663e9807328a0', // 0x0916A531dBD87C820531de8805ddE753F3e4b8f7
        balance: web3Utils.toWei('1000', 'ether'),
      },
      {
        index: 1,
        secretKey: '0xd71d7ec04c0ad2d6e706fc592a05c901f9161c8cc7c7879a29a76dd48ef795ae',
        balance: web3Utils.toWei('1000', 'ether'),
      },
    ],
    time: dateStart, // set time of first block
  };

  const testBase = new TestBase();
  await testBase.start(options);
  return testBase;
}

function loadBeforeAndAfter(self) {
  before('setup', async function() {
    this.testBase = await setup(this.web3);
    this.web3 = this.testBase.web3;

    assert.equal(this.testBase.accounts.length, 2);

    this.accountOwnerAddress = this.testBase.accounts[0];
    this.accountOtherAddress = this.testBase.accounts[1];
    this.accountSign = this.web3.eth.accounts.privateKeyToAccount('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');

    this.marketBaseData0 = {
      underlyingString: 'BTC\0USD',
      expirationDatetime: 978307200, // Mon, 01 Jan 2001 00:00:00 GMT
      objectionPeriod: 3600,
      config: (
        factsigner.constants.configMarketType.STRIKED + /* this a striked market */
        factsigner.constants.configIntervalType.USED
      ),
      marketCategory: factsigner.constants.marketCategory.CRYPTO,

      baseUnitExp: factsigner.constants.BASE_UNIT_EXP_DEFAULT,
      ndigit: 2,

      strikes: [
        factsigner.parseFloatToBn('3.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '3000000000000000000'
        factsigner.parseFloatToBn('4.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '4000000000000000000'
        factsigner.parseFloatToBn('5.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '5000000000000000000'
        factsigner.parseFloatToBn('6.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '6000000000000000000'
        factsigner.parseFloatToBn('7.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '7000000000000000000'
      ],
      marketInterval: factsigner.constants.marketInterval.YEARLY,
      signerAddr: this.accountSign.address,
      feeTaker0: this.accountOwnerAddress,
      feeTaker1: this.accountOwnerAddress, // '0x0000000000000000000000000000000000000000',
      transactionFee0: 10, // 0.1 percent of the traded value
      transactionFee1: 20, // 0.2 percent of the traded value
      transactionFeeSigner: 5, // 0.05 percent of the traded value
    };
    this.marketBaseData1 = {
      underlyingString: 'BTC2\0USD',
      expirationDatetime: 978307200 - 2000, // Mon, 01 Jan 2001 00:00:00 GMT -2000 seconds
      objectionPeriod: 3600,
      config: (
        factsigner.constants.configMarketType.STRIKED + /* this a striked market */
        factsigner.constants.configIntervalType.USED
      ),
      marketCategory: factsigner.constants.marketCategory.CRYPTO,

      baseUnitExp: factsigner.constants.BASE_UNIT_EXP_DEFAULT,
      ndigit: 2,

      strikes: [
        factsigner.parseFloatToBn('0.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '0'
        factsigner.parseFloatToBn('1.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '1000000000000000000'
        factsigner.parseFloatToBn('2.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '2000000000000000000'
        factsigner.parseFloatToBn('3.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '3000000000000000000'
      ],
      marketInterval: factsigner.constants.marketInterval.YEARLY,
      signerAddr: this.accountSign.address,
      feeTaker0: this.accountOwnerAddress,
      feeTaker1: this.accountOwnerAddress, //'0x0000000000000000000000000000000000000000',
      transactionFee0: 10, // 0.1 percent of the traded value
      transactionFee1: 20, // 0.2 percent of the traded value
      transactionFeeSigner: 5, // 0.05 percent of the traded value
    };
    this.marketBaseData2 = {
      underlyingString: 'BTC3\0USD',
      expirationDatetime: 978307200 + 1000, // Mon, 01 Jan 2001 00:00:00 GMT + 1000 seconds
      objectionPeriod: 3600,
      config: (
        factsigner.constants.configMarketType.STRIKED + /* this a striked market */
        factsigner.constants.configIntervalType.USED
      ),
      marketCategory: factsigner.constants.marketCategory.CRYPTO,

      baseUnitExp: factsigner.constants.BASE_UNIT_EXP_DEFAULT,
      ndigit: 2,

      strikes: [
        factsigner.parseFloatToBn('3.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '3000000000000000000'
        factsigner.parseFloatToBn('3.25', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '3250000000000000000'
        factsigner.parseFloatToBn('3.5', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '3500000000000000000'
        factsigner.parseFloatToBn('3.75', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '3750000000000000000'
        factsigner.parseFloatToBn('4.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '4000000000000000000'
      ],
      marketInterval: factsigner.constants.marketInterval.YEARLY,
      signerAddr: this.accountSign.address,
      feeTaker0: this.accountOwnerAddress,
      feeTaker1: this.accountOwnerAddress, // '0x0000000000000000000000000000000000000000',
      transactionFee0: 10, // 0.1 percent of the traded value
      transactionFee1: 20, // 0.2 percent of the traded value
      transactionFeeSigner: 5, // 0.05 percent of the traded value
    };
    this.marketBaseData3 = {
      underlyingString: 'BTC-too-low\0USD',
      expirationDatetime: 978307200 + 1000, // Mon, 01 Jan 2001 00:00:00 GMT + 100 seconds
      objectionPeriod: 3600,
      config: (
        factsigner.constants.configMarketType.STRIKED + /* this a striked market */
        factsigner.constants.configIntervalType.USED
      ),
      marketCategory: factsigner.constants.marketCategory.CRYPTO,

      baseUnitExp: factsigner.constants.BASE_UNIT_EXP_DEFAULT,
      ndigit: 1, // TOO low !

      strikes: [
        factsigner.parseFloatToBn('0.11', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(), // '110000000000000000' /* 0.11 * 10**18 */
      ],
      marketInterval: factsigner.constants.marketInterval.YEARLY,
      signerAddr: this.accountSign.address,
      feeTaker0: this.accountOwnerAddress,
      feeTaker1: this.accountOwnerAddress, //'0x0000000000000000000000000000000000000000',
      transactionFee0: 10, // 0.1 percent of the traded value
      transactionFee1: 20, // 0.2 percent of the traded value
      transactionFeeSigner: 5, // 0.05 percent of the traded value
    };

    this.factHash0 = factsigner.factHash(this.marketBaseData0);
    this.factHash1 = factsigner.factHash(this.marketBaseData1);
    this.factHash2 = factsigner.factHash(this.marketBaseData2);
    this.factHash3 = factsigner.factHash(this.marketBaseData3);

    this.marketHash0 = digioptionsContracts.marketHash(this.marketBaseData0);
    this.marketHash1 = digioptionsContracts.marketHash(this.marketBaseData1);
    this.marketHash2 = digioptionsContracts.marketHash(this.marketBaseData2);
    this.marketHash3 = digioptionsContracts.marketHash(this.marketBaseData3);
  });
  after('after', async function() {
    this.testBase.stop();

    this.testBase.writeCoverage(self.title);
    this.testBase.writeProfiler(self.title);
    this.testBase.writeGasStatistics(self.title);
  });
}


describe('test createMarket and getMarketDataList', function() {
  this.timeout(120*1000);

  loadBeforeAndAfter(this);

  it('deploy markets contract', async function() {
    let txHash;

    const contractMarket = new this.web3.eth.Contract(digioptionsContracts.digioptionsMarketsAbi());
    this.marketsContract = await contractMarket.deploy(
      {
        data: contractMarketsBytecode
      }
    )
      .send(
        {
          gas: 9800000, // TODO
          from: this.accountOwnerAddress
        }
      )
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'contract create marketsContract');

    assert.notEqual(this.marketsContract.options.address, undefined);
  });

  it('deploy marketLister contract', async function() {
    let txHash;

    // deploy our market lister contract
    const contractMarketLister = new this.web3.eth.Contract(digioptionsContracts.digioptionsMarketListerAbi());
    this.marketListerContract = await contractMarketLister.deploy(
      {
        data: contractMarketListerBytecode,
        arguments: [
          this.marketsContract.options.address
        ]
      }
    )
      .send(
        {
          gas: 8800000, // TODO
          from: this.accountOwnerAddress
        }
      )
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'contract create marketListerContract');

    assert.notEqual(this.marketListerContract.options.address, undefined);
  });

  it('deploy meta contract', async function() {
    let txHash;

    // now deploy the meta contract
    const contractMeta = new this.web3.eth.Contract(digioptionsMetaAbi);
    this.metaContract = await contractMeta.deploy(
      {
        data: contractMetaBytecode
      }
    )
      .send(
        {
          gas: 8800000, // TODO
          from: this.accountOwnerAddress
        }
      )
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'contract create metaContract');

    assert.notEqual(this.metaContract.options.address, undefined);
  });

  it('deploy test contract', async function() {
    let txHash;

    const artifacts = JSON.parse(fs.readFileSync('artifacts/DigiOptionsTest.json'));
    // now deploy the meta contract
    const contractTest = new this.web3.eth.Contract(artifacts.compilerOutput.abi);
    this.testContract = await contractTest.deploy(
      {
        data: artifacts.compilerOutput.evm.bytecode.object
      }
    )
      .send(
        {
          gas: 8800000, // TODO
          from: this.accountOwnerAddress
        }
      )
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'contract create testContract');

    assert.notEqual(this.testContract.options.address, undefined);
  });

  it('check table lookup', async function() {
    const dividers = [
      0, // none
      190 * 24 * 60 * 60, // FactsignerDefines.MarketInterval.YEARLY / 190 days // TODO
      45 * 24 * 60 * 60, // FactsignerDefines.MarketInterval.MONTHLY / < 45 days
      8 * 24 * 60 * 60, // FactsignerDefines.MarketInterval.WEEKLY / < 8 days
      36 * 60 * 60, // FactsignerDefines.MarketInterval.DAILY / < 36 hours
      2 * 60 * 60, // FactsignerDefines.MarketInterval.HOURLY / < 2 hours
      0 // TODO FactsignerDefines.MarketInterval.SHORT_TERM
    ];
    for (let idx=0 ; idx < dividers.length ; idx++){
      const divider = dividers[idx];
      //console.log(web3Utils.toBN(await this.testContract.methods.getDividerTest(idx).call()).toString());
      //console.log(web3Utils.toBN(divider).shln(8).toString());
      assert.ok(
        web3Utils.toBN(await this.testContract.methods.getDividerTest(idx).call()).eq(web3Utils.toBN(divider))
      );
    }
  });

  it('check factHashes (javascript vs. solidity)', async function() {
    const self = this;

    const calcFactHash = function(market){
      return self.testContract.methods.calcFactHashTest(market)
        .call();
    };
    assert.equal(await calcFactHash(this.marketBaseData0), this.factHash0);
    assert.equal(await calcFactHash(this.marketBaseData1), this.factHash1);
    assert.equal(await calcFactHash(this.marketBaseData2), this.factHash2);
    assert.equal(await calcFactHash(this.marketBaseData3), this.factHash3);
  });

  it('check marketHashes (javascript vs. solidity)', async function() {
    const self = this;

    const calcMarketHash = function(market){
      return self.testContract.methods.calcMarketHashTest(market)
        .call();
    };
    assert.equal(await calcMarketHash(this.marketBaseData0), this.marketHash0);
    assert.equal(await calcMarketHash(this.marketBaseData1), this.marketHash1);
    assert.equal(await calcMarketHash(this.marketBaseData2), this.marketHash2);
    assert.equal(await calcMarketHash(this.marketBaseData3), this.marketHash3);
  });

  it('register signerAdresses at market lister contract', async function() {
    const self = this;
    const setSigner = async function(addr, value){
      await self.marketListerContract.methods.setSigner(
        addr, value
      ).send(
        {
          gas: 9800000, // TODO
          from: self.accountOwnerAddress
        }
      );
    };
    const getSignerDataList = async function(){return (await self.marketListerContract.methods.getMarketListerInfo().call()).signerDataList;};
    assert.equal(0, getSignerDataList.length);

    // set signer
    await setSigner(this.accountSign.address, '0x1234');
    assert.equal(1, (await getSignerDataList()).length);
  });

  it('check that no market are created', async function() {
    // should contain 0 markets
    const marketDataList0 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketsContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList0.length, 0);

    const marketDataList1 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketListerContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList1.length, 0);
  });


  it('add market #0 (by marketLister owner)', async function() {
    const signature = factsigner.signFactsignerMessage(this.factHash0, this.accountSign.privateKey);

    const marketDataBefore = await this.marketsContract.methods.getMarketDataByMarketHash(addrZero, this.marketHash0).call();
    assert.equal(parseInt(marketDataBefore.marketBaseData.expirationDatetime), 0); /* market exists if expirationDatetime != 0) */

    let txHash;
    //testBase.profilerSubprovider.start();
    /*
    await this.metaContract.methods.createRegisterAndSettlement(
      [
         create and register
        {
          digiOptionsMarkets: this.marketListerContract.options.address,
          marketBaseData: this.marketBaseData0,
          testMarket: false,
          signature: signature,
        },
      ],
      [
         settlement
      ]
    )
    */
    await this.marketListerContract.methods.createMarket(
      this.marketBaseData0,
      false,
      signature
    )
      .send({
        gas: 3000000,
        from: this.accountOwnerAddress
      })
      .on('transactionHash', function(hash){txHash = hash;});
    //this.testBase.profilerSubprovider.stop();

    await this.testBase.gasStatistics.add(txHash, 'market create + register');

    const marketData = await this.marketsContract.methods.getMarketDataByMarketHash(addrZero, this.marketHash0).call();
    assert.equal(parseInt(marketData.marketBaseData.expirationDatetime), this.marketBaseData0.expirationDatetime); /* market exists if expirationDatetime != 0) */

    // should contain 1 market
    const marketDataList0 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketsContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList0.length, 1);
    assert.equal(marketDataList0[0].marketHash, this.marketHash0);

    const marketDataList1 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketListerContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList1.length, 1);
    assert.equal(marketDataList1[0].marketHash, this.marketHash0);
  });

  it('add market #1', async function() {
    const signature = await factsigner.signFactsignerMessage(this.factHash1, this.accountSign.privateKey);
    let txHash;
    await this.marketListerContract.methods.createMarket(
      this.marketBaseData1,
      false,
      signature,
    )
      .send({
        gas: 3000000,
        from: this.accountOtherAddress
      })
      .on('transactionHash', function(hash){txHash = hash;});
    //profilerSubprovider.stop();

    await this.testBase.gasStatistics.add(txHash, 'market create + register');

    // should contain 2 markets

    const marketDataList0 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketsContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList0.length, 2);
    assert.equal(marketDataList0[0].marketHash, this.marketHash0);
    assert.equal(marketDataList0[1].marketHash, this.marketHash1);

    const marketDataList1 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketListerContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList1.length, 2);
    assert.equal(marketDataList1[0].marketHash, this.marketHash0);
    assert.equal(marketDataList1[1].marketHash, this.marketHash1);
  });

  it('add market #2', async function() {
    const signature = await factsigner.signFactsignerMessage(this.factHash2, this.accountSign.privateKey);
    let txHash;
    await this.marketListerContract.methods.createMarket(
      this.marketBaseData2,
      false,
      signature,
    )
      .send({
        gas: 3000000,
        from: this.accountOtherAddress
      })
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'market create + register');

    const marketData = await this.marketsContract.methods.getMarketDataByMarketHash(addrZero, this.marketHash2).call();
    assert.notEqual(marketData.marketBaseData.expirationDatetime, 0); /* market exists if expirationDatetime != 0) */

    // should contain 3 markets
    const marketDataList0 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketsContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList0.length, 3);
    assert.equal(marketDataList0[0].marketHash, this.marketHash2);
    assert.equal(marketDataList0[1].marketHash, this.marketHash0);
    assert.equal(marketDataList0[2].marketHash, this.marketHash1);

    const marketDataList1 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketListerContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList1.length, 3);
    assert.equal(marketDataList1[0].marketHash, this.marketHash2);
    assert.equal(marketDataList1[1].marketHash, this.marketHash0);
    assert.equal(marketDataList1[2].marketHash, this.marketHash1);
  });

  it('add market #2 (again)', async function() {
    const signature = await factsigner.signFactsignerMessage(this.factHash2, this.accountSign.privateKey);
    await this.marketListerContract.methods.createMarket(
      this.marketBaseData2,
      false,
      signature,
    )
      .send({
        gas: 3000000,
        from: this.accountOtherAddress
      });
    //.then(
    //  () => Promise.reject(new Error('Expected method to reject.')),
    //  err => assert.equal(err instanceof Error, true)
    //);

    // should (still) contain 3 markets
    const marketDataList0 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketsContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList0.length, 3);

    const marketDataList1 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketListerContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList1.length, 3);
  });

  /* TODO fail
  it('should NOT add market #3 (ndigit precision too low)', async function() {
    const signature = await factsigner.signFactsignerMessage(this.factHash3, this.accountSign.privateKey);
    await this.marketListerContract.methods.registerMarket(
      [
        // create and register
        {
          digiOptionsMarkets: this.marketListerContract.options.address,
          marketBaseData: this.marketBaseData3,
          testMarket: false,
          signature: signature,
        },
      ],
      [
        // settlement
      ]
    ).send({
      gas: 3000000,
      from: this.accountOtherAddress
    }).then(
      () => Promise.reject(new Error('Expected method to reject.')),
      err => assert.equal(err instanceof Error, true)
    );
  });
  */

  it('should still contain 3 markets', async function() {
    const marketDataList0 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketsContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList0.length, 3);
    assert.equal(marketDataList0[0].marketHash, this.marketHash2);
    assert.equal(marketDataList0[1].marketHash, this.marketHash0);
    assert.equal(marketDataList0[2].marketHash, this.marketHash1);

    const marketDataList1 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketListerContract.options.address,
      addrZero,
      null, //expirationDatetime
    );
    assert.equal(marketDataList1.length, 3);
    assert.equal(marketDataList1[0].marketHash, this.marketHash2);
    assert.equal(marketDataList1[1].marketHash, this.marketHash0);
    assert.equal(marketDataList1[2].marketHash, this.marketHash1);
  });

  it('get markets with expiration (should return 2 markets)', async function() {
    const marketDataList0 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketsContract.options.address,
      addrZero,
      this.marketBaseData0.expirationDatetime, //expirationDatetime
    );
    assert.equal(marketDataList0.length, 2);
    assert.equal(marketDataList0[0].marketHash, this.marketHash2);
    assert.equal(marketDataList0[1].marketHash, this.marketHash0);

    const marketDataList1 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketListerContract.options.address,
      addrZero,
      this.marketBaseData0.expirationDatetime, //expirationDatetime
    );
    assert.equal(marketDataList1.length, 2);
    assert.equal(marketDataList1[0].marketHash, this.marketHash2);
    assert.equal(marketDataList1[1].marketHash, this.marketHash0);
  });

  //TODO
  /*
  it('try to list markets from second market on (2 markets)', async function() {
    const marketDataList0 = (await this.marketsContract.methods.getMarketDataList(false, false, 0, 20, [this.marketHash2]).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList0.length, 2);
    assert.equal(marketDataList0[0].marketHash, this.marketHash0);
    assert.equal(marketDataList0[1].marketHash, this.marketHash1);

    const marketDataList1 = (await this.marketListerContract.methods.getMarketDataList(false, false, 0, 20, [this.marketHash2]).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList1.length, 2);
    assert.equal(marketDataList1[0].marketHash, this.marketHash0);
    assert.equal(marketDataList1[1].marketHash, this.marketHash1);
  });
  */

  it('set testMarket (by accountOther)', async function() {
    await this.marketListerContract.methods.setTestMarket(
      this.marketHash0,
      true
    ).send({
      gas: 3000000,
      from: this.accountOwnerAddress
    });
  });


  it('should contain 2 (marketLister) / 3 (markets) non-testMarkets', async function() {
    const marketDataList0 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketsContract.options.address,
      addrZero,
      null, //expirationDatetime
      {
        // options
        filterFunc: function(marketData){return ! marketData.testMarket;}
      }
    );
    assert.equal(marketDataList0.length, 3);

    const marketDataList1 = await digioptionsContracts.getMarketDataList(
      this.web3,
      this.marketListerContract.options.address,
      addrZero,
      null, //expirationDatetime
      {
        // options
        filterFunc: function(marketData){return ! marketData.testMarket;}
      }
    );
    assert.equal(marketDataList1.length, 2);
  });

  it('register more (fake) signerAdresses at market lister contract', async function() {
    const self = this;
    const setSigner = async function(addr, value){
      await self.marketListerContract.methods.setSigner(
        addr, value
      ).send(
        {
          gas: 9800000, // TODO
          from: self.accountOwnerAddress
        }
      );
    };
    const getSignerDataList = async function(){return (await self.marketListerContract.methods.getMarketListerInfo().call()).signerDataList;};

    // set second signer
    await setSigner('0x0000000000000000000000000000000000000002', '0x5678');
    assert.equal(2, (await getSignerDataList()).length);

    // update second signer
    await setSigner('0x0000000000000000000000000000000000000002', '0x9999');
    assert.equal(2, (await getSignerDataList()).length);
  });

  it('check contract versions and atomicOptionPayoutWeiExpBN', async function() {
    const contractDescription = await digioptionsContracts.getContractDescription(
      this.web3,
      this.marketListerContract
    );

    const versionMarketLister = contractDescription.versionMarketLister;
    assert.equal(digioptionsContracts.versionMarketLister.major, versionMarketLister.major);
    assert.equal(digioptionsContracts.versionMarketLister.minor, versionMarketLister.minor);
    assert.equal(digioptionsContracts.versionMarketLister.bugfix, versionMarketLister.bugfix);

    const versionMarkets = contractDescription.versionMarkets;
    assert.equal(digioptionsContracts.versionMarkets.major, versionMarkets.major);
    assert.equal(digioptionsContracts.versionMarkets.minor, versionMarkets.minor);
    assert.equal(digioptionsContracts.versionMarkets.bugfix, versionMarkets.bugfix);

    /*TODO
    const versionMeta = digioptionsContracts.versionFromInt(contractInfo.versionMeta);
    assert.equal(digioptionsContracts.versionMeta.major, versionMeta.major);
    assert.equal(digioptionsContracts.versionMeta.minor, versionMeta.minor);
    assert.equal(digioptionsContracts.versionMeta.bugfix, versionMeta.bugfix);
    */

    /*
    assert.equal(
      process.env.npm_package_version,
      digioptionsContracts.contractVersion.major + '.' +
      digioptionsContracts.contractVersion.minor + '.' +
      digioptionsContracts.contractVersion.bugfix
    );
    */

    assert.ok(contractDescription.atomicOptionPayoutWeiExpBN.eq(web3Utils.toBN('9')));

    const atomicOptionPayoutWeiBn = web3Utils.toBN('10').pow(web3Utils.toBN(contractDescription.atomicOptionPayoutWeiExpBN));
    assert.ok(atomicOptionPayoutWeiBn.eq(web3Utils.toBN('1000000000')));

    // check that one whole option is worth 1 ether on win
    //TODO
    //const one = web3Utils.toBN('1');

  });

});
