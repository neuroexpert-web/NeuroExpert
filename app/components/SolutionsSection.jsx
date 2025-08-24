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
          price: 'от 79,900₽',
          timeline: '5-7 дней',
          features: ['AI-консультант 24/7', 'Конверсия до 40%', 'A/B тестирование'],
          popular: true,
          metrics: { conversion: '+40%', speed: '98/100', seo: '95/100' }
        },
        {
          name: 'Корпоративный сайт',
          price: 'от 199,900₽',
          timeline: '14-21 день',
          features: ['AI отдел продаж', 'Многоязычность', 'База знаний компании'],
          metrics: { leads: '+250%', time: '-70%', roi: '320%' }
        },
        {
          name: 'Интернет-магазин',
          price: 'от 299,900₽',
          timeline: '21-30 дней',
          features: ['Персональные рекомендации', 'AI-стилист', 'Умный поиск'],
          metrics: { sales: '+180%', cart: '+45%', ltv: '+120%' }
        }
      ]
    },
    applications: {
      title: '📱 Приложения',
      items: [
        {
          name: 'Мобильное приложение',
          price: 'от 399,900₽',
          timeline: '30-45 дней',
          features: ['iOS + Android', 'AI-ассистент', 'Push персонализация'],
          popular: true,
          metrics: { retention: '85%', dau: '+60%', rating: '4.9★' }
        },
        {
          name: 'PWA приложение',
          price: 'от 199,900₽',
          timeline: '14-21 день',
          features: ['Работает офлайн', 'Как нативное', 'Быстрая установка'],
          metrics: { install: '+90%', speed: '95/100', offline: '100%' }
        },
        {
          name: 'SaaS платформа',
          price: 'от 999,900₽',
          timeline: '2-3 месяца',
          features: ['Масштабируемость', 'API интеграции', 'White label'],
          metrics: { uptime: '99.9%', api: '<50ms', scale: '∞' }
        }
      ]
    },
    ai: {
      title: '🤖 AI-решения',
      items: [
        {
          name: 'AI Консультант',
          price: 'от 49,900₽/мес',
          timeline: '3-5 дней',
          features: ['Обучение на данных', 'CRM интеграция', 'Голосовой интерфейс'],
          popular: true,
          metrics: { accuracy: '96%', response: '<2s', save: '80%' }
        },
        {
          name: 'AI Автоматизация',
          price: 'от 149,900₽',
          timeline: '7-14 дней',
          features: ['Обработка документов', 'Генерация контента', 'Умная аналитика'],
          metrics: { auto: '85%', error: '-95%', speed: '10x' }
        },
        {
          name: 'AI Аналитика',
          price: 'от 99,900₽',
          timeline: '5-10 дней',
          features: ['Предиктивная аналитика', 'Рекомендации', 'Реал-тайм отчеты'],
          metrics: { predict: '92%', insights: '+300%', real: '24/7' }
        }
      ]
    }
  };

  const categories = Object.keys(solutions);

  return (
    <section className="solutions-section">
      <div className="scrollable-content">
        <div className="container">
        {/* Header Section */}
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            <span className="title-icon">🚀</span>
            <span>Готовые <span className="gradient-text">решения для бизнеса</span></span>
          </h2>
          <p className="section-subtitle">
            Выберите подходящее решение или создадим индивидуальное под ваши задачи
          </p>
        </motion.div>

        {/* Переключатель категорий */}
        <motion.div 
          className="category-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {solutions[category].title}
            </motion.button>
          ))}
        </motion.div>

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
        <motion.div 
          className="cta-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3>Не нашли подходящее решение?</h3>
          <p>Создадим индивидуальное решение под ваши задачи</p>
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Обсудить проект</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
      </div>

      <style jsx>{`
        .solutions-section {
          width: 100%;
          height: 100vh;
          background: #0a0a0a;
          color: white;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .solutions-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: linear-gradient(135deg, rgba(153, 69, 255, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%);
          pointer-events: none;
        }

        .scrollable-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
          padding: 2rem 0 4rem;
        }

        /* Custom Scrollbar */
        .scrollable-content::-webkit-scrollbar {
          width: 10px;
        }

        .scrollable-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .scrollable-content::-webkit-scrollbar-thumb {
          background: rgba(153, 69, 255, 0.3);
          border-radius: 5px;
        }

        .scrollable-content::-webkit-scrollbar-thumb:hover {
          background: rgba(153, 69, 255, 0.5);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .title-icon {
          font-size: 2.5rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.6);
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
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 0.95rem;
        }

        .category-tab:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-2px);
        }

        .category-tab.active {
          background: linear-gradient(135deg, rgba(153, 69, 255, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%);
          border-color: rgba(153, 69, 255, 0.5);
          color: white;
          box-shadow: 0 4px 16px rgba(153, 69, 255, 0.2);
        }

        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .cta-section {
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(153, 69, 255, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%);
          pointer-events: none;
        }

        .cta-section h3 {
          font-size: 1.5rem;
          color: white;
          margin-bottom: 0.5rem;
          position: relative;
        }

        .cta-section p {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 2rem;
          position: relative;
        }

        .btn-primary {
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(153, 69, 255, 0.3);
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1.5rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .solutions-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .category-tabs {
            gap: 0.5rem;
          }

          .category-tab {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
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
      whileHover={{ y: -4 }}
    >
      {solution.popular && (
        <div className="popular-badge">
          <span className="badge-icon">⭐</span>
          <span>Популярно</span>
        </div>
      )}
      
      <div className="solution-header">
        <h3>{solution.name}</h3>
        <div className="solution-price">{solution.price}</div>
      </div>

      <div className="solution-timeline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Срок: {solution.timeline}</span>
      </div>

      {/* Метрики производительности */}
      {solution.metrics && (
        <div className="solution-metrics">
          {Object.entries(solution.metrics).map(([key, value]) => (
            <div key={key} className="metric-item">
              <span className="metric-value">{value}</span>
              <span className="metric-label">{key}</span>
            </div>
          ))}
        </div>
      )}

      <div className="solution-features">
        {solution.features.map((feature, i) => (
          <div key={i} className="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <motion.button 
        className="solution-btn"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Узнать подробнее</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      <style jsx>{`
        .solution-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.75rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .solution-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .popular-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .badge-icon {
          font-size: 0.875rem;
        }

        .solution-header {
          margin-bottom: 1rem;
        }

        .solution-header h3 {
          color: white;
          font-size: 1.375rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .solution-price {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .solution-timeline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .solution-timeline svg {
          opacity: 0.6;
        }

        .solution-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .metric-item {
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 1.125rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }

        .solution-features {
          margin-bottom: 2rem;
          flex: 1;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .feature-item svg {
          color: #10b981;
          flex-shrink: 0;
        }

        .solution-btn {
          width: 100%;
          padding: 0.875rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .solution-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(153, 69, 255, 0.5);
          box-shadow: 0 0 16px rgba(153, 69, 255, 0.2);
        }

        .solution-btn svg {
          transition: transform 0.3s ease;
        }

        .solution-btn:hover svg {
          transform: translateX(4px);
        }
      `}</style>
    </motion.div>
  );
}