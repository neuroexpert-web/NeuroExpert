'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import NeonButton from './NeonButton';
import AILoader from './AILoader';
import styles from './FuturisticHero.module.css';

export default function FuturisticHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Размеры canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Частицы для фона
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
    }> = [];

    // Создаем частицы
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 60 + 180 // Голубой-фиолетовый спектр
      });
    }

    // Анимационный цикл
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 5, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем частицы
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Границы
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Рисуем частицу
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 50%, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${particle.hue}, 100%, 50%)`;
        ctx.fill();

        // Соединяем близкие частицы
        particles.forEach((otherParticle, j) => {
          if (i === j) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(${(particle.hue + otherParticle.hue) / 2}, 100%, 50%, ${1 - distance / 150})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <AILoader variant="neural" size="large" text="Инициализация NeuroExpert..." />
      </div>
    );
  }

  return (
    <section className={styles.heroSection}>
      <canvas ref={canvasRef} className={styles.backgroundCanvas} />
      
      <div className={styles.energyField} />
      
      <motion.div
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.badge} variants={itemVariants}>
          <span className={styles.badgeText}>AI-POWERED PLATFORM</span>
        </motion.div>

        <motion.h1 
          className={styles.heroTitle}
          variants={itemVariants}
        >
          <span className={styles.titleLine}>
            <span className={styles.neonText}>Neuro</span>
            <span className={styles.gradientText}>Expert</span>
          </span>
          <span className={styles.subtitle}>
            Цифровая трансформация с ROI 300%+
          </span>
        </motion.h1>

        <motion.p 
          className={styles.heroDescription}
          variants={itemVariants}
        >
          Платформа нового поколения для автоматизации бизнеса 
          с искусственным интеллектом. Увеличьте продажи на 40% 
          за 3 месяца с помощью AI-директора.
        </motion.p>

        <motion.div 
          className={styles.heroButtons}
          variants={itemVariants}
        >
          <NeonButton 
            variant="primary" 
            size="large"
            pulse
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.09 7.26L18 8.27L14 12.14L15.18 18L10 15.27L4.82 18L6 12.14L2 8.27L7.91 7.26L10 2Z" fill="currentColor"/>
              </svg>
            }
          >
            Рассчитать ROI
          </NeonButton>
          
          <NeonButton 
            variant="secondary" 
            size="large"
            glitch
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
          >
            AI Управляющий
          </NeonButton>
        </motion.div>

        <motion.div 
          className={styles.heroStats}
          variants={itemVariants}
        >
          <div className={styles.statItem}>
            <span className={styles.statNumber}>95%</span>
            <span className={styles.statLabel}>Точность AI</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>24/7</span>
            <span className={styles.statLabel}>Поддержка</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>300%+</span>
            <span className={styles.statLabel}>ROI</span>
          </div>
        </motion.div>
      </motion.div>

      <div className={styles.scrollIndicator}>
        <motion.div
          className={styles.scrollArrow}
          animate={{
            y: [0, 10, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}