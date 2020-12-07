/*! Derived from https://github.com/marcofugaro/codrops-texture-projection and https://github.com/marcofugaro/three-projected-material (MIT) */

import * as THREE from 'three';

function monkeyPatch(shader, { header = '', main = '', ...replaces }) {
  let patchedShader = shader;

  Object.keys(replaces).forEach((key) => {
    patchedShader = patchedShader.replace(key, replaces[key]);
  });

  return patchedShader.replace(
    'void main() {',
    `
    ${header}
    void main() {
      ${main}
    `,
  );
}

export default class ProjectedMaterial extends THREE.ShaderMaterial {
  constructor({ camera, texture, color = 0xffffff, ...options } = {}) {
    if (!texture || !texture.isTexture) {
      throw new Error('Invalid texture passed to the ProjectedMaterial');
    }

    if (!camera || !camera.isCamera) {
      throw new Error('Invalid camera passed to the ProjectedMaterial');
    }

    // make sure the camera matrices are updated
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    camera.updateWorldMatrix();

    // get the matrices from the camera so they're fixed in camera's original position
    // const viewMatrixCamera = camera.matrixWorldInverse.clone();
    // const projectionMatrixCamera = camera.projectionMatrix.clone();
    // const modelMatrixCamera = camera.matrixWorld.clone();

    // const projPosition = camera.position.clone();

    const viewMatrixCamera = camera.matrixWorldInverse; // .clone();
    const projectionMatrixCamera = camera.projectionMatrix; // .clone();
    const modelMatrixCamera = camera.matrixWorld; // .clone();

    const projPosition = camera.position; // .clone();

    super({
      ...options,
      lights: true,
      uniforms: {
        ...THREE.ShaderLib['lambert'].uniforms,
        baseColor: { value: new THREE.Color(color) },
        texture: { value: texture },
        viewMatrixCamera: { type: 'm4', value: viewMatrixCamera },
        projectionMatrixCamera: { type: 'm4', value: projectionMatrixCamera },
        modelMatrixCamera: { type: 'mat4', value: modelMatrixCamera },
        projPosition: { type: 'v3', value: projPosition },
      },

      // NOTE: three.js version dependent
      vertexShader: monkeyPatch(THREE.ShaderChunk['meshlambert_vert'], {
        header: `
          uniform mat4 viewMatrixCamera;
          uniform mat4 projectionMatrixCamera;
          uniform mat4 modelMatrixCamera;

          varying vec4 vWorldPosition;
          varying vec3 vNormal;
          varying vec4 vTexCoords;
          `,
        main: `
          vNormal = mat3(modelMatrix) * normal;
          vWorldPosition = modelMatrix * vec4(position, 1.0);
          vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;
          `,
      }),

      // vertexShader: `
      //     uniform mat4 viewMatrixCamera;
      //     uniform mat4 projectionMatrixCamera;
      //     uniform mat4 modelMatrixCamera;

      //     varying vec4 vWorldPosition;
      //     varying vec3 vNormal;
      //     varying vec4 vTexCoords;

      //     void main() {
      //       vNormal = mat3(modelMatrix) * normal;
      //       vWorldPosition = modelMatrix * vec4(position, 1.0);
      //       vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;
      //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      //     }
      //   `,

      // NOTE: three.js version dependent
      fragmentShader: monkeyPatch(THREE.ShaderChunk['meshlambert_frag'], {
        header: `
          uniform vec3 baseColor;
          uniform sampler2D texture;
          uniform vec3 projPosition;

          varying vec3 vNormal;
          varying vec4 vWorldPosition;
          varying vec4 vTexCoords;
        `,
        'vec4 diffuseColor = vec4( diffuse, opacity );': `
          vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;

          vec4 color = texture2D(texture, uv);

          // this makes sure we don't sample out of the texture
          // TODO handle alpha
          bool inTexture = (max(uv.x, uv.y) <= 1.0 && min(uv.x, uv.y) >= 0.0);
          if (!inTexture) {
            color = vec4(baseColor, 1.0);
          }

          // this makes sure we don't render the texture also on the back of the object
          vec3 projectorDirection = normalize(projPosition - vWorldPosition.xyz);
          float dotProduct = dot(vNormal, projectorDirection);
          if (dotProduct < 0.0) {
            color = vec4(baseColor, 1.0);
          }

          vec4 diffuseColor = color;
        `,
      }),

      // fragmentShader: `
      //   uniform vec3 color;
      //   uniform sampler2D texture;
      //   uniform vec3 projPosition;

      //   varying vec3 vNormal;
      //   varying vec4 vWorldPosition;
      //   varying vec4 vTexCoords;

      //   void main() {
      //     vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;

      //     vec4 outColor = texture2D(texture, uv);

      //     // this makes sure we don't render the texture also on the back of the object
      //     vec3 projectorDirection = normalize(projPosition - vWorldPosition.xyz);
      //     float dotProduct = dot(vNormal, projectorDirection);
      //     if (dotProduct < 0.0) {
      //       outColor = vec4(color, 1.0);
      //     }

      //     gl_FragColor = outColor;
      //   }
      // `,
    });

    this.isProjectedMaterial = true;
  }
}
