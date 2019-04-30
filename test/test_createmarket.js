// vim: sts=2:ts=2:sw=2
/* eslint-env mocha, es6 */

const Web3 = require('web3');
const ganache = require('ganache-core');
const assert = require('assert');

const factsigner = require('factsigner');

const digioptionsContracts = require('../index.js');
const contractBytecode = require('../digioptions_markets_bin.js')();
const contractBytecode2 = require('../digioptions_market_lister_bin.js')(); // TODO name

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

    this.accountOwner = accounts[0];
    this.accountOther = accounts[1];
    this.accountSign = this.web3.eth.accounts.privateKeyToAccount('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');

    this.market0 = {
      baseUnitExp: 18,
      name: 'BTC',
      ndigit: 2,
      objectionPeriod: 3600,
      settlement: 1457676000, // settlement
      strikes: ['3000000000000000000', '4000000000000000000', '5000000000000000000', '6000000000000000000', '7000000000000000000'].map(function(x){return that.web3.utils.toBN(x);})
    };
    this.market1 = {
      baseUnitExp: 18,
      name: 'BTC',
      ndigit: 2,
      objectionPeriod: 3600,
      settlement: 1457674000, // settlement
      strikes: ['3000000000000000000', '4000000000000000000', '5000000000000000000', '6000000000000000000', '7000000000000000000'].map(function(x){return that.web3.utils.toBN(x);})
    };
    this.market2 = {
      baseUnitExp: 18,
      name: 'BTC',
      ndigit: 2,
      objectionPeriod: 3600,
      settlement: 1457677000, // settlement
      strikes: ['3000000000000000000', '3250000000000000000', '3500000000000000000', '3750000000000000000', '4000000000000000000'].map(function(x){return that.web3.utils.toBN(x);})
    };
    this.market3 = {
      baseUnitExp: 18,
      name: 'BTC-too-low',
      ndigit: 1, // TOO low !
      objectionPeriod: 3600,
      settlement: 1457677000, // settlement
      strikes: ['110000000000000000' /* 0.11 * 10**18 */].map(function(x){return that.web3.utils.toBN(x);})
    };

    this.marketFactHash0 = factsigner.factHash(this.market0);
    this.marketFactHash1 = factsigner.factHash(this.market1);
    this.marketFactHash2 = factsigner.factHash(this.market2);
    this.marketFactHash3 = factsigner.factHash(this.market3);

    this.transactionFee = this.web3.utils.toBN(0);
  });

  it('create contract', async function() {
    const contract = new this.web3.eth.Contract(digioptionsContracts.digioptionsMarketsAbi());
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
    assert.notEqual(this.marketsContract.options.address, undefined);

    // now deploy our market lister contract
    const contractMarketLister = new this.web3.eth.Contract(digioptionsContracts.digioptionsMarketListerAbi());
    this.contractInstanceMarketLister = await contractMarketLister.deploy(
      {
        data: contractBytecode2,
        arguments: [
          this.marketsContract.options.address
        ]
      }
    )
      .send(
        {
          gas: 4000000,
          //gasPrice: '30000000000000',
          from: this.accountOwner
        }
      );
    assert.notEqual(this.contractInstanceMarketLister.options.address, undefined);

    // should contain 0 markets
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});
    assert.equal(marketDataList.length, 0);
  });

  it('add market #0', async function() {
    let signature = factsigner.sign(this.web3, this.accountSign.privateKey, this.marketFactHash0);

    let marketDataBefore = await this.marketsContract.methods.getMarketData(this.marketFactHash0).call();
    assert.equal(parseInt(marketDataBefore.marketBaseData.expirationDatetime), 0); /* market exists if expirationDatetime != 0) */

    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: this.market0.settlement,
        underlying: factsigner.stringToHex(this.market0.name),
        transactionFee: this.transactionFee.toString(),
        ndigit: this.market0.ndigit,
        baseUnitExp: this.market0.baseUnitExp, /* typically 18 */
        objectionPeriod: this.market0.objectionPeriod,
        strikes: this.market0.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwner
    });

    let marketData = await this.marketsContract.methods.getMarketData(this.marketFactHash0).call();
    assert.equal(parseInt(marketData.marketBaseData.expirationDatetime), this.market0.settlement); /* market exists if expirationDatetime != 0) */

    // should contain 1 market
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});

    assert.equal(marketDataList.length, 1);
    assert.equal(marketDataList[0].marketFactHash, this.marketFactHash0);
  });

  it('add market #1', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.marketFactHash1);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: this.market1.settlement,
        underlying: factsigner.stringToHex(this.market1.name),
        transactionFee: this.transactionFee.toString(),
        ndigit: this.market1.ndigit,
        baseUnitExp: this.market1.baseUnitExp, /* typically 18 */
        objectionPeriod: this.market1.objectionPeriod,
        strikes: this.market1.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
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
    assert.equal(marketDataList[0].marketFactHash, this.marketFactHash0);
    assert.equal(marketDataList[1].marketFactHash, this.marketFactHash1);
  });

  it('should NOT add market #2 (by somone not owning of the contract)', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.marketFactHash2);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: this.market2.settlement,
        underlying: factsigner.stringToHex(this.market2.name),
        transactionFee: this.transactionFee.toString(),
        ndigit: this.market2.ndigit,
        baseUnitExp: this.market2.baseUnitExp, /* typically 18 */
        objectionPeriod: this.market2.objectionPeriod,
        strikes: this.market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
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
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.marketFactHash2);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: this.market2.settlement,
        underlying: factsigner.stringToHex(this.market2.name),
        transactionFee: this.transactionFee.toString(),
        ndigit: this.market2.ndigit,
        baseUnitExp: this.market2.baseUnitExp, /* typically 18 */
        objectionPeriod: this.market2.objectionPeriod,
        strikes: this.market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
      },
      false, // testMarket
      signature
    ).send({
      gas: 3000000,
      from: this.accountOwner
    });

    let marketData = await this.marketsContract.methods.getMarketData(this.marketFactHash2).call();
    assert.notEqual(marketData.marketBaseData.expirationDatetime, 0); /* market exists if expirationDatetime != 0) */

    // should contain 3 markets
    let marketDataList = await this.marketsContract.methods.getMarketDataList(true, false, 0, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});

    assert.equal(marketDataList.length, 3);
    assert.equal(marketDataList[0].marketFactHash, this.marketFactHash2);
    assert.equal(marketDataList[1].marketFactHash, this.marketFactHash0);
    assert.equal(marketDataList[2].marketFactHash, this.marketFactHash1);
  });

  it('should NOT add market #2 (again)', async function() {
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.marketFactHash2);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: this.market2.settlement,
        underlying: factsigner.stringToHex(this.market2.name),
        transactionFee: this.transactionFee.toString(),
        ndigit: this.market2.ndigit,
        baseUnitExp: this.market2.baseUnitExp, /* typically 18 */
        objectionPeriod: this.market2.objectionPeriod,
        strikes: this.market2.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
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
    let signature = await factsigner.sign(this.web3, this.accountSign.privateKey, this.marketFactHash3);
    await this.marketsContract.methods.createMarket(
      {
        expirationDatetime: this.market3.settlement,
        underlying: factsigner.stringToHex(this.market3.name),
        transactionFee: this.transactionFee.toString(),
        ndigit: this.market3.ndigit,
        baseUnitExp: this.market3.baseUnitExp, /* typically 18 */
        objectionPeriod: this.market3.objectionPeriod,
        strikes: this.market3.strikes.map(function(strikeBn){return strikeBn.toString();}),
        signerAddr: this.accountSign.address,
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
    assert.equal(marketDataList[0].marketFactHash, this.marketFactHash2);
    assert.equal(marketDataList[1].marketFactHash, this.marketFactHash0);
    assert.equal(marketDataList[2].marketFactHash, this.marketFactHash1);
  });

  it('get markets with expiration (should return 2 markets)', async function() {
    let marketDataList = await this.marketsContract.methods.getMarketDataList(false, false, this.market0.settlement, 20, []).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketFactHash, this.marketFactHash2);
    assert.equal(marketDataList[1].marketFactHash, this.marketFactHash0);
  });

  it('try to list markets from second market on (2 markets)', async function() {
    let marketDataList = await this.marketsContract.methods.getMarketDataList(false, false, 0, 20, [this.marketFactHash2]).call();
    marketDataList = marketDataList.filter(function(marketData){return marketData.marketBaseData.expirationDatetime > 0;});
    assert.equal(marketDataList.length, 2);
    assert.equal(marketDataList[0].marketFactHash, this.marketFactHash0);
    assert.equal(marketDataList[1].marketFactHash, this.marketFactHash1);
  });

  it('set testMarket', async function() {
    await this.marketsContract.methods.setTestMarket(
      this.marketFactHash0,
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
    const contractVersion = await this.marketsContract.methods.CONTRACT_VERSION().call();
    assert.equal(
      (digioptionsContracts.contractVersion.major << 32) +
      (digioptionsContracts.contractVersion.minor << 16) +
      digioptionsContracts.contractVersion.bugfix
      ,
      contractVersion
    );
    assert.equal(
      process.env.npm_package_version,
      digioptionsContracts.contractVersion.major + '.' +
      digioptionsContracts.contractVersion.minor + '.' +
      digioptionsContracts.contractVersion.bugfix
    );
  });

  it('check payoutPerNanoOption', async function() {
    const payoutPerNanoOption = this.web3.utils.toBN(await this.marketsContract.methods.PAYOUT_PER_NANOOPTION().call());
    assert.ok(payoutPerNanoOption.eq(digioptionsContracts.payoutPerNanoOption));

    // check that one whole option is worth 1 ether on win
    const one = this.web3.utils.toBN('1');
    assert.ok(this.web3.utils.toWei(one, 'ether').eq(digioptionsContracts.nanoOptionsPerOption.mul(digioptionsContracts.payoutPerNanoOption)));
  });
});
