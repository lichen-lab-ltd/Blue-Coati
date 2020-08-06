import {graphqlStore} from '../utils/graphql';
export default graphqlStore(
  `
  subscription {
    judgement{
      id
      accepted
      timestamp
    }
  }
`,
  'judgement'
);
