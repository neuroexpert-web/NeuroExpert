'use client';

import { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SwipeContainer from './components/SwipeContainer';
import { useVault } from './hooks/useVault';
import { useAnalytics } from './hooks/useAnalytics';

// Динамические импорты для оптимизации
const NeuroExpertHero = lazy(() => import('./components/NeuroExpertHero'));
const Analytics = lazy(() => import('./components/Analytics')); 
const AdvancedROICalculator = dynamic(() => import('./components/AdvancedROICalculator'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка продвинутого калькулятора ROI...</div>
});
const AIDirectorCapabilities = dynamic(() => import('./components/AIDirectorCapabilities'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка AI директора...</div>
});
const BusinessShowcase = lazy(() => import('./components/BusinessShowcase'));
const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  ssr: false,
  loading: () => <div>Загрузка панели безопасности...</div>
});
const ContactForm = dynamic(() => import('./components/ContactForm'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка формы...</div>
});

// Lazy компоненты для новых разделов
const SolutionsSection = lazy(() => import('./components/SolutionsSection'));
const AboutSection = lazy(() => import('./components/AboutSection'));

// Импорт AI чата
const SmartFloatingAI = dynamic(() => import('./components/SmartFloatingAI'), {
  ssr: false,
  loading: () => <div className="ai-loading">AI управляющий загружается...</div>
});

// Курсор Claude Opus 4
const CursorIntegration = dynamic(() => import('./components/CursorIntegration'), {
  ssr: false,
  loading: () => null
});

// Дашборд аналитики
const AnalyticsDashboard = dynamic(() => import('./components/AnalyticsDashboard'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка дашборда...</div>
});

