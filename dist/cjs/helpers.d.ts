export function roundUpHour(epochSeconds: any): number;
export function roundUpDay(epochSeconds: any): number;
export function roundUpWeek(epochSeconds: any): number;
export function roundUpMonth(epochSeconds: any): number;
export function MarketsPossibleToCreate(): void;
export class MarketsPossibleToCreate {
    existingMarkets: {};
    get(dateNow: any, markets: any): any[];
}
export function GasStatistics(web3: any): void;
export class GasStatistics {
    constructor(web3: any);
    web3: any;
    statistics: {};
    gasPrice: import("bn.js");
    etherPriceInMilliDollar: import("bn.js");
    add(txHash: any, statKey: any): any;
    getJsonString(): string;
}
