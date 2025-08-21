/**
 * UI smoke-тесты
 * Проверка интерфейса и взаимодействий
 */

export const uiTests = [
  {
    id: 'business_showcase_smoke',
    name: 'Smoke-тест витрины услуг',
    priority: 'high',
    timeout: 6000,
    steps: [
      { action: 'findShowcase', expected: 'exists' },
      { action: 'checkSegmentSelector', expected: 'interactive' },
      { action: 'selectBusinessType', expected: 'updates' },
      { action: 'checkPackageCards', expected: 'visible' }
    ]
  },
  {
    id: 'faq_smoke',
    name: 'Smoke-тест FAQ системы',
    priority: 'medium',
    timeout: 5000,
    steps: [
      { action: 'findFAQ', expected: 'exists' },
      { action: 'checkSearchFunction', expected: 'works' },
      { action: 'expandQuestion', expected: 'shows_answer' },
      { action: 'checkCategories', expected: 'filter_works' }
    ]
  },
  {
    id: 'forms_smoke',
    name: 'Smoke-тест форм',
    priority: 'high',
    timeout: 5000,
    steps: [
      { action: 'findForms', expected: 'exists' },
      { action: 'checkValidation', expected: 'works' },
      { action: 'testSubmission', expected: 'processed' },
      { action: 'checkFeedback', expected: 'shown' }
    ]
  },
  {
    id: 'voice_feedback_smoke',
    name: 'Smoke-тест голосовой связи',
    priority: 'low',
    timeout: 8000,
    steps: [
      { action: 'findVoiceModule', expected: 'exists' },
      { action: 'checkMicPermission', expected: 'requestable' },
      { action: 'testRecordingInterface', expected: 'responsive' },
      { action: 'checkPlayback', expected: 'available' }
    ]
  }
];