import {derived} from 'svelte/store';
import box from './3box.js';

const mapping = derived(box, ($box, set) => {
  if ($box.status == 'Ready') {
    set(map($box.betTrees));
  }
});

export {mapping};
