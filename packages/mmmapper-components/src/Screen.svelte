<script>
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import PIXI, { PIXI_CONTEXT } from './lib/pixi/index.js';
  import 'pixi-projection';

  /* Args */
  export let width, height;
  export let editMode = false;
  export let canvas; // DOM element
  export let status = 'loaded';
  console.log('Screen', { status });

  /* Params */
  let app = null;
  let mounted = false,
    appMounted = false,
    initialized = false;

  export function getCanvasRef() {
    return canvas;
  }

  const sketchWrapperDestructor = writable(() => false),
    destructors = writable([]),
    pixiStore = {
      editMode: writable(false),
      sketchWrapperDestructor,
      destructors,
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

  $: if (canvas) {
    app = new PIXI.Application({
      view: canvas,
      width: width,
      height: height,
      transparent: true, // NOTE: true may result in some unintended white areas
      // backgroundColor: 0xffffff, // 0x1099bb
      resolution: window.devicePixelRatio || 1,
    });

    // app.ticker.autoStart = false;
    // app.ticker = null; // NOTE: Init in components/SketchWrapper.svelte
    // app.stage = null; // NOTE: Init in components/SketchWrapper.svelte
    appMounted = true;
  }

  $: if (mounted && appMounted) {
    status = 'initialized';
    console.log('Screen', { status });
    initialized = true;
  }

  onMount(() => {
    // console.log('Screen mounted');
    mounted = true;

    return () => {
      // console.log($destructors);
      $destructors.forEach((destructor) => destructor());
      if ($sketchWrapperDestructor()) {
        // Destroy only if SketchWrapper exists
        // app.stage.destroy();
        app.destroy();
      }
      initialized = false;
      status = 'destroyed';
      console.log('Screen', { status });
    };
  });
</script>

{#if initialized}
  <slot />
{/if}
