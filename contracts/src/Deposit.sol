pragma solidity 0.6.5;

import "buidler-deploy/solc_0.6/proxy/Proxied.sol";
import "@nomiclabs/buidler/console.sol";
import "./Libraries/SafeMath.sol";
import "./Interfaces/ERC20With2612.sol";
import "./Interfaces/DAIERC20.sol";

contract Deposit is Proxied {
    using SafeMath for uint256;

    event DepositReceived(address indexed from, uint256 amount);
    event DepositWithdrew(address indexed to, uint256 amount);
    event WithdrawalRequested(address indexed user, uint64 time);
    event Transfer(address indexed from, address indexed to, uint256 amount);

    function deposit() external payable {
        require(_controller != address(0), "NOT_READY");
        deposits[msg.sender].amount = deposits[msg.sender].amount.add(msg.value);
        emit DepositReceived(msg.sender, msg.value);
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
        deposits[from].amount = deposits[from].amount.sub(amount);
        deposits[to].amount = deposits[to].amount.add(amount);
        emit Transfer(from, to, amount);
    }

    function withdrawRequest() external {
        require(deposits[msg.sender].withdrawalRequestTime == 0, "ALREADY REQUESTED");
        deposits[msg.sender].withdrawalRequestTime = uint64(block.timestamp);
        emit WithdrawalRequested(msg.sender, deposits[msg.sender].withdrawalRequestTime);
    }

    function withdrawDeposit() external {
        require(
            uint64(block.timestamp) >= (deposits[msg.sender].withdrawalRequestTime + _unlockingTime),
            "NOT READY TO BE UNLOCKED"
        );
        require(deposits[msg.sender].amount > 0, "NO DEPOSITS");
        require(address(this).balance >= deposits[msg.sender].amount, "INSUFFICIENT BALANCE");
        uint256 amount = deposits[msg.sender].amount;
        deposits[msg.sender].amount = deposits[msg.sender].amount.sub(amount);
        deposits[msg.sender].withdrawalRequestTime = 0;
        msg.sender.transfer(amount);
        emit DepositWithdrew(msg.sender, amount);
    }

    // ////////////////// CONSTRUCTOR /////////////////////////////

    function postUpgrade(uint64 unlockingTime) public proxied {
        _unlockingTime = unlockingTime;
    }

    // ///////////////////     DATA      //////////////////////////

    struct DepositInfo {
        uint256 amount; // TODO optimize it to 128 bit ?
        uint64 withdrawalRequestTime; // TODO
    }
    uint64 internal _unlockingTime;
    address internal _controller;
    mapping(address => DepositInfo) public deposits;
}
