export const maximumBlockRangeDefault: 172800;
export const numConcurrencyDefault: 2;
export function blockIteratorReverse(fromBlock: any, toBlock: any, maximumBlockRange: any): {
    next: () => {
        value: {};
        done: true;
    } | {
        value: {
            fromBlock: number;
            toBlock: any;
        };
        done: false;
    };
    iterations: () => number;
    isExhausted: () => boolean;
    nextToBlock: () => any;
    stop: () => void;
    [Symbol.iterator]: () => any;
};
export function getPastEvents(contract: any, fromBlock: any, toBlock: any, eventNameAndFilterList: any, { numConcurrency, maximumBlockRange, progressCallback, blockIterator, progressCallbackDebounce, timestampStop, }?: {
    numConcurrency?: number | undefined;
    maximumBlockRange?: number | undefined;
    progressCallback?: null | undefined;
    blockIterator?: typeof blockIteratorReverse | undefined;
    progressCallbackDebounce?: number | undefined;
    timestampStop?: null | undefined;
}): Promise<never[][]>;
