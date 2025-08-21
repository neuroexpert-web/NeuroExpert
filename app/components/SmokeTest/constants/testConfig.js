/**
 * Конфигурация smoke-тестов
 */

// Основная конфигурация
export const TEST_CONFIG = {
  // Общие настройки
  maxConcurrentTests: 3,
  retryFailedTests: true,
  maxRetries: 2,
  screenshotOnFailure: true,
  
  // Таймауты
  defaultTimeout: 5000,
  pageLoadTimeout: 10000,
  elementWaitTimeout: 3000,
  networkTimeout: 15000,
  
  // Производительность
  minAcceptableFPS: 30,
  maxPageLoadTime: 5000,
  maxElementRenderTime: 1000,
  
  // Отчеты
  generateReport: true,
  reportFormat: 'html', // 'html', 'json', 'console'
  reportPath: './test-reports/',
  
  // Уведомления
  notifyOnComplete: true,
  notifyOnFailure: true,
  slackWebhook: process.env.SLACK_WEBHOOK_URL || null
};

// Селекторы элементов
export const ELEMENT_SELECTORS = {
  // Основные элементы
  header: 'header',
  main: 'main',
  footer: 'footer',
  
  // Калькулятор
  calculator: '[data-testid="calculator"]',
  calculatorInputs: '[data-testid="calculator-input"]',
  calculatorResult: '[data-testid="calculator-result"]',
  
  // AI Assistant
  aiAssistant: '[data-testid="ai-assistant"]',
  aiInput: '[data-testid="ai-input"]',
  aiMessages: '[data-testid="ai-messages"]',
  
  // Формы
  forms: 'form',
  submitButton: 'button[type="submit"]',
  errorMessage: '.error-message',
  successMessage: '.success-message',
  
  // FAQ
  faqSection: '[data-testid="faq-section"]',
  faqSearch: '[data-testid="faq-search"]',
  faqItems: '.faq-item',
  
  // Мобильные элементы
  mobileMenu: '[data-testid="mobile-menu"]',
  mobileMenuToggle: '[data-testid="menu-toggle"]'
};

// Тестовые данные
export const TEST_DATA = {
  // Калькулятор
  calculatorInputs: {
    revenue: 1000000,
    employees: 50,
    hours: 160
  },
  
  // AI Assistant
  testMessages: [
    'Привет, как работает калькулятор ROI?',
    'Какие услуги вы предоставляете?',
    'Помогите выбрать подходящий пакет'
  ],
  
  // Формы
  formData: {
    name: 'Тест Пользователь',
    email: 'test@example.com',
    phone: '+7 (999) 123-45-67',
    message: 'Тестовое сообщение для проверки формы'
  }
};

// Ожидаемые значения
export const EXPECTED_VALUES = {
  pageTitle: 'NeuroExpert',
  minLoadTime: 100,
  maxLoadTime: 5000,
  minFPS: 30,
  maxFPS: 120,
  aiResponseTime: 10000,
  formSubmitTime: 3000
};