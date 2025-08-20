'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Загружаем все компоненты динамически с отключенным SSR
const PremiumGlassBackground = dynamic(
  () => import('./components/PremiumGlassBackground'),
  { ssr: false }
);

const NeuroExpertHero = dynamic(
  () => import('./components/NeuroExpertHero'),
  { ssr: false }
);

const JourneySection = dynamic(
  () => import('./components/JourneySection'),
  { ssr: false }
);

const WhyUsSection = dynamic(
  () => import('./components/WhyUsSection'),
  { ssr: false }
);

const PricingSection = dynamic(
  () => import('./components/PricingSection'),
  { ssr: false }
);

const ROICalculator = dynamic(() => import('./components/ROICalculator'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка калькулятора ROI...</div>
});

const SmartFloatingAI = dynamic(() => import('./components/SmartFloatingAI'), {
  ssr: false,
  loading: () => <div className="ai-loading">AI управляющий загружается...</div>
});

const ContactForm = dynamic(() => import('./components/ContactForm'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка формы...</div>
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  ssr: false,
  loading: () => <div>Загрузка админ-панели...</div>
});

const AIDirectorCapabilities = dynamic(() => import('./components/AIDirectorCapabilities'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка AI директора...</div>
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Показываем заглушку пока клиент не готов
  if (!mounted) {
    return (
      <main className="premium-main" style={{ background: '#0a0e1a', minHeight: '100vh' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#fff'
        }}>
          <div>Загрузка...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="premium-main" style={{ background: 'var(--noir-900, #0a0e1a)', minHeight: '100vh' }}>
      {/* Фоновый компонент */}
      <Suspense fallback={null}>
        <PremiumGlassBackground />
      </Suspense>
      
      {/* Hero блок с анимацией нейросети */}
      <Suspense fallback={<div style={{ height: '100vh' }} />}>
        <NeuroExpertHero />
      </Suspense>
      
      {/* AI Управляющий директор */}
      <Suspense fallback={<div className="loading-skeleton">Загрузка...</div>}>
        <AIDirectorCapabilities />
      </Suspense>
      
      {/* Ваш простой путь к результату */}
      <Suspense fallback={null}>
        <JourneySection />
      </Suspense>
      
      {/* Почему мы */}
      <Suspense fallback={null}>
        <WhyUsSection />
      </Suspense>
      
      {/* Тарифы */}
      <Suspense fallback={null}>
        <PricingSection />
      </Suspense>

      {/* Калькулятор ROI */}
      <div id="calculator" className="premium-section">
        <div className="premium-container">
          <Suspense fallback={<div className="loading-skeleton">Загрузка калькулятора...</div>}>
            <ROICalculator />
          </Suspense>
        </div>
      </div>

      {/* Форма обратной связи */}
      <div id="contact" className="premium-section">
        <Suspense fallback={<div className="loading-skeleton">Загрузка формы...</div>}>
          <ContactForm />
        </Suspense>
      </div>

      {/* Админ панель */}
      <Suspense fallback={null}>
        <AdminPanel />
      </Suspense>

      {/* Плавающий AI ассистент */}
      <Suspense fallback={null}>
        <SmartFloatingAI />
      </Suspense>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="premium-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>NeuroExpert</h4>
              <p>AI-платформа для цифровизации бизнеса</p>
            </div>
            <div className="footer-section">
              <h4>Контакты</h4>
              <p>Email: ai@neuro.expert</p>
              <p>Telegram: @neuroexpert_ai</p>
            </div>
            <div className="footer-section">
              <h4>Ресурсы</h4>
              <p><a href="/privacy">Политика конфиденциальности</a></p>
              <p><a href="/terms">Условия использования</a></p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 NeuroExpert. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}