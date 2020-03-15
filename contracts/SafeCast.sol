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

    // TODO
    function castToInt128(int256 a) internal pure returns(int128) {
        assert(int128(a) == a);
        return int128(a);
    }

    // TODO
    function castToUint128(uint256 a) internal pure returns(uint128) {
        assert(uint128(a) == a);
        return uint128(a);
    }
}
