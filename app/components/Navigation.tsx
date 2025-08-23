'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const menuItems = [
  { href: '/', label: 'Главная', icon: '🏠' },
  { href: '/dashboard', label: 'Дашборд', icon: '📊' },
  { href: '/roi-pro', label: 'ROI Pro', icon: '💎' },
  { href: '/showcase', label: 'Компоненты', icon: '🎨' },
  { href: '/demo/swipe', label: 'Демо Свайп', icon: '👆' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav 
        className={`${styles.navigation} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🧠</span>
            <span className={styles.logoText}>NeuroExpert</span>
          </Link>

          {/* Desktop Menu */}
          <div className={styles.desktopMenu}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.menuItem} ${pathname === item.href ? styles.active : ''}`}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className={styles.ctaWrapper}>
            <motion.button
              className={styles.ctaButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/#pricing'}
            >
              <span>Начать</span>
              <span className={styles.ctaArrow}>→</span>
            </motion.button>
          </div>

          {/* Burger Menu Button */}
          <button
            className={`${styles.burger} ${isOpen ? styles.burgerActive : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            >
              <div className={styles.mobileHeader}>
                <h3 className={styles.mobileTitle}>Меню</h3>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.mobileNav}>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`${styles.mobileMenuItem} ${pathname === item.href ? styles.active : ''}`}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span>{item.label}</span>
                      <span className={styles.arrow}>→</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className={styles.mobileFooter}>
                <motion.button
                  className={styles.mobileCta}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/#pricing'}
                >
                  Получить консультацию
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}