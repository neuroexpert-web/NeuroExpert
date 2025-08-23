'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PremiumGlassBackground from './components/PremiumGlassBackground';
import FuturisticHero from './components/FuturisticHero';
import JourneySection from './components/JourneySection';
import WhyUsSection from './components/WhyUsSection';
import PricingSection from './components/PricingSection';

// Динамические импорты для оптимизации
const ROICalculator = dynamic(() => import('./components/ROICalculator'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка калькулятора ROI...</div>
});

const FuturisticAIChat = dynamic(() => import('./components/FuturisticAIChat'), {
  ssr: false,
  loading: () => null
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
      {/* Новый футуристический Hero блок */}
      <FuturisticHero />
      
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
        <FuturisticAIChat />
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
            padding: 80px 0;
          }

          .section-header {
            margin-bottom: 40px;
          }
        }
      `}</style>
    </main>
  );
}