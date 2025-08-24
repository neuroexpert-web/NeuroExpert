'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import styles from './SwipeContainer.module.css';

// Функция для получения иконок для каждой секции
const getIconForSection = (index) => {
  const icons = [
    // Главная
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>,
    // Аналитика
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>,
    // ROI-калькулятор
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>,
    // AI управляющий
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      <circle cx="12" cy="10" r="3" />
    </svg>,
    // Решения
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>,
    // Безопасность
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>,
    // Контакты
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>,
    // О нас
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ];
  
  return icons[index] || icons[0];
};

// Импорт аналитики - пока используем заглушки, так как client.js требует переработки
// TODO: import { trackSwipe, trackSectionView, clientAnalytics } from '../analytics/client';

const trackSwipe = (direction, from, to, method) => {
  console.log(`Swipe: ${direction} from ${from} to ${to} via ${method}`);
};

const trackSectionView = (section, index, timeSpent) => {
  console.log(`Section view: ${section} (${index}) - ${timeSpent}ms`);
};

const clientAnalytics = {
  track: (event, data, options) => {
    console.log(`Analytics: ${event}`, data);
  }
};

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
  
  // Аналитика: отслеживание времени на каждой секции
  const sectionStartTime = useRef(Date.now());
  const lastSectionIndex = useRef(initialSection);

  // Пороговое значение для свайпа (в пикселях)
  const SWIPE_THRESHOLD = 50;
  const VELOCITY_THRESHOLD = 0.5;

  // Обработка свайпа с аналитикой
  const handleSwipe = useCallback((direction) => {
    const newIndex = direction === 'left' && currentIndex < children.length - 1 
      ? currentIndex + 1 
      : direction === 'right' && currentIndex > 0 
        ? currentIndex - 1 
        : currentIndex;

    if (newIndex !== currentIndex) {
      // Отслеживание времени на предыдущей секции
      const timeSpent = Date.now() - sectionStartTime.current;
      
      // Отправка аналитики о покидании секции
      trackSectionView(
        sections[currentIndex]?.name || `Section ${currentIndex}`,
        currentIndex,
        timeSpent
      );

      // Отслеживание свайпа
      trackSwipe(
        direction,
        sections[currentIndex]?.name || `Section ${currentIndex}`,
        sections[newIndex]?.name || `Section ${newIndex}`,
        'touch'
      );

      // Обновление состояния
      setCurrentIndex(newIndex);
      lastSectionIndex.current = newIndex;
      sectionStartTime.current = Date.now();

      // Отправка аналитики о входе в новую секцию
      setTimeout(() => {
        trackSectionView(
          sections[newIndex]?.name || `Section ${newIndex}`,
          newIndex
        );
      }, 100);
    }
  }, [currentIndex, children.length, sections]);

  // Обработка окончания перетаскивания с аналитикой
  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    
    // Отслеживание жестов для аналитики производительности
    clientAnalytics.track('swipe_gesture', {
      offsetX: offset.x,
      offsetY: offset.y,
      velocityX: velocity.x,
      velocityY: velocity.y,
      threshold_exceeded: Math.abs(velocity.x) > VELOCITY_THRESHOLD || Math.abs(offset.x) > SWIPE_THRESHOLD,
      current_section: currentIndex,
      gesture_duration: Date.now() - (event.timeStamp || Date.now())
    }, { priority: 'low' });
    
    // Определяем направление на основе скорости и смещения
    if (Math.abs(velocity.x) > VELOCITY_THRESHOLD || Math.abs(offset.x) > SWIPE_THRESHOLD) {
      if (offset.x > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    }
  };

  // Обработка клавиатурной навигации с аналитикой
  useEffect(() => {
    const handleKeyDown = (e) => {
      let direction = null;
      
      if (e.key === 'ArrowLeft') {
        direction = 'right'; // Логика инвертирована для UX
        handleSwipe('right');
      } else if (e.key === 'ArrowRight') {
        direction = 'left';
        handleSwipe('left');
      }

      // Отслеживание клавиатурной навигации
      if (direction) {
        clientAnalytics.track('keyboard_navigation', {
          key: e.key,
          direction,
          current_section: currentIndex,
          ctrl_key: e.ctrlKey,
          alt_key: e.altKey,
          shift_key: e.shiftKey
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe, currentIndex]);

  // Обработка touch событий для мобильных с аналитикой
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    
    // Отслеживание начала touch gesture
    clientAnalytics.track('touch_start', {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      current_section: currentIndex,
      touches_count: e.touches.length
    }, { priority: 'low' });
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const distance = Math.abs(diff);
    
    // Отслеживание завершения touch gesture
    clientAnalytics.track('touch_end', {
      start_x: touchStartX.current,
      end_x: touchEndX.current,
      distance,
      direction: diff > 0 ? 'left' : 'right',
      current_section: currentIndex,
      threshold_met: distance > SWIPE_THRESHOLD
    }, { priority: 'low' });
    
    if (distance > SWIPE_THRESHOLD) {
      if (diff > 0) {
        handleSwipe('left');
      } else {
        handleSwipe('right');
      }
    }
  };

  // Отслеживание navigation через dots
  const handleDotClick = useCallback((targetIndex) => {
    if (targetIndex !== currentIndex) {
      const timeSpent = Date.now() - sectionStartTime.current;
      
      // Отслеживание клика по точке
      clientAnalytics.track('dot_navigation', {
        from_section: currentIndex,
        to_section: targetIndex,
        section_name: sections[targetIndex]?.name || `Section ${targetIndex}`,
        time_spent_previous: timeSpent,
        skip_distance: Math.abs(targetIndex - currentIndex)
      });

      // Отслеживание времени на покидаемой секции
      trackSectionView(
        sections[currentIndex]?.name || `Section ${currentIndex}`,
        currentIndex,
        timeSpent
      );

      setCurrentIndex(targetIndex);
      lastSectionIndex.current = targetIndex;
      sectionStartTime.current = Date.now();

      // Отслеживание входа в новую секцию
      setTimeout(() => {
        trackSectionView(
          sections[targetIndex]?.name || `Section ${targetIndex}`,
          targetIndex
        );
      }, 100);
    }
  }, [currentIndex, sections]);

  // Уведомление о смене секции
  useEffect(() => {
    onSectionChange?.(currentIndex);
  }, [currentIndex, onSectionChange]);

  // Отслеживание инициализации компонента
  useEffect(() => {
    clientAnalytics.track('swipe_container_init', {
      total_sections: sections.length,
      initial_section: initialSection,
      sections_list: sections.map(s => s.name || 'Unknown'),
      container_id: 'main_swipe_container'
    });

    // Отслеживание первой секции
    trackSectionView(
      sections[initialSection]?.name || `Section ${initialSection}`,
      initialSection
    );

    return () => {
      // Отслеживание времени при размонтировании
      const timeSpent = Date.now() - sectionStartTime.current;
      trackSectionView(
        sections[lastSectionIndex.current]?.name || `Section ${lastSectionIndex.current}`,
        lastSectionIndex.current,
        timeSpent
      );

      clientAnalytics.track('swipe_container_unmount', {
        final_section: lastSectionIndex.current,
        total_session_time: Date.now() - sectionStartTime.current,
        sections_visited: lastSectionIndex.current + 1
      });
    };
  }, [sections, initialSection]);

  // Отслеживание видимости страницы
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Страница скрыта - фиксируем время
        const timeSpent = Date.now() - sectionStartTime.current;
        clientAnalytics.track('page_hidden', {
          current_section: currentIndex,
          time_spent: timeSpent,
          section_name: sections[currentIndex]?.name || `Section ${currentIndex}`
        });
      } else {
        // Страница снова видима - обновляем время начала
        sectionStartTime.current = Date.now();
        clientAnalytics.track('page_visible', {
          current_section: currentIndex,
          section_name: sections[currentIndex]?.name || `Section ${currentIndex}`
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentIndex, sections]);

  return (
    <div className={styles.swipeWrapper}>
      {/* Индикатор прогресса */}
      <ProgressIndicator 
        total={sections.length} 
        current={currentIndex}
        sections={sections}
        onDotClick={handleDotClick}
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
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: "grabbing" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={styles.pageSlider}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4
            }}
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Неоновое свайп-меню - только для первой страницы */}
      {currentIndex === 0 && (
        <nav className={styles.neonSwipeMenu} role="navigation" aria-label="Главная навигация">
          <div className={styles.menuTrack}>
            {sections.map((section, index) => (
              <motion.button
                key={index}
                className={`${styles.neonMenuItem} ${index === currentIndex ? styles.neonMenuItemActive : ''}`}
                onClick={() => handleDotClick(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Перейти на страницу ${section.name}`}
                aria-current={index === currentIndex ? 'page' : undefined}
              >
                <div className={styles.menuItemIcon}>
                  {getIconForSection(index)}
                  <div className={styles.iconGlow} />
                </div>
                <span className={styles.menuItemNumber}>{index + 1}</span>
                <span className={styles.menuItemLabel}>{section.name}</span>
                {index === currentIndex && <div className={styles.activeIndicator} />}
              </motion.button>
            ))}
          </div>
        </nav>
      )}

      {/* Обычные точки навигации для остальных страниц */}
      {currentIndex !== 0 && (
        <div className={styles.dotsContainer}>
          {sections.map((section, index) => (
            <div key={index} className={styles.dotWrapper}>
              <button
                className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to ${section.name || `section ${index + 1}`}`}
              />
              <div className={styles.dotTooltip}>
                {section.name || `Section ${index + 1}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Компонент индикатора прогресса с аналитикой
function ProgressIndicator({ total, current, sections, onDotClick }) {
  const progress = ((current + 1) / total) * 100;
  
  // Отслеживание взаимодействия с прогресс-баром
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;
    const targetSection = Math.floor((clickPercent / 100) * total);
    
    clientAnalytics.track('progress_bar_click', {
      click_percent: clickPercent,
      target_section: targetSection,
      current_section: current,
      click_x: clickX,
      bar_width: rect.width
    });

    if (targetSection !== current && targetSection >= 0 && targetSection < total) {
      onDotClick(targetSection);
    }
  };

  return (
    <div className={styles.progressContainer}>
      <div 
        className={styles.progressBar}
        onClick={handleProgressClick}
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Section ${current + 1} of ${total}`}
      >
        <div 
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={styles.sectionLabel}>
        {sections[current]?.name || `Section ${current + 1}`} ({current + 1}/{total})
      </div>
    </div>
  );
}