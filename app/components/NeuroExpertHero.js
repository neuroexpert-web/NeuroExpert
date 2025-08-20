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
    const particleCount = width > 768 ? 80 : 40; // Меньше частиц на мобильных
    const connectionDistance = width > 768 ? 150 : 100;
    const mouseRadius = width > 768 ? 200 : 100;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
        ctx.fill();

        // Свечение
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.radius * 3, this.y - this.radius * 3, this.radius * 6, this.radius * 6);
      }
    }

    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 5, 26, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Обновляем и рисуем частицы
      particles.forEach((particle, i) => {
        particle.update();

        // Соединяем частицы
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const opacity = (1 - distance / connectionDistance) * 0.5;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Взаимодействие с мышью
        const mouseDistance = Math.sqrt(
          Math.pow(mouseX - particle.x, 2) + Math.pow(mouseY - particle.y, 2)
        );

        if (mouseDistance < mouseRadius) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          const opacity = (1 - mouseDistance / mouseRadius) * 0.5;
          ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        particle.draw();
      });

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
          opacity: 0.7;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 40px 20px;
          max-width: 900px;
          width: 100%;
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
          margin: 0 auto 40px;
          max-width: 600px;
          opacity: 0;
          animation: fadeIn 1s 0.6s ease-out forwards;
        }

        .cta-button {
          position: relative;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          font-family: 'Inter', -apple-system, sans-serif;
          opacity: 0;
          animation: fadeIn 1s 0.8s ease-out forwards;
        }

        .button-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border-radius: 50px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.5);
        }

        .button-icon {
          font-size: 20px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-button:hover .button-inner {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px -10px rgba(99, 102, 241, 0.7);
        }

        .cta-button:hover .button-icon {
          transform: translateX(4px);
        }

        .cta-button:active .button-inner {
          transform: translateY(0);
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
          .neural-canvas {
            opacity: 0.5;
          }

          .hero-content {
            padding: 20px;
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
            margin-bottom: 32px;
            padding: 0 10px;
          }

          .button-inner {
            padding: 16px 32px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            font-size: 40px;
          }

          .sub-header {
            font-size: 18px;
          }

          .description {
            font-size: 15px;
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