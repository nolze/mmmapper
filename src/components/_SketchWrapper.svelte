<script>
  import { onMount, getContext } from 'svelte';
  import PIXI, { PIXI_CONTEXT } from '../lib/pixi';

  const { getApp } = getContext(PIXI_CONTEXT);
  const app = getApp();

  onMount(() => {
    app.ticker = PIXI.Ticker.shared;
    app.ticker.autoStart = false;
    app.stage = new PIXI.Container();
    app.ticker.start();
    return () => {
      app.ticker.stop();
      app.stage.destroy(); // TODO: Should be app.stage.destroy(true);
      app.stage = null;
    };
  });
</script>

{#if app.stage}
  <slot />
{/if}
