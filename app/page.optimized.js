'use client';

import { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Критические компоненты загружаем сразу
import AnimatedLogo from './components/AnimatedLogo';
import Header from './components/Header';
import HeroSection from './components/HeroSection';

// Lazy loading для тяжелых компонентов
const ROICalculator = dynamic(() => import('./components/ROICalculator'), {
  loading: () => <div className="skeleton-loader">Загрузка калькулятора...</div>,
  ssr: false
});

const SmartFloatingAI = dynamic(() => import('./components/SmartFloatingAI'), {
  loading: () => null,
  ssr: false
});

const ContactForm = dynamic(() => import('./components/ContactForm'), {
  loading: () => <div className="skeleton-loader">Загрузка формы...</div>
});

const TestimonialsCarousel = dynamic(() => import('./components/TestimonialsCarousel'), {
  loading: () => <div className="skeleton-loader">Загрузка отзывов...</div>
});

const ComparisonTable = dynamic(() => import('./components/ComparisonTable'));
const SmartFAQ = dynamic(() => import('./components/SmartFAQ'));
const Footer = dynamic(() => import('./components/Footer'));

// Оптимизированные lazy компоненты
const PremiumHero = lazy(() => import('./components/PremiumHero'));
const BenefitsShowcase = lazy(() => import('./components/BenefitsShowcase'));
const PersonalizationModule = lazy(() => import('./components/PersonalizationModule'));
const AIDirectorCapabilities = lazy(() => import('./components/AIDirectorCapabilities'));
const ConfirmationModal = lazy(() => import('./components/ConfirmationModal'));

export default function OptimizedHome() {
  return (
    <main className="min-h-screen">
      {/* Критический контент - загружается сразу */}
      <AnimatedLogo />
      <Header />
      <HeroSection />
      
      {/* Премиум секция с lazy loading */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <PremiumHero />
      </Suspense>
      
      {/* AI Управляющий платформы - загружается при прокрутке */}
      <Suspense fallback={<div className="skeleton-section" />}>
        <section id="ai-director" className="py-20 px-4 bg-slate-900/50">
          <AIDirectorCapabilities />
        </section>
      </Suspense>
      
      {/* ROI Калькулятор - dynamic import без SSR */}
      <section id="calculator" className="py-20 px-4">
        <ROICalculator />
      </section>
      
      {/* Преимущества */}
      <Suspense fallback={<div className="skeleton-section" />}>
        <BenefitsShowcase />
      </Suspense>
      
      {/* Персонализация */}
      <Suspense fallback={<div className="skeleton-section" />}>
        <PersonalizationModule />
      </Suspense>
      
      {/* Отзывы */}
      <section className="py-20 px-4 bg-slate-900/30">
        <TestimonialsCarousel />
      </section>
      
      {/* Сравнение */}
      <section className="py-20 px-4">
        <ComparisonTable />
      </section>
      
      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-slate-900/50">
        <SmartFAQ />
      </section>
      
      {/* Контактная форма */}
      <section id="contact" className="py-20 px-4">
        <ContactForm />
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Модальные окна */}
      <Suspense fallback={null}>
        <ConfirmationModal />
      </Suspense>
      
      {/* AI Ассистент - загружается только при использовании */}
      <SmartFloatingAI />
      
      <style jsx>{`
        .skeleton-loader {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          height: 200px;
          border-radius: 12px;
          margin: 20px 0;
        }
        
        .skeleton-section {
          min-height: 400px;
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </main>
  );
}