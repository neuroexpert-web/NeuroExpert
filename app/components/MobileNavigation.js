'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MobileNavigation({ sections, currentSection, onSectionChange }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Автоскрытие навигации при скролле вниз
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скроллим вниз
        setIsVisible(false);
      } else {
        // Скроллим вверх
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Навигационные элементы
  const navItems = [
    { id: 0, icon: '🏠', label: 'Главная' },
    { id: 1, icon: '📊', label: 'Аналитика' },
    { id: 2, icon: '💰', label: 'ROI' },
    { id: 3, icon: '🤖', label: 'AI' },
    { id: 4, icon: '🔧', label: 'Решения' },
    { id: 5, icon: '🔒', label: 'Безопасность' },
    { id: 6, icon: '📞', label: 'Контакты' },
    { id: 7, icon: '👥', label: 'О нас' },
    { id: 8, icon: '💎', label: 'Цены' },
    { id: 9, icon: '💼', label: 'Кабинет' }
  ];

  const handleNavClick = (index) => {
    if (onSectionChange) {
      onSectionChange(index);
    }
    
    // Вибрация при нажатии (если поддерживается)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <>
      {/* Основная нижняя навигация */}
      <nav 
        className={`mobile-bottom-nav ${isVisible ? 'visible' : 'hidden'}`}
        role="navigation"
        aria-label="Мобильная навигация"
      >
        <div className="nav-scroll-container">
          <div className="nav-items">
            {navItems.slice(0, 5).map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                aria-label={item.label}
                aria-current={currentSection === item.id ? 'page' : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Плавающая кнопка меню для остальных разделов */}
      <button 
        className="mobile-menu-fab"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Дополнительное меню"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      <style jsx>{`
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(10, 10, 31, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          transition: transform 0.3s ease;
          padding-bottom: env(safe-area-inset-bottom);
        }

        .mobile-bottom-nav.hidden {
          transform: translateY(100%);
        }

        .nav-scroll-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .nav-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .nav-items {
          display: flex;
          justify-content: space-around;
          min-width: 100%;
          padding: 8px 0;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 8px 16px;
          min-width: 64px;
          cursor: pointer;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .nav-item:active {
          transform: scale(0.95);
        }

        .nav-item.active {
          color: #8b5cf6;
        }

        .nav-icon {
          font-size: 22px;
          margin-bottom: 4px;
          transition: transform 0.3s ease;
        }

        .nav-item.active .nav-icon {
          transform: scale(1.1);
        }

        .nav-label {
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }

        .mobile-menu-fab {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 999;
        }

        .mobile-menu-fab:active {
          transform: scale(0.95);
        }

        @media (min-width: 769px) {
          .mobile-bottom-nav,
          .mobile-menu-fab {
            display: none;
          }
        }

        @media (max-width: 320px) {
          .nav-item {
            padding: 8px 12px;
            min-width: 56px;
          }

          .nav-icon {
            font-size: 20px;
          }

          .nav-label {
            font-size: 10px;
          }
        }

        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .mobile-bottom-nav {
            padding-bottom: calc(8px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
}