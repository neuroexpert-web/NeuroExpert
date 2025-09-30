'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SolutionsSection() {
  const [activeCategory, setActiveCategory] = useState('websites');

  const solutions = {
    websites: {
      title: '🌐 Веб-решения',
      items: [
        {
          name: 'AI Landing Page',
          price: 'от 79 900 ₽',
          timeline: '5-7 дней',
          features: ['AI-консультант 24/7', 'Конверсия до 40%', 'A/B тестирование'],
          popular: true
        },
        {
          name: 'Корпоративный сайт',
          price: 'от 199 900 ₽',
          timeline: '14-21 день',
          features: ['AI отдел продаж', 'Многоязычность', 'База знаний компании']
        },
        {
          name: 'Интернет-магазин',
          price: 'от 299 900 ₽',
          timeline: '21-30 дней',
          features: ['Персональные рекомендации', 'AI-стилист', 'Умный поиск']
        }
      ]
    },
    applications: {
      title: '📱 Приложения',
      items: [
        {
          name: 'Мобильное приложение',
          price: 'от 399 900 ₽',
          timeline: '30-45 дней',
          features: ['iOS + Android', 'AI-ассистент', 'Push персонализация'],
          popular: true
        },
        {
          name: 'PWA приложение',
          price: 'от 199 900 ₽',
          timeline: '14-21 день',
          features: ['Работает офлайн', 'Как нативное', 'Быстрая установка']
        },
        {
          name: 'SaaS платформа',
          price: 'от 999 900 ₽',
          timeline: '2-3 месяца',
          features: ['Масштабируемость', 'API интеграции', 'White label']
        }
      ]
    },
    ai: {
      title: '🤖 AI-решения',
      items: [
        {
          name: 'AI Консультант',
          price: 'от 49 900 ₽/мес',
          timeline: '3-5 дней',
          features: ['Обучение на данных', 'CRM интеграция', 'Голосовой интерфейс'],
          popular: true
        },
        {
          name: 'AI Автоматизация',
          price: 'от 149 900 ₽',
          timeline: '7-14 дней',
          features: ['Обработка документов', 'Генерация контента', 'Умная аналитика']
        },
        {
          name: 'AI Аналитика',
          price: 'от 99 900 ₽',
          timeline: '5-10 дней',
          features: ['Предиктивная аналитика', 'Рекомендации', 'Реал-тайм отчеты']
        }
      ]
    }
  };

  const categories = Object.keys(solutions);

  return (
    <section className="solutions-section">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-luxury">
            Готовые <span className="heading-gold">решения</span>
          </h2>
          <p className="section-subtitle">
            Выберите подходящее решение или создадим индивидуальное под ваши задачи
          </p>
        </div>

        {/* Переключатель категорий */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {solutions[category].title}
            </button>
          ))}
        </div>

        {/* Карточки решений */}
        <motion.div
          className="solutions-grid"
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {solutions[activeCategory].items.map((solution, index) => (
            <SolutionCard key={index} solution={solution} index={index} />
          ))}
        </motion.div>

        {/* CTA секция */}
        <div className="cta-section">
          <h3>Не нашли подходящее решение?</h3>
          <p>Создадим индивидуальное решение под ваши задачи</p>
          <button className="btn-luxury btn-gold">
            Обсудить проект
          </button>
        </div>
      </div>

      <style jsx>{`
        .solutions-section {
          padding: 4rem 2rem;
          background: linear-gradient(180deg, var(--noir-900) 0%, var(--noir-800) 100%);
          min-height: 100vh;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .heading-luxury {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          color: var(--text-primary);
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
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .category-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .category-tab {
          padding: 1rem 2rem;
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 50px;
          color: var(--text-secondary);
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(20px);
        }

        .category-tab:hover {
          border-color: var(--primary);
          color: var(--text-primary);
          transform: translateY(-2px);
        }

        .category-tab.active {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          border-color: var(--primary);
          color: white;
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        }

        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .cta-section {
          text-align: center;
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 3rem;
          backdrop-filter: blur(20px);
        }

        .cta-section h3 {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .cta-section p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .btn-luxury {
          padding: 1rem 2rem;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-gold {
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          color: var(--noir-900);
        }

        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
        }

        @media (max-width: 768px) {
          .solutions-section {
            padding: 2rem 0;
          }

          .container {
            padding: 0 1rem;
          }

          .solutions-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .category-tabs {
            gap: 0.5rem;
          }

          .category-tab {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}

function SolutionCard({ solution, index }) {
  return (
    <motion.div
      className="solution-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {solution.popular && (
        <div className="popular-badge">
          ⭐ Популярно
        </div>
      )}
      
      <div className="solution-header">
        <h3>{solution.name}</h3>
        <div className="solution-price">{solution.price}</div>
      </div>

      <div className="solution-timeline">
        ⏱️ Срок: {solution.timeline}
      </div>

      <div className="solution-features">
        {solution.features.map((feature, i) => (
          <div key={i} className="feature-item">
            ✨ {feature}
          </div>
        ))}
      </div>

      <button className="solution-btn">
        Узнать подробнее
      </button>

      <style jsx>{`
        .solution-card {
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .solution-card:hover {
          border-color: var(--primary);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .popular-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          color: var(--noir-900);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .solution-header {
          margin-bottom: 1rem;
        }

        .solution-header h3 {
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .solution-price {
          color: var(--accent);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .solution-timeline {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .solution-features {
          margin-bottom: 2rem;
        }

        .feature-item {
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .solution-btn {
          width: 100%;
          padding: 1rem;
          background: transparent;
          border: 2px solid var(--primary);
          border-radius: 12px;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .solution-btn:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
        }
      `}</style>
    </motion.div>
  );
}