<script>
  import { getContext } from 'svelte';

  import PIXI, { PIXI_CONTEXT, DragManager } from '../../lib/pixi';

  /* Args */
  export let x = 0,
    y = 0,
    width,
    height,
    fill = 0xffffff,
    delta = 0.2;

  const { getApp } = getContext(PIXI_CONTEXT);
  const app = getApp();

  const drag = new DragManager();
  const graphics = new PIXI.Graphics();

  function setup() {
    graphics.lineStyle(0);
    graphics.beginFill(fill).drawRect(0, 0, width, height).endFill();
    graphics.x = x;
    graphics.y = y + height;
    drag.makeDraggable(graphics);
    app.stage.addChild(graphics);
  }

  setup();

  function tick() {
    graphics.y = (height + graphics.y + -delta) % height;
  }

  app.ticker.add((time) => {
    tick();
  });
</script>
