import * as THREE from 'three';

function extrudePath(points, depth) {
  let geometry = new THREE.PlaneGeometry(1, 1, points.length - 1, 1);

  for (let i = 0, l = points.length; i < l; i++) {
    let p = points[i];

    geometry.vertices[i].x = geometry.vertices[i + l].x = p.x;
    geometry.vertices[i].y = geometry.vertices[i + l].y = p.y;

    geometry.vertices[i].z = p.z + depth;
    geometry.vertices[i + l].z = p.z;
  }

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  return geometry;
}

export { extrudePath };
