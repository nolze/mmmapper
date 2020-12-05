<script>
  import ProjectorWindow from './ProjectorWindow.svelte';
  import Screen from './components/Screen.svelte';
  import SketchWrapper from './components/SketchWrapper.svelte';
  import Stage from './components/Stage.svelte';
  import TextAliveControls from './components/TextAliveControls.svelte';
  import store, { textaliveStore } from './store';

  import BecauseSketch, {
    stageSetup as becauseStageSetup,
  } from './sketches/because-you-are-here/Sketch.svelte';
  import BlessSketch, {
    stageSetup as blessStageSetup,
  } from './sketches/bless-your-breath/Sketch.svelte';
  import GreenlightsSketch, {
    stageSetup as greenlightsStageSetup,
  } from './sketches/greenlights-serenade/Sketch.svelte';

  import {
    mdiProjectorScreen,
    mdiProjector,
    mdiPlaylistPlay,
    mdiTune,
    mdiHelpCircleOutline,
  } from '@mdi/js';

  /* DOM elements */
  let screen;

  /* Params */
  let showScreen = false;
  let showPlaylist = true;
  let isProjectorMode = false;
  let textaliveInitialized = false;
  let menuOpen = {
    resolution: false,
    help: false,
  };

  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  textaliveStore.manager.subscribe((manager) => {
    if (showPlaylist && !textaliveInitialized) {
      if (manager) {
        textaliveInitialized = true;
        showPlaylist = false;
      }
    }
  });

  const defaultSongs = [
    {
      title: '愛されなくても君がいる / ピノキオピー feat. 初音ミク',
      url: 'https://www.youtube.com/watch?v=ygY2qObZv24',
      stageSetup: becauseStageSetup,
      sketch: BecauseSketch,
    },
    {
      title: 'ブレス・ユア・ブレス / 和田たけあき feat. 初音ミク',
      url: 'https://www.youtube.com/watch?v=a-Nf3QUFkOU',
      stageSetup: blessStageSetup,
      sketch: BlessSketch,
    },
    {
      title: 'グリーンライツ・セレナーデ / Omoi feat. 初音ミク',
      url: 'https://www.youtube.com/watch?v=XSLhsjepelI',
      stageSetup: greenlightsStageSetup,
      sketch: GreenlightsSketch,
    },
  ];
  // 'https://www.youtube.com/watch?v=KdNHFKTKX2s'; // 四角い地球を丸くする
  const songs = defaultSongs;

  let activeSong = songs[0];

  const animateWord = (now, unit) => {
    // let latency = 100; // 100;
    // if (unit.contains(now + latency)) {
    //   store.word.set(unit.text);
    // }
  };

  let lastChar;

  const animateChar = (now, unit) => {
    let latency = 100; // 100;
    if (unit.contains(now + latency) && lastChar !== unit) {
      // TODO: Skip same char?
      // store.char.set(unit.text);
      store.char.set(unit);
      lastChar = unit;
    }
  };

  const beatHandler = (now, beat) => {
    store.beat.progress.set(beat.progress(now));
    store.beat.position.set({ position: beat.position, length: beat.length });
  };

  const chorusHandler = (_now, isChorus) => {
    store.chorus.now.set(isChorus);
  };

  const vocalAmplitudeHandler = (_now, vocalAmplitudeRatio) => {
    store.vocalAmplitude.ratio.set(vocalAmplitudeRatio);
  };

  function openProjectorWindow() {
    const win = window.open('', null, 'width=600,height=400,status');
    const head = document.head.cloneNode(true);
    const projectorWindow = new ProjectorWindow({
      target: win.document.body,
      props: {
        self: win,
        head,
        screen,
      },
    });
  }

  function setResolution(value) {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('hd', value);
    } else {
      params.delete('hd');
    }
    window.location.search = params.toString();
  }
</script>

