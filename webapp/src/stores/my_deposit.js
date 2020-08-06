import {derived} from 'svelte/store';
import {subscription} from '../utils/graphql/subscription.js';
import {wallet} from './wallet';
import {time} from './time';
import box from './3box';
import {BigNumber} from '@ethersproject/bignumber';
const LOCKPERIOD = 30; // deposit
let lastAddress;
let endSubscription;
let userDeposit = {};

const Store = derived(
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

const status = derived([Store, time], ([$Store, $time], set) => {
  let s = {hasDeposit: false, withdrawStatus: null};
  if ($Store.data) {
    if ($Store.data.userDeposit) {
      s.hasDeposit = true;
      if ($Store.data.userDeposit.withdrawalTime == 0) {
        s.withdrawStatus = 'NotRequested';
      } else {
        if (
          $time >=
          parseInt($Store.data.userDeposit.withdrawalTime) + LOCKPERIOD
        ) {
          s.withdrawStatus = 'Unlocked';
        } else {
          s.withdrawStatus = 'Unlocking';
        }
      }
    }
  }
  set(s);
});

userDeposit.store = Store;
userDeposit.status = status;

userDeposit.add = async function () {
  await wallet.connect('builtin'); // TODO choice
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  try {
    // 0.05 ETH per deposit
    let amountEth = BigNumber.from(5).mul(BigNumber.from(10).pow(16));
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
