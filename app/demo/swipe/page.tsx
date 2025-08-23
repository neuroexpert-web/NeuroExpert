'use client';

import SwipeNavigation from '../../components/SwipeNavigation';
import FuturisticHero from '../../components/FuturisticHero';
import ROICalculator from '../../components/ROICalculator';
import FuturisticCard from '../../components/FuturisticCard';
import styles from './page.module.css';

export default function SwipeDemoPage() {
  const sections = [
    {
      id: 'home',
      title: 'Главная',
      icon: '🏠',
      component: <FuturisticHero />
    },
    {
      id: 'analytics',
      title: 'Аналитика',
      icon: '📊',
      component: (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Аналитика в реальном времени</h2>
          <div className={styles.cardsGrid}>
            <FuturisticCard variant="holographic" title="Метрики" subtitle="Ключевые показатели">
              <p>Session Duration: <strong>+45%</strong></p>
              <p>Engagement Rate: <strong>78%</strong></p>
              <p>Conversion: <strong>12.5%</strong></p>
            </FuturisticCard>
            <FuturisticCard variant="neon" title="AI Insights" subtitle="Умная аналитика">
              <p>Прогноз роста: <strong>+300% ROI</strong></p>
              <p>Оптимизация: <strong>Автоматическая</strong></p>
            </FuturisticCard>
          </div>
        </div>
      )
    },
    {
      id: 'roi',
      title: 'ROI Калькулятор',
      icon: '💰',
      component: <ROICalculator />
    },
    {
      id: 'ai-director',
      title: 'AI Управляющий',
      icon: '🤖',
      component: (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>AI Управляющий директор</h2>
          <FuturisticCard variant="glass" glowColor="purple">
            <h3>Возможности AI директора:</h3>
            <ul className={styles.featureList}>
              <li>✨ Автоматическое принятие решений</li>
              <li>📈 Прогнозирование трендов</li>
              <li>🎯 Оптимизация процессов</li>
              <li>💡 Генерация инсайтов</li>
              <li>🔄 Непрерывное обучение</li>
            </ul>
          </FuturisticCard>
        </div>
      )
    },
    {
      id: 'solutions',
      title: 'Решения',
      icon: '💡',
      component: (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Готовые решения</h2>
          <div className={styles.solutionsGrid}>
            {['E-commerce', 'B2B Sales', 'Marketing', 'HR Tech'].map((solution) => (
              <FuturisticCard key={solution} variant="default" glowColor="green">
                <h4>{solution}</h4>
                <p>Комплексная автоматизация с AI</p>
              </FuturisticCard>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Безопасность',
      icon: '🔒',
      component: (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Безопасность и защита данных</h2>
          <FuturisticCard variant="neon" glowColor="blue">
            <div className={styles.securityFeatures}>
              <div>🛡️ Zero Trust Architecture</div>
              <div>🔐 End-to-End Encryption</div>
              <div>📋 GDPR Compliance</div>
              <div>🔍 24/7 Monitoring</div>
              <div>✅ ISO 27001 Certified</div>
            </div>
          </FuturisticCard>
        </div>
      )
    },
    {
      id: 'contacts',
      title: 'Контакты',
      icon: '📞',
      component: (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Свяжитесь с нами</h2>
          <FuturisticCard variant="glass">
            <div className={styles.contactInfo}>
              <p>📧 Email: hello@neuroexpert.ai</p>
              <p>📱 Telegram: @neuroexpert_bot</p>
              <p>🌐 Website: neuroexpert.ai</p>
              <p>📍 Москва, Россия</p>
            </div>
          </FuturisticCard>
        </div>
      )
    },
    {
      id: 'about',
      title: 'О нас',
      icon: 'ℹ️',
      component: (
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>О компании NeuroExpert</h2>
          <FuturisticCard variant="holographic">
            <p className={styles.aboutText}>
              NeuroExpert - лидер в области AI-трансформации бизнеса. 
              Мы помогаем компаниям достигать ROI 300%+ через внедрение 
              передовых технологий искусственного интеллекта.
            </p>
            <div className={styles.stats}>
              <div>
                <strong>500+</strong>
                <span>Клиентов</span>
              </div>
              <div>
                <strong>95%</strong>
                <span>Удовлетворенность</span>
              </div>
              <div>
                <strong>300%+</strong>
                <span>Средний ROI</span>
              </div>
            </div>
          </FuturisticCard>
        </div>
      )
    }
  ];

  const handleSectionChange = (index: number, section: any) => {
    console.log(`Navigated to section: ${section.title} (${index})`);
  };

  return (
    <div className={styles.demoPage}>
      <SwipeNavigation 
        sections={sections} 
        onSectionChange={handleSectionChange}
      />
    </div>
  );
}