'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function HeroSectionFinal() {
  const [isLoaded, setIsLoaded] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Анимация появления букв в заголовке
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      chars.forEach((char, index) => {
        setTimeout(() => {
          char.classList.add('visible');
        }, index * 70);
      });
    }
  }, []);

  return (
    <section className="hero-section">
      {/* Градиентный фон без анимации */}
      <div className="hero-background">
        <div className="gradient-layer gradient-1"></div>
        <div className="gradient-layer gradient-2"></div>
        <div className="gradient-layer gradient-3"></div>
        <div className="noise-overlay"></div>
      </div>

      {/* Основной контент */}
      <div className="hero-container">
        <AnimatePresence>
          {isLoaded && (
            <motion.div 
              className="hero-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Логотип */}
              <motion.div 
                className="hero-logo"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span className="logo-neuro">Neuro</span>
                <span className="logo-expert">Expert</span>
              </motion.div>

              {/* Главный заголовок с анимацией букв */}
              <h1 className="hero-title" ref={titleRef}>
                {"ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ".split('').map((char, i) => (
                  <span key={i} className="char" style={{ animationDelay: `${i * 0.07}s` }}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
                <br />
                <span className="title-line-2">
                  {"ДЛЯ ВАШЕГО БИЗНЕСА".split('').map((char, i) => (
                    <span key={i + 20} className="char" style={{ animationDelay: `${(i + 20) * 0.07}s` }}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
              </h1>

              {/* Подзаголовок */}
              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                Центр цифровых компетенций будущего
              </motion.p>

              {/* Описание */}
              <motion.div 
                className="hero-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <p>Увеличьте прибыль на 40% с помощью AI-решений</p>
                <p>Автоматизация • Аналитика • Персонализация</p>
              </motion.div>

              {/* CTA кнопки */}
              <motion.div 
                className="hero-actions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.1 }}
              >
                <Link href="/platform" className="btn-primary">
                  <span className="btn-text">Войти в платформу</span>
                  <span className="btn-glow"></span>
                </Link>
                
                <Link href="/ai-manager" className="btn-secondary">
                  <span className="btn-text">AI управляющий</span>
                </Link>
              </motion.div>

              {/* Метрики */}
              <motion.div 
                className="hero-metrics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.4 }}
              >
                <div className="metric-card">
                  <div className="metric-value">500+</div>
                  <div className="metric-label">Готовых решений</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">40%</div>
                  <div className="metric-label">Рост прибыли</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">24/7</div>
                  <div className="metric-label">AI поддержка</div>
                </div>
              </motion.div>

              {/* Скролл индикатор */}
              <motion.div 
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3 }}
              >
                <div className="scroll-text">Листайте вниз</div>
                <div className="scroll-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: #0a0a0f;
        }

        /* Фоновые градиенты */
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .gradient-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.6;
        }

        .gradient-1 {
          background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%);
        }

        .gradient-2 {
          background: radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%);
        }

        .gradient-3 {
          background: radial-gradient(circle at 50% 100%, rgba(236, 72, 153, 0.2) 0%, transparent 50%);
        }

        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E");
        }

        /* Контейнер */
        .hero-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-content {
          text-align: center;
          width: 100%;
        }

        /* Логотип */
        .hero-logo {
          font-family: var(--font-orbitron);
          font-size: 1.5rem;
          font-weight: 900;
          margin-bottom: 3rem;
          letter-spacing: -0.02em;
        }

        .logo-neuro {
          color: #fff;
          text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
        }

        .logo-expert {
          background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-left: 0.25rem;
        }

        /* Заголовок с анимацией букв */
        .hero-title {
          font-family: var(--font-orbitron);
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 1.5rem;
          letter-spacing: -0.02em;
        }

        .char {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .char.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .title-line-2 {
          background: linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Подзаголовок */
        .hero-subtitle {
          font-family: var(--font-space-grotesk);
          font-size: clamp(1rem, 2vw, 1.5rem);
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 2rem;
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        /* Описание */
        .hero-description {
          max-width: 600px;
          margin: 0 auto 3rem;
        }

        .hero-description p {
          font-family: var(--font-exo2);
          font-size: clamp(0.9rem, 1.5vw, 1.1rem);
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin: 0.5rem 0;
        }

        /* Кнопки */
        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 4rem;
        }

        .btn-primary,
        .btn-secondary {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2.5rem;
          font-family: var(--font-space-grotesk);
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
          color: #fff;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(99, 102, 241, 0.5);
        }

        .btn-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.6s ease;
        }

        .btn-primary:hover .btn-glow {
          transform: translate(-50%, -50%) scale(2);
        }

        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        /* Метрики */
        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          max-width: 500px;
          margin: 0 auto 3rem;
        }

        .metric-card {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
        }

        .metric-value {
          font-family: var(--font-orbitron);
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-family: var(--font-space-grotesk);
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Скролл индикатор */
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .scroll-text {
          font-family: var(--font-space-grotesk);
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .scroll-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .scroll-icon span {
          display: block;
          width: 20px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          animation: scroll-arrow 2s ease-in-out infinite;
        }

        .scroll-icon span:nth-child(2) {
          animation-delay: -0.2s;
        }

        .scroll-icon span:nth-child(3) {
          animation-delay: -0.4s;
        }

        @keyframes scroll-arrow {
          0%, 100% {
            opacity: 0;
            transform: translateY(-10px);
          }
          50% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .hero-container {
            padding: 1rem;
          }

          .hero-logo {
            font-size: 1.25rem;
            margin-bottom: 2rem;
          }

          .hero-title {
            font-size: clamp(1.5rem, 8vw, 2.5rem);
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          .hero-description p {
            font-size: 0.875rem;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
            gap: 1rem;
            margin-bottom: 3rem;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }

          .hero-metrics {
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .metric-card {
            padding: 1rem;
          }

          .metric-value {
            font-size: 1.5rem;
          }

          .metric-label {
            font-size: 0.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .char {
            transition: none;
          }
          
          .scroll-icon span {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}