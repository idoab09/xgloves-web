import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const products = [
  {
    id: "x1",
    name: "Model X1 — The Powerhouse",
    tagline: "Max Impact · Reinforced Wrist Support · Slow-Recovery Memory Foam",
    accent: "#d2192e",
    accentSoft: "rgba(210, 25, 46, 0.34)",
    glow: "0 0 24px rgba(210, 25, 46, 0.55)",
    metrics: { power: 92, speed: 58, agility: 64 },
    material: { color: 0x8f1321, metalness: 0.22, roughness: 0.72 }
  },
  {
    id: "x2",
    name: "Model X2 — The Speedster",
    tagline: "Ultra-Lightweight · High-Ventilation · Precision Striking",
    accent: "#1f7fff",
    accentSoft: "rgba(31, 127, 255, 0.34)",
    glow: "0 0 24px rgba(31, 127, 255, 0.55)",
    metrics: { power: 72, speed: 96, agility: 89 },
    material: { color: 0x2965cf, metalness: 0.34, roughness: 0.36 }
  },
  {
    id: "x3",
    name: "Model X3 — The Hybrid",
    tagline: "Versatile Performance · All-Rounder · Balanced Weight Distribution",
    accent: "#8e83ff",
    accentSoft: "rgba(142, 131, 255, 0.34)",
    glow: "0 0 24px rgba(142, 131, 255, 0.52)",
    metrics: { power: 83, speed: 82, agility: 82 },
    material: { color: 0x858a95, metalness: 0.48, roughness: 0.52 }
  }
];

const specs = {
  outer: {
    title: "Outer Shell",
    description: "Engineered synthetic leather with impact-dispersing micro-grain emboss."
  },
  foam: {
    title: "Impact Core",
    description: "Slow-recovery memory foam layers tuned for controlled rebound and wrist-safe load transfer."
  },
  wrist: {
    title: "Wrist Lock",
    description: "Reinforced cuff wrap with rigidized channeling for stable alignment during heavy combinations."
  }
};

const canvas = document.getElementById("gloveCanvas");
const modelName = document.getElementById("modelName");
const modelTagline = document.getElementById("modelTagline");
const powerBar = document.getElementById("powerBar");
const speedBar = document.getElementById("speedBar");
const agilityBar = document.getElementById("agilityBar");
const specCard = document.getElementById("specCard");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(0, 0.2, 6.4);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(3, 4, 5);
const fill = new THREE.DirectionalLight(0x7f95ff, 0.9);
fill.position.set(-3, -2, 3);
const rim = new THREE.PointLight(0xffffff, 0.7, 30);
rim.position.set(-2, 1, -3);
scene.add(key, fill, rim, new THREE.AmbientLight(0x4e5a73, 0.6));

const gloveGroup = new THREE.Group();
scene.add(gloveGroup);

const sharedMaterial = new THREE.MeshStandardMaterial({
  color: products[0].material.color,
  roughness: 0.62,
  metalness: 0.3
});

function createGlove() {
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1.15, 42, 30), sharedMaterial);
  shell.scale.set(1.55, 1.1, 1.35);
  shell.position.set(0.35, 0.32, 0);

  const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 24), sharedMaterial);
  thumb.scale.set(1.25, 0.72, 1.1);
  thumb.position.set(-1.05, -0.16, 0.42);
  thumb.rotation.z = -0.45;

  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.92, 1.35, 28), sharedMaterial);
  cuff.position.set(-1.25, -0.58, 0);
  cuff.rotation.z = -0.2;

  const seam = new THREE.Mesh(
    new THREE.TorusGeometry(1.22, 0.05, 12, 40, Math.PI * 1.5),
    new THREE.MeshStandardMaterial({ color: 0xced5ef, roughness: 0.45, metalness: 0.15 })
  );
  seam.position.set(0.55, 0.25, 0.88);
  seam.rotation.set(0.2, 0.8, 0.25);

  gloveGroup.add(shell, thumb, cuff, seam);
}

createGlove();

let modelIndex = 0;
let targetRotX = 0.22;
let targetRotY = 0.45;
let drag = false;
let lastX = 0;

function applyTheme(product) {
  const root = document.documentElement;
  root.style.setProperty("--accent", product.accent);
  root.style.setProperty("--accent-soft", product.accentSoft);
  root.style.setProperty("--glow", product.glow);
  modelName.textContent = product.name;
  modelTagline.textContent = product.tagline;
  powerBar.style.width = `${product.metrics.power}%`;
  speedBar.style.width = `${product.metrics.speed}%`;
  agilityBar.style.width = `${product.metrics.agility}%`;
  sharedMaterial.color.setHex(product.material.color);
  sharedMaterial.roughness = product.material.roughness;
  sharedMaterial.metalness = product.material.metalness;
}

function cycleModel(direction) {
  modelIndex = (modelIndex + direction + products.length) % products.length;
  applyTheme(products[modelIndex]);
}

document.getElementById("prevModel").addEventListener("click", () => cycleModel(-1));
document.getElementById("nextModel").addEventListener("click", () => cycleModel(1));
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") cycleModel(-1);
  if (e.key === "ArrowRight") cycleModel(1);
});

canvas.addEventListener("pointerdown", (e) => {
  drag = true;
  lastX = e.clientX;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!drag) return;
  targetRotY += (e.clientX - lastX) * 0.01;
  lastX = e.clientX;
});
canvas.addEventListener("pointerup", () => {
  drag = false;
});

function onResize() {
  const rect = canvas.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", onResize);
onResize();

function scrollProgress() {
  const max = document.body.scrollHeight - window.innerHeight;
  return max <= 0 ? 0 : window.scrollY / max;
}

function animate() {
  const progress = scrollProgress();

  if (progress < 0.33) {
    gloveGroup.position.set(0, 0, 0);
    gloveGroup.scale.setScalar(1);
  } else if (progress < 0.66) {
    const t = (progress - 0.33) / 0.33;
    gloveGroup.position.set(0, 0.2 * t, 0);
    gloveGroup.scale.setScalar(1 + 0.35 * t);
    targetRotY = 1.25;
    targetRotX = 0.08;
  } else {
    const t = (progress - 0.66) / 0.34;
    gloveGroup.position.set(-1.45 * t, 0.25, 0);
    gloveGroup.scale.setScalar(1.35 - 0.6 * t);
    targetRotY = 0.85;
    targetRotX = 0.22;
  }

  gloveGroup.rotation.y += (targetRotY - gloveGroup.rotation.y) * 0.06;
  gloveGroup.rotation.x += (targetRotX - gloveGroup.rotation.x) * 0.06;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

for (const node of document.querySelectorAll(".hotspot")) {
  node.addEventListener("click", () => {
    const spec = specs[node.dataset.spec];
    specCard.innerHTML = `<h3>${spec.title}</h3><p>${spec.description}</p>`;
  });
}

applyTheme(products[0]);
requestAnimationFrame(animate);
