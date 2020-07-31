import Box from '../3box.min.js';
import {writable} from 'svelte/store';
import {wallet} from './wallet';
import {map} from './postBetsMapping.js';
import local from '../utils/local';

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
    let postId = await box.postsThread.post(_post);
    store.bet(true, postId);
  } catch (e) {
    console.log(e);
  }
};

store.bet = async function (_isValid, _postId) {
  if (box.status != 'Ready') {
    await store.load();
  }
  local.get('blue-coati-dev-bets');
  let localData = local.data;
  let bet = {
    postId: _postId,
    isValid: _isValid,
  };
  let betId = await box.betsThread.post(bet);
  if (localData) {
    if (localData[box.box.DID]) {
      localData[box.box.DID][betId] = bet;
    } else {
      localData[box.box.DID] = {[betId]: bet};
    }
    local.write('blue-coati-dev-bets', localData);
  } else {
    console.log('no local');
    let newLB = {[box.box.DID]: {[betId]: bet}};
    local.write('blue-coati-dev-bets', newLB);
  }
};

store.deleteAllBets = async function () {
  if (box.status != 'Ready') {
    await store.load();
  }
  try {
    box.bets.forEach(async (b) => {
      await box.betsThread.deletePost(b.postId);
    });
    local.write('blue-coati-dev-bets', '');
  } catch (e) {
    console.log(e);
  }
};

store.staticInit = async function () {
  let init_data = {posts: [], bets: []};
  init_data.posts = await Box.getThreadByAddress(
    '/orbitdb/zdpuAqAGkAzxibXccbKHKev5pKZcPKsaFAQD6upFofjF658Vt/3box.thread.blue-coati-dev.other-coati'
  );
  init_data.bets = await Box.getThreadByAddress(
    '/orbitdb/zdpuAyirKfdqFE3mnqCho4AXv43HTkouXp4iwxjGWnmQSdXDa/3box.thread.blue-coati-dev.bets'
  );
  init_data.mapping = map(init_data.bets);
  console.log('init: ', init_data);
  return init_data;
};

const {set, subscribe} = writable(box);

store.set = set;
store.subscribe = subscribe;

export default store;
