// Система мобильного тестирования для NeuroExpert v3.0
'use client';
import { useState, useEffect } from 'react';

class MobileTester {
  constructor() {
    this.deviceProfiles = new Map();
    this.touchEvents = [];
    this.performanceData = {};
    this.testResults = [];

    this.initializeDeviceProfiles();
    this.startMobileMonitoring();
  }

  initializeDeviceProfiles() {
    const profiles = [
      {
        id: 'iphone_se',
        name: 'iPhone SE',
        viewport: { width: 375, height: 667 },
        dpr: 2,
        userAgent: 'iPhone',
        touchSupport: true,
        category: 'small_mobile',
      },
      {
        id: 'iphone_12',
        name: 'iPhone 12',
        viewport: { width: 390, height: 844 },
        dpr: 3,
        userAgent: 'iPhone',
        touchSupport: true,
        category: 'mobile',
      },
      {
        id: 'pixel_6',
        name: 'Google Pixel 6',
        viewport: { width: 393, height: 851 },
        dpr: 2.75,
        userAgent: 'Android',
        touchSupport: true,
        category: 'mobile',
      },
      {
        id: 'ipad',
        name: 'iPad',
        viewport: { width: 768, height: 1024 },
        dpr: 2,
        userAgent: 'iPad',
        touchSupport: true,
        category: 'tablet',
      },
      {
        id: 'galaxy_tab',
        name: 'Samsung Galaxy Tab',
        viewport: { width: 800, height: 1280 },
        dpr: 2,
        userAgent: 'Android',
        touchSupport: true,
        category: 'tablet',
      },
    ];

    profiles.forEach((profile) => {
      this.deviceProfiles.set(profile.id, profile);
    });
  }

  startMobileMonitoring() {
    this.detectDeviceCapabilities();
    this.monitorTouchEvents();
    this.trackScrollPerformance();
    this.checkResponsiveBreakpoints();
  }

