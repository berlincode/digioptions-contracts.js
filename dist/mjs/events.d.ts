export const maximumBlockRangeDefault: 172800;
export const numConcurrencyDefault: 2;
export function blockIteratorReverse(fromBlock: any, toBlock: any, maximumBlockRange: any): {
    next: () => {
        value: {
            fromBlock: number;
            toBlock: any;
        };
        done: boolean;
    };
    iterations: () => number;
    [Symbol.iterator]: () => any;
};
export function getPastEvents(contract: any, fromBlock: any, toBlock: any, eventNameAndFilterList: any, { numConcurrency, maximumBlockRange, progressCallback, blockIterator, }?: {
    numConcurrency?: number | undefined;
    maximumBlockRange?: number | undefined;
    progressCallback?: null | undefined;
    blockIterator?: typeof blockIteratorReverse | undefined;
}): Promise<never[][]>;
