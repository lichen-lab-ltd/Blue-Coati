import {derived} from 'svelte/store';
import box from './3box';
import {countTree} from '../utils/bettree';

const userBets = derived(box, ($box, set) => {
  if ($box.status == 'Ready') {
    set(map($box));
  }
});

const map = function (box) {
  let bets = 0;
  let user = box.spaceDID;
  for (const postId of Object.keys(box.betTrees)) {
    let initState = {user, count: 0};
    const countFunc = (bet, parent) => {
      if (parent) {
        if (bet.author == initState.user) {
          initState.count++;
        }
      }
    };
    bets += countTree(box.betTrees[postId], initState, countFunc).count;
  }
  return bets;
};

export {map, userBets};
