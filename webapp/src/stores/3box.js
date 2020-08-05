import Box from '../3box.min.js';
import {writable} from 'svelte/store';
import {wallet} from './wallet';
import {map} from './postBetsMapping.js';
import local from '../utils/local';
import {betSigner} from '../utils/eip712';
import {generateBetTree, getFreestParent, insertInTree} from '../utils/bettree';
import {keccak256} from '@ethersproject/solidity';
import {BigNumber} from '@ethersproject/bignumber';

let init_data = {init: false, posts: [], bets: [], betTrees: {}};
let store;
let box = {
  status: 'Unavailable',
  box: {},
  posts: [],
  bets: [],
  msg: '',
  betTrees: {},
};
store = {};

function transformBox(box) {
  const bets = box.bets;
  for (let i = 0; i < bets.length; i++) {
    if (bets[i].message.version !== 1) {
      // bets.splice(i, 1); // TODO ?
    }
  }
  for (const post of box.posts) {
    const betTree = generateBetTree(post.postId, box.bets);
    if (betTree) {
      box.betTrees[post.postId] = betTree;
    }
  }
}

store.load = async function () {
  if (box.status == 'Ready') {
    return;
  }
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
      transformBox(box);
      store.set(box);
    });
    _bets.onUpdate(async () => {
      box.bets = await _bets.getPosts();
      transformBox(box);
      store.set(box);
    });

    box.box = _box;
    box.spaceDID = _space.DID;
    box.profile = await _box.public.all();
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
  transformBox(box);
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

  const betTree = box.betTrees[_postId] || {
    postId: _postId,
    id: '0',
    children: [],
  };
  const parent = getFreestParent(betTree, _isValid);

  const incrementId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // TODO increment
  const id = BigNumber.from(2)
    .pow(96)
    .mul(wallet.address)
    .add(incrementId)
    .toString();
  const message = {
    documentId: keccak256(['string'], [_postId]),
    id,
    parentId: parent.id || '0',
    isValid: _isValid ? 'true' : 'false',
    timestamp: Math.floor(Date.now() / 1000),
  };
  const signature = await wallet.provider.send('eth_signTypedData_v4', [
    wallet.address,
    betSigner.construct(message),
  ]);

  const newBetTree = insertInTree(betTree, parent, id, _isValid, signature);

  let betId = await box.betsThread.post(newBetTree);
  if (localData) {
    if (localData[box.box.DID]) {
      localData[box.box.DID][betId] = newBetTree;
    } else {
      localData[box.box.DID] = {[betId]: newBetTree};
    }
    local.write('blue-coati-dev-bets', localData);
  } else {
    console.log('no local');
    let newLB = {[box.box.DID]: {[betId]: newBetTree}};
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
  if (init_data.init) {
    return init_data;
  }
  let _posts = await Box.getThreadByAddress(
    '/orbitdb/zdpuAqAGkAzxibXccbKHKev5pKZcPKsaFAQD6upFofjF658Vt/3box.thread.blue-coati-dev.other-coati'
  );
  init_data.posts = _posts.reverse(); // this is not cloned
  init_data.bets = await Box.getThreadByAddress(
    '/orbitdb/zdpuAyirKfdqFE3mnqCho4AXv43HTkouXp4iwxjGWnmQSdXDa/3box.thread.blue-coati-dev.bets'
  );
  transformBox(init_data);
  init_data.mapping = map(init_data.betTrees);
  init_data.init = true;
  return init_data;
};

const {set, subscribe} = writable(box);

store.set = set;
store.subscribe = subscribe;

export default store;