<style>
  :global(body) {
    background: #000;
  }

  :global(canvas:focus) {
    @apply outline-none;
  }

  @media (hover: none) {
    #control-help {
      display: none;
    }
  }

  .link {
    @apply text-blue-600 underline;
  }

  .playlist .item {
    @apply px-2 py-1 truncate cursor-pointer;
  }

  .playlist .item:hover {
    @apply bg-teal-600;
  }

  .playlist .item.active {
    @apply bg-teal-600;
  }

  .menu .button {
    @apply border border-gray-800 rounded bg-gray-900;
  }

  .menu .button:hover {
    @apply bg-teal-600;
  }

  .menu .button.disabled,
  .button.disabled:hover {
    @apply border border-gray-800 rounded bg-gray-900;
  }
</style>

<main>
  <div class="absolute z-50 top-0 left-0 w-auto max-w-full px-3">
    <div
      style="max-width:360px;"
      class="w-full md:mr-0 md:w-auto mt-3 border border-gray-700 bg-black bg-opacity-25 rounded text-white flex flex-col">
      <div class="h-12 flex items-center">
        <div class="flex items-center ml-3 mr-1">
          <div class="flex items-center mr-2">
            <button
              on:click={() => {
                showPlaylist = !showPlaylist;
              }}>
              <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
                <path fill="#ffffff" d={mdiPlaylistPlay} />
              </svg>
            </button>
          </div>
          <TextAliveControls
            {animateWord}
            {animateChar}
            handlers={{ beatHandler, chorusHandler, vocalAmplitudeHandler }}
            songUrl={activeSong.url} />
        </div>
        <h1 class="italic ml-1 mr-4 -mt-1 text-2xl text-white inline-block">
          mmmapper
        </h1>
      </div>
      {#if showPlaylist}
        <div class="playlist flex flex-col px-2 pt-3 pb-2">
          {#each songs as song, i}
            <div
              class:active={song === activeSong}
              class="item"
              class:mt-1={i > 0}
              on:click={() => {
                activeSong = song;
              }}>
              {song.title}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <div
    id="control-help"
    class="absolute z-50 top-0 right-0 hidden md:inline-block">
    <div class="mr-3 mt-3 flex items-center">
      <div class="text-sm text-white">平行移動: Shift + ドラッグ</div>
    </div>
  </div>
  {#if screen}
    <div class:hidden={isProjectorMode}>
      <Stage {screen} stageSetup={activeSong.stageSetup} />
    </div>
    <div
      class="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
      class:hidden={!isProjectorMode}
      on:click={() => {
        isProjectorMode = false;
      }}>
      <div class="text-3xl text-white">クリックで復帰</div>
    </div>
  {/if}
  <div class="absolute z-50 bottom-0 left-0">
    <div class="mb-3 ml-3">
      <div
        class:hidden={!showScreen}
        class="border mb-2 absolute max-w-full"
        style="bottom:100%;">
        <Screen
          bind:this={screen}
          editMode={showScreen}
          width="600"
          height="400">
          {#if activeSong.sketch}
            {#key activeSong.sketch}
              <SketchWrapper>
                <svelte:component this={activeSong.sketch} />
              </SketchWrapper>
            {/key}
          {/if}
        </Screen>
      </div>
      <div class="menu inline-block flex items-center">
        <div class="hidden md:inline-block">
          <button on:click={() => (showScreen = !showScreen)} class="button">
            <div class="inline-block flex items-center mx-2 my-1">
              <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
                <path fill="#ffffff" d={mdiProjectorScreen} />
              </svg>
              <div class="ml-1 text-white">編集</div>
            </div>
          </button>
        </div>
        <div class="ml-2 hidden md:inline-block">
          <button
            on:click={() => {
              openProjectorWindow();
              isProjectorMode = true;
            }}
            class="button"
            class:disabled={isMobile}
            disabled={isMobile}>
            <div class="inline-block flex items-center mx-2 my-1">
              <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
                <path
                  fill={isMobile ? '#2d3748' : '#ffffff'}
                  d={mdiProjector} />
              </svg>
              <div class="ml-1 text-white" class:text-gray-800={isMobile}>
                プロジェクターモード
              </div>
            </div>
          </button>
        </div>
        <div class="md:ml-2">
          <button
            on:click={() => {
              menuOpen.resolution = !menuOpen.resolution;
            }}
            class="button">
            <div class="inline-block flex items-center mx-2 my-1">
              <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
                <path fill="#ffffff" d={mdiTune} />
              </svg>
              <div class="ml-1 text-white">画質</div>
            </div>
          </button>
          <div
            class:hidden={!menuOpen.resolution}
            style="bottom:95%;"
            class="absolute bg-white rounded border flex flex-col">
            <button
              on:click={() => {
                setResolution('full');
              }}
              class="px-2 py-1 hover:bg-teal-300">最大</button>
            <button
              on:click={() => {
                setResolution('2');
              }}
              class="px-2 py-1 hover:bg-teal-300">1200x800</button>
            <button
              on:click={() => {
                setResolution(null);
              }}
              class="px-2 py-1 hover:bg-teal-300">600x400</button>
          </div>
        </div>
        <div class="ml-2">
          <button
            on:click={() => {
              menuOpen.help = !menuOpen.help;
            }}
            class="button">
            <div class="inline-block flex items-center mx-2 my-1">
              <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
                <path fill="#ffffff" d={mdiHelpCircleOutline} />
              </svg>
              <div class="ml-1 text-white">ヘルプ</div>
            </div>
          </button>
          {#if menuOpen.help}
            <div
              class="fixed top-0 bottom-0 left-0 right-0 flex"
              on:click={() => {
                menuOpen.help = false;
              }}>
              <div
                on:click={(ev) => {
                  ev.stopPropagation();
                }}
                class="relative bg-gray-300 border-4 border-gray-800 rounded flex-grow m-8 md:m-32 pt-4 pb-12 px-6 overflow-y-auto">
                <span
                  class="underline text-sm absolute top-0 right-0 mt-2 mr-2"
                  on:click={() => {
                    menuOpen.help = false;
                  }}>閉じる</span>
                <h1 class="text-xl font-bold mb-4">mmmapper</h1>
                <h2 class="text-lg mb-2">本アプリケーションについて</h2>
                <p class="mb-2">
                  mmmapper は TextAlive
                  と連携して音楽情報に基づく表現を行えるプロジェクションマッピングソフトウェアです。
                  「仮想と現実のハイブリッド」がコンセプトで、仮想空間内でだけでなく、プロジェクターを接続すれば実際に投影して楽しむことができます。
                </p>
                <h2 class="text-lg mb-2">利用について</h2>
                <p class="mb-2">
                  本アプリケーションは
                  <a
                    target="_blank"
                    class="link"
                    href="https://developer.textalive.jp/">TextAlive および
                    TextAlive App API</a>
                  を利用しています。 利用にあたっては、<a
                    target="_blank"
                    class="link"
                    href="https://github.com/TextAliveJp/textalive-app-api/blob/master/LICENSE.md">TextAlive
                    App API ライセンス</a>
                  に従って利用規約に同意する必要があります。
                </p>
                <h2 class="text-lg mb-2">操作について</h2>
                <p>
                  <b
                    class="mr-1">仮想プロジェクター</b>黄色の枠で表示されているオブジェクトです。後部をドラッグして移動することができます。
                </p>
                <p />
                <h2 class="text-lg mb-2 mt-2">メニューについて</h2>
                <p>
                  <b class="mr-1">編集 (タブレット/PC)</b>仮想プロジェクターが出力する画面を編集します。
                </p>
                <p>
                  <b class="mr-1">プロジェクターモード (PC)</b>プロジェクター投影用の画面を新しいウィンドウで開きます
                  (Google Chrome推奨)
                  。投影しながらの編集や再生はメインウィンドウから可能です。
                </p>
                <p><b class="mr-1">画質</b>画質を変更します。</p>
                <h2 class="text-lg mb-2 mt-2">リンク</h2>
                <ul class="list-disc pl-8">
                  <li>
                    <a
                      target="_blank"
                      class="link"
                      href="https://github.com/nolze/mmmapper">nolze/mmmapper</a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      class="link"
                      href="https://magicalmirai.com/2020/procon/">初音ミク「マジカルミライ
                      2020」プログラミング・コンテスト</a>
                  </li>
                </ul>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>
