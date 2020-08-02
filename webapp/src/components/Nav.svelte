<script>
  import Link from '@curi/svelte/components/Link.svelte';
  import Button from './basic/Button.svelte';
  import {
    wallet,
    builtin,
    transactions,
    chain,
    balance,
  } from '../stores/wallet';
</script>

<nav class="flex justify-between">
  <div>
    <Link name="Index">Home</Link>
    <Link name="Wallet">Wallet</Link>
  </div>
  <div>
    {#if $wallet.state == 'Ready'}
      <Button on:click="{() => wallet.logout()}">Disconnect</Button>
    {:else}
      <Button on:click="{() => wallet.connect('builtin')}">Connect</Button>
    {/if}
  </div>
</nav>
