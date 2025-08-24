/**
 * Internal Analytics Service для NeuroExpert
 * Собственная система аналитики с отправкой на внутренний API
 */

export default class InternalAnalyticsService {
  constructor(config = {}) {
    this.config = config;
    this.isInitialized = false;
    this.apiEndpoint = '/api/analytics/events';
    this.debugMode = config.debug || false;
    this.batchQueue = [];
    this.retryAttempts = new Map();
  }

  /**
   * Инициализация внутреннего сервиса
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Проверка доступности API
      await this.testApiConnection();
      
      this.isInitialized = true;
      
      if (this.debugMode) {
        console.log('✅ Internal Analytics Service initialized');
      }
      
    } catch (error) {
      console.error('❌ Internal Analytics initialization failed:', error);
      throw error;
    }
  }

  /**
   * Тестирование подключения к API
   */
  async testApiConnection() {
    try {
      const response = await fetch('/api/analytics/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API health check failed: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.warn('Internal analytics API not available:', error);
      return false;
    }
  }

  /**
   * Отправка событий во внутреннюю систему
   */
  async sendEvents(events) {
    if (!this.isInitialized) return;

    try {
      // Группировка событий по типам для эффективной обработки
      const groupedEvents = this.groupEventsByType(events);
      
      // Отправка каждой группы
      for (const [eventType, eventGroup] of Object.entries(groupedEvents)) {
        await this.sendEventGroup(eventType, eventGroup);
      }
      
      if (this.debugMode) {
        console.log(`📊 Internal Analytics: Sent ${events.length} events`);
      }
      
    } catch (error) {
      console.error('Failed to send events to internal analytics:', error);
      throw error;
    }
  }

  /**
   * Группировка событий по типам
   */
  groupEventsByType(events) {
    return events.reduce((groups, event) => {
      const type = event.name;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(event);
      return groups;
    }, {});
  }

  /**
   * Отправка группы событий одного типа
   */
  async sendEventGroup(eventType, events) {
    const payload = {
      eventType,
      events: events.map(event => this.transformEventForInternal(event)),
      metadata: {
        timestamp: Date.now(),
        batchId: this.generateBatchId(),
        userAgent: navigator.userAgent,
        platform: 'web'
      }
    };

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Analytics-Source': 'neuroexpert-frontend',
          'X-Batch-Size': events.length.toString()
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (this.debugMode) {
        console.log(`✅ Internal Analytics: ${eventType} events sent successfully`, result);
      }

      // Очистка счетчика повторных попыток при успехе
      this.retryAttempts.delete(payload.metadata.batchId);
      
    } catch (error) {
      console.error(`Failed to send ${eventType} events:`, error);
      
      // Логика повторных попыток
      await this.handleRetry(payload);
      
      throw error;
    }
  }

