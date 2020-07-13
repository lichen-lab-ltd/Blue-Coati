import {graphqlStore} from '../utils/graphql';
export default graphqlStore(
  `
  subscription {
    userDeposits(first: 5) {
      id
      amount
    }
  }
`,
  'userDeposits'
);
