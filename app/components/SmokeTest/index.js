/**
 * Главный экспорт компонента SmokeTest
 */

export { default } from './SmokeTestPanel';
export { default as SmokeTestPanel } from './SmokeTestPanel';

// Экспорт core классов для возможности использования в других местах
export { SmokeTestRunner } from './core/SmokeTestRunner';
export { TestExecutor } from './core/TestExecutor';
export { TestValidator } from './core/TestValidator';
export { TestReporter } from './core/TestReporter';

// Экспорт констант
export * from './constants/testConstants';
export * from './constants/testConfig';

// Экспорт утилит
export { domUtils } from './utils/domUtils';
export { performanceUtils } from './utils/performanceUtils';
export { performanceMonitor } from './utils/performanceMonitor';