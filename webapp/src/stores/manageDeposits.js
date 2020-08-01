import {writable} from 'svelte/store';
import {wallet, builtin, chain, transactions, balance} from './wallet';
import box from './3box';
import {BigNumber} from '@ethersproject/bignumber';

let store = {};

store.add = async function (_amount) {
  if (box.status != 'Ready') {
    await box.load();
  }
  try {
    // TODO: check units
    let amountEth = BigNumber.from(parseFloat(_amount)).mul(
      BigNumber.from(10).pow(12)
    );
    console.log(amountEth.toString());
    await wallet.contracts.Deposit.deposit(amountEth);
  } catch (e) {
    console.log(e);
  }
};
store.withdraw = async function () {};

export default store;
