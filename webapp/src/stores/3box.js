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

  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    let _box = await Box.openBox(wallet.address, window.ethereum);
    let _space = await _box.openSpace('blue-coati-dev');
    let _posts = await _space.joinThreadByAddress(
      '/orbitdb/zdpuAqAGkAzxibXccbKHKev5pKZcPKsaFAQD6upFofjF658Vt/3box.thread.blue-coati-dev.other-coati'
    );
    let _bets = await _space.joinThreadByAddress(
      '/orbitdb/zdpuAyirKfdqFE3mnqCho4AXv43HTkouXp4iwxjGWnmQSdXDa/3box.thread.blue-coati-dev.bets'
    );
    _posts.onUpdate(async () => {
      box.posts = await _posts.getPosts();
      store.set(box);
    });
    _bets.onUpdate(async () => {
      box.bets = await _bets.getPosts();
      store.set(box);
    });

    box.box = _box;
    box.postsThread = _posts;
    box.betsThread = _bets;
    box.posts = await _posts.getPosts();
    box.bets = await _bets.getPosts();
    box.status = 'Ready';
  } catch (e) {
    console.log(e);
    box.status = 'Error';
    box.msg = e;
  }
  store.set(box);
};

store.addPost = async function (_post) {
  if (box.status != 'Ready') {
    await store.load();
  }
  try {
    // this returns postId if succeeds
    let postID = await box.postsThread.post(_post);
    // TODO Bet
  } catch (e) {
    console.log(e);
  }
};

store.bet = async function (_isValid, _postId) {
  if (box.status != 'Ready') {
    store.load();
  }
  console.log('betting', _isValid);
};

store.staticInit = async () => {
  let init_data = {posts: [], bets: []};
  init_data.posts = await Box.getThreadByAddress(
    '/orbitdb/zdpuAqAGkAzxibXccbKHKev5pKZcPKsaFAQD6upFofjF658Vt/3box.thread.blue-coati-dev.other-coati'
  );
  init_data.bets = await Box.getThreadByAddress(
    '/orbitdb/zdpuAyirKfdqFE3mnqCho4AXv43HTkouXp4iwxjGWnmQSdXDa/3box.thread.blue-coati-dev.bets'
  );
  return init_data;
};

const {set, subscribe} = writable(box);

store.set = set;
store.subscribe = subscribe;

export default store;
