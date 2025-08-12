// Система UX/QA тестирования для NeuroExpert v3.0
'use client';
import { useState, useEffect } from 'react';

class UXTester {
  constructor() {
    this.testSuite = new Map();
    this.testResults = [];
    this.performanceMetrics = {};
    this.usabilityIssues = [];
    
    this.initializeTests();
  }

  initializeTests() {
    // Загружаем тест-кейсы
    this.loadTestCases();
    
    // Запускаем автоматические тесты
    this.startAutomaticTesting();
    
    // Мониторинг производительности
    this.startPerformanceMonitoring();
  }

  loadTestCases() {
    const testCases = [
      {
        id: 'homepage_load',
        name: 'Загрузка главной страницы',
        type: 'performance',
        category: 'Core',
        steps: [
          'Открыть главную страницу',
          'Проверить время загрузки < 3сек',
          'Проверить отображение всех компонентов'
        ],
        expectedResult: 'Страница загружается быстро, все элементы видны',
        criticalPath: true
      },
      {
        id: 'calculator_functionality',
        name: 'Работа калькулятора ROI',
        type: 'functional',
        category: 'Calculator',
        steps: [
          'Выбрать тип бизнеса',
          'Ввести сумму инвестиций',
          'Проверить расчет ROI',
          'Проверить отображение графика'
        ],
        expectedResult: 'Калькулятор корректно рассчитывает ROI',
        criticalPath: true
      },
      {
        id: 'ai_assistant_response',
        name: 'Ответы AI-помощника',
        type: 'functional',
        category: 'AI',
        steps: [
          'Ввести вопрос в AI-помощника',
          'Отправить запрос',
          'Проверить получение ответа',
          'Проверить качество ответа'
        ],
        expectedResult: 'AI отвечает релевантно и быстро',
        criticalPath: true
      },
      {
        id: 'voice_feedback',
        name: 'Голосовая обратная связь',
        type: 'functional',
        category: 'Voice',
        steps: [
          'Открыть модуль голосовой связи',
          'Начать запись голоса',
          'Остановить запись',
          'Отправить сообщение'
        ],
        expectedResult: 'Голосовое сообщение записывается и отправляется',
        criticalPath: false
      },
      {
        id: 'business_showcase',
        name: 'Витрина услуг',
        type: 'functional',
        category: 'Services',
        steps: [
          'Открыть витрину услуг',
          'Выбрать сегмент бизнеса',
          'Просмотреть пакеты услуг',
          'Открыть детали пакета'
        ],
        expectedResult: 'Витрина корректно отображает услуги по сегментам',
        criticalPath: true
      },
      {
        id: 'smart_faq',
        name: 'Smart-FAQ система',
        type: 'functional',
        category: 'FAQ',
        steps: [
          'Открыть FAQ',
          'Использовать поиск',
          'Фильтровать по категориям',
          'Открыть вопрос-ответ'
        ],
        expectedResult: 'FAQ работает с поиском и фильтрацией',
        criticalPath: true
      },
      {
        id: 'learning_platform',
        name: 'Обучающая платформа',
        type: 'functional',
        category: 'Learning',
        steps: [
          'Открыть обучающую платформу',
          'Выбрать модуль обучения',
          'Пройти тест',
          'Просмотреть результаты'
        ],
        expectedResult: 'Обучение работает с тестами и результатами',
        criticalPath: false
      },
      {
        id: 'personalization',
        name: 'Персонализация',
        type: 'functional',
        category: 'Personalization',
        steps: [
          'Взаимодействовать с сайтом',
          'Проверить появление рекомендаций',
          'Проверить адаптацию контента',
          'Проверить сохранение предпочтений'
        ],
        expectedResult: 'Система адаптируется под пользователя',
        criticalPath: false
      },
      {
        id: 'mobile_responsiveness',
        name: 'Мобильная адаптивность',
        type: 'responsive',
        category: 'Mobile',
        steps: [
          'Открыть сайт на мобильном',
          'Проверить все компоненты',
          'Тестировать touch-взаимодействие',
          'Проверить скорость загрузки'
        ],
        expectedResult: 'Все функции работают на мобильных устройствах',
        criticalPath: true
      },
      {
        id: 'animation_performance',
        name: 'Производительность анимаций',
        type: 'performance',
        category: 'Animations',
        steps: [
          'Проверить FPS анимаций',
          'Тестировать на слабых устройствах',
          'Проверить WebGL fallback',
          'Измерить потребление ресурсов'
        ],
        expectedResult: 'Анимации плавные, не тормозят интерфейс',
        criticalPath: false
      }
    ];

    testCases.forEach(testCase => {
      this.testSuite.set(testCase.id, testCase);
    });
  }

