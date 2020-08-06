import {keccak256} from '@ethersproject/solidity';
import {wallet} from '../stores/wallet';
import box from '../stores/3box';

const record = async function (_postId, _bet) {
  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    console.log(_bet);
    console.log(_bet.children[0]); // losing bet
    // bytes32 documentId,
    // uint256 losingBetId,
    // uint64 losingTimestamp,
    // bytes calldata losingsig,
    // uint256 winningBetId,
    // uint64 winningTimestamp,
    // uint256 parentBetId, // can be another losing bet // TODO chain it in a single call or can be 0 for document bet
    // bytes calldata winningSig
    let documentId = keccak256(['string'], [_postId]);
    let losingBet = _bet.children[0];
    await wallet.contracts.Judgement.recordLosingBet(
      documentId,
      losingBet.id,
      losingBet.timestamp,
      losingBet.signature,
      _bet.id,
      _bet.timestamp,
      '0',
      _bet.signature
    );
  } catch (e) {
    console.log(e);
  }
};

export default record;
