// vim: sts=2:ts=2:sw=2
/* eslint-env mocha, es6 */

const Web3 = require('web3');
const web3Utils = require('web3-utils');
const assert = require('assert');

const factsigner = require('factsigner');

const digioptionsContracts = require('../dist/cjs/index.js');
const TestBase = require('./tools.js').TestBase;

const contractMarketsBytecode = require('../dist/cjs/digioptions_markets_bin.js').default();
const getActiveUsers = require('../dist/cjs/getActiveUsers.js').getActiveUsers;

//before('initialize variables', function(done) {
//  done();
//});

const epochSecondsStart = 946684800; // Fri, 01 Jan 2000 00:00:00 GMT

const accountSignPrivateKey = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';
const accountSign = (new Web3()).eth.accounts.privateKeyToAccount(accountSignPrivateKey);

const contractOwnerPrivateKey = '0xd71d7ec04c0ad2d6e706fc592a05c901f9161c8cc7c7879a29a76dd48ef795ae';
//const contractOwner = (new Web3()).eth.accounts.privateKeyToAccount(contractOwnerPrivateKey);

const feeTaker0PrivateKey = '0x6a4d8def2eb3de6ba9fde673cb1eaeab5eb788824ef1e4ecd7e0fafeab7dec4a';
const feeTaker0 = (new Web3()).eth.accounts.privateKeyToAccount(feeTaker0PrivateKey);

const feeTaker1PrivateKey = '0x79eb82a0932372387e56be2aa20a23ba4b34ac31cb2f5abbf4f6fd1c443fa57a';
const feeTaker1 = (new Web3()).eth.accounts.privateKeyToAccount(feeTaker1PrivateKey);

const zeroBN = web3Utils.toBN('0');
const addrZero = '0x0000000000000000000000000000000000000000';

