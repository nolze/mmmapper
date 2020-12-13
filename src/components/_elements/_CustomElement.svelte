<script>
  import { getContext, onMount } from 'svelte';
  import store from '../../store';

  import PIXI, { PIXI_CONTEXT, DragManager } from '../../lib/pixi';

  export let x = 0,
    y = 0;

  let _effects = [];
  export { _effects as effects };

  const { getApp } = getContext(PIXI_CONTEXT);
  const app = getApp();

  const drag = new DragManager();
  const container = new PIXI.Container();
  export const pixiObj = container;

  function setupPixiObject() {
    container.interactive = true;
    container.x = x;
    container.y = y;
    drag.makeDraggable(container);
    app.stage.addChild(container);
  }

  setupPixiObject();
  const effects = _effects.map(
    (effectClass) => new effectClass(pixiObj, { x, y, height, fill }),
  );

  onMount(() => {
    // NOTE: effects.forEach() causes a performance problem...
    !!effects.length &&
      store.word.subscribe((text) => {
        // effects.forEach((effect) => effect.update(text));
        effects[0].update(text);
      });
  });
</script>
