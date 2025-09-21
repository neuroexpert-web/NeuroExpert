/**
 * LazyLoader - компонент для ленивой загрузки других компонентов
 * Улучшает производительность за счет code splitting
 */
'use client';

import { lazy, Suspense, ComponentType, ReactNode, useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface LazyLoaderProps {
  fallback?: ReactNode;
  errorFallback?: ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

// Компонент загрузки по умолчанию
const DefaultLoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Загрузка...</span>
  </div>
);

// Компонент ошибки по умолчанию
const DefaultErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-4 border border-red-300 rounded-lg bg-red-50">
    <h3 className="text-red-800 font-semibold">Ошибка загрузки компонента</h3>
    <p className="text-red-600 text-sm mt-1">{error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
    >
      Попробовать снова
    </button>
  </div>
);

/**
 * Создает ленивый компонент с обработкой ошибок
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoaderProps = {}
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    const {
      fallback = <DefaultLoadingSpinner />,
      errorFallback = DefaultErrorFallback
    } = options;
    
    return (
      <ErrorBoundary FallbackComponent={errorFallback}>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

/**
 * Хук для предзагрузки компонентов
 */
export function usePrefetch(importFns: (() => Promise<any>)[]) {
  const prefetch = () => {
    importFns.forEach(fn => {
      // Предзагружаем компоненты в idle time
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => fn());
      } else {
        setTimeout(() => fn(), 100);
      }
    });
  };

  return { prefetch };
}

/**
 * Компонент для отложенной загрузки контента при скролле
 */
export function LazyOnScroll({ 
  children, 
  threshold = 0.1,
  rootMargin = '50px'
}: {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-32 bg-gray-100 animate-pulse rounded" />}
    </div>
  );
}

// Предзагруженные компоненты для критических частей
export const LazyPricingCalculator = createLazyComponent(
  () => import('../PricingCalculator'),
  { fallback: <div className="h-64 bg-gray-100 animate-pulse rounded-lg" /> }
);

export const LazyAnalyticsDashboard = createLazyComponent(
  () => import('../AnalyticsDashboard'),
  { fallback: <div className="h-96 bg-gray-100 animate-pulse rounded-lg" /> }
);

export const LazyContactForm = createLazyComponent(
  () => import('../ContactForm'),
  { fallback: <div className="h-80 bg-gray-100 animate-pulse rounded-lg" /> }
);

export default LazyLoader;