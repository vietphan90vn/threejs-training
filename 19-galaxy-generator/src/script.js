import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { AxesHelper, GridHelper } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// scene.add(new GridHelper(10, 10, 0xffffff, 0xffffff));
// scene.add(new AxesHelper(100));

/**
 * Galaxy generator
 */
const parameters = {
    count: 10000,
    size: 0.01,
    radius: 3,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
};

let geometry = null;
let material = null;
let points = null;

function boxMullerTransformRandom() {
    var u = 0,
        v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const getRandomSpherePoint1 = (radius) => {
    var d, x, y, z;
    do {
        x = Math.random() * 2.0 - 1.0;
        y = Math.random() * 2.0 - 1.0;
        z = Math.random() * 2.0 - 1.0;
        d = (x * x + y * y + z * z) * radius;
    } while (d > radius);

    return [x * d, y * d, z * d];
};

const getRandomSpherePoint2 = (radius) => {
    var x = Math.random() * 2 - 1;
    var y = Math.random() * 2 - 1;
    var z = Math.random() * 2 - 1;

    var mag = Math.sqrt(x * x + y * y + z * z);
    x /= mag;
    y /= mag;
    z /= mag;

    var d = (Math.random() * 2 - 1) * radius;

    return [x * d, y * d, z * d];
};

// Picking a random spherical coordinate
const getRandomSpherePoint3 = (radius) => {
    var u = Math.random();
    var v = Math.random();
    var theta = u * 2.0 * Math.PI;
    var phi = Math.acos(2.0 * v - 1.0);
    var r = Math.cbrt(Math.random());
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    var sinPhi = Math.sin(phi);
    var cosPhi = Math.cos(phi);
    var x = r * sinPhi * cosTheta;
    var y = r * sinPhi * sinTheta;
    var z = r * cosPhi;

    return [x * radius, y * radius, z * radius];
};

/**
 * Get random points in Sphere with radius Using normally distributed random numbers
 */
function getRandomSpherePoint4(radius) {
    var u = Math.random();
    var x1 = boxMullerTransformRandom();
    var x2 = boxMullerTransformRandom();
    var x3 = boxMullerTransformRandom();

    var mag = Math.sqrt(x1 * x1 + x2 * x2 + x3 * x3);
    x1 /= mag;
    x2 /= mag;
    x3 /= mag;

    // Math.cbrt is cube root
    var c = Math.cbrt(u) * radius;

    return [x1 * c, x2 * c, x3 * c];
}

const getRandomSpherePlanePoint = (radius) => {
    var x = Math.random() * 2 - 1;
    var y = Math.random() * 2 - 1;
    var z = Math.random() * 2 - 1;

    var mag = Math.sqrt(x * x + y * y + z * z);
    x /= mag;
    y /= mag;
    z /= mag;

    var d = radius;

    return [x * d, y * d, z * d];
};

const getRandomCubePoint = (radius) => {
    return [
        (Math.random() * 2 - 1) * radius,
        (Math.random() * 2 - 1) * radius,
        (Math.random() * 2 - 1) * radius,
    ];
};

const getGalaxyPoint = (i) => {
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
    const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
    const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
    return [
        Math.cos(branchAngle + spinAngle) * radius + randomX,
        0 + randomY,
        Math.sin(branchAngle + spinAngle) * radius + randomZ,
        radius,
    ];
};

const generateGalaxy = () => {
    // Destroy old galaxy if exists
    if (points != null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const point = getGalaxyPoint(i);

        positions[i3] = point[0];
        positions[i3 + 1] = point[1];
        positions[i3 + 2] = point[2];

        const radius = point[3];
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
};

gui.add(parameters, "count", 100, 100000)
    .step(100)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "size", 0.001, 0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "spin")
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "randomness")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);
gui.add(parameters, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);

gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

generateGalaxy();

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
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
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
