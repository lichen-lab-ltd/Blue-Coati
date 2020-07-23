<script>
  import Button from '../components/basic/Button.svelte';
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

  let init = async () => {
    let init_data = {posts: [], bets: []};
    init_data.posts = await Box.getThreadByAddress(
      '/orbitdb/zdpuAqAGkAzxibXccbKHKev5pKZcPKsaFAQD6upFofjF658Vt/3box.thread.blue-coati-dev.other-coati'
    );
    init_data.bets = await Box.getThreadByAddress(
      '/orbitdb/zdpuAyirKfdqFE3mnqCho4AXv43HTkouXp4iwxjGWnmQSdXDa/3box.thread.blue-coati-dev.bets'
    );
    console.log(init_data);
    return init_data;
  };
  let addingPost = false;
  let newPost;

  $: console.log($box);
</script>

<div class="grid grid-cols-3 gap-3">
  <!-- Left column -->
  <div class="col-span-1">
    {#if $box.status != 'Ready'}
      <div>
        <Button classname="~neutral" on:click="{box.load}">
          Login to take part
        </Button>
      </div>
    {/if}
  </div>

  <!-- Right column -->
  <div class="col-span-2">
    {#if $box.status == 'Unavailable'}
      {#await init()}
        <p>waiting for static posts</p>
      {:then value}
        {#each value.posts as post}
          <Post post={post}></Post>
        {/each}
      {:catch error}
        <p>Error in loading inital posts, please sign in</p>
        <p>{error}</p>
      {/await}
    {:else if $box.status == 'Loading'}
      <div>Loading</div>
    {:else if $box.status == 'Ready'}
      <div>
        <textarea
          class="textarea ~info !normal"
          placeholder="What do you want to share?"
          bind:value={newPost}
        ></textarea>
        <Button classname="~neutral" on:click="{box.addPost(newPost)}">
          Add
        </Button>
        {#each $box.posts as post}
          <Post post={post}></Post>
        {/each}
      </div>
    {:else if $box.status == 'Error'}
      <div>Error: {$box.msg}</div>
    {/if}
  </div>
</div>
