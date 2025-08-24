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

  return (
    <div className={styles.homePage} ref={containerRef}>
      {/* Премиум фон - глубина океана */}
      <div className={styles.oceanBackground}>
        <div className={styles.oceanDepth1} />
        <div className={styles.oceanDepth2} />
        <div className={styles.oceanDepth3} />
        <div className={styles.oceanDepth4} />
        <div className={styles.polarNight} />
      </div>

      {/* Основной контент */}
      <AnimatePresence>
        {isLoaded && (
          <main className={styles.mainContent}>
            {/* Премиум логотип */}
            <motion.div
              className={styles.logoContainer}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className={styles.premiumLogo} aria-label="НЕЙРОЭКСПЕРТ">
                <span className={styles.logoMain}>НЕЙРОЭКСПЕРТ</span>
              </h1>
              <div className={styles.logoUnderline} />
            </motion.div>

            {/* Заголовок миссии - улучшенная типографика */}
            <motion.h2
              className={styles.missionTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Цифровизация бизнеса с помощью ИИ
            </motion.h2>

            {/* Дополнительный подзаголовок для премиум стиля */}
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Передовые технологии искусственного интеллекта для вашего успеха
            </motion.p>

            {/* Главная кнопка действия - премиум стиль */}
            <motion.button
              className={styles.premiumCta}
              onClick={handleMainButtonClick}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Перейти к ИИ управляющему"
            >
              <span className={styles.ctaText}>ИИ управляющий</span>
              <div className={styles.ctaShine} />
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