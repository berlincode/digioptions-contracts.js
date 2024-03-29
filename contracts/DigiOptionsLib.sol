/*

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

pragma solidity >=0.7.0;

import "factsigner/contracts/FactsignerDefines.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "@openzeppelin/contracts/math/SignedSafeMath.sol";


library DigiOptionsLib {
    using SafeMath for uint256;

    /*
        For future updgrade we want getContractInfo() to remain its signature('getContractInfo(uint256[]')
        so we declared the return values as dynamic list. The meaning of each entry is defined via
        follwing enum.
    */
    enum InfoValues { // rename InfoContract
        CONTRACT_TYPE_IDX, // 0
        VERSION_MARKET_LISTER_IDX, // 1
        VERSION_MARKETS_IDX, // 2
        DIGIOPTIONS_MARKETS_ADDR_IDX, // 3
        BLOCK_NUMBER_CREATED_IDX, // 4
        TIMESTAMP_CREATED_MARKETS_IDX, // 5
        OFFER_MAX_BLOCKS_INTO_FUTURE_IDX, // 6
        ATOMIC_OPTION_PAYOUT_WEI_EXP_IDX, // 7
        EXISTING_MARKETS_IDX, // 8

        MAX // meta info
    }

    enum InfoLister {
        VERSION_MARKET_LISTER_IDX, // 0
        OWNER_IDX,
        TRANSACTION_FEE_TOTAL_MAX_IDX,
        TRANSACTION_FEE0_MIN_IDX,
        TRANSACTION_FEE1_MIN_IDX,
        TRANSACTION_FEE_SIGNER_MIN_IDX,
        OPEN_DELAY_SECONDS_IDX,

        MAX // meta info
    }

    enum ContractType {
        UNKNOWN,
        DIGIOPTIONSMARKETS, // == 1
        DIGIOPTIONSMARKETLISTER // == 2
    }

    enum UserState {
        NONE,
        EXISTS,
        PAYED_OUT
    }

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct MarketBaseData {
        /* constant core market data, part of marketHash calculation */

        string underlyingString;
        uint40 expirationDatetime; /* used for sorting contracts */
        uint24 objectionPeriod; /* e.g. 3600 seconds */

        uint8 config;
        uint8 marketCategory;

        uint8 baseUnitExp;
        int8 ndigit;

        address signerAddr; /* address used to check the signed result (e.g. of factsigner) */

        uint8 marketInterval;
        uint8 transactionFee0; /* fee in 1/100 per cent (payed by orderTaker) */
        uint8 transactionFee1; /* fee in 1/100 per cent (payed by orderTaker) */
        uint8 transactionFeeSigner; /* fee in 1/100 per cent (payed by orderTaker) */
        address feeTaker0;
        address feeTaker1;
        int128[] strikes;
    }

    struct MarketState {
        /* winningOptionID is only valid if settled == true */
        uint128 fee; // total payed fee (for all fee takers)
        uint16 winningOptionID;
        bool settled;
    }

    struct MarketData {
        MarketBaseData marketBaseData;
        MarketState marketState;
        bytes32 marketHash;
        UserState userState;
        bool testMarket; // only used by MarketLister
    }


