import {derived} from 'svelte/store';
import {keccak256} from '@ethersproject/solidity';

import mod from './moderation';
import box from './3box';
let docMap = {};
let postIdMap = {};

const map = derived(
  [box, mod],
  ([$box, $mod], set) => {
    if ($box.status == 'Ready') {
      mod.listen(); // checked if listening in store
      if ($mod.status == 'Ready') {
        for (let j of $mod.data.judgements) {
          docMap[j.id] = j;
        }
        for (let post of $box.posts) {
          let documentId = keccak256(['string'], [post.postId]);
          if (docMap[documentId]) {
            postIdMap[post.postId] = docMap[documentId];
          }
        }
        set(postIdMap);
      }
    }
  },
  []
);

export default map;
