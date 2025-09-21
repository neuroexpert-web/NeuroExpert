/**
 * Advanced monitoring system for NeuroExpert Platform
 * Includes metrics collection, alerting, and health monitoring
 */

import { createLogger } from './logger';

const logger = createLogger('Monitoring');

// Metrics collection
class MetricsCollector {
  constructor() {
    this.metrics = new Map();
    this.alerts = new Map();
    this.thresholds = {
      responseTime: 2000, // 2 seconds
      errorRate: 0.05, // 5%
      memoryUsage: 0.8, // 80%
      cpuUsage: 0.8, // 80%
    };
  }

  // Record metric
  record(name, value, tags = {}) {
    const timestamp = Date.now();
    const key = `${name}:${JSON.stringify(tags)}`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metricData = this.metrics.get(key);
    metricData.push({ value, timestamp });
    
    // Keep only last 1000 data points
    if (metricData.length > 1000) {
      metricData.shift();
    }
    
    // Check thresholds
    this.checkThresholds(name, value, tags);
  }

  // Increment counter
  increment(name, tags = {}) {
    const key = `${name}:${JSON.stringify(tags)}`;
    const current = this.getLatestValue(key) || 0;
    this.record(name, current + 1, tags);
  }

  // Record timing
  timing(name, duration, tags = {}) {
    this.record(name, duration, { ...tags, type: 'timing' });
  }

  // Record gauge (current value)
  gauge(name, value, tags = {}) {
    this.record(name, value, { ...tags, type: 'gauge' });
  }

  // Get latest value
  getLatestValue(key) {
    const data = this.metrics.get(key);
    return data && data.length > 0 ? data[data.length - 1].value : null;
  }

  // Get metric statistics
  getStats(name, tags = {}) {
    const key = `${name}:${JSON.stringify(tags)}`;
    const data = this.metrics.get(key);
    
    if (!data || data.length === 0) {
      return null;
    }
    
    const values = data.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Calculate percentiles
    const sorted = values.sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    
    return {
      count: values.length,
      sum,
      avg,
      min,
      max,
      p50,
      p90,
      p95,
      p99
    };
  }

  // Check thresholds and trigger alerts
  checkThresholds(name, value, tags) {
    const threshold = this.thresholds[name];
    if (!threshold) return;
    
    const alertKey = `${name}:${JSON.stringify(tags)}`;
    
    if (value > threshold) {
      if (!this.alerts.has(alertKey)) {
        this.triggerAlert(name, value, threshold, tags);
        this.alerts.set(alertKey, Date.now());
      }
    } else {
      // Clear alert if value is back to normal
      if (this.alerts.has(alertKey)) {
        this.clearAlert(name, tags);
        this.alerts.delete(alertKey);
      }
    }
  }

  // Trigger alert
  async triggerAlert(metric, value, threshold, tags) {
    const alert = {
      metric,
      value,
      threshold,
      tags,
      timestamp: Date.now(),
      severity: value > threshold * 1.5 ? 'critical' : 'warning'
    };
    
    logger.error(`Alert triggered: ${metric}`, alert);
    
    // Send to external alerting systems
    await this.sendToAlertingSystems(alert);
  }

  // Clear alert
  clearAlert(metric, tags) {
    logger.info(`Alert cleared: ${metric}`, { tags });
  }

