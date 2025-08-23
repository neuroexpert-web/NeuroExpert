// Универсальный модуль аналитики для NeuroExpert
import { debounce, throttle } from 'lodash';

// Типы событий
export type EventType = 
  | 'page_view'
  | 'swipe'
  | 'tap'
  | 'keyboard_nav'
  | 'section_view'
  | 'cursor_selection'
  | 'ai_analysis'
  | 'roi_calculation'
  | 'form_submit'
  | 'error'
  | 'performance';

export interface AnalyticsEvent {
  eventType: EventType;
  eventName: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  pageUrl: string;
  device: {
    type: string;
    browser: string;
    os: string;
    viewport: { width: number; height: number };
  };
}

// Конфигурация сервисов
interface AnalyticsConfig {
  googleAnalytics?: { id: string };
  yandexMetrica?: { id: string };
  sentry?: { dsn: string };
  appMetrica?: { apiKey: string };
  openReplay?: { projectKey: string };
  hotjar?: { id: string };
  custom?: { endpoint: string };
}

class AnalyticsManager {
  private config: AnalyticsConfig = {};
  private sessionId: string;
  private userId?: string;
  private eventQueue: AnalyticsEvent[] = [];
  private isInitialized = false;
  private debugMode = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
  }

  // Инициализация с конфигурацией
  init(config: AnalyticsConfig, userId?: string, debug = false) {
    this.config = config;
    this.userId = userId;
    this.debugMode = debug;
    
    // Инициализация сервисов
    this.initGoogleAnalytics();
    this.initYandexMetrica();
    this.initSentry();
    this.initHotjar();
    
    this.isInitialized = true;
    
    // Отправляем накопленные события
    this.flushEventQueue();
  }

  // Google Analytics
  private initGoogleAnalytics() {
    if (!this.config.googleAnalytics?.id || typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalytics.id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', this.config.googleAnalytics.id);
  }

  // Яндекс.Метрика
  private initYandexMetrica() {
    if (!this.config.yandexMetrica?.id || typeof window === 'undefined') return;

    (function(m: any, e: any, t: any, r: any, i: any, k: any, a: any) {
      m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date().getTime();
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode?.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    window.ym(this.config.yandexMetrica.id, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
  }

  // Sentry для отслеживания ошибок
  private initSentry() {
    if (!this.config.sentry?.dsn) return;
    // Sentry инициализируется отдельно в sentry.client.config.ts
  }

  // Hotjar
  private initHotjar() {
    if (!this.config.hotjar?.id || typeof window === 'undefined') return;

    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: parseInt(o), hjsv: 6 };
      a = t.getElementsByTagName('head')[0];
      r = t.createElement('script');
      r.async = 1;
      r.src = j + h._hjSettings.hjid + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, this.config.hotjar.id, document, 'https://static.hotjar.com/c/hotjar-');
  }

  // Отправка события
  track(eventType: EventType, eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      eventType,
      eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      pageUrl: window.location.href,
      device: this.getDeviceInfo()
    };

    if (this.debugMode) {
      console.log('[Analytics]', event);
    }

    if (!this.isInitialized) {
      this.eventQueue.push(event);
      return;
    }

    this.sendToServices(event);
  }

  // Отправка во все сервисы
  private sendToServices(event: AnalyticsEvent) {
    // Google Analytics
    if (this.config.googleAnalytics && window.gtag) {
      window.gtag('event', event.eventName, {
        event_category: event.eventType,
        event_label: event.properties?.label,
        value: event.properties?.value,
        ...event.properties
      });
    }

    // Яндекс.Метрика
    if (this.config.yandexMetrica && window.ym) {
      window.ym(this.config.yandexMetrica.id, 'reachGoal', event.eventName, event.properties);
    }

    // Custom endpoint
    if (this.config.custom?.endpoint) {
      this.sendToCustomEndpoint(event);
    }
  }

  // Отправка на кастомный endpoint
  private sendToCustomEndpoint = debounce(async (event: AnalyticsEvent) => {
    try {
      await fetch(this.config.custom!.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('[Analytics] Failed to send event:', error);
    }
  }, 1000);

  // Специальные методы для частых событий
  trackSwipe = throttle((direction: 'left' | 'right', from: string, to: string) => {
    this.track('swipe', 'navigation_swipe', {
      direction,
      from_section: from,
      to_section: to
    });
  }, 500);

  trackSectionView = debounce((sectionId: string, duration?: number) => {
    this.track('section_view', 'section_viewed', {
      section_id: sectionId,
      view_duration: duration
    });
  }, 1000);

  trackCursorSelection(text: string, action: string) {
    this.track('cursor_selection', 'text_selected', {
      text_length: text.length,
      action,
      text_preview: text.substring(0, 50)
    });
  }

  trackAIAnalysis(command: string, success: boolean, responseTime: number) {
    this.track('ai_analysis', 'ai_command_executed', {
      command,
      success,
      response_time_ms: responseTime
    });
  }

  trackROICalculation(data: any, result: any) {
    this.track('roi_calculation', 'roi_calculated', {
      company_size: data.companySize,
      industry: data.industry,
      result_percentage: result.percentage,
      savings_amount: result.savingsAmount
    });
  }

  trackError(error: Error, context?: string) {
    this.track('error', 'error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      context
    });
  }

  trackPerformance(metric: string, value: number) {
    this.track('performance', 'performance_metric', {
      metric_name: metric,
      metric_value: value
    });
  }

  // Установка user ID
  setUserId(userId: string) {
    this.userId = userId;
    
    if (window.gtag) {
      window.gtag('set', { user_id: userId });
    }
  }

  // Вспомогательные методы
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
    const ua = navigator.userAgent;
    return {
      type: /mobile/i.test(ua) ? 'mobile' : 'desktop',
      browser: this.getBrowser(ua),
      os: this.getOS(ua),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  private getBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOS(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Other';
  }

  private flushEventQueue() {
    this.eventQueue.forEach(event => this.sendToServices(event));
    this.eventQueue = [];
  }

  // Автоматическое отслеживание базовых событий
  private setupEventListeners() {
    if (typeof window === 'undefined') return;

    // Page views
    window.addEventListener('popstate', () => {
      this.track('page_view', 'page_viewed', { url: window.location.href });
    });

    // Errors
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), 'window_error');
    });

    // Performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.trackPerformance('LCP', entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
}

// Глобальный экземпляр
export const analytics = new AnalyticsManager();

// Типы для TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    ym: (...args: any[]) => void;
  }
}