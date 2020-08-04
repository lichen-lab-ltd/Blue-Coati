<script>
  export let bet;
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
  let judged = true;

  
</script>

<section class="~neutral m-2 card !normal content bg-gray-700 flex flex-row flex-grow-0 justify-between">
  <div>
    <div class="px-6">
      <div class="text-sm mb-2 text-gray-200">Bet on: {bet.message.postId}</div>
      <!-- TODO: Drill down tree -->
      <div class="text-sm mb-2 text-blue-500">Has counter? {bet.message.children[0].length > 0}</div>
    </div>
    <div class="px-6 flex flex-row">
      <span class="m-1 text-sm text-gray-500">
        Bet palced on: {timeToDateTime(bet.timestamp * 1000)}
      </span>
      <span class="m-1 text-sm text-green-500">
        Expired: {isExpired(bet.timestamp)}
      </span>
      <span class="m-1 text-sm text-red-500">
        Judged: {judged}
      </span>
    </div>
  </div>
  {#if $box.status == 'Ready' && judged}
    <div class="button border border-pink-500 text-pink-500 bg-gray-700">
      Submit
    </div>
  {/if}
</section>
