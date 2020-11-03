<script>
  import { mdiStopCircleOutline, mdiSkipNextCircleOutline } from '@mdi/js';

  import { control } from '../lib/textalive';
  import PlayControl from './PlayControl.svelte';

  export let animateWord, animateChar, handlers, songUrl;
</script>

<div class="flex items-center">
  <PlayControl {animateWord} {animateChar} {handlers} {songUrl} />
</div>
<div class="flex items-center ml-1">
  <button
    on:click={() => {
      control.cue();
    }}>
    <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
      <path fill="#ffffff" d={mdiSkipNextCircleOutline} />
    </svg>
  </button>
</div>
<div class="flex items-center ml-1">
  <button
    on:click={() => {
      control.stop();
    }}>
    <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
      <path fill="#ffffff" d={mdiStopCircleOutline} />
    </svg>
  </button>
</div>
