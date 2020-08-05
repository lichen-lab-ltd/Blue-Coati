import {keccak256} from '@ethersproject/solidity';
import {wallet} from '../stores/wallet';
import box from '../stores/3box';

const cast = async function (_isValid, _postId) {
  console.log('casting', _isValid, _postId);
  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    let b = keccak256(['string'], [_postId]);
    await wallet.contracts.Judgement.castJudgement(b, _isValid);
    if (!_isValid) {
      await box.deletePost(_postId);
    }
  } catch (e) {
    console.log(e);
  }
};

export default cast;
