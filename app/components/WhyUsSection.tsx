import React from 'react';
import PremiumCard from './PremiumCard';

interface Benefit {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

export default function WhyUsSection(): JSX.Element {
  const benefits: Benefit[] = [
    {
      icon: '💰',
      title: 'Экономия времени и денег',
      description: 'с надежным комплексным решением',
      highlight: 'до 40% экономии'
    },
    {
      icon: '🚀',
      title: 'Быстрый запуск',
      description: 'результат за 2-4 недели',
      highlight: 'в 3 раза быстрее'
    },
    {
      icon: '💎',
      title: 'Честные цены',
      description: 'прозрачный бюджет без скрытых платежей',
      highlight: '100% прозрачность'
    },
    {
      icon: '👥',
      title: 'Команда опытных специалистов',
      description: 'которые работают с вами на каждом шагу',
      highlight: '24/7 поддержка'
    }
  ];

  return (
    <section className="why-us-section">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-luxury">
            Почему <span className="heading-gold">NeuroExpert</span>
          </h2>
          <p className="section-subtitle">
            Ваш надежный партнер в цифровой трансформации
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
              <div className="benefit-highlight">{benefit.highlight}</div>
            </div>
          ))}
        </div>

        <div className="trust-section">
          <PremiumCard glowColor="gold" className="trust-card">
            <div className="trust-content">
              <h3 className="trust-title">Безопасность и гарантии</h3>
              
              <div className="security-grid">
                <div className="security-block">
                  <div className="security-icon">🔒</div>
                  <h4 className="security-title">Защита данных</h4>
                  <ul className="security-list">
                    <li>Шифрование SSL/TLS всех соединений</li>
                    <li>Соответствие 152-ФЗ "О персональных данных"</li>
                    <li>Хранение данных в РФ (№ 242-ФЗ)</li>
                    <li>NDA с каждым клиентом</li>
                  </ul>
                </div>
                
                <div className="security-block">
                  <div className="security-icon">✅</div>
                  <h4 className="security-title">Гарантии качества</h4>
                  <ul className="security-list">
                    <li>Официальный договор с чёткими SLA</li>
                    <li>Поэтапная оплата работ</li>
                    <li>3 месяца бесплатной поддержки</li>
                    <li>Гарантия возврата при неудовлетворённости</li>
                  </ul>
                </div>
                
                <div className="security-block">
                  <div className="security-icon">⚖️</div>
                  <h4 className="security-title">Правовая защита</h4>
                  <ul className="security-list">
                    <li>Соответствие GDPR и КСИИ</li>
                    <li>Лицензия ФСБ на криптозащиту</li>
                    <li>Сертификат ФСТЭК России</li>
                    <li>Передача исходных кодов заказчику</li>
                  </ul>
                </div>
              </div>
              
              <div className="compliance-badges">
                <div className="compliance-badge">
                  <span className="badge-icon">🇷🇺</span>
                  <span className="badge-text">152-ФЗ</span>
                </div>
                <div className="compliance-badge">
                  <span className="badge-icon">🛡️</span>
                  <span className="badge-text">GDPR</span>
                </div>
                <div className="compliance-badge">
                  <span className="badge-icon">🔐</span>
                  <span className="badge-text">ISO 27001</span>
                </div>
                <div className="compliance-badge">
                  <span className="badge-icon">📋</span>
                  <span className="badge-text">242-ФЗ</span>
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>

      <style jsx>{`
        .why-us-section {
          position: relative;
          padding: 120px 0;
          background: rgba(139, 92, 246, 0.02);
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

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-bottom: 80px;
        }

        .benefit-item {
          text-align: center;
          padding: 40px;
          background: var(--glass-white);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          transition: all 0.3s ease;
        }

        .benefit-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .benefit-icon {
          font-size: 64px;
          margin-bottom: 24px;
          filter: drop-shadow(0 0 30px currentColor);
        }

        .benefit-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 600;
          color: var(--platinum-50);
          margin-bottom: 12px;
        }

        .benefit-description {
          font-size: 16px;
          color: var(--platinum-400);
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .benefit-highlight {
          display: inline-block;
          padding: 8px 24px;
          background: linear-gradient(135deg, var(--royal-gradient-start), var(--royal-gradient-end));
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .trust-section {
          max-width: 1000px;
          margin: 0 auto;
        }

        .trust-card {
          width: 100%;
        }

        .trust-content {
          padding: 60px;
          text-align: center;
        }

        .trust-title {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 700;
          color: var(--platinum-50);
          margin-bottom: 48px;
        }

        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
          margin-bottom: 48px;
        }

        .security-block {
          text-align: left;
          padding: 32px;
          background: rgba(102, 126, 234, 0.05);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .security-block:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: rgba(102, 126, 234, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .security-icon {
          font-size: 48px;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
        }

        .security-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 600;
          color: var(--platinum-50);
          margin-bottom: 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .security-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .security-list li {
          color: var(--platinum-300);
          font-size: 15px;
          line-height: 1.8;
          padding-left: 24px;
          position: relative;
          margin-bottom: 8px;
        }

        .security-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
        }

        .compliance-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          margin-top: 40px;
        }

        .compliance-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .compliance-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(102, 126, 234, 0.4);
          border-color: rgba(102, 126, 234, 0.6);
        }

        .badge-icon {
          font-size: 24px;
        }

        .badge-text {
          font-size: 16px;
          font-weight: 600;
          color: var(--platinum-50);
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .trust-content {
            padding: 40px 24px;
          }

          .security-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .security-block {
            padding: 24px;
          }

          .compliance-badges {
            gap: 12px;
          }

          .compliance-badge {
            padding: 10px 20px;
            font-size: 14px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .benefit-item {
            padding: 32px 24px;
          }
        }
      `}</style>
    </section>
  );
}