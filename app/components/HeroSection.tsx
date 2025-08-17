'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверка мобильного устройства
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Отслеживание мыши только на десктопе
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <section className={styles.heroSection}>
      {/* Новый фоновый дизайн */}
      <div className={styles.backgroundWrapper}>
        {/* Градиентный фон с анимацией */}
        <div 
          className={styles.gradientBackground}
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(124, 58, 237, 0.15) 0%, 
                transparent 50%
              ),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)
            `
          }}
        />

        {/* Сетка для технологичного вида */}
        <div className={styles.gridPattern} />
        
        {/* Плавающие элементы */}
        <div className={styles.floatingElements}>
          <motion.div 
            className={styles.floatingOrb}
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className={styles.floatingOrb2}
            animate={{ 
              y: [0, 20, 0],
              x: [0, -10, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Шум для глубины */}
        <div className={styles.noiseOverlay} />
      </div>

      {/* Контент */}
      <div className={styles.heroContent}>
        <div className={styles.container}>
          {/* Бейдж */}
          <motion.div 
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.badgeIcon}>⚡</span>
            <span className={styles.badgeText}>Платформа на базе ИИ</span>
          </motion.div>

          {/* Заголовок */}
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className={styles.titleMain}>NeuroExpert</span>
            <span className={styles.titleGradient}>Цифровизация бизнеса</span>
            <span className={styles.titleSub}>с искусственным интеллектом</span>
          </motion.h1>

          {/* Описание */}
          <motion.p 
            className={styles.description}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Автоматизируйте бизнес-процессы, увеличьте прибыль и опередите конкурентов 
            с помощью передовых AI-технологий
          </motion.p>

          {/* CTA кнопки */}
          <motion.div 
            className={styles.ctaButtons}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/services" className={styles.primaryButton}>
              <span>Начать бесплатно</span>
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            
            <Link href="/assistant" className={styles.secondaryButton}>
              <span>Посмотреть демо</span>
              <svg className={styles.playIcon} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
              </svg>
            </Link>
          </motion.div>

          {/* Статистика */}
          <motion.div 
            className={styles.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className={styles.statItem}>
              <span className={styles.statNumber}>🚀</span>
              <span className={styles.statLabel}>Быстрый старт роста</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>320%</span>
              <span className={styles.statLabel}>Прогнозируемый ROI</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>AI консультант</span>
            </div>
          </motion.div>
        </div>

        {/* Скролл индикатор */}
        <motion.div 
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}