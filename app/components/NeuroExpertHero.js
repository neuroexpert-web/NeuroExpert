'use client';

import { useEffect, useRef } from 'react';

export default function NeuroExpertHero() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Настройка canvas с учетом DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Параметры сети
    const particles = [];
    const particleCount = width > 768 ? 100 : 60;
    const connectionDistance = width > 768 ? 200 : 150;
    const mouseRadius = width > 768 ? 250 : 150;

    // Класс для частиц с улучшенной яркостью
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.brightness = 0.5 + Math.random() * 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulsePhase += 0.02;

        // Плавный отскок от границ
        if (this.x < 20 || this.x > width - 20) this.vx *= -1;
        if (this.y < 20 || this.y > height - 20) this.vy *= -1;

        // Пульсация яркости
        this.brightness = 0.5 + Math.sin(this.pulsePhase) * 0.3;
      }

      draw() {
        // Основная точка с ярким свечением
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.brightness})`;
        ctx.fill();

        // Неоновое свечение вокруг точки
        const glowGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 8);
        glowGradient.addColorStop(0, `rgba(99, 102, 241, ${this.brightness * 0.5})`);
        glowGradient.addColorStop(0.5, `rgba(147, 197, 253, ${this.brightness * 0.3})`);
        glowGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(this.x - this.radius * 8, this.y - this.radius * 8, this.radius * 16, this.radius * 16);
      }
    }

    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = -1000;
    let mouseY = -1000;

    // Класс для анимированных соединений
    class Connection {
      constructor(p1, p2, distance) {
        this.p1 = p1;
        this.p2 = p2;
        this.distance = distance;
        this.opacity = 0;
        this.targetOpacity = (1 - distance / connectionDistance) * 0.6;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.pulsePhase += 0.03;
        this.opacity += (this.targetOpacity - this.opacity) * 0.1;
      }

      draw() {
        const pulse = 1 + Math.sin(this.pulsePhase) * 0.2;
        
        // Градиент для нити
        const gradient = ctx.createLinearGradient(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${this.opacity * pulse})`);
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${this.opacity * pulse * 0.8})`);
        gradient.addColorStop(1, `rgba(99, 102, 241, ${this.opacity * pulse})`);

        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.3; // Очень тонкие нити
        ctx.stroke();
      }
    }

    const connections = [];

    const animate = () => {
      // Полупрозрачный фон для эффекта следа
      ctx.fillStyle = 'rgba(10, 5, 26, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Обновляем соединения
      connections.length = 0;

      // Обновляем частицы и создаем соединения
      particles.forEach((particle, i) => {
        particle.update();

        // Проверяем соединения с другими частицами
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            connections.push(new Connection(particle, otherParticle, distance));
          }
        });

        // Взаимодействие с мышью
        const mouseDistance = Math.sqrt(
          Math.pow(mouseX - particle.x, 2) + Math.pow(mouseY - particle.y, 2)
        );

        if (mouseDistance < mouseRadius) {
          const opacity = (1 - mouseDistance / mouseRadius) * 0.8;
          
          // Яркая нить к курсору
          const gradient = ctx.createLinearGradient(particle.x, particle.y, mouseX, mouseY);
          gradient.addColorStop(0, `rgba(168, 85, 247, ${opacity})`);
          gradient.addColorStop(1, `rgba(236, 72, 153, ${opacity * 0.5})`);
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Рисуем соединения
      connections.forEach(connection => {
        connection.update();
        connection.draw();
      });

      // Рисуем частицы поверх соединений
      particles.forEach(particle => particle.draw());

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // События
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStartClick = (e) => {
    e.preventDefault();
    
    // Ripple эффект
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
    
    // Открываем AI чат
    setTimeout(() => {
      const aiButton = document.querySelector('.ai-float-button');
      if (aiButton) aiButton.click();
    }, 100);
  };

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="neural-canvas" />
      
      <div className="hero-content">
        <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
        <h1 className="main-header">NeuroExpert</h1>
        <h2 className="sub-header">СОЗДАЙТЕ ЦИФРОВОЕ ПОЗИЦИОНИРОВАНИЕ</h2>
        <p className="description">
          Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов с помощью передовых ИИ технологий
        </p>
        
        <button className="cta-button" onClick={handleStartClick}>
          <span className="button-glow"></span>
          <span className="button-border"></span>
          <span className="button-inner">
            <span className="button-text">Начать бесплатно</span>
            <span className="button-icon">→</span>
          </span>
        </button>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0A051A;
          overflow: hidden;
        }

        .neural-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 40px 20px;
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          justify-content: center;
        }

        .pre-header {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: #93c5fd;
          margin: 0 0 24px 0;
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }

        .main-header {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: clamp(60px, 10vw, 96px);
          font-weight: 700;
          line-height: 1;
          margin: 0 0 24px 0;
          background: linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 20px rgba(99, 102, 241, 0.3));
          opacity: 0;
          animation: fadeIn 1s 0.2s ease-out forwards;
        }

        .sub-header {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 600;
          color: #60a5fa;
          margin: 0 0 24px 0;
          letter-spacing: 0.05em;
          opacity: 0;
          animation: fadeIn 1s 0.4s ease-out forwards;
        }

        .description {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: clamp(16px, 2vw, 20px);
          font-weight: 400;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0 auto 50px;
          max-width: 600px;
          opacity: 0;
          animation: fadeIn 1s 0.6s ease-out forwards;
        }

        /* Неоновая прозрачная кнопка */
        .cta-button {
          position: relative;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: 'Inter', -apple-system, sans-serif;
          opacity: 0;
          animation: fadeIn 1s 0.8s ease-out forwards;
          margin-top: auto;
          margin-bottom: 60px;
          overflow: visible;
        }

        .button-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .button-border {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          border-radius: 50px;
          padding: 2px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .button-inner {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          background: rgba(10, 5, 26, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .button-icon {
          font-size: 20px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-button:hover .button-glow {
          opacity: 1;
        }

        .cta-button:hover .button-border {
          opacity: 1;
        }

        .cta-button:hover .button-inner {
          background: rgba(10, 5, 26, 0.8);
          transform: translateY(-2px);
        }

        .cta-button:hover .button-icon {
          transform: translateX(4px);
        }

        .cta-button:active .button-inner {
          transform: translateY(0);
        }

        /* Ripple эффект */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: translate(-50%, -50%);
          animation: rippleEffect 1s ease-out;
          pointer-events: none;
        }

        @keyframes rippleEffect {
          from {
            width: 0;
            height: 0;
            opacity: 1;
          }
          to {
            width: 150px;
            height: 150px;
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-content {
            padding: 20px;
            justify-content: space-between;
            padding-top: 80px;
            padding-bottom: 40px;
          }

          .pre-header {
            font-size: 12px;
            letter-spacing: 0.1em;
            margin-bottom: 16px;
          }

          .main-header {
            font-size: 48px;
            margin-bottom: 16px;
          }

          .sub-header {
            font-size: 20px;
            margin-bottom: 16px;
          }

          .description {
            font-size: 16px;
            margin-bottom: 40px;
            padding: 0 10px;
          }

          .cta-button {
            margin-top: auto;
            margin-bottom: 40px;
          }

          .button-inner {
            padding: 16px 32px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            padding-top: 60px;
            padding-bottom: 30px;
          }

          .main-header {
            font-size: 40px;
          }

          .sub-header {
            font-size: 18px;
          }

          .description {
            font-size: 15px;
          }

          .cta-button {
            margin-bottom: 30px;
          }

          .button-inner {
            padding: 14px 28px;
            font-size: 14px;
          }
        }

        /* Высокие экраны */
        @media (min-height: 900px) {
          .hero-content {
            max-width: 1000px;
          }

          .main-header {
            font-size: 112px;
          }

          .sub-header {
            font-size: 40px;
          }

          .description {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
}