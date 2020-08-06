import {graphqlStore} from '../utils/graphql';
export default graphqlStore(
  `
  subscription {
    betRecordeds{
      id
      documentId
      betId
      bettor
      timestamp
    }
  }
`
);
