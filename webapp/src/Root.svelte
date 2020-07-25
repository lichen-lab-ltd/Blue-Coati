<script>
  import {getResponse} from '@curi/svelte';
  const response = getResponse();

  import Link from '@curi/svelte/components/Link.svelte';
  import Button from './components/basic/Button.svelte';
</script>

<nav class="flex items-start bg-gray-800">
  <div>
    <Link class="text-pink-500 m-1" name="Index">Home</Link>
    <Link class="text-pink-500 m-1" name="Curate">Curate</Link>
    <Link class="text-pink-500 m-1" name="Wallet">Wallet</Link>
  </div>
</nav>

<svelte:component this="{$response.body}" />