// TODO remove long term? (and add 2-year?)
// TODO remove uint8() conversion
// TODO time offset between marketsContract and marketListerContract?

    /* until const arrays are supported in solidity we use our custom function */
    uint256 constant DIVIDER_ENTRY_BYTES = 6;
    bytes constant DIVIDER_TABLE = "\
\x00\x00\x00\x00\x00\x00\
\x00\x00\x00\xfa\x7d\x00\
\x00\x00\x00\x3b\x53\x80\
\x00\x00\x00\x0a\x8c\x00\
\x00\x00\x00\x01\xfa\x40\
\x00\x00\x00\x00\x1c\x20\
\x00\x00\x00\x00\x00\x00\
";

    function getDivider(
        uint256 calculatedMarketInterval
    )
        internal
        pure
        returns (uint48)
    {
        bytes memory table = DIVIDER_TABLE;
        uint offset = (calculatedMarketInterval + 1) * DIVIDER_ENTRY_BYTES;
        uint48 value;
        assembly {
            value := mload(add(table, offset))
        }

        return value;
    }


    // TODO this is only 'view' and not internal because of block.timestamp - maybe change that
    function calcMarketInterval (
        uint40 expirationDatetime
    )
        internal
        view
        returns (uint8 interval)
    {
        uint8 marketInterval;
        uint256 secondsUntilExpiration = uint256(expirationDatetime).sub(uint256(block.timestamp));
        // TODO > or >= ?
        require(secondsUntilExpiration < 730 * 24 * 60 * 60, "too far in the future");
        if (secondsUntilExpiration > 45 * 24 * 60 * 60) // > 45 days
            marketInterval = uint8(FactsignerDefines.MarketInterval.YEARLY);
        else if (secondsUntilExpiration > 8 * 24 * 60 * 60) // > 8 days
            marketInterval = uint8(FactsignerDefines.MarketInterval.MONTHLY);
        else if (secondsUntilExpiration > 36 * 60 * 60) // > 36 hours
            marketInterval = uint8(FactsignerDefines.MarketInterval.WEEKLY);
        else if (secondsUntilExpiration > 2 * 60 * 60) // > 2 hours
            marketInterval = uint8(FactsignerDefines.MarketInterval.DAILY);
        else if (secondsUntilExpiration > 15 * 60) // > 15 min
            marketInterval = uint8(FactsignerDefines.MarketInterval.HOURLY);
        else
            marketInterval = uint8(FactsignerDefines.MarketInterval.SHORT_TERM);

        return marketInterval;
    }

    function calcFactHash (
        DigiOptionsLib.MarketBaseData memory marketBaseData
    )
        internal
        pure // this should be external (see https://github.com/ethereum/solidity/issues/5479)
        returns (bytes32 factHash)
    {
        bytes memory data;
        data = abi.encodePacked(
            keccak256(abi.encodePacked(marketBaseData.underlyingString)), /* 'name' utf8 encoded */
            marketBaseData.expirationDatetime, /* 'settlement' unix epoch seconds UTC */
            marketBaseData.objectionPeriod, /* e.g. 3600 seconds */
            marketBaseData.config,
            marketBaseData.marketCategory,

            marketBaseData.baseUnitExp, /* e.g. 18 -> baseUnit = 10**18 = 1000000000000000000 */
            marketBaseData.ndigit /* 'ndigit' number of digits (may be negative) */
        );
        // if this is a named market we simply use strikes as factsigner's namedRanges
        if ((marketBaseData.config & uint8(FactsignerDefines.ConfigMask.ConfigMarketTypeIsStrikedMask) == 0)) {
            data = abi.encodePacked(
                data,
                marketBaseData.strikes
            );
        }
        return keccak256(data);
    }

    function calcMarketHash (
        DigiOptionsLib.MarketBaseData memory marketBaseData
    )
        internal
        pure
        returns (bytes32 marketHash)
    {
        bytes memory data;
        data = abi.encodePacked(
            // TODO from facthash?
            keccak256(abi.encodePacked(marketBaseData.underlyingString)), /* 'name' utf8 encoded */
            marketBaseData.expirationDatetime, /* 'settlement' unix epoch seconds UTC */
            marketBaseData.objectionPeriod, /* e.g. 3600 seconds */
            marketBaseData.config,
            marketBaseData.marketCategory,

            marketBaseData.baseUnitExp, /* e.g. 18 -> baseUnit = 10**18 = 1000000000000000000 */
            marketBaseData.ndigit, /* 'ndigit' number of digits (may be negative) */

            marketBaseData.marketInterval,
            marketBaseData.feeTaker0,
            marketBaseData.feeTaker1,
            marketBaseData.signerAddr /* address used to check the signed result (e.g. of factsigner) */
        );
        data = abi.encodePacked(
            data,
            marketBaseData.transactionFee0,
            marketBaseData.transactionFee1,
            marketBaseData.transactionFeeSigner,
            marketBaseData.strikes
        );
        return keccak256(data);
    }

    function calcBaseMarketHash (
        MarketBaseData memory marketBaseData
    )
        internal
        pure
        returns (bytes32 baseMarketHash)
    {
        /* baseMarketHash is similar to marketHash but does not contain all elements. It's basically a factHash with added marketInterval */
        bytes memory data;
        data = abi.encodePacked(
            keccak256(abi.encodePacked(marketBaseData.underlyingString)), /* 'name' utf8 encoded */
            marketBaseData.expirationDatetime, /* 'settlement' unix epoch seconds UTC */
            marketBaseData.objectionPeriod, /* e.g. 3600 seconds */
            marketBaseData.config,
            marketBaseData.marketCategory,

            marketBaseData.baseUnitExp, /* e.g. 18 -> baseUnit = 10**18 = 1000000000000000000 */
            marketBaseData.ndigit, /* 'ndigit' number of digits (may be negative) */

            marketBaseData.marketInterval,

            marketBaseData.signerAddr
        );
        // if this is a named market we simply use strikes as factsigner's namedRanges
        if ((marketBaseData.config & uint8(FactsignerDefines.ConfigMask.ConfigMarketTypeIsStrikedMask) == 0)) {
            data = abi.encodePacked(
                data,
                marketBaseData.strikes
            );
        }
        return keccak256(data);

    }


    bytes constant OFFER_PREFIX = "\x19Ethereum Signed Message:\n32"; // TODO
    function verifyOffer(
        bytes32 message,
        Signature memory signature
    )
        internal
        pure
        returns (address addr)
    {
        bytes32 prefixedHash = keccak256(
            abi.encodePacked(
                OFFER_PREFIX,
                message
            )
        );
        address signer = ecrecover(
            prefixedHash,
            signature.v,
            signature.r,
            signature.s
        );
        return signer;
    }
}
