'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function MobileMenu({ isOpen: controlledIsOpen, onClose }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(controlledIsOpen || false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Блокировка скролла при открытом меню
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (onClose && isOpen) {
      onClose();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Главная', icon: '🏠', href: '#home' },
    { id: 'calculator', label: 'Калькулятор цен', icon: '💰', href: '#pricing-calculator' },
    { id: 'roi', label: 'Расчет ROI', icon: '📈', href: '#roi-calculator' },
    { id: 'solutions', label: 'Решения', icon: '💡', href: '#solutions' },
    { id: 'about', label: 'О нас', icon: '👥', href: '#about' },
    { id: 'contact', label: 'Контакты', icon: '📞', href: '#contact' }
  ];

  const handleMenuClick = (href: string) => {
    setIsOpen(false);
    
    // Плавная прокрутка к секции
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <>
      {/* Мобильный хедер */}
      <motion.header 
        className={`${styles.mobileHeader} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🧠</span>
            <span className={styles.logoText}>NeuroExpert</span>
          </div>
          
          {/* Кнопка меню */}
          <motion.button 
            className={`${styles.menuButton} ${isOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="Меню"
          >
            <span className={styles.menuIcon}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </motion.button>
        </div>
      </motion.header>

      {/* Оверлей */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Меню */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            className={styles.mobileMenu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={styles.menuHeader}>
              <h2 className={styles.menuTitle}>Меню</h2>
              <motion.button 
                className={styles.closeButton}
                onClick={toggleMenu}
                whileTap={{ scale: 0.9 }}
                aria-label="Закрыть меню"
              >
                ✕
              </motion.button>
            </div>

            <ul className={styles.menuList}>
              {menuItems.map((item, index) => (
                <motion.li 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a 
                    href={item.href}
                    className={styles.menuItem}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuClick(item.href);
                    }}
                  >
                    <span className={styles.menuItemIcon}>{item.icon}</span>
                    <span className={styles.menuItemText}>{item.label}</span>
                    <span className={styles.menuItemArrow}>→</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Быстрые действия */}
            <div className={styles.quickActions}>
              <motion.button 
                className={styles.ctaButton}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  import('@/app/utils/aiChat').then(({ openAIChat }) => {
                    openAIChat('Здравствуйте! Я хочу узнать больше о ваших услугах.');
                    setIsOpen(false);
                  });
                }}
              >
                💬 Начать чат с AI
              </motion.button>
              
              <div className={styles.contactInfo}>
                <a href="tel:+78005553535" className={styles.phoneLink}>
                  📞 +7 (800) 555-35-35
                </a>
                <p className={styles.workHours}>
                  Пн-Пт: 9:00 - 18:00 МСК
                </p>
              </div>
            </div>

            {/* Социальные сети */}
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Telegram">💬</a>
              <a href="#" aria-label="WhatsApp">📱</a>
              <a href="#" aria-label="VK">📘</a>
              <a href="#" aria-label="Email">📧</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}