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
    
    // Добавляем футуристические шрифты
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Russo+One&family=Orbitron:wght@400;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
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

  return (
    <div className={styles.homePage} ref={containerRef}>
      {/* Эффект глубокого темно-синего зеркала - полярная ночь */}
      <div className={styles.polarNightBackground}>
        {/* Базовый слой - глубина */}
        <div className={styles.deepLayer} />
        
        {/* Зеркальные отражения */}
        <div className={styles.mirrorLayer1} />
        <div className={styles.mirrorLayer2} />
        
        {/* Северное сияние */}
        <div className={styles.auroraLayer}>
          <div className={styles.aurora1} />
          <div className={styles.aurora2} />
          <div className={styles.aurora3} />
        </div>
        
        {/* Ледяные кристаллы */}
        <div className={styles.crystalLayer} />
        
        {/* Глубинное свечение */}
        <div className={styles.depthGlow} />
      </div>

      {/* Основной контент */}
      <AnimatePresence>
        {isLoaded && (
          <main className={styles.mainContent}>
            {/* Футуристический логотип НЕЙРОЭКСПЕРТ */}
            <motion.div
              className={styles.logoContainer}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className={styles.futuristicLogo} aria-label="НЕЙРОЭКСПЕРТ">
                <span className={styles.logoNeuro}>НЕЙРО</span>
                <span className={styles.logoExpert}>ЭКСПЕРТ</span>
              </h1>
            </motion.div>

            {/* Основной заголовок - 30% меньше логотипа */}
            <motion.h2
              className={styles.mainHeading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Цифровизация бизнеса с помощью ИИ
            </motion.h2>

            {/* Описание */}
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Передовые технологии искусственного интеллекта для вашего успеха
            </motion.p>

            {/* Неоновая кнопка AI управляющий */}
            <motion.button
              className={styles.neonButton}
              onClick={handleMainButtonClick}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Перейти к ИИ управляющему"
            >
              <span className={styles.buttonText}>ИИ управляющий</span>
              <div className={styles.buttonGlow} />
              <div className={styles.buttonPulse} />
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