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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveUsers = void 0;
const web3Utils = __importStar(require("web3-utils"));
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
exports.getActiveUsers = getActiveUsers;
//# sourceMappingURL=getActiveUsers.js.map