const marketBaseData = {
  underlyingString: 'BTC\0USD',
  expirationDatetime: 978307200, // Mon, 01 Jan 2001 00:00:00 GMT -2000 seconds
  objectionPeriod: 3600,
  config: (
    factsigner.constants.configMarketType.STRIKED + /* this a striked market */
    factsigner.constants.configIntervalType.USED
  ),
  marketCategory: factsigner.constants.marketCategory.CRYPTO,

  baseUnitExp: factsigner.constants.BASE_UNIT_EXP_DEFAULT,
  ndigit: 2,

  marketInterval: factsigner.constants.marketInterval.YEARLY,

  strikes: [
    factsigner.parseFloatToBn('110.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(),
    factsigner.parseFloatToBn('120.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT).toString(),
  ],
  feeTaker0: feeTaker0.address,
  feeTaker1: feeTaker1.address,
  transactionFee0: 10, // 0.1 percent of the traded value
  transactionFee1: 20, // 0.2 percent of the traded value
  transactionFeeSigner: 5, // 0.05 percent of the traded value
  signerAddr: accountSign.address,
};
const factHash = factsigner.factHash(marketBaseData);
const marketHash = digioptionsContracts.marketHash(marketBaseData);
const trader0BalanceStart = '0x3635c9adc5dea00000'; //web3Utils.toWei(web3Utils.toBN(1000), 'ether');
const trader1BalanceStart = '0x3635c9adc5dea00000'; //web3Utils.toWei(web3Utils.toBN(1000), 'ether');
const contractOwnerBalanceStart = '0x3635c9adc5dea00000'; //web3Utils.toWei(web3Utils.toBN(1000), 'ether');
const marketCreatorBalanceStart = '0x3635c9adc5dea00000'; //web3Utils.toWei(web3Utils.toBN(1000), 'ether');
const marketFeeTaker0BalanceStart = '0x0'; //web3Utils.toWei(web3Utils.toBN(0), 'ether');
const marketFeeTaker1BalanceStart = '0x0'; //web3Utils.toWei(web3Utils.toBN(0), 'ether');

const trader0LiquidityStart = web3Utils.toWei(web3Utils.toBN(100), 'ether');
const trader1LiquidityStart = web3Utils.toWei(web3Utils.toBN(100), 'ether');

const trader0SecretKey = '0x4b29923935272588a5c0446cd4a7e4aff1b76cbc9320aada2a14133ff2c52691';
const trader1SecretKey = '0xcb611c298719a2aba3af0574c3d5e752bf3206463be2b25c72f15ac1fa13f4e9';

function loadBeforeAndAfter(self) {
  before('setup', async function() {

    var dateStart = new Date(0); // The 0 is the key, which sets the date to the epoch
    dateStart.setUTCSeconds(epochSecondsStart);

    const options = {
      accounts: [
        {
          index: 0,
          secretKey: contractOwnerPrivateKey,
          balance: contractOwnerBalanceStart
        },
        {
          index: 1,
          balance: marketCreatorBalanceStart
        },
        {
          index: 2,
          balance: marketFeeTaker0BalanceStart
        },
        {
          index: 3,
          balance: marketFeeTaker1BalanceStart
        },
        {
          index: 4,
          secretKey: trader0SecretKey,
          balance: trader0BalanceStart
        },
        {
          index: 5,
          secretKey: trader1SecretKey,
          balance: trader1BalanceStart
        }
      ],
      time: dateStart, // set time of first block
    };

    this.testBase = new TestBase();
    await this.testBase.start(options);
    this.web3 = this.testBase.web3;

    assert.equal(this.testBase.accounts.length, 6);

    this.accountOwnerAddress = this.testBase.accounts[0];
    this.marketCreator = this.testBase.accounts[1]; // TODO use
    this.marketFeeTaker0 = this.testBase.accounts[2]; // TODO use
    this.marketFeeTaker1 = this.testBase.accounts[3]; // TODO use
    this.accountTrader0 = this.testBase.accounts[4];
    this.accountTrader1 = this.testBase.accounts[5];

    // create contract
    const contract = new this.web3.eth.Contract(digioptionsContracts.digioptionsMarketsAbi());

    let txHash;
    this.marketsContract = await contract.deploy(
      {
        data: contractMarketsBytecode
      }
    )
      .send(
        {
          gas: 8800000, // TODO
          from: this.accountOwnerAddress
        }
      )
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'contract create marketsContract');

    // create market
    const signature = factsigner.signFactsignerMessage(factHash, accountSign.privateKey);
    // create
    await this.marketsContract.methods.createMarket(
      marketBaseData,
      false, // testMarket
      signature
    )
      .send({
        gas: 3000000,
        from: this.accountOwnerAddress
      })
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'market create');

    await this.marketsContract.methods.liquidityAdd()
      .send({
        value: trader0LiquidityStart,
        gas: 300000,
        from: this.accountTrader0
      })
      .on('transactionHash', function(hash){txHash = hash;});
    await this.testBase.gasStatistics.add(txHash, 'liquidity add (user)');

    const liquidityTrader0 = web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountTrader0})).liquidity);
    assert.ok(liquidityTrader0.eq(trader0LiquidityStart));

    await this.marketsContract.methods.liquidityAdd().send({
      value: trader1LiquidityStart,
      gas: 300000,
      from: this.accountTrader1
    });
    const liquidityTrader1 = web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountTrader1})).liquidity);
    assert.ok(liquidityTrader1.eq(trader1LiquidityStart));

    // TODO use this
    this.checkBalancesAndLiquidity = async function(){
      // TODO support check after each trade (access fee)
      // check all balances and liquidity (if all markets are settles / there are no active market positions)
      const liquidityAll = zeroBN
        .add(web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: feeTaker0.address})).liquidity))
        .add(web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: feeTaker1.address})).liquidity))
        .add(web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountTrader0})).liquidity))
        .add(web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountTrader1})).liquidity));

      const liquidityAllStart = zeroBN
        .add(trader0LiquidityStart)
        .add(trader1LiquidityStart);

      /*
      console.log('accountOwner', web3Utils.fromWei(web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountOwnerAddress})).liquidity), 'ether'));
      console.log('accountTrader0', web3Utils.fromWei(web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountTrader0})).liquidity), 'ether'));
      console.log('accountTrader1', web3Utils.fromWei(web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountTrader1})).liquidity), 'ether'));
      console.log('liquidityAll', web3Utils.fromWei(liquidityAll, 'ether'));
      console.log('liquidityAllStart', web3Utils.fromWei(liquidityAllStart, 'ether'));
      */


      //console.log(liquidityAllStart.toString());
      //console.log(liquidityAll.toString());
      assert.ok(liquidityAllStart.eq(liquidityAll)); // TODO re-enable
    };

    var cnt = 0;
    this.trade = async function(trade){
      const orderOffer = Object.assign(
        {
          // defaults if not set explicitly
          marketsAddr: this.marketsContract.options.address,
          marketHash: marketHash
        },
        trade.orderOffer
      );

      const offerAccount = trade.orderOffer.offerOwner;
      const offerTaker = trade.offerTaker;

      // remember positions before trade
      const marketInitial = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: offerAccount});
      const positionsInitial = marketInitial.positions.map(function(x){return web3Utils.toBN(x.value);});

      // check if number of positions = strikes.length + 1
      assert.equal(positionsInitial.length, marketBaseData.strikes.length + 1);

      // TODO use this.web3.eth.sign?
      let secretKey;
      if (offerAccount === this.accountTrader0)
        secretKey = trader0SecretKey;
      else if (offerAccount === this.accountTrader1)
        secretKey = trader1SecretKey;
      else
        throw new Error('unknown account');

      // TODO rename secretKey to privateKey
      const signature = digioptionsContracts.signOrderOffer(orderOffer, secretKey);

      orderOffer.pricePerOption = orderOffer.price.toString(); // TODO
      orderOffer.size = orderOffer.size.toString(); //TODO

      const orderExecuteTestResult = await this.marketsContract.methods.orderExecuteTest(
        {
          orderOffer: orderOffer,
          signature: signature
        },
        trade.sizeAcceptMax.toString()
      ).call({from: offerTaker});

      const sizeAcceptPossible = web3Utils.toBN(orderExecuteTestResult.sizeAcceptPossible);

      if (cnt++ == 0)
        this.testBase.profilerSubprovider.start();
      await this.marketsContract.methods.orderExecute(
        [
          {
            orderOffer: orderOffer,
            signature: signature
          }
        ],
        sizeAcceptPossible.toString()
      )
        .send({
          gas: 3000000, // TODO
          from: offerTaker
        })
        .on('transactionHash', function(hash){txHash = hash;});
      this.testBase.profilerSubprovider.stop();

      await this.testBase.gasStatistics.add(txHash, 'order execute');


      if (trade.checkPositions){
        const marketFinal = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: offerAccount});
        const positionsFinal = marketFinal.positions.map(function(x){return web3Utils.toBN(x.value);});
        assert.equal(positionsFinal.length, marketBaseData.strikes.length + 1);
        if (trade.orderOffer.buy){
          assert.ok(positionsFinal[trade.orderOffer.optionID].sub(positionsInitial[trade.orderOffer.optionID]).eq(sizeAcceptPossible));
        }else{
          assert.ok(positionsFinal[trade.orderOffer.optionID].sub(positionsInitial[trade.orderOffer.optionID]).eq(sizeAcceptPossible.neg()));
        }
      }

      return sizeAcceptPossible;
    };

    this.settlement = async function (marketHash, factHash, valueBn){
      const hash = factsigner.settlementHash(
        factHash,
        valueBn,
        factsigner.constants.settlementType.FINAL
      );
      const signature_market_expire = factsigner.signFactsignerMessage(hash, accountSign.privateKey);
      await this.marketsContract.methods.settlement(
        marketHash,
        signature_market_expire,
        valueBn.toString(),
        [], // liquidityFree for 0 users
        [] // TODO offerHash
      )
        .send({
          gas: 300000,
          from: this.accountTrader1
        })
        .on('transactionHash', function(hash){txHash = hash;});

      await this.testBase.gasStatistics.add(txHash, 'settlement (0 user)');
    };
  });

  after('after', async function() {
    //this.checkBalancesAndLiquidity();
    this.testBase.stop();

    this.testBase.writeCoverage(self.title);
    this.testBase.writeProfiler(self.title);
    this.testBase.writeGasStatistics(self.title);
  });
}

