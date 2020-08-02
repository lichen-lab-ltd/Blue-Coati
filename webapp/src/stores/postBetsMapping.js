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
      let numValid = 0;
      let numValidOpposed = 0;
      let numInvalid = 0;
      let numInvalidOpposed = 0;
      if (bet.children) {
        for (const childBet of bet.children) {
          if (childBet.isValid) {
            numValid++;
            if (childBet.children && childBet.children.length > 0) {
              numValidOpposed++;
            }
          } else {
            numInvalid++;
            if (childBet.children && childBet.children.length > 0) {
              numInvalidOpposed++;
            }
          }
        }
      }
      function countUnopposed(count) {
        if (count === 0) {
          return 0;
        }
        if (count === 1) {
          return 1;
        }
        if (count === 2) {
          return 1.75;
        }
        if (count === 3) {
          return 2.25;
        }
        return 2.5;
      }
      initCounts.isValidCount +=
        numValidOpposed + countUnopposed(numValid - numValidOpposed);

      initCounts.isInvalidCount +=
        numInvalidOpposed + countUnopposed(numInvalid - numInvalidOpposed);
    };
    counts[postId] = countTree(betTrees[postId], initCounts, countFunc);
  }
  return counts;
};

export {map, mapping};
