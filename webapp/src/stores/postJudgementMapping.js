import {derived} from 'svelte/store';
import {keccak256} from '@ethersproject/solidity';

import mod from './moderation';
import box from './3box';
let docMap = {};
let postIdMap = {};

mod.listen(); // checked if listening in store
const map = derived(
  [box, mod],
  ([$box, $mod], set) => {
    if ($box.status == 'Ready') {
      if ($mod.status == 'Ready') {
        for (let j of $mod.data.judgements) {
          docMap[j.id] = j;
        }
        for (const postId of Object.keys($box.betTrees)) {
          let documentId = keccak256(['string'], [postId]);

          if (docMap[documentId]) {
            postIdMap[postId] = docMap[documentId];
          }
        }
        set(postIdMap);
      }
    }
  },
  []
);

export default map;
