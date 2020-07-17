import Box from '../3box.min.js';
import {writable} from 'svelte/store';
import {wallet} from '../stores/wallet';

let store;
let box = {status: 'Unavailable', box: {}, space: {}, msg: ''};
store = {};

store.load = async function () {
  box.status = 'Loading';
  store.set(box);
  if (!!wallet.address) {
    console.log('loading');
    try {
      let _box = await Box.openBox(wallet.address, window.ethereum);
      let _space = await _box.openSpace('blue-coati-dev');
      box.status = 'Ready';
      box.box = _box;
      box.space = _space;
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

const {set, subscribe} = writable(box);

store.set = set;
store.subscribe = subscribe;

export default store;
