'use client';

import { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import SwipeContainer from './components/SwipeContainer';

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

export default function Home() {
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

  // Компоненты для каждого раздела
  const sectionComponents = [
    // Главная
    <Suspense fallback={<div className="loading-section">Загрузка...</div>}>
      <NeuroExpertHero />
    </Suspense>,
    
    // Аналитика
    <Suspense fallback={<div className="loading-section">Загрузка аналитики...</div>}>
      <div className="analytics-dashboard">
        <h2 className="section-title">Аналитика платформы</h2>
        <p>Полная аналитика и метрики в реальном времени</p>
        <Analytics />
      </div>
    </Suspense>,
    
    // ROI-калькулятор
    <section className="roi-section" id="roi-calculator">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-luxury">
            Рассчитайте вашу <span className="heading-gold">выгоду</span>
          </h2>
          <p className="section-subtitle">
            Узнайте, сколько вы сэкономите с нашими решениями
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
        <h2 className="section-title">Безопасность и защита данных</h2>
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
      {/* Горизонтальный свайп контейнер */}
      <SwipeContainer 
        sections={sections}
        onSectionChange={(index) => {
          // Отправка события в аналитику
          if (window.gtag) {
            window.gtag('event', 'section_view', {
              section_name: sections[index],
              section_index: index
            });
          }
        }}
      >
        {sectionComponents}
      </SwipeContainer>

      {/* AI Ассистент - всегда доступен */}
      <Suspense fallback={null}>
        <SmartFloatingAI />
      </Suspense>
      
      {/* Фоновые эффекты */}
      <div className="background-effects">
        <div className="neon-glow-1"></div>
        <div className="neon-glow-2"></div>
        <div className="neural-network-bg"></div>
      </div>

      <style jsx>{`
        .loading-section {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: var(--text-primary);
          font-size: 1.2rem;
        }

        .analytics-dashboard,
        .security-section,
        .contact-section {
          padding: 4rem 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
          text-align: center;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .background-effects {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .neon-glow-1,
        .neon-glow-2 {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          animation: float 20s infinite ease-in-out;
        }

        .neon-glow-1 {
          background: var(--primary);
          top: -250px;
          left: -250px;
        }

        .neon-glow-2 {
          background: var(--accent);
          bottom: -250px;
          right: -250px;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, -50px) scale(1.2);
          }
        }
      `}</style>
    </main>
  );
}