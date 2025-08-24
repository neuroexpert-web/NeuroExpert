'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SwipeContainer from './components/SwipeContainer';

// Динамические импорты для оптимизации
const NeuroExpertHero = dynamic(() => import('./components/NeuroExpertHero'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка главной...</div>
});

const AnalyticsDashboard = dynamic(() => import('./components/AnalyticsDashboard'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка аналитики...</div>
});

const ROICalculator = dynamic(() => import('./components/ROICalculator'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка ROI калькулятора...</div>
});

const AIDirectorCapabilities = dynamic(() => import('./components/AIDirectorCapabilities'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка AI директора...</div>
});

const SolutionsSection = dynamic(() => import('./components/SolutionsSection'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка решений...</div>
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка панели безопасности...</div>
});

const ContactForm = dynamic(() => import('./components/ContactForm'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка формы...</div>
});

const AboutSection = dynamic(() => import('./components/AboutSection'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка о нас...</div>
});

// AI чат - всегда доступен
const SmartFloatingAI = dynamic(() => import('./components/SmartFloatingAI'), {
  ssr: false,
  loading: () => <div className="ai-loading">AI управляющий загружается...</div>
});

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  
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

  // Сохранение состояния и аналитика
  const handleSectionChange = useCallback((index) => {
    setCurrentSection(index);
    
    // Сохранение в localStorage
    try {
      localStorage.setItem('neuroexpert-current-section', index.toString());
    } catch (e) {
      console.warn('LocalStorage not available');
    }
    
    // Простая аналитика
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'section_view', {
        section_name: sections[index],
        section_index: index
      });
    }
  }, [sections]);

  // Загрузка сохраненного состояния
  useEffect(() => {
    try {
      const saved = localStorage.getItem('neuroexpert-current-section');
      if (saved) {
        setCurrentSection(parseInt(saved, 10));
      }
    } catch (e) {
      console.warn('LocalStorage not available');
    }
  }, []);

  // Компоненты для каждого раздела
  const sectionComponents = [
    // 1. Главная
    <Suspense key="hero" fallback={<div className="loading-section">Загрузка главной...</div>}>
      <NeuroExpertHero />
    </Suspense>,
    
    // 2. Аналитика
    <section key="analytics" className="analytics-section" id="analytics">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-luxury">
            Аналитика <span className="heading-gold">в реальном времени</span>
          </h2>
          <p className="section-subtitle">
            Полная картина вашего бизнеса с AI-рекомендациями
          </p>
        </div>
        <Suspense fallback={<div className="loading-skeleton">Загрузка дашборда...</div>}>
          <AnalyticsDashboard />
        </Suspense>
      </div>
    </section>,
    
    // 3. ROI-калькулятор
    <section key="roi" className="roi-section" id="roi-calculator">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-luxury">
            Рассчитайте вашу <span className="heading-gold">выгоду</span>
          </h2>
          <p className="section-subtitle">
            Продвинутый ROI калькулятор с автоматическим ценообразованием
          </p>
        </div>
        <div className="roi-wrapper">
          <Suspense fallback={<div className="loading-skeleton">Загрузка калькулятора...</div>}>
            <ROICalculator />
          </Suspense>
        </div>
      </div>
    </section>,
    
    // 4. AI управляющий
    <Suspense key="ai-director" fallback={<div className="loading-skeleton">Загрузка AI директора...</div>}>
      <AIDirectorCapabilities />
    </Suspense>,
    
    // 5. Решения
    <Suspense key="solutions" fallback={<div className="loading-section">Загрузка решений...</div>}>
      <SolutionsSection />
    </Suspense>,
    
    // 6. Безопасность
    <section key="security" className="security-section" id="security">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-luxury">
            Безопасность и <span className="heading-gold">защита данных</span>
          </h2>
          <p className="section-subtitle">
            Zero Trust архитектура, GDPR compliance, ISO 27001
          </p>
        </div>
        <Suspense fallback={<div className="loading-skeleton">Загрузка панели...</div>}>
          <AdminPanel />
        </Suspense>
      </div>
    </section>,
    
    // 7. Контакты
    <section key="contacts" className="contact-section" id="contacts">
      <div className="container">
        <div className="contact-content">
          <div className="section-header">
            <h2 className="heading-luxury">
              Свяжитесь с <span className="heading-gold">нами</span>
            </h2>
            <p className="section-subtitle">
              Готовы начать цифровую трансформацию? Мы здесь, чтобы помочь
            </p>
          </div>
          <Suspense fallback={<div className="loading-skeleton">Загрузка формы...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>,
    
    // 8. О нас
    <Suspense key="about" fallback={<div className="loading-section">Загрузка...</div>}>
      <AboutSection />
    </Suspense>
  ];

  return (
    <main className="premium-main">
      {/* Горизонтальный свайп контейнер */}
      <SwipeContainer 
        sections={sections}
        onSectionChange={handleSectionChange}
        initialSection={currentSection}
      >
        {sectionComponents}
      </SwipeContainer>

      {/* AI Ассистент - всегда доступен */}
      <Suspense fallback={null}>
        <SmartFloatingAI />
      </Suspense>

      <style jsx>{`
        .premium-main {
          position: relative;
          min-height: 100vh;
          background: var(--noir-900, #0A051A);
          overflow: hidden;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 2rem;
        }

        .heading-luxury {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          color: var(--text-primary, #f8fafc);
          margin-bottom: 1rem;
        }

        .heading-gold {
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary, #94a3b8);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Секции с единым стилем */
        .analytics-section,
        .roi-section,
        .security-section,
        .contact-section {
          padding: 4rem 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: linear-gradient(180deg, var(--noir-900, #0A051A) 0%, var(--noir-800, #1e293b) 100%);
        }

        .roi-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }

        .contact-content {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Loading состояния */
        .loading-skeleton,
        .loading-section {
          background: var(--glass-dark, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          color: var(--text-secondary, #94a3b8);
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(20px);
          animation: pulse 2s ease-in-out infinite;
        }

        .ai-loading {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--glass-dark, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
          border-radius: 50px;
          padding: 1rem 2rem;
          color: var(--text-secondary, #94a3b8);
          backdrop-filter: blur(20px);
          z-index: 1000;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .analytics-section,
          .roi-section,
          .security-section,
          .contact-section {
            padding: 2rem 0;
          }

          .section-header {
            margin-bottom: 2rem;
            padding-top: 1rem;
          }
        }
      `}</style>
    </main>
  );
}