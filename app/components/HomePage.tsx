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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Обработчик движения мыши для интерактивных эффектов
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, onNavigate]);

  const handleMainButtonClick = () => {
    // Переход на страницу AI управляющего (индекс 3)
    onNavigate?.(3);
  };

  return (
    <div className={styles.homePage} ref={containerRef}>
      {/* Анимированный космический фон с нейронными волнами */}
      <div className={styles.cosmicBackground}>
        {/* Базовый градиент */}
        <div className={styles.baseGradient} />
        
        {/* Нейронные волны */}
        <div className={styles.neuralWaves}>
          <svg className={styles.wavesSvg} viewBox="0 0 1920 1080" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#9945FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FF006E" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="waveGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9945FF" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#9945FF" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Анимированные волны */}
            <motion.path
              d="M0,540 Q480,440 960,540 T1920,540 L1920,1080 L0,1080 Z"
              fill="url(#waveGradient1)"
              filter="url(#glow)"
              animate={{
                d: [
                  "M0,540 Q480,440 960,540 T1920,540 L1920,1080 L0,1080 Z",
                  "M0,540 Q480,640 960,540 T1920,540 L1920,1080 L0,1080 Z",
                  "M0,540 Q480,440 960,540 T1920,540 L1920,1080 L0,1080 Z"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.path
              d="M0,600 Q480,700 960,600 T1920,600 L1920,1080 L0,1080 Z"
              fill="url(#waveGradient2)"
              filter="url(#glow)"
              animate={{
                d: [
                  "M0,600 Q480,700 960,600 T1920,600 L1920,1080 L0,1080 Z",
                  "M0,600 Q480,500 960,600 T1920,600 L1920,1080 L0,1080 Z",
                  "M0,600 Q480,700 960,600 T1920,600 L1920,1080 L0,1080 Z"
                ]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </div>

        {/* Интерактивные частицы */}
        <div 
          className={styles.particlesContainer}
          style={{
            '--mouse-x': mousePosition.x,
            '--mouse-y': mousePosition.y
          } as React.CSSProperties}
        >
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                '--delay': `${Math.random() * 5}s`,
                '--duration': `${15 + Math.random() * 20}s`,
                '--x': Math.random(),
                '--y': Math.random()
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Основной контент */}
      <AnimatePresence>
        {isLoaded && (
          <main className={styles.mainContent}>
            {/* Неоновый логотип НЕЙРОЭКСПЕРТ */}
            <motion.div
              className={styles.logoContainer}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className={styles.neonLogo} aria-label="НЕЙРОЭКСПЕРТ">
                <span className={styles.logoNeuro}>НЕЙРО</span>
                <span className={styles.logoExpert}>ЭКСПЕРТ</span>
              </h1>
              <div className={styles.logoGlow} />
              <div className={styles.logoPulse} />
            </motion.div>

            {/* Заголовок миссии */}
            <motion.h2
              className={styles.missionTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Цифровизация бизнеса с помощью ИИ
            </motion.h2>

            {/* Главная кнопка действия */}
            <motion.button
              className={styles.mainCta}
              onClick={handleMainButtonClick}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Перейти к ИИ управляющему"
            >
              <span className={styles.ctaText}>ИИ управляющий</span>
              <div className={styles.ctaGradient} />
              <div className={styles.ctaPulse} />
              <div className={styles.ctaGlow} />
            </motion.button>
          </main>
        )}
      </AnimatePresence>

      {/* Индикаторы загрузки и статуса */}
      <div className={styles.statusBar}>
        <div className={styles.loadingIndicator} />
        <div className={styles.connectionStatus} aria-label="Статус подключения" />
      </div>
    </div>
  );
}