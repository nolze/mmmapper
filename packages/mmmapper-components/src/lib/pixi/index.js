import { PIXI as _PIXI } from '../../../vendor/pixi.js';
let PIXI = (window.PIXI = Object.assign({}, _PIXI)); // https://github.com/pixijs/pixi-projection/issues/66

import EventTarget from '@ungap/event-target'; // For Safari <14 (+ Mobile Safari?)

const PIXI_CONTEXT = {};

function snapAtEdge(obj, screenWidth, screenHeight) {
  // obj.position.x = Math.min(Math.max(obj.position.x, 0), screenWidth);
  // obj.position.y = Math.min(Math.max(obj.position.y, 0), screenHeight);
}

class DragManager extends EventTarget {
  // dragRelFrom;

  constructor(screen) {
    super();
    this.screen = screen;
  }

  _onDragStart(ev) {
    this.data = ev.data;
    // this.alpha = 0.5;
    this.dragging = true;
    this.dragRelFrom = ev.data.getLocalPosition(this.obj); // (ev.currentTarget);
  }

  _onDragEnd() {
    // this.alpha = 1;
    if (!!this.screen) {
      snapAtEdge(this.obj, this.screen.width, this.screen.height);
    }
    this.dragging = false;
    this.data = null;
  }

  _onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.obj.parent);
      this.obj.position.x = newPosition.x - this.dragRelFrom.x;
      this.obj.position.y = newPosition.y - this.dragRelFrom.y;
      this.dispatchEvent(
        new CustomEvent('dragmove', {
          x: this.obj.position.x,
          y: this.obj.position.y,
        }),
      );
    }
  }

  makeDraggable(obj, handleObj) {
    this.obj = obj;
    this.handleObj = handleObj || obj;
    this.obj.interactive = true;
    this.handleObj
      .on('pointerdown', this._onDragStart.bind(this))
      .on('pointerup', this._onDragEnd.bind(this))
      .on('pointerupoutside', this._onDragEnd.bind(this))
      .on('pointermove', this._onDragMove.bind(this));
  }
}

function createMarker(x, y, markerColor) {
  markerColor = markerColor || 0xff0000;
  const square = new PIXI.Sprite(PIXI.Texture.WHITE);
  square.tint = markerColor;
  square.factor = 1;
  square.anchor.set(0.5);
  square.position.set(x, y);
  return square;
}

class WarpContainer {
  // markerColor = 0xff0000;

  constructor(graphics, renderer, screen, showHelper) {
    this.markerColor = 0xff0000;
    this.graphics = graphics;
    this.renderer = renderer;
    this.screen = screen;

    if (typeof showHelper !== 'boolean') showHelper = true;

    this.width = graphics.width;
    this.height = graphics.height;
    this.renderTexture = PIXI.RenderTexture.create(this.width, this.height);

    this.render();

    // this.sprite = new PIXI.projection.Sprite2s(renderTexture);
    this.sprite = new PIXI.projection.Sprite2d(this.renderTexture);
    this.sprite.interactive = true;
    // this.sprite.anchor.set(0.5);

    this.group = new PIXI.Container();

    this.group.addChild(this.sprite);

    /* Add handles */
    this.handleMarkers = [
      createMarker(0, 0, this.markerColor),
      createMarker(this.width, 0, this.markerColor),
      createMarker(this.width, this.height, this.markerColor),
      createMarker(0, this.height, this.markerColor),
    ];

    this.handleMarkers.forEach((s) => {
      const dragManager = new DragManager(this.screen);
      dragManager.makeDraggable(s);
      dragManager.addEventListener('dragmove', () => {
        this.drawBorder();
      });
      this.group.addChild(s);
      s.visible = showHelper;
    });

    this.markerPositions = this.handleMarkers.map((s) => {
      return s.position;
    });

    /* Add border */
    this.borderMarker = new PIXI.Graphics();
    this.group.addChild(this.borderMarker);
    if (showHelper) this.drawBorder();
  }

  get x() {
    return this.group.x;
  }

  set x(x) {
    this.group.x = x;
  }

  get y() {
    return this.group.y;
  }

  set y(y) {
    this.group.y = y;
  }

  setOffset(tl, tr, br, bl) {
    this.handleMarkers[0].x += !!tl && (tl[0] || 0);
    this.handleMarkers[0].y += !!tl && (tl[1] || 0);
    this.handleMarkers[1].x += !!tr && (tr[0] || 0);
    this.handleMarkers[1].y += !!tr && (tr[1] || 0);
    this.handleMarkers[2].x += !!br && (br[0] || 0);
    this.handleMarkers[2].y += !!br && (br[1] || 0);
    this.handleMarkers[3].x += !!bl && (bl[0] || 0);
    this.handleMarkers[3].y += !!bl && (bl[1] || 0);
    this.update();
  }

  render() {
    this.renderer.render(this.graphics, this.renderTexture);
  }

  drawBorder() {
    this.borderMarker.clear();
    this.borderMarker.lineStyle(1, this.markerColor);
    this.borderMarker.moveTo(
      this.markerPositions[0].x,
      this.markerPositions[0].y,
    );
    this.markerPositions.forEach((v, i) => {
      const j = (i + 1) % this.markerPositions.length;
      const { x, y } = this.markerPositions[j];
      this.borderMarker.lineTo(x, y);
      this.borderMarker.moveTo(x, y);
    });
  }

  update() {
    // this.sprite.proj.mapBilinearSprite(this.sprite, this.markerPositions);
    this.sprite.proj.mapSprite(this.sprite, this.markerPositions);
    this.render();
  }

  showHelper(visible) {
    if (visible) {
      this.drawBorder();
    } else {
      this.borderMarker.clear();
    }
    this.handleMarkers.forEach((s) => {
      s.visible = visible;
    });
  }
}

export default PIXI;
export { PIXI_CONTEXT, DragManager, WarpContainer };
