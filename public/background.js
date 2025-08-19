(() => {
  const canvas = document.getElementById('hero-background-animation');
  if (!canvas || !window.THREE) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(DPR);

  const PARTICLES = Math.min(120000, Math.floor((window.innerWidth * window.innerHeight) / 12));
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLES * 3);
  const velocities = new Float32Array(PARTICLES * 3);
  const speeds = new Float32Array(PARTICLES);

  const color = new THREE.Color('#3B82F6');
  const colors = new Float32Array(PARTICLES * 3);
  for (let i = 0; i < PARTICLES; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 100;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 100;
    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    speeds[i] = 0.15 + Math.random() * 0.35;
    colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, opacity: 0.85, transparent: true, depthWrite: false });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  camera.position.z = 60;

  let mouse = new THREE.Vector2(0, 0);
  let mouseMovedAt = 0;

  function onResize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', onResize);
  onResize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseMovedAt = performance.now();
  }, { passive: true });

  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();
  const flowFieldStrength = 0.015;

  function noise(x, y, z) {
    return (Math.sin(x * 0.02) + Math.sin(y * 0.03) + Math.sin(z * 0.017)) * 0.5;
  }

  function animate() {
    const dt = Math.min(clock.getDelta(), 0.033);
    const t = performance.now() * 0.0002;

    const pos = geometry.getAttribute('position');
    const arr = pos.array;

    const w = (canvas.clientWidth || window.innerWidth);
    const h = (canvas.clientHeight || window.innerHeight);
    const mx = mouse.x * 50;
    const my = mouse.y * 30;

    const mouseActive = performance.now() - mouseMovedAt < 150;

    for (let i = 0; i < PARTICLES; i++) {
      const i3 = i * 3;
      let x = arr[i3];
      let y = arr[i3 + 1];
      let z = arr[i3 + 2];

      const n = noise(x + t * 20, y - t * 10, z + t * 5);
      velocities[i3] += (Math.cos(n * Math.PI * 2) * flowFieldStrength) * dt;
      velocities[i3 + 1] += (Math.sin(n * Math.PI * 2) * flowFieldStrength) * dt;
      velocities[i3 + 2] += (Math.cos(n * Math.PI) * flowFieldStrength) * dt * 0.2;

      if (mouseActive) {
        tmp.set(x - mx, y - my, z);
        const dist2 = tmp.lengthSq();
        const influence = Math.min(1, 200 / (dist2 + 1));
        velocities[i3] += tmp.x * -0.00015 * influence;
        velocities[i3 + 1] += tmp.y * -0.00015 * influence;
      }

      x += velocities[i3] * speeds[i];
      y += velocities[i3 + 1] * speeds[i];
      z += velocities[i3 + 2] * speeds[i] * 0.2;

      const halfW = 50; // logical bounds
      const halfH = 30;
      if (x < -halfW) x = halfW, y = (Math.random() - 0.5) * 60, z = (Math.random() - 0.5) * 100;
      if (x > halfW) x = -halfW, y = (Math.random() - 0.5) * 60, z = (Math.random() - 0.5) * 100;
      if (y < -halfH) y = halfH, x = (Math.random() - 0.5) * 100, z = (Math.random() - 0.5) * 100;
      if (y > halfH) y = -halfH, x = (Math.random() - 0.5) * 100, z = (Math.random() - 0.5) * 100;

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }

    pos.needsUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

