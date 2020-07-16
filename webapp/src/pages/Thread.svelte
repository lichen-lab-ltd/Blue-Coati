<script>
  import {
    wallet,
    builtin,
    transactions,
    chain,
    balance,
  } from '../stores/wallet.js';
  import Box from '../3box.min.js';

  import Button from '../components/basic/Button.svelte';
  import Link from '@curi/svelte/components/Link.svelte';
  let did;

  $: if ($wallet.state == 'Ready') {
    console.log('wallet ready');
    let load = async () => {
      let box = await Box.openBox(wallet.address, window.ethereum);
      let space = await box.openSpace('blue-coati-dev');
      did = space.DID;
    };
    load();
  }
</script>

{JSON.stringify($wallet)} {did}
<p class="m-3 text-3xl">Links:</p>
<Link name="Index" class="button bg-red-200 ~positive !normal">Home</Link>
<Link name="Wallet" class="button ~positive !normal">wallet</Link>
