<script>
  import Button from '../components/basic/Button.svelte';
  import Modal from '../components/basic/Modal.svelte';
  import Loading from '../components/Loading.svelte';
  import PostForm from '../components/PostForm.svelte';
  import Post from '../components/Post.svelte';
  import Header from '../components/Header.svelte';
  import userDeposit from '../stores/my_deposit';
  let status = userDeposit.status

  import box from '../stores/3box.js';
  import {mapping} from '../stores/postBetsMapping.js';

  let addingPost = false;
  let newPost;
  $: console.log($status.withdrawStatus);
</script>

<div class="flex flex-col items-center bg-gray-800">
  <Header />

  <!-- Posts -->
  <div class="px-3 md:w-full lg:w-3/4 justify-center">
    {#if $box.status == 'Unavailable' || $box.status == 'Loading'}
      {#await box.staticInit()}
        <div class="flex h-screen items-center justify-center">
          <Loading />
        </div>
      {:then value}
        {#if ($status.withdrawStatus != 'Unlocking')}
          <PostForm />
        {/if}
        {#each value.posts.reverse() as post}
          <Post {post} betsMap="{value.mapping}"/>
        {/each}
      {:catch error}
        <p>Error in loading inital posts, please sign in</p>
        <p>{error}</p>
      {/await}
    {:else if $box.status == 'Ready'}
      <div>
        {#if ($status.withdrawStatus != 'Unlocking')}
          <PostForm />
        {/if}
        {#each $box.posts.reverse() as post}
          <Post {post} betsMap="{$mapping}"/>
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
