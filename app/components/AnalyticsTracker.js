// Централизованная система отслеживания аналитики NeuroExpert
'use client';
import { useEffect } from 'react';

// Утилиты для отслеживания событий
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label || eventName,
      ...parameters,
    });
  }

  // Яндекс.Метрика
  if (window.ym && process.env.NEXT_PUBLIC_YANDEX_METRICA_ID) {
    window.ym(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID, 'reachGoal', eventName, parameters);
  }

  console.log('📊 Analytics Event:', eventName, parameters);
};

// Отслеживание просмотров страниц
export const trackPageView = (pageName, additionalData = {}) => {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_title: pageName,
      page_location: window.location.href,
      ...additionalData,
    });
  }

  // Яндекс.Метрика
  if (window.ym) {
    window.ym(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID, 'hit', window.location.href, {
      title: pageName,
      ...additionalData,
    });
  }
};

// Отслеживание конверсий
export const trackConversion = (conversionType, value = 1, additionalData = {}) => {
  trackEvent('conversion', {
    category: 'conversion',
    label: conversionType,
    value: value,
    conversion_type: conversionType,
    ...additionalData,
  });
};

// Отслеживание взаимодействий с калькулятором
export const trackCalculatorInteraction = (action, step, data = {}) => {
  trackEvent('calculator_interaction', {
    category: 'calculator',
    label: action,
    calculator_step: step,
    ...data,
  });
};

// Отслеживание взаимодействий с AI-управляющим
export const trackAIManagerInteraction = (action, questionType = null) => {
  trackEvent('ai_manager_interaction', {
    category: 'ai_manager',
    label: action,
    question_type: questionType,
  });
};

// Отслеживание скролла
export const trackScrollDepth = (depth) => {
  trackEvent('scroll_depth', {
    category: 'engagement',
    label: `${depth}%`,
    value: depth,
  });
};

// Отслеживание времени на сайте
export const trackTimeOnSite = (seconds) => {
  trackEvent('time_on_site', {
    category: 'engagement',
    label: 'session_duration',
    value: Math.floor(seconds),
  });
};

// Основной компонент отслеживания
function AnalyticsTracker() {
  useEffect(() => {
    // Отслеживание загрузки страницы
    trackPageView('NeuroExpert - Main Page');

    // Отслеживание времени на сайте
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      trackTimeOnSite(timeSpent);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Отслеживание скролла
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.floor((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
        maxScrollDepth = scrollPercent;
        trackScrollDepth(scrollPercent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Отслеживание кликов по важным элементам
    const handleClick = (e) => {
      const target = e.target.closest('button, a, [data-track]');
      if (!target) return;

      const trackingData = target.dataset.track;
      if (trackingData) {
        try {
          const data = JSON.parse(trackingData);
          trackEvent('element_click', {
            category: 'interaction',
            label: data.label || target.textContent?.slice(0, 50),
            element_type: target.tagName.toLowerCase(),
            ...data,
          });
        } catch (e) {
          // Если не JSON, используем как label
          trackEvent('element_click', {
            category: 'interaction',
            label: trackingData,
            element_type: target.tagName.toLowerCase(),
          });
        }
      }
    };

    document.addEventListener('click', handleClick);

    // Очистка
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null; // Этот компонент не рендерит ничего
}

export default AnalyticsTracker;
