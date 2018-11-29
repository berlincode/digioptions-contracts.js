// vim: sts=2:ts=2:sw=2
/* eslint-env mocha, es6 */

const Web3 = require('web3');
const Ganache = require('ganache-core');
const assert = require('assert');

const factsigner = require('factsigner');

const digioptionsContracts = require('../index.js');
const contractBytecode = require('../digioptions_markets_bin.js');

//before('initialize variables', function(done) {
//  done();
//});

async function setup(web3){
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
      {
        index: 2,
        secretKey: '0x2fe53f5b2e15c02cf3d15bec513c72938f41ff389ac6e829e857267acfea6bec',
        balance: 0
      } // used only as signing authority
    ],
    time: new Date(1), // set time of first block to 1970 so that markets can always be created
  };

  web3.setProvider(Ganache.provider(options));

  const accounts = await web3.eth.getAccounts();

  assert.equal(accounts.length, 3);
  return accounts;
}

describe('Test createMarket() and getMarketDataList()', function() {
  this.timeout(5*1000);

  const market0 = {
    baseUnitExp: 18,
    name: 'BTC',
    ndigit: 2,
    objectionPeriod: 3600,
    settlement: 1457676000, // settlement
    strikes: ['3000000000000000000', '4000000000000000000', '5000000000000000000', '6000000000000000000', '7000000000000000000'].map(function(x){return Web3.utils.toBN(x);})
  };
  const market1 = {
    baseUnitExp: 18,
    name: 'BTC',
    ndigit: 2,
    objectionPeriod: 3600,
    settlement: 1457674000, // settlement
    strikes: ['3000000000000000000', '4000000000000000000', '5000000000000000000', '6000000000000000000', '7000000000000000000'].map(function(x){return Web3.utils.toBN(x);})
  };
  const market2 = {
    baseUnitExp: 18,
    name: 'BTC',
    ndigit: 2,
    objectionPeriod: 3600,
    settlement: 1457677000, // settlement
    strikes: ['3000000000000000000', '3250000000000000000', '3500000000000000000', '3750000000000000000', '4000000000000000000'].map(function(x){return Web3.utils.toBN(x);})
  };
  const market3 = {
    baseUnitExp: 18,
    name: 'BTC-too-low',
    ndigit: 1, // TOO low !
    objectionPeriod: 3600,
    settlement: 1457677000, // settlement
    strikes: ['110000000000000000' /* 0.11 * 10**18 */].map(function(x){return Web3.utils.toBN(x);})
  };

  const marketFactHash0 = factsigner.factHash(market0);
  const marketFactHash1 = factsigner.factHash(market1);
  const marketFactHash2 = factsigner.factHash(market2);
  const marketFactHash3 = factsigner.factHash(market3);

  const transactionFee = Web3.utils.toBN(0);

  before('setup', async function() {
    this.web3 = new Web3();
    const accounts = await setup(this.web3);
    this.accountOwner = accounts[0];
    this.accountOther = accounts[1];
    this.accountSign = accounts[2];
  });

  it('create contract', async function() {
    const contract = new this.web3.eth.Contract(digioptionsContracts.digioptionsMarketsAbi);

    this.marketsContract = await contract.deploy(
      {
        data: contractBytecode
      }
    ).send(
      {
        gas: 4000000,
        //value: 0,
        from: this.accountOwner
      }
    );
    assert.notEqual(this.marketsContract, undefined);

    // should contain 0 markets
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});
    assert.equal(marketDataList.length, 0);
  });

  it('add market #0', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign, marketFactHash0);

    let marketDataBefore = await this.marketsContract.methods.getMarketData(marketFactHash0).call();
    assert.equal(parseInt(marketDataBefore.marketBaseData.expirationDatetime), 0); /* market exists if expirationDatetime != 0) */

    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: market0.settlement,
        underlying: factsigner.stringToHex(market0.name),
        transactionFee: transactionFee.toString(),
        ndigit: market0.ndigit,
        baseUnitExp: market0.baseUnitExp, /* typically 18 */
        objectionPeriod: market0.objectionPeriod,
        strikes: market0.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwner
    });

    let marketData = await this.marketsContract.methods.getMarketData(marketFactHash0).call();
    assert.equal(parseInt(marketData.marketBaseData.expirationDatetime), market0.settlement); /* market exists if expirationDatetime != 0) */

    // should contain 1 market
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});

    assert.equal(marketDataList.length, 1);
    assert.equal(marketDataList[0].marketFactHash, marketFactHash0);
  });

  it('add market #1', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign, marketFactHash1);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: market1.settlement,
        underlying: factsigner.stringToHex(market1.name),
        transactionFee: transactionFee.toString(),
        ndigit: market1.ndigit,
        baseUnitExp: market1.baseUnitExp, /* typically 18 */
        objectionPeriod: market1.objectionPeriod,
        strikes: market1.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwner
    });

    // should contain 2 markets
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});

    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketFactHash, marketFactHash0);
    assert.equal(marketDataList[1].marketFactHash, marketFactHash1);
  });

  it('should NOT add market #2 (by somone not owning of the contract)', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign, marketFactHash2);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: market2.settlement,
        underlying: factsigner.stringToHex(market2.name),
        transactionFee: transactionFee.toString(),
        ndigit: market2.ndigit,
        baseUnitExp: market2.baseUnitExp, /* typically 18 */
        objectionPeriod: market2.objectionPeriod,
        strikes: market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOther
    }).then(
      () => Promise.reject(new Error('Expected method to reject.')),
      err => assert.equal(err instanceof Error, true)
    );
  });

  it('add market #2', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign, marketFactHash2);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: market2.settlement,
        underlying: factsigner.stringToHex(market2.name),
        transactionFee: transactionFee.toString(),
        ndigit: market2.ndigit,
        baseUnitExp: market2.baseUnitExp, /* typically 18 */
        objectionPeriod: market2.objectionPeriod,
        strikes: market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwner
    });

    let marketData = await this.marketsContract.methods.getMarketData(marketFactHash2).call();
    assert.notEqual(marketData.marketBaseData.expirationDatetime, 0); /* market exists if expirationDatetime != 0) */

    // should contain 3 markets
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});

    assert.equal(marketDataList.length, 3);
    assert.equal(marketDataList[0].marketFactHash, marketFactHash2);
    assert.equal(marketDataList[1].marketFactHash, marketFactHash0);
    assert.equal(marketDataList[2].marketFactHash, marketFactHash1);
  });

  it('should NOT add market #2 (again)', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign, marketFactHash2);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: market2.settlement,
        underlying: factsigner.stringToHex(market2.name),
        transactionFee: transactionFee.toString(),
        ndigit: market2.ndigit,
        baseUnitExp: market2.baseUnitExp, /* typically 18 */
        objectionPeriod: market2.objectionPeriod,
        strikes: market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwner
    }).then(
      () => Promise.reject(new Error('Expected method to reject.')),
      err => assert.equal(err instanceof Error, true)
    );
  });

  it('should NOT add market #3 (ndigit precision too low)', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign, marketFactHash3);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: market3.settlement,
        underlying: factsigner.stringToHex(market3.name),
        transactionFee: transactionFee.toString(),
        ndigit: market3.ndigit,
        baseUnitExp: market3.baseUnitExp, /* typically 18 */
        objectionPeriod: market3.objectionPeriod,
        strikes: market3.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwner
    }).then(
      () => Promise.reject(new Error('Expected method to reject.')),
      err => assert.equal(err instanceof Error, true)
    );
  });

  it('should still contain 3 markets', async function() {
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});
    assert.equal(marketDataList.length, 3);
    assert.equal(marketDataList[0].marketFactHash, marketFactHash2);
    assert.equal(marketDataList[1].marketFactHash, marketFactHash0);
    assert.equal(marketDataList[2].marketFactHash, marketFactHash1);
  });

  it('get markets with expiration (should return 2 markets)', async function() {
    let marketDataList = await this.marketsContract.methods.getMarketDataList(false, false, market0.settlement, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketFactHash, marketFactHash2);
    assert.equal(marketDataList[1].marketFactHash, marketFactHash0);
  });

  it('try to list markets from second market on (2 markets)', async function() {
    let marketDataList = await this.marketsContract.methods.getMarketDataList(false, false, 0, 20, [marketFactHash2]).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketFactHash, marketFactHash0);
    assert.equal(marketDataList[1].marketFactHash, marketFactHash1);
  });

  it('set testMarket', async function() {
    await this.marketsContract.methods.setTestMarket(
      marketFactHash0,
      true
    ).send({
      gas: 3000000,
      from: this.accountOwner
    });
  });

  it('should contain 2 markets', async function() {
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});
    assert.equal(marketDataList.length, 2);
  });

  it('check contract version', async function() {
    const version = await this.marketsContract.methods.version().call();
    assert.equal(
      (digioptionsContracts.version.major << 32) +
      (digioptionsContracts.version.minor << 16) +
      digioptionsContracts.version.bugfix
      ,
      version
    );
    assert.equal(
      process.env.npm_package_version,
      digioptionsContracts.version.major + '.' +
      digioptionsContracts.version.minor + '.' +
      digioptionsContracts.version.bugfix
    );
  });

  it('check payoutPerNanoOption', async function() {
    const payoutPerNanoOption = Web3.utils.toBN(await this.marketsContract.methods.PAYOUT_PER_NANOOPTION().call());
    assert.ok(payoutPerNanoOption.eq(digioptionsContracts.payoutPerNanoOption));

    // check that one whole option is worth 1 ether on win
    const one = Web3.utils.toBN('1');
    assert.ok(Web3.utils.toWei(one, 'ether').eq(digioptionsContracts.nanoOptionsPerOption.mul(digioptionsContracts.payoutPerNanoOption)));
  });
});
