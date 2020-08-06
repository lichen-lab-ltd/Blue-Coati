<script>
  import Button from '../components/basic/Button.svelte';
  import Modal from '../components/basic/Modal.svelte';
  import Loading from '../components/Loading.svelte';
  import PostForm from '../components/PostForm.svelte';
  import Post from '../components/Post.svelte';
  import Header from '../components/Header.svelte';

  import box from '../stores/3box.js';
  import {mapping} from '../stores/postBetsMapping.js';
  import userDeposit from '../stores/my_deposit';
  let status = userDeposit.status

  const BETPERIOD = 30;
  let addingPost = false;
  let newPost;
  $: p =  [...$box.posts];
  const toShow = (_map, _postId) => {
    if (_map[_postId]){
      if (_map[_postId].isInvalidCount > _map[_postId].isValidCount) {
        return false
      } 
    } 
    return true
  }
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
        {#each value.posts as post}
          {#if toShow(value.mapping, post.postId)}
            <Post {post} betsMap={value.mapping} betPeriod={BETPERIOD} />
          {/if}
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
        {#each p.reverse() as post}
          {#if toShow($mapping, post.postId)}
            <Post {post} betsMap={$mapping} betPeriod={BETPERIOD}/>
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
