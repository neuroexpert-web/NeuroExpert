'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HomePage.module.css';

interface HomePageProps {
  onNavigate?: (pageIndex: number) => void;
  currentPage?: number;
}

// Навигационные иконки (неоновые SVG)
const NavigationIcons = {
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Analytics: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Calculator: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  AI: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Solutions: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  Security: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Contacts: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  About: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const navigationItems = [
  { id: 'home', label: 'Главная', icon: NavigationIcons.Home },
  { id: 'analytics', label: 'Аналитика', icon: NavigationIcons.Analytics },
  { id: 'calculator', label: 'ROI-калькулятор', icon: NavigationIcons.Calculator },
  { id: 'ai', label: 'AI управляющий', icon: NavigationIcons.AI },
  { id: 'solutions', label: 'Решения', icon: NavigationIcons.Solutions },
  { id: 'security', label: 'Безопасность', icon: NavigationIcons.Security },
  { id: 'contacts', label: 'Контакты', icon: NavigationIcons.Contacts },
  { id: 'about', label: 'О нас', icon: NavigationIcons.About }
];

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

  const handleNavigation = (index: number) => {
    onNavigate?.(index);
  };

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

      {/* Свайп-меню навигации */}
      <nav className={styles.swipeMenu} role="navigation" aria-label="Главная навигация">
        <div className={styles.menuTrack}>
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === index;
            
            return (
              <motion.button
                key={item.id}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                onClick={() => handleNavigation(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Перейти на страницу ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={styles.menuItemIcon}>
                  <Icon />
                  <div className={styles.iconGlow} />
                </div>
                <span className={styles.menuItemNumber}>{index + 1}</span>
                <span className={styles.menuItemLabel}>{item.label}</span>
                {isActive && <div className={styles.activeIndicator} />}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Индикаторы загрузки и статуса */}
      <div className={styles.statusBar}>
        <div className={styles.loadingIndicator} />
        <div className={styles.connectionStatus} aria-label="Статус подключения" />
      </div>
    </div>
  );
}