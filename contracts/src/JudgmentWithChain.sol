pragma solidity 0.6.5;
pragma experimental ABIEncoderV2;

import "./Judgement.sol";

contract JudgementWithChain is Judgement {
    struct Pair {
        uint256 losingBetId;
        bytes losingsig;
        uint256 winningBetId;
        bytes winningSig;
        uint256 parentBetId;
    }

    function recordBetChain(bytes32 documentId, Pair[] memory pairs) public {
        // public for ABIEncoderv2
        require(_documents[documentId].judgementTime > 0, "JUDGEMENT_DOESNT_EXIST");
        require(uint64(block.timestamp) < _documents[documentId].judgementTime + _claimPeriod, "TOO_LATE");
        bool result = _documents[documentId].result;

        for (uint256 i = 0; i < pairs.length; i++) {
            _recordPair(documentId, result, pairs[i]);
        }
    }

    function _recordPair(
        bytes32 documentId,
        bool result,
        Pair memory pair
    ) internal {
        require(_betsCounted[documentId][pair.losingBetId] == false, "ALREADY_SUBMITED");
        _betsCounted[documentId][pair.losingBetId] = true;

        address loser = SigUtil.recover(
            keccak256(abi.encode(documentId, pair.losingBetId, pair.winningBetId, !result)),
            pair.losingsig
        );

        if (pair.winningBetId == 0) {
            address winner = SigUtil.recover(
                keccak256(abi.encode(documentId, pair.winningBetId, pair.parentBetId, result)),
                pair.winningSig
            );
            _deposit.transferFrom(loser, winner, BET_AMOUNT); // TODO optimize input to be in address order ?
        } else {
            _deposit.transferFrom(loser, address(this), BET_AMOUNT); // TODO optimize out of loop
        }
    }
}
