import {derived} from 'svelte/store';
import {graphqlStore} from '../utils/graphql';

let lastAddress;
let endSubscription;
export default derived(
  wallet,
  ($wallet, set) => {
    if ($wallet.address != lastAddress) {
      if (endSubscription) {
        endSubscription();
      }
      if (!$wallet.address) {
        set({
          status: 'Disconnected',
        });
      } else {
        endSubscription = graphqlStore(
          `
      subscription {
        userDeposit(id: ) {
          id
          amount
        }
      }
    `,
          'userDeposit'
        ).subscribe((userDeposit) => {
          set({
            status: 'Ready',
            amount: userDeposit.amount,
          });
        });
      }
    }
  },
  {
    status: 'Disconnected',
  }
);
