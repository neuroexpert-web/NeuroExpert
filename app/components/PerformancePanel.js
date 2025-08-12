// Система мониторинга производительности для NeuroExpert v3.0
'use client';
import { useState, useEffect } from 'react';

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.isMonitoring = false;
    this.observations = [];
    this.alerts = [];
    
    this.initializeMonitoring();
  }

  initializeMonitoring() {
    this.setupPerformanceObservers();
    this.startResourceMonitoring();
    this.monitorMemoryUsage();
    this.trackUserInteractions();
  }

  setupPerformanceObservers() {
    if ('PerformanceObserver' in window) {
      // Observer для Web Vitals
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.processPerformanceEntry(entry);
          });
        });

        // Проверяем поддержку каждого типа отдельно
        const supportedTypes = [];
        const testTypes = ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input', 'navigation', 'resource'];
        
        testTypes.forEach(type => {
          try {
            const testObserver = new PerformanceObserver(() => {});
            testObserver.observe({ entryTypes: [type] });
            testObserver.disconnect();
            supportedTypes.push(type);
          } catch (e) {
            console.warn(`Performance observer type '${type}' not supported`);
          }
        });

        if (supportedTypes.length > 0) {
          observer.observe({ entryTypes: supportedTypes });
          this.performanceObserver = observer;
        }
      } catch (e) {
        console.warn('Performance Observer not fully supported:', e.message);
      }
    }
  }

  processPerformanceEntry(entry) {
    const timestamp = Date.now();

    switch (entry.entryType) {
      case 'paint':
        this.updateMetric(entry.name, entry.startTime, timestamp);
        break;
        
      case 'largest-contentful-paint':
        this.updateMetric('lcp', entry.startTime, timestamp);
        this.checkLCPAlert(entry.startTime);
        break;
        
      case 'layout-shift':
        const currentCLS = this.metrics.get('cls')?.value || 0;
        this.updateMetric('cls', currentCLS + entry.value, timestamp);
        this.checkCLSAlert(currentCLS + entry.value);
        break;
        
      case 'first-input':
        this.updateMetric('fid', entry.processingStart - entry.startTime, timestamp);
        this.checkFIDAlert(entry.processingStart - entry.startTime);
        break;
        
      case 'navigation':
        this.processNavigationTiming(entry, timestamp);
        break;
        
      case 'resource':
        this.processResourceTiming(entry, timestamp);
        break;
    }
  }

  updateMetric(name, value, timestamp) {
    this.metrics.set(name, {
      value,
      timestamp,
      history: [...(this.metrics.get(name)?.history || []), { value, timestamp }].slice(-50)
    });
  }

  checkLCPAlert(lcp) {
    if (lcp > 2500) {
      this.addAlert('LCP', `Медленная загрузка контента: ${Math.round(lcp)}ms`, 'warning');
    }
  }

  checkCLSAlert(cls) {
    if (cls > 0.1) {
      this.addAlert('CLS', `Высокая нестабильность макета: ${cls.toFixed(3)}`, 'warning');
    }
  }

  checkFIDAlert(fid) {
    if (fid > 100) {
      this.addAlert('FID', `Медленная реакция на ввод: ${Math.round(fid)}ms`, 'warning');
    }
  }

  processNavigationTiming(entry, timestamp) {
    const metrics = {
      'dns-lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'tcp-connect': entry.connectEnd - entry.connectStart,
      'request-response': entry.responseEnd - entry.requestStart,
      'dom-processing': entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      'load-complete': entry.loadEventEnd - entry.loadEventStart,
      'total-load': entry.loadEventEnd - entry.fetchStart
    };

    Object.entries(metrics).forEach(([name, value]) => {
      this.updateMetric(name, value, timestamp);
    });

    // Проверки производительности
    if (metrics['total-load'] > 5000) {
      this.addAlert('LOAD', `Медленная загрузка страницы: ${Math.round(metrics['total-load'])}ms`, 'error');
    }
  }

  processResourceTiming(entry, timestamp) {
    const size = entry.transferSize || entry.encodedBodySize || 0;
    const duration = entry.responseEnd - entry.startTime;

    // Категоризация ресурсов
    let category = 'other';
    if (entry.name.includes('.js')) category = 'javascript';
    else if (entry.name.includes('.css')) category = 'stylesheet';
    else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)/)) category = 'image';
    else if (entry.name.includes('.woff') || entry.name.includes('.ttf')) category = 'font';

    // Обновляем статистику ресурсов
    const resourceStats = this.metrics.get('resources') || { categories: {}, total: { count: 0, size: 0, duration: 0 } };
    
    if (!resourceStats.categories[category]) {
      resourceStats.categories[category] = { count: 0, size: 0, duration: 0 };
    }

    resourceStats.categories[category].count++;
    resourceStats.categories[category].size += size;
    resourceStats.categories[category].duration += duration;
    
    resourceStats.total.count++;
    resourceStats.total.size += size;
    resourceStats.total.duration += duration;

    this.updateMetric('resources', resourceStats, timestamp);

    // Проверки больших ресурсов
    if (size > 1000000) { // 1MB
      this.addAlert('RESOURCE', `Большой ресурс: ${entry.name} (${Math.round(size/1024)}KB)`, 'warning');
    }

    if (duration > 5000) { // 5 секунд
      this.addAlert('RESOURCE', `Медленный ресурс: ${entry.name} (${Math.round(duration)}ms)`, 'warning');
    }
  }

  startResourceMonitoring() {
    // Мониторинг использования ресурсов
    setInterval(() => {
      this.checkResourceUsage();
    }, 5000);
  }

  checkResourceUsage() {
    const timestamp = Date.now();

    // Память
    if ('memory' in performance) {
      const memory = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };

      this.updateMetric('memory', memory, timestamp);

      const memoryUsagePercent = (memory.used / memory.limit) * 100;
      if (memoryUsagePercent > 80) {
        this.addAlert('MEMORY', `Высокое использование памяти: ${memoryUsagePercent.toFixed(1)}%`, 'error');
      }
    }

    // FPS
    this.measureFPS();

    // DOM сложность
    this.checkDOMComplexity(timestamp);
  }

  measureFPS() {
    let frames = 0;
    let lastTime = performance.now();

    const measureFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.updateMetric('fps', fps, Date.now());
        
        if (fps < 30) {
          this.addAlert('FPS', `Низкий FPS: ${fps}`, 'warning');
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };

    if (!this.fpsMonitoring) {
      this.fpsMonitoring = true;
      requestAnimationFrame(measureFrame);
    }
  }

  checkDOMComplexity(timestamp) {
    const domStats = {
      totalElements: document.querySelectorAll('*').length,
      depth: this.calculateDOMDepth(),
      scripts: document.scripts.length,
      stylesheets: document.styleSheets.length
    };

    this.updateMetric('dom-complexity', domStats, timestamp);

    if (domStats.totalElements > 3000) {
      this.addAlert('DOM', `Сложный DOM: ${domStats.totalElements} элементов`, 'warning');
    }

    if (domStats.depth > 15) {
      this.addAlert('DOM', `Глубокая вложенность DOM: ${domStats.depth} уровней`, 'warning');
    }
  }

  calculateDOMDepth() {
    let maxDepth = 0;
    
    const traverse = (element, depth) => {
      maxDepth = Math.max(maxDepth, depth);
      for (let child of element.children) {
        traverse(child, depth + 1);
      }
    };
    
    traverse(document.documentElement, 0);
    return maxDepth;
  }

  monitorMemoryUsage() {
    // Мониторинг утечек памяти
    setInterval(() => {
      this.checkMemoryLeaks();
    }, 30000);
  }

  checkMemoryLeaks() {
    if ('memory' in performance) {
      const currentMemory = performance.memory.usedJSHeapSize;
      const memoryHistory = this.metrics.get('memory')?.history || [];
      
      if (memoryHistory.length > 10) {
        const recentMemory = memoryHistory.slice(-10);
        const isIncreasing = recentMemory.every((entry, index) => 
          index === 0 || entry.value.used >= recentMemory[index - 1].value.used
        );
        
        if (isIncreasing) {
          const increase = recentMemory[recentMemory.length - 1].value.used - recentMemory[0].value.used;
          if (increase > 50000000) { // 50MB
            this.addAlert('LEAK', `Возможная утечка памяти: +${Math.round(increase/1024/1024)}MB`, 'error');
          }
        }
      }
    }
  }

  trackUserInteractions() {
    // Отслеживание задержек в пользовательских взаимодействиях
    ['click', 'keydown', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        const startTime = performance.now();
        
        setTimeout(() => {
          const responseTime = performance.now() - startTime;
          
          if (responseTime > 16) { // Больше одного кадра при 60fps
            this.addAlert('INTERACTION', `Медленная реакция на ${eventType}: ${Math.round(responseTime)}ms`, 'info');
          }
        }, 0);
      }, { passive: true });
    });
  }

  addAlert(type, message, severity) {
    const alert = {
      id: Date.now() + Math.random(),
      type,
      message,
      severity,
      timestamp: Date.now()
    };

    this.alerts.unshift(alert);
    this.alerts = this.alerts.slice(0, 100); // Ограничиваем историю

    console.warn(`[Performance Alert] ${type}: ${message}`);
  }

  getMetrics() {
    const metrics = {};
    this.metrics.forEach((value, key) => {
      metrics[key] = value;
    });
    return metrics;
  }

  getWebVitals() {
    return {
      fcp: this.metrics.get('first-contentful-paint')?.value || null,
      lcp: this.metrics.get('lcp')?.value || null,
      cls: this.metrics.get('cls')?.value || null,
      fid: this.metrics.get('fid')?.value || null,
      ttfb: this.metrics.get('request-response')?.value || null
    };
  }

  getPerformanceScore() {
    const vitals = this.getWebVitals();
    let score = 100;

    // Штрафы за Web Vitals
    if (vitals.lcp > 2500) score -= 20;
    else if (vitals.lcp > 1200) score -= 10;

    if (vitals.fid > 100) score -= 20;
    else if (vitals.fid > 50) score -= 10;

    if (vitals.cls > 0.25) score -= 20;
    else if (vitals.cls > 0.1) score -= 10;

    if (vitals.fcp > 3000) score -= 10;
    else if (vitals.fcp > 1800) score -= 5;

    // Штрафы за ресурсы и производительность
    const fps = this.metrics.get('fps')?.value || 60;
    if (fps < 30) score -= 15;
    else if (fps < 45) score -= 10;

    const totalLoad = this.metrics.get('total-load')?.value || 0;
    if (totalLoad > 5000) score -= 15;
    else if (totalLoad > 3000) score -= 10;

    return Math.max(0, Math.round(score));
  }

  getAlerts() {
    return this.alerts;
  }

  clearAlerts() {
    this.alerts = [];
  }

  generateReport() {
    const vitals = this.getWebVitals();
    const score = this.getPerformanceScore();
    const resources = this.metrics.get('resources')?.value || { total: { count: 0, size: 0 } };
    const memory = this.metrics.get('memory')?.value || { used: 0, limit: 0 };
    
    return {
      score,
      vitals,
      resources: {
        totalCount: resources.total.count,
        totalSize: Math.round(resources.total.size / 1024), // KB
        categories: resources.categories || {}
      },
      memory: {
        used: Math.round(memory.used / 1024 / 1024), // MB
        percent: memory.limit ? Math.round((memory.used / memory.limit) * 100) : 0
      },
      alerts: this.alerts.length,
      criticalAlerts: this.alerts.filter(a => a.severity === 'error').length,
      timestamp: Date.now()
    };
  }
}

