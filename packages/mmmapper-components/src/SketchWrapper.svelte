<script>
  import { onMount, getContext } from 'svelte';
  import PIXI, { PIXI_CONTEXT } from './lib/pixi/index.js';

  const { getApp, pixiStore } = getContext(PIXI_CONTEXT);
  const app = getApp();
  let status = 'loaded';

  console.log('SketchWrapper', { status });

  // app.ticker = PIXI.Ticker.shared;
  // app.ticker.autoStart = false;
  // app.stage = new PIXI.Container();
  app.ticker.start();

  onMount(() => {
    status = 'mounted';
    console.log('SketchWrapper', { status });

    pixiStore.sketchWrapperDestructor.set(() => {
      app.ticker.stop();
      // app.stage.destroy(); // TODO: Should be app.stage.destroy(true);
      status = 'destroyed';
      console.log('SketchWrapper', { status });
      // console.log(app.stage);
      return true;
    });

    status = 'initialized';
    console.log('SketchWrapper', { status });

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

{#if status === 'initialized'}
  <slot />
{/if}
