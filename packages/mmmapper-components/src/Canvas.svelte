<script>
  /* Args */
  export let width, height;
  export let style = "";
  let className = "";
  export { className as class };
  export let canvas = null; // DOM element
</script>

<canvas bind:this={canvas} {width} {height} class={className} {style} />
{#if canvas}
  <slot />
{/if}
