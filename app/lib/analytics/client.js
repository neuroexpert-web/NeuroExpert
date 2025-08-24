'use client';

/**
 * Client-side Analytics для NeuroExpert
 * Облегченная версия без серверных зависимостей
 */

// Простые реализации debounce и throttle
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

class ClientAnalytics {
  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
      debug: process.env.NODE_ENV === 'development',
      batchSize: 10,
      flushInterval: 5000
    };

    this.eventQueue = [];
    this.sessionData = {};
    this.isInitialized = false;
    
    this.debouncedInit = debounce(this.init.bind(this), 100);
    this.throttledFlush = throttle(this.flush.bind(this), 1000);
    
    if (typeof window !== 'undefined') {
      this.debouncedInit();
    }
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      this.initSession();
      this.setupEventListeners();
      this.startBatchProcessing();
      this.isInitialized = true;
      
      if (this.config.debug) {
        console.log('✅ Client Analytics initialized');
      }
    } catch (error) {
      console.error('❌ Analytics initialization failed:', error);
    }
  }

  initSession() {
    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };

    try {
      localStorage.setItem('neuro_session', JSON.stringify(this.sessionData));
    } catch (e) {
      console.warn('Cannot save session data:', e);
    }
  }

  setupEventListeners() {
    // Отслеживание ошибок
    window.addEventListener('error', (event) => {
      this.track('error', {
        message: event.error?.message || event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, { priority: 'high', immediate: true });
    });

    // Отслеживание видимости страницы
    document.addEventListener('visibilitychange', () => {
      this.track('page_visibility_change', {
        visible: !document.hidden,
        timestamp: Date.now()
      });
    });

    // Отслеживание выхода со страницы
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });
  }

  startBatchProcessing() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.throttledFlush();
      }
    }, this.config.flushInterval);

    setInterval(() => {
      if (this.eventQueue.length >= this.config.batchSize) {
        this.flush();
      }
    }, 1000);
  }

  track(eventName, properties = {}, options = {}) {
    if (!this.config.enabled && !this.config.debug) return;

    const event = {
      id: this.generateEventId(),
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionData.sessionId,
        timestamp: Date.now(),
        url: window.location.href
      },
      options: {
        priority: 'normal',
        immediate: false,
        ...options
      },
      createdAt: Date.now()
    };

    this.eventQueue.push(event);
    
    if (this.config.debug) {
      console.log('📊 Analytics Event:', eventName, properties);
    }

    if (options.immediate || options.priority === 'high') {
      this.flush();
    }

    return event.id;
  }

  trackPageView(pagePath, additionalData = {}) {
    return this.track('page_view', {
      page: pagePath || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      ...additionalData
    }, { priority: 'high', immediate: true });
  }

  trackSwipe(direction, fromSection, toSection, method = 'touch') {
    return this.track('swipe_navigation', {
      direction,
      fromSection,
      toSection,
      method,
      timestamp: Date.now()
    });
  }

  trackSectionView(sectionName, sectionIndex, duration = null) {
    return this.track('section_view', {
      sectionName,
      sectionIndex,
      duration,
      timestamp: Date.now()
    });
  }

  async flush(force = false) {
    if (this.eventQueue.length === 0) return;
    
    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    if (this.config.debug) {
      console.log(`📤 Sending ${eventsToSend.length} events to analytics`);
    }

    try {
      // Отправка через встроенный fetch
      await this.sendToInternalAPI(eventsToSend);
      
      // Отправка в Google Analytics если доступен
      if (window.gtag) {
        this.sendToGoogleAnalytics(eventsToSend);
      }
      
      // Отправка в Яндекс.Метрику если доступна
      if (window.ym) {
        this.sendToYandexMetrica(eventsToSend);
      }
      
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      if (!force) {
        this.eventQueue.unshift(...eventsToSend);
      }
    }
  }

  async sendToInternalAPI(events) {
    const payload = {
      eventType: 'mixed',
      events,
      metadata: {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        platform: 'web'
      }
    };

    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Analytics-Source': 'neuroexpert-frontend'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  sendToGoogleAnalytics(events) {
    events.forEach(event => {
      if (window.gtag) {
        window.gtag('event', event.name, {
          event_category: 'engagement',
          event_label: event.name,
          ...event.properties
        });
      }
    });
  }

  sendToYandexMetrica(events) {
    events.forEach(event => {
      if (window.ym && process.env.NEXT_PUBLIC_YANDEX_METRICA_ID) {
        window.ym(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID, 'reachGoal', event.name, event.properties);
      }
    });
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionMetrics() {
    const now = Date.now();
    return {
      ...this.sessionData,
      sessionDuration: now - this.sessionData.startTime,
      eventsCount: this.eventQueue.length,
      lastActivity: now
    };
  }

  clearData() {
    this.eventQueue = [];
    this.sessionData = {};
    
    try {
      localStorage.removeItem('neuro_session');
    } catch (e) {
      console.warn('Cannot clear session data:', e);
    }
  }
}

// Создание глобального экземпляра
const clientAnalytics = new ClientAnalytics();

// Экспорт для использования в компонентах
export default clientAnalytics;

// Экспорт удобных методов через функции-обертки
export const track = (...args) => clientAnalytics.track(...args);
export const trackPageView = (...args) => clientAnalytics.trackPageView(...args);
export const trackSwipe = (...args) => clientAnalytics.trackSwipe(...args);
export const trackSectionView = (...args) => clientAnalytics.trackSectionView(...args);
export const getSessionMetrics = () => clientAnalytics.getSessionMetrics();
export const clearData = () => clientAnalytics.clearData();