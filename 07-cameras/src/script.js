import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 400,
  height: 400,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio,
//     1 * aspectRatio,
//     1,
//     -1,
//     0.1,
//     100
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

// controls
const controls = new FirstPersonControls(camera, canvas);
controls.enableDamping = true;
controls.activeLook = false;
// controls.target.y = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();
const rotateSpeed = 1;
const radius = 2;

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

const cameraAngle = 1;

window.addEventListener("mousemove", (event) => {
  cursor.x = (event.clientX / sizes.width - 0.5) * cameraAngle;
  cursor.y = -(event.clientY / sizes.height - 0.5) * cameraAngle;
  console.log(
    Math.sin(cursor.x * Math.PI * 2) * 2,
    Math.cos(cursor.x * Math.PI * 2) * 2
  );
});

const tick = () => {
  const deltaTime = clock.getDelta();
  // mesh.rotateY(rotateSpeed * deltaTime);

  // Update camera
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * radius;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * radius;
  // camera.position.y = cursor.y

  // camera.lookAt(mesh.position);
  // Render
  // Update controls
  controls.update(deltaTime);
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

/* Function call */

tick();
