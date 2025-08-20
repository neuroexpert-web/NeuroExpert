'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PremiumGlassBackground from './components/PremiumGlassBackground';
import NeuroExpertHero from './components/NeuroExpertHero';
import JourneySection from './components/JourneySection';
import WhyUsSection from './components/WhyUsSection';
import PricingSection from './components/PricingSection';

// Динамические импорты для оптимизации
const ROICalculator = dynamic(() => import('./components/ROICalculator'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка калькулятора ROI...</div>
});

const SmartFloatingAI = dynamic(() => import('./components/SmartFloatingAI'), {
  ssr: false,
  loading: () => <div className="ai-loading">AI управляющий загружается...</div>
});

const ContactForm = dynamic(() => import('./components/ContactForm'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка формы...</div>
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  ssr: false,
  loading: () => <div>Загрузка админ-панели...</div>
});

const AIDirectorCapabilities = dynamic(() => import('./components/AIDirectorCapabilities'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка AI директора...</div>
});

export default function Home() {
  return (
    <main className="premium-main" style={{ background: 'var(--noir-900)', minHeight: '100vh' }}>
      {/* Новый Hero блок с анимацией нейросети */}
      <NeuroExpertHero />
      
      {/* Кнопка быстрого доступа к калькулятору */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'transparent',
        position: 'relative',
        zIndex: 10
      }}>
        <a href="#benefits" style={{ textDecoration: 'none' }}>
          <button className="roi-quick-access-btn">
            <span className="roi-btn-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '12px' }}>
                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V7h14v12z" fill="currentColor"/>
                <path d="M11.5 9h1v3h3v1h-3v3h-1v-3h-3v-1h3V9z" fill="currentColor"/>
                <path d="M18 11h-3v1h3v-1zm0 2h-3v1h3v-1zm0 2h-3v1h3v-1z" fill="currentColor"/>
              </svg>
              Рассчитать экономию прямо сейчас
            </span>
            <span className="roi-btn-shimmer"></span>
          </button>
        </a>
      </div>
      
      {/* AI Управляющий директор */}
      <Suspense fallback={<div className="loading-skeleton">Загрузка...</div>}>
        <AIDirectorCapabilities />
      </Suspense>
      
      {/* Ваш простой путь к результату */}
      <JourneySection />
      
      {/* Почему NeuroExpert */}
      <section id="why-us">
        <WhyUsSection />
      </section>
      
      {/* Тарифы */}
      <section id="pricing">
        <PricingSection />
      </section>
      
      {/* Калькулятор ROI */}
      <section className="roi-section" id="benefits">
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
              <ROICalculator />
            </Suspense>
          </div>
        </div>
      </section>
      
      {/* Демо секция */}
      <section className="demo-section" id="demo">
        <div className="container">
          <div className="demo-content">
            <h2 className="heading-luxury">
              Попробуйте <span className="heading-gold">демо</span> прямо сейчас
            </h2>
            <p className="demo-description">
              Наш цифровой директор покажет возможности платформы
            </p>
            <button 
              className="btn-luxury btn-gold btn-large"
              onClick={() => {
                const aiButton = document.querySelector('.ai-float-button');
                if (aiButton) {
                  aiButton.click();
                } else {
                  // Если кнопка AI еще не загрузилась, показываем алерт
                  alert('AI директор загружается, попробуйте через секунду...');
                }
              }}
            >
              <span>Запустить демо</span>
              <span className="btn-icon">🚀</span>
            </button>
          </div>
        </div>
      </section>
      
      {/* Консультация */}
      <section className="consultation-section" id="consultation">
        <div className="container">
          <div className="consultation-wrapper">
            <div className="consultation-info">
              <h2 className="heading-luxury">
                Готовы начать <span className="heading-gold">трансформацию</span>?
              </h2>
              <p className="consultation-description">
                Получите персональную консультацию и дорожную карту развития
              </p>
              <ul className="consultation-benefits">
                <li>✓ Бесплатный аудит текущего состояния</li>
                <li>✓ Персональная стратегия развития</li>
                <li>✓ Расчет ROI для вашего бизнеса</li>
                <li>✓ Демонстрация возможностей</li>
              </ul>
            </div>
            <div className="consultation-form">
              <Suspense fallback={<div>Загрузка формы...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Управляющий - Цифровой директор */}
      <Suspense fallback={null}>
        <SmartFloatingAI />
      </Suspense>
      
      {/* Админ панель (скрыта по умолчанию) */}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <AdminPanel />
        </Suspense>
      )}

      <style jsx>{`
        .premium-main {
          position: relative;
          min-height: 100vh;
          background: var(--noir-900);
          overflow-x: hidden;
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

        .section-subtitle {
          font-family: var(--font-body);
          font-size: 20px;
          color: var(--platinum-400);
        }

        /* ROI Section */
        .roi-section {
          padding: 120px 0;
          background: rgba(65, 54, 241, 0.02);
        }

        .roi-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Demo Section */
        .demo-section {
          padding: 120px 0;
          background: var(--noir-850);
          text-align: center;
        }

        .demo-content h2 {
          margin-bottom: 24px;
        }

        .demo-description {
          font-size: 20px;
          color: var(--platinum-400);
          margin-bottom: 40px;
        }

        .btn-large {
          padding: 20px 48px;
          font-size: 18px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .btn-icon {
          font-size: 24px;
        }

        /* Consultation Section */
        .consultation-section {
          padding: 120px 0;
          background: linear-gradient(180deg, var(--noir-900) 0%, var(--noir-800) 100%);
        }

        .consultation-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .consultation-info h2 {
          margin-bottom: 24px;
        }

        .consultation-description {
          font-size: 20px;
          color: var(--platinum-400);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .consultation-benefits {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .consultation-benefits li {
          font-size: 18px;
          color: var(--platinum-300);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .consultation-benefits li::before {
          content: '';
          color: var(--gold-premium);
          font-weight: 700;
        }

        .consultation-form {
          background: var(--glass-white);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
        }

        /* Loading states */
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
        @media (max-width: 1024px) {
          .consultation-wrapper {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        @media (max-width: 768px) {
          section {
            padding: 40px 20px;
          }

          .section-header {
            margin-bottom: 40px;
          }
        }

        /* Кнопка быстрого доступа к калькулятору */
        .roi-quick-access-btn {
          position: relative;
          padding: 20px 48px;
          font-size: 18px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 100px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .roi-quick-access-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }

        .roi-quick-access-btn:active {
          transform: translateY(0);
        }

        .roi-btn-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .roi-btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          20%, 100% {
            left: 100%;
          }
        }

        .roi-quick-access-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .roi-quick-access-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        @media (max-width: 768px) {
          .roi-quick-access-btn {
            padding: 16px 32px;
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}