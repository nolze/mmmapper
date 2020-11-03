import * as THREE from 'three';
import seedrandom from "seedrandom";

import * as util from './lib/three/util';

class Serenade {
  constructor(material) {
    let path = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-500 * 0.75, 0, 0),
      new THREE.Vector3(-250 * 0.75, 250 * 0.75, 0),
      new THREE.Vector3(250 * 0.75, 250 * 0.75, 0),
      new THREE.Vector3(500 * 0.75, 0, 0),
    );

    let points = path.getPoints(100);

    let geometry = util.extrudePath(points, 300);

    // mesh.rotation.y = Math.PI / 2 - 0.5;

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 0;

    // mesh.rotation.x = (1 / 2) * Math.PI;
    // geometry.translate(0, -250, 0);

    /* Edges */
    let edges = new THREE.EdgesGeometry(geometry, 45);
    let line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xcccccc }),
    );
    mesh.add(line);

    mesh.position.y = 180;

    this.geometry = geometry;
    this.material = material;
    this.mesh = mesh;
  }
}

class Circus {
  constructor(material) {
    const merged = new THREE.Geometry();
    // const merged = new THREE.Group();

    let geometry = new THREE.CylinderGeometry(180, 180, 100, 32);
    let mesh = new THREE.Mesh(geometry);

    // /* Edges */
    // let edges = new THREE.EdgesGeometry(geometry, 45);
    // let line = new THREE.LineSegments(
    //   edges,
    //   new THREE.LineBasicMaterial({ color: 0xcccccc }),
    // );
    // mesh.add(line);

    // mesh.roatation.z = Math.PI / 2;
    mesh.rotation.x = Math.PI / 2;
    merged.mergeMesh(mesh);
    // merged.add(mesh);

    geometry = new THREE.ConeGeometry(180, 80, 32);
    mesh = new THREE.Mesh(geometry);

    // /* Edges */
    // edges = new THREE.EdgesGeometry(geometry, 45);
    // line = new THREE.LineSegments(
    //   edges,
    //   new THREE.LineBasicMaterial({ color: 0xcccccc }),
    // );
    // mesh.add(line);

    mesh.rotation.x = Math.PI / 2;
    mesh.position.z = 90;
    merged.mergeMesh(mesh);
    // merged.add(mesh);

    mesh = new THREE.Mesh(merged, material);
    // mesh = merged;

    mesh.position.y = 180;

    this.geometry = geometry;
    this.material = material;
    this.mesh = mesh;
  }
}

class RandomBoxes {
  constructor(material) {
    const BOX_N = 200;
    let boxes = new THREE.Group();

    for (let i = 0; i < BOX_N; i++) {
      let geometry = new THREE.BoxGeometry(100, 100, 100);
      // geometry.translate(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 0);

      /* Edges */
      let mesh = new THREE.Mesh(geometry, material);
      let edges = new THREE.EdgesGeometry(geometry, 45);
      let line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xcccccc }),
      );
      mesh.add(line);

      mesh.position.x = Math.random() * 1000 - 500;
      mesh.position.z = Math.random() * 1000 - 500;
      mesh.position.y = Math.random() * 100;

      mesh.rotation.x = Math.random() * -(Math.PI * 2) + Math.PI * 2;
      mesh.rotation.y = Math.random() * -(Math.PI * 2) + Math.PI * 2;
      mesh.rotation.z = Math.random() * -(Math.PI * 2) + Math.PI * 2;

      boxes.add(mesh);
    }
    this.geometry = null;
    this.material = material;
    this.mesh = boxes;
  }
}

class RandomBoxes2 {
  constructor(material) {
    const BOX_N = 8;
    let boxes = new THREE.Group();

    const random = seedrandom(3939);

    for (let i = 0; i < BOX_N; i++) {
      let geometry = new THREE.BoxGeometry(100, 100, 100);
      // geometry.translate(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 0);

      /* Edges */
      let mesh = new THREE.Mesh(geometry, material);
      let edges = new THREE.EdgesGeometry(geometry, 45);
      let line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xcccccc }), // 0xcccccc
      );
      mesh.add(line);

      mesh.position.x = -150 + Math.floor(i / 2) * 100; // Math.random() * 1000 - 500;
      mesh.position.z = (i % 2) * 100;
      mesh.position.y = 0; // Math.random() * 1000 - 500; // Math.random() * 100;

      mesh.rotation.x = -0.2 + 0.4 * random(); // Math.random() * -(Math.PI * 2) + Math.PI * 2;
      mesh.rotation.y = -0.2 + 0.4 * random(); // Math.random() * -(Math.PI * 2) + Math.PI * 2;
      mesh.rotation.z = -0.2 + 0.4 * random(); // Math.random() * -(Math.PI * 2) + Math.PI * 2;

      boxes.add(mesh);
    }

    boxes.position.y = 120;

    this.geometry = null;
    this.material = material;
    this.mesh = boxes;
  }
}

