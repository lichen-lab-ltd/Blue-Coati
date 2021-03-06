import {keccak256} from '@ethersproject/solidity';
import {wallet} from '../stores/wallet';
import {BigNumber} from '@ethersproject/bignumber';

const record = async function (_postId, _bet) {
  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    console.log('post:::: ', _postId);
    let documentId = keccak256(['string'], [_postId]);
    let losingBet = _bet.children[0];
    console.log(documentId);
    console.log(losingBet.id);
    console.log(losingBet.timestamp);
    console.log(losingBet.signature);

    // bytes32 documentId,
    // uint256 losingBetId,
    // uint64 losingTimestamp,
    // bytes calldata losingsig,
    // uint256 winningBetId,
    // uint64 winningTimestamp,
    // uint256 parentBetId, // can be another losing bet // TODO chain it in a single call or can be 0 for document bet
    // bytes calldata winningSig

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
