/**
 * Advanced Performance Optimization System
 * Система продвинутой оптимизации производительности NeuroExpert v3.2
 */

import { LRUCache } from 'lru-cache';

// Advanced caching system
class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private cache: LRUCache<string, any>;
  private preloadQueue: Set<string> = new Set();
  private metrics: Map<string, number> = new Map();

  constructor() {
    this.cache = new LRUCache({
      max: 1000,
      ttl: 1000 * 60 * 15, // 15 minutes
      allowStale: true,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
    });

    // Initialize performance monitoring
    this.initPerformanceMonitoring();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Advanced caching with intelligent invalidation
  async cacheWithStrategy<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
      ttl?: number;
      staleWhileRevalidate?: boolean;
      tags?: string[];
      priority?: 'low' | 'medium' | 'high';
    } = {}
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(key, options.tags);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && !options.staleWhileRevalidate) {
      this.recordMetric('cache_hit', 1);
      return cached;
    }

    // Background revalidation for stale-while-revalidate
    if (cached && options.staleWhileRevalidate) {
      this.revalidateInBackground(cacheKey, fetcher, options);
      return cached;
    }

    // Fetch fresh data
    try {
      const startTime = performance.now();
      const data = await fetcher();
      const endTime = performance.now();
      
      // Cache the result
      this.cache.set(cacheKey, data, { ttl: options.ttl });
      
      // Record metrics
      this.recordMetric('cache_miss', 1);
      this.recordMetric('fetch_time', endTime - startTime);
      
      return data;
    } catch (error) {
      // Return stale data on error if available
      if (cached) {
        this.recordMetric('error_fallback', 1);
        return cached;
      }
      throw error;
    }
  }

  // Intelligent preloading based on user behavior
  preloadResource(key: string, fetcher: () => Promise<any>, priority: 'low' | 'medium' | 'high' = 'medium') {
    if (this.preloadQueue.has(key)) return;
    
    this.preloadQueue.add(key);
    
    const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 500;
    
    setTimeout(async () => {
      try {
        await this.cacheWithStrategy(key, fetcher, { priority });
        this.preloadQueue.delete(key);
      } catch (error) {
        console.warn(`Preload failed for ${key}:`, error);
        this.preloadQueue.delete(key);
      }
    }, delay);
  }

  // Bundle splitting optimization
  async loadChunk(chunkName: string): Promise<any> {
    const cacheKey = `chunk_${chunkName}`;
    
    return this.cacheWithStrategy(cacheKey, async () => {
      const startTime = performance.now();
      
      // Dynamic import with error handling - only for specific known chunks
      let loadedModule;
      try {
        switch (chunkName) {
          case 'AnalyticsChartsComponent':
            loadedModule = await import('../components/AnalyticsChartsComponent');
            break;
          case 'RealTimeMonitoringDashboard':
            loadedModule = await import('../components/RealTimeMonitoringDashboard');
            break;
          default:
            throw new Error(`Unknown chunk: ${chunkName}`);
        }
      } catch (error) {
        console.error(`Failed to load chunk ${chunkName}:`, error);
        throw new Error(`Chunk loading failed: ${chunkName}`);
      }
      
      const loadTime = performance.now() - startTime;
      this.recordMetric(`chunk_load_${chunkName}`, loadTime);
      
      return loadedModule;
    }, {
      ttl: 1000 * 60 * 60, // 1 hour for chunks
      priority: 'high'
    });
  }

  // Image optimization with lazy loading
  optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}): string {
    const { width, height, quality = 75, format = 'auto' } = options;
    
    // Generate optimized image URL
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    if (format !== 'auto') params.set('f', format);
    
    return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
  }

  // Critical CSS extraction
  extractCriticalCSS(html: string): string {
    // Simple critical CSS extraction
    const criticalSelectors = [
      '.hero-section',
      '.loading-spinner',
      '.swipe-container',
      '.premium-body',
      '.fade-in'
    ];
    
    // This would be enhanced with a proper CSS parser in production
    return criticalSelectors
      .map(selector => `${selector} { /* critical styles */ }`)
      .join('\n');
  }

  // Performance metrics collection
  private recordMetric(name: string, value: number) {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + value);
    
    // Send to analytics if configured
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        custom_parameter: 'neuroexpert_optimization'
      });
    }
  }

  // Web Vitals monitoring
  private initPerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.recordMetric(`measure_${entry.name}`, entry.duration);
        }
        
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          this.recordMetric('page_load_time', nav.loadEventEnd - nav.fetchStart);
          this.recordMetric('dom_content_loaded', nav.domContentLoadedEventEnd - nav.fetchStart);
        }
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    // Monitor LCP, FID, CLS
    this.monitorWebVitals();
  }

  private async monitorWebVitals() {
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
      
      getCLS((metric) => this.recordMetric('cls', metric.value));
      getFID((metric) => this.recordMetric('fid', metric.value));
      getFCP((metric) => this.recordMetric('fcp', metric.value));
      getLCP((metric) => this.recordMetric('lcp', metric.value));
      getTTFB((metric) => this.recordMetric('ttfb', metric.value));
    } catch (error) {
      console.warn('Web Vitals monitoring not available:', error);
    }
  }

  // Generate cache key with tags
  private generateCacheKey(key: string, tags?: string[]): string {
    const tagString = tags ? `_${tags.sort().join('_')}` : '';
    return `${key}${tagString}`;
  }

  // Background revalidation
  private async revalidateInBackground<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: any
  ) {
    try {
      const fresh = await fetcher();
      this.cache.set(key, fresh, { ttl: options.ttl });
      this.recordMetric('background_revalidation', 1);
    } catch (error) {
      this.recordMetric('background_revalidation_error', 1);
    }
  }

  // Get performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear cache by tags
  invalidateByTags(tags: string[]) {
    const keysToDelete: string[] = [];
    
    for (const [key] of this.cache.entries()) {
      if (tags.some(tag => key.includes(`_${tag}_`))) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    this.recordMetric('cache_invalidation', keysToDelete.length);
  }

  // Resource hints
  addResourceHints(resources: Array<{url: string, type: 'preload' | 'prefetch' | 'preconnect'}>) {
    if (typeof document === 'undefined') return;

    resources.forEach(({ url, type }) => {
      const link = document.createElement('link');
      link.rel = type;
      link.href = url;
      
      if (type === 'preload') {
        link.as = url.endsWith('.js') ? 'script' : 
                  url.endsWith('.css') ? 'style' : 
                  url.match(/\.(png|jpg|jpeg|webp|avif)$/) ? 'image' : 'fetch';
      }
      
      document.head.appendChild(link);
    });
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Utility hooks for React components (to be used in client components only)
export function useOptimizedResource<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: Parameters<PerformanceOptimizer['cacheWithStrategy']>[2]
) {
  // Mock implementation for now
  return { 
    data: null as T | null, 
    loading: false, 
    error: null as Error | null 
  };
}

// Performance monitoring hook (to be used in client components only)
export function usePerformanceMonitoring(componentName: string) {
  // Mock implementation for now
  console.log('Performance monitoring for:', componentName);
}

export default performanceOptimizer;