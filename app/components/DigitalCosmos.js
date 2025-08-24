'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DigitalCosmos() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;

    // Настройка canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Частицы
    const particles = [];
    const particleCount = 150;
    
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -10;
        this.size = Math.random() * 3 + 0.5;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.hue = 200 + Math.random() * 60; // От синего к фиолетовому
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Плавное появление и исчезновение
        if (this.y < 100) {
          this.opacity = (this.y / 100) * (Math.random() * 0.5 + 0.5);
        } else if (this.y > height - 100) {
          this.opacity = ((height - this.y) / 100) * (Math.random() * 0.5 + 0.5);
        }

        if (this.y > height + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        
        // Свечение
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 4
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          this.x - this.size * 4,
          this.y - this.size * 4,
          this.size * 8,
          this.size * 8
        );
        
        // Ядро частицы
        ctx.fillStyle = `hsla(${this.hue}, 100%, 90%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Создание частиц
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Градиентные волны
    let waveOffset = 0;
    
    function drawWaves() {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      for (let i = 0; i < 3; i++) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        const offset = waveOffset + i * 0.3;
        
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(
          0.3 + Math.sin(offset) * 0.1, 
          `hsla(${280 + i * 20}, 70%, 50%, 0.1)`
        );
        gradient.addColorStop(
          0.7 + Math.sin(offset + 1) * 0.1, 
          `hsla(${200 + i * 20}, 70%, 50%, 0.1)`
        );
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      
      ctx.restore();
      waveOffset += 0.005;
    }

    // Анимация
    function animate() {
      // Очистка с эффектом следа
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      // Рисуем волны
      drawWaves();
      
      // Обновляем и рисуем частицы
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Обработка изменения размера
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="hero-section-cosmos" ref={containerRef}>
      {/* Canvas фон */}
      <canvas
        ref={canvasRef}
        className="cosmos-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Градиентный оверлей */}
      <div 
        className="gradient-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
          `,
          zIndex: 2,
        }}
      />

      {/* Контент */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="hero-text-container"
            >
              {/* Заголовок с градиентом */}
              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <span className="text-gradient-neuro">Neuro</span>
                <span className="text-neon">Expert</span>
              </motion.h1>

              {/* Подзаголовок */}
              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Центр цифровых компетенций будущего
              </motion.p>

              {/* Описание */}
              <motion.p 
                className="hero-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                Трансформируем бизнес с помощью искусственного интеллекта.
                <br />
                Автоматизация. Аналитика. Результат.
              </motion.p>

              {/* CTA кнопки */}
              <motion.div 
                className="hero-cta-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <button className="btn-neuro btn-primary">
                  <span>Начать трансформацию</span>
                  <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button className="btn-neuro btn-secondary">
                  <span>Демо AI платформы</span>
                  <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 6L13 10L8 14V6Z" fill="currentColor"/>
                  </svg>
                </button>
              </motion.div>

              {/* Индикаторы метрик */}
              <motion.div 
                className="hero-metrics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <div className="metric-item">
                  <span className="metric-value">40%</span>
                  <span className="metric-label">Рост эффективности</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">24/7</span>
                  <span className="metric-label">AI поддержка</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">500+</span>
                  <span className="metric-label">Готовых решений</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Декоративные элементы */}
      <div className="hero-decorations">
        {/* Угловые акценты */}
        <div className="corner-accent top-left" />
        <div className="corner-accent top-right" />
        <div className="corner-accent bottom-left" />
        <div className="corner-accent bottom-right" />
      </div>

      <style jsx>{`
        .hero-section-cosmos {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--noir-900);
        }

        .hero-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 90%;
          max-width: 1200px;
        }

        .hero-title {
          font-family: var(--font-orbitron);
          font-size: clamp(3rem, 10vw, 7rem);
          font-weight: 900;
          margin: 0 0 1rem;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .hero-subtitle {
          font-family: var(--font-space-grotesk);
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          margin: 0 0 1.5rem;
          color: var(--neon-cyan);
          text-shadow: var(--glow-cyan);
          font-weight: 300;
          letter-spacing: 0.02em;
        }

        .hero-description {
          font-family: var(--font-tech);
          font-size: clamp(1rem, 2vw, 1.25rem);
          margin: 0 0 3rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        .hero-cta-container {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin: 3rem 0;
          flex-wrap: wrap;
        }

        .btn-neuro {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2.5rem;
          font-size: 1.1rem;
        }

        .btn-icon {
          transition: transform 0.3s ease;
        }

        .btn-neuro:hover .btn-icon {
          transform: translateX(4px);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          border-color: var(--accent-primary);
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid var(--neon-cyan);
          color: var(--neon-cyan);
        }

        .btn-secondary:hover {
          background: rgba(0, 255, 255, 0.1);
          box-shadow: var(--glow-cyan), inset 0 0 20px rgba(0, 255, 255, 0.2);
        }

        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          max-width: 600px;
          margin: 4rem auto 0;
        }

        .metric-item {
          text-align: center;
          padding: 1.5rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .metric-item:hover {
          transform: translateY(-4px);
          border-color: var(--neon-cyan);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
        }

        .metric-value {
          display: block;
          font-family: var(--font-orbitron);
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: var(--gradient-neuro);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .metric-label {
          font-family: var(--font-tech);
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .corner-accent {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 2px solid;
          opacity: 0.3;
        }

        .corner-accent::before,
        .corner-accent::after {
          content: '';
          position: absolute;
          background: var(--gradient-neuro);
          opacity: 0.5;
        }

        .top-left {
          top: 2rem;
          left: 2rem;
          border-color: var(--neon-cyan);
          border-right: none;
          border-bottom: none;
        }

        .top-left::before {
          top: -2px;
          left: -2px;
          width: 30px;
          height: 2px;
        }

        .top-left::after {
          top: -2px;
          left: -2px;
          width: 2px;
          height: 30px;
        }

        .top-right {
          top: 2rem;
          right: 2rem;
          border-color: var(--accent-primary);
          border-left: none;
          border-bottom: none;
        }

        .bottom-left {
          bottom: 2rem;
          left: 2rem;
          border-color: var(--accent-secondary);
          border-right: none;
          border-top: none;
        }

        .bottom-right {
          bottom: 2rem;
          right: 2rem;
          border-color: var(--neon-pink);
          border-left: none;
          border-top: none;
        }

        @media (max-width: 768px) {
          .hero-cta-container {
            flex-direction: column;
            align-items: center;
          }

          .btn-neuro {
            width: 100%;
            max-width: 300px;
          }

          .corner-accent {
            width: 60px;
            height: 60px;
          }

          .corner-accent.top-left,
          .corner-accent.top-right {
            top: 1rem;
          }

          .corner-accent.bottom-left,
          .corner-accent.bottom-right {
            bottom: 1rem;
          }

          .corner-accent.top-left,
          .corner-accent.bottom-left {
            left: 1rem;
          }

          .corner-accent.top-right,
          .corner-accent.bottom-right {
            right: 1rem;
          }
        }
      `}</style>
    </section>
  );
}