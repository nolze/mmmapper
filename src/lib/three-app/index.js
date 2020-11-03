import * as THREE from 'three';

class BaseApp {
  // NOTE: Not working yet in Safari <14
  // renderer;
  // composer;
  // camera;
  // mouse;
  // // raycaster;
  // scene;

  constructor() {
    this.scene = new THREE.Scene();
  }
}

class App extends BaseApp {
  // orbitControls;
  // projector;
  // projectedMaterial;

  constructor() {
    super();
  }
}

const app = new App();

const config = {
  renderer: {
    antialias: false,
    alpha: true,
    pixelRatio: window.devicePixelRatio, // Math.min(1, window.devicePixelRatio / 2), // window.devicePixelRatio, // 0.5
    size: {
      width: 600 * 1, // window.innerWidth,
      height:400 * 1, // window.innerHeight,
      updateStyle: false,
    },
    clearColor: {
      color: 0x000000,
      alpha: 0, // 1,
    },
  },
  camera: {
    type: 'perspective',
    fov: 45,
    near: 1,
    far: 3000,
    up: [0, 0, 1],
    position: [0 + 150, -600 * 0.5 * 1.5, 400 * 0.5], // [0 + 150, -600 * 0.5 * 1.5, 400 * 0.5],
    lookAt: [0, 0, 0],
  },
  orbitControls: {
    enabled: true,
  },
};

export { app, config };
