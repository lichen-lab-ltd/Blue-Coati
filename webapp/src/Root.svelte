<script>
  import {getResponse} from '@curi/svelte';
  const response = getResponse();

  import Link from '@curi/svelte/components/Link.svelte';
  import Button from './components/basic/Button.svelte';
</script>

<nav class="flex justify-between">
  <div><Link name="Index">Home</Link><Link name="Wallet">Wallet</Link></div>
  <div><Button>Connect</Button></div>
</nav>

<svelte:component this="{$response.body}" />