  // Send alerts to external systems
  async sendToAlertingSystems(alert) {
    try {
      // Send to Telegram if configured
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        await this.sendTelegramAlert(alert);
      }
      
      // Send to Sentry if configured
      if (process.env.SENTRY_DSN) {
        await this.sendSentryAlert(alert);
      }
      
      // Send to webhook if configured
      if (process.env.ALERT_WEBHOOK_URL) {
        await this.sendWebhookAlert(alert);
      }
    } catch (error) {
      logger.error('Failed to send alert', { error: error.message });
    }
  }

  // Send Telegram alert
  async sendTelegramAlert(alert) {
    const message = `🚨 *Alert: ${alert.metric}*\n\n` +
      `Value: ${alert.value}\n` +
      `Threshold: ${alert.threshold}\n` +
      `Severity: ${alert.severity}\n` +
      `Time: ${new Date(alert.timestamp).toISOString()}\n` +
      `Tags: ${JSON.stringify(alert.tags)}`;
    
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }
  }

  // Send Sentry alert
  async sendSentryAlert(alert) {
    if (typeof Sentry !== 'undefined') {
      Sentry.captureMessage(`Alert: ${alert.metric}`, {
        level: alert.severity === 'critical' ? 'error' : 'warning',
        tags: alert.tags,
        extra: {
          value: alert.value,
          threshold: alert.threshold,
          timestamp: alert.timestamp
        }
      });
    }
  }

  // Send webhook alert
  async sendWebhookAlert(alert) {
    const response = await fetch(process.env.ALERT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    });
    
    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }
  }

  // Get all metrics summary
  getAllMetrics() {
    const summary = {};
    
    for (const [key, data] of this.metrics.entries()) {
      const [name, tagsStr] = key.split(':');
      const tags = JSON.parse(tagsStr);
      
      if (!summary[name]) {
        summary[name] = [];
      }
      
      summary[name].push({
        tags,
        stats: this.getStats(name, tags),
        latest: data[data.length - 1]
      });
    }
    
    return summary;
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor(metricsCollector) {
    this.metrics = metricsCollector;
    this.observers = new Map();
    this.setupObservers();
  }

  setupObservers() {
    if (typeof window === 'undefined') return;

    // Performance Observer for navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              this.recordNavigationTiming(entry);
            }
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navObserver);
      } catch (error) {
        logger.warn('Navigation observer not supported', { error: error.message });
      }

      // Performance Observer for paint timing
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.timing(entry.name, entry.startTime, { type: 'paint' });
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', paintObserver);
      } catch (error) {
        logger.warn('Paint observer not supported', { error: error.message });
      }

      // Performance Observer for LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.timing('largest-contentful-paint', lastEntry.startTime, { type: 'lcp' });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (error) {
        logger.warn('LCP observer not supported', { error: error.message });
      }

      // Performance Observer for FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.timing('first-input-delay', entry.processingStart - entry.startTime, { type: 'fid' });
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (error) {
        logger.warn('FID observer not supported', { error: error.message });
      }

      // Performance Observer for CLS
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.metrics.gauge('cumulative-layout-shift', clsValue, { type: 'cls' });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (error) {
        logger.warn('CLS observer not supported', { error: error.message });
      }
    }

    // Memory usage monitoring
    this.monitorMemoryUsage();
    
    // Error monitoring
    this.setupErrorMonitoring();
  }

  recordNavigationTiming(entry) {
    const timings = {
      'dns-lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'tcp-connection': entry.connectEnd - entry.connectStart,
      'ssl-negotiation': entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
      'request-time': entry.responseStart - entry.requestStart,
      'response-time': entry.responseEnd - entry.responseStart,
      'dom-processing': entry.domContentLoadedEventEnd - entry.responseEnd,
      'resource-loading': entry.loadEventStart - entry.domContentLoadedEventEnd,
      'total-load-time': entry.loadEventEnd - entry.navigationStart
    };

    for (const [name, value] of Object.entries(timings)) {
      if (value >= 0) {
        this.metrics.timing(name, value, { type: 'navigation' });
      }
    }
  }

  monitorMemoryUsage() {
    if (typeof performance !== 'undefined' && performance.memory) {
      const recordMemory = () => {
        const memory = performance.memory;
        this.metrics.gauge('memory-used', memory.usedJSHeapSize, { type: 'memory' });
        this.metrics.gauge('memory-total', memory.totalJSHeapSize, { type: 'memory' });
        this.metrics.gauge('memory-limit', memory.jsHeapSizeLimit, { type: 'memory' });
        
        const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        this.metrics.gauge('memory-usage-ratio', usageRatio, { type: 'memory' });
      };

      recordMemory();
      setInterval(recordMemory, 30000); // Every 30 seconds
    }
  }

  setupErrorMonitoring() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.metrics.increment('javascript-errors', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.increment('unhandled-promise-rejections', {
        reason: event.reason?.toString() || 'Unknown'
      });
    });
  }

  disconnect() {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
  }
}

// API monitoring middleware
export function createAPIMonitoringMiddleware(metricsCollector) {
  return (req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;
    
    res.send = function(data) {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;
      
      // Record metrics
      metricsCollector.timing('api-response-time', duration, {
        method: req.method,
        route: req.route?.path || req.path,
        status: statusCode
      });
      
      metricsCollector.increment('api-requests', {
        method: req.method,
        route: req.route?.path || req.path,
        status: statusCode
      });
      
      if (statusCode >= 400) {
        metricsCollector.increment('api-errors', {
          method: req.method,
          route: req.route?.path || req.path,
          status: statusCode
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}

// Global instances
export const metricsCollector = new MetricsCollector();
export const performanceMonitor = new PerformanceMonitor(metricsCollector);

// Auto-start monitoring in browser
if (typeof window !== 'undefined') {
  // Start monitoring after page load
  window.addEventListener('load', () => {
    logger.info('Monitoring system initialized');
    
    // Report metrics every 5 minutes
    setInterval(() => {
      const metrics = metricsCollector.getAllMetrics();
      logger.info('Performance metrics report', metrics);
    }, 5 * 60 * 1000);
  });
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    performanceMonitor.disconnect();
  });
}

export default {
  MetricsCollector,
  PerformanceMonitor,
  createAPIMonitoringMiddleware,
  metricsCollector,
  performanceMonitor
};