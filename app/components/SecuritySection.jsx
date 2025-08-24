'use client';
import { motion } from 'framer-motion';

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: '🔐',
      title: 'Zero Trust Architecture',
      description: 'Многоуровневая защита с проверкой каждого запроса',
      features: ['MFA аутентификация', 'Ролевая модель доступа', 'Шифрование данных']
    },
    {
      icon: '🛡️',
      title: 'GDPR Compliance',
      description: 'Полное соответствие европейским стандартам защиты данных',
      features: ['Право на удаление', 'Прозрачность обработки', 'Минимизация данных']
    },
    {
      icon: '🔒',
      title: 'ISO 27001',
      description: 'Сертифицированная система управления информационной безопасностью',
      features: ['Регулярные аудиты', 'Управление рисками', 'Непрерывное улучшение']
    },
    {
      icon: '🌐',
      title: 'DDoS Protection',
      description: 'Защита от атак и обеспечение доступности 99.9%',
      features: ['CloudFlare Enterprise', 'Резервирование', 'Мониторинг 24/7']
    }
  ];

  return (
    <section className="security-section-component">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-luxury">
            Безопасность и <span className="heading-gold">защита данных</span>
          </h2>
          <p className="section-subtitle">
            Ваши данные под надежной защитой с использованием передовых технологий
          </p>
        </motion.div>

        <div className="security-grid">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="security-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="card-icon">{feature.icon}</div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
              <ul className="feature-list">
                {feature.features.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="security-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="stat-item">
            <div className="stat-number">256-bit</div>
            <div className="stat-label">Шифрование</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Мониторинг</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">SOC 2</div>
            <div className="stat-label">Сертификация</div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .security-section-component {
          width: 100%;
          min-height: 100vh;
          padding: 4rem 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .heading-luxury {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #06ffa5 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .heading-gold {
          color: #ffb000;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
        }

        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .security-card {
          background: rgba(20, 20, 40, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .security-card:hover {
          border-color: var(--aurora-purple);
          box-shadow: 0 10px 40px rgba(168, 85, 247, 0.2);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .card-description {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          text-align: left;
        }

        .feature-list li {
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .security-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          background: rgba(10, 10, 30, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--aurora-cyan);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .heading-luxury {
            font-size: 2rem;
          }

          .security-grid {
            grid-template-columns: 1fr;
          }

          .security-stats {
            grid-template-columns: repeat(2, 1fr);
            padding: 2rem;
          }
        }
      `}</style>
    </section>
  );
}