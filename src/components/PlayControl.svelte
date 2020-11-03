<script>
  import {
    mdiPlayCircleOutline,
    mdiPauseCircleOutline,
    mdiCircleSlice1,
    mdiCircleSlice3,
    mdiCircleSlice5,
    mdiCircleSlice7,
  } from '@mdi/js';

  import { TextAliveManager, control } from '../lib/textalive';
  import { textaliveStore } from '../store';

  /* Args */
  export let songSelected = false; // TODO: Refactor
  export let animateWord,
    animateChar,
    handlers = {};
  export let songUrl;

  let currentSongUrl = songUrl;

  /* Params */
  let loading = false,
    loaded = false;
  let playing = false;
  let manager = null;
  let mediaElement;

  const loader = {
    icons: [mdiCircleSlice1, mdiCircleSlice3, mdiCircleSlice5, mdiCircleSlice7],
    index: 0,
    timer: null,
  };

  $: {
    if (loaded && currentSongUrl !== songUrl) {
      control.stop();
      loading = loaded = playing = false;
      manager.dispose();
      manager = null;
      currentSongUrl = songUrl;
      invokePlay();
    }
  }

  textaliveStore.manager.subscribe((value) => {
    manager = value;
  });

  function createTAManager() {
    manager = new TextAliveManager(
      mediaElement,
      animateWord,
      animateChar,
      handlers,
      songUrl,
    );
    textaliveStore.manager.set(manager);
  }

  function invokePlay() {
    if (!loaded) {
      loading = true;
      loader.timer = setInterval(() => {
        loader.index = (loader.index + 1) % loader.icons.length;
      }, 1000);
    }
    if (!manager) {
      createTAManager();
      manager.player.addListener({
        onTimerReady: (_timer) => {
          loading = false;
          clearInterval(loader.timer);
          loader.index = 0;
          loaded = true;
        },
        onStop: () => {
          control.stop();
          playing = false;
        },
      });
    } else {
      playHandler();
    }
  }

  function playHandler() {
    control.play();
    playing = true;
    songSelected = true;
  }

  $: if (loaded) {
    playHandler();
    // setTimeout(() => {
    //   control.pause();
    //   playing = false;
    // }, 1000);
  }
</script>

{#if !playing && !loading}
  <button
    on:click={() => {
      invokePlay();
    }}>
    <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
      <path fill="#ffffff" d={mdiPlayCircleOutline} />
    </svg>
  </button>
{:else if !playing && loading}
  <button>
    <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
      <path fill="#ffffff" d={loader.icons[loader.index]} />
    </svg>
  </button>
{:else}
  <button
    on:click={() => {
      control.pause();
      playing = false;
    }}>
    <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
      <path fill="#ffffff" d={mdiPauseCircleOutline} />
    </svg>
  </button>
{/if}

<div
  style="position:fixed;bottom:20px;right:20px;"
  bind:this={mediaElement}
  id="media" />
