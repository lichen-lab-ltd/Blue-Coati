import {derived} from 'svelte/store';
import box from './3box.js';

const mapping = derived(box, ($box, set) => {
  if ($box.status == 'Ready') {
    set(map($box.bets));
  }
});

const map = function (_bets) {
  let _map = {};
  _bets.forEach((b) => {
    _map[b.message.postId]
      ? b.message.isValid
        ? (_map[b.message.postId]['isValid'] += 1)
        : (_map[b.message.postId]['notValid'] += 1)
      : b.message.isValid
      ? (_map[b.message.postId] = {isValid: 1, notValid: 0})
      : (_map[b.message.postId] = {isValid: 0, notValid: 1});
  });
  return _map;
};

export {map, mapping};
