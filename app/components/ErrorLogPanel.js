// Система логирования и обработки ошибок для NeuroExpert v3.0
'use client';
import { useState, useEffect } from 'react';

class ErrorLogger {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.maxLogs = 100;
    this.initialized = false;
  }

  initializeErrorHandling() {
    // Проверяем, что мы в браузере
    if (typeof window === 'undefined' || this.initialized) {
      return;
    }

    this.initialized = true;

    // Глобальная обработка JavaScript ошибок
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: Date.now(),
      });
    });

    // Обработка необработанных промисов
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack,
        timestamp: Date.now(),
      });
    });

    // Переопределяем console.error для отслеживания
    const originalError = console.error;
    console.error = (...args) => {
      this.logWarning({
        type: 'console',
        message: args.join(' '),
        timestamp: Date.now(),
      });
      originalError.apply(console, args);
    };

    // Инициализируем глобальный массив ошибок (только в браузере)
    if (typeof window !== 'undefined' && !window.consoleErrors) {
      window.consoleErrors = [];
    }
  }

  logError(errorData) {
    this.errors.unshift(errorData);
    this.errors = this.errors.slice(0, this.maxLogs);

    // Добавляем в глобальный массив для совместимости (только в браузере)
    if (typeof window !== 'undefined' && window.consoleErrors) {
      window.consoleErrors.unshift(errorData.message);
      window.consoleErrors = window.consoleErrors.slice(0, this.maxLogs);
    }

    console.error('🚨 Logged error:', errorData);
  }

  logWarning(warningData) {
    this.warnings.unshift(warningData);
    this.warnings = this.warnings.slice(0, this.maxLogs);

    console.warn('⚠️ Logged warning:', warningData);
  }

  getErrors() {
    return this.errors;
  }

  getWarnings() {
    return this.warnings;
  }

  clearLogs() {
    this.errors = [];
    this.warnings = [];
    if (typeof window !== 'undefined' && window.consoleErrors) {
      window.consoleErrors = [];
    }
  }

  getErrorSummary() {
    return {
      totalErrors: this.errors.length,
      totalWarnings: this.warnings.length,
      recentErrors: this.errors.slice(0, 5),
      errorTypes: this.groupErrorsByType(),
    };
  }

  groupErrorsByType() {
    const types = {};
    this.errors.forEach((error) => {
      types[error.type] = (types[error.type] || 0) + 1;
    });
    return types;
  }
}

// Глобальный логгер ошибок (инициализируется только в браузере)
let globalErrorLogger = null;

// Функция для получения или создания логгера
function getErrorLogger() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!globalErrorLogger) {
    globalErrorLogger = new ErrorLogger();
    globalErrorLogger.initializeErrorHandling();
  }

  return globalErrorLogger;
}

// Функция для безопасного выполнения кода
function safeExecute(fn, fallback = null, context = '') {
  try {
    return fn();
  } catch (error) {
    const logger = getErrorLogger();
    if (logger) {
      logger.logError({
        type: 'safe_execute',
        message: `Error in ${context}: ${error.message}`,
        stack: error.stack,
        timestamp: Date.now(),
      });
    }
    return fallback;
  }
}

// Функция для безопасного доступа к DOM элементам
function safeQuerySelector(selector, parent = null) {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const targetParent = parent || document;
    return targetParent.querySelector(selector);
  } catch (error) {
    const logger = getErrorLogger();
    if (logger) {
      logger.logWarning({
        type: 'dom_query',
        message: `Invalid selector: ${selector}`,
        timestamp: Date.now(),
      });
    }
    return null;
  }
}

// Функция для безопасной работы с localStorage
function safeLocalStorage(action, key, value = null) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  try {
    switch (action) {
      case 'get':
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      case 'set':
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      case 'remove':
        localStorage.removeItem(key);
        return true;
      default:
        return null;
    }
  } catch (error) {
    const logger = getErrorLogger();
    if (logger) {
      logger.logWarning({
        type: 'localStorage',
        message: `LocalStorage ${action} error for key ${key}: ${error.message}`,
        timestamp: Date.now(),
      });
    }
    return null;
  }
}

