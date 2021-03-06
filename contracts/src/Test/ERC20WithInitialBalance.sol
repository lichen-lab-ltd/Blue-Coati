pragma solidity 0.6.5;

import "./BaseERC20.sol";
import "../Interfaces/ERC20With2612.sol";

contract ERC20WithInitialBalance is BaseERC20, ERC20With2612 {
    // TODO inject actual hash or use 0.6.12
    bytes32 internal constant PERMIT_TYPEHASH = keccak256(
        "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
    );

    function DOMAIN_SEPARATOR() external override view returns (bytes32) {
        return _DOMAIN_SEPARATOR;
    }

    function nonces(address owner) external override view returns (uint256) {
        return _nonces[owner];
    }

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override {
        require(owner != address(0), "INVALID_ZERO_ADDRESS");

        uint256 currentNonce = _nonces[owner];
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                _DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, currentNonce, deadline))
            )
        );
        require(owner == ecrecover(digest, v, r, s), "INVALID_SIGNATURE");
        require(deadline == 0 || block.timestamp <= deadline, "TOO_LATE");

        _nonces[owner] = currentNonce + 1;
        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    // /////////////////////////////////// STORAGE SLOTS /////////////////////////////////////////

    /*immutable*/
    bytes32 internal _DOMAIN_SEPARATOR;
    mapping(address => uint256) internal _nonces;

    // //////////////////////////////////// CONSTRUCTOR ///////////////////////////////////////////

    constructor(uint256 supply, uint256 initialIndividualSupply) public BaseERC20(supply, initialIndividualSupply) {
        // TODO chainId
        _DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes("1")),
                address(this)
            )
        );
    }
}
