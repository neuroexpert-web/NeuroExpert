'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import AnimatedLogo from './components/AnimatedLogo';
import BusinessShowcase from './components/BusinessShowcase';
import ContactForm from './components/ContactForm';
import QuickActions from './components/QuickActions';
import ROICalculator from './components/ROICalculator.tsx';
import RealtimeStats from './components/RealtimeStats';
import SmartFAQ from './components/SmartFAQ';
import NeuralNetworkBackground from './components/NeuralNetworkBackground';
import NeuralParticles from './components/NeuralParticles';

// Heavy components loaded on demand
const SmartFloatingAI = dynamic(() => import('./components/SmartFloatingAI'), {
  ssr: false,
  loading: () => <div className="ai-loading-placeholder">AI загружается...</div>
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  ssr: false,
  loading: () => <div>Загрузка админ-панели...</div>
});

const LearningPlatform = dynamic(() => import('./components/LearningPlatform'), {
  ssr: false,
  loading: () => <div>Загрузка платформы обучения...</div>
});

const ContentAutomation = dynamic(() => import('./components/ContentAutomation'), {
  ssr: false,
  loading: () => <div>Загрузка автоматизации контента...</div>
});

const CRMAnalytics = dynamic(() => import('./components/CRMAnalytics'), {
  ssr: false,
  loading: () => <div>Загрузка CRM аналитики...</div>
});

const PersonalizationModule = dynamic(() => import('./components/PersonalizationModule'), {
  ssr: false,
  loading: () => <div>Загрузка персонализации...</div>
});

// Test panels - load only when needed
const SmokeTestPanel = dynamic(() => import('./components/SmokeTestPanel'), {
  ssr: false,
  loading: () => <div>Загрузка панели тестирования...</div>
});

const UXTestingPanel = dynamic(() => import('./components/UXTestingPanel'), {
  ssr: false,
  loading: () => <div>Загрузка UX тестов...</div>
});

const MobileTestPanel = dynamic(() => import('./components/MobileTestPanel'), {
  ssr: false,
  loading: () => <div>Загрузка мобильных тестов...</div>
});

const PerformancePanel = dynamic(() => import('./components/PerformancePanel'), {
  ssr: false,
  loading: () => <div>Загрузка панели производительности...</div>
});

const ErrorLogPanel = dynamic(() => import('./components/ErrorLogPanel'), {
  ssr: false,
  loading: () => <div>Загрузка логов ошибок...</div>
});

// Modal components
const ConfirmationModal = dynamic(() => import('./components/ConfirmationModal'), {
  ssr: false
});

const VoiceFeedbackModal = dynamic(() => import('./components/VoiceFeedbackModal'), {
  ssr: false
});

const OnboardingTour = dynamic(() => import('./components/OnboardingTour'), {
  ssr: false
});

export default function OptimizedHome() {
  const [activeSection, setActiveSection] = useState('main');
  const [showTestPanels, setShowTestPanels] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Server-side render only critical content
    return (
      <main className="main-container">
        <NeuralNetworkBackground />
        <AnimatedLogo />
        <BusinessShowcase />
        <ROICalculator />
        <ContactForm />
      </main>
    );
  }

  return (
    <main className="main-container">
      {/* Background effects */}
      <NeuralNetworkBackground />
      <NeuralParticles />
      
      {/* Core components - always loaded */}
      <AnimatedLogo />
      <BusinessShowcase />
      <QuickActions />
      <ROICalculator />
      <RealtimeStats />
      <SmartFAQ />
      <ContactForm />
      
      {/* AI Assistant - loaded dynamically */}
      <Suspense fallback={<div>Загрузка AI...</div>}>
        <SmartFloatingAI />
      </Suspense>
      
      {/* Advanced features - loaded on demand */}
      {showAdvancedFeatures && (
        <Suspense fallback={<div>Загрузка дополнительных функций...</div>}>
          <LearningPlatform />
          <ContentAutomation />
          <CRMAnalytics />
          <PersonalizationModule />
        </Suspense>
      )}
      
      {/* Test panels - loaded on demand */}
      {showTestPanels && (
        <Suspense fallback={<div>Загрузка панелей тестирования...</div>}>
          <div className="test-panels-container">
            <SmokeTestPanel />
            <UXTestingPanel />
            <MobileTestPanel />
            <PerformancePanel />
            <ErrorLogPanel />
          </div>
        </Suspense>
      )}
      
      {/* Admin panel - loaded on demand */}
      {activeSection === 'admin' && (
        <Suspense fallback={<div>Загрузка админ-панели...</div>}>
          <AdminPanel />
        </Suspense>
      )}
      
      {/* Modals - loaded when needed */}
      <Suspense fallback={null}>
        <ConfirmationModal />
        <VoiceFeedbackModal />
        <OnboardingTour />
      </Suspense>
      
      {/* Toggle buttons for advanced features */}
      <div className="feature-toggles">
        <button 
          onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
          className="toggle-button"
        >
          {showAdvancedFeatures ? 'Скрыть' : 'Показать'} расширенные функции
        </button>
        <button 
          onClick={() => setShowTestPanels(!showTestPanels)}
          className="toggle-button"
        >
          {showTestPanels ? 'Скрыть' : 'Показать'} панели тестирования
        </button>
      </div>
    </main>
  );
}