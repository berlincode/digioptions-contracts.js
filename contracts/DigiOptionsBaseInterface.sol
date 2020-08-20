/*
 freedex-protocol / User Driven Option Markets Contract used by https://www.digioptions.com

 Base data structures and the interface functions that
 are implemented by both contracts (DigiOptionsMarkets and
 DigioptionsMarketLister)

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

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "factsigner/contracts/FactsignerDefines.sol";
import "factsigner/contracts/FactsignerVerify.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./DigiOptionsLib.sol";

abstract contract DigiOptionsBaseInterface {

    function getContractInfo (
    )
        external
        virtual
        returns (uint256[] memory contractInfoValues);

    function getMarketDataByMarketHash (
        address addr, // marketData.userState for this address
        bytes32 marketHash
    )
        public
        view
        virtual
        returns (DigiOptionsLib.MarketData memory marketData);

    function getMarketDataListByMarketKeys (
        address addr, // marketData.userState for this address
        bytes32[] calldata marketKeys // marketsContract uses marketHash / marketListerContract uses baseMarketHash
    )
        external
        view
        virtual
        returns (DigiOptionsLib.MarketData[] memory marketDataList);

    // TODO implement createMarketTest

    function createMarket (
        DigiOptionsLib.MarketBaseData memory marketBaseData,
        bool testMarket,
        FactsignerVerify.Signature memory signature
    )
        public
        virtual
        returns (bytes32 marketHash);

    function calcMarketInterval (
        uint40 expirationDatetime
    )
        external
        view
        virtual
        returns (uint8 interval);

}
