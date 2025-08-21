import React, { useState } from 'react';
import PremiumCard from './PremiumCard';

interface PricingPlan {
  name: string;
  description: string;
  targetAudience: string;
  price: string;
  priceNote?: string;
  features: string[];
  popular?: boolean;
  color: 'blue' | 'gold' | 'purple';
}

export default function PricingSection(): JSX.Element {
  const [selectedPlan, setSelectedPlan] = useState<string>('Бизнес');

  const scrollToROI = () => {
    const element = document.getElementById('roi-calculator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    // Открываем чат с AI дуправляющийом с предзаполненным сообщением
    setTimeout(() => {
      import('@/app/utils/aiChat').then(({ openAIChat }) => {
        openAIChat(`Здравствуйте! Меня интересует тариф "${planName}". Расскажите подробнее о возможностях и как начать работу.`);
      });
    }, 300);
  };

  const plans: PricingPlan[] = [
    {
      name: 'Старт',
      description: 'Аудит, базовый сайт, CRM, поддержка',
      targetAudience: 'Малый бизнес',
      price: '39 900',
      priceNote: '/месяц',
      features: [
        'Глубокий аудит бизнеса',
        'Базовый сайт или лендинг',
        'CRM-система на 100 клиентов',
        'Интеграция с мессенджерами',
        'Базовая автоматизация продаж',
        'Обучение команды',
        'Поддержка 5 дней в неделю'
      ],
      color: 'blue'
    },
    {
      name: 'Бизнес',
      description: 'Всё из Старт + интернет-магазин, приложение, расширенная CRM',
      targetAudience: 'Средний бизнес',
      price: '89 900',
      priceNote: '/месяц',
      features: [
        'Всё из тарифа Старт',
        'Интернет-магазин или корпоративный сайт',
        'Мобильное приложение (iOS/Android)',
        'CRM на 1000+ клиентов',
        'AI-аналитика и прогнозирование',
        'Омниканальность (10+ каналов)',
        'Приоритетная поддержка 24/7'
      ],
      popular: true,
      color: 'gold'
    },
    {
      name: 'Enterprise',
      description: 'Безлимит, SaaS, выделенный сервер',
      targetAudience: 'Крупный бизнес',
      price: '199 900',
      priceNote: '/месяц',
      features: [
        'Безлимитные возможности',
        'Собственная SaaS платформа',
        'Выделенный сервер и инфраструктура',
        'Кастомная разработка под ваши задачи',
        'Интеграция с любыми системами',
        'Персональная команда разработки',
        'SLA 99.9% и гарантии'
      ],
      color: 'purple'
    }
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-luxury">
            Тарифы — <span className="heading-gold">что вы получаете</span>
          </h2>
          <p className="section-subtitle">
            Каждая услуга чётко описана и подходит под разные задачи
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <PremiumCard
              key={plan.name}
              glowColor={plan.color}
              badge={plan.popular ? 'ПОПУЛЯРНЫЙ' : undefined}
              className={`pricing-card ${selectedPlan === plan.name ? 'selected' : ''}`}
            >
              <div className="plan-content">
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                  <p className="plan-target">{plan.targetAudience}</p>
                </div>

                <div className="plan-price">
                  <span className="price-prefix">от</span>
                  <span className="price-value">{plan.price}₽</span>
                  <span className="price-note">{plan.priceNote}</span>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`btn-luxury ${plan.popular ? 'btn-gold' : ''} btn-full`}
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  <span>Выбрать {plan.name}</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </PremiumCard>
          ))}
        </div>

        <div className="pricing-extras">
          <div className="roi-calculator-promo">
            <h3>Есть калькулятор выгоды</h3>
            <p>Быстро поймите, сколько вы сэкономите с нашими решениями</p>
            <button className="btn-luxury btn-outline" onClick={scrollToROI}>
              <span>Рассчитать экономию</span>
              <span className="btn-icon">💰</span>
            </button>
          </div>

          <div className="comparison-promo">
            <h3>Сравнение с классическими CRM</h3>
            <div className="comparison-items">
              <div className="comparison-item">
                <span className="item-label">Цена</span>
                <span className="item-value">На 40% дешевле</span>
              </div>
              <div className="comparison-item">
                <span className="item-label">Функционал</span>
                <span className="item-value">В 3 раза больше</span>
              </div>
              <div className="comparison-item">
                <span className="item-label">Поддержка</span>
                <span className="item-value">24/7 включена</span>
              </div>
            </div>
          </div>
          
          <div className="contact-promo">
            <h3>Нужна консультация?</h3>
            <p>Поговорите с AI дуправляющийом или оставьте заявку</p>
            <div className="contact-buttons">
              <button 
                className="btn-luxury btn-gold"
                onClick={() => {
                  import('@/app/utils/aiChat').then(({ openAIChat, AI_CHAT_MESSAGES }) => {
                    openAIChat(AI_CHAT_MESSAGES.PRICING_INFO);
                  });
                }}
              >
                <span>Консультация AI</span>
                <span className="btn-icon">🤖</span>
              </button>
              <button 
                className="btn-luxury btn-outline"
                onClick={() => {
                  const contactForm = document.querySelector('.contact-form-section');
                  contactForm?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Оставить заявку</span>
                <span className="btn-icon">📧</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-section {
          position: relative;
          padding: 120px 0;
          background: var(--noir-900);
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
          font-size: clamp(36px, 5vw, 56px);
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-family: var(--font-body);
          font-size: 20px;
          color: var(--platinum-400);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 40px;
          margin-bottom: 80px;
        }

        .pricing-card {
          transition: transform 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-8px);
        }

        .pricing-card.selected {
          transform: scale(1.05);
        }

        .plan-content {
          padding: 40px;
        }

        .plan-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .plan-name {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: var(--platinum-50);
          margin-bottom: 16px;
        }

        .plan-description {
          font-size: 16px;
          color: var(--platinum-300);
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .plan-target {
          font-size: 14px;
          color: var(--gold-premium);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 8px;
          margin-bottom: 40px;
        }

        .price-prefix {
          font-size: 18px;
          color: var(--platinum-500);
        }

        .price-value {
          font-family: var(--font-display);
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--platinum-50), var(--platinum-300));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .price-note {
          font-size: 18px;
          color: var(--platinum-500);
        }

        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 40px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 16px;
          color: var(--platinum-300);
        }

        .feature-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 50%;
          font-weight: 700;
        }

        .feature-text {
          line-height: 1.5;
        }

        .btn-full {
          width: 100%;
          justify-content: center;
        }

        .pricing-extras {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 40px;
          margin-top: 80px;
        }

        .roi-calculator-promo,
        .comparison-promo {
          background: var(--glass-white);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
        }

        .roi-calculator-promo h3,
        .comparison-promo h3 {
          font-family: var(--font-display);
          font-size: 24px;
          color: var(--platinum-50);
          margin-bottom: 16px;
        }

        .roi-calculator-promo p {
          color: var(--platinum-400);
          margin-bottom: 24px;
        }

        .btn-icon {
          margin-left: 8px;
          font-size: 20px;
        }

        .comparison-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 32px;
        }

        .comparison-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
        }

        .item-label {
          font-weight: 600;
          color: var(--platinum-400);
        }

        .item-value {
          font-weight: 700;
          color: var(--gold-premium);
        }

        .contact-promo {
          background: var(--glass-white);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
        }

        .contact-promo h3 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: var(--platinum-50);
          margin-bottom: 12px;
        }

        .contact-promo p {
          font-size: 18px;
          color: var(--platinum-400);
          margin-bottom: 32px;
        }

        .contact-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 1200px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 600px;
            margin: 0 auto 80px;
          }
        }

        @media (max-width: 768px) {
          .pricing-extras {
            grid-template-columns: 1fr;
          }

          .plan-content {
            padding: 32px 24px;
          }

          .price-value {
            font-size: 36px;
          }
        }
      `}</style>
    </section>
  );
}