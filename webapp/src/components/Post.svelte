<script>
  export let post;
  import box from '../stores/3box.js';
  const timeToDateTime = (_time) => {
    let date = new Date (_time);
    return date.toLocaleString();
  }
</script>

<section
  class="~neutral m-2 card !normal content bg-gray-700"
>
  <div class="px-6 py-2">
    <div class="text-lg mb-2 text-gray-200">{post.message}</div>
  </div>
  <div class="px-6 py-2 flex flex-row">
      <button on:click={() => box.bet(true, post.postId)} class="badge ~positive m-1">👍</button>
      <button on:click={() => box.bet(false, post.postId)} class="badge ~critical m-1">👎</button>
      <span class="m-1 text-sm text-gray-500">Posted on: {timeToDateTime(post.timestamp*1000)}</span>
  </div>
</section>
