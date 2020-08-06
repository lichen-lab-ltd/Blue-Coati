import {keccak256} from '@ethersproject/solidity';
import {wallet} from '../stores/wallet';
import box from '../stores/3box';

const cast = async function (_isValid, _postId) {
  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    // bytes32 documentId,
    // uint256 losingBetId,
    // uint64 losingTimestamp,
    // bytes calldata losingsig,
    // uint256 winningBetId,
    // uint64 winningTimestamp,
    // uint256 parentBetId, // can be another losing bet // TODO chain it in a single call or can be 0 for document bet
    // bytes calldata winningSig

    let documentId = keccak256(['string'], [_postId]);
    await wallet.contracts.Judgement.recordLosingBet();
    if (!_isValid) {
      await box.deletePost(_postId);
    }
  } catch (e) {
    console.log(e);
  }
};

export default cast;
