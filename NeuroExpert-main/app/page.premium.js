'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import PremiumBackground from './components/PremiumBackground';
import PremiumHero from './components/PremiumHero';
import PremiumCard from './components/PremiumCard';

// Динамические импорты для оптимизации
const ROICalculator = dynamic(() => import('./components/ROICalculator'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка калькулятора...</div>
});

const SmartFloatingAI = dynamic(() => import('./components/SmartFloatingAI'), {
  ssr: false,
  loading: () => <div className="ai-loading">AI загружается...</div>
});

const ContactForm = dynamic(() => import('./components/ContactForm'), {
  ssr: false
});

export default function PremiumHome() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="premium-main">
      {/* Premium Background */}
      <PremiumBackground />
      
      {/* Hero Section */}
      <PremiumHero />
      
      {/* Services Section */}
      <section className="premium-section services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-luxury">
              Наши <span className="heading-gold">Премиум</span> Услуги
            </h2>
            <p className="section-subtitle">
              Эксклюзивные решения для вашего бизнеса
            </p>
          </div>
          
          <div className="services-grid">
            <PremiumCard glowColor="blue" badge="POPULAR">
              <div className="service-item">
                <div className="service-icon">
                  <span className="icon-gradient">🚀</span>
                </div>
                <h3 className="service-title">AI Консалтинг</h3>
                <p className="service-desc">
                  Персональная разработка AI-стратегии для вашего бизнеса
                </p>
                <div className="service-price">
                  <span className="price-currency">₽</span>
                  <span className="price-value">149,900</span>
                  <span className="price-period">/месяц</span>
                </div>
                <button className="btn-luxury btn-small">
                  Подробнее
                </button>
              </div>
            </PremiumCard>

            <PremiumCard glowColor="gold" badge="PREMIUM">
              <div className="service-item">
                <div className="service-icon">
                  <span className="icon-gradient">👑</span>
                </div>
                <h3 className="service-title">Enterprise AI</h3>
                <p className="service-desc">
                  Полная цифровая трансформация корпорации
                </p>
                <div className="service-price">
                  <span className="price-currency">₽</span>
                  <span className="price-value">499,900</span>
                  <span className="price-period">/месяц</span>
                </div>
                <button className="btn-gold btn-small">
                  VIP доступ
                </button>
              </div>
            </PremiumCard>

            <PremiumCard glowColor="purple">
              <div className="service-item">
                <div className="service-icon">
                  <span className="icon-gradient">💎</span>
                </div>
                <h3 className="service-title">Custom AI</h3>
                <p className="service-desc">
                  Разработка уникальных AI-решений под ключ
                </p>
                <div className="service-price">
                  <span className="price-currency">от</span>
                  <span className="price-value">999,900</span>
                  <span className="price-period">₽</span>
                </div>
                <button className="btn-luxury btn-small">
                  Обсудить проект
                </button>
              </div>
            </PremiumCard>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="premium-section calculator-section">
        <div className="container">
          <PremiumCard glowColor="blue" className="calculator-card">
            <div className="calculator-header">
              <h2 className="heading-luxury">
                Калькулятор <span className="heading-gold">ROI</span>
              </h2>
              <p className="calculator-subtitle">
                Рассчитайте выгоду от внедрения AI в ваш бизнес
              </p>
            </div>
            <Suspense fallback={<div>Загрузка...</div>}>
              <ROICalculator />
            </Suspense>
          </PremiumCard>
        </div>
      </section>

      {/* Contact Section */}
      <section className="premium-section contact-section">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2 className="heading-luxury">
                Готовы к <span className="heading-gold">трансформации</span>?
              </h2>
              <p className="contact-desc">
                Свяжитесь с нами для персональной консультации
              </p>
              <div className="contact-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Бесплатная консультация</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Персональный менеджер</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Гарантия результата</span>
                </div>
              </div>
            </div>
            <PremiumCard glowColor="gold" className="contact-form-card">
              <Suspense fallback={<div>Загрузка формы...</div>}>
                <ContactForm />
              </Suspense>
            </PremiumCard>
          </div>
        </div>
      </section>

      {/* Floating AI Assistant */}
      <Suspense fallback={null}>
        <SmartFloatingAI />
      </Suspense>

      <style jsx>{`
        .premium-main {
          position: relative;
          min-height: 100vh;
          background: var(--noir-900);
          overflow-x: hidden;
        }

        .premium-section {
          position: relative;
          padding: 120px 0;
          z-index: 1;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .section-header h2 {
          font-size: clamp(40px, 5vw, 64px);
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-family: var(--font-body);
          font-size: 20px;
          color: var(--platinum-400);
        }

        /* Services Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 40px;
        }

        .service-item {
          text-align: center;
          padding: 40px;
        }

        .service-icon {
          display: inline-block;
          margin-bottom: 24px;
        }

        .icon-gradient {
          font-size: 64px;
          filter: drop-shadow(0 0 30px currentColor);
        }

        .service-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          color: var(--platinum-50);
          margin-bottom: 16px;
        }

        .service-desc {
          font-family: var(--font-body);
          font-size: 16px;
          color: var(--platinum-400);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .service-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 32px;
        }

        .price-currency {
          font-size: 20px;
          color: var(--platinum-500);
        }

        .price-value {
          font-family: var(--font-display);
          font-size: 40px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--platinum-50), var(--platinum-300));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .price-period {
          font-size: 16px;
          color: var(--platinum-500);
        }

        .btn-small {
          padding: 12px 32px;
          font-size: 14px;
        }

        /* Calculator Section */
        .calculator-section {
          background: rgba(65, 54, 241, 0.02);
        }

        .calculator-card {
          max-width: 800px;
          margin: 0 auto;
        }

        .calculator-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .calculator-subtitle {
          font-size: 18px;
          color: var(--platinum-400);
          margin-top: 16px;
        }

        /* Contact Section */
        .contact-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .contact-info h2 {
          font-size: clamp(36px, 4vw, 56px);
          margin-bottom: 24px;
        }

        .contact-desc {
          font-size: 20px;
          color: var(--platinum-400);
          margin-bottom: 48px;
          line-height: 1.6;
        }

        .contact-features {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 18px;
          color: var(--platinum-300);
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--gold-premium), var(--gold-metallic));
          color: var(--noir-900);
          border-radius: 50%;
          font-weight: 700;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .contact-wrapper {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        @media (max-width: 768px) {
          .premium-section {
            padding: 80px 0;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .service-item {
            padding: 32px;
          }
        }
      `}</style>
    </main>
  );
}