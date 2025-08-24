import { useCallback, useEffect } from 'react';

// Типы для событий аналитики
interface AnalyticsEvent {
  event_name: string;
  parameters?: Record<string, any>;
}

export function useAnalytics() {
  // Инициализация аналитики при загрузке
  useEffect(() => {
    // AppMetrica
    if (typeof window !== 'undefined' && !window.appMetrica) {
      const script = document.createElement('script');
      script.src = 'https://mc.yandex.ru/metrika/tag.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Hotjar
    if (typeof window !== 'undefined' && !window.hj) {
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:process.env.NEXT_PUBLIC_HOTJAR_ID,hjsv:6};
        const script = document.createElement('script');
        script.src = 'https://static.hotjar.com/c/hotjar-' + h._hjSettings.hjid + '.js?sv=' + h._hjSettings.hjsv;
        script.async = true;
        document.head.appendChild(script);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }

    // OpenReplay
    if (typeof window !== 'undefined' && !window.OpenReplay && process.env.NEXT_PUBLIC_OPENREPLAY_KEY) {
      import('@openreplay/tracker').then(({ default: Tracker }) => {
        const tracker = new Tracker({
          projectKey: process.env.NEXT_PUBLIC_OPENREPLAY_KEY,
          __DISABLE_SECURE_MODE: process.env.NODE_ENV === 'development'
        });
        tracker.start();
        window.OpenReplay = tracker;
      });
    }
  }, []);

  // Отслеживание событий
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    try {
      // Google Analytics 4
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, parameters);
      }

      // Яндекс.Метрика
      if (typeof window !== 'undefined' && window.ym) {
        window.ym(process.env.NEXT_PUBLIC_YM_ID, 'reachGoal', eventName, parameters);
      }

      // AppMetrica
      if (typeof window !== 'undefined' && window.appMetrica) {
        window.appMetrica.reportEvent(eventName, parameters);
      }

      // Sentry (для важных событий)
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.addBreadcrumb({
          category: 'user-action',
          message: eventName,
          level: 'info',
          data: parameters
        });
      }

      // OpenReplay
      if (typeof window !== 'undefined' && window.OpenReplay) {
        window.OpenReplay.event(eventName, parameters);
      }

      // Hotjar Events
      if (typeof window !== 'undefined' && window.hj) {
        window.hj('event', eventName);
      }

      // Отправка на наш сервер для агрегации
      if (process.env.NEXT_PUBLIC_CUSTOM_ANALYTICS_ENABLED === 'true') {
        fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: eventName,
            parameters,
            timestamp: Date.now(),
            sessionId: getSessionId(),
            userId: getUserId()
          })
        }).catch(console.error);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  // Отслеживание просмотра страниц
  const trackPageView = useCallback((pageName: string, parameters?: Record<string, any>) => {
    trackEvent('page_view', {
      page_name: pageName,
      page_location: window.location.href,
      page_referrer: document.referrer,
      ...parameters
    });
  }, [trackEvent]);

  // Отслеживание времени на странице
  const trackTiming = useCallback((category: string, variable: string, value: number, label?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        event_category: category,
        name: variable,
        value: value,
        event_label: label
      });
    }
  }, []);

  // Отслеживание ошибок
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });

    // Отправка в Sentry
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, { extra: context });
    }
  }, [trackEvent]);

  // Отслеживание конверсий
  const trackConversion = useCallback((conversionType: string, value?: number, currency?: string) => {
    trackEvent('conversion', {
      conversion_type: conversionType,
      value: value,
      currency: currency || 'RUB'
    });

    // Отправка в рекламные системы
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', { value, currency });
    }
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackTiming,
    trackError,
    trackConversion
  };
}

// Вспомогательные функции
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('neuroexpert-session-id');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('neuroexpert-session-id', sessionId);
  }
  return sessionId;
}

function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('neuroexpert-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('neuroexpert-user-id', userId);
  }
  return userId;
}

// Расширение типов для window
declare global {
  interface Window {
    gtag: any;
    ym: any;
    appMetrica: any;
    Sentry: any;
    OpenReplay: any;
    hj: any;
    fbq: any;
  }
}