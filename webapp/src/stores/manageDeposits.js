import {wallet, builtin, chain, transactions, balance} from './wallet';
import box from './3box';
import {BigNumber} from '@ethersproject/bignumber';
let store = {};
store.add = async function () {
  if (box.status != 'Ready') {
    await box.load();
  }
  try {
    // 0.05 ETH per deposit
    let amountEth = BigNumber.from(5).mul(BigNumber.from(10).pow(16));
    await wallet.contracts.Deposit.deposit({value: amountEth});
  } catch (e) {
    console.log(e);
  }
};
store.withdraw = async function () {
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

export default store;
