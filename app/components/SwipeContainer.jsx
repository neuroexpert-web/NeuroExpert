'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import styles from './SwipeContainer.module.css';

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
  // Увеличиваем пороги для мобильных устройств
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const SWIPE_THRESHOLD = isMobile ? 100 : 50; // Увеличен порог для мобильных
  const VELOCITY_THRESHOLD = isMobile ? 0.5 : 0.3; // Уменьшена чувствительность

    // Защита от слишком частых свайпов
  const lastSwipeTime = useRef(0);
  const MIN_SWIPE_INTERVAL = 300; // Минимальный интервал между свайпами (мс)

  // Обработка свайпа с аналитикой
  const handleSwipe = useCallback((direction) => {
    const now = Date.now();
    if (now - lastSwipeTime.current < MIN_SWIPE_INTERVAL) {
      return; // Игнорируем слишком быстрые свайпы
    }
    lastSwipeTime.current = now;

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
            <div className={styles.pageWrapper}>
              {children[currentIndex]}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Точки навигации */}
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
    </div>
  );
}

// Компонент индикатора прогресса с аналитикой
function ProgressIndicator({ total, current, sections, onDotClick }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const progress = ((current + 1) / total) * 100;
  
  // Иконки для каждой страницы
  const sectionIcons = [
    '🏠', // Главная
    '📊', // Аналитика
    '💰', // ROI-калькулятор
    '🤖', // AI управляющий
    '💡', // Решения
    '🔒', // Безопасность
    '👥', // О нас
    '💎', // Калькулятор цен
    '📞'  // Контакты
  ];
  
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
      <button 
        className={styles.collapseButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
      >
        {isCollapsed ? '→' : '←'}
      </button>
      
      {!isCollapsed && (
        <div className={styles.navigationGrid}>
          {sections.map((section, index) => (
            <motion.button
              key={index}
              className={`${styles.navItem} ${index === current ? styles.navItemActive : ''}`}
              onClick={() => onDotClick(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.navIcon}>{sectionIcons[index] || '📄'}</span>
              <span className={styles.navLabel}>{section}</span>
            </motion.button>
          ))}
        </div>
      )}
      
      {isCollapsed && (
        <div className={styles.collapsedIndicator}>
          <span className={styles.currentIcon}>{sectionIcons[current]}</span>
          <span className={styles.currentPage}>{current + 1}/{total}</span>
        </div>
      )}
      
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