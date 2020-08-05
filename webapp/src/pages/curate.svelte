<script>
  import Button from '../components/basic/Button.svelte';
  import Modal from '../components/basic/Modal.svelte';
  import Loading from '../components/Loading.svelte';
  import Header from '../components/Header.svelte';
  import Bet from '../components/Bet.svelte';
  import Post from '../components/Post.svelte';

  import deposits from '../stores/deposits';
  import userDeposit from '../stores/my_deposit';
  import {wallet} from '../stores/wallet';
  import box from '../stores/3box';
  import {userBets} from '../stores/my_bets';
  import {time} from '../stores/time'
  import {mapping} from '../stores/postBetsMapping.js';

  let depositStore = userDeposit.store;
  let status = userDeposit.status;
  $: p = [...$box.posts];
  const BETPERIOD = 30; // deposit

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

  <div class="grid grid-cols-2 gap-2">
    <!-- Posts to curate -->
    <div class="px-1 justify-center">
      {#if $box.status == 'Ready'}
      <div class="m-2 text-3xl text-gray-500 underline text-start">All Posts:</div>
        <div>
          {#each p.reverse() as post}
            {#if $time < (post.timestamp + BETPERIOD)}
              <Post {post} betsMap={$mapping} {BETPERIOD}/>
            {/if }
          {/each}
        </div>
      {:else if $box.status == 'Error'}
        <div>Error: {$box.msg}</div>
      {/if}
    </div>

    <!-- Bets made -->
    <div class="px-1 justify-center">
      {#if $box.status == 'Ready'}
      <div class="m-2 text-3xl text-gray-500 underline text-start">My bets:</div>
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
  </div>

  {#if $box.status == 'Loading'}
    <Modal closable="{false}">
      <Loading />
    </Modal>
  {/if}

</div>
