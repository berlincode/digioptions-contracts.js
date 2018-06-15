pragma solidity ^0.4.24;


contract DigioptionsMarkets {

    address public ownerAddr;

    constructor () public {
        ownerAddr = msg.sender;
    }
}
