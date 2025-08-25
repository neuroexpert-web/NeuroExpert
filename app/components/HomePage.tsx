'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './HomePage.module.css';
import { NeuroIcons } from './NeuroIcons';

interface HomePageProps {
  onNavigate?: () => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Инициализация аналитики
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: 'NeuroExpert - Главная',
          page_location: window.location.href,
          page_path: '/'
        });
      }
      
      // Яндекс.Метрика
      if (window.ym && process.env.NEXT_PUBLIC_YM_ID) {
        window.ym(process.env.NEXT_PUBLIC_YM_ID, 'hit', window.location.href);
      }
    }
  }, []);



  return (
    <div className={styles.homePage} ref={containerRef}>
      {/* Header с логотипом */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoNeuro}>Neuro</span>
          <span className={styles.logoExpert}>Expert</span>
        </div>
      </header>

      {/* Основной контент */}
      <main className={styles.mainContent}>
        {/* Видео фон "цифрового космоса" с фолбеком */}
        <div className={styles.videoBackground}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={styles.bgVideo}
            poster="/images/digital-cosmos-poster.jpg"
          >
            <source src="/videos/digital-cosmos.mp4" type="video/mp4" />
            <source src="/videos/digital-cosmos.webm" type="video/webm" />
          </video>
          <div className={styles.videoOverlay}></div>
          {/* Фоллбек градиент если видео не загрузилось */}
          <div className={styles.gradientFallback}></div>
        </div>

        {/* Hero контент */}
        {isLoaded && (
            <motion.section 
              className={styles.heroSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Визуальный слоган */}
              <motion.h1 
                className={styles.heroTitle}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2, type: "spring", stiffness: 120 }}
              >
                <motion.span 
                  className={styles.titleLine1}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Умный бизнес
                </motion.span>
                <motion.span 
                  className={styles.titleLine2}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  начинается здесь
                </motion.span>
              </motion.h1>

              {/* Value Proposition с эмоциональным воздействием */}
              <motion.p 
                className={styles.heroSubtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.span 
                  className={styles.highlightProfit}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  +40% к прибыли
                </motion.span>
                {" "}за 90 дней с искусственным интеллектом нового поколения
              </motion.p>

              {/* CTA кнопка с сильным призывом */}
              <motion.div 
                className={styles.ctaButtons}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.button 
                  onClick={onNavigate} 
                  className={styles.btnPrimary}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 136, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className={styles.btnText}>Увеличить прибыль сейчас</span>
                  <span className={styles.btnGlow}></span>
                </motion.button>
              </motion.div>

              {/* Индикатор свайпа с более понятным текстом */}
              <motion.div 
                className={styles.swipeIndicator}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.8 }}
              >
                <motion.span 
                  className={styles.swipeText}
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Листайте, чтобы узнать больше →
                </motion.span>
              </motion.div>
            </motion.section>
        )}
      </main>

      {/* Индикатор позиции под меню */}
      <div className={styles.positionIndicator}>
        <div className={styles.indicatorTrack}>
          <motion.div 
            className={styles.indicatorFill}
            initial={{ width: '0%' }}
            animate={{ width: '12.5%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>


    </div>
  );
}

