import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);

const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);

const directionalLightDebug = gui.addFolder("Directional Light");
directionalLightDebug.add(directionalLight, "visible");
directionalLightDebug
    .add(directionalLight, "intensity")
    .min(0)
    .max(1)
    .step(0.001);
directionalLightDebug
    .add(directionalLight.position, "x")
    .min(-5)
    .max(5)
    .step(0.001);
directionalLightDebug
    .add(directionalLight.position, "y")
    .min(-5)
    .max(5)
    .step(0.001);
directionalLightDebug
    .add(directionalLight.position, "z")
    .min(-5)
    .max(5)
    .step(0.001);
const updateShadowCameraHelper = () => {
    directionalLight.shadow.camera.updateProjectionMatrix();
    directionalLightCameraHelper.update();
};

directionalLightDebug
    .add(directionalLight.shadow.camera, "near")
    .min(0)
    .max(15)
    .step(0.5)
    .onChange(updateShadowCameraHelper);
directionalLightDebug
    .add(directionalLight.shadow.camera, "far")
    .min(0)
    .max(15)
    .step(0.5)
    .onChange(updateShadowCameraHelper);

directionalLightDebug
    .add(directionalLight.shadow.camera, "top")
    .min(0)
    .max(4)
    .step(0.25)
    .onChange(updateShadowCameraHelper);
directionalLightDebug
    .add(directionalLight.shadow.camera, "right")
    .min(0)
    .max(4)
    .step(0.25)
    .onChange(updateShadowCameraHelper);
directionalLightDebug
    .add(directionalLight.shadow.camera, "bottom")
    .min(-5)
    .max(0)
    .step(0.25)
    .onChange(updateShadowCameraHelper);
directionalLightDebug
    .add(directionalLight.shadow.camera, "left")
    .min(-5)
    .max(0)
    .step(0.25)
    .onChange(updateShadowCameraHelper);
directionalLightDebug
    .add(directionalLightCameraHelper, "visible")
    .name("Show debug");

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
// directionalLight.shadow.radius = 3;
scene.add(directionalLight);

console.log(directionalLight.shadow);

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);

spotLight.castShadow = true;

spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

const spotLightDebug = gui.addFolder("Spot Light");
spotLightDebug.add(spotLight, "visible");
spotLightDebug.add(spotLight, "intensity").min(0).max(2).step(0.001);

const updateSpotLightShadowCameraHelper = () => {
    spotLight.shadow.camera.updateProjectionMatrix();
    spotLightCameraHelper.update();
};

spotLightDebug
    .add(spotLight.shadow.camera, "near")
    .min(0)
    .max(5)
    .step(0.1)
    .onChange(updateSpotLightShadowCameraHelper);
spotLightDebug
    .add(spotLight.shadow.camera, "far")
    .min(8)
    .max(20)
    .step(0.1)
    .onChange(updateSpotLightShadowCameraHelper);

spotLightDebug
    .add(spotLight.shadow.camera, "fov")
    .min(0)
    .max(90)
    .step(1)
    .onChange(updateSpotLightShadowCameraHelper);

spotLightDebug.add(spotLightCameraHelper, "visible").name("Show debug");

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;

const materialDebug = gui.addFolder("Material");
materialDebug.add(material, "metalness").min(0).max(1).step(0.001);
materialDebug.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