describe('simple trading', function() {
  this.timeout(120*1000);

  loadBeforeAndAfter(this);

  it('add/withdraw liquidity for trader1 (liquidity is needed for trading tests)', async function() {
    const withdraw = web3Utils.toWei(web3Utils.toBN(5), 'ether');

    let txHash;
    await this.marketsContract.methods.liquidityWithdraw(
      withdraw.toString()
    )
      .send({
        gas: 3000000,
        from: this.accountTrader1
      })
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'liquidity withdraw (user)');

    const liquidityAfterWithdraw = web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountTrader1})).liquidity);
    assert.ok(liquidityAfterWithdraw.eq(trader1LiquidityStart.sub(withdraw)));

    // TODO re-insert test for default payable after 0x-support for solc>=0.6.0
    // here test the default payable function (and not liquidityAdd())
    /*
    await this.web3.eth.sendTransaction({
      value: withdraw,
      //gas: 300000,
      from: this.accountTrader1,
      to: this.marketsContract.options.address
    });
    */
    await this.marketsContract.methods.liquidityAdd()
      .send({
        value: withdraw,
        //gas: 300000,
        from: this.accountTrader1
      })
      .on('transactionHash', function(hash){txHash = hash;});

    const liquidityFinal = web3Utils.toBN((await this.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: this.accountTrader1})).liquidity);
    assert.ok(liquidityFinal.eq(trader1LiquidityStart));
  });

  it('check option positions (are empty)', async function() {
    const liquidityAndPositions = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: this.accountTrader0});
    const positions = liquidityAndPositions.positions.map(function(x){return web3Utils.toBN(x.value);});

    assert.equal(positions.length, marketBaseData.strikes.length + 1);
    assert.equal(positions.filter(function(x){return ! x.isZero();}).length, 0);
  });

  it('execute some trades', async function() {
    // these accounts need liquidity
    const offerOwner = this.accountTrader1;
    const offerTaker = this.accountTrader0;

    let sizeAccepted;
    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 0,
        buy: true,
        price: web3Utils.toBN('500000000'),
        size: web3Utils.toBN('2000000000'),
        blockExpires: await this.web3.eth.getBlockNumber() + 5,
        offerID: 60001,
        offerOwner: offerOwner
      },
      sizeAcceptMax: web3Utils.toBN('2000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('2000000000')));

    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 0,
        buy: false,
        price: web3Utils.toBN('500000000'),
        size: web3Utils.toBN('2000000000'),
        blockExpires: await this.web3.eth.getBlockNumber() + 5,
        offerID: 30001,
        offerOwner: offerOwner,
      },
      sizeAcceptMax: web3Utils.toBN('2000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('2000000000')));

    const blockExpires = await this.web3.eth.getBlockNumber() + 5;
    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 0,
        buy: true,
        price: web3Utils.toBN('500000000'),
        size: web3Utils.toBN('2000000000'),
        blockExpires: blockExpires,
        offerID: 20001,
        offerOwner: offerOwner,
      },
      sizeAcceptMax: web3Utils.toBN('2000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('2000000000')));

    // exactly the same offer as before which is already taken
    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 0,
        buy: true,
        price: web3Utils.toBN('500000000'),
        size: web3Utils.toBN('2000000000'),
        blockExpires: blockExpires,
        offerID: 20001,
        offerOwner: offerOwner,
      },
      sizeAcceptMax: web3Utils.toBN('2000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('0'))); // fail

    // blockExpires == 0 so it should fail
    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 1,
        buy: true,
        price: web3Utils.toBN('1000000000'),
        size: web3Utils.toBN('2000000000'),
        blockExpires: 0,
        offerID: 20002,
        offerOwner: offerOwner,
      },
      sizeAcceptMax: web3Utils.toBN('1000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('0'))); // fail

    // sizeAcceptMax > size -> only half amount is accepted
    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 2,
        buy: true,
        price: web3Utils.toBN('1000000000'),
        size: web3Utils.toBN('1000000000'),
        blockExpires: await this.web3.eth.getBlockNumber() + 5,
        offerID: 20003,
        offerOwner: offerOwner,
        offerTaker: offerTaker,
      },
      sizeAcceptMax: web3Utils.toBN('2000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('1000000000')));

    // liquidity is too small
    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 2,
        buy: true,
        price: web3Utils.toBN('1000000000000000000'),
        size: web3Utils.toBN('1000000000'),
        blockExpires: await this.web3.eth.getBlockNumber() + 5,
        offerID: 20004,
        offerOwner: offerOwner,
      },
      sizeAcceptMax: web3Utils.toBN('1000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('0'))); // fail

    // optionID 3 does not exist with 2 strikes
    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 3,
        buy: true,
        price: web3Utils.toBN('1000000000'),
        size: web3Utils.toBN('1000000000'),
        blockExpires: await this.web3.eth.getBlockNumber() + 5,
        offerID: 20005,
        offerOwner: offerOwner,
      },
      sizeAcceptMax: web3Utils.toBN('1000000000'),
      offerTaker: offerTaker,
      checkPositions: false, // skip check here because of invalid optionID
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('0'))); // fail

  });

  it('check position sums', async function() {
    const marketAccount0 = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: this.accountTrader0});
    const positions1 = marketAccount0.positions.map(function(x){return web3Utils.toBN(x.value);});
    //const cash1 = web3Utils.toBN(marketAccount0.liquidity);

    assert.equal(positions1.length, marketBaseData.strikes.length + 1);
    const marketAccount1 = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: this.accountTrader1});
    const positions2 = marketAccount1.positions.map(function(x){return web3Utils.toBN(x.value);});
    //const cash2 = web3Utils.toBN(marketAccount1.liquidity);

    assert.equal(positions2.length, marketBaseData.strikes.length + 1);
    for (let i=0; i<positions1.length; i++) {
      assert.ok(positions1[i].add(positions2[i]).isZero());
    }
  });

  it('check available liquidity for trader0', async function() {
    const account = this.accountTrader0;
    const liquidityAndPositions = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: account});
    const positions = liquidityAndPositions.positions.map(function(x){return web3Utils.toBN(x.value);});
    //const liquidity = web3Utils.toBN(liquidityAndPositions.liquidity);

    assert.equal(positions.length, marketBaseData.strikes.length + 1);
    const marketData = await this.marketsContract.methods.getMarketDataByMarketHash(addrZero, marketHash).call();
    const strikes = marketData.marketBaseData.strikes.map(function(x){return web3Utils.toBN(x);});
    for (let i=0; i<=strikes.length; i++) {
      //on the strike
    }
  });

  it('check available liquidity for trader1', async function() {
    const account = this.accountTrader1;
    //const maxLossOrMinWin;

    const liquidityAndPositions = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: account});
    const positions = liquidityAndPositions.positions.map(function(x){return web3Utils.toBN(x.value);});
    //const liquidity = web3Utils.toBN(liquidityAndPositions.liquidity);
    //maxLossOrMinWin = web3Utils.toBN(marketBaseData.maxLossOrMinWin);

    assert.equal(positions.length, marketBaseData.strikes.length + 1);
    const marketData = await this.marketsContract.methods.getMarketDataByMarketHash(addrZero, marketHash).call();
    const strikes = marketData.marketBaseData.strikes.map(function(x){return web3Utils.toBN(x);});
    for (let i=0; i<=strikes.length; i++) {
      //on the strike
    }
    //console.log('liquidity', liquidity.div(web3Utils.toBN('1000000000000000000')).toString());
    //console.log('liquidity', liquidity.toString());
    //console.log('maxLossOrMinWin', maxLossOrMinWin.toString());
    //console.log('available', available.toNumber()/1000000000000000000);
  });

  it('calculate settlement signature and settle', async function() {
    //assert.equal(await this.marketsContract.methods.getNumUsersToPayout(marketHash).call(), 2);

    //const marketData = await this.marketsContract.methods.getMarketDataByMarketHash(addrZero, marketHash).call();
    //const marketBaseData = marketData.marketBaseData;
    const liquidityAndPositions = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: this.accountTrader0});
    //const liquidity = web3Utils.toBN(liquidityAndPositions.liquidity);
    const positions = liquidityAndPositions.positions.map(function(x){return web3Utils.toBN(x.value);});
    assert.equal(positions.length, marketBaseData.strikes.length + 1);


    const valueBn = factsigner.parseFloatToBn('115.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT);
    const hash = factsigner.settlementHash(
      factHash,
      valueBn,
      factsigner.constants.settlementType.FINAL
    );
    const signature_market_expire = factsigner.signFactsignerMessage(hash, accountSign.privateKey);

    const activeUsers = await getActiveUsers(this.marketsContract, [marketHash]);
    assert.equal(activeUsers.length, 2);

    let txHash;
    await this.marketsContract.methods.settlement(
      marketHash,
      signature_market_expire,
      valueBn.toString(),
      [activeUsers[0]], // just do payout for 1 user only // TODO
      [] // TODO offerHash
    )
      .send({
        gas: 300000,
        value: 0,
        from: this.accountTrader1
      })
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'settlement (1 user)');

    //assert.equal(await this.marketsContract.methods.getNumUsersToPayout(marketHash).call(), 1);

    await this.marketsContract.methods.freeLiquidity(
      marketHash,
      [activeUsers[1]], // just do payout for 1 user only //TODO
      [] // TODO offerHash
    )
      .send({
        gas: 300000,
        value: 0,
        from: this.accountTrader1
      })
      .on('transactionHash', function(hash){txHash = hash;});

    await this.testBase.gasStatistics.add(txHash, 'freeLiquidity (1 user)');

    //assert.equal(await this.marketsContract.methods.getNumUsersToPayout(marketHash).call(), 0);

    const marketDataAfterSettlement = await this.marketsContract.methods.getMarketDataByMarketHash(addrZero, marketHash).call();

    /* check if really expired */
    //const marketBaseData = result.marketBaseData;
    const winningOptionID = marketDataAfterSettlement.marketState.winningOptionID;
    assert.equal(winningOptionID, 1); // we settled with 115

    const settled = marketDataAfterSettlement.marketState.settled;
    assert.equal(settled, true);

    var self = this;

    const getLiquidity = async function(account){
      const marketDummy = await self.marketsContract.methods.getLiquidityAndPositions('0x0000000000000000000000000000000000000000000000000000000000000000').call({from: account});
      return web3Utils.toBN(marketDummy.liquidity);
    };

    // TODO implement getLiquidity
    const liquidityTrader0 = await getLiquidity(this.accountTrader0);
    const liquidityTrader1 = await getLiquidity(this.accountTrader1);
    const liquidity8 = await getLiquidity(feeTaker0.address); // TODO rename
    const liquidity9 = await getLiquidity(feeTaker1.address);
    const liquiditySigner = await getLiquidity(accountSign.address);

    const liquidityTotal = liquidityTrader0.add(liquidityTrader1).add(liquidity8).add(liquidity9).add(liquiditySigner);

    console.log('liquidityTrader0', web3Utils.fromWei(liquidityTrader0, 'ether'));
    console.log('liquidityTrader1', web3Utils.fromWei(liquidityTrader1, 'ether'));
    console.log('liquidityFeeTaker0', web3Utils.fromWei(liquidity8, 'ether'));
    console.log('liquidityFeeTaker1', web3Utils.fromWei(liquidity9, 'ether'));
    console.log('liquiditySigner', web3Utils.fromWei(liquiditySigner, 'ether'));
    console.log('liquidity total', web3Utils.fromWei(liquidityTotal, 'ether'));

    assert.ok(liquidityTotal.eq(trader0LiquidityStart.add(trader1LiquidityStart)));

    //const liquidity0 = web3Utils.toBN(result[0]);
    //const available = web3Utils.toBN(result[1]);
    //assert.equal((liquidity0 !== 0) || (available !== 0), false);

    //this.web3.eth.getBalance(this.accountTrader0, function(err, result) {
    //  assert.equal(err, null);
    //  const balanceAfter = result;
    //  assert.equal(balanceAfter.sub(balanceBefore).equals(expectedFundChange),true);
    //  console.log('balanceBefore', balanceBefore.toNumber()/1000000000000000000);
    //  console.log('balanceAfter', balanceAfter.toNumber()/1000000000000000000);
    //  console.log('expectedFundChange', expectedFundChange.toNumber()/1000000000000000000);
    //});
  });

  it('check liquidity', async function() {
    const result = await this.marketsContract.methods.getLiquidityAndPositions(marketHash).call({from: this.accountTrader0});
    const positions = result.positions.map(function(x){return web3Utils.toBN(x.value);});
    const liquidity = web3Utils.toBN(result.liquidity);

    assert.equal(positions.length, marketBaseData.strikes.length + 1);
    //assert.equal(positions.filter(function(x){return x.isZero();}).length, 0);
    assert.ok(! liquidity.isZero());
  });

  //it('check that contract balance is now zero', function(done){
  //  this.web3.eth.getBalance(this.marketsContract.options.address, function(err, result) {
  //    assert.ok(web3Utils.toBN(result).eq(0));
  //    done();
  //  });
  //});

});

