'use client';

import { useEffect, useRef } from 'react';

export default function NeuroExpertHero() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Настройка canvas
    canvas.width = width;
    canvas.height = height;

    // Класс для частиц
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
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
      }
    }

    // Создаем частицы
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    // Функция анимации
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Рисуем связи между частицами
      particlesRef.current.forEach((particle, i) => {
        particle.update();
        particle.draw();

        // Соединяем близкие частицы
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[j].x - particle.x;
          const dy = particlesRef.current[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Соединяем с курсором
        const mouseDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - particle.x, 2) +
          Math.pow(mouseRef.current.y - particle.y, 2)
        );

        if (mouseDistance < 200) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 * (1 - mouseDistance / 200)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Обработчик движения мыши
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Обработчик изменения размера окна
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Анимация заголовка
    const animateHeader = () => {
      const header = document.getElementById('animated-main-header');
      if (header && header.children.length === 0) {
        const text = header.textContent;
        header.innerHTML = '';
        
        text.split('').forEach((char, i) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.className = 'letter';
          span.style.cssText = `
            display: inline-block;
            opacity: 0;
            transform: translateY(50px) rotateX(90deg);
            animation: letterReveal 0.8s ${i * 0.08}s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          `;
          header.appendChild(span);
        });
      }
    };

    setTimeout(animateHeader, 300);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStartClick = (e) => {
    e.preventDefault();
    setTimeout(() => {
      const aiButton = document.querySelector('.ai-float-button');
      if (aiButton) {
        aiButton.click();
      }
    }, 100);
  };

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="neural-network-canvas" />
      
      <div className="hero-content">
        <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
        <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
        <h2 className="sub-header">СОЗДАЙТЕ ЦИФРОВОЕ ПОЗИЦИОНИРОВАНИЕ</h2>
        <p className="description">
          Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов с помощью передовых ИИ технологий.
        </p>
        <div className="cta-buttons">
          <a href="#benefits" className="cta-button cta-calculator">
            <span className="button-gradient"></span>
            <span className="button-content">
              <span className="button-icon">🧮</span>
              <span>Калькулятор</span>
            </span>
          </a>
          <a 
            href="#" 
            className="cta-button cta-start"
            onClick={handleStartClick}
          >
            <span className="button-gradient"></span>
            <span className="button-content">
              <span className="button-icon">🚀</span>
              <span>Начать бесплатно</span>
            </span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          background: #0A051A;
        }

        .neural-network-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          padding: 20px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .pre-header {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #A0A3B5;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin: 0 0 24px 0;
          opacity: 0;
          animation: fadeInDown 1s ease-out forwards;
        }

        .main-header {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 700;
          font-size: 80px;
          line-height: 1;
          margin: 0 0 24px 0;
          background: linear-gradient(135deg, #A855F7 0%, #6366F1 50%, #60A5FA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.4));
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .sub-header {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 600;
          font-size: 36px;
          color: #60A5FA;
          text-transform: uppercase;
          margin: 0 0 20px 0;
          letter-spacing: 0.05em;
          opacity: 0;
          animation: fadeInUp 1s 0.6s ease-out forwards;
        }

        .description {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          font-size: 20px;
          color: #D1D5DB;
          max-width: 650px;
          line-height: 1.6;
          margin: 0 auto 40px;
          opacity: 0;
          animation: fadeInUp 1s 0.8s ease-out forwards;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 40px;
          opacity: 0;
          animation: fadeInUp 1s 1s ease-out forwards;
        }

        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0;
          border: none;
          border-radius: 50px;
          text-decoration: none;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
                      box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .button-gradient {
          position: absolute;
          inset: 0;
          border-radius: 50px;
          z-index: 0;
        }

        .cta-calculator .button-gradient {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        }

        .cta-start .button-gradient {
          background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);
        }

        .button-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          z-index: 2;
          transition: left 0.6s;
        }

        .cta-calculator {
          box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.6);
        }

        .cta-start {
          box-shadow: 0 10px 30px -10px rgba(168, 85, 247, 0.6);
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
        }

        .cta-calculator:hover {
          box-shadow: 0 15px 40px -10px rgba(99, 102, 241, 0.8);
        }

        .cta-start:hover {
          box-shadow: 0 15px 40px -10px rgba(168, 85, 247, 0.8);
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button:active {
          transform: translateY(-1px) scale(0.98);
        }

        .button-icon {
          font-size: 20px;
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
          animation: iconPulse 2s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes letterReveal {
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .neural-network-canvas {
            opacity: 0.5; /* Уменьшаем яркость на мобильных */
          }

          .hero-content {
            padding: 20px 15px;
          }

          .pre-header {
            font-size: 12px;
            letter-spacing: 0.1em;
          }

          .main-header {
            font-size: 48px;
          }

          .sub-header {
            font-size: 24px;
          }

          .description {
            font-size: 16px;
            padding: 0 20px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
          }

          .button-content {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            font-size: 36px;
          }

          .sub-header {
            font-size: 18px;
          }

          .description {
            font-size: 14px;
          }

          .button-content {
            padding: 16px 30px;
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}