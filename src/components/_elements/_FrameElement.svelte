<script>
  import { getContext, onDestroy } from 'svelte';

  import PIXI, {
    PIXI_CONTEXT,
    DragManager,
    WarpContainer,
  } from '../../lib/pixi';

  /* Args */
  export let x = 0,
    y = 0,
    width,
    height,
    offset = [],
    stroke = 0xffffff,
    lineWidth = 1,
    filters = [],
    scale;

  const { getApp, pixiStore } = getContext(PIXI_CONTEXT);
  const app = getApp();

  const dragManager = new DragManager();
  let graphics = new PIXI.Graphics();

  let container,
    showHelper = false;

  pixiStore.editMode.subscribe((value) => {
    showHelper = value;
    !!container && container.showHelper(value);
  });

  function setup() {
    let bg = new PIXI.Graphics();
    bg.lineStyle(lineWidth, stroke);
    bg.drawRect(0, 0, width, height);

    graphics.lineStyle(lineWidth, stroke);
    graphics.beginFill(0x000000, 0).drawRect(0, 0, width, height).endFill();
    graphics.filters = filters;
    bg.addChild(graphics);

    container = new WarpContainer(bg, app.renderer, app.screen, showHelper);
    container.x = x;
    container.y = y;

    container.setOffset(...offset);

    dragManager.makeDraggable(container.group, container.sprite);
    app.stage.addChild(container.group);

    let transform = () => {
      graphics.setTransform(
        (1 + width - width * scale) / 2,
        (1 + height - height * scale) / 2,
        scale,
        scale,
      );
    };

    const update = () => {
      container.update();
      transform();
    };

    app.ticker.add(update);

    onDestroy(() => {
      app.ticker.remove(update);
    });
  }

  setup();
</script>
