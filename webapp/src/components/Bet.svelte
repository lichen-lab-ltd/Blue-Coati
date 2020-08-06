<script>
  export let bet, judgement;
  import recordBet from '../utils/recordBet'
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
  <div class="text-xs mb-2 text-gray-200 truncate">Post Id: {bet.postId}</div>
  <div class="text-xs text-blue-500 truncate">Bet: {bet.bet.isValid ? "Valid" : "Invalid"}</div>
  <div class="flex flex-row">
    {#if judged}
      <span  class={judged.accepted ? "m-1 text-sm text-green-500" : "m-1 text-sm text-red-500"}>
        {judged.accepted ? ' Moderated - Valid' : 'Moderated - Invalid'}
      </span>
    {/if}
  </div>

  <div class="w-full flex flex-row justify-between">
    <span class="m-1 text-sm text-gray-500">
      {timeToDateTime(bet.bet.timestamp * 1000)}
      {isExpired(bet.bet.timestamp) ? ' - Expired' : ''}
    </span>
    {#if judged}
      {#if bet.bet.children.length != 0}
        <div 
          on:click={() => {recordBet(bet.postId, bet.bet)}}
          class="button border border-pink-500 text-pink-500 bg-gray-700">
          Submit
        </div>
      {:else}
        <div class="button opacity-50 cursor-not-allowed border bg-gray-700 text-gray-200">
          No counter bets
        </div>
      {/if}
    {/if}
  </div>
</section>
