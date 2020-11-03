<script>
  import { onMount, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import PIXI, { PIXI_CONTEXT } from '../lib/pixi';
  import 'pixi-projection';

  /* Args */
  export let width, height;
  export let editMode = false;

  /* Params */
  let app;

  /* DOM elements */
  let canvas;

  export function getCanvasRef() {
    return canvas;
  }

  const pixiStore = {
    editMode: writable(false),
  };

  $: {
    pixiStore.editMode.set(editMode);
  }

  setContext(PIXI_CONTEXT, {
    getApp: () => {
      return app;
    },
    pixiStore: pixiStore,
  });

  onMount(() => {
    app = new PIXI.Application({
      view: canvas,
      width: width,
      height: height,
      transparent: true, // NOTE: true may result in some unintended white areas
      // backgroundColor: 0xffffff, // 0x1099bb
      resolution: window.devicePixelRatio || 1,
    });

    // const container = new PIXI.Container();
    // app.stage.addChild(container);

    // return () => {
    //   app.destroy();
    // };
  });

  onDestroy(() => {
    app.destroy();
  });
</script>

<style>
  canvas {
    background: rgba(0, 0, 0, 0.8);
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
</style>

<canvas bind:this={canvas} {width} {height} />
{#if app}
  <slot />
{/if}
