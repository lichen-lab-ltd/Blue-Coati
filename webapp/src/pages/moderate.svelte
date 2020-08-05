<script>
  import Header from '../components/Header.svelte'
  import mod from '../utils/moderate'
  let postId;
  let isValid = null;
</script>

<div class="flex flex-col items-center bg-gray-800 h-screen">
  <Header />

  <div class="text-lg text-blue-500">Moderate post</div>

  <div class="flex flex-col">
    <input type='text' class='field ~neutral !normal w-auto m-2' placeholder='Post ID' bind:value={postId}>
    <div class="align-middle">
    <label class="switch">
      <input type="radio" name="rad" on:change={() => {isValid = true}}>
      <span class="text-green-500">Valid 👍</span>
    </label>
    <label class="switch">
      <input type="radio" name="rad" on:change={() => {isValid = false}}>
      <span class="text-red-500">Invalid 👎</span>
    </label>
    </div>
    <div 
      on:click={() => {mod(isValid, postId); postId = ''}}
      class={isValid === null ? "button cursor-not-allowed justify-center" : "button bg-gray-800 text-pink-500 border border-pink-500 m-2 justify-center w-auto"}>
      Cast
    </div>
  </div>

</div>
