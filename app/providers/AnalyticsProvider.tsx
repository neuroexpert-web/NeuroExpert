'use client';

import { useEffect } from 'react';
import { analytics } from '../utils/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Инициализация аналитики с конфигурацией из env
    analytics.init({
      googleAnalytics: process.env.NEXT_PUBLIC_GA_ID ? { id: process.env.NEXT_PUBLIC_GA_ID } : undefined,
      yandexMetrica: process.env.NEXT_PUBLIC_YM_ID ? { id: process.env.NEXT_PUBLIC_YM_ID } : undefined,
      sentry: process.env.NEXT_PUBLIC_SENTRY_DSN ? { dsn: process.env.NEXT_PUBLIC_SENTRY_DSN } : undefined,
      hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID ? { id: process.env.NEXT_PUBLIC_HOTJAR_ID } : undefined,
      custom: { endpoint: '/api/analytics' }
    }, undefined, process.env.NODE_ENV === 'development');

    // Отслеживаем первый page view
    analytics.track('page_view', 'initial_page_view', {
      url: window.location.href,
      referrer: document.referrer
    });

    // Отслеживаем время на странице
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime;
      analytics.track('page_view', 'page_exit', {
        time_on_page_ms: timeOnPage,
        url: window.location.href
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return <>{children}</>;
}