// Бургер меню
const BurgerMenu = dynamic(() => import('./components/BurgerMenu'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const { saveContext, loadContext } = useVault();
  const { trackEvent, trackPageView } = useAnalytics();
  
  // Определение разделов для навигации
  const sections = [
    'Главная',
    'Аналитика', 
    'ROI-калькулятор',
    'AI управляющий',
    'Решения',
    'Безопасность',
    'Контакты',
    'О нас'
  ];

  // Загрузка контекста при монтировании
  useEffect(() => {
    const savedContext = loadContext();
    if (savedContext?.currentSection) {
      setCurrentSection(savedContext.currentSection);
    }
    
    // Отслеживание просмотра страницы
    trackPageView('home');
    
    // Prefetch критических ресурсов
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/api/pricing/calculate';
    document.head.appendChild(link);
  }, []);

  // Сохранение контекста при изменении секции
  const handleSectionChange = useCallback((index) => {
    setCurrentSection(index);
    
    // Сохранение в JSON Vault
    saveContext({
      currentSection: index,
      timestamp: Date.now(),
      sectionName: sections[index]
    });
    
    // Отправка события в аналитику
    trackEvent('section_view', {
      section_name: sections[index],
      section_index: index,
      navigation_type: 'swipe'
    });
  }, [sections, saveContext, trackEvent]);

  // Компоненты для каждого раздела
  const sectionComponents = [
    // Главная
    <Suspense fallback={<div className="loading-section">Загрузка...</div>}>
      <NeuroExpertHero />
    </Suspense>,
    
    // Аналитика - НОВЫЙ УЛУЧШЕННЫЙ КОМПОНЕНТ
    <Suspense fallback={<div className="loading-section">Загрузка аналитики...</div>}>
      <section className="analytics-section" id="analytics">
        <div className="container">
          <h2 className="heading-luxury">
            Аналитика <span className="heading-gold">в реальном времени</span>
          </h2>
          <p className="section-subtitle">
            Полная картина вашего бизнеса с AI-рекомендациями
          </p>
          <AnalyticsDashboard />
        </div>
      </section>
    </Suspense>,
    
    // ROI-калькулятор с расширенным функционалом
    <section className="roi-section" id="roi-calculator">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-luxury">
            Рассчитайте вашу <span className="heading-gold">выгоду</span>
          </h2>
          <p className="section-subtitle">
            Monte Carlo симуляция, break-even анализ, автоматическое ценообразование
          </p>
        </div>
        <div className="roi-wrapper">
          <Suspense fallback={<div>Загрузка калькулятора...</div>}>
            <AdvancedROICalculator />
          </Suspense>
        </div>
      </div>
    </section>,
    
    // AI управляющий
    <Suspense fallback={<div className="loading-skeleton">Загрузка AI директора...</div>}>
      <AIDirectorCapabilities />
    </Suspense>,
    
    // Решения
    <Suspense fallback={<div className="loading-section">Загрузка решений...</div>}>
      <SolutionsSection />
    </Suspense>,
    
    // Безопасность
    <section className="security-section" id="security">
      <div className="container">
        <h2 className="heading-luxury">
          Безопасность и <span className="heading-gold">защита данных</span>
        </h2>
        <p className="section-subtitle">
          Zero Trust архитектура, GDPR compliance, ISO 27001
        </p>
        <Suspense fallback={<div>Загрузка...</div>}>
          <AdminPanel />
        </Suspense>
      </div>
    </section>,
    
    // Контакты
    <section className="contact-section" id="contacts">
      <div className="container">
        <div className="contact-content">
          <h2 className="heading-luxury">
            Свяжитесь с <span className="heading-gold">нами</span>
          </h2>
          <p className="contact-subtitle">
            Готовы начать цифровую трансформацию? Мы здесь, чтобы помочь
          </p>
          <Suspense fallback={<div>Загрузка формы...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>,
    
    // О нас
    <Suspense fallback={<div className="loading-section">Загрузка...</div>}>
      <AboutSection />
    </Suspense>
  ];

  return (
    <main className="premium-main" style={{ background: 'var(--noir-900, #0A051A)', minHeight: '100vh' }}>
      {/* Горизонтальный свайп контейнер с улучшенной производительностью */}
      <SwipeContainer 
        sections={sections}
        onSectionChange={handleSectionChange}
        initialSection={currentSection}
      >
        {sectionComponents}
      </SwipeContainer>

      {/* Бургер меню для навигации */}
      <Suspense fallback={null}>
        <BurgerMenu 
          sections={sections}
          currentSection={currentSection}
          onNavigate={(index) => {
            // Программная навигация к секции
            const event = new KeyboardEvent('keydown', { 
              key: index > currentSection ? 'ArrowRight' : 'ArrowLeft' 
            });
            for (let i = 0; i < Math.abs(index - currentSection); i++) {
              window.dispatchEvent(event);
            }
          }}
        />
      </Suspense>

      {/* AI Ассистент - всегда доступен */}
      <Suspense fallback={null}>
        <SmartFloatingAI />
      </Suspense>
      
      {/* Интеграция курсора Claude Opus 4 */}
      <Suspense fallback={null}>
        <CursorIntegration />
      </Suspense>

      <style jsx>{`
        .premium-main {
          position: relative;
          min-height: 100vh;
          background: var(--noir-900);
          overflow: hidden;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: clamp(36px, 5vw, 56px);
          margin-bottom: 16px;
        }

        .heading-luxury {
          font-family: var(--font-heading);
          font-weight: 700;
          background: linear-gradient(135deg, var(--platinum-100) 0%, var(--platinum-300) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .heading-gold {
          background: linear-gradient(135deg, var(--gold-premium) 0%, var(--gold-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          font-family: var(--font-body);
          font-size: 20px;
          color: var(--platinum-400);
          line-height: 1.6;
        }

        /* Секции */
        .analytics-section,
        .roi-section,
        .security-section,
        .contact-section {
          padding: 80px 0;
          min-height: calc(100vh - 160px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .roi-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-section {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          font-size: 18px;
          color: var(--platinum-400);
        }

        .loading-skeleton {
          background: var(--glass-white);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          color: var(--platinum-400);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .analytics-section,
          .roi-section,
          .security-section,
          .contact-section {
            padding: 60px 0;
          }

          .section-header {
            margin-bottom: 40px;
          }

          .container {
            padding: 0 16px;
          }
        }

        /* Оптимизация производительности */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}