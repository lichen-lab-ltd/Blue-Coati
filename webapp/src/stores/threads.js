import {writable} from 'svelte/store';

// TODO: maybe this can be stored in the blue-coati-threads
const $data = [
  {
    title: 'Strawberries growing',
    description: 'group of peopel interested in this topic',
    tags: ['farm', 'berries'],
    addr: 'blue-coati-dev-123123',
  },
  {
    title: 'Chicken growing',
    description: 'group of peopel interested in this topic',
    tags: ['farm', 'chicken'],
    addr: 'blue-coati-dev-23423342',
  },
  {
    title: 'Strawberries eating',
    description: 'group of peopel interested in this topic',
    tags: ['farm', 'dining'],
    addr: 'blue-coati-dev-897832',
  },
];
const {subscribe, set} = writable($data);

export default {subscribe};
