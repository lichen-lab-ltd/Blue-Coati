pragma solidity 0.6.5;

import "buidler-deploy/solc_0.6/proxy/Proxied.sol";
import "@nomiclabs/buidler/console.sol";
import "./Deposit.sol";
import "./Libraries/SigUtil.sol";

contract Judgement is Proxied {
    function castJudgement(bytes32 documentId, bool accepted) external {
        require(msg.sender == _judge);
        require(_documents[documentId].judgementTime == 0, "ALREADY_DECIDED");
        _documents[documentId] = Document(uint64(block.timestamp), accepted);
    }

    function recordLosingBet(
        bytes32 documentId,
        uint256 losingBetId,
        bytes calldata losingsig,
        uint256 winningBetId,
        uint256 parentBetId, // can be another losing bet // TODO chain it in a single call or can be 0 for document bet
        bytes calldata winningSig
    ) external {
        require(_documents[documentId].judgementTime > 0, "JUDGEMENT_DOESNT_EXIST");
        require(uint64(block.timestamp) < _documents[documentId].judgementTime + _claimPeriod, "TOO_LATE");
        require(_betsCounted[documentId][losingBetId] == false, "ALREADY_SUBMITED");

        bool result = _documents[documentId].result;

        _betsCounted[documentId][losingBetId] = true;

        address loser = SigUtil.recover(
            keccak256(abi.encode(documentId, losingBetId, winningBetId, !result)),
            losingsig
        );

        if (winningBetId == 0) {
            address winner = SigUtil.recover(
                keccak256(abi.encode(documentId, winningBetId, parentBetId, result)),
                winningSig
            );
            _deposit.transferFrom(loser, winner, _betAmount);
        } else {
            _deposit.transferFrom(loser, address(this), _betAmount);
        }
    }

    // ////////////////// CONSTRUCTOR /////////////////////////////

    function postUpgrade(
        address judge,
        Deposit deposit,
        uint64 claimPeriod,
        uint64 betAmount
    ) public proxied {
        _judge = judge;
        _deposit = deposit;
        _deposit.takeControl();
        _claimPeriod = claimPeriod;
        _betAmount = betAmount;
    }

    // TODO : post development
    // constructor(address judge, Deposit deposit) public {
    //     postUpgrade(judge, deposit);
    // }

    // ///////////////////     DATA      //////////////////////////

    struct Document {
        uint64 judgementTime;
        bool result;
    }
    mapping(bytes32 => mapping(uint256 => bool)) _betsCounted;

    /*TODO immutable (if no proxy)*/
    uint64 internal _claimPeriod;
    /*TODO immutable (if no proxy)*/
    uint96 internal _betAmount = 1;

    /*TODO immutable (if no proxy)*/
    Deposit internal _deposit;
    address _judge;
    mapping(bytes32 => Document) _documents;
}
