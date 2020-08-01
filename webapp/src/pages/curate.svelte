<script>
  import Button from '../components/basic/Button.svelte';
  import Modal from '../components/basic/Modal.svelte';
  import Loading from '../components/Loading.svelte';
  import Header from '../components/Header.svelte';
  import deposits from '../stores/deposits';
  import deposit from '../stores/manageDeposits';
  import box from '../stores/3box';
  import {mapping} from '../stores/my_bets';

  $: console.log(JSON.stringify($mapping))
  let amount;

  function manageDeposit(_isAdd){
    _isAdd ? deposit.add(amount) : deposit.withdraw(amount);
    amount = null
  }
  deposits.listen()
  $: console.log($deposits)
</script>


<div class="flex flex-col items-center bg-gray-800">
  <Header />
  <Button on:click="{() => box.deleteAllBets()}">Dev: delete bets</Button>
  <div flex flex-col>
    <input
      bind:value={amount}
      class="border border-pink-500 bg-gray-800 text-pink-500 input !low mb-4 mr-4 w-auto"
      placeholder="Amount"
      type="text"
    />
    <Button
      class="text-sm border border-blue-300 text-gray-200 justify-center"
      on:click={() => manageDeposit(true)}
    >
      Make Deposit
    </Button>
    <Button
      class="text-sm border border-gray-500 text-gray-200 justify-center"
      on:click={() => manageDeposit(false)}

    >
      Withdraw
    </Button>
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
