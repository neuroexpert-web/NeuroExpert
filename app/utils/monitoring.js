/**
 * Централизованная система мониторинга для NeuroExpert
 * Интеграция с Vercel Analytics, Sentry и custom logging
 */

import { logger } from './logger';

// Типы событий для аналитики
export const ANALYTICS_EVENTS = {
  // User Actions
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  FORM_SUBMIT: 'form_submit',
  
  // AI Interactions
  AI_CHAT_START: 'ai_chat_start',
  AI_CHAT_MESSAGE: 'ai_chat_message',
  AI_CHAT_ERROR: 'ai_chat_error',
  
  // Performance
  PAGE_LOAD: 'page_load',
  API_CALL: 'api_call',
  SLOW_QUERY: 'slow_query',
  
  // Errors
  ERROR_BOUNDARY: 'error_boundary',
  API_ERROR: 'api_error',
  UNHANDLED_ERROR: 'unhandled_error'
};

// Конфигурация мониторинга
const MONITORING_CONFIG = {
  enableVercelAnalytics: process.env.NODE_ENV === 'production',
  enableSentry: !!process.env.SENTRY_DSN,
  enableCustomLogging: true,
  slowQueryThreshold: 3000, // 3 секунды
  apiTimeoutThreshold: 10000 // 10 секунд
};

class MonitoringService {
  constructor() {
    this.logger = logger;
    this.initialized = false;
    this.performanceMarks = new Map();
  }

  /**
   * Инициализация сервисов мониторинга
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Инициализация Vercel Analytics
      if (MONITORING_CONFIG.enableVercelAnalytics && typeof window !== 'undefined') {
        const { Analytics } = await import('@vercel/analytics/react');
        this.logger.info('Vercel Analytics initialized');
      }

      // Инициализация Sentry (опционально)
      if (MONITORING_CONFIG.enableSentry && process.env.SENTRY_DSN) {
        try {
          const Sentry = await import('@sentry/nextjs');
          Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
            beforeSend(event) {
              // Фильтрация чувствительных данных
              if (event.request?.cookies) {
                delete event.request.cookies;
              }
              return event;
            }
          });
          this.logger.info('Sentry initialized');
        } catch (error) {
          this.logger.warn('Sentry not available, continuing without it');
        }
      }

      this.initialized = true;
    } catch (error) {
      this.logger.error('Failed to initialize monitoring', { error: error.message });
    }
  }

  /**
   * Отслеживание события
   */
  trackEvent(eventName, properties = {}) {
    try {
      // Логирование события
      this.logger.info(`Event: ${eventName}`, properties);

      // Vercel Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, properties);
      }

      // Custom analytics endpoint
      if (MONITORING_CONFIG.enableCustomLogging) {
        this._sendToAnalytics(eventName, properties);
      }
    } catch (error) {
      this.logger.error('Failed to track event', { eventName, error: error.message });
    }
  }

  /**
   * Отслеживание ошибки
   */
  trackError(error, context = {}) {
    try {
      const errorInfo = {
        message: error.message,
        stack: error.stack,
        ...context
      };

      // Логирование
      this.logger.error('Application error', errorInfo);

      // Sentry (если доступен)
      if (MONITORING_CONFIG.enableSentry && typeof window !== 'undefined') {
        import('@sentry/nextjs').then(Sentry => {
          Sentry.captureException(error, {
            extra: context
          });
        }).catch(() => {
          // Sentry не установлен, продолжаем без него
        });
      }

      // Отправка в Telegram для критических ошибок
      if (context.severity === 'critical') {
        this._notifyTelegram(error, context);
      }
    } catch (err) {
      console.error('Failed to track error:', err);
    }
  }

  /**
   * Измерение производительности
   */
  startPerformanceMeasure(measureName) {
    this.performanceMarks.set(measureName, Date.now());
  }

  endPerformanceMeasure(measureName, metadata = {}) {
    const startTime = this.performanceMarks.get(measureName);
    if (!startTime) {
      this.logger.warn(`No start mark found for measure: ${measureName}`);
      return;
    }

    const duration = Date.now() - startTime;
    this.performanceMarks.delete(measureName);

    // Логирование медленных операций
    if (duration > MONITORING_CONFIG.slowQueryThreshold) {
      this.logger.warn(`Slow operation detected: ${measureName}`, {
        duration,
        ...metadata
      });
    }

    // Отслеживание метрики
    this.trackEvent('performance_measure', {
      measureName,
      duration,
      ...metadata
    });

    return duration;
  }

  /**
   * Мониторинг API вызовов
   */
  async monitorAPICall(apiName, apiCall) {
    const startTime = Date.now();
    let success = false;
    let error = null;

    try {
      const result = await apiCall();
      success = true;
      return result;
    } catch (err) {
      error = err;
      throw err;
    } finally {
      const duration = Date.now() - startTime;
      
      this.trackEvent(ANALYTICS_EVENTS.API_CALL, {
        apiName,
        duration,
        success,
        error: error?.message
      });

      if (duration > MONITORING_CONFIG.apiTimeoutThreshold) {
        this.logger.warn(`Slow API call: ${apiName}`, { duration });
      }
    }
  }

  /**
   * Отправка аналитики на сервер
   */
  async _sendToAnalytics(eventName, properties) {
    if (typeof window === 'undefined') return;

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      // Не блокируем основной поток при ошибке аналитики
      console.error('Analytics error:', error);
    }
  }

  /**
   * Уведомление в Telegram для критических ошибок
   */
  async _notifyTelegram(error, context) {
    try {
      await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🚨 Critical Error in NeuroExpert\n\nError: ${error.message}\nContext: ${JSON.stringify(context, null, 2)}`
        })
      });
    } catch (err) {
      console.error('Failed to send Telegram notification:', err);
    }
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

// Автоматическая инициализация
if (typeof window !== 'undefined') {
  monitoring.initialize();
}

// Глобальный обработчик ошибок
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    monitoring.trackError(event.error || new Error(event.message), {
      severity: 'critical',
      source: 'window.onerror',
      url: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    monitoring.trackError(new Error(event.reason), {
      severity: 'critical',
      source: 'unhandledrejection'
    });
  });
}