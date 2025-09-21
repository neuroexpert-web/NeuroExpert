/**
 * Performance utilities для оптимизации NeuroExpert Platform
 */

// Debounce функция для ограничения частоты вызовов
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle функция для ограничения частоты выполнения
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Мемоизация функций
export function memoize(fn, getKey = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = getKey(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    // Ограничиваем размер кэша
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
}

// Intersection Observer для lazy loading
export class LazyLoadObserver {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options);
    this.elements = new Set();
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.callback(entry.target);
        this.unobserve(entry.target);
      }
    });
  }
  
  observe(element) {
    this.elements.add(element);
    this.observer.observe(element);
  }
  
  unobserve(element) {
    this.elements.delete(element);
    this.observer.unobserve(element);
  }
  
  disconnect() {
    this.observer.disconnect();
    this.elements.clear();
  }
}

// Предзагрузка ресурсов
export function preloadResource(href, as = 'script', crossorigin = null) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;
    
    link.onload = resolve;
    link.onerror = reject;
    
    document.head.appendChild(link);
  });
}

// Динамический импорт с retry логикой
export async function dynamicImport(importFn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

// Мониторинг производительности
export class PerformanceMonitor {
  constructor() {
    this.marks = new Map();
    this.measures = new Map();
  }
  
  mark(name) {
    const timestamp = performance.now();
    this.marks.set(name, timestamp);
    
    if (typeof performance.mark === 'function') {
      performance.mark(name);
    }
    
    return timestamp;
  }
  
  measure(name, startMark, endMark) {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();
    
    if (!start) {
      console.warn(`Start mark "${startMark}" not found`);
      return null;
    }
    
    const duration = end - start;
    this.measures.set(name, duration);
    
    if (typeof performance.measure === 'function') {
      performance.measure(name, startMark, endMark);
    }
    
    return duration;
  }
  
  getMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      // Navigation timing
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      
      // Paint timing
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
      
      // Custom measures
      customMeasures: Object.fromEntries(this.measures),
      
      // Memory usage (if available)
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }
  
  report() {
    const metrics = this.getMetrics();
    console.group('🚀 Performance Metrics');
    console.table(metrics);
    console.groupEnd();
    
    // Отправка метрик в аналитику
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metrics', {
        custom_parameter: JSON.stringify(metrics)
      });
    }
    
    return metrics;
  }
}

// Оптимизация изображений
export function optimizeImage(src, options = {}) {
  const {
    width,
    height,
    quality = 75,
    format = 'webp',
    fit = 'cover'
  } = options;
  
  // Если используется внешний сервис оптимизации
  const params = new URLSearchParams();
  if (width) params.set('w', width);
  if (height) params.set('h', height);
  if (quality) params.set('q', quality);
  if (format) params.set('f', format);
  if (fit) params.set('fit', fit);
  
  return `${src}?${params.toString()}`;
}

// Кэширование API запросов
export class APICache {
  constructor(maxAge = 5 * 60 * 1000) { // 5 минут по умолчанию
    this.cache = new Map();
    this.maxAge = maxAge;
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Ограничиваем размер кэша
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

// Глобальные экземпляры
export const performanceMonitor = new PerformanceMonitor();
export const apiCache = new APICache();

// Автоматический мониторинг при загрузке
if (typeof window !== 'undefined') {
  // Отмечаем начало загрузки
  performanceMonitor.mark('app-start');
  
  // Мониторинг завершения загрузки
  window.addEventListener('load', () => {
    performanceMonitor.mark('app-loaded');
    performanceMonitor.measure('total-load-time', 'app-start', 'app-loaded');
    
    // Отчет через 2 секунды после загрузки
    setTimeout(() => {
      performanceMonitor.report();
    }, 2000);
  });
  
  // Мониторинг ошибок
  window.addEventListener('error', (event) => {
    console.error('Performance: Script error detected', event.error);
  });
  
  // Мониторинг unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Performance: Unhandled promise rejection', event.reason);
  });
}

export default {
  debounce,
  throttle,
  memoize,
  LazyLoadObserver,
  preloadResource,
  dynamicImport,
  PerformanceMonitor,
  optimizeImage,
  APICache,
  performanceMonitor,
  apiCache
};