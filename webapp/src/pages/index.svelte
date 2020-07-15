<script>
  import posts from '../stores/posts';
</script>

{#each $posts as post, index}
<p>{post.content}</p>
{/each}
