<script>
  import { getContext } from 'svelte';

  import PIXI, {
    PIXI_CONTEXT,
    DragManager,
    WarpContainer,
  } from '../../lib/pixi';

  export let x = 0,
    y = 0,
    width,
    height,
    lineWidth = 4,
    color = 0xffffff,
    delta = 0.2,
    borderWidth = 0,
    borderColor = 0xffffff;

  const { getApp, pixiStore } = getContext(PIXI_CONTEXT);
  const app = getApp();

  let container,
    showHelper = false;

  pixiStore.editMode.subscribe((value) => {
    showHelper = value;
    !!container && container.showHelper(value);
  });

  let bg, line;

  function setup() {
    bg = new PIXI.Graphics();
    bg.lineStyle(borderWidth, borderColor);
    bg.drawRect(0, 0, width, height);
    bg.hitArea = new PIXI.Rectangle(0, 0, width, height);

    line = new PIXI.Graphics();
    line.beginFill(color).drawRect(0, 0, width, lineWidth).endFill();
    bg.addChild(line);

    container = new WarpContainer(bg, app.renderer, app.screen, showHelper);
    container.x = x;
    container.y = y;

    const dragManager = new DragManager();
    dragManager.makeDraggable(container.group, container.sprite);
    app.stage.addChild(container.group);
  }

  setup();

  function tick() {
    line.y = (line.y + delta) % height;
  }

  app.ticker.add((time) => {
    tick();
    container.update();
  });
</script>
