'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './HomePage.module.css';
import { NeuroIcons } from './NeuroIcons';

interface HomePageProps {
  onNavigate?: (section: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleNavigation = (section: string) => {
    onNavigate?.(section);
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.homePage} ref={containerRef}>
      {/* Header с логотипом и бургер-меню */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          {/* Логотип */}
          <motion.div 
            className={styles.logo}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className={styles.logoNeuro}>Neuro</span>
            <span className={styles.logoExpert}>Expert</span>
          </motion.div>

          {/* Бургер-меню */}
          <motion.button
            className={`${styles.burgerMenu} ${isMenuOpen ? styles.burgerActive : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            aria-label="Меню навигации"
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </motion.button>
        </div>

        {/* Выдвижное меню */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className={styles.slideMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className={styles.menuContent}>
                <button 
                  className={styles.menuClose}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Закрыть меню"
                >
                  <span>&times;</span>
                </button>
                
                <ul className={styles.menuList}>
                  <li>
                    <button onClick={() => handleNavigation('analytics')} className={styles.menuItem}>
                      <span className={styles.menuIcon}><NeuroIcons.Analytics /></span>
                      <span className={styles.menuText}>Аналитика</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('roi')} className={styles.menuItem}>
                      <span className={styles.menuIcon}><NeuroIcons.ROI /></span>
                      <span className={styles.menuText}>ROI-калькулятор</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('ai-manager')} className={styles.menuItem}>
                      <span className={styles.menuIcon}><NeuroIcons.AI /></span>
                      <span className={styles.menuText}>AI управляющий</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('solutions')} className={styles.menuItem}>
                      <span className={styles.menuIcon}><NeuroIcons.Solutions /></span>
                      <span className={styles.menuText}>Решения</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('security')} className={styles.menuItem}>
                      <span className={styles.menuIcon}><NeuroIcons.Security /></span>
                      <span className={styles.menuText}>Безопасность</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('contacts')} className={styles.menuItem}>
                      <span className={styles.menuIcon}><NeuroIcons.Contact /></span>
                      <span className={styles.menuText}>Контакты</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('about')} className={styles.menuItem}>
                      <span className={styles.menuIcon}><NeuroIcons.About /></span>
                      <span className={styles.menuText}>О нас</span>
                    </button>
                  </li>
                </ul>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
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
        <AnimatePresence>
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

              {/* CTA кнопки */}
              <motion.div 
                className={styles.ctaButtons}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link href="/platform" className={styles.btnPrimary}>
                  <span className={styles.btnText}>Войти в платформу</span>
                  <span className={styles.btnGlow}></span>
                  <span className={styles.btnPulse}></span>
                </Link>
                
                <button 
                  onClick={() => handleNavigation('ai-manager')} 
                  className={styles.btnSecondary}
                >
                  <span className={styles.btnText}>AI управляющий</span>
                  <span className={styles.btnGlow}></span>
                </button>
              </motion.div>

              {/* Метрики с улучшенным дизайном */}
              <motion.div 
                className={styles.metrics}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <motion.div 
                  className={styles.metricCard}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={styles.metricIcon}>
                    <svg viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="30" r="28" stroke="url(#grad1)" strokeWidth="2" opacity="0.3"/>
                      <circle cx="30" cy="30" r="20" stroke="url(#grad1)" strokeWidth="2"/>
                      <path d="M30 15 L35 25 L25 25 Z" fill="url(#grad1)"/>
                      <path d="M30 45 L35 35 L25 35 Z" fill="url(#grad1)"/>
                      <path d="M15 30 L25 35 L25 25 Z" fill="url(#grad1)"/>
                      <path d="M45 30 L35 35 L35 25 Z" fill="url(#grad1)"/>
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#9945ff"/>
                          <stop offset="100%" stopColor="#6366f1"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className={styles.metricValue}>500+</div>
                  <div className={styles.metricLabel}>AI-решений</div>
                  <div className={styles.metricDescription}>Готовые модули для вашего бизнеса</div>
                  <div className={styles.metricGlow}></div>
                </motion.div>
                
                <motion.div 
                  className={styles.metricCard}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={styles.metricIcon}>
                    <svg viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="30" r="28" stroke="url(#grad2)" strokeWidth="2" strokeDasharray="5 5" opacity="0.3"/>
                      <circle cx="30" cy="30" r="20" fill="none" stroke="url(#grad2)" strokeWidth="3"/>
                      <text x="30" y="35" textAnchor="middle" fill="url(#grad2)" fontSize="16" fontWeight="bold">AI</text>
                      <defs>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1"/>
                          <stop offset="100%" stopColor="#a855f7"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className={styles.metricValue}>95%</div>
                  <div className={styles.metricLabel}>Точность AI</div>
                  <div className={styles.metricDescription}>Машинное обучение нового поколения</div>
                  <div className={styles.metricGlow}></div>
                </motion.div>
                
                <motion.div 
                  className={styles.metricCard}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={styles.metricIcon}>
                    <svg viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="30" r="28" stroke="url(#grad3)" strokeWidth="2" opacity="0.3"/>
                      <circle cx="30" cy="15" r="3" fill="url(#grad3)"/>
                      <circle cx="30" cy="45" r="3" fill="url(#grad3)"/>
                      <circle cx="15" cy="30" r="3" fill="url(#grad3)"/>
                      <circle cx="45" cy="30" r="3" fill="url(#grad3)"/>
                      <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="none" stroke="url(#grad3)" strokeWidth="2"/>
                      <circle cx="30" cy="30" r="8" fill="url(#grad3)" opacity="0.5"/>
                      <defs>
                        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7"/>
                          <stop offset="100%" stopColor="#ec4899"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className={styles.metricValue}>24/7</div>
                  <div className={styles.metricLabel}>Поддержка</div>
                  <div className={styles.metricDescription}>AI ассистент всегда на связи</div>
                  <div className={styles.metricGlow}></div>
                </motion.div>
              </motion.div>

              {/* Секция преимуществ */}
              <motion.div 
                className={styles.advantages}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <h2 className={styles.advantagesTitle}>Почему выбирают NeuroExpert</h2>
                <div className={styles.advantagesList}>
                  <div className={styles.advantageItem}>
                    <div className={styles.advantageIcon}>⚡</div>
                    <h3>Быстрая интеграция</h3>
                    <p>Запуск за 24 часа без изменения инфраструктуры</p>
                  </div>
                  <div className={styles.advantageItem}>
                    <div className={styles.advantageIcon}>🛡️</div>
                    <h3>Безопасность данных</h3>
                    <p>Zero Trust архитектура и шифрование на всех уровнях</p>
                  </div>
                  <div className={styles.advantageItem}>
                    <div className={styles.advantageIcon}>📈</div>
                    <h3>ROI гарантия</h3>
                    <p>Окупаемость за 3 месяца или возврат средств</p>
                  </div>
                </div>
              </motion.div>

              {/* Индикатор свайпа */}
              <motion.div 
                className={styles.swipeIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <span className={styles.swipeText}>Свайп →</span>
                <div className={styles.swipeIcon}>
                  <span className={styles.swipeArrow}></span>
                  <span className={styles.swipeArrow}></span>
                  <span className={styles.swipeArrow}></span>
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
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

      {/* Статус индикаторы */}
      <div className={styles.statusIndicators}>
        <span className={styles.statusSuccess}></span>
        <span className={styles.statusError}></span>
      </div>
    </div>
  );
}

