'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function NeuroExpertHero() {
  const vantaRef = useRef(null);
  const heroRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Отслеживание мыши для параллакс эффекта
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Инициализация Vanta.js с улучшенными параметрами
    const initVanta = () => {
      if (window.VANTA && !vantaRef.current) {
        vantaRef.current = window.VANTA.NET({
          el: heroRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x6366f1,
          backgroundColor: 0x0a051a,
          points: 15.00, // Увеличено для большей детализации
          maxDistance: 30.00,
          spacing: 16.00,
          showDots: true
        });
        setIsLoaded(true);
      }
    };

    if (window.VANTA) {
      initVanta();
    } else {
      window.vantaInit = initVanta;
    }

    // Премиальная анимация заголовка с 3D эффектом
    const animateHeader = () => {
      const header = document.getElementById('animated-main-header');
      if (!header) return;
      
      const text = header.textContent;
      header.innerHTML = '';
      
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(50px) rotateX(90deg) scale(0.5);
          animation: premiumLetterReveal 1s ${i * 0.08}s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        `;
        span.classList.add('header-letter');
        header.appendChild(span);
      });
    };

    setTimeout(animateHeader, 300);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
    };
  }, []);

  const handleStartClick = (e) => {
    e.preventDefault();
    // Добавляем пульсирующий эффект перед открытием
    e.target.classList.add('pulse-effect');
    setTimeout(() => {
      const aiButton = document.querySelector('.ai-float-button');
      if (aiButton) {
        aiButton.click();
      }
    }, 300);
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.vantaInit) {
            window.vantaInit();
          }
        }}
      />

      <section className="hero-section" ref={heroRef}>
        {/* Дополнительные слои для глубины */}
        <div className="gradient-overlay" />
        <div className="noise-overlay" />
        
        <div 
          className="hero-content"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
          }}
        >
          <p className="pre-header">
            <span className="pre-header-line" />
            ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА
            <span className="pre-header-line" />
          </p>
          
          <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
          
          <div className="header-glow" />
          
          <h2 className="sub-header">
            <span className="sub-header-word">СОЗДАЙТЕ</span>
            <span className="sub-header-word">ЦИФРОВОЕ</span>
            <span className="sub-header-word">ПОЗИЦИОНИРОВАНИЕ</span>
          </h2>
          
          <p className="description">
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов 
            с помощью передовых ИИ технологий.
          </p>
          
          <div className="cta-buttons">
            <a href="#benefits" className="cta-button cta-calculator">
              <span className="button-bg" />
              <span className="button-content">
                <span className="button-icon">🧮</span>
                <span className="button-text">Калькулятор</span>
              </span>
              <span className="button-border" />
            </a>
            
            <a 
              href="#" 
              className="cta-button cta-start"
              onClick={handleStartClick}
            >
              <span className="button-bg" />
              <span className="button-content">
                <span className="button-icon">🚀</span>
                <span className="button-text">Начать бесплатно</span>
              </span>
              <span className="button-border" />
            </a>
          </div>
        </div>

        {/* Декоративные элементы */}
        <div className="floating-particles">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          background-color: #0A051A;
          perspective: 1000px;
        }

        /* Слои для глубины */
        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at center, transparent 0%, rgba(10, 5, 26, 0.4) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.03;
          z-index: 1;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 20px;
          max-width: 1200px;
          width: 100%;
          transition: transform 0.15s ease-out;
          will-change: transform;
        }

        /* Премиальный pre-header */
        .pre-header {
          font-weight: 500;
          font-size: 14px;
          color: #A0A3B5;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 32px;
          opacity: 0;
          animation: fadeInDown 1s ease-out forwards;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .pre-header-line {
          display: inline-block;
          width: 50px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #A0A3B5, transparent);
          animation: expandLine 1.5s ease-out forwards;
        }

        /* Главный заголовок с премиальными эффектами */
        .main-header {
          font-weight: 700;
          font-size: clamp(48px, 10vw, 96px);
          margin: 0;
          background: linear-gradient(135deg, #A855F7 0%, #6366F1 50%, #60A5FA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        /* Свечение заголовка */
        .header-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
          filter: blur(40px);
          animation: glow-pulse 4s ease-in-out infinite;
          pointer-events: none;
        }

        /* Подзаголовок с раздельной анимацией слов */
        .sub-header {
          font-weight: 600;
          font-size: clamp(24px, 5vw, 40px);
          color: #60A5FA;
          text-transform: uppercase;
          margin-top: 28px;
          margin-bottom: 20px;
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .sub-header-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: wordReveal 0.8s ease-out forwards;
        }

        .sub-header-word:nth-child(1) { animation-delay: 0.8s; }
        .sub-header-word:nth-child(2) { animation-delay: 0.95s; }
        .sub-header-word:nth-child(3) { animation-delay: 1.1s; }

        /* Описание с элегантной анимацией */
        .description {
          font-weight: 400;
          font-size: clamp(16px, 3vw, 22px);
          color: #D1D5DB;
          max-width: 650px;
          line-height: 1.7;
          margin: 28px auto 48px auto;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s 1.3s ease-out forwards;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
        }

        /* Премиальные кнопки */
        .cta-buttons {
          display: flex;
          gap: 24px;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 1s 1.5s ease-out forwards;
        }

        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0;
          border: none;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          text-transform: uppercase;
          cursor: pointer;
          isolation: isolate;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .button-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 45px;
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .button-bg {
          position: absolute;
          inset: 0;
          border-radius: 60px;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .cta-calculator .button-bg {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          box-shadow: 0 10px 40px -10px rgba(99, 102, 241, 0.5);
        }

        .cta-start .button-bg {
          background: linear-gradient(135deg, #A855F7, #EC4899);
          box-shadow: 0 10px 40px -10px rgba(168, 85, 247, 0.5);
        }

        .button-border {
          position: absolute;
          inset: -2px;
          border-radius: 60px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.02);
        }

        .cta-button:hover .button-bg {
          filter: brightness(1.1);
        }

        .cta-button:hover .button-border {
          opacity: 1;
        }

        .cta-calculator:hover .button-bg {
          box-shadow: 0 15px 50px -10px rgba(99, 102, 241, 0.7);
        }

        .cta-start:hover .button-bg {
          box-shadow: 0 15px 50px -10px rgba(168, 85, 247, 0.7);
        }

        .cta-button:active {
          transform: translateY(-1px) scale(0.98);
        }

        .button-icon {
          font-size: 22px;
          filter: drop-shadow(0 0 10px currentColor);
          animation: icon-float 3s ease-in-out infinite;
        }

        .button-text {
          letter-spacing: 0.05em;
        }

        /* Парящие частицы */
        .floating-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(168, 85, 247, 0.6);
          border-radius: 50%;
          filter: blur(1px);
        }

        .particle-1 {
          top: 10%;
          left: 10%;
          animation: float-1 20s infinite ease-in-out;
        }

        .particle-2 {
          top: 20%;
          right: 15%;
          animation: float-2 25s infinite ease-in-out;
        }

        .particle-3 {
          bottom: 30%;
          left: 20%;
          animation: float-3 30s infinite ease-in-out;
        }

        .particle-4 {
          bottom: 20%;
          right: 10%;
          animation: float-4 22s infinite ease-in-out;
        }

        .particle-5 {
          top: 50%;
          left: 50%;
          animation: float-5 28s infinite ease-in-out;
        }

        /* Эффект пульсации при клике */
        .pulse-effect {
          animation: pulse-click 0.6s ease-out;
        }

        /* Анимации */
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

        @keyframes premiumLetterReveal {
          0% {
            opacity: 0;
            transform: translateY(50px) rotateX(90deg) scale(0.5);
            filter: blur(10px);
          }
          50% {
            opacity: 0.5;
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0) scale(1);
            filter: blur(0) drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
          }
        }

        @keyframes wordReveal {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes expandLine {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 50px;
            opacity: 1;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes icon-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(100px, 50px) rotate(120deg); }
          66% { transform: translate(-50px, 100px) rotate(240deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-80px, 80px) rotate(-120deg); }
          66% { transform: translate(120px, -40px) rotate(120deg); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(70px, -70px) rotate(180deg); }
          66% { transform: translate(-100px, 30px) rotate(-90deg); }
        }

        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-60px, -90px) rotate(90deg); }
          66% { transform: translate(90px, 60px) rotate(-180deg); }
        }

        @keyframes float-5 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(50px, 80px) rotate(150deg); }
          66% { transform: translate(-80px, -50px) rotate(-150deg); }
        }

        @keyframes pulse-click {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Hover эффект для букв заголовка */
        :global(.header-letter:hover) {
          transform: translateY(-5px) scale(1.1) !important;
          filter: brightness(1.2);
        }

        /* Мобильная адаптация с сохранением премиальности */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 100vh;
            padding: 20px 0;
          }

          .hero-content {
            padding: 20px 15px;
          }

          .pre-header {
            font-size: 11px;
            margin-bottom: 24px;
          }

          .pre-header-line {
            width: 30px;
          }

          .main-header {
            font-size: clamp(40px, 13vw, 72px);
            line-height: 1.1;
          }

          .sub-header {
            font-size: clamp(18px, 5vw, 32px);
            margin-top: 20px;
            margin-bottom: 16px;
          }

          .description {
            font-size: clamp(15px, 4vw, 18px);
            margin: 20px auto 36px auto;
            padding: 0 15px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }

          .button-content {
            padding: 18px 36px;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
          }

          .floating-particles {
            display: none; /* Отключаем на мобильных для производительности */
          }
        }

        /* Планшеты */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-content {
            padding: 30px;
          }

          .main-header {
            font-size: 72px;
          }

          .sub-header {
            font-size: 32px;
          }

          .description {
            font-size: 19px;
          }
        }

        /* Маленькие устройства с сохранением читаемости */
        @media (max-width: 375px) {
          .pre-header {
            font-size: 10px;
            letter-spacing: 0.15em;
          }

          .main-header {
            font-size: 36px;
          }

          .sub-header {
            font-size: 16px;
            gap: 8px;
          }

          .description {
            font-size: 14px;
            line-height: 1.6;
          }

          .button-content {
            padding: 16px 28px;
            font-size: 14px;
          }

          .button-icon {
            font-size: 18px;
          }
        }

        /* Ландшафтная ориентация */
        @media (max-height: 600px) and (orientation: landscape) {
          .hero-section {
            min-height: auto;
            padding: 30px 0;
          }

          .main-header {
            font-size: clamp(36px, 8vw, 64px);
          }

          .description {
            margin: 16px auto 24px auto;
          }
        }

        /* Оптимизация производительности для слабых устройств */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}