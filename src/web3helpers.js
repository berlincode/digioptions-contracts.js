// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */

/**
 * make a promisified "BatchRequest"
 * @param {Object} batch - a new BatchRequest instance (create with e.g. 'new web3.BatchRequest()')
 * @param {Array} callsAndParams - each array element must contain a tuple of a call request function and its params
 * @return {Object} - promise that returns an array which contains a result for each request
 */
function makeBatchRequestPromise(batch, callsAndParams) {

  const promises = callsAndParams.map(callAndParam => {
    const call = callAndParam[0];
    const params = callAndParam[1];

    return new Promise((res, rej) => {
      const req = call(params, (err, data) => {
        if(err){
          rej(err);
        } else {
          res(data);
        }
      });
      batch.add(req);
    });
  });
  batch.execute();

  return Promise.all(promises);
}

export {
  makeBatchRequestPromise,
};
