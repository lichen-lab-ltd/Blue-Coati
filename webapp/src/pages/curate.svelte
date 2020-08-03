<script>
  import Button from '../components/basic/Button.svelte';
  import Modal from '../components/basic/Modal.svelte';
  import Loading from '../components/Loading.svelte';
  import Header from '../components/Header.svelte';
  import deposit from '../stores/my_deposit';
  import box from '../stores/3box';
  import {userBets} from '../stores/my_bets';
  import userDpst from '../stores/my_deposit';
  import {time} from '../stores/time'
  let wTime;
  function manageDeposit(_isAdd) {
    _isAdd ? deposit.add() : isUnlocked ? deposit.withdrawDeposit() : deposit.withdrawRequest();
  }
  let userDeposit = userDpst.store;
  $: if ($userDeposit.data) {
    if ($userDeposit.data.userDeposit){
      console.log($userDeposit.data.userDeposit)
      wTime = $userDeposit.data.userDeposit.withdrawalTime
    } else {wTime = 0}
  } else {wTime = 0}
  const LOCKPERIOD = 30 // deposit
  $: isUnlocked = ($time >= (parseInt(wTime) + 30))
</script>

<div class="flex flex-col items-center bg-gray-800">
  <Header />
  <Button on:click="{() => box.deleteAllBets()}">Dev: delete bets</Button>
  <div flex flex-col>
    {#if wTime == 0}
      <Button
        class="text-sm border border-blue-300 text-gray-200 justify-center"
        on:click={() => deposit.add()}
      >
        Make Deposit
      </Button>
    {/if}
    {#if $box.status == 'Ready' }
      {#if wTime == 0}
        <div
          class="button text-sm border border-gray-500 text-gray-200 justify-center"
          on:click={() => deposit.withdrawRequest()}
        >
          Request Withdraw
        </div>
      {:else if isUnlocked}
        <div
          class="button text-sm border border-gray-500 text-gray-200 justify-center"
          on:click={() => deposit.withdrawDeposit()}
        >
          Withdraw Deposit
        </div>
      {:else if !isUnlocked}
        <div
          class="button text-sm border border-gray-500 text-gray-200 justify-center"
        >
          Unlocking Deposit
        </div>
      {/if}
    {/if}
  </div>
  <div class="px-3 md:w-full lg:w-3/4 justify-center">
    {#if $box.status == 'Unavailable' || $box.status == 'Loading'}
      {#await box.staticInit()}
        <div class="flex h-screen items-center justify-center">
          <Loading />
        </div>
      {:then value}
        {#each value.bets.reverse() as bet}
          <p>{JSON.stringify(bet)}</p>
        {/each}
      {:catch error}
        <p>Error in loading inital bets, please sign in</p>
        <p>{error}</p>
      {/await}
    {:else if $box.status == 'Ready'}
      <div>
        {#each $box.bets.reverse() as bet}
          <p>{JSON.stringify(bet)}</p>
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