  startAutomaticTesting() {
    // Запускаем критически важные тесты
    const criticalTests = Array.from(this.testSuite.values())
      .filter(test => test.criticalPath);

    criticalTests.forEach(test => {
      this.runAutomaticTest(test);
    });
  }

  async runAutomaticTest(testCase) {
    const startTime = performance.now();
    let result = {
      testId: testCase.id,
      testName: testCase.name,
      category: testCase.category,
      status: 'running',
      startTime,
      endTime: null,
      duration: null,
      issues: [],
      screenshots: [],
      metrics: {}
    };

    try {
      switch (testCase.id) {
        case 'homepage_load':
          result = await this.testHomepageLoad(result);
          break;
        case 'calculator_functionality':
          result = await this.testCalculator(result);
          break;
        case 'ai_assistant_response':
          result = await this.testAIAssistant(result);
          break;
        case 'mobile_responsiveness':
          result = await this.testMobileResponsiveness(result);
          break;
        case 'animation_performance':
          result = await this.testAnimationPerformance(result);
          break;
        default:
          result.status = 'skipped';
          result.issues.push('Автотест не реализован');
      }
    } catch (error) {
      result.status = 'failed';
      result.issues.push(`Ошибка выполнения: ${error.message}`);
    }

    result.endTime = performance.now();
    result.duration = result.endTime - result.startTime;
    
    this.testResults.push(result);
    console.log(`🧪 Test completed: ${testCase.name}`, result);
  }

