import {derived} from 'svelte/store';
import box from './3box';
import {countTree, findInTree} from '../utils/bettree';

const userBets = derived(box, ($box, set) => {
  if ($box.status == 'Ready') {
    set(map($box));
  }
});

const map = function (box) {
  let bets = [];
  let user = box.spaceDID;
  for (const postId of Object.keys(box.betTrees)) {
    let initState = {user, count: []};
    const countFunc = (bet, parent) => {
      if (parent) {
        if (bet.author == initState.user) {
          initState.count.push({postId: postId, bet});
        }
      }
    };
    let newBets = countTree(box.betTrees[postId], initState, countFunc).count;
    bets = [...bets, ...newBets];
  }
  return bets;
};

// This is for sumbmission
const findBet = function () {};

export {map, userBets};
