<script>
  import Button from '../components/basic/Button.svelte';
  import Modal from '../components/basic/Modal.svelte';
  import Loading from '../components/Loading.svelte';
  import PostForm from '../components/PostForm.svelte';
  import Post from '../components/Post.svelte';

  import Box from '../3box.min.js';
  import {
    wallet,
    builtin,
    transactions,
    chain,
    balance,
  } from '../stores/wallet';
  import box from '../stores/3box.js';
  import userDeposit from '../stores/my_deposit.js';

  let init = async () => {
    let init_data = {posts: [], bets: []};
    init_data.posts = await Box.getThreadByAddress(
      '/orbitdb/zdpuAqAGkAzxibXccbKHKev5pKZcPKsaFAQD6upFofjF658Vt/3box.thread.blue-coati-dev.other-coati'
    );
    init_data.bets = await Box.getThreadByAddress(
      '/orbitdb/zdpuAyirKfdqFE3mnqCho4AXv43HTkouXp4iwxjGWnmQSdXDa/3box.thread.blue-coati-dev.bets'
    );
    return init_data;
  };
  let addingPost = false;
  let newPost;

  $: console.log($box);
  $: console.log($userDeposit.data)
</script>

<div class="grid grid-cols-3 gap-3">
  <!-- Left column -->
  <div class="col-span-1">
    {#if $box.status != 'Ready'}
      <div class="flex flex-col flex-stretch justify-center items-center">
      <p class="subheading ~neutral !low"> Curator stats </p>
        <Button class="~neutral field mt-5" on:click={() => box.load()}>
          Login
        </Button>
      </div>
    {:else if $userDeposit.data}
      <div >
      <p class="subheading">You are signed in as:</p>
      <p class="text-xs">{$userDeposit.data.userDeposit.id}</p>
      <p class="subheading">Bets available:</p>
      <p class="heading">{$userDeposit.data.userDeposit.amount}</p>
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div class="col-span-2 px-3">
    {#if $box.status == 'Unavailable'}
      {#await init()}
        <p>waiting for static posts</p>
      {:then value}
        <PostForm />
        {#each value.posts.reverse() as post}
          <Post post={post}></Post>
        {/each}
      {:catch error}
        <p>Error in loading inital posts, please sign in</p>
        <p>{error}</p>
      {/await}
    {:else if $box.status == 'Loading'}
      <Modal closable="{false}">
        <Loading />
      </Modal>
    {:else if $box.status == 'Ready'}
      <div>
        <PostForm />
        {#each $box.posts.reverse() as post}
          <Post post={post}></Post>
        {/each}
      </div>
    {:else if $box.status == 'Error'}
      <div>Error: {$box.msg}</div>
    {/if}
  </div>
</div>
