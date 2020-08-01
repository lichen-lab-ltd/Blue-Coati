import {writable} from 'svelte/store';
import {wallet, builtin, chain, transactions, balance} from './wallet';

let store = {};

store.add = async function (_amount) {
  await wallet.connect('builtin'); // TODO choice
  console.log(wallet);
  if (!wallet.address) {
    await wallet.unlock(); // TOOO catch ?
  }
  console.log(wallet.contracts);
  try {
    await wallet.contracts.Deposit.deposit(parseFloat(_amount));
  } catch (e) {
    console.log(e);
  }
};
store.withdraw = async function () {};

export default store;
