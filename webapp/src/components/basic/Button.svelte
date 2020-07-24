<script>
  let className;
  export {className as class};
</script>
<button
  on:click
  class="{`${className} button !high m-2`}"
>
  <slot></slot>
</button>
