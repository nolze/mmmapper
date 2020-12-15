<script>
  import { onMount } from 'svelte';
  import { CodeJar } from 'codejar';
  // import { withLineNumbers } from 'codejar/linenumbers';
  import Prism from 'prismjs';
  import 'prism-svelte';

  export let code = '';

  let el;
  let jar;

  onMount(() => {
    jar = CodeJar(el, Prism.highlightElement, {
      tab: '    ',
    });

    jar.updateCode(code);

    jar.onUpdate((_code) => {
      code = _code;
    });
  });
</script>

<style>
  .input-outer {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .editor {
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 400;
    height: 100%;
    resize: none !important;
    width: 100%;
    letter-spacing: normal;
    line-height: 20px;
    padding: 10px;
    tab-size: 4;
  }

  :global(.input-outer .codejar-wrap) {
    height: 100%;
  }
</style>

<div class="input-outer">
  <div class="editor language-svelte" bind:this={el} />
</div>
