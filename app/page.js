'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import FuturisticHero from './components/FuturisticHero';
import styles from './page.module.css';
import PremiumGlassBackground from './components/PremiumGlassBackground';
import JourneySection from './components/JourneySection';
import WhyUsSection from './components/WhyUsSection';
import PricingSection from './components/PricingSection';

// Динамические импорты для оптимизации
const ROICalculator = dynamic(() => import('./components/ROICalculator'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка калькулятора ROI...</div>
});

const FuturisticAIChat = dynamic(() => import('./components/FuturisticAIChat'), {
  ssr: false,
  loading: () => null
});

const ContactForm = dynamic(() => import('./components/ContactForm'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка формы...</div>
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  ssr: false,
  loading: () => <div className="loader-container"><div className="loader"></div></div>
});

const AIDirectorCapabilities = dynamic(() => import('./components/AIDirectorCapabilities'), {
  ssr: false,
  loading: () => <div className="loader-container"><div className="loader"></div></div>
});

const AICursorEnhanced = dynamic(() => import('./components/AICursorEnhanced'), {
  ssr: false,
  loading: () => null
});

const PricingCalculator = dynamic(() => import('./components/PricingCalculator'), {
  ssr: false,
  loading: () => <div className="loader-container"><div className="loader"></div></div>
});

export default function Home() {
  return (
    <>
      <FuturisticHero />
      <main className={styles.main}>
        <AICursorEnhanced />
        <ROICalculator />
        <PricingCalculator />
        <FuturisticAIChat />
        <ContactForm />
        <AdminPanel />
        <AIDirectorCapabilities />
      </main>
    </>
  );
}