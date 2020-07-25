import {derived} from 'svelte/store';
import {subscription} from '../utils/graphql/subscription.js';

let lastAddress;
let endSubscription;
export default derived(
  wallet,
  async ($wallet, set) => {
    if ($wallet.address != lastAddress) {
      if (endSubscription) {
        endSubscription();
      }
      if (!$wallet.address) {
        set({
          status: 'Disconnected',
        });
      } else {
        subscription({
          query: `
          subscription userDeposit($userAddress: String) {
            userDeposit(id: $userAddress) {
              id
              amount
            }
          }
        `,
          variables: {
            userAddress: $wallet.address,
          },
        }).subscribe((r) => {
          set(r);
        });
      }
    }
  },
  {
    status: 'Disconnected',
  }
);
