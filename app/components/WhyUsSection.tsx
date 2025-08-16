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
              <h3 className="trust-title">Нам доверяют</h3>
              <div className="trust-stats">
                <div className="stat">
                  <span className="stat-value">500+</span>
                  <span className="stat-label">успешных проектов</span>
                </div>
                <div className="stat">
                  <span className="stat-value">95%</span>
                  <span className="stat-label">клиентов возвращаются</span>
                </div>
                <div className="stat">
                  <span className="stat-value">10+</span>
                  <span className="stat-label">лет на рынке</span>
                </div>
              </div>
              <div className="technologies">
                <h4>Используем передовые технологии</h4>
                <div className="tech-badges">
                  <span className="tech-badge">AI/ML</span>
                  <span className="tech-badge">Cloud</span>
                  <span className="tech-badge">Big Data</span>
                  <span className="tech-badge">IoT</span>
                  <span className="tech-badge">Blockchain</span>
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

        .trust-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          margin-bottom: 60px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--gold-premium), var(--gold-rose));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 18px;
          color: var(--platinum-400);
        }

        .technologies {
          margin-top: 48px;
        }

        .technologies h4 {
          font-family: var(--font-display);
          font-size: 20px;
          color: var(--platinum-300);
          margin-bottom: 24px;
        }

        .tech-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        .tech-badge {
          padding: 8px 20px;
          background: rgba(65, 54, 241, 0.1);
          border: 1px solid rgba(65, 54, 241, 0.3);
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          color: var(--royal-gradient-start);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .trust-content {
            padding: 40px 24px;
          }

          .stat-value {
            font-size: 40px;
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