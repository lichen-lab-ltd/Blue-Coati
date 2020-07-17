<script>
  import Button from '../components/basic/Button.svelte';
  import threads from '../stores/threads.js';
  import Box from '../3box.min.js';
  import {
    wallet,
    builtin,
    transactions,
    chain,
    balance,
  } from '../stores/wallet';
  import box from '../stores/3box.js'
  let thread;
  let activeThread = 0;
  let init = async () => {
    // initally thread to load without user auth
    thread = await Box.getThreadByAddress('/orbitdb/zdpuAp5QpBKR4BBVTvqe3KXVcNgo4z8Rkp9C5eK38iuEZj3jq/3box.thread.testSpace.testThread');
    console.log("got thread", thread)
  };
  init();
  $: console.log($box)
</script>

<div class="grid grid-cols-3 gap-3">

  <div class="col-span-1">
    <h3 class="px-6 heading">Threads</h3>

    {#each $threads as thread, index}
      <section
        class:~neutral="{activeThread != index}"
        class:~urge="{activeThread == index}"
        class=" m-2 card !normal content"
        on:click="{() => (activeThread = index)}"
      >
        <div class="px-6 py-2">
          <div class="font-bold text-xl mb-2">{thread.title}</div>
          <p class="text-gray-700 text-base">{thread.description}</p>
        </div>
        <div class="px-6 py-2">
          {#each thread.tags as tag}
            <span class="badge ~info m-1">#{tag}</span>
          {/each}
        </div>
      </section>
    {/each}
  {#if $box.status != 'Ready'}
  <div><Button classname="~neutral" on:click={box.load}>Login to take part</Button></div>
  {/if}
  </div>

  <div class="col-span-2">
  {#if $box.status == 'Unavailable'}
    {thread}
  {:else if $box.status == 'Loading'}
    <div>
      Loading
    </div>
  {:else if $box.status == 'Ready'}
    <div>
      Ready - to load active thread
    </div>
  {:else if $box.status == 'Error'}
    <div>
      Error
    </div>

  {/if}
  </div>

</div>