  /**
   * Трансформация события для внутренней системы
   */
  transformEventForInternal(event) {
    const transformed = {
      id: event.id,
      name: event.name,
      timestamp: event.properties.timestamp,
      sessionId: event.properties.sessionId,
      properties: {
        ...event.properties,
        // Добавление специфичных для NeuroExpert метрик
        platform: 'web',
        version: '3.0.0',
        build: process.env.NEXT_PUBLIC_BUILD_ID || 'unknown'
      },
      context: {
        url: event.properties.url,
        userAgent: event.properties.userAgent,
        deviceInfo: event.properties.deviceInfo,
        referrer: document.referrer,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      options: event.options
    };

    // Специальная обработка для разных типов событий
    switch (event.name) {
      case 'swipe_navigation':
        transformed.analytics = {
          category: 'navigation',
          action: 'swipe',
          label: `${event.properties.fromSection}->${event.properties.toSection}`,
          value: event.properties.toSection
        };
        break;

      case 'section_view':
        transformed.analytics = {
          category: 'page_view',
          action: 'view_section',
          label: event.properties.sectionName,
          value: event.properties.sectionIndex,
          duration: event.properties.duration
        };
        break;

      case 'performance_metric':
        transformed.analytics = {
          category: 'performance',
          action: 'metric',
          label: event.properties.metric,
          value: Math.round(event.properties.duration || 0),
          type: event.properties.type
        };
        break;

      case 'error':
        transformed.analytics = {
          category: 'error',
          action: event.properties.type,
          label: event.properties.message || 'Unknown error',
          severity: event.properties.type === 'javascript_error' ? 'high' : 'medium'
        };
        break;

      case 'roi_calculation':
        transformed.analytics = {
          category: 'conversion',
          action: 'roi_calculation',
          label: `${event.properties.businessSize}-${event.properties.industry}`,
          value: event.properties.estimatedROI || 0,
          lead_data: {
            businessSize: event.properties.businessSize,
            industry: event.properties.industry,
            budget: event.properties.budget
          }
        };
        break;

      case 'ai_interaction':
        transformed.analytics = {
          category: 'ai_engagement',
          action: event.properties.type,
          label: event.properties.model,
          value: event.properties.responseTime,
          satisfaction: event.properties.satisfaction
        };
        break;
    }

    return transformed;
  }

  /**
   * Обработка повторных попыток отправки
   */
  async handleRetry(payload) {
    const batchId = payload.metadata.batchId;
    const attempts = this.retryAttempts.get(batchId) || 0;
    
    if (attempts < this.config.maxRetries) {
      this.retryAttempts.set(batchId, attempts + 1);
      
      // Экспоненциальная задержка
      const delay = Math.min(1000 * Math.pow(2, attempts), 10000);
      
      setTimeout(async () => {
        try {
          await this.sendEventGroup(payload.eventType, payload.events);
        } catch (error) {
          console.error(`Retry ${attempts + 1} failed for batch ${batchId}:`, error);
        }
      }, delay);
    } else {
      console.error(`Max retries exceeded for batch ${batchId}`);
      this.retryAttempts.delete(batchId);
    }
  }

  /**
   * Генерация ID пакета
   */
  generateBatchId() {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Отправка индивидуального события (для критических событий)
   */
  async sendSingleEvent(event) {
    return this.sendEvents([event]);
  }

  /**
   * Отправка пользовательских метрик
   */
  async sendUserMetrics(userId, metrics) {
    if (!this.isInitialized) return;

    const payload = {
      type: 'user_metrics',
      userId,
      metrics,
      timestamp: Date.now()
    };

    try {
      const response = await fetch('/api/analytics/user-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`User metrics request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send user metrics:', error);
      throw error;
    }
  }

  /**
   * Получение аналитических данных
   */
  async getAnalyticsData(params = {}) {
    if (!this.isInitialized) return null;

    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/analytics/data?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Analytics data request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      return null;
    }
  }

  /**
   * Экспорт данных для анализа
   */
  async exportData(format = 'json', dateRange = {}) {
    if (!this.isInitialized) return null;

    try {
      const params = {
        format,
        startDate: dateRange.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: dateRange.end || new Date().toISOString()
      };

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/analytics/export?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Export request failed: ${response.status}`);
      }

      if (format === 'json') {
        return await response.json();
      } else {
        return await response.blob();
      }
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      return null;
    }
  }

  /**
   * Очистка данных (GDPR compliance)
   */
  async clearData(userId = null) {
    if (!this.isInitialized) return;

    try {
      const payload = userId ? { userId } : { sessionId: this.getCurrentSessionId() };
      
      const response = await fetch('/api/analytics/clear-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Clear data request failed: ${response.status}`);
      }

      if (this.debugMode) {
        console.log('🧹 Internal analytics data cleared');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to clear analytics data:', error);
      throw error;
    }
  }

  /**
   * Получение текущего ID сессии
   */
  getCurrentSessionId() {
    try {
      const sessionData = localStorage.getItem('neuro_session');
      return sessionData ? JSON.parse(sessionData).sessionId : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Получение статистики сервиса
   */
  getStats() {
    return {
      name: 'Internal Analytics',
      isInitialized: this.isInitialized,
      apiEndpoint: this.apiEndpoint,
      debugMode: this.debugMode,
      queuedEvents: this.batchQueue.length,
      retryAttempts: this.retryAttempts.size
    };
  }
}