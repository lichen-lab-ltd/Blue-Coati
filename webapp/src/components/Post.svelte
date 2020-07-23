<script>
  export let post;
  import box from '../stores/3box.js';
  const timeToDateTime = (_time) => {
    let date = new Date (_time);
    return date.toLocaleString();
  }
  $: console.log(post)

</script>

<section
  class="~neutral m-2 card !normal content"
>
  <div class="px-6 py-2">
    <div class="text-lg mb-2">{post.message}</div>
  </div>
  <div class="px-6 py-2 flex flex-row">
      <button on:click={box.bet(true)} class="badge ~positive m-1">👍</button>
      <button on:click={box.bet(false)} class="badge ~critical m-1">👎</button>
      <span class="m-1 text-sm text-gray-500">Posted on: {timeToDateTime(post.timestamp*1000)}</span>
  </div>
</section>
