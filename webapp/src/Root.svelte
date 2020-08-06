<script>
  import {getResponse} from '@curi/svelte';
  const response = getResponse();

  import Link from '@curi/svelte/components/Link.svelte';
  import Nav from './components/Nav.svelte';
  import box from './stores/3box';
  import {wallet} from './stores/wallet';

  const judgeAddress = '0x7633Fe8542c2218B5A25777477F63D395aA5aFB4';
</script>

<nav class="flex items-start bg-gray-800">
  <div>
    <Link class="text-pink-500 m-1" name="Index">Home</Link>
    {#if $box.status == 'Ready'}
      <Link class="text-pink-500 m-1" name="Curate">Curate</Link>
    {/if}
    {#if $wallet.address == judgeAddress }
      <Link class="text-pink-500 m-1" name="Moderate">Moderate</Link>
    {/if}
    <Link class="text-pink-500 m-1" name="Wallet">Wallet</Link>
  </div>
</nav>

<svelte:component this="{$response.body}" />
