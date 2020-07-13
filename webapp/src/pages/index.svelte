<script>
  import deposits from '../stores/deposits';
  deposits.listen();

  import Link from '@curi/svelte/components/Link.svelte';
</script>

{#if !$deposits.status}
<div>Name not loaded</div>
{:else if $deposits.status === 'Error'}
<div>Error</div>
{:else if $deposits.status === 'Loading'}
<div>Loading deposits...</div>
{:else} {#each $deposits.data as deposit, index}
<li>{deposit.id}: {deposit.amount}</li>
{/each} {/if}


<p class="m-3 text-3xl"> Links:</p>
<Link name="Index" class="button bg-red-200 ~positive !normal">Home</Link>
<Link name="Wallet" class="button ~positive !normal">wallet</Link>

