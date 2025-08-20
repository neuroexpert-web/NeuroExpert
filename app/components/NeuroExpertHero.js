'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function NeuroExpertHero() {
  const vantaRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    // Инициализация Vanta.js после загрузки скриптов
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
          color: 0x6366f1, // Синий цвет из градиента
          backgroundColor: 0x0a051a, // Цвет фона #0A051A
          points: 10.00,
          maxDistance: 25.00,
          spacing: 18.00
        });
      }
    };

    // Проверяем загружены ли скрипты
    if (window.VANTA) {
      initVanta();
    } else {
      window.vantaInit = initVanta;
    }

    // Анимация заголовка
    const animateHeader = () => {
      const header = document.getElementById('animated-main-header');
      if (!header) return;
      
      const text = header.textContent;
      header.innerHTML = '';
      
      // Создаем span для каждой буквы
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.animation = `letterFadeIn 0.5s ${i * 0.1}s forwards`;
        header.appendChild(span);
      });
    };

    animateHeader();

    // Cleanup
    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
    };
  }, []);

  const handleStartClick = (e) => {
    e.preventDefault();
    // Открываем AI чат
    setTimeout(() => {
      const aiButton = document.querySelector('.ai-float-button');
      if (aiButton) {
        aiButton.click();
      }
    }, 100);
  };

  return (
    <>
      {/* Загружаем Three.js и Vanta.js */}
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
        <div className="hero-content">
          <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
          <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
          <h2 className="sub-header">СОЗДАЙТЕ ЦИФРОВОЕ ПОЗИЦИОНИРОВАНИЕ</h2>
          <p className="description">
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов с помощью передовых ИИ технологий.
          </p>
          <div className="cta-buttons">
            <a href="#benefits" className="cta-button cta-calculator">
              <span className="button-icon">🧮</span>
              Калькулятор
            </a>
            <a 
              href="#" 
              className="cta-button cta-start"
              onClick={handleStartClick}
            >
              <span className="button-icon">🚀</span>
              Начать бесплатно
            </a>
          </div>
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
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 20px;
          max-width: 1200px;
          width: 100%;
        }

        .pre-header {
          font-weight: 500;
          font-size: 14px;
          color: #A0A3B5;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
          animation: fadeInUp 0.8s ease-out;
        }

        .main-header {
          font-weight: 700;
          font-size: clamp(48px, 10vw, 80px);
          margin: 0;
          background: linear-gradient(90deg, #A855F7, #6366F1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          position: relative;
          filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.5));
        }

        .sub-header {
          font-weight: 600;
          font-size: clamp(24px, 5vw, 36px);
          color: #60A5FA;
          text-transform: uppercase;
          margin-top: 24px;
          margin-bottom: 16px;
          animation: fadeInUp 0.8s 0.2s ease-out both;
        }

        .description {
          font-weight: 400;
          font-size: clamp(16px, 3vw, 20px);
          color: #D1D5DB;
          max-width: 600px;
          line-height: 1.6;
          margin: 24px auto 40px auto;
          animation: fadeInUp 0.8s 0.4s ease-out both;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s 0.6s ease-out both;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          border-radius: 50px;
          border: none;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
        }

        .cta-calculator {
          background: linear-gradient(90deg, #6366F1, #8B5CF6);
          box-shadow: 0 10px 30px -5px rgba(99, 102, 241, 0.4);
        }

        .cta-start {
          background: linear-gradient(90deg, #A855F7, #EC4899);
          box-shadow: 0 10px 30px -5px rgba(168, 85, 247, 0.4);
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
        }

        .cta-calculator:hover {
          box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.6);
        }

        .cta-start:hover {
          box-shadow: 0 15px 35px -5px rgba(168, 85, 247, 0.6);
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .button-icon {
          font-size: 20px;
          filter: drop-shadow(0 0 5px currentColor);
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

        @keyframes letterFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) rotateX(90deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 100vh;
            padding: 20px 0;
          }

          .hero-content {
            padding: 20px 15px;
          }

          .pre-header {
            font-size: 12px;
            margin-bottom: 16px;
          }

          .main-header {
            font-size: clamp(36px, 12vw, 60px);
            line-height: 1.1;
          }

          .sub-header {
            font-size: clamp(18px, 5vw, 28px);
            margin-top: 16px;
            margin-bottom: 12px;
            line-height: 1.2;
          }

          .description {
            font-size: clamp(14px, 4vw, 18px);
            margin: 16px auto 30px auto;
            padding: 0 10px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
            gap: 15px;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
            padding: 16px 30px;
            font-size: 14px;
          }

          .button-icon {
            font-size: 18px;
          }
        }

        /* Планшеты */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-content {
            padding: 30px;
          }

          .main-header {
            font-size: 60px;
          }

          .sub-header {
            font-size: 30px;
          }

          .description {
            font-size: 18px;
          }
        }

        /* Маленькие мобильные устройства */
        @media (max-width: 375px) {
          .pre-header {
            font-size: 11px;
            letter-spacing: 0.08em;
          }

          .main-header {
            font-size: 32px;
          }

          .sub-header {
            font-size: 16px;
          }

          .description {
            font-size: 14px;
            line-height: 1.5;
          }

          .cta-button {
            padding: 14px 24px;
            font-size: 13px;
          }
        }

        /* Ландшафтная ориентация мобильных устройств */
        @media (max-height: 600px) and (orientation: landscape) {
          .hero-section {
            min-height: auto;
            padding: 40px 0;
          }

          .pre-header {
            margin-bottom: 12px;
          }

          .main-header {
            margin-bottom: 12px;
          }

          .sub-header {
            margin-top: 12px;
            margin-bottom: 8px;
          }

          .description {
            margin: 12px auto 20px auto;
          }
        }
      `}</style>
    </>
  );
}