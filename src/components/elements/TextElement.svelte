<script>
  import { getContext } from 'svelte';

  import PIXI, {
    PIXI_CONTEXT,
    DragManager,
    WarpContainer,
  } from '../../lib/pixi';

  export let text,
    x,
    y,
    width,
    height,
    style = {
      opacity: 1,
      scale: 1,
    },
    textStyle = {},
    fontSize = 26,
    fill = 0x000000;

  const { getApp, pixiStore } = getContext(PIXI_CONTEXT);
  const app = getApp();

  const dragManager = new DragManager();
  const pixiText = new PIXI.Text(text, { ...textStyle, fontSize, fill });

  export const pixiObj = pixiText;

  let container,
    showHelper = false;

  pixiStore.editMode.subscribe((value) => {
    showHelper = value;
    !!container && container.showHelper(value);
  });

  $: {
    pixiText.tint = fill;
  }

  function setup() {
    let bg = new PIXI.Graphics();
    bg.lineStyle(0);
    bg.drawRect(0, 0, width, height);
    bg.addChild(pixiText);

    container = new WarpContainer(bg, app.renderer, app.screen, showHelper);
    container.x = x;
    container.y = y;

    dragManager.makeDraggable(container.group, container.sprite);
    app.stage.addChild(container.group);

    app.ticker.add(() => {
      pixiText.text = text;
      pixiText.alpha = style.opacity;
      pixiText.setTransform(
        width / 2 - (fontSize * style.scale) / 2,
        height / 2 - (fontSize * style.scale) / 2,
        style.scale,
        style.scale,
      );
      container.update();
    });
  }

  setup();
</script>
