"use strict";
// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasStatistics = exports.MarketsPossibleToCreate = exports.roundUpMonth = exports.roundUpWeek = exports.roundUpDay = exports.roundUpHour = void 0;
const web3Utils = __importStar(require("web3-utils"));
const factsigner_1 = __importDefault(require("factsigner"));
const digioptionsContracts = __importStar(require("./index.js"));
function roundUpHour(epochSeconds) {
    return Math.floor((epochSeconds + 3600 - 1) / 3600) * 3600;
}
exports.roundUpHour = roundUpHour;
function roundUpDay(epochSeconds) {
    // TODO
    return Math.floor(epochSeconds + 35 * 3600);
    // return Math.floor((epochSeconds + 24*3600 - 1) / (24*3600))* 24*3600;
}
exports.roundUpDay = roundUpDay;
function roundUpWeek(epochSeconds) {
    return Math.floor((epochSeconds + 7 * 24 * 3600 - 1) / (7 * 24 * 3600)) * 7 * 24 * 3600;
}
exports.roundUpWeek = roundUpWeek;
function roundUpMonth(epochSeconds) {
    const date = new Date(0); // The 0 is the key, which sets the date to the epoch
    date.setUTCSeconds(epochSeconds);
    let current;
    if (date.getMonth() == 11) {
        current = new Date(Date.UTC(date.getFullYear() + 1, 0, 1, 0, 0, 0));
    }
    else {
        current = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0));
    }
    return +current / 1000;
}
exports.roundUpMonth = roundUpMonth;
function MarketsPossibleToCreate() {
    this.existingMarkets = {}; // remember markets that we have already returned
}
exports.MarketsPossibleToCreate = MarketsPossibleToCreate;
MarketsPossibleToCreate.prototype.get = function (dateNow, markets) {
    //const self = this;
    const validMarkets = [];
    for (let idx = 0; idx < markets.length; idx++) {
        const marketBaseData = markets[idx];
        const marketHash = digioptionsContracts.marketHash(marketBaseData);
        if (this.existingMarkets[marketHash]) {
            continue;
        }
        this.existingMarkets[marketHash] = true;
        if (marketBaseData.config & factsigner_1.default.constants.configIntervalTypeIsUsedMask) {
            const marketInterval = marketBaseData.marketInterval;
            const expirationDatetime = marketBaseData.expirationDatetime;
            // TODO duplicate
            const maxFuture = [
                0,
                730 * 24 * 60 * 60,
                190 * 24 * 60 * 60,
                // TODO QUATERLY?
                45 * 24 * 60 * 60,
                8 * 24 * 60 * 60,
                36 * 60 * 60,
                2 * 60 * 60, //TODO HOURLY: 5,
                //    15 * 60// TODO SHORT_TERM: 6
            ];
            // TODO +1
            if (maxFuture[marketInterval + 1] <= expirationDatetime - dateNow / 1000) {
                console.log('skip 0');
                console.log('aa', maxFuture[marketInterval + 1], expirationDatetime - dateNow / 1000);
                continue;
            }
            // TODO +2
            if (maxFuture[marketInterval + 2] >= expirationDatetime - dateNow / 1000) {
                console.log('skip 1');
                console.log('aa', maxFuture[marketInterval + 1], expirationDatetime - dateNow / 1000);
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
exports.GasStatistics = GasStatistics;
GasStatistics.prototype.add = function (txHash, statKey) {
    const self = this;
    return self.web3.eth.getTransactionReceipt(txHash)
        .then(function (txDetails) {
        const gasUsedBn = web3Utils.toBN(txDetails.gasUsed);
        const eth = web3Utils.toBN(web3Utils.toWei('1', 'ether'));
        const us_dollar_approx = (gasUsedBn.mul(self.gasPrice).mul(self.etherPriceInMilliDollar).div(eth).toNumber() / 1000.0).toFixed(3);
        if (!self.statistics[statKey])
            self.statistics[statKey] = [];
        self.statistics[statKey].push({
            gasUsed: gasUsedBn.toString(),
            usd: us_dollar_approx
        });
    });
};
GasStatistics.prototype.getJsonString = function () {
    function orderedStringify(obj, spaces) {
        const allKeys = [];
        JSON.stringify(obj, function (k, v) { allKeys.push(k); return v; }, spaces);
        return JSON.stringify(obj, allKeys.sort(), spaces);
    }
    //const keys = Object.keys(this.statistics).sort();
    //for (let key of keys){
    //  for (let entry of this.statistics[key]){
    //    console.log(`${key.padEnd(40)} - gasUsed: ${entry.gasUsed.padStart(8)}  ~USD: ${entry.usd.padStart(6)}`);
    //  }
    //}
    return orderedStringify(this.statistics, 2);
};
