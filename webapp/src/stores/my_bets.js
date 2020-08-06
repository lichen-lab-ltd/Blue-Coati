import {derived} from 'svelte/store';
import box from './3box';
import {countTree} from '../utils/bettree';

const userBets = derived(
  box,
  ($box, set) => {
    if ($box.status == 'Ready') {
      set(map($box));
    }
  },
  []
);

const map = function (box) {
  let bets = [];
  let user = box.spaceDID;
  for (const postId of Object.keys(box.betTrees)) {
    let initState = {postId, user, count: []};
    const countFunc = (bet, parent) => {
      if (parent) {
        if (bet.author == initState.user) {
          initState.count.push({postId: initState.postId, parent, bet});
        }
      }
    };
    let newBets = countTree(box.betTrees[postId], initState, countFunc).count;
    bets = [...bets, ...newBets];
  }
  return bets;
};

export {map, userBets};