  detectDeviceCapabilities() {
    // Проверяем, что мы в браузере
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        touchSupport: false,
        devicePixelRatio: 1,
        viewport: { width: 1920, height: 1080 },
        orientation: 'unknown',
        userAgent: 'Server',
        memory: 'unknown',
        connection: 'unknown',
        battery: false,
        deviceCategory: 'desktop',
      };
    }

    const capabilities = {
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      devicePixelRatio: window.devicePixelRatio || 1,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      orientation:
        typeof screen !== 'undefined' && screen.orientation ? screen.orientation.type : 'unknown',
      userAgent: navigator.userAgent,
      memory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection?.effectiveType || 'unknown',
      battery: 'getBattery' in navigator,
    };

    // Определяем тип устройства
    if (capabilities.viewport.width <= 480) {
      capabilities.deviceCategory = 'small_mobile';
    } else if (capabilities.viewport.width <= 768) {
      capabilities.deviceCategory = 'mobile';
    } else if (capabilities.viewport.width <= 1024) {
      capabilities.deviceCategory = 'tablet';
    } else {
      capabilities.deviceCategory = 'desktop';
    }

    this.performanceData.capabilities = capabilities;
    console.log('📱 Device capabilities detected:', capabilities);
  }

  monitorTouchEvents() {
    if (!('ontouchstart' in window)) return;

    const touchMetrics = {
      touchStartCount: 0,
      touchMoveCount: 0,
      touchEndCount: 0,
      gestureData: [],
      responseTime: [],
    };

    ['touchstart', 'touchmove', 'touchend'].forEach((eventType) => {
      document.addEventListener(
        eventType,
        (event) => {
          const timestamp = performance.now();

          touchMetrics[eventType.replace('touch', 'touch') + 'Count']++;

          if (eventType === 'touchstart') {
            this.touchStartTime = timestamp;
          }

          if (eventType === 'touchend' && this.touchStartTime) {
            const responseTime = timestamp - this.touchStartTime;
            touchMetrics.responseTime.push(responseTime);

            if (responseTime > 100) {
              console.warn(`Slow touch response: ${responseTime}ms`);
            }
          }

          // Записываем жесты
          if (event.touches && event.touches.length > 1) {
            touchMetrics.gestureData.push({
              type: 'multitouch',
              touchCount: event.touches.length,
              timestamp,
            });
          }
        },
        { passive: true }
      );
    });

    this.performanceData.touch = touchMetrics;
  }

  trackScrollPerformance() {
    const scrollMetrics = {
      scrollEvents: 0,
      jankyFrames: 0,
      scrollVelocity: [],
      lastScrollTime: 0,
    };

    window.addEventListener(
      'scroll',
      () => {
        const now = performance.now();
        scrollMetrics.scrollEvents++;

        if (scrollMetrics.lastScrollTime > 0) {
          const timeDiff = now - scrollMetrics.lastScrollTime;

          // Если между scroll событиями прошло больше 32ms (менее 30 FPS)
          if (timeDiff > 32) {
            scrollMetrics.jankyFrames++;
          }

          scrollMetrics.scrollVelocity.push(timeDiff);
        }

        scrollMetrics.lastScrollTime = now;
      },
      { passive: true }
    );

    this.performanceData.scroll = scrollMetrics;
  }

  checkResponsiveBreakpoints() {
    const breakpoints = [
      { name: 'small', min: 0, max: 575 },
      { name: 'medium', min: 576, max: 767 },
      { name: 'large', min: 768, max: 991 },
      { name: 'xlarge', min: 992, max: 1199 },
      { name: 'xxlarge', min: 1200, max: Infinity },
    ];

    const currentWidth = window.innerWidth;
    const activeBreakpoint = breakpoints.find(
      (bp) => currentWidth >= bp.min && currentWidth <= bp.max
    );

    this.performanceData.responsive = {
      currentBreakpoint: activeBreakpoint?.name || 'unknown',
      viewportWidth: currentWidth,
      viewportHeight: window.innerHeight,
      aspectRatio: (currentWidth / window.innerHeight).toFixed(2),
    };
  }

  async runMobileTests() {
    const testSuite = [
      this.testTouchInteractions,
      this.testScrolling,
      this.testViewportMeta,
      this.testResponsiveImages,
      this.testTextReadability,
      this.testButtonSizes,
      this.testFormUsability,
      this.testLoadingPerformance,
    ];

    const results = [];

    for (const test of testSuite) {
      try {
        const result = await test.call(this);
        results.push(result);
      } catch (error) {
        results.push({
          testName: test.name,
          status: 'error',
          error: error.message,
          timestamp: Date.now(),
        });
      }
    }

    this.testResults = results;
    return results;
  }

  async testTouchInteractions() {
    const issues = [];

    // Проверяем размеры тач-таргетов
    const clickableElements = document.querySelectorAll(
      'button, a, input[type="submit"], input[type="button"], [role="button"]'
    );

    clickableElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);

      if (size < 44) {
        // Минимальный размер по Apple HIG
        issues.push(`Элемент ${index + 1} слишком маленький для касания: ${size}px`);
      }

      // Проверяем расстояние между элементами
      const siblings = element.parentElement?.children || [];
      Array.from(siblings).forEach((sibling) => {
        if (sibling !== element && sibling.tagName === element.tagName) {
          const siblingRect = sibling.getBoundingClientRect();
          const distance = Math.sqrt(
            Math.pow(rect.left - siblingRect.left, 2) + Math.pow(rect.top - siblingRect.top, 2)
          );

          if (distance < 8) {
            issues.push(`Элементы слишком близко: ${distance}px`);
          }
        }
      });
    });

    return {
      testName: 'testTouchInteractions',
      status: issues.length === 0 ? 'passed' : 'failed',
      issues,
      elementsChecked: clickableElements.length,
      timestamp: Date.now(),
    };
  }

  async testScrolling() {
    const issues = [];

    // Проверяем overflow элементы
    const elements = document.querySelectorAll('*');
    let horizontalOverflow = 0;

    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      if (rect.width > window.innerWidth && style.overflow !== 'hidden') {
        horizontalOverflow++;
      }
    });

    if (horizontalOverflow > 0) {
      issues.push(`Найдено ${horizontalOverflow} элементов с горизонтальным overflow`);
    }

    // Тестируем плавность скролла
    const scrollMetrics = this.performanceData.scroll;
    if (scrollMetrics && scrollMetrics.jankyFrames > scrollMetrics.scrollEvents * 0.1) {
      issues.push(
        `Прерывистый скролл: ${scrollMetrics.jankyFrames} из ${scrollMetrics.scrollEvents} событий`
      );
    }

    return {
      testName: 'testScrolling',
      status: issues.length === 0 ? 'passed' : 'failed',
      issues,
      horizontalOverflow,
      timestamp: Date.now(),
    };
  }

  async testViewportMeta() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const issues = [];

    if (!viewportMeta) {
      issues.push('Отсутствует meta viewport');
    } else {
      const content = viewportMeta.getAttribute('content') || '';

      if (!content.includes('width=device-width')) {
        issues.push('viewport meta не содержит width=device-width');
      }

      if (!content.includes('initial-scale=1')) {
        issues.push('viewport meta не содержит initial-scale=1');
      }

      if (content.includes('user-scalable=no')) {
        issues.push('Запрещено масштабирование (проблема доступности)');
      }
    }

    return {
      testName: 'testViewportMeta',
      status: issues.length === 0 ? 'passed' : 'failed',
      issues,
      viewport: viewportMeta ? viewportMeta.getAttribute('content') : null,
      timestamp: Date.now(),
    };
  }

  async testResponsiveImages() {
    const images = document.querySelectorAll('img');
    const issues = [];
    let adaptiveImages = 0;

    images.forEach((img, index) => {
      const hasSourceSet = img.hasAttribute('srcset');
      const hasSizes = img.hasAttribute('sizes');

      if (hasSourceSet || hasSizes) {
        adaptiveImages++;
      }

      const rect = img.getBoundingClientRect();
      if (rect.width > window.innerWidth) {
        issues.push(`Изображение ${index + 1} превышает ширину экрана`);
      }
    });

    const adaptivePercent = images.length > 0 ? (adaptiveImages / images.length) * 100 : 100;

    return {
      testName: 'testResponsiveImages',
      status: adaptivePercent > 50 ? 'passed' : 'warning',
      issues,
      totalImages: images.length,
      adaptiveImages,
      adaptivePercent: Math.round(adaptivePercent),
      timestamp: Date.now(),
    };
  }

  async testTextReadability() {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    const issues = [];
    let readableTexts = 0;

    textElements.forEach((element, index) => {
      const style = window.getComputedStyle(element);
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;

      if (fontSize < 16) {
        issues.push(`Текст ${index + 1} слишком мелкий: ${fontSize}px`);
      } else {
        readableTexts++;
      }

      if (lineHeight < fontSize * 1.2) {
        issues.push(`Текст ${index + 1} имеет слишком малую высоту строки`);
      }
    });

    const readabilityPercent =
      textElements.length > 0 ? (readableTexts / textElements.length) * 100 : 100;

    return {
      testName: 'testTextReadability',
      status: readabilityPercent > 80 ? 'passed' : 'failed',
      issues,
      totalElements: textElements.length,
      readableElements: readableTexts,
      readabilityPercent: Math.round(readabilityPercent),
      timestamp: Date.now(),
    };
  }

  async testButtonSizes() {
    const buttons = document.querySelectorAll(
      'button, input[type="submit"], input[type="button"], [role="button"]'
    );
    const issues = [];
    let appropriateButtons = 0;

    buttons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      const minSize = Math.min(rect.width, rect.height);

      if (minSize >= 44) {
        appropriateButtons++;
      } else {
        issues.push(`Кнопка ${index + 1} слишком маленькая: ${minSize}px`);
      }
    });

    const compliance = buttons.length > 0 ? (appropriateButtons / buttons.length) * 100 : 100;

    return {
      testName: 'testButtonSizes',
      status: compliance > 90 ? 'passed' : 'failed',
      issues,
      totalButtons: buttons.length,
      appropriateButtons,
      compliance: Math.round(compliance),
      timestamp: Date.now(),
    };
  }

  async testFormUsability() {
    const forms = document.querySelectorAll('form');
    const issues = [];

    forms.forEach((form, formIndex) => {
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach((input, inputIndex) => {
        // Проверяем наличие labels
        const hasLabel = input.labels && input.labels.length > 0;
        const hasPlaceholder = input.hasAttribute('placeholder');

        if (!hasLabel && !hasPlaceholder) {
          issues.push(
            `Форма ${formIndex + 1}, поле ${inputIndex + 1}: нет подписи или placeholder`
          );
        }

        // Проверяем размер полей ввода
        const rect = input.getBoundingClientRect();
        if (rect.height < 44) {
          issues.push(
            `Форма ${formIndex + 1}, поле ${inputIndex + 1}: слишком маленькое поле ввода`
          );
        }

        // Проверяем тип input
        if (
          input.type === 'text' &&
          input.name &&
          (input.name.includes('email') || input.name.includes('mail'))
        ) {
          issues.push(`Форма ${formIndex + 1}, поле ${inputIndex + 1}: используйте type="email"`);
        }
      });
    });

    return {
      testName: 'testFormUsability',
      status: issues.length === 0 ? 'passed' : 'failed',
      issues,
      formsChecked: forms.length,
      timestamp: Date.now(),
    };
  }

  async testLoadingPerformance() {
    const issues = [];
    const metrics = this.performanceData.capabilities;

    // Проверяем время загрузки
    const loadTime = performance.timing?.loadEventEnd - performance.timing?.navigationStart;
    if (loadTime > 5000) {
      issues.push(`Медленная загрузка на мобильном: ${loadTime}ms`);
    }

    // Проверяем размер ресурсов
    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;
    let largeResources = 0;

    resources.forEach((resource) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize;
        if (resource.transferSize > 500000) {
          // 500KB
          largeResources++;
        }
      }
    });

    if (totalSize > 2000000) {
      // 2MB
      issues.push(`Большой размер страницы: ${Math.round(totalSize / 1024)}KB`);
    }

    if (largeResources > 5) {
      issues.push(`Много больших ресурсов: ${largeResources}`);
    }

    return {
      testName: 'testLoadingPerformance',
      status: issues.length === 0 ? 'passed' : 'warning',
      issues,
      loadTime,
      totalSize: Math.round(totalSize / 1024),
      largeResources,
      timestamp: Date.now(),
    };
  }

  simulateDevice(deviceId) {
    const device = this.deviceProfiles.get(deviceId);
    if (!device) return false;

    // Симулируем изменение viewport
    // Это работает только в некоторых инструментах разработчика
    try {
      if (window.chrome && window.chrome.runtime) {
        // Chrome DevTools API
        console.log(`📱 Симуляция устройства: ${device.name}`);
        console.log(`Viewport: ${device.viewport.width}x${device.viewport.height}`);
        console.log(`DPR: ${device.dpr}`);
      }
    } catch (e) {
      console.warn('Симуляция устройства недоступна в браузере');
    }

    return device;
  }

  getMobileReport() {
    const summary = {
      deviceType: this.performanceData.capabilities?.deviceCategory || 'unknown',
      touchSupport: this.performanceData.capabilities?.touchSupport || false,
      viewport: this.performanceData.capabilities?.viewport || {},
      testResults: this.testResults,
      issues: this.testResults.reduce((acc, test) => acc.concat(test.issues || []), []),
      overallScore: this.calculateMobileScore(),
    };

    return summary;
  }

  calculateMobileScore() {
    if (this.testResults.length === 0) return 0;

    const passedTests = this.testResults.filter((test) => test.status === 'passed').length;
    const warningTests = this.testResults.filter((test) => test.status === 'warning').length;

    const score = ((passedTests + warningTests * 0.5) / this.testResults.length) * 100;
    return Math.round(score);
  }

  getDeviceProfiles() {
    return Array.from(this.deviceProfiles.values());
  }
}

