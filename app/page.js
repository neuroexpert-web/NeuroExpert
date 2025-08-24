'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SwipeContainer from './components/SwipeContainer';

// Динамические импорты для оптимизации
const NeuroExpertHero = dynamic(() => import('./components/NeuroExpertHeroEnhanced'), {
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
          padding: 0 var(--space-xl, 2rem);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--space-3xl, 4rem);
          padding-top: var(--space-xl, 2rem);
        }

        .heading-luxury {
          font-family: var(--font-cyber, 'Orbitron', monospace);
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 900;
          background: var(--gradient-neuro, linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ff0080 100%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-lg, 1.5rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          position: relative;
          animation: neural-pulse 4s ease-in-out infinite;
        }

        .heading-luxury::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--gradient-neuro, linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ff0080 100%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: blur(20px);
          opacity: 0.3;
          z-index: -1;
        }

        .heading-gold {
          color: var(--neon-gold, #ffb000);
          text-shadow: var(--glow-gold, 0 0 20px rgba(255, 176, 0, 0.5));
        }

        .section-subtitle {
          font-family: var(--font-neural, 'Inter', sans-serif);
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Секции с единым стилем */
        .analytics-section,
        .roi-section,
        .security-section,
        .contact-section {
          padding: var(--space-4xl, 6rem) 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: var(--gradient-cyber, linear-gradient(135deg, #0a0e1a 0%, #1a2138 50%, #2a3757 100%));
          position: relative;
        }

        .analytics-section::before,
        .roi-section::before,
        .security-section::before,
        .contact-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gradient-neuro, linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ff0080 100%));
          opacity: 0.8;
        }

        .roi-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
          border-radius: var(--radius-xl, 2rem);
          padding: var(--space-2xl, 3rem);
          backdrop-filter: var(--glass-blur, blur(20px));
          box-shadow: var(--glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.3));
        }

        .contact-content {
          max-width: 800px;
          margin: 0 auto;
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.1));
          border-radius: var(--radius-xl, 2rem);
          padding: var(--space-2xl, 3rem);
          backdrop-filter: var(--glass-blur, blur(20px));
          box-shadow: var(--glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.3));
        }

        /* Loading состояния с неоновыми эффектами */
        .loading-skeleton,
        .loading-section {
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--neon-cyan, #06ffa5);
          border-radius: var(--radius-xl, 2rem);
          padding: var(--space-3xl, 4rem);
          text-align: center;
          color: var(--neon-cyan, #06ffa5);
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: var(--glass-blur, blur(20px));
          box-shadow: var(--glow-cyan, 0 0 20px rgba(6, 255, 165, 0.3));
          font-family: var(--font-cyber, 'Orbitron', monospace);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: neural-pulse 2s ease-in-out infinite;
          position: relative;
        }

        .loading-skeleton::before,
        .loading-section::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: var(--gradient-energy, linear-gradient(90deg, #00ff88 0%, #00d4ff 100%));
          border-radius: var(--radius-xl, 2rem);
          z-index: -1;
          animation: electric-flow 2s linear infinite;
        }

        .ai-loading {
          position: fixed;
          bottom: var(--space-xl, 2rem);
          right: var(--space-xl, 2rem);
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--neon-blue, #00d4ff);
          border-radius: var(--radius-full, 9999px);
          padding: var(--space-md, 1rem) var(--space-xl, 2rem);
          color: var(--neon-blue, #00d4ff);
          backdrop-filter: var(--glass-blur, blur(20px));
          box-shadow: var(--glow-blue, 0 0 20px rgba(0, 212, 255, 0.3));
          z-index: var(--z-toast, 10000);
          font-family: var(--font-cyber, 'Orbitron', monospace);
          font-size: 0.875rem;
          font-weight: 600;
          animation: cyber-glow 3s ease-in-out infinite;
        }

        /* Анимации */
        @keyframes neural-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
            filter: brightness(1.2);
          }
        }

        @keyframes electric-flow {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        @keyframes cyber-glow {
          0%, 100% {
            box-shadow: var(--glow-blue, 0 0 20px rgba(0, 212, 255, 0.3));
          }
          33% {
            box-shadow: var(--glow-purple, 0 0 20px rgba(168, 85, 247, 0.3));
          }
          66% {
            box-shadow: var(--glow-cyan, 0 0 20px rgba(6, 255, 165, 0.3));
          }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .container {
            padding: 0 var(--space-lg, 1.5rem);
          }

          .roi-wrapper,
          .contact-content {
            padding: var(--space-xl, 2rem);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 var(--space-md, 1rem);
          }

          .analytics-section,
          .roi-section,
          .security-section,
          .contact-section {
            padding: var(--space-2xl, 3rem) 0;
          }

          .section-header {
            margin-bottom: var(--space-2xl, 3rem);
            padding-top: var(--space-md, 1rem);
          }

          .roi-wrapper,
          .contact-content {
            padding: var(--space-lg, 1.5rem);
          }

          .loading-skeleton,
          .loading-section {
            padding: var(--space-xl, 2rem);
            min-height: 200px;
            font-size: 0.875rem;
          }

          .ai-loading {
            bottom: var(--space-md, 1rem);
            right: var(--space-md, 1rem);
            padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 var(--space-sm, 0.5rem);
          }

          .analytics-section,
          .roi-section,
          .security-section,
          .contact-section {
            padding: var(--space-xl, 2rem) 0;
          }

          .section-header {
            margin-bottom: var(--space-lg, 1.5rem);
          }

          .roi-wrapper,
          .contact-content {
            padding: var(--space-md, 1rem);
            border-radius: var(--radius-lg, 1.5rem);
          }

          .loading-skeleton,
          .loading-section {
            padding: var(--space-lg, 1.5rem);
            min-height: 150px;
            font-size: 0.75rem;
          }
        }

        /* High Performance Mode */
        @media (prefers-reduced-motion: reduce) {
          .heading-luxury,
          .loading-skeleton,
          .loading-section,
          .ai-loading {
            animation: none;
          }

          .loading-skeleton::before,
          .loading-section::before {
            animation: none;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .analytics-section,
          .roi-section,
          .security-section,
          .contact-section {
            background: var(--noir-950, #0a0b0f);
          }

          .loading-skeleton,
          .loading-section {
            border-color: var(--neon-electric, #00ff88);
            color: var(--neon-electric, #00ff88);
          }
        }

        /* Print Styles */
        @media print {
          .premium-main {
            background: white;
            color: black;
          }

          .ai-loading {
            display: none;
          }

          .loading-skeleton,
          .loading-section {
            border: 1px solid #ccc;
            background: #f9f9f9;
            color: #333;
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}