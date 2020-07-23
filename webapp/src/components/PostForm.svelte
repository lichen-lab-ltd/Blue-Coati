<script>
  import box from '../stores/3box.js';
  import Button from '../components/basic/Button.svelte';
  let newPost;
</script>

<textarea
  class="textarea ~info !normal"
  placeholder="What do you want to share?"
  bind:value={newPost}
></textarea>
<Button classname="~neutral" on:click={() => box.addPost(newPost)}>
  Add
</Button>
