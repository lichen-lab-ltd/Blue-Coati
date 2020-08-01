<script>
  import Button from '../components/basic/Button.svelte';
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
  {:else if $box.status == 'Ready' && userDpst.data}
    <div class="flex flex-col items-center">
      <div>
        <p class="subheading text-pink-500 justify-center">
          Bets available: {userDpst.data.userDeposit ? userDpst.data.userDeposit.amount : 0}
          / {userDpst.data.userDeposit ? userDpst.data.userDeposit.amount : 0}
        </p>
      </div>
      <p class="text-xs text-gray-200">
        {userDpst.data.userDeposit ? userDpst.data.userDeposit.id : $wallet.address}
      </p>
    </div>
  {/if}
</div>
