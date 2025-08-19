'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './HeroSectionV6.css';

export default function HeroSectionV6() {
  const canvasRef = useRef(null);
  const router = useRouter();

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

    // Класс частицы
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx + Math.sin(Date.now() * 0.001 + this.pulsePhase) * 0.2;
        this.y += this.vy + Math.cos(Date.now() * 0.001 + this.pulsePhase) * 0.2;
        this.pulsePhase += 0.01;

        // Границы
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        const pulse = 0.8 + Math.sin(this.pulsePhase) * 0.2;
        ctx.save();
        ctx.globalAlpha = this.opacity * pulse;
        ctx.fillStyle = '#3B82F6';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#3B82F6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Создаем частицы
    const particles = Array(150).fill().map(() => new Particle());

    // Переменные для мыши
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    // Анимационный цикл
    const animate = () => {
      // Очищаем canvas с эффектом следа
      ctx.fillStyle = 'rgba(10, 5, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем связи между частицами
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.strokeStyle = '#6366F1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        });

        // Эффект от мыши
        const mouseDx = p1.x - mouseX;
        const mouseDy = p1.y - mouseY;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDistance < 100) {
          const force = (100 - mouseDistance) / 100;
          p1.vx += mouseDx * force * 0.01;
          p1.vy += mouseDy * force * 0.01;
        }

        p1.update();
        p1.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Анимация заголовка
  useEffect(() => {
    const timer = setTimeout(() => {
      const mainHeader = document.getElementById('animated-main-header');
      if (!mainHeader) return;

      const text = mainHeader.textContent;
      mainHeader.innerHTML = '';

      // Создаем буквы
      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        span.style.animationDelay = `${index * 0.07}s`;
        mainHeader.appendChild(span);

        // Создаем импульс для каждой буквы
        setTimeout(() => {
          const pulse = document.createElement('span');
          pulse.className = 'neural-pulse';
          span.appendChild(pulse);
          
          setTimeout(() => {
            pulse.remove();
          }, 500);
        }, index * 70);
      });

      // Анимируем остальные элементы
      const elements = [
        { selector: '.pre-header', delay: 0 },
        { selector: '.sub-header', delay: 800 },
        { selector: '.sub-header-caption', delay: 1000 },
        { selector: '.description', delay: 1200 },
        { selector: '.cta-button', delay: 1400 }
      ];

      elements.forEach(({ selector, delay }) => {
        const element = document.querySelector(selector);
        if (element) {
          element.style.animationDelay = `${delay}ms`;
          element.classList.add('fade-in');
        }
      });
    }, 100);
  }, []);

  const handleCTAClick = (e) => {
    e.preventDefault();
    router.push('/chat');
  };

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="hero-background-animation" />
      
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
  );
}