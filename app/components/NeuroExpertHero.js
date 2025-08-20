'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function NeuroExpertHero() {
  useEffect(() => {
    // Инициализация Vanta.js после загрузки всех скриптов
    const initVanta = () => {
      if (window.VANTA && window.THREE) {
        window.VANTA.NET({
          el: "#vanta-background",
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

        // Анимация заголовка "Neural Impulse"
        const header = document.getElementById('animated-main-header');
        if (header) {
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
      }
    };

    // Проверяем загрузку библиотек
    const checkAndInit = () => {
      if (window.VANTA && window.THREE) {
        initVanta();
      } else {
        setTimeout(checkAndInit, 100);
      }
    };

    checkAndInit();
  }, []);

  return (
    <>
      {/* Загрузка библиотек для анимации согласно ТЗ */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        strategy="afterInteractive"
      />

      <style jsx>{`
        /* Глобальные стили и фон согласно ТЗ */
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

        #vanta-background {
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
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Типография согласно ТЗ */
        .pre-header {
          font-weight: 500;
          font-size: 14px;
          color: #A0A3B5;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeIn 1s 0.3s ease-out forwards;
        }

        .main-header {
          font-weight: 700;
          font-size: clamp(48px, 10vw, 80px);
          margin: 0;
          background: linear-gradient(90deg, #A855F7, #6366F1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .sub-header {
          font-weight: 600;
          font-size: clamp(24px, 5vw, 36px);
          color: #60A5FA;
          text-transform: uppercase;
          margin-top: 24px;
          margin-bottom: 16px;
          opacity: 0;
          animation: fadeIn 1s 0.5s ease-out forwards;
        }

        .description {
          font-weight: 400;
          font-size: clamp(16px, 3vw, 20px);
          color: #D1D5DB;
          max-width: 600px;
          line-height: 1.6;
          margin: 24px auto 40px auto;
          opacity: 0;
          animation: fadeIn 1s 0.6s ease-out forwards;
        }

        /* Кнопки CTA согласно ТЗ */
        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 40px;
          opacity: 0;
          animation: fadeIn 1s 0.8s ease-out forwards;
        }

        .cta-button {
          display: inline-block;
          padding: 18px 40px;
          border-radius: 50px;
          border: none;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          text-transform: uppercase;
          background: linear-gradient(90deg, #6366F1, #A855F7);
          box-shadow: 0 10px 30px -5px rgba(168, 85, 247, 0.4);
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.3), 
            transparent);
          transition: left 0.6s;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px -5px rgba(168, 85, 247, 0.5);
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button.secondary {
          background: linear-gradient(90deg, #A855F7, #EC4899);
          box-shadow: 0 10px 30px -5px rgba(236, 72, 153, 0.4);
        }

        .cta-button.secondary:hover {
          box-shadow: 0 15px 35px -5px rgba(236, 72, 153, 0.5);
        }

        /* Иконки для кнопок */
        .button-icon {
          margin-right: 8px;
          font-size: 20px;
          vertical-align: middle;
        }

        /* Анимации */
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

        @keyframes letterReveal {
          0% {
            opacity: 0;
            transform: translateY(50px) rotateX(90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }

        /* Анимация букв заголовка */
        .main-header .letter {
          display: inline-block;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-content {
            padding: 20px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
            padding: 16px 32px;
          }

          .pre-header {
            font-size: 12px;
          }

          .main-header {
            font-size: clamp(36px, 8vw, 60px);
          }

          .sub-header {
            font-size: clamp(18px, 4vw, 28px);
          }

          .description {
            font-size: clamp(14px, 2.5vw, 18px);
          }
        }
      `}</style>

      <section className="hero-section">
        <div id="vanta-background"></div>
        <div className="hero-content">
          <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
          <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
          <h2 className="sub-header">СОЗДАЙТЕ ЦИФРОВОЕ ПОЗИЦИОНИРОВАНИЕ</h2>
          <p className="description">
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов с помощью передовых ИИ технологий.
          </p>
          <div className="cta-buttons">
            <a href="/roi-calculator" className="cta-button">
              <span className="button-icon">🧮</span>
              Калькулятор
            </a>
            <a href="/smart-ai" className="cta-button secondary">
              <span className="button-icon">🚀</span>
              Начать бесплатно
            </a>
          </div>
        </div>
      </section>
    </>
  );
}