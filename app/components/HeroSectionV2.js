'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSectionV2() {
  const canvasRef = useRef(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const titleRef = useRef(null);

  // Фоновая анимация частиц
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let connections = [];

    // Установка размеров canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Класс частицы
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Отскок от границ
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Создание частиц
    const createParticles = () => {
      const count = Math.min(100, window.innerWidth / 10);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };
    createParticles();

    // Анимационный цикл
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 5, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Обновление и отрисовка частиц
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Рисование соединений между близкими частицами
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Анимация заголовка "нейронный импульс"
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section-v2">
      <canvas ref={canvasRef} className="hero-canvas" />
      
      <div className="hero-content">
        {/* Pre-header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pre-header"
        >
          ПЛАТФОРМА НОВОГО ПОКОЛЕНИЯ
        </motion.div>

        {/* Основной заголовок с анимацией */}
        <h1 className="main-header" ref={titleRef}>
          {isAnimationComplete && (
            <>
              {'NeuroExpert'.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  className="letter"
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ 
                    opacity: 1, 
                    filter: 'blur(0px)',
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.25, 0.8, 0.25, 1]
                  }}
                >
                  <span className="letter-glow">{letter}</span>
                  <motion.span
                    className="letter-pulse"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: 'easeInOut'
                    }}
                  />
                </motion.span>
              ))}
            </>
          )}
        </h1>

        {/* Подзаголовки */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="sub-header"
        >
          Цифровизация бизнеса
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="sub-header-caption"
        >
          с искусственным интеллектом
        </motion.p>

        {/* Описание */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="description"
        >
          Автоматизируйте бизнес-процессы, увеличьте прибыль и опередите конкурентов с помощью передовых AI-технологий.
        </motion.p>

        {/* CTA кнопки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="cta-buttons"
        >
          <button 
            className="cta-button primary"
            onClick={() => {
              // Скролл к AI чату
              document.getElementById('ai-chat')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Начать бесплатно
          </button>
          <button 
            className="cta-button secondary"
            onClick={() => {
              // Скролл к калькулятору
              document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Калькулятор
          </button>
        </motion.div>
      </div>

      <style jsx>{`
        .hero-section-v2 {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #0A051A;
        }

        .hero-canvas {
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
          text-align: center;
          padding: 20px;
          max-width: 1200px;
          width: 100%;
        }

        .pre-header {
          font-size: 14px;
          font-weight: 500;
          color: #A0A3B5;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .main-header {
          font-size: clamp(48px, 10vw, 80px);
          font-weight: 700;
          background: linear-gradient(90deg, #A855F7, #6366F1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 30px;
          line-height: 1.1;
          position: relative;
          display: inline-block;
        }

        .letter {
          display: inline-block;
          position: relative;
          overflow: hidden;
        }

        .letter-glow {
          display: inline-block;
          position: relative;
          z-index: 2;
        }

        .letter-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(168, 85, 247, 0.8) 50%, 
            transparent 100%
          );
          z-index: 3;
          pointer-events: none;
        }

        .sub-header {
          font-size: clamp(24px, 5vw, 36px);
          font-weight: 600;
          color: #60A5FA;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .sub-header-caption {
          font-size: 16px;
          font-weight: 500;
          color: #A0A3B5;
          text-transform: uppercase;
          margin-bottom: 30px;
        }

        .description {
          font-size: clamp(16px, 3vw, 20px);
          font-weight: 400;
          color: #D1D5DB;
          max-width: 600px;
          line-height: 1.5;
          margin: 0 auto 40px;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: 18px 40px;
          border-radius: 50px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease-out;
          position: relative;
          overflow: hidden;
        }

        .cta-button.primary {
          background: linear-gradient(90deg, #6366F1, #A855F7);
          color: #FFFFFF;
          box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.3);
        }

        .cta-button.primary:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px -5px rgba(168, 85, 247, 0.4);
        }

        .cta-button.secondary {
          background: transparent;
          color: #60A5FA;
          border: 2px solid #60A5FA;
          box-shadow: 0 0 20px -5px rgba(96, 165, 250, 0.3);
        }

        .cta-button.secondary:hover {
          background: rgba(96, 165, 250, 0.1);
          transform: scale(1.05);
          box-shadow: 0 0 30px -5px rgba(96, 165, 250, 0.5);
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .hero-content {
            padding: 20px 16px;
          }

          .pre-header {
            font-size: 12px;
          }

          .main-header {
            font-size: clamp(36px, 12vw, 60px);
            margin-bottom: 20px;
          }

          .sub-header {
            font-size: clamp(20px, 6vw, 28px);
          }

          .sub-header-caption {
            font-size: 14px;
            margin-bottom: 20px;
          }

          .description {
            font-size: 16px;
            margin-bottom: 30px;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }

          .cta-button {
            width: 100%;
            padding: 16px 30px;
          }
        }

        /* Анимация мерцания для фона */
        @keyframes glow {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}