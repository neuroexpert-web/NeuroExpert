'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import styles from './SwipeContainer.module.css';

export default function SwipeContainer({
  children,
  sections,
  onSectionChange,
  initialSection = 0
}) {
  const [currentIndex, setCurrentIndex] = useState(initialSection);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Пороговое значение для свайпа (в пикселях)
  const SWIPE_THRESHOLD = 50;
  const VELOCITY_THRESHOLD = 0.5;

  // Обработка свайпа
  const handleSwipe = useCallback((direction) => {
    if (direction === 'left' && currentIndex < children.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, children.length]);

  // Обработка окончания перетаскивания
  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    
    // Определяем направление на основе скорости и смещения
    if (Math.abs(velocity.x) > VELOCITY_THRESHOLD || Math.abs(offset.x) > SWIPE_THRESHOLD) {
      if (offset.x > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    }
  };

  // Обработка клавиатурной навигации
  useEffect(() => {
          const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handleSwipe('right');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('left');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  // Обработка touch событий для мобильных
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        handleSwipe('left');
      } else {
        handleSwipe('right');
      }
    }
  };

  // Уведомление о смене секции
  useEffect(() => {
    onSectionChange?.(currentIndex);
  }, [currentIndex, onSectionChange]);

  return (
    <div className={styles.swipeWrapper}>
      {/* Индикатор прогресса */}
      <ProgressIndicator 
        total={sections.length} 
        current={currentIndex}
        sections={sections}
      />

      {/* Контейнер для свайпа */}
      <motion.div
        ref={containerRef}
        className={styles.swipeContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <AnimatePresence mode="wait" custom={currentIndex}>
          <motion.div
            key={currentIndex}
            className={styles.pageSlider}
            custom={currentIndex}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Точки навигации */}
      <div className={styles.dotsContainer} role="navigation" aria-label="Навигация по разделам">
        {children.map((_, index) => (
          <div key={index} className={styles.dotWrapper}>
            <button
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Перейти к разделу ${sections[index]}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
            <span className={styles.dotTooltip}>{sections[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Компонент индикатора прогресса
interface ProgressIndicatorProps {
  total: number;
  current: number;
  sections: string[];
}

function ProgressIndicator({ total, current, sections }: ProgressIndicatorProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <motion.div 
          className={styles.progressFill}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <div className={styles.sectionLabel}>
        {sections[current]}
      </div>
    </div>
  );
}