'use client';

import { useEffect, useRef } from 'react';

export default function NeuroExpertHero() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Класс для узлов нейросети
    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 1000; // Глубина
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.vz = (Math.random() - 0.5) * 0.5;
        this.radius = 1;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.pulsePhase += 0.02;

        // Границы с плавным отскоком
        if (this.x < 50 || this.x > width - 50) this.vx *= -0.9;
        if (this.y < 50 || this.y > height - 50) this.vy *= -0.9;
        if (this.z < 0 || this.z > 1000) this.vz *= -0.9;

        // Эффект глубины
        const scale = (1000 - this.z) / 1000;
        this.radius = 0.5 + scale * 1.5 + Math.sin(this.pulsePhase) * 0.3;
      }

      draw() {
        const scale = (1000 - this.z) / 1000;
        const opacity = scale * 0.8;
        
        // Свечение узла
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 5);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(99, 102, 241, ${opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.radius * 5, this.y - this.radius * 5, this.radius * 10, this.radius * 10);
        
        // Центральная точка
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`;
        ctx.fill();
      }
    }

    // Создаем узлы
    const nodeCount = 50;
    for (let i = 0; i < nodeCount; i++) {
      nodesRef.current.push(new Node());
    }

    // Функция анимации
    const animate = () => {
      // Затемненный фон с эффектом глубины
      ctx.fillStyle = 'rgba(10, 5, 26, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Сортируем по глубине для правильного отображения
      nodesRef.current.sort((a, b) => b.z - a.z);

      // Рисуем связи
      nodesRef.current.forEach((node, i) => {
        node.update();

        // Соединяем только близкие узлы на похожей глубине
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const other = nodesRef.current[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dz = Math.abs(other.z - node.z);
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200 && dz < 200) {
            const scale = (1000 - (node.z + other.z) / 2) / 1000;
            const opacity = (1 - distance / 200) * (1 - dz / 200) * scale * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            
            // Градиент для линий
            const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
            gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(99, 102, 241, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = scale * 0.5;
            ctx.stroke();
          }
        }
      });

      // Рисуем узлы
      nodesRef.current.forEach(node => node.draw());

      // Эффект курсора
      const mouseGradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 150
      );
      mouseGradient.addColorStop(0, 'rgba(168, 85, 247, 0.1)');
      mouseGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = mouseGradient;
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Обработчики событий
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Анимация текста
    const animateText = () => {
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
            transform: translateZ(100px) rotateY(90deg);
            animation: letterReveal3D 1s ${i * 0.1}s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          `;
          header.appendChild(span);
        });
      }
    };

    setTimeout(animateText, 500);

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
    const button = e.currentTarget;
    
    // Ripple эффект
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
    
    // Открываем AI чат
    setTimeout(() => {
      const aiButton = document.querySelector('.ai-float-button');
      if (aiButton) aiButton.click();
    }, 300);
  };

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="neural-network-canvas" />
      
      <div className="depth-layers">
        <div className="depth-layer layer-1"></div>
        <div className="depth-layer layer-2"></div>
        <div className="depth-layer layer-3"></div>
      </div>
      
      <div className="hero-content">
        <div className="content-wrapper">
          <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
          <p className="tagline">Искусственный интеллект для вашего бизнеса</p>
          
          <button 
            className="cta-button"
            onClick={handleStartClick}
          >
            <span className="button-bg"></span>
            <span className="button-content">
              <span className="button-text">Начать</span>
              <span className="button-arrow">→</span>
            </span>
          </button>
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
          overflow: hidden;
          background: #0A051A;
          perspective: 1000px;
        }

        .neural-network-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        /* Слои глубины */
        .depth-layers {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .depth-layer {
          position: absolute;
          inset: 0;
          opacity: 0.03;
        }

        .layer-1 {
          background: radial-gradient(circle at 30% 50%, #6366f1 0%, transparent 50%);
          animation: float1 20s infinite ease-in-out;
        }

        .layer-2 {
          background: radial-gradient(circle at 70% 70%, #a855f7 0%, transparent 50%);
          animation: float2 25s infinite ease-in-out;
        }

        .layer-3 {
          background: radial-gradient(circle at 50% 20%, #60a5fa 0%, transparent 50%);
          animation: float3 30s infinite ease-in-out;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 20px) scale(0.9); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 40px) scale(1.05); }
        }

        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1400px;
          padding: 0 60px;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 40px;
          padding-left: 10%;
        }

        /* Заголовок с элегантным оформлением */
        .main-header {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 300;
          font-size: clamp(60px, 8vw, 120px);
          line-height: 0.9;
          margin: 0;
          letter-spacing: -0.02em;
          color: transparent;
          background: linear-gradient(135deg, 
            #ffffff 0%, 
            #93c5fd 25%, 
            #6366f1 50%, 
            #a855f7 75%, 
            #ffffff 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 4s ease infinite;
          filter: drop-shadow(0 0 40px rgba(99, 102, 241, 0.3));
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes letterReveal3D {
          to {
            opacity: 1;
            transform: translateZ(0) rotateY(0);
          }
        }

        .tagline {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          font-size: clamp(18px, 2vw, 24px);
          color: #93c5fd;
          opacity: 0;
          animation: fadeInSlide 1s 1.5s ease-out forwards;
          letter-spacing: 0.02em;
        }

        @keyframes fadeInSlide {
          to {
            opacity: 0.8;
            transform: translateX(0);
          }
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
        }

        /* Минималистичная кнопка */
        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: #ffffff;
          opacity: 0;
          animation: fadeInSlide 1s 1.8s ease-out forwards;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .button-bg {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, 
            rgba(99, 102, 241, 0.1) 0%, 
            rgba(168, 85, 247, 0.1) 100%
          );
          border-radius: 50px;
          backdrop-filter: blur(10px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .button-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 50px;
          border: 1px solid rgba(147, 197, 253, 0.2);
          border-radius: 50px;
          background: transparent;
          transition: all 0.3s ease;
        }

        .button-text {
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .button-arrow {
          font-size: 24px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cta-button:hover .button-bg {
          opacity: 1;
        }

        .cta-button:hover .button-content {
          border-color: rgba(147, 197, 253, 0.5);
          transform: translateZ(10px);
        }

        .cta-button:hover .button-arrow {
          transform: translateX(5px);
        }

        .cta-button:active {
          transform: scale(0.98);
        }

        /* Ripple эффект */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
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
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }

        /* Адаптивность */
        @media (max-width: 1024px) {
          .hero-content {
            padding: 0 40px;
          }

          .content-wrapper {
            padding-left: 0;
            align-items: center;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            padding: 0 20px;
          }

          .main-header {
            font-size: clamp(48px, 12vw, 80px);
          }

          .tagline {
            font-size: 18px;
          }

          .button-content {
            padding: 16px 40px;
          }

          .button-text {
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            font-size: 48px;
          }

          .tagline {
            font-size: 16px;
          }

          .button-content {
            padding: 14px 32px;
          }
        }
      `}</style>
    </section>
  );
}