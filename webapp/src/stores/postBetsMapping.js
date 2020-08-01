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
    let initCounts = {isValidCount: 0, isInvalidCount: 0};
    const countFunc = (bet, parent) => {
      if (parent) {
        if (bet.isValid) {
          initCounts.isValidCount++;
        } else {
          initCounts.isInvalidCount++;
        }
      }
    };
    counts[postId] = countTree(betTrees[postId], initCounts, countFunc);
  }
  return counts;
};

export {map, mapping};
