<script>
  import { onMount, getContext } from 'svelte';
  import PIXI, { PIXI_CONTEXT } from './lib/pixi/index.js';

  const { getApp, pixiStore } = getContext(PIXI_CONTEXT);
  const app = getApp();

  console.log('SketchWrapper loaded');

  onMount(() => {
    console.log('SketchWrapper mounted');

    app.ticker = PIXI.Ticker.shared;
    app.ticker.autoStart = false;
    app.stage = new PIXI.Container();
    app.ticker.start();

    pixiStore.sketchWrapperDestructor.set(() => {
      app.ticker.stop();
      app.stage.destroy(); // TODO: Should be app.stage.destroy(true);
      console.log('SketchWrapper destroyed');
      return true;
    });

    // TODO: Destroy under SketchWrapper while keeping Screen
    // return () => {
    //   if (app.stage) {
    //     app.ticker.stop();
    //     app.stage.destroy(); // TODO: Should be app.stage.destroy(true);
    //     console.log('SketchWrapper destroyed');
    //     return true;
    //   }
    // };
  });
</script>

{#if app.stage}
  <slot />
{/if}
