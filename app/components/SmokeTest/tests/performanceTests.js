/**
 * Performance smoke-тесты
 * Проверка производительности и оптимизации
 */

export const performanceTests = [
  {
    id: 'learning_platform_smoke',
    name: 'Smoke-тест обучающей платформы',
    priority: 'medium',
    timeout: 7000,
    steps: [
      { action: 'findLearningPlatform', expected: 'exists' },
      { action: 'checkCourseModules', expected: 'visible' },
      { action: 'startModule', expected: 'interactive' },
      { action: 'checkProgress', expected: 'tracked' }
    ]
  },
  {
    id: 'animations_smoke',
    name: 'Smoke-тест анимаций',
    priority: 'medium',
    timeout: 4000,
    steps: [
      { action: 'checkBackgroundAnimation', expected: 'running' },
      { action: 'measureFPS', expected: '>30fps' },
      { action: 'checkTransitions', expected: 'smooth' },
      { action: 'validateResponsiveness', expected: 'adaptive' }
    ]
  }
];