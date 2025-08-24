/**
 * NeuroExpert Analytics Orchestrator v3.0
 * Центральная система управления аналитикой с поддержкой микросервисной архитектуры
 * 
 * Поддерживаемые сервисы:
 * - Google Analytics 4
 * - Яндекс.Метрика
 * - Sentry (ошибки и производительность)
 * - AppMetrica (мобильная аналитика)
 * - OpenReplay (сессии пользователей)
 * - Hotjar (тепловые карты)
 * - Custom Internal Analytics
 */

'use client';

// Простые реализации debounce и throttle без lodash
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

class AnalyticsOrchestrator {
  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
      debug: process.env.NODE_ENV === 'development',
      batchSize: 10,
      flushInterval: 5000, // 5 секунд
      maxRetries: 3,
      retryDelay: 1000
    };

    this.services = new Map();
    this.eventQueue = [];
    this.isInitialized = false;
    this.sessionData = {};
    
    // Инициализация с debounce для предотвращения множественных вызовов
    this.debouncedInit = debounce(this.init.bind(this), 100);
    this.throttledFlush = throttle(this.flush.bind(this), 1000);
    
    // Автоматическая инициализация
    if (typeof window !== 'undefined') {
      this.debouncedInit();
    }
  }

  /**
   * Инициализация всех сервисов аналитики
   */
  async init() {
    if (this.isInitialized) return;
    
    try {
      console.log('🚀 NeuroExpert Analytics Orchestrator - Initializing...');
      
      // Инициализация сессии
      this.initSession();
      
      // Регистрация сервисов
      await this.registerServices();
      
      // Настройка обработчиков событий
      this.setupEventListeners();
      
      // Запуск периодической отправки
      this.startBatchProcessing();
      
      this.isInitialized = true;
      
      console.log('✅ Analytics Orchestrator initialized successfully');
      this.track('analytics_initialized', { timestamp: Date.now() });
      
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error);
      this.reportError('analytics_init_failed', error);
    }
  }

  /**
   * Инициализация сессии пользователя
   */
  initSession() {
    const sessionId = this.generateSessionId();
    const deviceInfo = this.getDeviceInfo();
    const userAgent = this.getUserAgent();
    
    this.sessionData = {
      sessionId,
      startTime: Date.now(),
      deviceInfo,
      userAgent,
      url: window.location.href,
      referrer: document.referrer,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };

    // Сохранение в localStorage для персистентности
    try {
      localStorage.setItem('neuro_session', JSON.stringify(this.sessionData));
    } catch (e) {
      console.warn('Cannot save session data to localStorage:', e);
    }
  }

  /**
   * Регистрация всех аналитических сервисов
   */
  async registerServices() {
    const services = [
      { name: 'google-analytics', enabled: !!process.env.NEXT_PUBLIC_GA_ID },
      { name: 'yandex-metrica', enabled: !!process.env.NEXT_PUBLIC_YANDEX_METRICA_ID },
      { name: 'sentry', enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN },
      { name: 'appmetrica', enabled: !!process.env.NEXT_PUBLIC_APPMETRICA_KEY },
      { name: 'openreplay', enabled: !!process.env.NEXT_PUBLIC_OPENREPLAY_KEY },
      { name: 'hotjar', enabled: !!process.env.NEXT_PUBLIC_HOTJAR_ID },
      { name: 'internal', enabled: true } // Всегда включен
    ];

    for (const service of services) {
      if (service.enabled) {
        try {
          const ServiceClass = await this.loadService(service.name);
          const serviceInstance = new ServiceClass(this.config);
          await serviceInstance.init();
          
          this.services.set(service.name, serviceInstance);
          console.log(`✅ ${service.name} service registered`);
        } catch (error) {
          console.error(`❌ Failed to register ${service.name}:`, error);
          this.reportError(`service_registration_failed_${service.name}`, error);
        }
      }
    }
  }

  /**
   * Динамическая загрузка сервисов
   */
  async loadService(serviceName) {
    const serviceMap = {
      'google-analytics': () => import('./services/GoogleAnalyticsService'),
      'yandex-metrica': () => import('./services/YandexMetricaService'),
      'sentry': () => import('./services/SentryService'),
      'appmetrica': () => import('./services/AppMetricaService'),
      'openreplay': () => import('./services/OpenReplayService'),
      'hotjar': () => import('./services/HotjarService'),
      'internal': () => import('./services/InternalAnalyticsService')
    };

    const serviceModule = await serviceMap[serviceName]();
    return serviceModule.default;
  }

  /**
   * Настройка глобальных обработчиков событий
   */
  setupEventListeners() {
    // Отслеживание ошибок
    window.addEventListener('error', (event) => {
      this.reportError('javascript_error', {
        message: event.error?.message || event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Отслеживание unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError('unhandled_promise_rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });

    // Отслеживание производительности
    if ('PerformanceObserver' in window) {
      try {
        const perfObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.trackPerformance(entry.name, {
              duration: entry.duration,
              type: entry.entryType,
              startTime: entry.startTime
            });
          }
        });
        
        perfObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      } catch (e) {
        console.warn('PerformanceObserver not fully supported:', e);
      }
    }

    // Отслеживание изменений видимости страницы
    document.addEventListener('visibilitychange', () => {
      this.track('page_visibility_change', {
        visible: !document.hidden,
        timestamp: Date.now()
      });
    });

    // Отслеживание выхода со страницы
    window.addEventListener('beforeunload', () => {
      this.flush(true); // Принудительная отправка всех событий
    });

    // Отслеживание истории браузера
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      window.dispatchEvent(new Event('pushstate'));
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      window.dispatchEvent(new Event('replacestate'));
    };
    
    ['pushstate', 'replacestate', 'popstate'].forEach(eventType => {
      window.addEventListener(eventType, () => {
        this.trackPageView(window.location.pathname);
      });
    });
  }

  /**
   * Запуск периодической обработки очереди событий
   */
  startBatchProcessing() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.throttledFlush();
      }
    }, this.config.flushInterval);

    // Принудительная отправка при превышении размера очереди
    setInterval(() => {
      if (this.eventQueue.length >= this.config.batchSize) {
        this.flush();
      }
    }, 1000);
  }

  /**
   * Основной метод отслеживания событий
   */
  track(eventName, properties = {}, options = {}) {
    if (!this.config.enabled && !this.config.debug) return;

    const event = {
      id: this.generateEventId(),
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionData.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: this.sessionData.userAgent,
        deviceInfo: this.sessionData.deviceInfo
      },
      options: {
        priority: 'normal',
        immediate: false,
        retry: true,
        ...options
      },
      attempts: 0,
      createdAt: Date.now()
    };

    // Добавление в очередь
    this.eventQueue.push(event);
    
    if (this.config.debug) {
      console.log('📊 Analytics Event Queued:', eventName, properties);
    }

    // Немедленная отправка для критических событий
    if (options.immediate || options.priority === 'high') {
      this.flush();
    }

    return event.id;
  }

  /**
   * Отслеживание просмотров страниц
   */
  trackPageView(pagePath, additionalData = {}) {
    return this.track('page_view', {
      page: pagePath || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      ...additionalData
    }, { priority: 'high', immediate: true });
  }

  /**
   * Отслеживание свайпов (специально для SwipeContainer)
   */
  trackSwipe(direction, fromSection, toSection, method = 'touch') {
    return this.track('swipe_navigation', {
      direction,
      fromSection,
      toSection,
      method, // touch, keyboard, click
      timestamp: Date.now()
    }, { priority: 'normal' });
  }

  /**
   * Отслеживание кликов по секциям
   */
  trackSectionView(sectionName, sectionIndex, duration = null) {
    return this.track('section_view', {
      sectionName,
      sectionIndex,
      duration,
      timestamp: Date.now()
    });
  }

  /**
   * Отслеживание производительности
   */
  trackPerformance(metricName, data = {}) {
    return this.track('performance_metric', {
      metric: metricName,
      ...data
    }, { priority: 'low' });
  }

  /**
   * Отслеживание ошибок
   */
  reportError(errorType, errorData) {
    return this.track('error', {
      type: errorType,
      ...errorData,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    }, { priority: 'high', immediate: true });
  }

  /**
   * Отправка накопленных событий всем сервисам
   */
  async flush(force = false) {
    if (this.eventQueue.length === 0) return;
    
    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    if (this.config.debug) {
      console.log(`📤 Flushing ${eventsToSend.length} events to analytics services`);
    }

    // Отправка событий каждому сервису
    for (const [serviceName, service] of this.services) {
      try {
        await service.sendEvents(eventsToSend);
        if (this.config.debug) {
          console.log(`✅ Events sent to ${serviceName}`);
        }
      } catch (error) {
        console.error(`❌ Failed to send events to ${serviceName}:`, error);
        
        // Повторная постановка в очередь для повторной попытки
        if (!force) {
          const retriableEvents = eventsToSend
            .filter(event => event.attempts < this.config.maxRetries)
            .map(event => ({ ...event, attempts: event.attempts + 1 }));
          
          this.eventQueue.unshift(...retriableEvents);
        }
      }
    }
  }

  /**
   * Генерация уникального ID сессии
   */
  generateSessionId() {
    return `neuro_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Генерация уникального ID события
   */
  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Получение информации о устройстве
   */
  getDeviceInfo() {
    const ua = navigator.userAgent;
    
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      isTablet: /iPad|Android(?!.*Mobile)/i.test(ua),
      isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      languages: navigator.languages,
      hardwareConcurrency: navigator.hardwareConcurrency,
      memory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }

  /**
   * Получение User Agent
   */
  getUserAgent() {
    return {
      full: navigator.userAgent,
      vendor: navigator.vendor,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      platform: navigator.platform
    };
  }

  /**
   * Получение текущих метрик сессии
   */
  getSessionMetrics() {
    const now = Date.now();
    const sessionDuration = now - this.sessionData.startTime;
    
    return {
      ...this.sessionData,
      currentUrl: window.location.href,
      sessionDuration,
      eventsCount: this.eventQueue.length,
      servicesActive: Array.from(this.services.keys()),
      lastActivity: now
    };
  }

  /**
   * Очистка данных (для GDPR compliance)
   */
  clearData() {
    this.eventQueue = [];
    this.sessionData = {};
    
    try {
      localStorage.removeItem('neuro_session');
    } catch (e) {
      console.warn('Cannot clear session data from localStorage:', e);
    }
    
    // Уведомление всех сервисов об очистке данных
    for (const [serviceName, service] of this.services) {
      if (service.clearData) {
        service.clearData();
      }
    }
    
    console.log('🧹 Analytics data cleared for GDPR compliance');
  }

  /**
   * Получение статистики работы оркестратора
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      servicesCount: this.services.size,
      queueLength: this.eventQueue.length,
      sessionData: this.sessionData,
      config: this.config
    };
  }
}

// Создание глобального экземпляра
const analyticsOrchestrator = new AnalyticsOrchestrator();

// Экспорт для использования в компонентах
export default analyticsOrchestrator;

// Экспорт удобных методов
export const {
  track,
  trackPageView,
  trackSwipe,
  trackSectionView,
  trackPerformance,
  reportError,
  getSessionMetrics,
  clearData,
  getStats
} = analyticsOrchestrator;