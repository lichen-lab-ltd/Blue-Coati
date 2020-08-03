import {derived} from 'svelte/store';
import {subscription} from '../utils/graphql/subscription.js';
import {wallet, builtin, chain, transactions, balance} from './wallet';
import box from './3box';
import {BigNumber} from '@ethersproject/bignumber';

let lastAddress;
let endSubscription;
let userDeposit = {};
userDeposit.store = derived(
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
              withdrawalTime
            }
          }
        `,
          variables: {
            userAddress: $wallet.address.toLowerCase(),
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

userDeposit.add = async function () {
  if (box.status != 'Ready') {
    await box.load();
  }
  try {
    // 0.05 ETH per deposit
    let amountEth = BigNumber.from(5).mul(BigNumber.from(10).pow(16));
    console.log(amountEth);
    await wallet.contracts.Deposit.deposit({value: amountEth});
  } catch (e) {
    console.log(e);
  }
};
userDeposit.withdrawRequest = async function () {
  if (box.status != 'Ready') {
    await box.load();
  }
  try {
    // get everything back
    await wallet.contracts.Deposit.withdrawRequest();
  } catch (e) {
    console.log(e);
  }
};

export default userDeposit;
