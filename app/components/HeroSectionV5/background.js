// Фоновая анимация с использованием Three.js
(function() {
    // Создаем сцену
    const scene = new THREE.Scene();
    
    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Добавляем canvas в контейнер
    const container = document.getElementById('hero-background-animation');
    container.appendChild(renderer.domElement);
    
    // Создаем геометрию для частиц
    const particlesCount = 3000;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const opacities = new Float32Array(particlesCount);
    
    // Инициализируем частицы
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Позиции
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
        
        // Скорости
        velocities[i] = (Math.random() - 0.5) * 0.01;
        velocities[i + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i + 2] = (Math.random() - 0.5) * 0.01;
        
        // Размеры
        sizes[i / 3] = Math.random() * 3 + 1;
        
        // Прозрачность
        opacities[i / 3] = Math.random() * 0.8 + 0.2;
    }
    
    // Создаем геометрию
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    // Шейдеры для частиц
    const vertexShader = `
        attribute float size;
        attribute float opacity;
        varying float vOpacity;
        
        void main() {
            vOpacity = opacity;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;
    
    const fragmentShader = `
        varying float vOpacity;
        
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            float opacity = vOpacity * (1.0 - dist * 2.0);
            gl_FragColor = vec4(0.231, 0.51, 0.965, opacity);
        }
    `;
    
    // Создаем материал
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Создаем систему частиц
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Переменные для взаимодействия с мышью
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    // Обработчик движения мыши
    document.addEventListener('mousemove', (event) => {
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Анимационный цикл
    function animate() {
        requestAnimationFrame(animate);
        
        // Плавное следование за мышью
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Обновляем позиции частиц
        const positions = geometry.attributes.position.array;
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Волнообразное движение
            positions[i] += velocities[i] + Math.sin(Date.now() * 0.001 + i) * 0.0005;
            positions[i + 1] += velocities[i + 1] + Math.cos(Date.now() * 0.001 + i) * 0.0005;
            positions[i + 2] += velocities[i + 2];
            
            // Эффект возмущения от мыши
            const dx = positions[i] - mouseX * 3;
            const dy = positions[i + 1] - mouseY * 3;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 2) {
                const force = (2 - dist) * 0.01;
                positions[i] += dx * force;
                positions[i + 1] += dy * force;
            }
            
            // Границы (плавное появление/исчезновение)
            if (positions[i] < -5) {
                positions[i] = 5;
                opacities[i / 3] = 0;
            } else if (positions[i] > 5) {
                positions[i] = -5;
                opacities[i / 3] = 0;
            }
            
            if (positions[i + 1] < -5) {
                positions[i + 1] = 5;
                opacities[i / 3] = 0;
            } else if (positions[i + 1] > 5) {
                positions[i + 1] = -5;
                opacities[i / 3] = 0;
            }
            
            // Плавное увеличение прозрачности
            if (opacities[i / 3] < 0.8) {
                opacities[i / 3] += 0.01;
            }
        }
        
        // Обновляем атрибуты
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.opacity.needsUpdate = true;
        
        // Вращение системы частиц
        particles.rotation.y += 0.0002;
        particles.rotation.x = mouseY * 0.1;
        
        // Рендеринг
        renderer.render(scene, camera);
    }
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Запускаем анимацию
    animate();
})();