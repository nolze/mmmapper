<script>
  import { onMount, onDestroy } from 'svelte';

  import * as THREE from 'three';
  import ProjectedMaterial from '../lib/three/ProjectedMaterial';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
  import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

  import { app, config } from '../lib/three-app';
  import {
    Serenade,
    // RandomBoxes,
    RandomBoxes2,
    StandardBoxes,
    Circus,
    // BehindTest,
  } from '../stageSets';

  /* Args */
  export let canvas;
  export let stageSetup;

  /* DOM elements */
  let stageElement;

  const params = new URLSearchParams(window.location.search);
  if (params.get('hd') === '2') {
    config.renderer.size.width *= 2;
    config.renderer.size.height *= 2;
  } else if (params.get('hd') === 'full') {
    config.renderer.size.width = window.innerWidth;
    config.renderer.size.height = window.innerHeight;
    config.renderer.pixelRatio = window.devicePixelRatio;
  }

  let currentStageSetup = stageSetup;

  $: {
    if (stageSetup !== currentStageSetup) {
      app.scene = null;
      app.scene = new THREE.Scene();
      window.removeEventListener('resize', onResize);
      (async () => {
        await init();
        animate();
      })();
      currentStageSetup = stageSetup;
    }
  }

  onMount(async () => {
    await init();
    animate();
  });

  onDestroy(() => {
    // For HMR
    app.scene = null;
    app.scene = new THREE.Scene();
    window.removeEventListener('resize', onResize);
  });

  const setup = {
    renderer: (app, config) => {
      app.renderer = new THREE.WebGLRenderer({
        antialias: config.renderer.antialias,
        alpha: config.renderer.alpha,
      });
      app.renderer.setPixelRatio(config.renderer.pixelRatio);
      app.renderer.setSize(
        config.renderer.size.width,
        config.renderer.size.height,
        config.renderer.size.updateStyle,
      );
      app.renderer.setClearColor(
        config.renderer.clearColor.color,
        config.renderer.clearColor.alpha,
      );
      app.renderer.shadowMap.enabled = true;
      app.renderer.shadowMap.type = THREE.BasicShadowMap;
      // app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      app.composer = new EffectComposer(app.renderer);
    },
    camera: (app, config) => {
      if (config.camera.type === 'perspective') {
        app.camera = new THREE.PerspectiveCamera(
          config.camera.fov,
          config.renderer.size.width / config.renderer.size.height,
          config.camera.near,
          config.camera.far,
        );
        app.camera.up.set(...config.camera.up);
        if (!!stageSetup.camera && stageSetup.camera.position) {
          app.camera.position.set(...stageSetup.camera.position);
        } else {
          app.camera.position.set(...config.camera.position);
        }
        app.camera.lookAt(...config.camera.lookAt);
      }
    },
    orbitControls: (app, config) => {
      const orbit = new OrbitControls(app.camera, app.renderer.domElement);
      // orbit.maxPolarAngle = Math.PI / 2 - 0.1;
      orbit.target.set(0, 0, 0);
      orbit.minDistance = 100;
      orbit.maxDistance = 1500;

      app.orbitControls = orbit;
    },
    pointing: (app, config) => {
      // app.raycaster = new THREE.Raycaster();
      app.mouse = new THREE.Vector2();
    },
  };

  class Projector {
    constructor(camera, x, y, z, config) {
      this.camera = camera;
      // this.camera.up.set(0, 0, 1);
      this.x = x; // 0
      this.y = y; // -512
      this.z = z; // 0
      this.camera.position.set(this.x, this.y, this.z);
      this.camera.up.set(0, 0, 1); // Fix rotation
      if (!!stageSetup.projector && stageSetup.projector.lookAt) {
        this.camera.lookAt(...stageSetup.projector.lookAt);
      } else {
        this.camera.lookAt(0, 0, 0);
      }
      this.helper = new THREE.CameraHelper(this.camera);

      // this.light = new THREE.DirectionalLight(0x404040, 1); // 0xc0c0c0; three.js example: 0x404040
      this.light = new THREE.SpotLight(
        0x404040,
        1,
        config.camera.far,
        Math.PI / 8,
        0,
        0,
      ); // 0x404040; angle = fov in radian
      this.light.up.set(0, 0, 1); // Fix rotation
      this.light.position.set(this.x, this.y, this.z);
      this.light.lookAt(0, 0, 0);
      this.light.castShadow = true;
      this.light.shadow.bias = -0.0001 * 50;
      // // this.light.shadow.mapSize.width = 1024;
      // // this.light.shadow.mapSize.height = 1024;
      this.light.shadow.camera.near = 216;
      this.light.shadow.camera.far = 1024;
      this.light.shadow.camera.fov = Math.PI / 4;
      // let helper = new THREE.CameraHelper(this.light.shadow.camera);
      // app.scene.add(helper);

      this.light.layers.enable(1);

      this.lightHelper = new THREE.SpotLightHelper(this.light);

      this.handle = this._setupHandle();
    }

    update() {
      this.camera.position.set(
        this.handle.position.x,
        this.handle.position.y,
        this.handle.position.z,
      );
      this.camera.lookAt(0, 0, 0);
      this.camera.updateMatrixWorld();
      // this.camera.updateWorldMatrix();
      this.helper.update();

      this.light.position.set(
        this.handle.position.x,
        this.handle.position.y,
        this.handle.position.z,
      );
      this.light.lookAt(0, 0, 0);
      this.lightHelper.update();
    }

    attachDragControls(dragControls) {
      this.dragControls = dragControls;
      this.dragControls.transformGroup = true;
      this.dragControls.addEventListener('drag', () => {
        this.update();
      });
    }

    _setupHandle() {
      // Area
      let geometry = new THREE.SphereGeometry(20, 12, 12),
        material = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
        });
      const projectorHandle = new THREE.Mesh(geometry, material);
      // Marker
      geometry = new THREE.SphereGeometry(5, 8, 8);
      material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      projectorHandle.add(new THREE.Mesh(geometry, material));

      projectorHandle.position.set(this.x, this.y, this.z);
      return projectorHandle;
    }
  }

  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // app.renderer.setPixelRatio(window.devicePixelRatio);
    app.renderer.setSize(width, height);

    app.camera.aspect = width / height;
    app.camera.updateProjectionMatrix();
  }

  let bloomPass,
    mergePass,
    fxaaPass,
    bloomTarget,
    nonBloomTarget,
    antialiasTarget;

  async function init() {
    let texture, material, mesh;

    setup.renderer(app, config);
    stageElement.appendChild(app.renderer.domElement);
    setup.camera(app, config);
    setup.orbitControls(app, config);
    setup.pointing(app, config);

    // https://ics.media/tutorial-three/renderer_resize/
    onResize();
    window.addEventListener('resize', onResize);

    /* Composer */
    // https://discourse.threejs.org/t/solved-effectcomposer-layers/3158/26
    bloomTarget = new THREE.WebGLRenderTarget(
      config.renderer.size.width,
      config.renderer.size.height,
    );
    nonBloomTarget = new THREE.WebGLRenderTarget(
      config.renderer.size.width,
      config.renderer.size.height,
    );
    antialiasTarget = new THREE.WebGLRenderTarget(
      config.renderer.size.width,
      config.renderer.size.height,
    );

    const renderScene = new RenderPass(app.scene, app.camera);

    // bloomComposer = new EffectComposer(app.renderer);
    // bloomComposer.renderToScreen = false;

    // bloomComposer.addPass(renderScene);
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        config.renderer.size.width,
        config.renderer.size.height,
      ),
      1, // strength; 0xc0c0c0/0.4
      0, // emissive light radius, greater is realistic and somewhat darker
      0, // bloom threshold
    );
    // bloomComposer.addPass(bloomPass);

    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
    // differs from https://discourse.threejs.org/t/solved-effectcomposer-layers/3158/26
    mergePass = new ShaderPass(
      new THREE.ShaderMaterial({
        // uniforms: {
        //   baseTexture: { value: null },
        //   bloomTexture: { value: bloomComposer.renderTarget2.texture },
        // },
        uniforms: {
          tDiffuse: { value: null },
          bloomTexture: { value: bloomTarget },
        },
        vertexShader: `varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }`,
        // fragmentShader: `uniform sampler2D baseTexture;
        //   uniform sampler2D bloomTexture;
        //   varying vec2 vUv;
        //   void main() {
        //     gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
        //   }`,
        fragmentShader: `uniform sampler2D tDiffuse;
          uniform sampler2D bloomTexture;
          varying vec2 vUv;
          vec4 getTexture( sampler2D texelToLinearTexture ) {
            return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) );
          }
          void main() {
            gl_FragColor = ( getTexture(tDiffuse) + vec4( 1.0 ) * getTexture( bloomTexture ) );
          }`,
        defines: {},
      }),
      // 'baseTexture',
    );

    // app.composer.addPass(renderScene);
    // app.composer.addPass(mergePass);

    fxaaPass = new ShaderPass(FXAAShader);

    /* Plane */
    app.scene.add(
      (() => {
        material = new THREE.MeshBasicMaterial({
          color: 0x333333, // 0xf8f9fa,
          wireframe: true,
        });
        material.polygonOffset = true;
        material.polygonOffsetFactor = 1;
        mesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(1024, 1024, 32, 32),
          material,
        );
        mesh.position.set(0, 0, -50);
        return mesh;
      })(),
    );

    /* Projector */
    const projectorCamera = new THREE.PerspectiveCamera(
      30,
      // config.renderer.size.width / config.renderer.size.height, // TODO: This must be sketch size
      600 / 400,
      1,
      100,
    );
    if (!!stageSetup.projector && stageSetup.projector.position) {
      app.projector = new Projector(
        projectorCamera,
        ...stageSetup.projector.position,
        config,
      );
    } else {
      app.projector = new Projector(projectorCamera, 0, -512, 0, config);
    }
    app.scene.add(app.projector.helper);
    app.scene.add(app.projector.light);
    app.scene.add(app.projector.lightHelper);

    /* Move projector */
    app.scene.add(app.projector.handle);
    const dragControls = new DragControls(
      [app.projector.handle],
      app.camera,
      app.renderer.domElement,
    );
    dragControls.addEventListener('dragstart', () => {
      app.orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', () => {
      app.orbitControls.enabled = true;
    });
    app.projector.attachDragControls(dragControls);

    /* Projection */
    app.scene.add(
      (() => {
        /* Projected texture */
        texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.offset.set(0, 0);
        // texture.repeat.set(1, 1);

        // material = new THREE.MeshBasicMaterial({ map: texture }); // FOR DEBUG
        app.projectedMaterial = new ProjectedMaterial({
          camera: app.projector.camera,
          texture: texture,
          color: '#000000', // #000 is default emissive color for lambert
        });

        /* Stage */
        let stage = new THREE.Group();
        let stageSet;
        if (!!stageSetup.camera && stageSetup.camera.position) {
          stageSet = new stageSetup.stageSet(app.projectedMaterial);
        } else {
          // let stageSet = new Serenade(app.projectedMaterial); // FOR DEBUG
          // let stageSet = new RandomBoxes(app.projectedMaterial); // FOR DEBUG
          // stageSet = new RandomBoxes2(app.projectedMaterial);
          stageSet = new StandardBoxes(app.projectedMaterial, true);
          // let stageSet = new Circus(app.projectedMaterial);
          // let stageSet = new BehindTest(app.projectedMaterial);
        }
        stage.add(stageSet.mesh);

        stage.traverse((child) => {
          child.layers.enable(1);
        });

        return stage;
      })(),
    );

    /* Lights */
    // app.scene.add(
    //   (() => {
    //     let lights = new THREE.Group();

    //     let ambiLight = new THREE.AmbientLight(0x202020, 1);
    //     lights.add(ambiLight);

    //     lights.traverse((child) => {
    //       child.layers.enable(1);
    //     });

    //     return lights;
    //   })(),
    // );

    app.renderer.autoClear = false;
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    if (!!app.projectedMaterial && app.projectedMaterial.map) {
      app.projectedMaterial.map.needsUpdate = true;
    }
    if (!!app.projectedMaterial && app.projectedMaterial.uniforms) {
      app.projectedMaterial.uniforms.texture.value.needsUpdate = true;
    }
    // app.raycaster.setFromCamera(mouse, camera);

    app.renderer.setRenderTarget(bloomTarget);
    app.renderer.clear();
    app.renderer.clearDepth();
    app.camera.layers.set(1);
    app.renderer.render(app.scene, app.camera);
    // bloomComposer.render(app.renderer, null, bloomTarget, 0, false);
    bloomPass.render(app.renderer, null, bloomTarget, 0, false);

    app.renderer.setRenderTarget(nonBloomTarget);
    app.renderer.clear();
    app.renderer.clearDepth();
    app.camera.layers.set(0);
    app.renderer.render(app.scene, app.camera);

    // app.composer.renderToScreen = true;
    // app.composer.render(app.render, bloomTarget, nonBloomTarget);

    mergePass.renderToScreen = false;
    mergePass.render(app.renderer, antialiasTarget, nonBloomTarget);

    fxaaPass.renderToScreen = true;
    fxaaPass.render(app.renderer, null, antialiasTarget);
  }
</script>

<style>
  #stage :global(canvas) {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh !important;
    object-fit: cover;
  }
</style>

<div bind:this={stageElement} id="stage" />
