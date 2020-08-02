<script>
  let className;
  export {className as class};
</script>
<button
  on:click
  class="{`${className} button`}"
>
  <slot></slot>
</button>
