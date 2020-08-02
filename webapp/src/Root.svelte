<script>
  import {getResponse} from '@curi/svelte';
  const response = getResponse();

  import Nav from './components/Nav.svelte';
</script>

<nav class="flex items-start bg-gray-800">
  <div>
    <Link class="text-pink-500 m-1" name="Index">Home</Link>
    <Link class="text-pink-500 m-1" name="Curate">Curate</Link>
    <Link class="text-pink-500 m-1" name="Wallet">Wallet</Link>
  </div>
</nav>

<svelte:component this="{$response.body}" />
