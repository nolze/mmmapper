<script>
  import { getContext, onMount } from 'svelte';
  import randomcolor from 'randomcolor';

  import PIXI, {
    PIXI_CONTEXT,
    DragManager,
    WarpContainer,
  } from '../lib/pixi/index.js';

  /* Args */
  let shapeStyle = 'circle';
  export { shapeStyle as shape };

  export let x = 0,
    y = 0,
    offset = [],
    width,
    height,
    n = 20,
    fill,
    randomFill = false,
    hue = null,
    alpha = 0.5,
    delta = 0.2,
    direction = 'up';

  const directionMap = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 },
  };

  console.log('FloatElement loaded');

  const { getApp, pixiStore } = getContext(PIXI_CONTEXT);
  const app = getApp();

  const dragManager = new DragManager();

  let container,
    showHelper = false;
  export const pixiObj = container;

  pixiStore.editMode.subscribe((value) => {
    showHelper = value;
    !!container && container.showHelper(value);
  });

  let shapes = [];

  const presetPalette = randomcolor({
    count: 8,
    hue: hue,
    alpha: alpha,
  }).map((v) => parseInt(v.substr(1), 16));

  let palette = presetPalette;

  let currentHue = hue;

  $: {
    if (hue !== currentHue) {
      palette = randomcolor({
        count: 8,
        hue: hue,
        alpha: alpha,
      }).map((v) => parseInt(v.substr(1), 16));
      !!shapes.length &&
        shapes.map((v, i) => {
          shapes[i].tint = palette[Math.floor(palette.length * Math.random())];
        });
      currentHue = hue;
    }
  }

  $: {
    !!fill &&
      !!shapes.length &&
      shapes.map((v, i) => {
        shapes[i].tint = fill;
      });
  }

  onMount(() => {
    console.log('FloatElement mounted');

    let bg = new PIXI.Graphics();
    bg.lineStyle(0, 0xcccccc);
    bg.beginFill(0xffffff, 0.0001).drawRect(0, 0, width, height).endFill();

    for (let i = 0; i < n; i++) {
      const shape = new PIXI.Graphics();
      const shapeX = width * (1 - Math.random()),
        shapeY = height * (1 - Math.random());
      let shapeFill = fill;
      if (!fill && randomFill) {
        shapeFill = palette[Math.floor(palette.length * Math.random())];
      }
      if (shapeStyle === 'line') {
        shape.beginFill(shapeFill).drawRect(0, 0, 2, 50).endFill();
      } else if (shapeStyle === 'triangle') {
        shape
          .beginFill(shapeFill)
          .moveTo(0, 0)
          .lineTo(50, 25)
          .lineTo(0, 50)
          .lineTo(0, 0)
          .endFill();
      } else {
        shape.beginFill(shapeFill).drawCircle(0, 0, 10).endFill();
      }
      shape.x = shapeX; // NOTE: Don't use x, y in drawRect() or the like
      shape.y = shapeY;
      shape.initialX = shapeX;
      shape.initialY = shapeY;
      shapes.push(shape);
      bg.addChild(shape);
    }

    container = new WarpContainer(bg, app.renderer, app.screen, showHelper);
    container.x = x;
    container.y = y;
    container.setOffset(...offset);

    dragManager.makeDraggable(container.group, container.sprite);
    app.stage.addChild(container.group);

    let size = 50;

    function tick() {
      if (direction === 'up' || direction === 'down') {
        shapes.map((v, i) => {
          shapes[i].y =
            (height + (shapes[i].y + directionMap[direction].y * delta)) %
            height;
        });
      } else if (direction === 'left' || direction === 'right') {
        shapes.map((v, i) => {
          shapes[i].x =
            (width + (shapes[i].x + directionMap[direction].x * delta * 1.5)) %
            width;
        });
      } else if (direction === 'zoom') {
        shapes.map((v, i) => {
          let ratio = shapes[i].scale.x - 1 + 0.01;
          if (shapes[i].scale.x === 1 || ratio >= 1) {
            ratio = -0.5 * Math.random();
          }
          let scale = 1 + ratio;
          // shapes[i].scale.set(zoomX, zoomY);
          shapes[i].setTransform(
            shapes[i].initialX + (size - size * scale) / 2,
            shapes[i].initialY + (size - size * scale) / 2,
            scale,
            scale,
          );
          shapes[i].alpha = 2 - scale;
          // if (i === 0) console.log(shapes[i].scale.x, shapes[i].scale.y);
        });
      }
    }

    const update = () => {
      container.update();
      tick();
    };

    app.ticker.add(update);

    pixiStore.destructors.update((current) => [
      ...current,
      () => {
        app.ticker.remove(update, this);
        console.log('RectElement destroyed');
      },
    ]);
  });
</script>
