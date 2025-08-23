'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import FuturisticHero from './components/FuturisticHero';
import styles from './page.module.css';

// Динамические импорты для оптимизации
const ROICalculator = dynamic(() => import('./components/ROICalculator'), {
  ssr: false,
  loading: () => <div className={styles.loadingSection}>Загрузка калькулятора ROI...</div>
});

const PricingCalculator = dynamic(() => import('./components/PricingCalculator'), {
  ssr: false,
  loading: () => <div className={styles.loadingSection}>Загрузка калькулятора цен...</div>
});

const FuturisticAIChat = dynamic(() => import('./components/FuturisticAIChat'), {
  ssr: false,
  loading: () => null
});

const AICursorEnhanced = dynamic(() => import('./components/AICursorEnhanced'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero секция */}
      <FuturisticHero />
      
      {/* Основной контент */}
      <main className={styles.main}>
        {/* ROI Калькулятор */}
        <section className={styles.section} id="roi-calculator">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              Рассчитайте вашу <span className={styles.accent}>выгоду</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Узнайте, сколько вы сэкономите с нашим AI решением
            </p>
            <Suspense fallback={<div className={styles.loadingSection}>Загрузка...</div>}>
              <ROICalculator />
            </Suspense>
          </div>
        </section>

        {/* Калькулятор цен */}
        <section className={styles.section} id="pricing">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              Прозрачное <span className={styles.accent}>ценообразование</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Автоматический расчет стоимости с учетом ваших параметров
            </p>
            <Suspense fallback={<div className={styles.loadingSection}>Загрузка...</div>}>
              <PricingCalculator />
            </Suspense>
          </div>
        </section>

        {/* CTA секция */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.ctaTitle}>
              Готовы начать цифровую трансформацию?
            </h2>
            <p className={styles.ctaSubtitle}>
              Получите персональную консультацию от наших экспертов
            </p>
            <div className={styles.ctaButtons}>
              <a href="/dashboard" className={styles.ctaButton}>
                📊 Посмотреть дашборд
              </a>
              <a href="/showcase" className={styles.ctaButtonSecondary}>
                🎨 Демо компонентов
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Плавающие компоненты */}
      <Suspense fallback={null}>
        <FuturisticAIChat />
      </Suspense>
      
      <Suspense fallback={null}>
        <AICursorEnhanced />
      </Suspense>
    </div>
  );
}