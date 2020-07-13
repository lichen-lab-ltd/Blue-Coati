pragma solidity 0.6.5;

import "buidler-deploy/solc_0.6/proxy/Proxied.sol";
import "@nomiclabs/buidler/console.sol";

contract Deposit is Proxied {

    event DepositReceived(address indexed from, uint256 amount);
    
    function deposit(uint256 amount) external {
        _deposits[msg.sender] = amount; // TODO
        emit DepositReceived(msg.sender, amount);
    }


    // ////////////////// CONSTRUCTOR /////////////////////////////

    function postUpgrade(address token) public proxied {
        _token = token;
    }

    constructor(address token) public {
        postUpgrade(token);
    }

    // ///////////////////     DATA      //////////////////////////

    address internal _token;
    mapping(address => uint256) internal _deposits;
}
