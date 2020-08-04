<script>
  import Button from '../components/basic/Button.svelte';
  import Box from '../3box.min.js';
  import userDpst from '../stores/my_deposit';
  import {
    wallet,
    builtin,
    transactions,
    chain,
    balance,
  } from '../stores/wallet';
  import box from '../stores/3box';
  import {BigNumber} from '@ethersproject/bignumber';
  import {userBets} from '../stores/my_bets';

  let d_eth;
  let userDeposit = userDpst.store;
  $: if ($userDeposit.data) {
    if ($userDeposit.data.userDeposit) {
      d_eth =
        BigNumber.from($userDeposit.data.userDeposit.amount)
          .div(BigNumber.from(10).pow(16))
          .toNumber() / 100;
    } else {d_eth = 0}
  } else {d_eth = 0}
</script>

<div class="flex flex-col flex-stretch items-center md:w-full lg:w-3/4">
  <p class="text-5xl text-blue-300 justify-center">Blue Coati</p>
  {#if $box.status != 'Ready'}
    <Button
      class="mt-5 w-48 text-sm text-gray-200 justify-center"
      on:click="{() => box.load()}"
    >
      Login to see your stats
    </Button>
  {:else if $box.status == 'Ready'}
    <div class="flex flex-col items-center">
      <p class="text-lg text-pink-500 justify-center">
        <!-- TODO: discuss price per bet -->
        Bets made: {$userBets} / {d_eth * 200}
      </p>
      <p class="text-lg text-yellow-500 justify-center">
        Total deposit: {d_eth} eth
      </p>
      <p class="text-xs text-gray-200">{$wallet.address}</p>
    </div>
  {/if}
</div>
