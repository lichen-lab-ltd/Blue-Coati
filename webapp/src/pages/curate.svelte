<script>
  import Button from '../components/basic/Button.svelte';
  import Modal from '../components/basic/Modal.svelte';
  import Loading from '../components/Loading.svelte';
  import Header from '../components/Header.svelte';

  import box from '../stores/3box';
  import {mapping} from '../stores/my_bets';

  $: console.log(JSON.stringify($mapping))
</script>

<div class="flex flex-col items-center bg-gray-800">
  <Header />
  <Button on:click="{() => box.deleteAllBets()}">Dev: delete bets</Button>

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
