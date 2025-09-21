/**
 * Enhanced Performance Insights for NeuroExpert Platform
 * Integrates with Vercel Speed Insights and provides detailed analytics
 */

import { createLogger } from './logger';

const logger = createLogger('PerformanceInsights');

// Performance thresholds based on Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,      // <= 2.5s
    needsWork: 4000  // 2.5s - 4s
  },
  // First Input Delay (FID)
  FID: {
    good: 100,       // <= 100ms
    needsWork: 300   // 100ms - 300ms
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,       // <= 0.1
    needsWork: 0.25  // 0.1 - 0.25
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,      // <= 1.8s
    needsWork: 3000  // 1.8s - 3s
  },
  // Interaction to Next Paint (INP)
  INP: {
    good: 200,       // <= 200ms
    needsWork: 500   // 200ms - 500ms
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,       // <= 800ms
    needsWork: 1800  // 800ms - 1.8s
  }
};

class PerformanceInsights {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    
    this.setupPerformanceObservers();
    this.setupNavigationObserver();
    this.setupResourceObserver();
    this.setupUserInteractionTracking();
    
    this.isInitialized = true;
    logger.info('Performance Insights initialized');
  }

  setupPerformanceObservers() {
    if (!('PerformanceObserver' in window)) {
      logger.warn('PerformanceObserver not supported');
      return;
    }

    // Core Web Vitals Observer
    try {
      const webVitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordWebVital(entry);
        }
      });

      // Observe different entry types
      const entryTypes = [
        'largest-contentful-paint',
        'first-input',
        'layout-shift',
        'paint',
        'navigation',
        'measure'
      ];

      entryTypes.forEach(type => {
        try {
          webVitalsObserver.observe({ entryTypes: [type] });
        } catch (e) {
          logger.debug(`Entry type ${type} not supported`);
        }
      });

      this.observers.set('webVitals', webVitalsObserver);
    } catch (error) {
      logger.error('Failed to setup web vitals observer', error);
    }
  }

  setupNavigationObserver() {
    // Navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.recordNavigationMetrics(navigation);
      }
    });
  }

  setupResourceObserver() {
    // Resource timing observer
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordResourceMetric(entry);
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      logger.error('Failed to setup resource observer', error);
    }
  }

  setupUserInteractionTracking() {
    // Track user interactions
    ['click', 'scroll', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        this.recordUserInteraction(eventType, event);
      }, { passive: true });
    });
  }

  recordWebVital(entry) {
    const metricName = entry.entryType;
    let value = entry.value || entry.startTime;
    
    // Normalize metric names
    const normalizedName = this.normalizeMetricName(metricName);
    
    // Calculate rating
    const rating = this.calculateRating(normalizedName, value);
    
    const metric = {
      name: normalizedName,
      value: Math.round(value),
      rating,
      timestamp: Date.now(),
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    this.metrics.set(normalizedName, metric);
    
    // Send to analytics
    this.sendToAnalytics('web_vital', metric);
    
    // Log significant metrics
    if (rating === 'poor') {
      logger.warn(`Poor ${normalizedName}: ${value}ms`, metric);
    } else if (rating === 'good') {
      logger.info(`Good ${normalizedName}: ${value}ms`);
    }
  }

  recordNavigationMetrics(navigation) {
    const metrics = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ssl: navigation.secureConnectionStart > 0 
        ? navigation.connectEnd - navigation.secureConnectionStart 
        : 0,
      ttfb: navigation.responseStart - navigation.requestStart,
      domProcessing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      resourceLoading: navigation.loadEventStart - navigation.domContentLoadedEventEnd,
      totalPageLoad: navigation.loadEventEnd - navigation.navigationStart
    };

    Object.entries(metrics).forEach(([name, value]) => {
      if (value >= 0) {
        const metric = {
          name: `navigation_${name}`,
          value: Math.round(value),
          rating: this.calculateRating(`navigation_${name}`, value),
          timestamp: Date.now(),
          url: window.location.pathname
        };
        
        this.metrics.set(metric.name, metric);
        this.sendToAnalytics('navigation_timing', metric);
      }
    });
  }

  recordResourceMetric(entry) {
    // Track slow resources
    const duration = entry.responseEnd - entry.startTime;
    
    if (duration > 1000) { // Resources taking more than 1s
      const metric = {
        name: 'slow_resource',
        value: Math.round(duration),
        resource: entry.name,
        type: entry.initiatorType,
        size: entry.transferSize,
        timestamp: Date.now(),
        url: window.location.pathname
      };
      
      this.sendToAnalytics('slow_resource', metric);
      logger.warn(`Slow resource: ${entry.name} (${duration}ms)`);
    }
  }

  recordUserInteraction(type, event) {
    // Track interaction patterns
    const interaction = {
      type,
      timestamp: Date.now(),
      url: window.location.pathname,
      target: event.target?.tagName || 'unknown'
    };
    
    // Throttle interaction tracking
    if (!this.lastInteraction || Date.now() - this.lastInteraction > 1000) {
      this.sendToAnalytics('user_interaction', interaction);
      this.lastInteraction = Date.now();
    }
  }

  normalizeMetricName(entryType) {
    const nameMap = {
      'largest-contentful-paint': 'LCP',
      'first-input': 'FID',
      'layout-shift': 'CLS',
      'paint': 'FCP',
      'navigation': 'Navigation'
    };
    
    return nameMap[entryType] || entryType;
  }

  calculateRating(metricName, value) {
    const threshold = PERFORMANCE_THRESHOLDS[metricName];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsWork) return 'needs-improvement';
    return 'poor';
  }

  getConnectionType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  sendToAnalytics(eventType, data) {
    // Send to multiple analytics platforms
    try {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', eventType, {
          custom_parameter: JSON.stringify(data)
        });
      }
      
      // Custom analytics endpoint
      if (typeof fetch !== 'undefined') {
        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType, data })
        }).catch(error => {
          logger.debug('Failed to send to custom analytics', error);
        });
      }
      
      // Vercel Analytics (if available)
      if (typeof window !== 'undefined' && window.va) {
        window.va('track', eventType, data);
      }
      
    } catch (error) {
      logger.debug('Analytics send failed', error);
    }
  }

  getPerformanceSummary() {
    const summary = {
      coreWebVitals: {},
      navigationTiming: {},
      resourceTiming: {},
      overallScore: 0,
      recommendations: []
    };

    // Core Web Vitals
    ['LCP', 'FID', 'CLS', 'FCP', 'INP', 'TTFB'].forEach(metric => {
      const data = this.metrics.get(metric);
      if (data) {
        summary.coreWebVitals[metric] = {
          value: data.value,
          rating: data.rating,
          threshold: PERFORMANCE_THRESHOLDS[metric]
        };
      }
    });

    // Calculate overall score
    const scores = Object.values(summary.coreWebVitals).map(m => {
      switch (m.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 75;
        case 'poor': return 25;
        default: return 50;
      }
    });
    
    summary.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Generate recommendations
    summary.recommendations = this.generateRecommendations(summary.coreWebVitals);

    return summary;
  }

  generateRecommendations(vitals) {
    const recommendations = [];

    if (vitals.LCP?.rating === 'poor') {
      recommendations.push({
        metric: 'LCP',
        issue: 'Медленная загрузка основного контента',
        solution: 'Оптимизируйте изображения, используйте CDN, улучшите серверный ответ'
      });
    }

    if (vitals.FID?.rating === 'poor') {
      recommendations.push({
        metric: 'FID',
        issue: 'Медленная реакция на действия пользователя',
        solution: 'Уменьшите JavaScript, используйте Web Workers, оптимизируйте event handlers'
      });
    }

    if (vitals.CLS?.rating === 'poor') {
      recommendations.push({
        metric: 'CLS',
        issue: 'Нестабильность макета страницы',
        solution: 'Задайте размеры изображений, избегайте динамической вставки контента'
      });
    }

    return recommendations;
  }

  // Public API methods
  trackCustomMetric(name, value, metadata = {}) {
    const metric = {
      name: `custom_${name}`,
      value,
      timestamp: Date.now(),
      url: window.location.pathname,
      ...metadata
    };
    
    this.metrics.set(metric.name, metric);
    this.sendToAnalytics('custom_metric', metric);
  }

  getMetric(name) {
    return this.metrics.get(name);
  }

  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.isInitialized = false;
  }
}

// Global instance
export const performanceInsights = new PerformanceInsights();

// Helper functions for easy use
export const trackCustomMetric = (name, value, metadata) => {
  performanceInsights.trackCustomMetric(name, value, metadata);
};

export const getPerformanceSummary = () => {
  return performanceInsights.getPerformanceSummary();
};

export const getMetric = (name) => {
  return performanceInsights.getMetric(name);
};

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  // Report performance summary after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const summary = performanceInsights.getPerformanceSummary();
      logger.info('Performance Summary', summary);
      
      // Show performance notifications if needed
      if (summary.overallScore < 50) {
        console.warn('⚠️ Производительность сайта требует улучшения', summary);
      } else if (summary.overallScore > 90) {
        console.log('🚀 Отличная производительность сайта!', summary);
      }
    }, 3000);
  });
}

export default performanceInsights;