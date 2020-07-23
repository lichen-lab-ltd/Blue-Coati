import Box from '../3box.min.js';
import {writable} from 'svelte/store';
import {wallet} from '../stores/wallet';

let store;
let box = {status: 'Unavailable', box: {}, posts: [], bets: [], msg: ''};
store = {};

store.load = async function () {
  console.log('loading');
  box.status = 'Loading';
  store.set(box);
  if (!!wallet.address) {
    try {
      let _box = await Box.openBox(wallet.address, window.ethereum);
      let _space = await _box.openSpace('blue-coati-dev');
      let _posts = await _space.joinThread('other-coati', {
        firstModerator: wallet.address,
        member: false,
      });
      let _bets = await _space.joinThread('bets', {
        firstModerator: wallet.address,
        member: false,
      });
      box.status = 'Ready';
      box.box = _box;
      box.postsThread = _posts;
      box.betsThread = _bets;
      box.posts = await _posts.getPosts();
      box.bets = await _bets.getPosts();
    } catch (e) {
      console.log(e);
      box.status = 'Error';
      box.msg = e;
    }
  } else {
    box.status = 'Error';
    box.msg = 'Please connect to web3 wallet first';
  }
  store.set(box);
};

store.addPost = async function (_post) {
  console.log('adding');
  console.log(_post);
  try {
    // this returns postId if succeeds
    let postID = await box.postsThread.post(_post);
    console.log('success:', postID);
  } catch (e) {
    console.log(e);
  }
};

store.bet = async function (_isValid) {
  console.log('betting', _isValid);
};

const {set, subscribe} = writable(box);

store.set = set;
store.subscribe = subscribe;

export default store;
