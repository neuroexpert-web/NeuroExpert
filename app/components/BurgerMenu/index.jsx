'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../../hooks/useAnalytics';
import styles from './BurgerMenu.module.css';

export default function BurgerMenu({ sections = [], currentSection = 0, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const { trackEvent } = useAnalytics();

  // Закрытие меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    trackEvent('burger_menu_toggle', {
      action: !isOpen ? 'open' : 'close'
    });
  };

  const handleNavigate = (index) => {
    onNavigate(index);
    setIsOpen(false);
    trackEvent('burger_menu_navigate', {
      section: sections[index],
      index
    });
  };

  return (
    <>
      {/* Кнопка бургер меню */}
      <button
        className={`${styles.burgerButton} ${isOpen ? styles.active : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isOpen}
      >
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </button>

      {/* Оверлей */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Меню */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className={styles.menu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="navigation"
            aria-label="Главное меню"
          >
            <div className={styles.menuHeader}>
              <h2 className={styles.menuTitle}>Навигация</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть меню"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <ul className={styles.menuList}>
              {sections.map((section, index) => (
                <motion.li
                  key={section}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    className={`${styles.menuItem} ${currentSection === index ? styles.active : ''}`}
                    onClick={() => handleNavigate(index)}
                  >
                    <span className={styles.menuItemNumber}>0{index + 1}</span>
                    <span className={styles.menuItemText}>{section}</span>
                    {currentSection === index && (
                      <motion.span
                        className={styles.activeIndicator}
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>

            <div className={styles.menuFooter}>
              <p className={styles.footerText}>
                © 2025 NeuroExpert. Все права защищены.
              </p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}