'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { analytics } from '../utils/analytics';
import styles from './SwipeNavigation.module.css';

interface Section {
  id: string;
  title: string;
  component: ReactNode;
  icon?: string;
}

interface SwipeNavigationProps {
  sections: Section[];
  onSectionChange?: (index: number, section: Section) => void;
}

export default function SwipeNavigation({ sections, onSectionChange }: SwipeNavigationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const sectionViewStart = useRef<number>(Date.now());

  // Обработка свайпа
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (isAnimating) return;

    const swipeThreshold = 100;
    const velocityThreshold = 500;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      // Свайп вправо
      navigateToSection(currentIndex - 1, 'right');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      // Свайп влево
      navigateToSection(currentIndex + 1, 'left');
    }
  };

  // Навигация к секции
  const navigateToSection = (index: number, direction?: 'left' | 'right') => {
    if (index < 0 || index >= sections.length || isAnimating) return;

    const fromSection = sections[currentIndex];
    const toSection = sections[index];

    // Отслеживаем время просмотра предыдущей секции
    const viewDuration = Date.now() - sectionViewStart.current;
    analytics.trackSectionView(fromSection.id, viewDuration);

    // Отслеживаем свайп
    if (direction) {
      analytics.trackSwipe(direction, fromSection.id, toSection.id);
    }

    setIsAnimating(true);
    setCurrentIndex(index);
    sectionViewStart.current = Date.now();

    if (onSectionChange) {
      onSectionChange(index, toSection);
    }

    // Сброс флага анимации
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Клавиатурная навигация
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateToSection(currentIndex - 1, 'right');
        analytics.track('keyboard_nav', 'arrow_left_pressed', {
          from_section: sections[currentIndex].id
        });
      } else if (e.key === 'ArrowRight') {
        navigateToSection(currentIndex + 1, 'left');
        analytics.track('keyboard_nav', 'arrow_right_pressed', {
          from_section: sections[currentIndex].id
        });
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [currentIndex]);

  // Touch события для мобильных
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateToSection(currentIndex + 1, 'left');
      } else {
        navigateToSection(currentIndex - 1, 'right');
      }
    }
  };

  // Индикаторы
  const renderIndicators = () => (
    <div className={styles.indicators} role="tablist">
      {sections.map((section, index) => (
        <button
          key={section.id}
          className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
          onClick={() => {
            analytics.track('tap', 'indicator_clicked', {
              section_id: section.id,
              from_index: currentIndex,
              to_index: index
            });
            navigateToSection(index);
          }}
          aria-label={`Перейти к ${section.title}`}
          aria-selected={index === currentIndex}
          role="tab"
        >
          <span className={styles.indicatorDot} />
          {section.icon && <span className={styles.indicatorIcon}>{section.icon}</span>}
        </button>
      ))}
    </div>
  );

  // Прогресс бар
  const renderProgressBar = () => (
    <div className={styles.progressBar}>
      <motion.div
        className={styles.progressFill}
        animate={{
          width: `${((currentIndex + 1) / sections.length) * 100}%`
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </div>
  );

  return (
    <div className={styles.swipeContainer} ref={containerRef}>
      {/* Прогресс бар */}
      {renderProgressBar()}

      {/* Контент */}
      <motion.div
        className={styles.contentWrapper}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        animate={{ x: -currentIndex * 100 + '%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={styles.section}
            aria-hidden={index !== currentIndex}
          >
            <AnimatePresence mode="wait">
              {index === currentIndex && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {section.component}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      {/* Индикаторы */}
      {renderIndicators()}

      {/* Навигационные подсказки */}
      <div className={styles.navigationHints}>
        <AnimatePresence>
          {currentIndex > 0 && (
            <motion.button
              className={`${styles.navHint} ${styles.navHintLeft}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => navigateToSection(currentIndex - 1, 'right')}
              aria-label="Предыдущая секция"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          )}
          
          {currentIndex < sections.length - 1 && (
            <motion.button
              className={`${styles.navHint} ${styles.navHintRight}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => navigateToSection(currentIndex + 1, 'left')}
              aria-label="Следующая секция"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Мобильная подсказка */}
      <AnimatePresence>
        {currentIndex === 0 && (
          <motion.div
            className={styles.swipeHint}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 2 }}
          >
            <span>← Свайпните для навигации →</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}