'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HomePage.module.css';

interface HomePageProps {
  onNavigate?: (pageIndex: number) => void;
  currentPage?: number;
}

export default function HomePage({ onNavigate, currentPage = 0 }: HomePageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Инициализация клавиатурной навигации
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        onNavigate?.(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < 7) {
        onNavigate?.(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, onNavigate]);

  const handleMainButtonClick = () => {
    // Переход на страницу AI управляющего (индекс 3)
    onNavigate?.(3);
  };

  // Генерация звезд для млечного пути
  const generateStars = () => {
    const stars = [];
    // Мелкие звезды
    for (let i = 0; i < 300; i++) {
      stars.push({
        id: `small-${i}`,
        size: Math.random() * 1.5 + 0.5,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
        className: styles.starSmall
      });
    }
    // Средние звезды
    for (let i = 0; i < 100; i++) {
      stars.push({
        id: `medium-${i}`,
        size: Math.random() * 2 + 1.5,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.9 + 0.1,
        className: styles.starMedium
      });
    }
    // Крупные яркие звезды
    for (let i = 0; i < 20; i++) {
      stars.push({
        id: `large-${i}`,
        size: Math.random() * 3 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 1,
        className: styles.starLarge
      });
    }
    return stars;
  };

  return (
    <div className={styles.homePage} ref={containerRef}>
      {/* Премиум фон - глубина космоса с млечным путем */}
      <div className={styles.spaceBackground}>
        {/* Базовый космический фон */}
        <div className={styles.deepSpace} />
        
        {/* Млечный путь */}
        <div className={styles.milkyWay}>
          <div className={styles.milkyWayCore} />
          <div className={styles.milkyWayArm1} />
          <div className={styles.milkyWayArm2} />
          <div className={styles.milkyWayGlow} />
        </div>

        {/* Звезды */}
        <div className={styles.starsContainer}>
          {generateStars().map(star => (
            <div
              key={star.id}
              className={star.className}
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                left: `${star.x}%`,
                top: `${star.y}%`,
                opacity: star.opacity
              }}
            />
          ))}
        </div>

        {/* Туманности */}
        <div className={styles.nebula1} />
        <div className={styles.nebula2} />
        
        {/* Космическая пыль */}
        <div className={styles.cosmicDust} />
      </div>

      {/* Основной контент */}
      <AnimatePresence>
        {isLoaded && (
          <main className={styles.mainContent}>
            {/* Особенный логотип НЕЙРОЭКСПЕРТ */}
            <motion.div
              className={styles.logoContainer}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <h1 className={styles.epicLogo} aria-label="НЕЙРОЭКСПЕРТ">
                <span className={styles.logoNeuro}>НЕЙРО</span>
                <span className={styles.logoExpert}>ЭКСПЕРТ</span>
              </h1>
              <div className={styles.logoOrbit}>
                <div className={styles.orbitRing} />
                <div className={styles.orbitParticle1} />
                <div className={styles.orbitParticle2} />
                <div className={styles.orbitParticle3} />
              </div>
              <div className={styles.logoAura} />
            </motion.div>

            {/* Заголовок миссии - адаптированный под общий стиль */}
            <motion.h2
              className={styles.missionTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Цифровизация бизнеса с помощью ИИ
            </motion.h2>

            {/* Дополнительный подзаголовок */}
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Передовые технологии искусственного интеллекта для вашего успеха
            </motion.p>

            {/* Главная кнопка действия */}
            <motion.button
              className={styles.cosmicCta}
              onClick={handleMainButtonClick}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Перейти к ИИ управляющему"
            >
              <span className={styles.ctaText}>ИИ управляющий</span>
              <div className={styles.ctaStars} />
            </motion.button>
          </main>
        )}
      </AnimatePresence>

      {/* Минималистичные индикаторы */}
      <div className={styles.bottomIndicators}>
        <div className={styles.pageIndicator}>01</div>
        <div className={styles.scrollHint}>Листайте вправо →</div>
      </div>
    </div>
  );
}