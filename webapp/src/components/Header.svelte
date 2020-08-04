<script>
  import Button from '../components/basic/Button.svelte';
  import Identity from '../components/Identity.svelte';
  import Box from '../3box.min.js';
  import userDpst from '../stores/my_deposit.js';
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

  let d_eth = 0;
  $: if ($userDpst.data) {
    if ($userDpst.data.userDeposit) {
      d_eth =
        BigNumber.from($userDpst.data.userDeposit.amount)
          .div(BigNumber.from(10).pow(16))
          .toNumber() / 100;
    }
  }
  $: console.log($userBets)
</script>

<div class="flex flex-col flex-stretch items-center md:w-full lg:w-3/4">
  <p class="text-5xl text-white justify-center mb-5">🔵 Blue Coati</p>
  {#if $box.status != 'Ready'}
    <Button
      class="mt-5 w-48 text-sm text-gray-200 justify-center"
      on:click="{() => box.load()}"
    >
      Login to see your stats
    </Button>
  {:else if $box.status == 'Ready'}
    <div class="flex flex-row items-center justify-center">
    <div class="items-center justify-center" >
      <Identity profile={$box.profile} />
      <p class="text-xs text-gray-200 text-center">{$box.profile.name}</p>
    </div>
    <div class="m-2 flex flex-col items-start justify-evenly">
      <p class="text-lg text-pink-500">
        <!-- TODO: discuss price per bet -->
        Bets made: {$userBets.length}  / {d_eth * 200}
      </p>
      <p class="text-lg text-blue-700">
        Total deposit: {d_eth} eth
      </p>
    </div>
    </div>
  {/if}
</div>
