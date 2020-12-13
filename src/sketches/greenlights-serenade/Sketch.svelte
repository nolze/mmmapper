<script context="module">
  import { Serenade } from '../../stageSets';

  export const stageSetup = {
    stageSet: Serenade,
    camera: {
      position: [0, -600 * 0.8, 600 * 0], // [0 + 150, -600 * 0.5 * 1.5, 400 * 0.5],
    },
    projector: {
      position: [0, -512, -50], // [0 + 150, -600 * 0.5 * 1.5, 400 * 0.5],
      lookAt: [0, 0, 100],
    },
  };
</script>

<script>
  import {
    TextElement,
    RectElement,
    FrameElement,
    FloatElement,
  } from '@mmmapper/components';
  // import TextElement from '../../components/elements/TextElement.svelte';
  // import RectElement from '../../components/elements/RectElement.svelte';
  // import FrameElement from '../../components/elements/FrameElement.svelte';
  // import FloatElement from '../../components/elements/FloatElement.svelte';
  import store from '../../store';

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
      chars = ['', '', '', '', '', ''];
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
  fill={isChorus ? 0xeeeeee : 0x160a2b}
  brightness={1} />

<FloatElement
  x={60}
  y={0}
  width={480}
  height={450}
  n={100}
  shape="circle"
  fill={null}
  randomFill={true}
  hue={isChorus ? 'green' : 'blue'}
  delta={0.4}
  direction={isChorus ? 'right' : 'up'} />

<FrameElement
  x={60}
  y={120}
  width={480}
  height={250}
  scale={0.5 + 0.5 * step4(scale)}
  color={0xffffff}
  filters={[]} />

{#each chars as char, i}
  <TextElement
    text={char}
    style={styles[i]}
    x={150 + i * 50}
    y={200}
    width={50}
    height={50}
    fontSize={20}
    fill={isChorus ? green : 0xffffff}
    textStyle={{ lineJoin: 'bevel', strokeThickness: 2, fill: 0xffffff }} />
{/each}
