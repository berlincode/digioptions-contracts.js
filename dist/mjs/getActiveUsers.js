// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
import * as web3Utils from 'web3-utils';
function getActiveUsers(contract, marketHashes) {
    var filter = {};
    if (marketHashes) {
        filter = {
            marketHash: marketHashes
        };
    }
    return contract.getPastEvents('PositionChange', {
        filter: filter,
        fromBlock: 0,
        toBlock: 'latest'
    })
        .then(function (eventsAll) {
        var users = {};
        for (var idx = 0; idx < eventsAll.length; idx++) {
            var returnValues = eventsAll[idx].returnValues;
            users[web3Utils.padLeft(web3Utils.toHex(returnValues.buyer), 40)] = true;
            users[web3Utils.padLeft(web3Utils.toHex(returnValues.seller), 40)] = true;
        }
        return Object.keys(users);
    });
}
export { getActiveUsers, };
