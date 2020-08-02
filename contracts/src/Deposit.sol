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

    // TODO DAI ERC20 : 
    /*
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
    */

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
