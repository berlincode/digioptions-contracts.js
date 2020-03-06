/*
 User Driven Option Markets Contract used by https://www.digioptions.com

 This is just a helper to test internal functions which are not
 exposed from main contracts.

 Copyright (c) [www.digioptions.com](https://www.digioptions.com)

 Designed to work with signatures from [www.factsigner.com](https://www.factsigner.com)

 Public repository:
 https://github.com/berlincode/digioptions-contracts.js

 elastic.code@gmail.com
 mail@digioptions.com

*/

pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

import "./DigiOptionsLib.sol";


contract DigiOptionsTest {

    function getDividerTest(
        uint256 calculatedMarketInterval
    )
        public
        pure
        returns (uint48)
    {
        return DigiOptionsLib.getDivider(calculatedMarketInterval);
    }

    function calcFactHashTest (
        DigiOptionsLib.MarketBaseData memory marketBaseData
    )
        public
        pure
        returns (bytes32 marketHash)
    {
        return DigiOptionsLib.calcFactHash(marketBaseData);
    }

    function calcMarketHashTest (
        DigiOptionsLib.MarketBaseData memory marketBaseData
    )
        public
        pure
        returns (bytes32 marketHash)
    {
        return DigiOptionsLib.calcMarketHash(marketBaseData);
    }

    function calcBaseMarketHash (
        DigiOptionsLib.MarketBaseData memory marketBaseData
    )
        public
        pure
        returns (bytes32 baseMarketHash)
    {
        return DigiOptionsLib.calcBaseMarketHash(marketBaseData);
    }

    function calcMarketIntervalTest (
        uint40 expirationDatetime
    )
        public
        view
        returns (uint8 interval)
    {
        return DigiOptionsLib.calcMarketInterval(expirationDatetime);
    }

}
