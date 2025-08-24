'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useVault } from '../hooks/useVault';

export default function NeuroExpertHero() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const { trackEvent, trackTiming } = useAnalytics();
  const { saveContext } = useVault();

  // Отслеживание времени загрузки
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Трекинг загрузки компонента
    const loadTime = Date.now() - startTime.current;
    trackTiming('hero_section', 'load_time', loadTime);
    
    // Сохранение в Vault
    saveContext({
      heroViewed: true,
      heroLoadTime: loadTime,
      viewTimestamp: Date.now()
    });

    // Супер анимация заголовка
    const animateTitle = () => {
      const title = document.getElementById('animated-main-header');
      if (title) {
        const text = title.textContent;
        title.innerHTML = '';
        
        // Создаем 3D эффект для каждой буквы
        text.split('').forEach((char, i) => {
          const wrapper = document.createElement('span');
          wrapper.className = 'letter-wrapper';
          wrapper.style.cssText = `
            display: inline-block;
            position: relative;
            transform-style: preserve-3d;
            animation-delay: ${i * 50}ms;
          `;
          
          const letter = document.createElement('span');
          letter.className = 'letter-3d';
          letter.textContent = char;
          letter.style.cssText = `
            display: inline-block;
            position: relative;
          `;
          
          wrapper.appendChild(letter);
          title.appendChild(wrapper);
        });
      }
    };

    setTimeout(animateTitle, 100);

    // МОЩНАЯ НЕЙРОСЕТЬ с оптимизацией
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      desynchronized: true // Улучшение производительности
    });
    
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Проверка поддержки reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    canvas.width = width;
    canvas.height = height;

    // Нейроны с оптимизацией для производительности
    const neurons = [];
    const neuronCount = prefersReducedMotion ? 50 : Math.min(100, Math.floor((width * height) / 15000));
    
    for (let i = 0; i < neuronCount; i++) {
      neurons.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
        glowIntensity: Math.random() * 0.5 + 0.5,
        type: Math.random() > 0.7 ? 'active' : 'passive',
        connections: []
      });
    }

    // Оптимизированная функция рисования
    function drawNetwork() {
      ctx.fillStyle = '#0A051A';
      ctx.fillRect(0, 0, width, height);

      // Связи между нейронами - оптимизировано
      neurons.forEach((neuron, i) => {
        neurons.slice(i + 1).forEach(other => {
          const dx = other.x - neuron.x;
          const dy = other.y - neuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.3;
            
            const gradient = ctx.createLinearGradient(
              neuron.x, neuron.y, other.x, other.y
            );
            
            if (neuron.type === 'active' || other.type === 'active') {
              gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
              gradient.addColorStop(0.5, `rgba(16, 185, 129, ${opacity})`);
              gradient.addColorStop(1, `rgba(99, 102, 241, ${opacity})`);
            } else {
              gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity * 0.5})`);
              gradient.addColorStop(1, `rgba(16, 185, 129, ${opacity * 0.5})`);
            }
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = neuron.type === 'active' ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(neuron.x, neuron.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Рисуем нейроны
      neurons.forEach(neuron => {
        const pulse = Math.sin(neuron.pulsePhase) * 0.5 + 0.5;
        const glowRadius = neuron.radius + pulse * 10;
        
        if (neuron.type === 'active') {
          const gradient = ctx.createRadialGradient(
            neuron.x, neuron.y, 0,
            neuron.x, neuron.y, glowRadius
          );
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.5)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = neuron.type === 'active' 
          ? `rgba(99, 102, 241, ${neuron.glowIntensity})`
          : `rgba(148, 163, 184, ${neuron.glowIntensity * 0.5})`;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Интерактивный эффект от мыши
      const mouseGradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 200
      );
      mouseGradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
      mouseGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.1)');
      mouseGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      
      ctx.fillStyle = mouseGradient;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 200, 0, Math.PI * 2);
      ctx.fill();
    }

    // Анимация с оптимизацией
    function animate() {
      if (!prefersReducedMotion) {
        neurons.forEach(neuron => {
          neuron.x += neuron.vx;
          neuron.y += neuron.vy;
          neuron.pulsePhase += 0.02;
          
          if (neuron.x < 0 || neuron.x > width) neuron.vx *= -1;
          if (neuron.y < 0 || neuron.y > height) neuron.vy *= -1;
          
          neuron.x = Math.max(0, Math.min(width, neuron.x));
          neuron.y = Math.max(0, Math.min(height, neuron.y));
        });
      }
      
      drawNetwork();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

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

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trackEvent, trackTiming, saveContext]);

  // Обработчик клика на CTA кнопку
  const handleCTAClick = useCallback((e) => {
    e.preventDefault();
    
    // Трекинг события
    trackEvent('cta_click', {
      button: 'hero_start_free',
      location: 'hero_section',
      text: 'НАЧАТЬ БЕСПЛАТНО'
    });
    
    // Переход к AI чату
    const aiButton = document.querySelector('.ai-float-button');
    if (aiButton) {
      aiButton.click();
    } else {
      // Фоллбэк - переход к следующей секции
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);
    }
  }, [trackEvent]);

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background-color: #0A051A;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .neural-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 50px 20px;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          animation: fadeIn 1s ease-out;
        }

        .pre-header {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 3px;
          color: #6366f1;
          text-transform: uppercase;
          margin-bottom: 40px;
          animation: slideInTop 0.8s ease-out;
          opacity: 0.9;
          text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
        }

        .main-header {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(80px, 15vw, 180px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -2px;
          margin-bottom: 50px;
          color: transparent;
          background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 50%, #f8f8f8 100%);
          -webkit-background-clip: text;
          background-clip: text;
          position: relative;
          text-shadow: 0 0 60px rgba(99, 102, 241, 0.8);
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .letter-wrapper {
          animation: letterFloat 3s ease-in-out infinite;
        }

        .letter-3d {
          transition: all 0.3s ease;
        }

        .letter-wrapper:hover .letter-3d {
          transform: translateZ(20px) rotateY(20deg);
          color: #6366f1;
        }

        @keyframes letterFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0);
          }
          50% {
            transform: translateY(-10px) rotateX(5deg);
          }
        }

        .sub-header {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          color: #10b981;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 40px;
          animation: slideInBottom 1s ease-out 0.2s both;
          text-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
        }

        .description {
          font-family: 'Inter', sans-serif;
          font-size: clamp(18px, 2vw, 22px);
          line-height: 1.8;
          color: #94a3b8;
          max-width: 800px;
          margin-bottom: 60px;
          animation: slideInBottom 1s ease-out 0.4s both;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 22px 60px;
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #ffffff;
          background: linear-gradient(135deg, #6366f1 0%, #10b981 100%);
          border: none;
          border-radius: 60px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: pulseIn 1s ease-out 0.6s both;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 10px 40px rgba(99, 102, 241, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.6s ease;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 
            0 20px 60px rgba(99, 102, 241, 0.5),
            inset 0 0 30px rgba(255, 255, 255, 0.2);
        }

        .cta-button:hover::before {
          width: 400px;
          height: 400px;
        }

        .cta-button:active {
          transform: translateY(-1px) scale(1.02);
        }

        /* Анимации */
        @keyframes slideInTop {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInBottom {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulseIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Эффект глитча для заголовка */
        @keyframes glitch {
          0%, 100% {
            text-shadow: 
              0 0 40px rgba(0, 255, 255, 0.8),
              0 0 80px rgba(99, 102, 241, 0.6);
          }
          20% {
            text-shadow: 
              2px 2px 40px rgba(255, 0, 255, 0.8),
              -2px -2px 80px rgba(0, 255, 255, 0.6);
          }
          40% {
            text-shadow: 
              -2px 2px 40px rgba(0, 255, 255, 0.8),
              2px -2px 80px rgba(255, 255, 0, 0.6);
          }
        }

        .main-header:hover .letter-3d {
          animation: glitch 0.3s ease-in-out infinite;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-content {
            padding: 30px 20px;
            gap: 30px;
          }

          .pre-header {
            font-size: 14px;
            margin-bottom: 30px;
          }

          .main-header {
            font-size: clamp(50px, 12vw, 80px);
            margin-bottom: 40px;
          }

          .sub-header {
            font-size: clamp(20px, 5vw, 28px);
            margin-bottom: 30px;
          }

          .cta-button {
            padding: 18px 45px;
            font-size: 16px;
          }

          .description {
            font-size: 16px;
            margin-bottom: 40px;
            line-height: 1.6;
          }
        }

        /* Доступность */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
          
          .letter-wrapper:hover .letter-3d {
            transform: none;
          }
        }

        /* Высокая контрастность */
        @media (prefers-contrast: high) {
          .pre-header {
            color: #818cf8;
          }
          
          .description {
            color: #cbd5e1;
          }
          
          .cta-button {
            border: 2px solid white;
          }
        }
      `}</style>

      <section 
        className="hero-section"
        role="banner"
        aria-label="NeuroExpert - Цифровая AI платформа для бизнеса"
      >
        <canvas 
          ref={canvasRef} 
          className="neural-canvas"
          role="img"
          aria-label="Анимированная нейронная сеть на фоне"
        />
        <div className="hero-content">
          <p className="pre-header" role="heading" aria-level="3">
            ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА
          </p>
          <h1 
            className="main-header" 
            id="animated-main-header"
            role="heading"
            aria-level="1"
          >
            NeuroExpert
          </h1>
          <h2 
            className="sub-header"
            role="heading"
            aria-level="2"
          >
            СОЗДАЙТЕ ЦИФРОВОЕ ПОЗИЦИОНИРОВАНИЕ
          </h2>
          <p className="description">
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов с помощью передовых ИИ технологий.
          </p>
          <button 
            onClick={handleCTAClick}
            className="cta-button"
            aria-label="Начать бесплатное использование NeuroExpert"
          >
            <span>НАЧАТЬ БЕСПЛАТНО</span>
          </button>
        </div>
      </section>
    </>
  );
}