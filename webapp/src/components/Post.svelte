<script>
  export let post, betsMap, betPeriod;
  import box from '../stores/3box';
  import {time} from '../stores/time';
  const timeToDateTime = (_time) => {
    let date = new Date(_time);
    return date.toLocaleString();
  };
  import userDeposit from '../stores/my_deposit';
  let status = userDeposit.status;

  $: disabled = ($status.withdrawStatus == 'Unlocking' || $time > (post.timestamp + betPeriod))
</script>

<section class="~neutral m-2 card !normal content bg-gray-700">
  <div class="px-6 py-2">
    <div class="text-lg mb-2 text-gray-200">{post.message}</div>
  </div>
  <div class="px-6 flex flex-row">
    <button
      on:click="{() => box.bet(true, post.postId)}"
      class={disabled ? 'opacity-50 cursor-not-allowed badge ~neutral m-1' : 'badge ~positive m-1'}
    >
      {betsMap[post.postId] ? betsMap[post.postId].isValidCount : 0} 👍
    </button>
    <button
      on:click="{() => box.bet(false, post.postId)}"
      class={disabled ? 'opacity-50 cursor-not-allowed badge ~neutral m-1' : 'badge ~critical m-1'}
    >
      {betsMap[post.postId] ? betsMap[post.postId].isInvalidCount : 0} 👎
    </button>
    <span class="m-1 text-sm text-gray-500">
      Posted on: {timeToDateTime(post.timestamp * 1000)}
    </span>
  </div>
  <div class="px-6 text-xs text-gray-600">id: {post.postId}</div>

</section>
