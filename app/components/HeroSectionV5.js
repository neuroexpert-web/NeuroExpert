'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import './HeroSectionV5.css';

export default function HeroSectionV5() {
  const containerRef = useRef(null);
  const router = useRouter();
  const threeLoaded = useRef(false);

  useEffect(() => {
    // Функция инициализации Three.js анимации
    const initThreeAnimation = () => {
      if (!window.THREE || threeLoaded.current) return;
      threeLoaded.current = true;

      // Создаем сцену
      const scene = new window.THREE.Scene();
      
      // Создаем камеру
      const camera = new window.THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      
      // Создаем рендерер
      const renderer = new window.THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Добавляем canvas в контейнер
      const container = document.getElementById('hero-background-animation');
      if (!container) return;
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
      const geometry = new window.THREE.BufferGeometry();
      geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new window.THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('opacity', new window.THREE.BufferAttribute(opacities, 1));
      
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
      const material = new window.THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: window.THREE.AdditiveBlending,
        depthWrite: false
      });
      
      // Создаем систему частиц
      const particles = new window.THREE.Points(geometry, material);
      scene.add(particles);
      
      // Переменные для взаимодействия с мышью
      let mouseX = 0;
      let mouseY = 0;
      let targetMouseX = 0;
      let targetMouseY = 0;
      
      // Обработчик движения мыши
      const handleMouseMove = (event) => {
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      document.addEventListener('mousemove', handleMouseMove);
      
      // Анимационный цикл
      let animationId;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        
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
      };
      
      // Обработка изменения размера окна
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      
      // Запускаем анимацию
      animate();

      // Cleanup функция
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        document.removeEventListener('mousemove', handleMouseMove);
      };
    };

    // Функция анимации заголовка
    const initHeaderAnimation = () => {
      const mainHeader = document.getElementById('animated-main-header');
      if (!mainHeader) return;
      
      // Сохраняем текст и очищаем заголовок
      const text = mainHeader.textContent;
      mainHeader.textContent = '';
      
      // Разбиваем текст на буквы и оборачиваем каждую в span
      const chars = text.split('').map((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        span.style.position = 'relative';
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        
        // Создаем внутренний span для текста
        const innerSpan = document.createElement('span');
        innerSpan.textContent = char;
        innerSpan.style.position = 'relative';
        innerSpan.style.zIndex = '2';
        innerSpan.style.display = 'inline-block';
        innerSpan.style.background = 'linear-gradient(90deg, #A855F7 0%, #6366F1 100%)';
        innerSpan.style.webkitBackgroundClip = 'text';
        innerSpan.style.webkitTextFillColor = 'transparent';
        innerSpan.style.backgroundClip = 'text';
        
        span.textContent = '';
        span.appendChild(innerSpan);
        
        return span;
      });
      
      // Добавляем буквы в заголовок
      chars.forEach(span => mainHeader.appendChild(span));
      
      // Функция для анимации импульса
      function animateImpulse(charElement, delay) {
        setTimeout(() => {
          // Добавляем класс для появления буквы
          charElement.classList.add('visible');
          
          // Создаем элемент импульса
          const pulse = document.createElement('div');
          pulse.style.position = 'absolute';
          pulse.style.top = '50%';
          pulse.style.left = '-10px';
          pulse.style.width = '6px';
          pulse.style.height = '6px';
          pulse.style.background = 'white';
          pulse.style.borderRadius = '50%';
          pulse.style.boxShadow = '0 0 15px white, 0 0 30px #A855F7, 0 0 45px #6366F1';
          pulse.style.transform = 'translateY(-50%)';
          pulse.style.zIndex = '3';
          pulse.style.pointerEvents = 'none';
          
          charElement.appendChild(pulse);
          
          // Анимируем движение импульса
          setTimeout(() => {
            pulse.style.transition = 'left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease-out';
            pulse.style.left = '100%';
            
            // Удаляем импульс после анимации
            setTimeout(() => {
              pulse.style.opacity = '0';
              setTimeout(() => pulse.remove(), 400);
            }, 300);
          }, 50);
        }, delay);
      }
      
      // Запускаем анимацию для каждой буквы с задержкой
      chars.forEach((char, index) => {
        animateImpulse(char, index * 70); // Задержка 70ms между буквами
      });
      
      // Анимация остальных элементов
      setTimeout(() => {
        // Анимируем предзаголовок
        const preHeader = document.querySelector('.pre-header');
        if (preHeader) {
          preHeader.style.opacity = '0';
          preHeader.style.transform = 'translateY(-20px)';
          preHeader.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          setTimeout(() => {
            preHeader.style.opacity = '1';
            preHeader.style.transform = 'translateY(0)';
          }, 50);
        }
        
        // Анимируем подзаголовок
        const subHeader = document.querySelector('.sub-header');
        if (subHeader) {
          subHeader.style.opacity = '0';
          subHeader.style.transform = 'translateY(20px)';
          subHeader.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          setTimeout(() => {
            subHeader.style.opacity = '1';
            subHeader.style.transform = 'translateY(0)';
          }, 800);
        }
        
        // Анимируем подпись к подзаголовку
        const subHeaderCaption = document.querySelector('.sub-header-caption');
        if (subHeaderCaption) {
          subHeaderCaption.style.opacity = '0';
          subHeaderCaption.style.transform = 'translateY(20px)';
          subHeaderCaption.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          setTimeout(() => {
            subHeaderCaption.style.opacity = '1';
            subHeaderCaption.style.transform = 'translateY(0)';
          }, 1000);
        }
        
        // Анимируем описание
        const description = document.querySelector('.description');
        if (description) {
          description.style.opacity = '0';
          description.style.transform = 'translateY(20px)';
          description.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          setTimeout(() => {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
          }, 1200);
        }
        
        // Анимируем кнопку
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
          ctaButton.style.opacity = '0';
          ctaButton.style.transform = 'translateY(20px)';
          ctaButton.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          setTimeout(() => {
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
          }, 1400);
        }
      }, 100);
    };

    // Инициализация после загрузки Three.js
    let cleanup;
    const checkThreeAndInit = setInterval(() => {
      if (window.THREE) {
        clearInterval(checkThreeAndInit);
        cleanup = initThreeAnimation();
        initHeaderAnimation();
      }
    }, 100);

    return () => {
      clearInterval(checkThreeAndInit);
      if (cleanup) cleanup();
    };
  }, []);

  const handleCTAClick = (e) => {
    e.preventDefault();
    router.push('/chat');
  };

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" 
        strategy="afterInteractive"
      />
      
      <section className="hero-section" ref={containerRef}>
        {/* Этот div нужен для фоновой анимации Canvas */}
        <div id="hero-background-animation"></div>

        <div className="hero-content">
          <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
          <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
          <h2 className="sub-header">ЦИФРОВИЗАЦИЯ БИЗНЕСА</h2>
          <p className="sub-header-caption">С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ</p>
          <p className="description">
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте 
            конкурентов с помощью передовых AI-технологий.
          </p>
          <a href="#" className="cta-button" onClick={handleCTAClick}>НАЧАТЬ БЕСПЛАТНО</a>
        </div>
      </section>
    </>
  );
}