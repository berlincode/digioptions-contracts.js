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
}
