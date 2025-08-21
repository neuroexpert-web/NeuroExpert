/**
 * Критические smoke-тесты
 * Эти тесты должны всегда проходить для production
 */

export const criticalTests = [
  {
    id: 'page_load_critical',
    name: 'Критическая загрузка страницы',
    priority: 'critical',
    timeout: 10000,
    steps: [
      { action: 'checkPageTitle', expected: 'NeuroExpert' },
      { action: 'checkMainElements', expected: ['header', 'main', 'footer'] },
      { action: 'checkConsoleErrors', expected: 'noErrors' },
      { action: 'checkLoadTime', expected: '<5000ms' }
    ]
  },
  {
    id: 'calculator_smoke',
    name: 'Smoke-тест калькулятора',
    priority: 'critical',
    timeout: 8000,
    steps: [
      { action: 'findCalculator', expected: 'exists' },
      { action: 'checkInputFields', expected: 'interactive' },
      { action: 'testBasicCalculation', expected: 'numbers' },
      { action: 'checkResults', expected: 'displayed' }
    ]
  },
  {
    id: 'ai_assistant_smoke',
    name: 'Smoke-тест AI-помощника',
    priority: 'critical',
    timeout: 15000,
    steps: [
      { action: 'findAssistant', expected: 'exists' },
      { action: 'sendTestMessage', expected: 'response' },
      { action: 'checkResponseTime', expected: '<10s' },
      { action: 'validateResponse', expected: 'relevant' }
    ]
  },
  {
    id: 'mobile_responsive_smoke',
    name: 'Smoke-тест мобильной версии',
    priority: 'critical',
    timeout: 6000,
    steps: [
      { action: 'checkViewport', expected: 'responsive' },
      { action: 'testTouchElements', expected: 'touchable' },
      { action: 'checkScrolling', expected: 'smooth' },
      { action: 'validateMobileMenu', expected: 'functional' }
    ]
  }
];