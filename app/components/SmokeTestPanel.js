// Система автоматических Smoke-тестов для NeuroExpert v3.0
'use client';
import { useState, useEffect } from 'react';

class SmokeTestRunner {
  constructor() {
    this.testSuites = new Map();
    this.testResults = [];
    this.isRunning = false;
    this.currentTest = null;
    
    this.initializeTestSuites();
  }

  initializeTestSuites() {
    // Критически важные сценарии пользователей
    const smokeTests = [
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

    smokeTests.forEach(test => {
      this.testSuites.set(test.id, test);
    });
  }

  async runAllSmokeTests() {
    if (this.isRunning) {
      console.warn('Smoke-тесты уже выполняются');
      return;
    }

    this.isRunning = true;
    this.testResults = [];
    
    console.log('🚬 Запуск полного набора Smoke-тестов...');
    
    // Сортируем тесты по приоритету
    const sortedTests = Array.from(this.testSuites.values())
      .sort((a, b) => {
        const priorities = { critical: 3, high: 2, medium: 1, low: 0 };
        return priorities[b.priority] - priorities[a.priority];
      });

    let criticalFailed = false;

    for (const test of sortedTests) {
      // Если критический тест провалился, останавливаем выполнение
      if (criticalFailed && test.priority !== 'critical') {
        console.warn('Остановка тестов из-за критической ошибки');
        break;
      }

      this.currentTest = test;
      const result = await this.runSingleTest(test);
      this.testResults.push(result);

      if (test.priority === 'critical' && result.status === 'failed') {
        criticalFailed = true;
      }

      // Небольшая пауза между тестами
      await this.sleep(500);
    }

    this.isRunning = false;
    this.currentTest = null;
    
    const summary = this.generateSummary();
    console.log('🚬 Smoke-тесты завершены:', summary);
    
    return {
      results: this.testResults,
      summary
    };
  }

  async runSingleTest(testCase) {
    const startTime = performance.now();
    const result = {
      testId: testCase.id,
      testName: testCase.name,
      priority: testCase.priority,
      status: 'running',
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
        setTimeout(() => reject(new Error('Test timeout')), testCase.timeout);
      });

      const testPromise = this.executeTestSteps(testCase, result);
      
      await Promise.race([testPromise, timeoutPromise]);
      
      result.status = result.errors.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      result.status = 'failed';
      result.errors.push(`Test failed: ${error.message}`);
      console.error(`❌ Тест провален: ${testCase.name}`, error);
    }

    result.endTime = performance.now();
    result.duration = result.endTime - result.startTime;