  async testHomepageLoad(result) {
    // Проверяем время загрузки
    const loadTime = performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0;
    result.metrics.loadTime = loadTime;

    if (loadTime > 3000 && loadTime > 0) {
      result.issues.push('Страница загружается медленнее 3 секунд');
    }

    // Проверяем наличие ключевых элементов
    const requiredElements = [
      'h1', // Заголовок
      'main', // Основной контент
      'canvas', // Анимированный фон
    ];

    requiredElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) {
        result.issues.push(`Элемент ${selector} не найден`);
      }
    });

    // Инициализируем систему отслеживания консольных ошибок если её нет
    if (!window.consoleErrors) {
      window.consoleErrors = [];
      const originalError = console.error;
      console.error = function(...args) {
        window.consoleErrors.push(args.join(' '));
        originalError.apply(console, args);
      };
    }

    // Проверяем консольные ошибки
    if (window.consoleErrors && window.consoleErrors.length > 0) {
      result.issues.push(`Найдены ошибки в консоли: ${window.consoleErrors.length}`);
    }

    result.status = result.issues.length === 0 ? 'passed' : 'failed';
    return result;
  }

  async testCalculator(result) {
    // Симуляция тестирования калькулятора
    const calculatorExists = document.querySelector('[data-testid="calculator"]') || 
                           document.querySelector('.calculator') ||
                           document.querySelector('#calculator');

    if (!calculatorExists) {
      result.issues.push('Калькулятор не найден на странице');
      result.status = 'failed';
      return result;
    }

    // Проверяем поля ввода
    const inputs = calculatorExists.querySelectorAll('input, select');
    if (inputs.length === 0) {
      result.issues.push('Не найдены поля ввода в калькуляторе');
    }

    result.status = result.issues.length === 0 ? 'passed' : 'failed';
    return result;
  }

  async testAIAssistant(result) {
    // Проверяем наличие AI-помощника
    const aiAssistant = document.querySelector('[data-testid="ai-assistant"]') ||
                       document.querySelector('.assistant') ||
                       document.querySelector('#assistant');

    if (!aiAssistant) {
      result.issues.push('AI-помощник не найден');
      result.status = 'failed';
      return result;
    }

    // Проверяем поле ввода для вопросов
    const inputField = aiAssistant.querySelector('input[type="text"], textarea');
    if (!inputField) {
      result.issues.push('Поле ввода для вопросов не найдено');
    }

    result.status = result.issues.length === 0 ? 'passed' : 'failed';
    return result;
  }

  async testMobileResponsiveness(result) {
    // Симуляция мобильного viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    result.metrics.viewport = viewport;

    // Проверяем критические размеры
    if (viewport.width < 768) {
      // Мобильный режим
      const elementsToCheck = document.querySelectorAll('*');
      let overflowCount = 0;

      elementsToCheck.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > viewport.width) {
          overflowCount++;
        }
      });

      if (overflowCount > 5) {
        result.issues.push(`Найдено ${overflowCount} элементов с горизонтальным переполнением`);
      }
    }

    result.status = result.issues.length === 0 ? 'passed' : 'failed';
    return result;
  }

  async testAnimationPerformance(result) {
    let frameCount = 0;
    let lastTime = performance.now();
    const frameTimes = [];

    // Мониторим FPS в течение 3 секунд
    const measureFPS = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      frameTimes.push(deltaTime);
      frameCount++;
      lastTime = currentTime;

      if (frameCount < 180) { // Примерно 3 секунды при 60 FPS
        requestAnimationFrame(measureFPS);
      } else {
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = 1000 / avgFrameTime;
        
        result.metrics.averageFPS = Math.round(fps);
        result.metrics.frameCount = frameCount;

        if (fps < 30) {
          result.issues.push(`Низкий FPS: ${Math.round(fps)}`);
        }

        result.status = result.issues.length === 0 ? 'passed' : 'failed';
      }
    };

    requestAnimationFrame(measureFPS);
    
    // Возвращаем промис, который разрешится через 3 секунды
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(result);
      }, 3000);
    });
  }

  startPerformanceMonitoring() {
    // Мониторинг производительности
    if ('PerformanceObserver' in window) {
      // Мониторим FCP, LCP, CLS
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint') {
            this.performanceMetrics[entry.name] = entry.startTime;
          }
          if (entry.entryType === 'largest-contentful-paint') {
            this.performanceMetrics.lcp = entry.startTime;
          }
          if (entry.entryType === 'layout-shift') {
            this.performanceMetrics.cls = (this.performanceMetrics.cls || 0) + entry.value;
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
      } catch (e) {
        console.warn('Performance observer not fully supported');
      }
    }

    // Мониторинг ошибок JavaScript
    window.addEventListener('error', (event) => {
      this.usabilityIssues.push({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        timestamp: Date.now()
      });
    });

    // Мониторинг сетевых ошибок
    window.addEventListener('unhandledrejection', (event) => {
      this.usabilityIssues.push({
        type: 'promise_rejection',
        message: event.reason,
        timestamp: Date.now()
      });
    });
  }

  runManualTest(testId) {
    const testCase = this.testSuite.get(testId);
    if (!testCase) return null;

    return {
      testCase,
      instructions: testCase.steps,
      expectedResult: testCase.expectedResult
    };
  }

  recordTestResult(testId, status, notes = '', issues = []) {
    const result = {
      testId,
      status, // 'passed', 'failed', 'skipped'
      notes,
      issues,
      timestamp: Date.now(),
      tester: 'manual'
    };

    this.testResults.push(result);
    this.saveTestResults();
  }

  saveTestResults() {
    localStorage.setItem('ux_test_results', JSON.stringify(this.testResults));
    localStorage.setItem('performance_metrics', JSON.stringify(this.performanceMetrics));
    localStorage.setItem('usability_issues', JSON.stringify(this.usabilityIssues));
  }

  loadTestResults() {
    const saved = localStorage.getItem('ux_test_results');
    if (saved) {
      this.testResults = JSON.parse(saved);
    }

    const savedMetrics = localStorage.getItem('performance_metrics');
    if (savedMetrics) {
      this.performanceMetrics = JSON.parse(savedMetrics);
    }

    const savedIssues = localStorage.getItem('usability_issues');
    if (savedIssues) {
      this.usabilityIssues = JSON.parse(savedIssues);
    }
  }

  getTestSummary() {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const skipped = this.testResults.filter(r => r.status === 'skipped').length;

    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      criticalIssues: this.usabilityIssues.filter(i => i.type === 'javascript_error').length,
      performanceScore: this.calculatePerformanceScore()
    };
  }

  calculatePerformanceScore() {
    let score = 100;

    // Штрафы за производительность
    if (this.performanceMetrics.lcp > 2500) score -= 20;
    if (this.performanceMetrics.cls > 0.1) score -= 15;
    if (this.performanceMetrics['first-contentful-paint'] > 1800) score -= 10;

    return Math.max(0, score);
  }

  getAllTests() {
    return Array.from(this.testSuite.values());
  }

  getTestById(testId) {
    return this.testSuite.get(testId);
  }
}

