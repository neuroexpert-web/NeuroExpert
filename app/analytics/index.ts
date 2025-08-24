/**
 * Centralized Analytics Architecture for NeuroExpert
 * Handles multiple analytics services with configurable setup
 */

import { GoogleAnalytics } from './services/google-analytics';
import { YandexMetrica } from './services/yandex-metrica';
// import { SentryAnalytics } from './services/sentry';
// import { AppMetrica } from './services/appmetrica';
// import { OpenReplay } from './services/openreplay';
// import { HotjarAnalytics } from './services/hotjar';
import { AnalyticsQueue } from './queue';
import { AnalyticsConfig, AnalyticsEvent, AnalyticsService } from './types';

export class AnalyticsManager {
  private services: Map<string, AnalyticsService> = new Map();
  private queue: AnalyticsQueue;
  private config: AnalyticsConfig;
  private isInitialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.queue = new AnalyticsQueue(config.queue);
    this.initializeServices();
  }

  private initializeServices(): void {
    const { services } = this.config;

    // Google Analytics
    if (services.googleAnalytics?.enabled) {
      this.services.set('google', new GoogleAnalytics(services.googleAnalytics));
    }

    // Яндекс.Метрика
    if (services.yandexMetrica?.enabled) {
      this.services.set('yandex', new YandexMetrica(services.yandexMetrica));
    }

    // Sentry
    // if (services.sentry?.enabled) {
    //   this.services.set('sentry', new SentryAnalytics(services.sentry));
    // }

    // AppMetrica
    // if (services.appMetrica?.enabled) {
    //   this.services.set('appmetrica', new AppMetrica(services.appMetrica));
    // }

    // OpenReplay
    // if (services.openReplay?.enabled) {
    //   this.services.set('openreplay', new OpenReplay(services.openReplay));
    // }

    // Hotjar
    // if (services.hotjar?.enabled) {
    //   this.services.set('hotjar', new HotjarAnalytics(services.hotjar));
    // }

    this.isInitialized = true;
  }

  /**
   * Track an analytics event across all enabled services
   */
  public track(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    // Add to queue for batch processing
    this.queue.add(event);

    // Process immediately if critical
    if (event.priority === 'high') {
      this.processEvent(event);
    }
  }

  /**
   * Process a single event
   */
  private async processEvent(event: AnalyticsEvent): Promise<void> {
    const promises = Array.from(this.services.values()).map(service => 
      service.track(event).catch(error => {
        console.error(`Analytics error for ${service.name}:`, error);
        // Send error to Sentry if available
        this.services.get('sentry')?.trackError(error, {
          service: service.name,
          event
        });
      })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Process queued events
   */
  public async flush(): Promise<void> {
    const events = this.queue.flush();
    await Promise.all(events.map(event => this.processEvent(event)));
  }

  /**
   * Track page/section view
   */
  public trackPageView(page: string, metadata?: Record<string, any>): void {
    this.track({
      type: 'page_view',
      name: page,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      }
    });
  }

  /**
   * Track swipe interaction
   */
  public trackSwipe(direction: string, from: string, to: string, method: string): void {
    this.track({
      type: 'swipe',
      name: `swipe_${direction}`,
      metadata: {
        direction,
        from_section: from,
        to_section: to,
        method, // touch, keyboard, button
        timestamp: Date.now()
      },
      priority: 'medium'
    });
  }

  /**
   * Track user engagement metrics
   */
  public trackEngagement(metric: string, value: number, metadata?: Record<string, any>): void {
    this.track({
      type: 'engagement',
      name: metric,
      value,
      metadata: {
        ...metadata,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Track errors
   */
  public trackError(error: Error, context?: Record<string, any>): void {
    this.track({
      type: 'error',
      name: error.name,
      metadata: {
        message: error.message,
        stack: error.stack,
        ...context,
        timestamp: Date.now()
      },
      priority: 'high'
    });
  }

  /**
   * Get analytics dashboard data
   */
  public async getDashboardData(timeRange: { start: Date; end: Date }): Promise<any> {
    const data = await Promise.all(
      Array.from(this.services.values()).map(service => 
        service.getMetrics?.(timeRange).catch(() => null)
      )
    );

    return {
      services: Array.from(this.services.keys()),
      timeRange,
      data: data.filter(Boolean),
      timestamp: Date.now()
    };
  }

  /**
   * Export historical data
   */
  public async exportData(format: 'json' | 'csv', timeRange?: { start: Date; end: Date }): Promise<Blob> {
    const data = await this.getDashboardData(
      timeRange || { 
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
        end: new Date() 
      }
    );

    if (format === 'json') {
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    } else {
      // Convert to CSV
      const csv = this.convertToCSV(data);
      return new Blob([csv], { type: 'text/csv' });
    }
  }

  private convertToCSV(data: any): string {
    // Implementation for CSV conversion
    const headers = ['Service', 'Metric', 'Value', 'Timestamp'];
    const rows = [];
    
    // Convert data to CSV format
    // ... implementation details
    
    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Update configuration dynamically
   */
  public updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.services.clear();
    this.initializeServices();
  }

  /**
   * Cleanup and destroy
   */
  public destroy(): void {
    this.queue.destroy();
    this.services.forEach(service => service.destroy?.());
    this.services.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
let analyticsInstance: AnalyticsManager | null = null;

/**
 * Get or create analytics instance
 */
export function getAnalytics(config?: AnalyticsConfig): AnalyticsManager {
  if (!analyticsInstance) {
    // Default config for initialization
    const defaultConfig: AnalyticsConfig = {
      services: {
        googleAnalytics: {
          enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
          measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
        },
        yandexMetrica: {
          enabled: !!process.env.NEXT_PUBLIC_YM_COUNTER_ID,
          counterId: process.env.NEXT_PUBLIC_YM_COUNTER_ID || ''
        }
      },
      queue: {
        maxSize: 1000,
        flushInterval: 5000,
        maxRetries: 3,
        batchSize: 50,
        debounceTime: 300,
        throttleTime: 1000
      },
      privacy: {
        anonymizeIp: true,
        respectDoNotTrack: true,
        cookieConsent: true,
        dataRetention: 90
      },
      performance: {
        enableDebugMode: false,
        sampleRate: 1,
        enableAutoPageTracking: false
      }
    };
    
    analyticsInstance = new AnalyticsManager(config || defaultConfig);
  }
  
  return analyticsInstance;
}

// Export types
export * from './types';
export { AnalyticsQueue } from './queue';
export { SecurityManager } from './security';