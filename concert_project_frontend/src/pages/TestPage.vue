// Quasar + TypeScript + Three.js + GSAP animated nightlife scene with neon text, fog, .glb model loader, and full-screen party video background
// File: src/pages/NightlifeScenePage.vue

<template>
  <div class="fullscreen-container">
    <video autoplay muted loop playsinline class="bg-video">
      <source src="https://cdn.pixabay.com/vimeo/689529577/party-116874.mp4?width=1920&hash=a78f8e0905076be8f0429dd5d2b3a1e163e20646" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div ref="sceneContainer" class="scene-canvas"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { GLTFLoader } from 'three-stdlib';
import { FontLoader } from 'three-stdlib';
import type { Font } from 'three-stdlib';
import { TextGeometry } from 'three-stdlib';

const sceneContainer = ref<HTMLElement | null>(null);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let animationId = 0;
let neonTextMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;

const handleResize = () => {
  if (!sceneContainer.value) return;
  camera.aspect = sceneContainer.value.clientWidth / sceneContainer.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sceneContainer.value.clientWidth, sceneContainer.value.clientHeight);
};

const cleanup = () => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', handleResize);
  if (renderer && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
};

function initScene(container: HTMLElement) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 5, 15);

  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const pointLight = new THREE.PointLight(0xff00ff, 2, 50);
  pointLight.position.set(0, 2, 0);
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const boxGroup = new THREE.Group();
  for (let i = 0; i < 20; i++) {
    const geo = new THREE.BoxGeometry(0.5, Math.random() * 2 + 1, 0.5);
    const mat = new THREE.MeshStandardMaterial({ color: 0x3333ff, emissive: 0x220044 });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
    boxGroup.add(cube);
  }
  scene.add(boxGroup);

  gsap.to(pointLight, {
    intensity: 5,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  gsap.to(camera.position, {
    z: 2,
    y: 1,
    duration: 2,
    ease: 'power2.inOut'
  });

  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    '/models/groningen.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      model.position.set(0, 0, -3);
      scene.add(model);
    },
    undefined,
    (error: unknown) => {
      console.error('Error loading GLB model:', error);
    }
  );

  const fontLoader = new FontLoader();
  fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    (font: Font) => {
      const textGeo = new TextGeometry('Groningen Nights', {
        font: font,
        size: 0.6,
        height: 0.1,
      });
      const textMat = new THREE.MeshStandardMaterial({ color: 0xff00cc, emissive: 0xff00cc });
      neonTextMesh = new THREE.Mesh(textGeo, textMat);
      neonTextMesh.position.set(-2.5, 3, -2);
      scene.add(neonTextMesh);

      gsap.to(neonTextMesh.material.emissive, {
        r: 1,
        g: 0,
        b: 1,
        duration: 0.5,
        yoyo: true,
        repeat: -1
      });
    },
    undefined,
    (error: unknown) => {
      console.error('Error loading font:', error);
    }
  );

  gsap.to(scene.fog, {
    near: 3,
    far: 10,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    boxGroup.rotation.y += 0.001;
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', handleResize);
}

onMounted(() => {
  if (sceneContainer.value) {
    initScene(sceneContainer.value);
  }
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.fullscreen-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
}

.scene-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
}
</style>
