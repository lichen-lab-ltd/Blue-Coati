import {derived} from 'svelte/store';
import box from './3box.js';
import {countTree} from '../utils/bettree';

const mapping = derived(box, ($box, set) => {
  if ($box.status == 'Ready') {
    set(map($box.betTrees));
  }
});

const map = function (betTrees) {
  const counts = {};
  for (const postId of Object.keys(betTrees)) {
    counts[postId] = countTree(betTrees[postId]);
  }

  return counts;
};

export {map, mapping};
