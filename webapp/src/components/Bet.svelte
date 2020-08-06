<script>
  export let bet, judgement;
  import box from '../stores/3box';
  const timeToDateTime = (_time) => {
    let date = new Date(_time);
    return date.toLocaleString();
  };
  const POSTJUDGEMENT = 30;
  const isExpired = (_time) => {
    let time = new Date().getTime()
    if (time > (_time + POSTJUDGEMENT)* 1000){
      return true;
    } else {return false}
  }
  $: judged = !!judgement
</script>

<section class="~neutral m-2 card !normal content bg-gray-700 justify-between">
  <div class="text-xs mb-2 text-gray-200 truncate">Post Id: {bet.message.postId}</div>
  <!-- TODO: Drill down tree -->
  <div class="flex flex-row">
    {#if judged}
      <span  class={judged.accepted ? "m-1 text-sm text-green-500" : "m-1 text-sm text-red-500"}>
        {judged.accepted ? ' Moderated - Valid' : 'Moderated - Invalid'}
      </span>
    {/if}
  </div>

  <div class="w-full flex flex-row justify-between">
    <span class="m-1 text-sm text-gray-500">
      {timeToDateTime(bet.timestamp * 1000)}
      {isExpired(bet.timestamp) ? ' - Expired' : ''}
    </span>
    {#if $box.status == 'Ready' && judged}
      <div class="button border border-pink-500 text-pink-500 bg-gray-700">
        Submit
      </div>
    {/if}
  </div>
</section>
