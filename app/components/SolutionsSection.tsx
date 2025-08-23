'use client';

import { motion } from 'framer-motion';
import styles from './SolutionsSection.module.css';

const solutions = [
  {
    id: 1,
    title: 'AI Аналитика',
    description: 'Анализ данных в реальном времени с предиктивными моделями',
    icon: '📊',
    features: ['Прогнозирование трендов', 'Автоматические отчеты', 'Визуализация данных'],
    color: 'var(--primary)'
  },
  {
    id: 2,
    title: 'Автоматизация',
    description: 'Автоматизация рутинных задач и бизнес-процессов',
    icon: '⚡',
    features: ['Workflow автоматизация', 'Интеграция с CRM', 'Умные триггеры'],
    color: 'var(--accent)'
  },
  {
    id: 3,
    title: 'CRM Интеграция',
    description: 'Управление клиентами с AI-поддержкой',
    icon: '👥',
    features: ['360° профиль клиента', 'Автосегментация', 'Предиктивный скоринг'],
    color: 'var(--secondary)'
  },
  {
    id: 4,
    title: 'Отчетность',
    description: 'Автоматические отчеты и дашборды',
    icon: '📈',
    features: ['Real-time метрики', 'Кастомные дашборды', 'Экспорт в любой формат'],
    color: 'var(--info)'
  },
  {
    id: 5,
    title: 'Прогнозирование',
    description: 'AI прогнозы для вашего бизнеса',
    icon: '🔮',
    features: ['Прогноз продаж', 'Анализ рисков', 'Оптимизация запасов'],
    color: 'var(--warning)'
  },
  {
    id: 6,
    title: '24/7 Поддержка',
    description: 'Круглосуточная помощь AI и экспертов',
    icon: '🛟',
    features: ['AI-ассистент 24/7', 'Приоритетная поддержка', 'База знаний'],
    color: 'var(--success)'
  }
];

export default function SolutionsSection() {
  return (
    <section className={styles.solutionsSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>
            Готовые <span className={styles.gradient}>решения</span> для вашего бизнеса
          </h2>
          <p className={styles.subtitle}>
            Комплексные решения с гарантированным ROI 300%+
          </p>
        </motion.div>

        <div className={styles.solutionsGrid}>
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              className={styles.solutionCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              style={{ '--card-color': solution.color } as any}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>{solution.icon}</div>
                <h3 className={styles.cardTitle}>{solution.title}</h3>
                <p className={styles.cardDescription}>{solution.description}</p>
                <ul className={styles.featuresList}>
                  {solution.features.map((feature, i) => (
                    <li key={i} className={styles.feature}>
                      <span className={styles.featureIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={styles.cardButton}>
                  Подробнее
                  <span className={styles.buttonIcon}>→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}