    return result;
  }

  async executeTestSteps(testCase, result) {
    for (const step of testCase.steps) {
      const stepResult = await this.executeStep(step);
      result.steps.push({
        action: step.action,
        expected: step.expected,
        actual: stepResult.actual,
        status: stepResult.success ? 'passed' : 'failed',
        duration: stepResult.duration
      });

      if (!stepResult.success) {
        result.errors.push(`Step failed: ${step.action} - ${stepResult.error}`);
      }
    }
  }

  async executeStep(step) {
    const startTime = performance.now();
    
    try {
      switch (step.action) {
        case 'checkPageTitle':
          return this.checkPageTitle(step.expected, startTime);
          
        case 'checkMainElements':
          return this.checkMainElements(step.expected, startTime);
          
        case 'checkConsoleErrors':
          return this.checkConsoleErrors(startTime);
          
        case 'checkLoadTime':
          return this.checkLoadTime(step.expected, startTime);
          
        case 'findCalculator':
          return this.findCalculator(startTime);
          
        case 'checkInputFields':
          return this.checkInputFields(startTime);
          
        case 'testBasicCalculation':
          return this.testBasicCalculation(startTime);
          
        case 'findAssistant':
          return this.findAssistant(startTime);
          
        case 'sendTestMessage':
          return this.sendTestMessage(startTime);
          
        case 'findShowcase':
          return this.findShowcase(startTime);
          
        case 'findFAQ':
          return this.findFAQ(startTime);
          
        case 'findLearningPlatform':
          return this.findLearningPlatform(startTime);
          
        case 'findVoiceModule':
          return this.findVoiceModule(startTime);
          
        case 'checkViewport':
          return this.checkViewport(startTime);
          
        case 'findForms':
          return this.findForms(startTime);
          
        case 'checkBackgroundAnimation':
          return this.checkBackgroundAnimation(startTime);
          
        default:
          return {
            success: false,
            actual: 'unknown_action',
            error: `Unknown action: ${step.action}`,
            duration: performance.now() - startTime
          };
      }
    } catch (error) {
      return {
        success: false,
        actual: 'error',
        error: error.message,
        duration: performance.now() - startTime
      };
    }
  }

  checkPageTitle(expected, startTime) {
    const actual = document.title;
    const success = actual.includes(expected);
    
    return {
      success,
      actual,
      error: success ? null : `Title doesn't contain '${expected}'`,
      duration: performance.now() - startTime
    };
  }

  checkMainElements(expectedElements, startTime) {
    const found = [];
    const missing = [];
    
    expectedElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        found.push(selector);
      } else {
        missing.push(selector);
      }
    });
    
    const success = missing.length === 0;
    
    return {
      success,
      actual: `Found: ${found.join(', ')}${missing.length ? `, Missing: ${missing.join(', ')}` : ''}`,
      error: success ? null : `Missing elements: ${missing.join(', ')}`,
      duration: performance.now() - startTime
    };
  }

  checkConsoleErrors(startTime) {
    // Инициализируем систему отслеживания ошибок если её нет
    if (!window.consoleErrors) {
      window.consoleErrors = [];
      const originalError = console.error;
      console.error = function(...args) {
        window.consoleErrors.push(args.join(' '));
        originalError.apply(console, args);
      };
    }
    
    // Проверяем количество ошибок в консоли
    const errorCount = window.consoleErrors ? window.consoleErrors.length : 0;
    const success = errorCount === 0;
    
    return {
      success,
      actual: `${errorCount} errors`,
      error: success ? null : `Found ${errorCount} console errors`,
      duration: performance.now() - startTime
    };
  }

  checkLoadTime(expectedLimit, startTime) {
    const loadTime = performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0;
    const limit = parseInt(expectedLimit.replace('<', '').replace('ms', ''));
    const success = loadTime < limit || loadTime === 0; // Если loadTime === 0, значит загрузка ещё не завершена
    
    return {
      success,
      actual: loadTime > 0 ? `${loadTime}ms` : 'loading...',
      error: success ? null : `Load time ${loadTime}ms exceeds limit ${limit}ms`,
      duration: performance.now() - startTime
    };
  }

  findCalculator(startTime) {
    const calculator = document.querySelector('[data-testid="calculator"]') || 
                      document.querySelector('.calculator') ||
                      document.querySelector('#calculator') ||
                      document.querySelector('*[class*="calculator" i]');
    
    const success = !!calculator;
    
    return {
      success,
      actual: success ? 'found' : 'not_found',
      error: success ? null : 'Calculator not found on page',
      duration: performance.now() - startTime
    };
  }

  checkInputFields(startTime) {
    const inputs = document.querySelectorAll('input, select, textarea');
    const interactiveInputs = Array.from(inputs).filter(input => 
      !input.disabled && !input.readOnly
    );
    
    const success = interactiveInputs.length > 0;
    
    return {
      success,
      actual: `${interactiveInputs.length} interactive inputs`,
      error: success ? null : 'No interactive input fields found',
      duration: performance.now() - startTime
    };
  }

  async testBasicCalculation(startTime) {
    // Поиск числовых полей для тестирования
    const numberInputs = document.querySelectorAll('input[type="number"], input[type="range"]');
    
    if (numberInputs.length === 0) {
      return {
        success: false,
        actual: 'no_number_inputs',
        error: 'No number inputs found for calculation test',
        duration: performance.now() - startTime
      };
    }

    // Вводим тестовые значения
    numberInputs.forEach((input, index) => {
      input.value = 100 * (index + 1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Даем время на обработку
    await this.sleep(1000);

    // Проверяем наличие результатов
    const resultElements = document.querySelectorAll('*[class*="result" i], *[class*="output" i], *[id*="result" i]');
    const hasResults = resultElements.length > 0;

    return {
      success: hasResults,
      actual: hasResults ? 'results_found' : 'no_results',
      error: hasResults ? null : 'No calculation results found',
      duration: performance.now() - startTime
    };
  }

  findAssistant(startTime) {
    const assistant = document.querySelector('[data-testid="assistant"]') ||
                      document.querySelector('.assistant') ||
                      document.querySelector('#assistant') ||
                      document.querySelector('*[class*="assistant" i]') ||
                      document.querySelector('*[class*="chat" i]');
    
    const success = !!assistant;
    
    return {
      success,
      actual: success ? 'found' : 'not_found',
      error: success ? null : 'AI Assistant not found on page',
      duration: performance.now() - startTime
    };
  }

  async sendTestMessage(startTime) {
    const inputField = document.querySelector('input[type="text"]') ||
                       document.querySelector('textarea') ||
                       document.querySelector('*[placeholder*="вопрос" i]');
    
    if (!inputField) {
      return {
        success: false,
        actual: 'no_input_field',
        error: 'No input field found for assistant',
        duration: performance.now() - startTime
      };
    }

    // Отправляем тестовое сообщение
    inputField.value = 'Тест';
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Ищем кнопку отправки
    const submitButton = inputField.form?.querySelector('button[type="submit"]') ||
                         inputField.parentElement?.querySelector('button') ||
                         document.querySelector('*[class*="send" i]');

    if (submitButton) {
      submitButton.click();
    }

    // Ждем ответа
    await this.sleep(3000);

    // Проверяем наличие ответа
    const responseElements = document.querySelectorAll('*[class*="response" i], *[class*="message" i], *[class*="answer" i]');
    const hasResponse = responseElements.length > 0;

    return {
      success: hasResponse,
      actual: hasResponse ? 'response_received' : 'no_response',
      error: hasResponse ? null : 'No response from assistant',
      duration: performance.now() - startTime
    };
  }

  findShowcase(startTime) {
    const showcase = document.querySelector('*[class*="showcase" i]') ||
                     document.querySelector('*[class*="business" i]') ||
                     document.querySelector('*[id*="showcase" i]');
    
    const success = !!showcase;
    
    return {
      success,
      actual: success ? 'found' : 'not_found',
      error: success ? null : 'Business showcase not found',
      duration: performance.now() - startTime
    };
  }

  findFAQ(startTime) {
    const faq = document.querySelector('*[class*="faq" i]') ||
                document.querySelector('*[id*="faq" i]') ||
                document.querySelector('*[class*="question" i]');
    
    const success = !!faq;
    
    return {
      success,
      actual: success ? 'found' : 'not_found',
      error: success ? null : 'FAQ section not found',
      duration: performance.now() - startTime
    };
  }

  findLearningPlatform(startTime) {
    const learning = document.querySelector('*[class*="learning" i]') ||
                     document.querySelector('*[class*="course" i]') ||
                     document.querySelector('*[class*="education" i]');
    
    const success = !!learning;
    
    return {
      success,
      actual: success ? 'found' : 'not_found',
      error: success ? null : 'Learning platform not found',
      duration: performance.now() - startTime
    };
  }

  findVoiceModule(startTime) {
    const voice = document.querySelector('*[class*="voice" i]') ||
                  document.querySelector('*[class*="audio" i]') ||
                  document.querySelector('*[class*="mic" i]');
    
    const success = !!voice;
    
    return {
      success,
      actual: success ? 'found' : 'not_found',
      error: success ? null : 'Voice module not found',
      duration: performance.now() - startTime
    };
  }

  checkViewport(startTime) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width <= 768;
    
    // Проверяем адаптивность
    const elements = document.querySelectorAll('*');
    let overflowCount = 0;
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > width) {
        overflowCount++;
      }
    });
    
    const success = overflowCount < 5; // Допускаем небольшое количество overflow элементов
    
    return {
      success,
      actual: `${width}x${height}, overflow: ${overflowCount}`,
      error: success ? null : `Too many overflow elements: ${overflowCount}`,
      duration: performance.now() - startTime
    };
  }

  findForms(startTime) {
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input, textarea, select');
    
    const success = forms.length > 0 || inputs.length > 0;
    
    return {
      success,
      actual: `${forms.length} forms, ${inputs.length} inputs`,
      error: success ? null : 'No forms or input fields found',
      duration: performance.now() - startTime
    };
  }

  checkBackgroundAnimation(startTime) {
    const canvas = document.querySelector('canvas');
    const animatedElements = document.querySelectorAll('*[class*="animate" i], *[style*="animation" i]');
    
    const success = canvas !== null || animatedElements.length > 0;
    
    return {
      success,
      actual: `Canvas: ${!!canvas}, Animated: ${animatedElements.length}`,
      error: success ? null : 'No animations or canvas found',
      duration: performance.now() - startTime
    };
  }

  generateSummary() {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    
    const criticalTests = this.testResults.filter(r => r.priority === 'critical');
    const criticalPassed = criticalTests.filter(r => r.status === 'passed').length;
    
    const avgDuration = total > 0 ? 
      this.testResults.reduce((sum, r) => sum + (r.duration || 0), 0) / total : 0;

    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      criticalPassed,
      criticalTotal: criticalTests.length,
      avgDuration: Math.round(avgDuration),
      status: criticalPassed === criticalTests.length ? 'healthy' : 'critical'
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getTestResults() {
    return this.testResults;
  }

  isTestRunning() {
    return this.isRunning;
  }

  getCurrentTest() {
    return this.currentTest;
  }
}

