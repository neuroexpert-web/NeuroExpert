// Three.js фоновая анимация с частицами
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('hero-background-animation');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        
        this.particles = [];
        this.particleCount = 1500;
        this.mouse = new THREE.Vector2();
        this.mouseInfluence = 50;
        
        this.init();
        this.createParticles();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 100;
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount * 3);
        const originalPositions = new Float32Array(this.particleCount * 3);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Случайные позиции
            positions[i3] = (Math.random() - 0.5) * 200;
            positions[i3 + 1] = (Math.random() - 0.5) * 200;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            // Сохраняем оригинальные позиции
            originalPositions[i3] = positions[i3];
            originalPositions[i3 + 1] = positions[i3 + 1];
            originalPositions[i3 + 2] = positions[i3 + 2];
            
            // Случайные скорости для волнообразного движения
            velocities[i3] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.3;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
        
        // Материал частиц (синий цвет #3B82F6)
        const material = new THREE.PointsMaterial({
            color: 0x3B82F6,
            size: 2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        const positions = this.particleSystem.geometry.attributes.position.array;
        const velocities = this.particleSystem.geometry.attributes.velocity.array;
        const originalPositions = this.particleSystem.geometry.attributes.originalPosition.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Волнообразное движение
            positions[i3] += velocities[i3] + Math.sin(time + originalPositions[i3] * 0.01) * 0.1;
            positions[i3 + 1] += velocities[i3 + 1] + Math.cos(time + originalPositions[i3 + 1] * 0.01) * 0.1;
            positions[i3 + 2] += velocities[i3 + 2] + Math.sin(time * 0.5 + originalPositions[i3 + 2] * 0.02) * 0.05;
            
            // Взаимодействие с мышью
            const mouseDistance = Math.sqrt(
                Math.pow(positions[i3] - this.mouse.x * 100, 2) +
                Math.pow(positions[i3 + 1] - this.mouse.y * 100, 2)
            );
            
            if (mouseDistance < this.mouseInfluence) {
                const force = (this.mouseInfluence - mouseDistance) / this.mouseInfluence;
                const angle = Math.atan2(
                    positions[i3 + 1] - this.mouse.y * 100,
                    positions[i3] - this.mouse.x * 100
                );
                
                positions[i3] += Math.cos(angle) * force * 2;
                positions[i3 + 1] += Math.sin(angle) * force * 2;
            }
            
            // Переход частиц через границы экрана
            if (positions[i3] > 100) positions[i3] = -100;
            if (positions[i3] < -100) positions[i3] = 100;
            if (positions[i3 + 1] > 100) positions[i3 + 1] = -100;
            if (positions[i3 + 1] < -100) positions[i3 + 1] = 100;
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Медленное вращение всей системы
        this.particleSystem.rotation.y += 0.001;
        this.particleSystem.rotation.x += 0.0005;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
});