import {graphqlStore} from '../utils/graphql';
export default graphqlStore(
  `
  subscription {
    judgements{
      id
      accepted
      timestamp
    }
  }
`
);
