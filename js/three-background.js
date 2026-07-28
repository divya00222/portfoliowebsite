/**
 * DJ Chaudhary Portfolio - Three.js 3D Interactive Background
 */

export function initThreeBackground(containerId = 'three-canvas-container') {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Floating Particles
  const particleCount = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const goldColor = new THREE.Color('#f59e0b');
  const blueColor = new THREE.Color('#3b82f6');
  const cyanColor = new THREE.Color('#06b6d4');

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

    const rand = Math.random();
    const mixColor = rand > 0.6 ? goldColor : rand > 0.3 ? blueColor : cyanColor;
    colors[i * 3] = mixColor.r;
    colors[i * 3 + 1] = mixColor.g;
    colors[i * 3 + 2] = mixColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // Wireframe Core Mesh (Icosahedron)
  const coreGeometry = new THREE.IcosahedronGeometry(8, 2);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(coreMesh);

  // Secondary Outer Ring
  const ringGeometry = new THREE.TorusGeometry(12, 0.08, 16, 100);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  ringMesh.rotation.x = Math.PI / 4;
  scene.add(ringMesh);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const handleMouseMove = (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.0008;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.0008;
  };

  window.addEventListener('mousemove', handleMouseMove);

  // Window Resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  // Animation Loop
  let animationFrameId;
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particleSystem.rotation.y += 0.0008;
    particleSystem.rotation.x += 0.0004;

    coreMesh.rotation.y -= 0.002;
    coreMesh.rotation.x += 0.001;

    ringMesh.rotation.z += 0.003;
    ringMesh.rotation.y += 0.001;

    scene.rotation.y = targetX;
    scene.rotation.x = targetY;

    renderer.render(scene, camera);
  };

  animate();
}
