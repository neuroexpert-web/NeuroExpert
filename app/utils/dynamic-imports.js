import dynamic from 'next/dynamic';

// Heavy monitoring and testing panels - load only when needed
export const AdminPanel = dynamic(() => import('../components/AdminPanel'), {
  loading: () => <div>Загрузка админ-панели...</div>,
  ssr: false
});

export const SmokeTestPanel = dynamic(() => import('../components/SmokeTestPanel'), {
  loading: () => <div>Загрузка панели тестирования...</div>,
  ssr: false
});

export const MobileTestPanel = dynamic(() => import('../components/MobileTestPanel'), {
  loading: () => <div>Загрузка мобильных тестов...</div>,
  ssr: false
});

export const UXTestingPanel = dynamic(() => import('../components/UXTestingPanel'), {
  loading: () => <div>Загрузка UX тестов...</div>,
  ssr: false
});

export const PerformancePanel = dynamic(() => import('../components/PerformancePanel'), {
  loading: () => <div>Загрузка панели производительности...</div>,
  ssr: false
});

export const ErrorLogPanel = dynamic(() => import('../components/ErrorLogPanel'), {
  loading: () => <div>Загрузка логов ошибок...</div>,
  ssr: false
});

// AI and interactive components
export const SmartFloatingAI = dynamic(() => import('../components/SmartFloatingAI'), {
  loading: () => <div className="ai-loading">AI загружается...</div>,
  ssr: false
});

export const LearningPlatform = dynamic(() => import('../components/LearningPlatform'), {
  loading: () => <div>Загрузка обучающей платформы...</div>,
  ssr: false
});

export const ContentAutomation = dynamic(() => import('../components/ContentAutomation'), {
  loading: () => <div>Загрузка автоматизации контента...</div>,
  ssr: false
});