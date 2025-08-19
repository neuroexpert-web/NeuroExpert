'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import './HeroSectionV3.css';

export default function HeroSectionV3() {
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Анимация фона - потоки данных
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Установка размеров canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Потоки данных
    class DataStream {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -50;
        this.speed = Math.random() * 0.5 + 0.3;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.width = Math.random() * 2 + 0.5;
        this.length = Math.random() * 100 + 50;
        this.color = Math.random() > 0.5 ? '#6366F1' : '#A855F7';
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height + this.length) {
          this.reset();
        }
      }

      draw() {
        const gradient = ctx.createLinearGradient(
          this.x, this.y - this.length,
          this.x, this.y
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, this.color + Math.floor(this.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.length);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
      }
    }

    // Частицы
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02;

        // Плавное появление/исчезновение на краях
        const edgeFade = 50;
        if (this.x < edgeFade) {
          this.opacity = (this.x / edgeFade) * 0.3;
        } else if (this.x > canvas.width - edgeFade) {
          this.opacity = ((canvas.width - this.x) / edgeFade) * 0.3;
        }
        if (this.y < edgeFade) {
          this.opacity = Math.min(this.opacity, (this.y / edgeFade) * 0.3);
        } else if (this.y > canvas.height - edgeFade) {
          this.opacity = Math.min(this.opacity, ((canvas.height - this.y) / edgeFade) * 0.3);
        }

        // Отскок от границ
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        const currentOpacity = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);
        ctx.fillStyle = `rgba(99, 102, 241, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Инициализация элементов
    const streams = Array(15).fill().map(() => new DataStream());
    const particles = Array(50).fill().map(() => new Particle());

    // Анимационный цикл
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 5, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем потоки
      streams.forEach(stream => {
        stream.update();
        stream.draw();
      });

      // Рисуем частицы
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Рисуем связи между близкими частицами
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.2;
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Анимация заголовка "NeuroExpert" с эффектом нейронного импульса
  useEffect(() => {
    if (!titleRef.current || !isLoaded) return;

    const title = titleRef.current;
    const text = title.textContent;
    
    // Оборачиваем каждую букву в span
    title.innerHTML = text.split('').map((char, index) => 
      `<span class="letter" style="--index: ${index}">${char}</span>`
    ).join('');

    // Запускаем анимацию для каждой буквы
    const letters = title.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('animate');
      }, index * 100);
    });
  }, [isLoaded]);

  // Устанавливаем isLoaded после монтирования компонента
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleStartFree = () => {
    router.push('/chat');
  };

  const handleCalculator = () => {
    router.push('/calculator');
  };

  return (
    <section className="hero-section-v3">
      <canvas ref={canvasRef} className="background-canvas" />
      
      <div className="hero-content">
        <p className="pre-header">ЦИФРОВАЯ AI БИЗНЕС-ПЛАТФОРМА</p>
        
        <h1 ref={titleRef} className="main-header">NeuroExpert</h1>
        
        <p className="sub-header">ЦИФРОВИЗАЦИЯ БИЗНЕСА</p>
        
        <p className="sub-header-caption">С ПОМОЩЬЮ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА</p>
        
        <p className="description">
          Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов, 
          используя передовые AI-технологии.
        </p>
        
        <div className="cta-buttons">
          <button className="cta-neon-button primary" onClick={handleStartFree}>
            <span className="button-text">НАЧАТЬ БЕСПЛАТНО</span>
            <span className="button-glow"></span>
          </button>
          
          <button className="cta-neon-button secondary" onClick={handleCalculator}>
            <span className="button-text">КАЛЬКУЛЯТОР</span>
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
}