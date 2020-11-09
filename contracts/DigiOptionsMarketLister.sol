/*
 freedex-protocol / User Driven Option Markets Contract used by https://www.digioptions.com

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

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./DigiOptionsBaseInterface.sol";
import "./DigiOptionsMarkets.sol";
import "./DigiOptionsLib.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/math/SignedSafeMath.sol";


contract DigiOptionsMarketLister is DigiOptionsBaseInterface {
    using SafeMath for uint256;
    using SignedSafeMath for int256;

    /*
        we use a simple linked list - since the SignerListEntry is part of a map
        the value remains directly accessible by the signer's address
    */
    struct SignerListEntry {
        uint256 value;
        address addrNext;
        bool exists;
    }

    struct SignerData {
        address signerAddr;
        uint256 value;
    }

    uint256 constant private VERSION = (
        (0 << 32) + /* major */
        (53 << 16) + /* minor */
        0 /* bugfix */
    );

    /* constants which are set during construction */
    uint256 private blockNumber;
    address private owner;
    DigiOptionsMarkets private digiOptionsMarkets;

    uint256 private existingMarkets; /* one bit for each marketCategory and marketInterval */

    /* control variables/constants */
    uint256 constant private transactionFeeTotalMax = 100; // 1.0%
    uint256 constant private transactionFee0Min = 10; // 0.1%
    uint256 constant private transactionFee1Min = 10; // 0.1%
    uint256 constant private transactionFeeSignerMin = 5; // 0.05%
    uint16 constant private openDelaySeconds = 600;

    address internal signerAddrFirst; /* the first signer (if exists) */
    mapping(address => SignerListEntry) private signerEntriesMap; // stores which signing addresses are allowed to register
    uint256 private signerMapNumEntries = 0;

    /* variables */
    struct MarketBest {
        bytes32 marketHash;
        uint8 transactionFee0;
        uint40 openTime;
    }
    mapping(bytes32 => MarketBest) internal marketsBest; // mapping from baseMarketHash
    mapping(bytes32 => bool) internal isTestMarket; // mapping from marketHash

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    event MarketCreateLister(
        bytes32 marketKey, /* marketsContract stores marketHash ; marketListerContract stores baseMarketHash */
        uint48 indexed expirationDatetimeFilter,
        uint40 expirationDatetime,
        uint8 indexed marketInterval,
        uint8 indexed marketCategory,
        uint40 openTime,
        string underlyingString
    );

    constructor (DigiOptionsMarkets addr)
    {
        owner = msg.sender;
        blockNumber = block.number;
        digiOptionsMarkets = addr;
    }

    /* TODO re-enabled after 0x-tools support solc-0.6.0
    // default fallback
    receive () external payable {
        revert();
    }
    */

    function getContractInfo (
    )
        external
        override
	virtual
        returns (uint256[] memory contractInfoValues)
    {
        uint256[] memory infoValues = digiOptionsMarkets.getContractInfo();

        {
            infoValues[uint256(DigiOptionsLib.InfoValues.CONTRACT_TYPE_IDX)] = uint256(DigiOptionsLib.ContractType.DIGIOPTIONSMARKETLISTER);
            infoValues[uint256(DigiOptionsLib.InfoValues.VERSION_MARKET_LISTER_IDX)] = VERSION;
            //infoValues[uint256(DigiOptionsLib.InfoValues.VERSION_MARKETS_IDX)] // keep versionMarkets
            infoValues[uint256(DigiOptionsLib.InfoValues.DIGIOPTIONS_MARKETS_ADDR_IDX)] = uint256(address(digiOptionsMarkets));
        }
        {
            infoValues[uint256(DigiOptionsLib.InfoValues.BLOCK_NUMBER_CREATED_IDX)] = blockNumber;
            //infoValues[uint256(DigiOptionsLib.InfoValues.TIMESTAMP_MARKET_CREATED_IDX)] // keep timestampMarketsCreated
            //infoValues[uint256(DigiOptionsLib.InfoValues.OFFER_MAX_BLOCKS_INTO_FUTURE_IDX)] // keep offerMaxBlocksInto_future
            //infoValues[uint256(DigiOptionsLib.InfoValues.PAYOUT_PER_NANO_OPTION_EXP_IDX)] // keep payoutPerNanoOption
            infoValues[uint256(DigiOptionsLib.InfoValues.EXISTING_MARKETS_IDX)] = existingMarkets;
        }

        return infoValues;
    }

    function getMarketListerInfo(
    )
        external
        view
        returns (uint256[] memory listerValues, SignerData[] memory signerDataList)
    {
        listerValues = new uint[](uint256(DigiOptionsLib.InfoLister.MAX));

        listerValues[uint256(DigiOptionsLib.InfoLister.VERSION_MARKET_LISTER_IDX)] = VERSION;
        listerValues[uint256(DigiOptionsLib.InfoLister.OWNER_IDX)] = uint256(owner);
        listerValues[uint256(DigiOptionsLib.InfoLister.TRANSACTION_FEE_TOTAL_MAX_IDX)] = transactionFeeTotalMax;
        listerValues[uint256(DigiOptionsLib.InfoLister.TRANSACTION_FEE0_MIN_IDX)] = transactionFee0Min;
        listerValues[uint256(DigiOptionsLib.InfoLister.TRANSACTION_FEE1_MIN_IDX)] = transactionFee1Min;
        listerValues[uint256(DigiOptionsLib.InfoLister.TRANSACTION_FEE_SIGNER_MIN_IDX)] = transactionFeeSignerMin;
        listerValues[uint256(DigiOptionsLib.InfoLister.OPEN_DELAY_SECONDS_IDX)] = uint256(openDelaySeconds);

        uint256 numEntries = signerMapNumEntries;
        signerDataList = new SignerData[](numEntries);

        address signerAddr = signerAddrFirst;
        uint256 idx;
        for (idx=0 ; idx < numEntries ; idx++){

            signerDataList[idx] = SignerData({
                signerAddr: signerAddr,
                value: signerEntriesMap[signerAddr].value
            });
            // move on with next entry
            signerAddr = signerEntriesMap[signerAddr].addrNext;
        }

        return (listerValues, signerDataList);
    }

    function getMarketDataByMarketHash (
        address addr, // marketData.userState for this address
        bytes32 marketHash
    )
        public
        view
        override
        virtual
        returns (DigiOptionsLib.MarketData memory marketData)
    {
        marketData = digiOptionsMarkets.getMarketDataByMarketHash(addr, marketHash);
        // override testMarket
        marketData.testMarket = isTestMarket[marketHash];
    }

    function getMarketDataListByMarketKeys (
        address addr, // marketData.userState for this address
        bytes32[] calldata marketKeys // marketsContract uses marketHash / marketListerContract uses baseMarketHash
    )
        external
        view
        override
        virtual
        returns (DigiOptionsLib.MarketData[] memory marketDataList)
    {
        marketDataList = new DigiOptionsLib.MarketData[](marketKeys.length);
        uint256 idx;

        for (idx= 0 ; idx < marketKeys.length ; idx++) {
            marketDataList[idx] = getMarketDataByMarketHash(addr, marketsBest[marketKeys[idx]].marketHash);
        }
        return marketDataList;
    }

    function calcMarketInterval (
        uint40 expirationDatetime
    )
        external
        view
        override
        virtual
        returns (uint8 interval)
    {
        return digiOptionsMarkets.calcMarketInterval(expirationDatetime);
    }

    /*
    check, if a market might be possible to register (it does not need to be created for this
    and it is not checked if creating is possible at all)
    */
    function registerMarketTest (
        DigiOptionsLib.MarketBaseData memory marketBaseData
    )
        public
        view
        returns (bool registerPossible)
    {

        {
            if (msg.sender == owner){
                // always allow owner
                return true;
            }

            if (
                (signerEntriesMap[marketBaseData.signerAddr].value == 0) // TODO check bits!
            ){
                return false;
            }
        }

        /* check fees and feeTaker0 */
        if (
            ((uint256(marketBaseData.transactionFee0)).add(uint256(marketBaseData.transactionFee1)).add(uint256(marketBaseData.transactionFeeSigner)) <= transactionFeeTotalMax) &&
            (marketBaseData.transactionFee0 >= transactionFee0Min) &&
            (marketBaseData.transactionFee1 >= transactionFee1Min) &&
            (marketBaseData.transactionFeeSigner >= transactionFeeSignerMin) &&
            (marketBaseData.feeTaker0 == owner)
        ){
            return true;
        }

        return false;
    }

    /*
        This is just a convenient wrapper for both, creating and registering a market.
        Remember you can always do this in two transactions and just use this contract
        for registration.
    */
    function createMarket (
        DigiOptionsLib.MarketBaseData memory marketBaseData,
        bool testMarket,
        FactsignerVerify.Signature memory signature
    )
        public // this should be external (see https://github.com/ethereum/solidity/issues/5479)
        override
        returns (bytes32 marketHash)
    {
        require (registerMarketTest(marketBaseData), 'register not possible');
        marketHash = digiOptionsMarkets.createMarket(
            marketBaseData,
            testMarket,
            signature
        );
        registerMarketIntern (
            marketBaseData,
            marketHash,
            testMarket
        );
        return marketHash;
    }

    function registerMarket (
        bytes32 marketHash,
        bool testMarket
    )
        public
    {
        DigiOptionsLib.MarketBaseData memory marketBaseData = digiOptionsMarkets.getMarketBaseDataByMarketHash(marketHash);

        /* check that the market exists */
        assert(marketBaseData.expirationDatetime != 0);

        require (registerMarketTest(marketBaseData), 'register not possible');
        registerMarketIntern(
            marketBaseData,
            marketHash,
            testMarket
        );
    }

    function registerMarketIntern (
        DigiOptionsLib.MarketBaseData memory marketBaseData,
        bytes32 marketHash,
        bool testMarket
    )
        internal
    {
        bytes32 baseMarketHash = DigiOptionsLib.calcBaseMarketHash(marketBaseData);

        MarketBest storage marketBest = marketsBest[baseMarketHash];

        if (marketBest.marketHash == 0) {
            // does not yet exist

            uint40 openTime = uint40((msg.sender == owner)? 0 : block.timestamp + openDelaySeconds);
            marketsBest[baseMarketHash] = MarketBest(
                {
                marketHash: marketHash,
                transactionFee0: marketBaseData.transactionFee0,
                openTime: openTime
                }
            );

            if (msg.sender == owner) {
                isTestMarket[marketHash] = testMarket;
            }

            uint256 existingMarketsBit = (1 << uint256(marketBaseData.marketInterval)) << (marketBaseData.marketCategory * 8);
            if (existingMarkets & existingMarketsBit == 0) {
                existingMarkets = existingMarkets | existingMarketsBit;
            }

            uint8 marketIntervalForEventFilter;
            if ((marketBaseData.config & uint8(FactsignerDefines.ConfigMask.ConfigIntervalTypeIsUsedMask) != 0)) {
                /* interval used */
                marketIntervalForEventFilter = marketBaseData.marketInterval;
            } else {
                /* interval unused */
                marketIntervalForEventFilter = DigiOptionsLib.calcMarketInterval(marketBaseData.expirationDatetime);
            }

            // emit only once for each market (even if it will be replaced later)
            emit MarketCreateLister(
                baseMarketHash, // marketKey
                ((marketBaseData.expirationDatetime/DigiOptionsLib.getDivider(marketIntervalForEventFilter)) << 8) + marketIntervalForEventFilter,
                marketBaseData.expirationDatetime,
                marketBaseData.marketInterval,
                marketBaseData.marketCategory,
                openTime,
                marketBaseData.underlyingString
            );
            return;
        }
        if (
            (marketBaseData.transactionFee0 > marketBest.transactionFee0) &&
            (block.timestamp < marketBest.openTime)
        ){
            marketBest.marketHash = marketHash;
            marketBest.transactionFee0 = marketBaseData.transactionFee0;
        }
    }

    function setTestMarket (
        bytes32 marketHash,
        bool testMarket
    )
        public
        onlyOwner
    {
        isTestMarket[marketHash] = testMarket;
    }

    /*
    function setOpenDelaySeconds (
        uint16 openDelaySeconds_
    )
        public
        onlyOwner
    {
        if (openDelaySeconds_ > 0) {
            openDelaySeconds = openDelaySeconds_;
        }
    }
    */

    /*
    function setTransactionFeeTotalMax (
        uint64 transactionFeeTotalMax_
    )
        public
        onlyOwner
    {
        transactionFeeTotalMax = transactionFeeTotalMax_;
    }
    */

    function setSigner (
        address signerAddr,
        uint256 value
    )
        public
        onlyOwner
    {
        if (signerEntriesMap[signerAddr].exists){
            // just modify value
            signerEntriesMap[signerAddr].value = value;
            return;
        }

        // add new entry at the head of the list
        address addrTmp = signerAddrFirst;
        signerEntriesMap[signerAddr] = SignerListEntry({
            value: value,
            addrNext: addrTmp,
            exists: true
        });
        signerAddrFirst = signerAddr;
        signerMapNumEntries = signerMapNumEntries + 1;
    }
}