// React компонент для отображения логов ошибок
function ErrorLogPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [errorSummary, setErrorSummary] = useState(null);
  const [logger, setLogger] = useState(null);

  useEffect(() => {
    // Инициализируем логгер только в браузере
    const errorLogger = getErrorLogger();
    setLogger(errorLogger);

    if (errorLogger) {
      const updateSummary = () => {
        setErrorSummary(errorLogger.getErrorSummary());
      };

      updateSummary();
      const interval = setInterval(updateSummary, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  const clearAllLogs = () => {
    if (logger) {
      logger.clearLogs();
      setErrorSummary(logger.getErrorSummary());
    }
  };

  if (!errorSummary || !logger) return null;

  return (
    <>
      <button
        className="error-log-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Логи ошибок"
      >
        🐛
        {errorSummary.totalErrors > 0 && (
          <span className="error-count">{errorSummary.totalErrors}</span>
        )}
      </button>

      {isVisible && (
        <div className="error-log-panel">
          <div className="error-log-header">
            <h3>🐛 Логи ошибок</h3>
            <div className="header-actions">
              <button onClick={clearAllLogs} className="clear-btn">
                Очистить
              </button>
              <button onClick={() => setIsVisible(false)}>✕</button>
            </div>
          </div>

          <div className="error-summary">
            <div className="summary-item error">
              <span className="label">Ошибки:</span>
              <span className="value">{errorSummary.totalErrors}</span>
            </div>
            <div className="summary-item warning">
              <span className="label">Предупреждения:</span>
              <span className="value">{errorSummary.totalWarnings}</span>
            </div>
          </div>

          {errorSummary.recentErrors.length > 0 && (
            <div className="recent-errors">
              <h4>Последние ошибки:</h4>
              {errorSummary.recentErrors.map((error, index) => (
                <div key={index} className="error-item">
                  <div className="error-header">
                    <span className="error-type">{error.type}</span>
                    <span className="error-time">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="error-message">{error.message}</div>
                  {error.filename && (
                    <div className="error-location">
                      {error.filename}:{error.lineno}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {Object.keys(errorSummary.errorTypes).length > 0 && (
            <div className="error-types">
              <h4>Типы ошибок:</h4>
              {Object.entries(errorSummary.errorTypes).map(([type, count]) => (
                <div key={type} className="type-item">
                  <span className="type-name">{type}</span>
                  <span className="type-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .error-log-toggle {
          position: fixed;
          bottom: 20px;
          right: 380px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          transition: all 0.3s ease;
          position: relative;
        }

        .error-log-toggle:hover {
          transform: scale(1.1);
        }

        .error-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #fbbf24;
          color: #000;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .error-log-panel {
          position: fixed;
          bottom: 80px;
          right: 380px;
          width: 400px;
          max-height: 600px;
          background: var(--card);
          border: 2px solid #ef4444;
          border-radius: 16px;
          padding: 16px;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.3s ease-out;
        }

        .error-log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(239, 68, 68, 0.2);
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .clear-btn {
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          cursor: pointer;
        }

        .error-summary {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid;
        }

        .summary-item.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .summary-item.warning {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }

        .summary-item .label {
          font-size: 10px;
          color: var(--muted);
        }

        .summary-item .value {
          font-size: 16px;
          font-weight: bold;
          color: var(--text);
        }

        .recent-errors h4,
        .error-types h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: var(--text);
        }

        .error-item {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 8px;
        }

        .error-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .error-type {
          font-size: 10px;
          background: #ef4444;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .error-time {
          font-size: 9px;
          color: var(--muted);
        }

        .error-message {
          font-size: 11px;
          color: var(--text);
          margin-bottom: 4px;
        }

        .error-location {
          font-size: 9px;
          color: var(--muted);
          font-family: monospace;
        }

        .type-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 8px;
          background: rgba(239, 68, 68, 0.05);
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 11px;
        }

        .type-count {
          font-weight: bold;
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .error-log-panel {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
          }

          .error-log-toggle {
            right: 260px;
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

export {
  globalErrorLogger as ErrorLogger,
  ErrorLogPanel,
  safeExecute,
  safeQuerySelector,
  safeLocalStorage,
};
export default ErrorLogPanel;
