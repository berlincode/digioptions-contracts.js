pragma solidity ^0.6.1;


library SafeCast {
    /**
     * Cast unsigned a to signed a.
     */
    function castToInt(uint256 a) internal pure returns(int256) {
        assert(a < (1 << 255));
        return int(a);
    }

    /**
     * Cast signed a to unsigned a.
     */
    function castToUint(int256 a) internal pure returns(uint256) {
        assert(a >= 0);
        return uint(a);
    }

    // TODO FIXME
    function castToInt128(int256 a) internal pure returns(int128) {
        //assert(a < (1 << 255));
        return int128(a);
    }

    // TODO FIXME
    function castToUint128(uint256 a) internal pure returns(uint128) {
        //assert(a < (1 << 255));
        return uint128(a);
    }
}
