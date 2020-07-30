<script>
  import Button from '../components/basic/Button.svelte';
  import Box from '../3box.min.js';
  import userDeposit from '../stores/my_deposit.js';
  import {
    wallet,
    builtin,
    transactions,
    chain,
    balance,
  } from '../stores/wallet';
  import box from '../stores/3box.js';

  let userDeposti;
  $: deposits = $userDeposit.data;
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
  {:else if $box.status == 'Ready' && deposits}
    <div class="flex flex-col items-center">
      <div>
        <p class="subheading text-pink-500 justify-center">
          Bets available: {deposits.userDeposit ? deposits.userDeposit.amount : 0}
          / {deposits.userDeposit ? deposits.userDeposit.amount : 0}
        </p>
      </div>
      <p class="text-xs text-gray-200">
        {deposits.userDeposit ? deposits.userDeposit.id : $wallet.address}
      </p>
    </div>
  {/if}
</div>
