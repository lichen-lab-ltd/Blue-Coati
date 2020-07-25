<script>
  import box from '../stores/3box.js';
  import Button from '../components/basic/Button.svelte';
  let newPost;
</script>

<div class="flex justify-between m-2">
  <textarea
    class="textarea ~urge !high ml-1"
    placeholder="What do you want to share?"
    bind:value={newPost}
  ></textarea>
  <Button class="~urge mx-1" on:click={() => box.addPost(newPost)}>
    ✒️
  </Button>
</div>
