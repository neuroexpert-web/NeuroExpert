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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className={styles.titleLine1}>Искусственный интеллект</span>
                <span className={styles.titleLine2}>для цифровой трансформации</span>
              </motion.h1>

              {/* Value Proposition */}
              <motion.p 
                className={styles.heroSubtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Увеличьте прибыль на 40% с помощью AI-решений нового поколения
              </motion.p>

              {/* CTA кнопка */}
              <motion.div 
                className={styles.ctaButtons}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <button 
                  onClick={onNavigate} 
                  className={styles.btnPrimary}
                >
                  <span className={styles.btnText}>AI управляющий</span>
                  <span className={styles.btnGlow}></span>
                </button>
              </motion.div>

              {/* Индикатор свайпа - только для десктопа */}
              <motion.div 
                className={styles.swipeIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <span className={styles.swipeText}>Свайп для навигации →</span>
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

