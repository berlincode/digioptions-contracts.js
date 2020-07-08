// vim: sts=2:ts=2:sw=2

// this modules is just a helper intended for test cases

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([
      'web3-utils',
      'factsigner',
      './index'
    ], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (node and other environments that support module.exports)
    module.exports = factory(
      require('web3-utils'),
      require('factsigner'),
      require('./index.js')
    );
  }else {
    // Global (browser)
    root.digioptionsHelpers = factory(
      (new root.Web3()).utils, // we expect that the whole Web3 was loaded an use only the utils from it
      root.factsigner,
      root.digioptionsContracts
    );
  }
}(this, function (web3Utils, factsigner, digioptionsContracts) {

  function roundUpHour(epochSeconds){
    return Math.floor((epochSeconds + 3600-1) / 3600)* 3600;
  }

  function roundUpDay(epochSeconds){
    // TODO
    return Math.floor(epochSeconds + 35*3600);
    // return Math.floor((epochSeconds + 24*3600 - 1) / (24*3600))* 24*3600;
  }

  function roundUpWeek(epochSeconds){
    return Math.floor((epochSeconds + 7*24*3600 - 1) / (7*24*3600))* 7*24*3600;
  }

  function roundUpMonth(epochSeconds){
    var date = new Date(0); // The 0 is the key, which sets the date to the epoch
    date.setUTCSeconds(epochSeconds);

    var current;
    if (date.getMonth() == 11) {
      current = new Date(Date.UTC(date.getFullYear() + 1, 0, 1,0 ,0, 0));
    } else {
      current = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0));
    }
    return +current/1000;
  }

  function MarketsPossibleToCreate() {
    this.existingMarkets = {}; // remember markets that we have already returned
  }

  MarketsPossibleToCreate.prototype.get = function(dateNow, markets) {
    //var self = this;

    var validMarkets = [];
    for (var idx=0 ; idx < markets.length ; idx++){
      var marketBaseData = markets[idx];
      var marketHash = digioptionsContracts.marketHash(marketBaseData);
      if (this.existingMarkets[marketHash]){
        continue;
      }
      this.existingMarkets[marketHash] = true;

      if (marketBaseData.config & factsigner.constants.configIntervalTypeIsUsedMask) {
        var marketInterval = marketBaseData.marketInterval;
        var expirationDatetime = marketBaseData.expirationDatetime;

        // TODO duplicate
        var maxFuture = [ // TODO rename into step... or segmentSizeSeconds ...
          0, // marketInterval.NONE // TODO how to handle?
          730 * 24 * 60 * 60,
          190 * 24 * 60 * 60, // YEARLY // TODO 190
          // TODO QUATERLY?
          45 * 24 * 60 * 60, // MONTHLY
          8 * 24 * 60 * 60, // WEEKLY
          36 * 60 * 60, // DAILY
          2 * 60 * 60, //TODO HOURLY: 5,
          //    15 * 60// TODO SHORT_TERM: 6
        ];

        // TODO +1
        if (maxFuture[marketInterval+1] <= expirationDatetime-dateNow/1000){
          console.log('skip 0');
          console.log('aa', maxFuture[marketInterval+1], expirationDatetime-dateNow/1000);
          continue;
        }
        // TODO +2
        if (maxFuture[marketInterval+2] >= expirationDatetime-dateNow/1000){
          console.log('skip 1');
          console.log('aa', maxFuture[marketInterval+1], expirationDatetime-dateNow/1000);
          continue;
        }
      }
      validMarkets.push(marketBaseData);
    }
    return validMarkets;
  };

  function GasStatistics(web3) {
    this.web3 = web3;
    this.statistics = {};
    this.gasPrice = web3Utils.toBN(web3Utils.toWei('10.0', 'gwei'));
    this.etherPriceInMilliDollar = web3Utils.toBN('180000');
  }
  GasStatistics.prototype.add = function(txHash, statKey){
    var self = this;
    return self.web3.eth.getTransactionReceipt(txHash)
      .then(function(txDetails){
        var gasUsedBn = web3Utils.toBN(txDetails.gasUsed);
        var eth = web3Utils.toBN(web3Utils.toWei('1', 'ether'));
        var us_dollar_approx = (gasUsedBn.mul(self.gasPrice).mul(self.etherPriceInMilliDollar).div(eth).toNumber()/1000.0).toFixed(3);
        if (! self.statistics[statKey])
          self.statistics[statKey] = [];

        self.statistics[statKey].push({
          gasUsed: gasUsedBn.toString(),
          usd: us_dollar_approx
        });
      });
  };
  GasStatistics.prototype.getJsonString = function(){
    function orderedStringify(obj, spaces) {
      var allKeys = [];
      JSON.stringify(obj, function(k, v){ allKeys.push(k); return v;}, spaces);
      return JSON.stringify(obj, allKeys.sort(), spaces);
    }

    //var keys = Object.keys(this.statistics).sort();
    //for (let key of keys){
    //  for (let entry of this.statistics[key]){
    //    console.log(`${key.padEnd(40)} - gasUsed: ${entry.gasUsed.padStart(8)}  ~USD: ${entry.usd.padStart(6)}`);
    //  }
    //}
    return orderedStringify(this.statistics, 2);
  };

  return {
    roundUpHour: roundUpHour,
    roundUpDay: roundUpDay,
    roundUpWeek: roundUpWeek,
    roundUpMonth: roundUpMonth,
    MarketsPossibleToCreate: MarketsPossibleToCreate,
    GasStatistics: GasStatistics,
  };
}));