// Глобальный экземпляр монитора производительности
const globalPerformanceMonitor = new PerformanceMonitor();

// React компонент для панели производительности
function PerformancePanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const updateData = () => {
      setMetrics(globalPerformanceMonitor.getMetrics());
      setAlerts(globalPerformanceMonitor.getAlerts());
      setReport(globalPerformanceMonitor.generateReport());
    };

    updateData();
    const interval = setInterval(updateData, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const clearAlerts = () => {
    globalPerformanceMonitor.clearAlerts();
    setAlerts([]);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  if (!report) return null;

  return (
    <>
      <button 
        className="performance-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Мониторинг производительности"
      >
        ⚡
        {report.criticalAlerts > 0 && (
          <span className="alert-badge">{report.criticalAlerts}</span>
        )}
      </button>

      {isVisible && (
        <div className="performance-panel">
          <div className="performance-header">
            <h3>⚡ Производительность</h3>
            <button onClick={() => setIsVisible(false)}>✕</button>
          </div>

          <div className="performance-score">
            <div className="score-circle" style={{color: getScoreColor(report.score)}}>
              <span className="score-value">{report.score}</span>
              <span className="score-label">Оценка</span>
            </div>
          </div>

          <div className="vitals-grid">
            <div className="vital-metric">
              <span className="metric-label">LCP</span>
              <span className={`metric-value ${report.vitals.lcp > 2500 ? 'poor' : report.vitals.lcp > 1200 ? 'needs-improvement' : 'good'}`}>
                {report.vitals.lcp ? Math.round(report.vitals.lcp) + 'ms' : '-'}
              </span>
            </div>
            <div className="vital-metric">
              <span className="metric-label">FID</span>
              <span className={`metric-value ${report.vitals.fid > 100 ? 'poor' : report.vitals.fid > 50 ? 'needs-improvement' : 'good'}`}>
                {report.vitals.fid ? Math.round(report.vitals.fid) + 'ms' : '-'}
              </span>
            </div>
            <div className="vital-metric">
              <span className="metric-label">CLS</span>
              <span className={`metric-value ${report.vitals.cls > 0.25 ? 'poor' : report.vitals.cls > 0.1 ? 'needs-improvement' : 'good'}`}>
                {report.vitals.cls ? report.vitals.cls.toFixed(3) : '-'}
              </span>
            </div>
            <div className="vital-metric">
              <span className="metric-label">FCP</span>
              <span className={`metric-value ${report.vitals.fcp > 3000 ? 'poor' : report.vitals.fcp > 1800 ? 'needs-improvement' : 'good'}`}>
                {report.vitals.fcp ? Math.round(report.vitals.fcp) + 'ms' : '-'}
              </span>
            </div>
          </div>

          <div className="resource-stats">
            <h4>Ресурсы</h4>
            <div className="resource-grid">
              <div className="resource-stat">
                <span className="stat-label">Запросы</span>
                <span className="stat-value">{report.resources.totalCount}</span>
              </div>
              <div className="resource-stat">
                <span className="stat-label">Размер</span>
                <span className="stat-value">{report.resources.totalSize}KB</span>
              </div>
              <div className="resource-stat">
                <span className="stat-label">Память</span>
                <span className="stat-value">{report.memory.used}MB ({report.memory.percent}%)</span>
              </div>
              <div className="resource-stat">
                <span className="stat-label">FPS</span>
                <span className="stat-value">{metrics.fps?.value || '-'}</span>
              </div>
            </div>
          </div>

          {alerts.length > 0 && (
            <div className="alerts-section">
              <div className="alerts-header">
                <h4>Предупреждения ({alerts.length})</h4>
                <button onClick={clearAlerts} className="clear-btn">Очистить</button>
              </div>
              <div className="alerts-list">
                {alerts.slice(0, 5).map(alert => (
                  <div key={alert.id} className={`alert-item ${alert.severity}`}>
                    <span className="alert-type">{alert.type}</span>
                    <span className="alert-message">{alert.message}</span>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .performance-toggle {
          position: fixed;
          bottom: 20px;
          right: 320px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
          transition: all 0.3s ease;
          position: relative;
        }

        .performance-toggle:hover {
          transform: scale(1.1);
        }

        .alert-badge {
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

        .performance-panel {
          position: fixed;
          bottom: 80px;
          right: 320px;
          width: 400px;
          max-height: 600px;
          background: var(--card);
          border: 2px solid #f59e0b;
          border-radius: 16px;
          padding: 16px;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          animation: slideUp 0.3s ease-out;
        }

        .performance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
        }

        .performance-score {
          text-align: center;
          margin-bottom: 16px;
        }

        .score-circle {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border: 3px solid currentColor;
          border-radius: 50%;
        }

        .score-value {
          font-size: 24px;
          font-weight: bold;
        }

        .score-label {
          font-size: 10px;
          margin-top: 2px;
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .vital-metric {
          text-align: center;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .metric-label {
          display: block;
          font-size: 10px;
          color: var(--muted);
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 14px;
          font-weight: bold;
        }

        .metric-value.good { color: #22c55e; }
        .metric-value.needs-improvement { color: #f59e0b; }
        .metric-value.poor { color: #ef4444; }

        .resource-stats h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: var(--text);
        }

        .resource-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          margin-bottom: 16px;
        }

        .resource-stat {
          display: flex;
          justify-content: space-between;
          padding: 4px 8px;
          background: rgba(245, 158, 11, 0.05);
          border-radius: 4px;
          font-size: 11px;
        }

        .stat-label {
          color: var(--muted);
        }

        .stat-value {
          font-weight: bold;
          color: var(--text);
        }

        .alerts-section {
          border-top: 1px solid rgba(245, 158, 11, 0.2);
          padding-top: 12px;
        }

        .alerts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .alerts-header h4 {
          margin: 0;
          font-size: 12px;
          color: var(--text);
        }

        .clear-btn {
          background: transparent;
          border: 1px solid #f59e0b;
          color: #f59e0b;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          cursor: pointer;
        }

        .alerts-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .alert-item {
          padding: 6px;
          margin-bottom: 4px;
          border-radius: 4px;
          font-size: 10px;
          border-left: 3px solid;
        }

        .alert-item.error {
          background: rgba(239, 68, 68, 0.05);
          border-left-color: #ef4444;
        }

        .alert-item.warning {
          background: rgba(245, 158, 11, 0.05);
          border-left-color: #f59e0b;
        }

        .alert-item.info {
          background: rgba(59, 130, 246, 0.05);
          border-left-color: #3b82f6;
        }

        .alert-type {
          font-weight: bold;
          margin-right: 8px;
        }

        .alert-message {
          color: var(--text);
        }

        .alert-time {
          float: right;
          color: var(--muted);
          font-size: 9px;
        }

        @media (max-width: 768px) {
          .performance-panel {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
          }

          .performance-toggle {
            right: 200px;
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
export { globalPerformanceMonitor as PerformanceMonitor, PerformancePanel };
export default PerformancePanel;
