import {writable} from 'svelte/store';
import {LoremIpsum} from 'lorem-ipsum';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const $data = [];
for (let i = 0; i < 10; i++) {
  $data.push({
    content: lorem.generateSentences(5),
  });
}
const {subscribe, set} = writable($data);

export default {subscribe};
