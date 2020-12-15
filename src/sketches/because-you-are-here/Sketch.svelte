<script context="module">
  import { RandomBoxes2 } from '../../stageSets';

  export const stageSetup = {
    stageSet: RandomBoxes2,
    camera: {
      position: [0 + 150, -600 * 0.5 * 2.1, 400 * 0.5], // [0 + 150, -600 * 0.5 * 1.5, 400 * 0.5],
    },
    projector: {
      position: [0, -512, 0], // [0 + 150, -600 * 0.5 * 1.5, 400 * 0.5],
    },
  };
</script>

<script>
  import {
    TextElement,
    RectElement,
    FloatElement,
    FrameElement,
  } from '@mmmapper/components';
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

  let chars = ['', '', '', '', '', '', '', ''];
  let charsIndex = 0;
  let styles = [{}, {}, {}, {}, {}, {}, {}, {}];
  let charsPos = [
    [0 - 30, 0 - 20],
    [100 - 20, 0 - 50],
    [200 + 20, -30],
    [300 + 30, 0 - 20],
    [0 - 40, 100],
    [100 - 20, 100],
    [200 + 20, 100],
    [300 + 40, 100],
  ];
  charsPos.forEach((v, i) => {
    charsPos[i][0] += 100;
    charsPos[i][1] += 50;
  });

  let phraseEnd = false;

  store.char.subscribe((newChar) => {
    if (!newChar) return;
    if (phraseEnd) {
      chars = ['', '', '', '', '', '', '', ''];
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

<FloatElement
  x={60}
  y={0}
  width={480}
  height={450}
  n={50}
  shape="triangle"
  hue={isChorus ? 'pink' : null}
  fill={null}
  randomFill={true}
  delta={0.4}
  direction={isChorus ? 'right' : 'zoom'} />

<FrameElement
  x={450}
  y={150}
  offset={[[-10, -10], [10, 10], [-10, 20], [-30, 0]]}
  width={100}
  height={100}
  scale={0.5 + 0.5 * step4(scale)}
  color={0xffffff} />

<FrameElement
  x={180}
  y={0}
  offset={[[0, 0], [10, 10], [10, 20], [-10, 10]]}
  width={100}
  height={100}
  scale={0.5 + 0.5 * step4(scale)}
  color={0xffffff} />

{#each chars as char, i}
  <TextElement
    text={char}
    style={styles[i]}
    x={charsPos[i][0]}
    y={charsPos[i][1]}
    width={100}
    height={100}
    fontSize={60}
    fill={0xffffff}
    textStyle={{ lineJoin: 'bevel', strokeThickness: 2, fill: 0xffffff }} />
{/each}
