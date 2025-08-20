'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function NeuroExpertHero() {
  const vantaRef = useRef(null);
  const heroRef = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);

  useEffect(() => {
    // Функция инициализации Vanta
    const initVanta = () => {
      if (window.THREE && window.VANTA && !vantaRef.current) {
        try {
          vantaRef.current = window.VANTA.NET({
            el: heroRef.current,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x6366f1,
            backgroundColor: 0x0a051a,
            points: 20.00,
            maxDistance: 25.00,
            spacing: 15.00
          });
          console.log('Vanta NET initialized successfully');
        } catch (error) {
          console.error('Vanta initialization error:', error);
        }
      }
    };

    // Проверяем загрузку и инициализируем
    if (vantaLoaded && window.THREE && window.VANTA) {
      setTimeout(initVanta, 100);
    }

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
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [vantaLoaded]);

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
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Three.js loaded');
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Vanta.js loaded');
          setVantaLoaded(true);
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
      </section>

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

        /* Fallback для Vanta фона */
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 20%, rgba(96, 165, 250, 0.1) 0%, transparent 50%);
          pointer-events: none;
          opacity: 0.7;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
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
    </>
  );
}