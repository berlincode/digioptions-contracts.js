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

 SPDX-License-Identifier: MIT

 MIT License

 Copyright (c) digioptions.com (https://www.digioptions.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

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
