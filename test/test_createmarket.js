// vim: sts=2:ts=2:sw=2
/* eslint-env mocha, es6 */

const Web3 = require('web3');
const ganache = require('ganache-core');
const assert = require('assert');

const factsigner = require('factsigner');

const digioptionsContracts = require('../js/index.js');
const contractMarketsBytecode = require('../js/digioptions_markets_bin.js')();
const contractMarketListerBytecode = require('../js/digioptions_market_lister_bin.js')();

//before('initialize variables', function(done) {
//  done();
//});

async function setup(){
  const options = {
    //gasPrice: 10000000000,
    //gasLimit: 0x47E7C4,
    accounts: [
      {
        index: 0,
        balance: 100000 * 1000000000000000000
      },
      {
        index: 1,
        secretKey: '0xd71d7ec04c0ad2d6e706fc592a05c901f9161c8cc7c7879a29a76dd48ef795ae',
        balance: 100000 * 1000000000000000000
      },
    ],
    time: new Date(1), // set time of first block to 1970 so that markets can always be created
  };

  return new Web3(ganache.provider(options));
}

describe('Test createMarket() and getMarketDataList()', function() {
  this.timeout(5*1000);

  before('setup', async function() {
    var that = this;
    this.web3 = await setup(this.web3);

    const accounts = await this.web3.eth.getAccounts();
    assert.equal(accounts.length, 2);

    this.accountOwnerAddress = accounts[0];
    this.accountOtherAddress = accounts[1];
    this.accountSign = this.web3.eth.accounts.privateKeyToAccount('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');

    this.market0 = {
      baseUnitExp: 18,
      underlying: factsigner.stringToHex('BTC'),
      ndigit: 2,
      objectionPeriod: 3600,
      expirationDatetime: 1457676000,
      strikes: ['3000000000000000000', '4000000000000000000', '5000000000000000000', '6000000000000000000', '7000000000000000000'].map(function(x){return that.web3.utils.toBN(x);}),
      typeDuration: 0,
      signerAddr: this.accountSign.address,
      feeTaker0: this.accountOwnerAddress,
      feeTaker1: '0x0000000000000000000000000000000000000000',
      transactionFee0: that.web3.utils.toWei('1', 'finney'), // 0.1 percent for each ether value traded
      transactionFee1: that.web3.utils.toWei('0', 'finney'),
    };
    this.market1 = {
      baseUnitExp: 18,
      underlying: factsigner.stringToHex('BTC'),
      ndigit: 2,
      objectionPeriod: 3600,
      expirationDatetime: 1457674000,
      strikes: ['-1000000000000000000', '0', '1000000000000000000', '2000000000000000000', '3000000000000000000'].map(function(x){return that.web3.utils.toBN(x);}),
      typeDuration: 0,
      signerAddr: this.accountSign.address,
      feeTaker0: this.accountOwnerAddress,
      feeTaker1: '0x0000000000000000000000000000000000000000',
      transactionFee0: that.web3.utils.toWei('0', 'finney'),
      transactionFee1: that.web3.utils.toWei('0', 'finney'),
    };
    this.market2 = {
      baseUnitExp: 18,
      underlying: factsigner.stringToHex('BTC'),
      ndigit: 2,
      objectionPeriod: 3600,
      expirationDatetime: 1457677000,
      strikes: ['3000000000000000000', '3250000000000000000', '3500000000000000000', '3750000000000000000', '4000000000000000000'].map(function(x){return that.web3.utils.toBN(x);}),
      typeDuration: 0,
      signerAddr: this.accountSign.address,
      feeTaker0: this.accountOwnerAddress,
      feeTaker1: '0x0000000000000000000000000000000000000000',
      transactionFee0: that.web3.utils.toWei('0', 'finney'),
      transactionFee1: that.web3.utils.toWei('0', 'finney'),
    };
    this.market3 = {
      baseUnitExp: 18,
      underlying: factsigner.stringToHex('BTC-too-low'),
      ndigit: 1, // TOO low !
      objectionPeriod: 3600,
      expirationDatetime: 1457677000,
      strikes: ['110000000000000000' /* 0.11 * 10**18 */].map(function(x){return that.web3.utils.toBN(x);}),
      typeDuration: 0,
      signerAddr: this.accountSign.address,
      feeTaker0: this.accountOwnerAddress,
      feeTaker1: '0x0000000000000000000000000000000000000000',
      transactionFee0: that.web3.utils.toWei('0', 'finney'),
      transactionFee1: that.web3.utils.toWei('0', 'finney'),
    };

    this.factHash0 = factsigner.factHash(this.market0);
    this.factHash1 = factsigner.factHash(this.market1);
    this.factHash2 = factsigner.factHash(this.market2);
    this.factHash3 = factsigner.factHash(this.market3);

    this.marketHash0 = digioptionsContracts.marketHash(this.market0);
    this.marketHash1 = digioptionsContracts.marketHash(this.market1);
    this.marketHash2 = digioptionsContracts.marketHash(this.market2);
    this.marketHash3 = digioptionsContracts.marketHash(this.market3);
  });

  it('create contract', async function() {
    let contract;
    contract = new this.web3.eth.Contract(digioptionsContracts.digioptionsMarketsAbi());
    this.marketsContract = await contract.deploy(
      {
        data: contractMarketsBytecode
      }
    ).send(
      {
        gas: 4000000,
        //value: 0,
        from: this.accountOwnerAddress
      }
    );
    assert.notEqual(this.marketsContract.options.address, undefined);

    // now deploy our market lister contract
    contract = new this.web3.eth.Contract(digioptionsContracts.digioptionsMarketListerAbi());
    this.marketListerContract = await contract.deploy(
      {
        data: contractMarketListerBytecode,
        arguments: [
          this.marketsContract.options.address
        ]
      }
    )
      .send(
        {
          gas: 4000000,
          //gasPrice: '30000000000000',
          from: this.accountOwnerAddress
        }
      );
    assert.notEqual(this.marketListerContract.options.address, undefined);

    // should contain 0 markets
    let marketDataList;

//    marketDataList = (await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
//    assert.equal(marketDataList.length, 0);

//    marketDataList = (await this.marketListerContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
//    assert.equal(marketDataList.length, 0);
  });

  it('add market #0', async function() {
    let signature = factsigner.sign(this.web3, this.accountSign.privateKey, this.factHash0);

    let marketDataBefore = await this.marketsContract.methods.getMarketData(this.marketHash0).call();
    assert.equal(parseInt(marketDataBefore.marketBaseData.expirationDatetime), 0); /* market exists if expirationDatetime != 0) */

    // TODO pass only this.market0 to createMarket()
    await this.marketListerContract.methods.createMarket(
      {
        expirationDatetime: this.market0.expirationDatetime,
        underlying: this.market0.underlying,
        feeTaker0: this.market0.feeTaker0,
        feeTaker1: this.market0.feeTaker1,
        transactionFee0: this.market0.transactionFee0.toString(),
        transactionFee1: this.market0.transactionFee1.toString(),
        ndigit: this.market0.ndigit,
        baseUnitExp: this.market0.baseUnitExp, /* typically 18 */
        typeDuration: this.market0.typeDuration,
        objectionPeriod: this.market0.objectionPeriod,
        strikes: this.market0.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwnerAddress
    });

    let marketData = await this.marketsContract.methods.getMarketData(this.marketHash0).call();
    assert.equal(parseInt(marketData.marketBaseData.expirationDatetime), this.market0.expirationDatetime); /* market exists if expirationDatetime != 0) */

    // should contain 1 market
    let marketDataList;

    marketDataList = (await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 1);
    assert.equal(marketDataList[0].marketHash, this.marketHash0);

    marketDataList = (await this.marketListerContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 1);
    assert.equal(marketDataList[0].marketHash, this.marketHash0);
  });

  it('add market #1', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.factHash1);
    await this.marketListerContract.methods.createMarket(
      {
        expirationDatetime: this.market1.expirationDatetime,
        underlying: this.market1.underlying,
        feeTaker0: this.market1.feeTaker0,
        feeTaker1: this.market1.feeTaker1,
        transactionFee0: this.market1.transactionFee0.toString(),
        transactionFee1: this.market1.transactionFee1.toString(),
        ndigit: this.market1.ndigit,
        baseUnitExp: this.market1.baseUnitExp, /* typically 18 */
        typeDuration: this.market1.typeDuration,
        objectionPeriod: this.market1.objectionPeriod,
        strikes: this.market1.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwnerAddress
    });

    // should contain 2 markets
    let marketDataList;

    marketDataList = (await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketHash, this.marketHash0);
    assert.equal(marketDataList[1].marketHash, this.marketHash1);

    marketDataList = (await this.marketListerContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketHash, this.marketHash0);
    assert.equal(marketDataList[1].marketHash, this.marketHash1);
  });

  /*
  it('should NOT add market #2 (by somone not owning of the contract)', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.factHash2);
    await this.marketListerContract.methods.createMarket(
      {
        expirationDatetime: this.market2.expirationDatetime,
        underlying: this.market2.underlying,
        feeTaker0: this.market2.feeTaker0,
        feeTaker1: this.market2.feeTaker1,
        transactionFee0: this.market2.transactionFee0.toString(),
        transactionFee1: this.market2.transactionFee1.toString(),
        ndigit: this.market2.ndigit,
        baseUnitExp: this.market2.baseUnitExp, // typically 18
        typeDuration: this.market2.typeDuration,
        objectionPeriod: this.market2.objectionPeriod,
        strikes: this.market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOtherAddress
    }).then(
      () => Promise.reject(new Error('Expected method to reject.')),
      err => assert.equal(err instanceof Error, true)
    );
  });
  */

  it('add market #2', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.factHash2);
    await this.marketListerContract.methods.createMarket(
      {
        expirationDatetime: this.market2.expirationDatetime,
        underlying: this.market2.underlying,
        feeTaker0: this.market2.feeTaker0,
        feeTaker1: this.market2.feeTaker1,
        transactionFee0: this.market2.transactionFee0.toString(),
        transactionFee1: this.market2.transactionFee1.toString(),
        ndigit: this.market2.ndigit,
        baseUnitExp: this.market2.baseUnitExp, /* typically 18 */
        typeDuration: this.market2.typeDuration,
        objectionPeriod: this.market2.objectionPeriod,
        strikes: this.market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwnerAddress
    });

    let marketData = await this.marketsContract.methods.getMarketData(this.marketHash2).call();
    assert.notEqual(marketData.marketBaseData.expirationDatetime, 0); /* market exists if expirationDatetime != 0) */

    // should contain 3 markets
    let marketDataList;

    marketDataList = (await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 3);
    assert.equal(marketDataList[0].marketHash, this.marketHash2);
    assert.equal(marketDataList[1].marketHash, this.marketHash0);
    assert.equal(marketDataList[2].marketHash, this.marketHash1);

    marketDataList = (await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 3);
    assert.equal(marketDataList[0].marketHash, this.marketHash2);
    assert.equal(marketDataList[1].marketHash, this.marketHash0);
    assert.equal(marketDataList[2].marketHash, this.marketHash1);
  });

  it('add market #2 (again)', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.factHash2);
    await this.marketListerContract.methods.createMarket(
      {
        expirationDatetime: this.market2.expirationDatetime,
        underlying: this.market2.underlying,
        feeTaker0: this.market2.feeTaker0,
        feeTaker1: this.market2.feeTaker1,
        transactionFee0: this.market2.transactionFee0.toString(),
        transactionFee1: this.market2.transactionFee1.toString(),
        ndigit: this.market2.ndigit,
        baseUnitExp: this.market2.baseUnitExp, /* typically 18 */
        typeDuration: this.market2.typeDuration,
        objectionPeriod: this.market2.objectionPeriod,
        strikes: this.market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwnerAddress
    });
    //.then(
    //  () => Promise.reject(new Error('Expected method to reject.')),
    //  err => assert.equal(err instanceof Error, true)
    //);

    // should (still) contain 3 markets
    let marketDataList;

    marketDataList = (await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 3);

    marketDataList = (await this.marketListerContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 3);
  });

  it('should NOT add market #3 (ndigit precision too low)', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.factHash3);
    await this.marketListerContract.methods.createMarket(
      {
        expirationDatetime: this.market3.expirationDatetime,
        underlying: this.market3.underlying,
        feeTaker0: this.market3.feeTaker0,
        feeTaker1: this.market3.feeTaker1,
        transactionFee0: this.market3.transactionFee0.toString(),
        transactionFee1: this.market3.transactionFee1.toString(),
        ndigit: this.market3.ndigit,
        baseUnitExp: this.market3.baseUnitExp, /* typically 18 */
        typeDuration: this.market3.typeDuration,
        objectionPeriod: this.market3.objectionPeriod,
        strikes: this.market3.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwnerAddress
    }).then(
      () => Promise.reject(new Error('Expected method to reject.')),
      err => assert.equal(err instanceof Error, true)
    );
  });

  it('should still contain 3 markets', async function() {
    let marketDataList;

    marketDataList = (await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 3);
    assert.equal(marketDataList[0].marketHash, this.marketHash2);
    assert.equal(marketDataList[1].marketHash, this.marketHash0);
    assert.equal(marketDataList[2].marketHash, this.marketHash1);

    marketDataList = (await this.marketListerContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 3);
    assert.equal(marketDataList[0].marketHash, this.marketHash2);
    assert.equal(marketDataList[1].marketHash, this.marketHash0);
    assert.equal(marketDataList[2].marketHash, this.marketHash1);

  });

  it('get markets with expiration (should return 2 markets)', async function() {
    let marketDataList;

    marketDataList = (await this.marketsContract.methods.getMarketDataList(false, false, this.market0.expirationDatetime, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketHash, this.marketHash2);
    assert.equal(marketDataList[1].marketHash, this.marketHash0);

    marketDataList = (await this.marketListerContract.methods.getMarketDataList(false, false, this.market0.expirationDatetime, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketHash, this.marketHash2);
    assert.equal(marketDataList[1].marketHash, this.marketHash0);
  });

  it('try to list markets from second market on (2 markets)', async function() {
    let marketDataList;

    marketDataList = (await this.marketsContract.methods.getMarketDataList(false, false, 0, 20, [this.marketHash2]).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketHash, this.marketHash0);
    assert.equal(marketDataList[1].marketHash, this.marketHash1);

    marketDataList = (await this.marketListerContract.methods.getMarketDataList(false, false, 0, 20, [this.marketHash2]).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketHash, this.marketHash0);
    assert.equal(marketDataList[1].marketHash, this.marketHash1);
  });

  it('set testMarket', async function() {
    await this.marketListerContract.methods.setTestMarket(
      this.marketHash0,
      true
    ).send({
      gas: 3000000,
      from: this.accountOwnerAddress
    });
  });


  it('should contain 2 (marketLister) / 3 (markets) non-testMarkets', async function() {
    let marketDataList;

    marketDataList = (await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 3);

    marketDataList = (await this.marketListerContract.methods.getMarketDataList(true, false, 0, 20, []).call()).filter(function(marketData){return marketData.marketBaseData.expirationDatetime !== 0;});
    assert.equal(marketDataList.length, 2);
  });


  it('check contract versions', async function() {
    const contractInfo = await this.marketListerContract.methods.getContractInfo().call();

    const versionMarketLister = digioptionsContracts.versionFromInt(contractInfo.versionMarketLister);
    const versionMarkets = digioptionsContracts.versionFromInt(contractInfo.versionMarkets);

    assert.equal(digioptionsContracts.versionMarketLister.major, versionMarketLister.major);
    assert.equal(digioptionsContracts.versionMarketLister.minor, versionMarketLister.minor);

    assert.equal(digioptionsContracts.versionMarkets.major, versionMarkets.major);
    assert.equal(digioptionsContracts.versionMarkets.minor, versionMarkets.minor);

    /*
    assert.equal(
      process.env.npm_package_version,
      digioptionsContracts.contractVersion.major + '.' +
      digioptionsContracts.contractVersion.minor + '.' +
      digioptionsContracts.contractVersion.bugfix
    );
    */
  });

  it('check payoutPerNanoOption', async function() {
    const payoutPerNanoOption = this.web3.utils.toBN(await this.marketsContract.methods.PAYOUT_PER_NANOOPTION().call());
    assert.ok(payoutPerNanoOption.eq(digioptionsContracts.payoutPerNanoOption));

    // check that one whole option is worth 1 ether on win
    const one = this.web3.utils.toBN('1');
    assert.ok(this.web3.utils.toWei(one, 'ether').eq(digioptionsContracts.nanoOptionsPerOption.mul(digioptionsContracts.payoutPerNanoOption)));
  });
});
