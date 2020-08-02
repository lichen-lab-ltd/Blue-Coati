pragma solidity 0.6.5;

import "buidler-deploy/solc_0.6/proxy/Proxied.sol";
import "@nomiclabs/buidler/console.sol";
import "./Libraries/SafeMath.sol";
import "./Interfaces/ERC20With2612.sol";
import "./Interfaces/DAIERC20.sol";

contract Deposit is Proxied {
    using SafeMath for uint256;

    event DepositReceived(address indexed from, uint256 amount);

    // TODO ERC20 ?
    event Transfer(address indexed from, address indexed to, uint256 amount);

    function deposit(uint256 amount) external {
        _deposit(msg.sender, amount);
    }

    function depositViaPermit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        _token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        _deposit(msg.sender, amount);
    }

    function depositViaDAIPermit(
        uint256 amount,
        uint256 nonce,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        DAIERC20 dai = DAIERC20(address(_token));
        dai.permit(msg.sender, address(this), nonce, deadline, true, v, r, s);
        _deposit(msg.sender, amount);
    }

    function _deposit(address from, uint256 amount) internal {
        require(_controller != address(0), "NOT_READY");
        require(_token.transferFrom(from, address(this), amount), "TRANSFER_FAILED");
        _deposits[from].amount = _deposits[from].amount.add(amount);
        emit DepositReceived(from, amount);
    }

    function takeControl() external {
        require(_controller == address(0) || msg.sender == _controller, "ALREADY_CONTROLLED");
        _controller = msg.sender;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external {
        require(msg.sender == _controller, "NOT_AUTHORIZED");
        _deposits[from].amount = _deposits[from].amount.sub(amount);
        require(_token.transferFrom(address(this), to, amount), "TRANSFER_FAILED"); // work only on safe ERC20 token (no callback)
        emit Transfer(from, to, amount);
    }

    // ////////////////// CONSTRUCTOR /////////////////////////////

    function postUpgrade(ERC20With2612 token) public proxied {
        _token = token;
    }

    constructor(ERC20With2612 token) public {
        postUpgrade(token);
    }

    // ///////////////////     DATA      //////////////////////////

    struct DepositInfo {
        uint256 amount; // TODO optimize it to 128 bit ?
        uint64 withdrawalRequestTime; // TODO
    }

    /*TODO immutable (if no proxy)*/
    ERC20With2612 internal _token;

    address internal _controller;
    mapping(address => DepositInfo) internal _deposits;
}
