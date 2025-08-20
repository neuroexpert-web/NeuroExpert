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

        // Анимация заголовка "Нейронный импульс"
        const header = document.getElementById('animated-main-header');
        if (header) {
          const text = header.textContent;
          header.innerHTML = '';
          
          // Оборачиваем каждую букву в span
          text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            header.appendChild(span);
          });

          // Запуск анимации
          const chars = document.querySelectorAll('.char');
          chars.forEach((char, index) => {
            setTimeout(() => {
              char.classList.add('visible');
            }, index * 70); // Задержка появления для каждой буквы
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

        /* Типография */
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

        /* Неоновая прозрачная кнопка (как мы утвердили ранее) */
        .cta-button {
          position: relative;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: 'Inter', -apple-system, sans-serif;
          opacity: 0;
          animation: fadeIn 1s 0.8s ease-out forwards, pulseGlow 2s 1.8s ease-in-out infinite;
          margin-top: 40px;
          overflow: visible;
          display: inline-block;
        }

        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(0, 255, 255, 0.8));
          }
        }

        .button-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
          filter: blur(20px);
          pointer-events: none;
        }

        .button-content {
          position: relative;
          padding: 18px 40px;
          border: 2px solid;
          border-image: linear-gradient(90deg, #6366F1, #A855F7) 1;
          border-radius: 50px;
          background: transparent;
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .button-text {
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(90deg, #6366F1, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .cta-button:hover .button-content {
          transform: translateY(-2px);
          background: rgba(99, 102, 241, 0.1);
          box-shadow: 0 15px 35px -5px rgba(168, 85, 247, 0.5);
        }

        /* Стили для анимации букв из ТЗ */
        .char {
          position: relative;
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .char.visible {
          opacity: 1;
          transform: translateY(0);
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

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-content {
            padding: 20px;
          }

          .cta-button {
            margin-bottom: 60px;
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
          <a href="/smart-ai" className="cta-button">
            <div className="button-glow"></div>
            <div className="button-content">
              <span className="button-text">Начать</span>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}