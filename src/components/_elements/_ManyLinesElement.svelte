<script>
  import { getContext } from 'svelte';

  import PIXI, { PIXI_CONTEXT, DragManager } from '../../lib/pixi';

  export let x = 0,
    y = 0,
    width,
    height,
    n = 20,
    fill,
    randomFill = false,
    delta = 0.2,
    direction = 'up';

  // console.log(fill);

  const directionMap = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 },
  };

  const { getApp } = getContext(PIXI_CONTEXT);
  const app = getApp();

  const drag = new DragManager();
  const container = new PIXI.Container();
  export const pixiObj = container;

  let bg,
    lines = [];

  const presetPalette = [0xff0000, 0x00ff00, 0x0000ff];

  const palette = presetPalette;

  $: {
    !!fill &&
      !!lines.length &&
      lines.map((v, i) => {
        lines[i].tint = fill;
      });
  }

  function setup() {
    container.interactive = true;

    bg = new PIXI.Graphics();
    bg.lineStyle(1, 0xcccccc);
    bg.beginFill(0xffffff, 0.0001).drawRect(0, 0, width, height).endFill();
    container.addChild(bg);

    for (let i = 0; i < n; i++) {
      const line = new PIXI.Graphics();
      const lineX = width * (1 - Math.random()),
        lineY = height * (1 - Math.random());
      if (!fill && randomFill) {
        line
          .beginFill(palette[Math.floor(palette.length * Math.random())])
          .drawRect(0, 0, 2, 50)
          .endFill();
      } else {
        line.beginFill(fill).drawRect(0, 0, 2, 50).endFill();
      }
      line.x = lineX; // NOTE: Don't use x, y in drawRect() or the like
      line.y = lineY;
      lines.push(line);
      container.addChild(line);
    }

    container.x = x;
    container.y = y;

    drag.makeDraggable(container);
    app.stage.addChild(container);
  }

  setup();

  function tick() {
    if (direction === 'up' || direction === 'down') {
      lines.map((v, i) => {
        lines[i].y =
          (height + (lines[i].y + directionMap[direction].y * delta)) % height;
      });
    } else if (direction === 'left' || direction === 'right') {
      lines.map((v, i) => {
        lines[i].x =
          (width + (lines[i].x + directionMap[direction].x * delta * 1.5)) % width;
      });
    }
  }

  app.ticker.add(() => {
    tick();
  });
</script>
