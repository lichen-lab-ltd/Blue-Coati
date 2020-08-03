import {derived} from 'svelte/store';
import {subscription} from '../utils/graphql/subscription.js';
import {wallet} from './wallet';
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
          console.log('subcription update: ', r);
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
  console.log('adding deposit');
  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    // 0.05 ETH per deposit
    let amountEth = BigNumber.from(5).mul(BigNumber.from(10).pow(16));
    console.log('amount eth', amountEth);
    await wallet.contracts.Deposit.deposit({value: amountEth});
    await box.load();
  } catch (e) {
    console.log(e);
  }
};
userDeposit.withdrawRequest = async function () {
  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    await wallet.contracts.Deposit.withdrawRequest();
  } catch (e) {
    console.log(e);
  }
};

userDeposit.withdrawDeposit = async function () {
  console.log('withdrawing');
  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    await wallet.contracts.Deposit.withdrawDeposit();
  } catch (e) {
    console.log(e);
  }
};

export default userDeposit;
