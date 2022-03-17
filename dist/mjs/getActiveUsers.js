// vim: sts=2:ts=2:sw=2
/* eslint-env es6 */
import * as web3Utils from 'web3-utils';
function getActiveUsers(contract, marketHashes) {
    let filter = {};
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
        const users = {};
        for (let idx = 0; idx < eventsAll.length; idx++) {
            const returnValues = eventsAll[idx].returnValues;
            users[web3Utils.padLeft(web3Utils.toHex(returnValues.buyer), 40)] = true;
            users[web3Utils.padLeft(web3Utils.toHex(returnValues.seller), 40)] = true;
        }
        return Object.keys(users);
    });
}
export { getActiveUsers, };
//# sourceMappingURL=getActiveUsers.js.map