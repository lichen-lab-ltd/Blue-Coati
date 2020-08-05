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

    function appeal(bytes32 documentId, bool accepted) external {
        // TODO
        // require(msg.sender == _court);
        // require(_documents[documentId].judgementTime != 0, "NEVER_DECIDED");
        // bool currentResult = _documents[documentId].result;
        // require(currentResult != accepted, "APPEAL_IN_FAVOR");
        // _documents[documentId].result = accepted;
    }

    function recordLosingBet(
        bytes32 documentId,
        uint256 losingBetId,
        uint64 losingTimestamp,
        bytes calldata losingsig,
        uint256 winningBetId,
        uint64 winningTimestamp,
        uint256 parentBetId, // can be another losing bet // TODO chain it in a single call or can be 0 for document bet
        bytes calldata winningSig
    ) external {
        require(_documents[documentId].judgementTime > 0, "JUDGEMENT_DOESNT_EXIST");
        require(uint64(block.timestamp) < _documents[documentId].judgementTime + _claimPeriod, "TOO_LATE");
        require(_betsCounted[documentId][losingBetId] == false, "ALREADY_SUBMITED");

        bool result = _documents[documentId].result;

        _betsCounted[documentId][losingBetId] = true;

        address loser = _recover(documentId, losingBetId, winningBetId, !result, losingTimestamp, losingsig);

        if (winningBetId == 0) {
            address winner = _recover(documentId, winningBetId, parentBetId, result, winningTimestamp, winningSig);
            _deposit.transferFrom(loser, winner, _betAmount);
        } else {
            _deposit.transferFrom(loser, address(this), _betAmount);
        }
    }

    // ////////////////// INTERNAL ////////////////////////////////

    function _recover(
        bytes32 documentId,
        uint256 id,
        uint256 parentId,
        bool isValid,
        uint64 timestamp,
        bytes memory signature
    ) internal pure returns (address) {
        bytes memory dataToHash = _encodeMessage(documentId, id, parentId, isValid, timestamp);
        return SigUtil.recover(keccak256(dataToHash), signature);
    }

    // function _isValidChainId(uint256 chainId) internal view returns (bool) {
    //     uint256 _chainId;
    //     assembly {
    //         _chainId := chainid()
    //     }
    //     return chainId == _chainId;
    // }

    bytes32 constant EIP712DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version)");
    bytes32 constant DOMAIN_SEPARATOR = keccak256(
        abi.encode(EIP712DOMAIN_TYPEHASH, keccak256("Judgement")) // TODO chainId : , keccak256("1"))
    );

    bytes32 constant BET_TYPEHASH = keccak256(
        "Bet(bytes32 documentId,uint256 id,uint256 parentId,string isValid,uint64 timestamp)" // isValid: bool (metamask issue)
    );

    function _encodeMessage(
        bytes32 documentId,
        uint256 id,
        uint256 parentId,
        bool isValid,
        uint64 timestamp
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(BET_TYPEHASH, documentId, id, parentId, isValid ? "true" : "false", timestamp))
            );
    }

    // /////////////////// DATA //////////////////////////

    struct Document {
        uint64 judgementTime;
        bool result;
    }
    mapping(bytes32 => mapping(uint256 => bool)) internal _betsCounted;

    /*TODO immutable (if no proxy)*/
    uint64 internal _claimPeriod;
    /*TODO immutable (if no proxy)*/
    uint96 internal _betAmount = 1;

    /*TODO immutable (if no proxy)*/
    Deposit internal _deposit;
    address internal _judge;
    mapping(bytes32 => Document) internal _documents;

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
}
