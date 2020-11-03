<script>
  import TextElement from './components/elements/TextElement.svelte';
  import RectElement from './components/elements/RectElement.svelte';
  import FrameElement from './components/elements/FrameElement.svelte';
  // import ScanlineElement from './components/elements/ScanlineElement.svelte';
  // import ManyLinesElement from './components/elements/ManyLinesElement.svelte';
  import FloatElement from './components/elements/FloatElement.svelte';
  // import TideElement from './components/elements/TideElement.svelte';
  import store from './store';

  // import * as effects from './lib/presetEffects';
  // import { Ease } from 'textalive-app-api';
  // import { lerpArray } from 'canvas-sketch-util/math';
  // import { GlitchFilter, RGBSplitFilter, CrossHatchFilter } from 'pixi-filters';

  import anime from 'animejs/lib/anime.es.js';

  let scale = 1,
    isChorus = false,
    vaRatio = 1e-9;

  const step4 = (n) => {
    if (n > 3 / 4) return 3 / 4;
    if (n > 2 / 4) return 2 / 4;
    if (n > 1 / 4) return 1 / 4;
    if (n >= 0) return 0;
  };
  // store.beat.progress.subscribe((progress) => {
  //   scale = 0.001 + step4(progress); // 0.4 + step(progress) / 8; // 0.4 + Ease.circIn(progress) / 8;
  // });
  store.beat.progress.subscribe((progress) => {
    scale = progress;
  });

  store.chorus.now.subscribe((value) => {
    isChorus = value;
  });

  const green = 0x60c0b7;
  const chorusColor = 0xde49a4;

  let color = 0xffffff;

  $: if (isChorus) {
    color = chorusColor;
  } else {
    color = 0xffffff;
  }

  store.vocalAmplitude.ratio.subscribe((value) => {
    vaRatio = value;
  });

  // let ticked = false;
  // store.beat.position.subscribe(({ position, length }) => {
  //   // console.log(position, length);
  //   if (!ticked && position === length) {
  //     scale = 0.0001 + ((scale + 0.25) % 1.0);
  //     ticked = true;
  //   } else if (position !== length) {
  //     ticked = false;
  //   }
  // });

  // store.word.subscribe((newWord) => {
  //   word = newWord;
  //   style = {
  //     opacity: 1,
  //     scale: 1.5,
  //   };
  //   anime.timeline().add({
  //     targets: style,
  //     opacity: 0,
  //     scale: 1,
  //     duration: 1000,
  //     easing: 'easeOutExpo',
  //     update: () => {
  //       // console.log(style);
  //     },
  //   });
  // });

  let chars = ['', '', '', '', '', ''];
  let charsIndex = 0;
  let styles = [{}, {}, {}, {}, {}, {}];

  let phraseEnd = false;

  store.char.subscribe((newChar) => {
    if (!newChar) return;
    if (phraseEnd) {
      chars = ['', '', '', '', ''];
      charsIndex = 0;
      phraseEnd = false;
    }
    chars[charsIndex] = newChar.text;
    styles[charsIndex] = {
      opacity: 1,
      scale: 1.5,
    };
    anime.timeline().add({
      targets: styles[charsIndex],
      opacity: [1, 0],
      scale: [1, 2],
      duration: 950,
      delay: 950,
      easing: 'easeOutExpo',
      update: () => {},
    });
    charsIndex = (charsIndex + 1) % chars.length;
    if (newChar.parent.parent.lastChar === newChar) {
      phraseEnd = true;
    }
  });
</script>

<!-- <RectElement x={0} y={0} width={600} height={400} color={0x181818} /> -->
<!-- 0x231718 -->
<RectElement
  x={0}
  y={0}
  width={600}
  height={400}
  fill={0x60c0b7}
  brightness={1} />
<!-- <RectElement
  x={100}
  y={100}
  width={100}
  height={100}
  color={0xcccccc}
  effects={[effects.HueEffect]} /> -->

<!-- <ScanlineElement
  x={100}
  y={100}
  width={100}
  height={100}
  lineWidth={4}
  color={0xffffff}
  delta={0.4} /> -->

<!-- <ManyLinesElement
  x={0}
  y={0}
  width={480}
  height={450}
  n={100}
  fill={null}
  randomFill={true}
  delta={0.4}
  direction={isChorus ? 'right' : 'up'} /> -->

<FloatElement
  x={60}
  y={0}
  width={480}
  height={450}
  n={100}
  shape="triangle"
  fill={null}
  randomFill={true}
  delta={0.4}
  direction={isChorus ? 'right' : 'zoom'} />

<!-- <TideElement x={10} y={10} height={300} width={400} delta={0.8} /> -->

<!-- <RectElement
  x={150}
  y={50}
  width={100}
  height={200}
  {scale}
  fill={0x000000}
  position="center" /> -->

<!-- <RectElement x={400} y={150} offset={[[0, -12]]} width={100} height={100} fill={0xffffff} />

<RectElement x={300} y={150} width={100} height={100} fill={0xffffff} />

<RectElement x={200} y={150} width={100} height={100} fill={0xffffff} /> -->

<FrameElement
  x={400}
  y={150}
  width={100}
  height={100}
  scale={0.5 + 0.5 * step4(scale)}
  color={0xffffff}
  filters={[]} />

<!-- <RectElement
  x={200}
  y={150}
  width={100}
  height={100}
  color={0xffffff}
  brightness={1} /> -->

<!--
<TextElement
  text={chars[0]}
  style={styles[0]}
  x={100}
  y={200}
  width={100}
  height={100}
  fontSize={40}
  fill={0xffffff} /> -->

{#each chars as char, i}
  <TextElement
    text={char}
    style={styles[i]}
    x={100 + i * 50}
    y={200}
    width={50}
    height={50}
    fontSize={20}
    fill={isChorus ? chorusColor : 0xffffff}
    textStyle={{ lineJoin: 'bevel', strokeThickness: 2, fill: 0xffffff }} />
{/each}

<!-- <TextElement
  text={'Magical\nMirai\n2020'}
  x={220}
  y={180}
  fontSize={20}
  fill={0xffffff} /> -->

<!-- <TextElement
  text={word}
  {style}
  x={50}
  y={100}
  width={200}
  height={100}
  fill={0xffffff} /> -->
