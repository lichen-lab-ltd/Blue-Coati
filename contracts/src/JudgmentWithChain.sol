pragma solidity 0.6.5;
pragma experimental ABIEncoderV2;

import "./Judgement.sol";

contract JudgementWithChain is Judgement {
    struct Pair {
        uint256 losingBetId;
        uint64 losingTimestamp;
        bytes losingsig;
        uint256 winningBetId;
        uint64 winningTimestamp;
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

        address expectedLoser = address(uint160(pair.losingBetId >> 96));
        address loser = _recover(
            documentId,
            pair.losingBetId,
            pair.winningBetId,
            !result,
            pair.losingTimestamp,
            pair.losingsig
        );
        require(expectedLoser == loser, "INVALID_LOSER_SIGNATURE");
        emit BetSubmitted(documentId, loser, pair.losingBetId);

        if (pair.winningBetId != 0 && _betsCounted[documentId][pair.winningBetId]) {
            _betsCounted[documentId][pair.winningBetId] = true; // Can get reward only once
            address expectedWinner = address(uint160(pair.winningBetId >> 96));
            address winner = _recover(
                documentId,
                pair.winningBetId,
                pair.parentBetId,
                result,
                pair.winningTimestamp,
                pair.winningSig
            );
            require(expectedWinner == winner, "INVALID_WINNER_SIGNATURE");
            _deposit.transferFrom(loser, winner, _betAmount);
            emit BetSubmitted(documentId, winner, pair.winningBetId);
        } else {
            _deposit.transferFrom(loser, address(this), _betAmount);
        }
    }
}
