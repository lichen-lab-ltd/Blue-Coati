pragma solidity 0.6.5;

import "buidler-deploy/solc_0.6/proxy/Proxied.sol";
import "@nomiclabs/buidler/console.sol";
import "./Deposit.sol";

contract Judgement is Proxied {
    function castJudgement(bytes32 documentId, bool accepted) external {
        require(msg.sender == _judge);
        require(_documents[documentId].judgementTime == 0, "ALREADY_DECIDED");
        _documents[documentId] = Document(uint64(block.timestamp), accepted);
    }

    function claimReward(
        bytes32 documentId,
        uint256 opositeBetId,
        uint256 betId,
        bool bet,
        bytes calldata sig
    ) external {
        require(_documents[documentId].judgementTime > 0, "JUDGEMENT_NOT_EXIST");
        require(uint64(block.timestamp) < _documents[documentId].judgementTime + _claimPeriod, "TOO_LATE");
        require(_betsCounted[documentId][betId] == false, "ALREADY_SUBMITED");
        // TODO
        _betsCounted[documentId][betId] = true;
    }

    // ////////////////// CONSTRUCTOR /////////////////////////////

    function postUpgrade(address judge, Deposit deposit) public proxied {
        _judge = judge;
        _deposit = deposit;
    }

    constructor(address judge, Deposit deposit) public {
        postUpgrade(judge, deposit);
    }

    // ///////////////////     DATA      //////////////////////////

    struct Document {
        uint64 judgementTime;
        bool result;
    }
    mapping(bytes32 => mapping(uint256 => bool)) _betsCounted;

    /*immutable (if no proxy)*/
    uint64 internal _claimPeriod = 7 days; // TODO constructor

    /*immutable (if no proxy)*/
    Deposit internal _deposit;
    address _judge;
    mapping(bytes32 => Document) _documents;
}
