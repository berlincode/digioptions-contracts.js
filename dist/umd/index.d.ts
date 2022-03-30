export const marketStartMaxIntervalBeforeExpiration: number[];
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
export function sortMarketCreateEventsByExpirationDatetime(events: any): any;
export function sortPositionChangeEventsByDatetime(events: any): any;
export function filterEventsByExpirationDatetime(events: any, expirationDatetimeStart: any, expirationDatetimeEnd: any): any;
export function marketSearchSetup(contractInfo: any, blockTimestampLatest: any, toBlock: any, { limitPerFetch, filterFunc, filterMarketCategories, filterMarketIntervals, expirationDatetimeStart, expirationDatetimeEnd, }?: {
    limitPerFetch?: null | undefined;
    filterFunc?: (() => true) | undefined;
    filterMarketCategories?: null | undefined;
    filterMarketIntervals?: null | undefined;
    expirationDatetimeStart?: number | undefined;
    expirationDatetimeEnd?: number | undefined;
}): {
    contract: any;
    eventName: string;
    fromBlock: any;
    timestampCreatedMarkets: any;
    expirationDatetimeStart: number;
    expirationDatetimeEnd: number;
    toBlock: any;
    limitPerFetch: null;
    filterFunc: () => true;
    filterMarketCategories: null;
    filterMarketIntervals: null;
    marketIntervalMin: number;
    eventsRemainingReady: never[];
    eventsRemaining: never[];
    exhaustedGetPastEvents: boolean;
    exhausted: boolean;
};
export function getMarketCreateEvents(marketSearch: any): Promise<any[]>;
export function getMarketDataList(web3: any, contractAddr: any, userAddr: any, options: any): any;
import { getPastEvents } from "./events";
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
export { digioptionsMarketsAbi, digioptionsMarketListerAbi, getPastEvents };