class StandardBoxes {
  constructor(material, random) {
    this.random = random;
    let composition = Array.from(
      [
        [0, 0, 0, 100, 100, 100, 0, 0, 0],
        [100, 0, 0, 100, 100, 100, 0, 0, 0],
        [0, 100, 0, 100, 100, 100, 0, 0, 0],
        [0, 50 / 2, -100, 100, 100, 150, 0, 0, 0],
      ],
      (v) => ({
        posX: v[0],
        posY: v[1],
        posZ: v[2],
        sizeX: v[3],
        sizeY: v[4],
        sizeZ: v[5],
        rotateX: v[6],
        rotateY: v[7],
        rotateZ: v[8],
      }),
    );

    const merged = new THREE.Geometry();

    composition.forEach((v, i) => {
      let geometry = new THREE.BoxGeometry(v.sizeX, v.sizeY, v.sizeZ);
      let mesh = new THREE.Mesh(geometry);

      /* Edges */
      // let edges = new THREE.EdgesGeometry(geometry, 45);
      // let line = new THREE.LineSegments(
      //   edges,
      //   new THREE.LineBasicMaterial({ color: 0xcccccc }),
      // );
      // mesh.add(line);

      mesh.position.x = v.posX;
      mesh.position.z = v.posY;
      mesh.position.y = v.posZ;

      mesh.rotation.x = v.rotateX;
      mesh.rotation.y = v.rotateY;
      mesh.rotation.z = v.rotateZ;

      if (random) {
        mesh.position.x += (-50 + Math.random() * 100) * 0.5;
        mesh.position.z += (-50 + Math.random() * 100) * 0.5;
        mesh.position.y += (-50 + Math.random() * 100) * 0.5;

        mesh.rotation.x += -Math.PI / 16 + (Math.PI / 8) * Math.random();
        mesh.rotation.y += -Math.PI / 16 + (Math.PI / 8) * Math.random();
        mesh.rotation.z += -Math.PI / 16 + (Math.PI / 8) * Math.random();
      }

      merged.mergeMesh(mesh);
    });

    const boxes = new THREE.Mesh(merged, material);
    boxes.rotation.set(0, 0, -0.25 * Math.PI);
    boxes.position.y = 200;

    boxes.castShadow = true;
    boxes.receiveShadow = true;

    this.geometry = null;
    this.material = material;
    this.mesh = boxes;
  }
}

class BehindTest {
  constructor(material) {
    let composition = Array.from(
      [
        [0, 0, 0, 100, 100, 100, 0, 0, 0],
        [200, 0, 0, 100, 100, 100, 0, 0, 0],
      ],
      (v) => ({
        posX: v[0],
        posY: v[1],
        posZ: v[2],
        sizeX: v[3],
        sizeY: v[4],
        sizeZ: v[5],
        rotateX: v[6],
        rotateY: v[7],
        rotateZ: v[8],
      }),
    );

    const boxes = new THREE.Group();

    composition.forEach((v, i) => {
      let geometry = new THREE.BoxGeometry(v.sizeX, v.sizeY, v.sizeZ);
      let mesh = new THREE.Mesh(geometry, material);

      /* Edges */
      // let edges = new THREE.EdgesGeometry(geometry, 45);
      // let line = new THREE.LineSegments(
      //   edges,
      //   new THREE.LineBasicMaterial({ color: 0xcccccc }),
      // );
      // mesh.add(line);

      mesh.position.x = v.posX;
      mesh.position.z = v.posY;
      mesh.position.y = v.posZ;

      mesh.rotation.x = v.rotateX;
      mesh.rotation.y = v.rotateY;
      mesh.rotation.z = v.rotateZ;

      // if (i === 1)
      mesh.castShadow = true;
      // if (i === 0)
      mesh.receiveShadow = true;

      boxes.add(mesh);
    });
    boxes.rotation.set(0, 0, -0.5 * Math.PI);
    boxes.position.y = 200;
    // boxes.castShadow = true;
    // boxes.receiveShadow = true;

    this.geometry = null;
    this.material = material;
    this.mesh = boxes;
  }
}

export {
  Serenade,
  Circus,
  RandomBoxes,
  RandomBoxes2,
  StandardBoxes,
  BehindTest,
};