// Глобальный экземпляр тестера
const globalUXTester = new UXTester();

// React компонент для UX/QA панели
function UXTestingPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [testSummary, setTestSummary] = useState(null);
  const [allTests, setAllTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    globalUXTester.loadTestResults();
    updateData();
    
    const interval = setInterval(updateData, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateData = () => {
    setTestSummary(globalUXTester.getTestSummary());
    setAllTests(globalUXTester.getAllTests());
  };

  const runTest = (testId) => {
    const test = globalUXTester.runManualTest(testId);
    setSelectedTest(test);
  };

  const recordResult = (testId, status, notes, issues) => {
    globalUXTester.recordTestResult(testId, status, notes, issues);
    updateData();
    setSelectedTest(null);
  };

  if (!testSummary) return null;

  return (
    <>
      <button 
        className="ux-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="UX/QA Тестирование"
      >
        🧪
        {testSummary.failed > 0 && (
          <span className="error-badge">{testSummary.failed}</span>
        )}
      </button>

      {isVisible && (
        <div className="ux-panel">
          <div className="ux-header">
            <h3>🧪 UX/QA Тестирование</h3>
            <button onClick={() => setIsVisible(false)}>✕</button>
          </div>

          <div className="ux-tabs">
            <button 
              className={activeTab === 'summary' ? 'active' : ''}
              onClick={() => setActiveTab('summary')}
            >
              📊 Сводка
            </button>
            <button 
              className={activeTab === 'tests' ? 'active' : ''}
              onClick={() => setActiveTab('tests')}
            >
              🧪 Тесты
            </button>
            <button 
              className={activeTab === 'performance' ? 'active' : ''}
              onClick={() => setActiveTab('performance')}
            >
              ⚡ Производительность
            </button>
          </div>

          {activeTab === 'summary' && (
            <div className="summary-section">
              <div className="summary-stats">
                <div className="stat success">
                  <div className="stat-value">{testSummary.passed}</div>
                  <div className="stat-label">Пройдено</div>
                </div>
                <div className="stat error">
                  <div className="stat-value">{testSummary.failed}</div>
                  <div className="stat-label">Ошибки</div>
                </div>
                <div className="stat warning">
                  <div className="stat-value">{testSummary.passRate}%</div>
                  <div className="stat-label">Успешность</div>
                </div>
                <div className="stat info">
                  <div className="stat-value">{testSummary.performanceScore}</div>
                  <div className="stat-label">Производительность</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="tests-section">
              {allTests.map(test => {
                const result = globalUXTester.testResults.find(r => r.testId === test.id);
                return (
                  <div key={test.id} className="test-item">
                    <div className="test-info">
                      <h4>{test.name}</h4>
                      <span className="test-category">{test.category}</span>
                      {test.criticalPath && <span className="critical">Критический</span>}
                    </div>
                    <div className="test-actions">
                      {result && (
                        <span className={`status ${result.status}`}>
                          {result.status === 'passed' ? '✅' : 
                           result.status === 'failed' ? '❌' : '⏸️'}
                        </span>
                      )}
                      <button onClick={() => runTest(test.id)}>▶️</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedTest && (
            <div className="test-runner">
              <h4>🧪 {selectedTest.testCase.name}</h4>
              <div className="test-steps">
                <h5>Шаги:</h5>
                <ol>
                  {selectedTest.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="expected-result">
                <h5>Ожидаемый результат:</h5>
                <p>{selectedTest.expectedResult}</p>
              </div>
              <div className="test-result-form">
                <button 
                  onClick={() => recordResult(selectedTest.testCase.id, 'passed', '', [])}
                  className="pass-btn"
                >
                  ✅ Пройден
                </button>
                <button 
                  onClick={() => recordResult(selectedTest.testCase.id, 'failed', 'Тест провален', ['Обнаружены проблемы'])}
                  className="fail-btn"
                >
                  ❌ Провален
                </button>
                <button 
                  onClick={() => setSelectedTest(null)}
                  className="cancel-btn"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .ux-toggle {
          position: fixed;
          bottom: 20px;
          right: 140px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
          position: relative;
        }

        .ux-toggle:hover {
          transform: scale(1.1);
        }

        .error-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ux-panel {
          position: fixed;
          bottom: 80px;
          right: 140px;
          width: 400px;
          max-height: 600px;
          background: var(--card);
          border: 2px solid #8b5cf6;
          border-radius: 16px;
          padding: 16px;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          animation: slideUp 0.3s ease-out;
        }

        .ux-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }

        .ux-tabs {
          display: flex;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }

        .ux-tabs button {
          background: transparent;
          border: none;
          padding: 8px 12px;
          color: var(--muted);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .ux-tabs button.active {
          color: #8b5cf6;
          border-bottom-color: #8b5cf6;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .stat {
          text-align: center;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid;
        }

        .stat.success {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
        }

        .stat.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .stat.warning {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }

        .stat.info {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.05);
        }

        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: var(--text);
        }

        .stat-label {
          font-size: 10px;
          color: var(--muted);
        }

        .test-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .test-info h4 {
          margin: 0;
          font-size: 12px;
          color: var(--text);
        }

        .test-category {
          font-size: 10px;
          color: var(--muted);
        }

        .critical {
          background: #ef4444;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          margin-left: 8px;
        }

        .test-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .test-actions button {
          background: transparent;
          border: 1px solid #8b5cf6;
          color: #8b5cf6;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .test-runner {
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }

        .test-runner h4 {
          margin: 0 0 12px 0;
          color: var(--text);
        }

        .test-steps ol {
          margin: 8px 0;
          padding-left: 20px;
        }

        .test-steps li {
          font-size: 12px;
          color: var(--text);
          margin-bottom: 4px;
        }

        .expected-result p {
          font-size: 12px;
          color: var(--muted);
          font-style: italic;
        }

        .test-result-form {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .pass-btn {
          background: #22c55e !important;
          color: white !important;
          border: none !important;
        }

        .fail-btn {
          background: #ef4444 !important;
          color: white !important;
          border: none !important;
        }

        .cancel-btn {
          background: transparent !important;
          color: var(--muted) !important;
          border: 1px solid var(--muted) !important;
        }

        @media (max-width: 768px) {
          .ux-panel {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
          }
        }
      `}</style>
    </>
  );
}

// Экспортируем для использования в других компонентах
export { globalUXTester as UXTester, UXTestingPanel };
export default UXTestingPanel;
