/**
 * Yandex Metrica Integration Service
 */

import { AnalyticsService, AnalyticsEvent, YandexMetricaConfig } from '../types';

export class YandexMetrica implements AnalyticsService {
  name = 'Yandex Metrica';
  private config: YandexMetricaConfig;
  private isInitialized = false;

  constructor(config: YandexMetricaConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Initialize Yandex Metrica
    (function(m: any, e: Document, t: string, r: string, i: string, k?: HTMLScriptElement, a?: HTMLScriptElement) {
      m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments);
      };
      m[i].l = +new Date();
      k = e.createElement(t as any) as HTMLScriptElement;
      a = e.getElementsByTagName(t as any)[0] as HTMLScriptElement;
      k.async = true;
      k.src = r;
      a.parentNode!.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    // Configure Yandex Metrica
    if (window.ym) {
      window.ym(this.config.counterId, 'init', {
      clickmap: this.config.clickmap !== false,
      trackLinks: this.config.trackLinks !== false,
      accurateTrackBounce: this.config.accurateTrackBounce !== false,
      trackHash: this.config.trackHash !== false,
        webvisor: this.config.webvisor !== false,
        defer: false
      });
    }

    this.isInitialized = true;
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) {
      return;
    }

    try {
      const counterId = this.config.counterId;

      switch (event.type) {
        case 'page_view':
          // Track page view
          window.ym(counterId, 'hit', event.metadata?.url || window.location.href, {
            title: event.name,
            referer: event.metadata?.referrer
          });
          break;

        case 'swipe':
          // Track swipe as goal
          window.ym(counterId, 'reachGoal', 'swipe_navigation', {
            direction: event.metadata?.direction,
            from: event.metadata?.from_section,
            to: event.metadata?.to_section,
            method: event.metadata?.method
          });
          
          // Also track as params
          window.ym(counterId, 'params', {
            swipe: {
              direction: event.metadata?.direction,
              from_section: event.metadata?.from_section,
              to_section: event.metadata?.to_section,
              timestamp: event.timestamp
            }
          });
          break;

        case 'click':
          // Track click event
          window.ym(counterId, 'reachGoal', 'click_event', {
            element: event.name,
            ...event.metadata
          });
          
          // External link tracking
          if (event.metadata?.url && event.metadata?.external) {
            window.ym(counterId, 'extLink', event.metadata.url);
          }
          break;

        case 'engagement':
          // Track engagement metrics
          window.ym(counterId, 'userParams', {
            engagement: {
              metric: event.name,
              value: event.value,
              ...event.metadata
            }
          });
          break;

        case 'error':
          // Track errors
          window.ym(counterId, 'notBounce');
          window.ym(counterId, 'reachGoal', 'error_occurred', {
            error_type: event.name,
            message: event.metadata?.message,
            stack: event.metadata?.stack?.substring(0, 500) // Limit stack trace
          });
          break;

        default:
          // Track custom events as goals
          window.ym(counterId, 'reachGoal', event.name, {
            ...event.metadata,
            value: event.value,
            timestamp: event.timestamp
          });
      }

      // Track user parameters
      if (event.userId) {
        window.ym(counterId, 'userParams', {
          UserID: event.userId,
          SessionID: event.sessionId
        });
      }
    } catch (error) {
      console.error('Yandex Metrica tracking error:', error);
    }
  }

  async getMetrics(timeRange: { start: Date; end: Date }): Promise<any> {
    // This would typically use Yandex Metrica API
    // Requires OAuth token and API access
    return {
      service: this.name,
      timeRange,
      metrics: {
        visits: 0,
        pageviews: 0,
        users: 0,
        bounceRate: 0,
        avgVisitDuration: 0,
        goals: []
      }
    };
  }

  /**
   * Track e-commerce event
   */
  trackEcommerce(action: string, data: any): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) return;

    window.ym(this.config.counterId, 'ecommerce', action, data);
  }

  /**
   * Set user parameters
   */
  setUserParams(params: Record<string, any>): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) return;

    window.ym(this.config.counterId, 'userParams', params);
  }

  /**
   * Track file download
   */
  trackFileDownload(url: string): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) return;

    window.ym(this.config.counterId, 'file', url);
  }

  destroy(): void {
    // Cleanup if needed
    this.isInitialized = false;
  }
}

// Declare global types
declare global {
  interface Window {
    ym?: (counterId: string | number, action: string, ...params: any[]) => void;
  }
}