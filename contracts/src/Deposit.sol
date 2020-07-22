pragma solidity 0.6.5;

import "buidler-deploy/solc_0.6/proxy/Proxied.sol";
import "@nomiclabs/buidler/console.sol";
import "./Libraries/SafeMath.sol";

contract Deposit is Proxied {
    using SafeMath for uint256;

    event DepositReceived(address indexed from, uint256 amount);

    // TODO ERC20 ?
    event Transfer(address indexed from, address indexed to, uint256 amount);

    function deposit(uint256 amount) external {
        require(_controller != address(0), "NOT_READY");
        _deposits[msg.sender].amount = _deposits[msg.sender].amount.add(amount);
        emit DepositReceived(msg.sender, amount);
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
        _deposits[to].amount = _deposits[to].amount.add(amount);
        emit Transfer(from, to, amount);
    }

    // ////////////////// CONSTRUCTOR /////////////////////////////

    function postUpgrade(address token) public proxied {
        _token = token;
    }

    constructor(address token) public {
        postUpgrade(token);
    }

    // ///////////////////     DATA      //////////////////////////

    struct DepositInfo {
        uint256 amount; // TODO optimize it to 128 bit ?
        uint64 withdrawalRequestTime; // TODO
    }

    /*TODO immutable (if no proxy)*/
    address internal _token;

    address internal _controller;
    mapping(address => DepositInfo) internal _deposits;
}
