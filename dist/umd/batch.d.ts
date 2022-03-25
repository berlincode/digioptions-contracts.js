/**
 * make a promisified "BatchRequest"
 * @param {Object} batch - a new BatchRequest instance (create with e.g. 'new web3.BatchRequest()')
 * @param {Array} callsAndParams - each array element must contain a tuple of a call request function and its params
 * @return {Object} - promise that returns an array which contains a result for each request
 */
export function makeBatchRequestPromise(batch: Object, callsAndParams: any[]): Object;
export function getPastEventsForBatchRequest(contract: any, eventName: any, options: any): any[];
export function getBlockForBatchRequest(contract: any): any;