// Глобальный экземпляр мобильного тестера
const globalMobileTester = new MobileTester();

// React компонент для мобильного тестирования
function MobileTestPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [mobileReport, setMobileReport] = useState(null);

  useEffect(() => {
    // Автоматически запускаем тесты при загрузке
    if (globalMobileTester.performanceData.capabilities?.deviceCategory !== 'desktop') {
      runMobileTests();
    }

    updateReport();
  }, []);

  const runMobileTests = async () => {
    setIsRunning(true);
    try {
      const results = await globalMobileTester.runMobileTests();
      setTestResults(results);
      updateReport();
    } catch (error) {
      console.error('Ошибка мобильного тестирования:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const updateReport = () => {
    const report = globalMobileTester.getMobileReport();
    setMobileReport(report);
  };

  const simulateDevice = (deviceId) => {
    const device = globalMobileTester.simulateDevice(deviceId);
    setSelectedDevice(device);
    // Перезапускаем тесты для нового устройства
    setTimeout(() => runMobileTests(), 500);
  };

  if (!mobileReport) return null;

  return (
    <>
      <button
        className="mobile-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Мобильное тестирование"
      >
        📱
        {mobileReport.issues.length > 0 && (
          <span className="issue-badge">{mobileReport.issues.length}</span>
        )}
      </button>

      {isVisible && (
        <div className="mobile-panel">
          <div className="mobile-header">
            <h3>📱 Мобильное тестирование</h3>
            <button onClick={() => setIsVisible(false)}>✕</button>
          </div>

          <div className="device-info">
            <div className="device-stat">
              <span className="label">Устройство:</span>
              <span className="value">{mobileReport.deviceType}</span>
            </div>
            <div className="device-stat">
              <span className="label">Viewport:</span>
              <span className="value">
                {mobileReport.viewport.width}×{mobileReport.viewport.height}
              </span>
            </div>
            <div className="device-stat">
              <span className="label">Touch:</span>
              <span className="value">{mobileReport.touchSupport ? '✅' : '❌'}</span>
            </div>
            <div className="device-stat">
              <span className="label">Оценка:</span>
              <span
                className={`score ${mobileReport.overallScore > 80 ? 'good' : mobileReport.overallScore > 60 ? 'ok' : 'bad'}`}
              >
                {mobileReport.overallScore}%
              </span>
            </div>
          </div>

          <div className="test-controls">
            <button onClick={runMobileTests} disabled={isRunning} className="run-tests-btn">
              {isRunning ? '🔄 Тестирование...' : '▶️ Запустить тесты'}
            </button>
          </div>

          <div className="device-simulator">
            <h4>Симуляция устройств:</h4>
            <div className="device-buttons">
              {globalMobileTester.getDeviceProfiles().map((device) => (
                <button
                  key={device.id}
                  onClick={() => simulateDevice(device.id)}
                  className={`device-btn ${selectedDevice?.id === device.id ? 'active' : ''}`}
                >
                  {device.name}
                </button>
              ))}
            </div>
          </div>

          <div className="test-results">
            <h4>Результаты тестов:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="test-result-item">
                <div className="test-header">
                  <span className="test-name">{result.testName}</span>
                  <span className={`test-status ${result.status}`}>
                    {result.status === 'passed' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'}
                  </span>
                </div>
                {result.issues && result.issues.length > 0 && (
                  <div className="test-issues">
                    {result.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="issue-item">
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
                {result.compliance && (
                  <div className="test-metrics">Соответствие: {result.compliance}%</div>
                )}
              </div>
            ))}
          </div>

          {mobileReport.issues.length > 0 && (
            <div className="critical-issues">
              <h4>🚨 Критические проблемы:</h4>
              {mobileReport.issues.slice(0, 5).map((issue, index) => (
                <div key={index} className="critical-issue">
                  {issue}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .mobile-toggle {
          position: fixed;
          bottom: 20px;
          right: 200px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
          transition: all 0.3s ease;
          position: relative;
        }

        .mobile-toggle:hover {
          transform: scale(1.1);
        }

        .issue-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #f59e0b;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-panel {
          position: fixed;
          bottom: 80px;
          right: 200px;
          width: 400px;
          max-height: 600px;
          background: var(--card);
          border: 2px solid #06b6d4;
          border-radius: 16px;
          padding: 16px;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.3s ease-out;
        }

        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(6, 182, 212, 0.2);
        }

        .device-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(6, 182, 212, 0.05);
          border-radius: 8px;
        }

        .device-stat {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .device-stat .label {
          color: var(--muted);
        }

        .device-stat .value {
          font-weight: bold;
          color: var(--text);
        }

        .score.good {
          color: #22c55e;
        }
        .score.ok {
          color: #f59e0b;
        }
        .score.bad {
          color: #ef4444;
        }

        .test-controls {
          text-align: center;
          margin-bottom: 16px;
        }

        .run-tests-btn {
          background: #06b6d4;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .run-tests-btn:hover:not(:disabled) {
          background: #0891b2;
        }

        .run-tests-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .device-simulator {
          margin-bottom: 16px;
        }

        .device-simulator h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: var(--text);
        }

        .device-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .device-btn {
          background: transparent;
          border: 1px solid #06b6d4;
          color: #06b6d4;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.3s ease;
        }

        .device-btn.active {
          background: #06b6d4;
          color: white;
        }

        .test-results h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          color: var(--text);
        }

        .test-result-item {
          background: rgba(6, 182, 212, 0.05);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 8px;
        }

        .test-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .test-name {
          font-size: 11px;
          color: var(--text);
          font-weight: bold;
        }

        .test-issues {
          margin: 4px 0;
        }

        .issue-item {
          font-size: 10px;
          color: var(--muted);
          margin-bottom: 2px;
          padding-left: 8px;
          border-left: 2px solid #f59e0b;
        }

        .test-metrics {
          font-size: 10px;
          color: var(--muted);
          text-align: right;
        }

        .critical-issues {
          margin-top: 16px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
        }

        .critical-issues h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #ef4444;
        }

        .critical-issue {
          font-size: 11px;
          color: #ef4444;
          margin-bottom: 4px;
          padding: 4px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .mobile-panel {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
          }

          .mobile-toggle {
            right: 80px;
          }
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

// Экспортируем для использования в других компонентах
export { globalMobileTester as MobileTester, MobileTestPanel };
export default MobileTestPanel;
