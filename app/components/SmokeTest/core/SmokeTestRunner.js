/**
 * Основной класс для запуска smoke-тестов
 */

import { TestExecutor } from './TestExecutor';
import { TestReporter } from './TestReporter';
import { criticalTests, uiTests, performanceTests } from '../tests';
import { TEST_STATUS, TEST_PRIORITY, TEST_CONFIG } from '../constants/testConstants';

export class SmokeTestRunner {
  constructor(config = {}) {
    this.config = { ...TEST_CONFIG, ...config };
    this.executor = new TestExecutor(this.config);
    this.reporter = new TestReporter(this.config);
    
    this.testSuites = new Map();
    this.testResults = [];
    this.isRunning = false;
    this.currentTest = null;
    
    this.initializeTestSuites();
  }

  initializeTestSuites() {
    // Загружаем все тестовые сценарии
    const allTests = [
      ...criticalTests,
      ...uiTests,
      ...performanceTests
    ];
    
    allTests.forEach(test => {
      this.testSuites.set(test.id, test);
    });
  }

  async runAllTests() {
    if (this.isRunning) {
      console.warn('Smoke-тесты уже выполняются');
      return null;
    }

    this.isRunning = true;
    this.testResults = [];
    
    console.log('🚬 Запуск полного набора Smoke-тестов...');
    
    // Сортируем тесты по приоритету
    const sortedTests = this.getSortedTests();
    let criticalFailed = false;

    for (const test of sortedTests) {
      // Останавливаем если критический тест провалился
      if (criticalFailed && test.priority !== TEST_PRIORITY.CRITICAL) {
        console.warn('Остановка тестов из-за критической ошибки');
        break;
      }

      this.currentTest = test;
      const result = await this.executor.runTest(test);
      this.testResults.push(result);

      if (test.priority === TEST_PRIORITY.CRITICAL && result.status === TEST_STATUS.FAILED) {
        criticalFailed = true;
      }

      // Пауза между тестами
      await this.sleep(500);
    }

    this.isRunning = false;
    this.currentTest = null;
    
    // Генерируем отчет
    const report = this.reporter.generateReport(this.testResults);
    console.log('🚬 Smoke-тесты завершены:', report.summary);
    
    return report;
  }

  async runTestById(testId) {
    const test = this.testSuites.get(testId);
    if (!test) {
      throw new Error(`Тест с ID "${testId}" не найден`);
    }
    
    return await this.executor.runTest(test);
  }

  async runTestsByPriority(priority) {
    const tests = Array.from(this.testSuites.values())
      .filter(test => test.priority === priority);
    
    const results = [];
    for (const test of tests) {
      const result = await this.executor.runTest(test);
      results.push(result);
    }
    
    return results;
  }

  getSortedTests() {
    const priorityOrder = {
      [TEST_PRIORITY.CRITICAL]: 3,
      [TEST_PRIORITY.HIGH]: 2,
      [TEST_PRIORITY.MEDIUM]: 1,
      [TEST_PRIORITY.LOW]: 0
    };
    
    return Array.from(this.testSuites.values())
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  getTestStatus() {
    return {
      isRunning: this.isRunning,
      currentTest: this.currentTest,
      totalTests: this.testSuites.size,
      completedTests: this.testResults.length
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}