describe('complex trading', function() {
  this.timeout(120*1000);

  loadBeforeAndAfter(this);

  it('trade', async function() {
    // these accounts need liquidity
    const offerAccount = this.accountTrader1;
    const offerTaker = this.accountTrader0;

    //this.checkBalancesAndLiquidity(); // TODO
    let sizeAccepted;
    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 0,
        buy: true,
        price: web3Utils.toBN('300000000'),
        size: web3Utils.toBN('1000000000'),
        blockExpires: await this.web3.eth.getBlockNumber() + 5,
        offerID: 60001,
        offerOwner: offerAccount
      },
      sizeAcceptMax: web3Utils.toBN('1000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('1000000000')));
    //this.checkBalancesAndLiquidity(); // TODO


    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 1,
        buy: true,
        price: web3Utils.toBN('300000000'),
        size: web3Utils.toBN('1000000000'), //TODO ...microOptionPer...
        blockExpires: await this.web3.eth.getBlockNumber() + 5,
        offerID: 60001,
        offerOwner: offerAccount
      },
      sizeAcceptMax: web3Utils.toBN('1000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('1000000000')));

    /*
    console.log('accountOwner', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountOwnerAddress})).liquidity, 'ether'));
    console.log('liquidityTrader0', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountTrader0})).liquidity, 'ether'));
    console.log('liquidityTrader1', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountTrader1})).liquidity, 'ether'));
    */

    sizeAccepted = await this.trade({
      // orderOffer offer without marketsAddr, marketHash
      orderOffer: {
        optionID: 2,
        buy: true,
        price: web3Utils.toBN('300000000'),
        size: web3Utils.toBN('1000000000'),
        blockExpires: await this.web3.eth.getBlockNumber() + 5,
        offerID: 60001,
        offerOwner: offerAccount
      },
      sizeAcceptMax: web3Utils.toBN('1000000000'),
      offerTaker: offerTaker,
      checkPositions: true,
    });
    assert.ok(sizeAccepted.eq(web3Utils.toBN('1000000000')));

    /*
    console.log('accountOwner', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountOwnerAddress})).liquidity, 'ether'));
    console.log('liquidityTrader0', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountTrader0})).liquidity, 'ether'));
    console.log('liquidityTrader1', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountTrader1})).liquidity, 'ether'));
    */

    // Attention: we can now call checkBalancesAndLiquidity() because the liquidity of both parties
    // is already increased (and settlement will not change the liquidity anymore!)
    //this.checkBalancesAndLiquidity(); // TODO

    await this.settlement(
      marketHash,
      factHash,
      factsigner.parseFloatToBn('215.0', factsigner.constants.BASE_UNIT_EXP_DEFAULT),
      [] // TODO offerHash
    );

    const activeUsers = await getActiveUsers(this.marketsContract, [marketHash]);
    assert.equal(activeUsers.length, 2);

    const winningOptionID = (await this.marketsContract.methods.getMarketDataByMarketHash(addrZero, marketHash).call()).marketState.winningOptionID;
    //console.log('winningOptionID', winningOptionID);
    assert.equal(winningOptionID, 2); // we settled with 215

    /*
    console.log('final');
    console.log('accountOwner', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountOwnerAddress})).liquidity, 'ether'));
    console.log('liquidityTrader0', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountTrader0})).liquidity, 'ether'));
    console.log('liquidityTrader1', web3Utils.fromWei((await this.marketsContract.methods.getLiquidityAndPositions('0x0').call({from: this.accountTrader1})).liquidity, 'ether'));
    */

    //this.checkBalancesAndLiquidity(); // TODO re-enable
  });

});
