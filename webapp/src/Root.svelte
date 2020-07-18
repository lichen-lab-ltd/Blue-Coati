<script>
  import {getResponse} from '@curi/svelte';
  const response = getResponse();

  import Nav from './components/Nav.svelte';
</script>

<Nav></Nav>

<svelte:component this="{$response.body}" />
