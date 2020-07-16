import Box from '../3box.min.js';
import {writable} from 'svelte/store';
import {wallet} from '../stores/wallet';

let store;
let box = {status: 'Unavailable', box: {}, space: {}, msg: ''};
store = {};

store.load = async function () {
  try {
    let _box = await Box.openBox(wallet.address, window.ethereum);
    let _space = await box.openSpace('blue-coati-dev');
    box.status = 'Ready';
    box.box = _box;
    box.space = _space;
  } catch (e) {
    box.status = 'Error';
    box.msg = e;
  }
  store.set(box);
};

const {set, subscribe} = writable(box);

store.set = set;
store.subscribe = subscribe;

export default store;
