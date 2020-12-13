<script>
  // import { Canvas } from '@mmmapper/components';
  import store from '../store';
  import { writable } from 'svelte/store';

  import { debounce } from 'lodash-es';
  import Spinner from 'svelte-spinner';

  /* Args */
  export let source = '',
    canvas = null;
  let editModeProp;
  export { editModeProp as editMode };

  const editMode = writable(editModeProp);
  $: {
    editMode.set(editModeProp);
  }

  /* Params */
  let component = {
    id: 0,
    name: 'App',
    type: 'svelte',
    source: source,
  };
  let components = [component];
  let compiled, shouldUpdate, isCompiling;
  let app;

  /* DOM elements */
  let el;

  const worker = new Worker('./build/workers/repl.js');

  worker.addEventListener('message', (event) => {
    compiled = event.data;
    isCompiling = false;
    shouldUpdate = true;
  });

  function compile(_components) {
    isCompiling = true;
    worker.postMessage(_components);
  }

  const debouncedCompile = debounce((cs) => compile(cs), 1000);

  function update(_compiled) {
    shouldUpdate = null;

    if (!el) return;

    const blob = new Blob([_compiled], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);

    import(url).then(({ default: App }) => {
      if (app) app.$destroy();

      el.innerHTML = '';
      app = new App({
        target: el,
        props: {
          canvas,
          editMode,
          store,
        },
      });
    });
  }

  $: if (source) {
    component.source = source;
    debouncedCompile(components);
  }

  $: shouldUpdate && update(compiled);
</script>

<style>
  /* .output {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .output > .loader {
    background: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
  }

  :global(.output canvas) {
    background: rgba(0, 0, 0, 0.8);
    object-fit: contain;
    width: 100%;
    height: 100%;
  } */
</style>

<div bind:this={el} />
{#if isCompiling}
  <div
    class="z-10 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
    <Spinner size="70" speed="2500" color="#319795" thickness="3" gap="40" />
  </div>
{/if}
<!-- <div class="output border">
  {#if canvas === null}
    <div class="loader" />
  {/if}
  <Canvas bind:canvas width="600" height="400">
    <div bind:this={el} />
  </Canvas>
</div> -->
