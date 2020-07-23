<script>
  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher();
  export let closable;
</script>

<!-- TODO tailwindify class -->
<div
  class="modal-background"
  on:click="{() => dispatch(closable ? 'close' : '')}"
>
  <div class="modal-main border border-indigo-800 bg-gray-500 text-lg flex justify-center items-center text-indigo-500">
    <slot/>
  </div>
</div>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 20;
  }

  .modal-main {
    position: relative;
    left: 30vw;
    top: 20vh;
    width: calc(40vw);
    height: calc(30vh);
    overflow: auto;
    border-radius: 0.2em;
  }
</style>
