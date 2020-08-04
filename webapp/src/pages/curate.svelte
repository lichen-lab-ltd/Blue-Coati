<script>
  import Button from '../components/basic/Button.svelte';
  import Modal from '../components/basic/Modal.svelte';
  import Loading from '../components/Loading.svelte';
  import Header from '../components/Header.svelte';
  import Bet from '../components/Bet.svelte';
  import deposits from '../stores/deposits';
  import userDeposit from '../stores/my_deposit';
  import {wallet} from '../stores/wallet';
  import box from '../stores/3box';
  import {userBets} from '../stores/my_bets';
  import {time} from '../stores/time'
  let depositStore = userDeposit.store;
  let status = userDeposit.status;
  $: console.log($status)
</script>

<div class="flex flex-col items-center bg-gray-800">
  <Header />
  {#if $wallet.address }
  <div>
    {#if $status.withdrawStatus && $status.withdrawStatus != 'Unlocking' && $status.hasDeposit}
      <Button
        class="text-sm border border-blue-300 text-gray-200 justify-center"
        on:click={() => userDeposit.add()}
      >
        Make Deposit
      </Button>
      {#if $status.withdrawStatus == 'Unlocked'}
        <Button
            class="text-sm border border-gray-500 text-gray-200 justify-center"
            on:click={() => userDeposit.withdrawDeposit()}
          >
            Withdraw Deposit
        </Button>
      {:else if $status.withdrawStatus == 'NotRequested'}
        <Button
          class="text-sm border border-gray-500 text-gray-200 justify-center"
          on:click={() => userDeposit.withdrawRequest()}
        >
          Request Withdraw
        </Button>
      {/if}
    {:else if $status.withdrawStatus == 'Unlocking'}
      <Button
        class="text-sm disabled border border-gray-500 text-gray-200 justify-center"
      >
        Unlocking Deposit
      </Button>
    {/if}
  </div>
  {/if}

  <div class="px-3 md:w-full lg:w-3/4 justify-center">
    {#if $box.status == 'Unavailable' || $box.status == 'Loading'}
      {#await box.staticInit()}
        <div class="flex h-screen items-center justify-center">
          <Loading />
        </div>
      {:then value}
        {#each value.bets.reverse() as bet}
          <Bet {bet} />
        {/each}
      {:catch error}
        <p>Error in loading inital bets, please sign in</p>
        <p>{error}</p>
      {/await}
    {:else if $box.status == 'Ready'}
      <div>
        {#each $box.bets.reverse() as bet}
          {#if bet.author == $box.spaceDID}
            <Bet {bet} />
          {/if}
        {/each}
      </div>
    {:else if $box.status == 'Error'}
      <div>Error: {$box.msg}</div>
    {/if}
  </div>

  {#if $box.status == 'Loading'}
    <Modal closable="{false}">
      <Loading />
    </Modal>
  {/if}

</div>
