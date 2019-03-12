pragma solidity 0.5.5;
pragma experimental ABIEncoderV2;

import "./DigiOptions.sol";


contract DigioptionsMarketLister {

    address public owner;
    DigiOptions public digioptions;
    uint256 transactionFeeDefault; // DigiOptions.MarketBaseData.transactionFee

    constructor (DigiOptions addr) public {
        owner = msg.sender;
        digioptions = addr;
        transactionFeeDefault = 1; // TODO DigiOptions.MarketBaseData.transactionFee
    }

}
