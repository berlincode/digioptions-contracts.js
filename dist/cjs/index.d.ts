import digioptionsMarketsAbi from "./digioptions_markets_abi";
import digioptionsMarketListerAbi from "./digioptions_market_lister_abi";
export function getContractInfo(web3: any, contractAddr: any): any;
export function marketListerInfoToMarketListerDescription(web3: any, contractListerInfo: any): {
    listerValues: {
        versionMarketLister: number;
        ownerAddr: string;
        transactionFeeTotalMax: any;
        transactionFee0Min: any;
        transactionFee1Min: any;
        transactionFeeSignerMin: any;
        openDelaySeconds: any;
    };
    signerDataList: any;
};
export function sortEventsByExpirationDatetime(events: any): any;
export function filterEventsByExpirationDatetime(events: any, expirationDatetimeStart: any, expirationDatetimeEnd: any): any;
export function marketSearchSetup(contractInfo: any, expirationDatetimeEnd: any, blockTimestampLatest: any, toBlock: any, options: any): {
    contract: any;
    eventName: string;
    fromBlock: any;
    timestampCreatedMarkets: any;
    marketIntervalsSorted: any;
    expirationDatetimeEnd: any;
    filterMarketIntervalsTimestamp: any;
    toBlock: any;
    filterFunc: any;
    filtersMax: any;
    filterMarketCategories: any;
    filterMarketIntervals: any;
    eventsRemainingReady: never[];
    eventsRemaining: never[];
    exhausted: boolean;
};
export function getMarketCreateEvents(marketSearch: any, expirationDatetimeStart: any, limit: any): any;
export function getMarketDataList(web3: any, contractAddr: any, userAddr: any, expirationDatetime: any, options: any): any;
export function marketHash(marketBaseData: any): string | null;
export function orderOfferToHash(order: any): string | null;
export function signOrderOffer(offer: any, privateKey: any): {
    v: number;
    r: any;
    s: any;
};
export function versionFromInt(ver: any): {
    major: number;
    minor: number;
    bugfix: number;
};
export function versionToString(ver: any): string;
export namespace versionMarketLister {
    const major: number;
    const minor: number;
    const bugfix: number;
}
export namespace versionMarkets {
    const major_1: number;
    export { major_1 as major };
    const minor_1: number;
    export { minor_1 as minor };
    const bugfix_1: number;
    export { bugfix_1 as bugfix };
}
export { digioptionsMarketsAbi, digioptionsMarketListerAbi };