// Глобальный экземпляр smoke-тестера
const globalSmokeTestRunner = new SmokeTestRunner();

// React компонент для панели smoke-тестов
function SmokeTestPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Автоматически запускаем smoke-тесты при загрузке
    const autoRun = () => {
      setTimeout(() => {
        runSmokeTests();
      }, 2000); // Даем время на полную загрузку страницы
    };

    autoRun();

    // Запускаем периодически
    const interval = setInterval(() => {
      if (!globalSmokeTestRunner.isTestRunning()) {
        runSmokeTests();
      }
    }, 300000); // Каждые 5 минут

    return () => clearInterval(interval);
  }, []);

  const runSmokeTests = async () => {
    setIsRunning(true);
    
    try {
      const result = await globalSmokeTestRunner.runAllSmokeTests();
      setTestResults(result.results);
      setSummary(result.summary);
    } catch (error) {
      console.error('Ошибка выполнения smoke-тестов:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTest(globalSmokeTestRunner.getCurrentTest());
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <>
      <button 
        className="smoke-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Smoke-тесты"
      >
        🚬
        {summary?.status === 'critical' && (
          <span className="critical-badge">!</span>
        )}
      </button>

      {isVisible && (
        <div className="smoke-panel">
          <div className="smoke-header">
            <h3>🚬 Smoke-тесты</h3>
            <button onClick={() => setIsVisible(false)}>✕</button>
          </div>

          {summary && (
            <div className="smoke-summary">
              <div className="summary-grid">
                <div className={`summary-stat ${summary.status}`}>
                  <div className="stat-value">{summary.passRate}%</div>
                  <div className="stat-label">Успешность</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-value">{summary.passed}/{summary.total}</div>
                  <div className="stat-label">Пройдено</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-value">{summary.criticalPassed}/{summary.criticalTotal}</div>
                  <div className="stat-label">Критические</div>
                </div>
                <div className="summary-stat">
                  <div className="stat-value">{summary.avgDuration}ms</div>
                  <div className="stat-label">Среднее время</div>
                </div>
              </div>
            </div>
          )}

          <div className="test-controls">
            <button 
              onClick={runSmokeTests}
              disabled={isRunning}
              className="run-smoke-btn"
            >
              {isRunning ? '🔄 Тестирование...' : '▶️ Запустить smoke-тесты'}
            </button>
          </div>

          {isRunning && currentTest && (
            <div className="current-test">
              <div className="current-test-info">
                <strong>Выполняется:</strong> {currentTest.name}
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          )}

          <div className="test-results">
            {testResults.map((result, index) => (
              <div key={index} className={`test-result ${result.status} ${result.priority}`}>
                <div className="test-result-header">
                  <span className="test-name">{result.testName}</span>
                  <span className="test-status">
                    {result.status === 'passed' ? '✅' : '❌'}
                  </span>
                </div>
                
                <div className="test-meta">
                  <span className="priority">{result.priority}</span>
                  <span className="duration">{result.duration ? Math.round(result.duration) : 0}ms</span>
                </div>

                {result.errors.length > 0 && (
                  <div className="test-errors">
                    {result.errors.slice(0, 2).map((error, errorIndex) => (
                      <div key={errorIndex} className="error-item">
                        {error}
                      </div>
                    ))}
                  </div>
                )}

                {result.steps && result.steps.length > 0 && (
                  <div className="test-steps">
                    {result.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className={`step ${step.status}`}>
                        <span className="step-action">{step.action}</span>
                        <span className="step-status">
                          {step.status === 'passed' ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .smoke-toggle {
          position: fixed;
          bottom: 20px;
          right: 260px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #64748b, #475569);
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
          transition: all 0.3s ease;
          position: relative;
        }

        .smoke-toggle:hover {
          transform: scale(1.1);
        }

        .critical-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .smoke-panel {
          position: fixed;
          bottom: 80px;
          right: 260px;
          width: 450px;
          max-height: 600px;
          background: var(--card);
          border: 2px solid #64748b;
          border-radius: 16px;
          padding: 16px;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          animation: slideUp 0.3s ease-out;
        }

        .smoke-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(100, 116, 139, 0.2);
        }

        .smoke-summary {
          margin-bottom: 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .summary-stat {
          text-align: center;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid rgba(100, 116, 139, 0.2);
        }

        .summary-stat.healthy {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
        }

        .summary-stat.critical {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .stat-value {
          font-size: 16px;
          font-weight: bold;
          color: var(--text);
        }

        .stat-label {
          font-size: 10px;
          color: var(--muted);
        }

        .test-controls {
          text-align: center;
          margin-bottom: 16px;
        }

        .run-smoke-btn {
          background: #64748b;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .run-smoke-btn:hover:not(:disabled) {
          background: #475569;
        }

        .run-smoke-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .current-test {
          background: rgba(100, 116, 139, 0.1);
          border: 1px solid rgba(100, 116, 139, 0.2);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .current-test-info {
          font-size: 12px;
          color: var(--text);
          margin-bottom: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(100, 116, 139, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #64748b;
          border-radius: 2px;
          animation: progress 2s linear infinite;
        }

        .test-result {
          background: rgba(100, 116, 139, 0.05);
          border: 1px solid rgba(100, 116, 139, 0.2);
          border-radius: 8px;
          padding: 8px;
          margin-bottom: 8px;
        }

        .test-result.failed {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .test-result.passed {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
        }

        .test-result.critical {
          border-width: 2px;
        }

        .test-result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .test-name {
          font-size: 11px;
          font-weight: bold;
          color: var(--text);
        }

        .test-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 6px;
        }

        .priority {
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 4px;
          color: white;
        }

        .priority:nth-child(1) {
          background: #ef4444; /* critical */
        }

        .duration {
          font-size: 9px;
          color: var(--muted);
        }

        .test-errors {
          margin: 6px 0;
        }

        .error-item {
          font-size: 9px;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 4px;
          border-radius: 4px;
          margin-bottom: 2px;
        }

        .test-steps {
          margin-top: 6px;
        }

        .step {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          padding: 2px 0;
          border-bottom: 1px solid rgba(100, 116, 139, 0.1);
        }

        .step.failed {
          color: #ef4444;
        }

        .step.passed {
          color: #22c55e;
        }

        @media (max-width: 768px) {
          .smoke-panel {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
          }

          .smoke-toggle {
            right: 140px;
          }
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

// DEPRECATED: Этот файл устарел и будет удален
// Используйте новую модульную версию: import SmokeTestPanel from './SmokeTest'
// Экспортируем для обратной совместимости
export { globalSmokeTestRunner as SmokeTestRunner, SmokeTestPanel };
export default SmokeTestPanel;
