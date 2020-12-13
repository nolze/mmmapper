<script>
  import { getContext, onMount } from 'svelte';

  import PIXI, {
    PIXI_CONTEXT,
    DragManager,
    WarpContainer,
  } from '../lib/pixi/index.js';

  /* Args */
  export let x = 0,
    y = 0,
    offset = [],
    width,
    height,
    fill = 0xffffff,
    brightness = null,
    filters = [],
    scale = 1,
    position = 'center',
    lineWidth = null,
    lineColor = null;

  const { getApp, pixiStore } = getContext(PIXI_CONTEXT);
  const app = getApp();

  const dragManager = new DragManager();

  function getTransform(position, scale, obj, width, height) {
    let transform = () => {};

    if (position === 'center') {
      transform = () => {
        obj.setTransform(
          (1 + width - width * scale) / 2,
          (1 + height - height * scale) / 2,
          scale,
          scale,
        );
      };
    } else if (position === 'bottom') {
      transform = () => {
        obj.setTransform(0, height - height * scale, 1, scale);
      };
    }
    return transform;
  }

  let container,
    showHelper = false;
  let rect;

  pixiStore.editMode.subscribe((value) => {
    showHelper = value;
    !!container && container.showHelper(value);
  });

  onMount(() => {
    console.log('RectElement mounted');

    let bg = new PIXI.Graphics();
    if (lineWidth) {
      bg.lineStyle(lineWidth, lineColor);
      bg.drawRect(0, 0, width, height);
    }

    rect = new PIXI.Graphics();
    rect.lineStyle(0);
    rect.beginFill(fill, 1).drawRect(0, 0, width, height).endFill();
    rect.filters = filters;
    bg.addChild(rect);

    container = new WarpContainer(bg, app.renderer, app.screen, showHelper);
    container.x = x;
    container.y = y;

    container.setOffset(...offset);

    dragManager.makeDraggable(container.group, container.sprite);
    app.stage.addChild(container.group);

    const transform = getTransform(position, scale, rect, width, height);

    let r, g, b;

    const update = function () {
      container.update();
      transform();
      if (brightness) {
        r = Math.ceil((fill >> 16) * brightness);
        g = Math.ceil(((fill >> 8) & 255) * brightness);
        b = Math.ceil((fill & 255) * brightness);
        rect.tint = ((1 << 24) + (r << 16) + (g << 8) + b) & 0xffffff;
      }
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
