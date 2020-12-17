<script>
  import { mdiFullscreen } from '@mdi/js';
  import { onMount } from 'svelte';
  import { isLoading, _ } from 'svelte-i18n';

  export let self, head;
  let screenCanvas;
  export { screenCanvas as canvas };

  head = head;

  let canvas;
  let isFullscreen = false;

  onMount(() => {
    self.document.addEventListener('fullscreenchange', () => {
      if (!self.document.fullscreenElement) {
        isFullscreen = false;
      }
    });

    // self.document.head.innerHTML = head.innerHTML;
    self.document.title = 'mmmapper';

    const context = canvas.getContext('2d');

    function animate() {
      context.drawImage(screenCanvas, 0, 0);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });
</script>

<style>
</style>

{#if !$isLoading}
  <div
    id="projector-window"
    style="background:#000;position:fixed;top:0;bottom:0;left:0;right:0;display:flex;">
    <div style="position:absolute;top:0;bottom:0;left:0;right:0;">
      {#if screenCanvas}
        <canvas
          bind:this={canvas}
          width="600"
          height="400"
          style="width:100%;height:100%;object-fit:contain;" />
      {/if}
    </div>
  </div>
  <div
    style="position:fixed;left:0px;right:0px;bottom:20px;display:flex;justify-content:center;">
    <div>
      {#if !isFullscreen}
        <button
          class="button"
          style="border-width:1px;border-radius:0.25rem;background-color:#4299e1;cursor:pointer;"
          on:click={() => {
            self.moveTo(25, 25);
            self.resizeTo(self.screen.width - 50, self.screen.height - 50); // true maximize causes halting...
            isFullscreen = true;
          }}>
          <div
            class="flex items-center mx-2 my-1"
            style="display:flex;align-items:center;margin:0.25rem 0.5rem;">
            <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
              <path fill="#ffffff" d={mdiFullscreen} />
            </svg>
            <div
              class="ml-1 text-white"
              style="margin-left:0.25rem;color:#fff;">
              {$_('projector_window.maximize')}
            </div>
          </div>
        </button>
        <button
          class="button ml-4"
          style="border-width:1px;border-radius:0.25rem;background-color:#4299e1;cursor:pointer;"
          on:click={() => {
            self.document.documentElement.requestFullscreen();
            // canvas.requestFullscreen();
            isFullscreen = true;
          }}>
          <div
            class="flex items-center mx-2 my-1"
            style="display:flex;align-items:center;margin:0.25rem 0.5rem;">
            <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
              <path fill="#ffffff" d={mdiFullscreen} />
            </svg>
            <div
              class="ml-1 text-white"
              style="margin-left:0.25rem;color:#fff;">
              {$_('projector_window.fullscreen')}
            </div>
          </div>
        </button>
      {/if}
    </div>
  </div>
{/if}
