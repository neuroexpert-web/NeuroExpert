/**
 * Класс для выполнения тестов
 */

import { TestValidator } from './TestValidator';
import { TEST_STATUS, ERROR_MESSAGES } from '../constants/testConstants';
import { performanceMonitor } from '../utils/performanceMonitor';

export class TestExecutor {
  constructor(config = {}) {
    this.config = config;
    this.validator = new TestValidator();
  }

  async runTest(testCase) {
    const startTime = performance.now();
    const result = {
      testId: testCase.id,
      testName: testCase.name,
      priority: testCase.priority,
      status: TEST_STATUS.RUNNING,
      startTime,
      endTime: null,
      duration: null,
      steps: [],
      errors: [],
      warnings: []
    };

    console.log(`🧪 Выполняется: ${testCase.name}`);

    try {
      // Устанавливаем таймаут для теста
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(ERROR_MESSAGES.TIMEOUT)), testCase.timeout);
      });

      const testPromise = this.executeTestSteps(testCase, result);
      
      await Promise.race([testPromise, timeoutPromise]);
      
      result.status = result.errors.length === 0 ? TEST_STATUS.PASSED : TEST_STATUS.FAILED;
      
      if (result.status === TEST_STATUS.PASSED) {
        console.log(`✅ Тест пройден: ${testCase.name}`);
      }
      
    } catch (error) {
      result.status = TEST_STATUS.FAILED;
      result.errors.push(error.message);
      console.error(`❌ Тест провален: ${testCase.name}`, error.message);
    }

    result.endTime = performance.now();
    result.duration = result.endTime - result.startTime;

    // Проверяем производительность
    if (this.config.monitorPerformance) {
      result.performance = await performanceMonitor.getMetrics();
    }

    return result;
  }

  async executeTestSteps(testCase, result) {
    for (const [index, step] of testCase.steps.entries()) {
      console.log(`  Шаг ${index + 1}/${testCase.steps.length}: ${step.action}`);
      
      const stepResult = await this.executeStep(step);
      
      result.steps.push({
        action: step.action,
        expected: step.expected,
        actual: stepResult.actual,
        status: stepResult.success ? TEST_STATUS.PASSED : TEST_STATUS.FAILED,
        duration: stepResult.duration,
        error: stepResult.error
      });

      if (!stepResult.success) {
        result.errors.push(`Шаг "${step.action}" провален: ${stepResult.error}`);
        
        // Если включен режим "fail fast", прекращаем выполнение
        if (this.config.failFast) {
          break;
        }
      }
    }
  }

  async executeStep(step) {
    const startTime = performance.now();
    
    try {
      // Валидируем шаг
      const validationResult = await this.validator.validateStep(step);
      
      const duration = performance.now() - startTime;
      
      return {
        success: validationResult.isValid,
        actual: validationResult.actual,
        error: validationResult.error,
        duration
      };
      
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        success: false,
        actual: null,
        error: error.message || ERROR_MESSAGES.UNEXPECTED_ERROR,
        duration
      };
    }
  }

  async retryTest(testCase, maxRetries = 2) {
    let lastResult = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Попытка ${attempt}/${maxRetries} для теста: ${testCase.name}`);
      
      lastResult = await this.runTest(testCase);
      
      if (lastResult.status === TEST_STATUS.PASSED) {
        lastResult.retryAttempt = attempt;
        return lastResult;
      }
      
      // Пауза перед следующей попыткой
      if (attempt < maxRetries) {
        await this.sleep(1000 * attempt); // Увеличиваем паузу с каждой попыткой
      }
    }
    
    lastResult.retriesExhausted = true;
    return lastResult;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}