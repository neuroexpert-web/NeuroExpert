'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function NeuroExpertHero() {
  const vantaRef = useRef(null);
  const heroRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    if (!scriptsLoaded) return;

    // Инициализация Vanta.js
    if (window.VANTA && window.VANTA.NET && !vantaRef.current) {
      try {
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
          points: 12.00,
          maxDistance: 25.00,
          spacing: 18.00,
          showDots: true
        });
      } catch (error) {
        console.error('Vanta initialization error:', error);
      }
    }

    // Анимация заголовка
    const header = document.getElementById('animated-main-header');
    if (header && header.children.length === 0) {
      const text = header.textContent;
      header.innerHTML = '';
      
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'letter';
        span.style.animationDelay = `${i * 0.08}s`;
        header.appendChild(span);
      });
    }

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, [scriptsLoaded]);

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
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Three.js loaded');
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Vanta.js loaded');
          setScriptsLoaded(true);
        }}
      />

      <section className="hero-section" ref={heroRef}>
        <div className="hero-overlay"></div>
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
              <span>Калькулятор</span>
            </a>
            <a 
              href="#" 
              className="cta-button cta-start"
              onClick={handleStartClick}
            >
              <span className="button-icon">🚀</span>
              <span>Начать бесплатно</span>
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

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          pointer-events: none;
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
        }

        .main-header .letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(50px) rotateX(90deg);
          animation: letterReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
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
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          border-radius: 50px;
          text-decoration: none;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
        }

        .cta-calculator {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
        }

        .cta-start {
          background: linear-gradient(135deg, #A855F7, #EC4899);
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.4);
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .button-icon {
          font-size: 20px;
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
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

          .cta-button {
            padding: 16px 30px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}