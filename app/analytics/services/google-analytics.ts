/**
 * Google Analytics 4 Integration Service
 */

import { AnalyticsService, AnalyticsEvent, GoogleAnalyticsConfig } from '../types';

export class GoogleAnalytics implements AnalyticsService {
  name = 'Google Analytics';
  private config: GoogleAnalyticsConfig;
  private isInitialized = false;

  constructor(config: GoogleAnalyticsConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Load GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.config.measurementId, {
      debug_mode: this.config.debug || false,
      send_page_view: false // We'll send manually
    });

    this.isInitialized = true;
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Map our event types to GA4 events
      switch (event.type) {
        case 'page_view':
          window.gtag('event', 'page_view', {
            page_title: event.name,
            page_location: event.metadata?.url,
            page_path: event.metadata?.path,
            ...this.enrichEventData(event)
          });
          break;

        case 'swipe':
          window.gtag('event', 'swipe_navigation', {
            event_category: 'engagement',
            event_label: event.name,
            direction: event.metadata?.direction,
            from_section: event.metadata?.from_section,
            to_section: event.metadata?.to_section,
            method: event.metadata?.method,
            ...this.enrichEventData(event)
          });
          break;

        case 'click':
          window.gtag('event', 'click', {
            event_category: 'engagement',
            event_label: event.name,
            ...event.metadata,
            ...this.enrichEventData(event)
          });
          break;

        case 'engagement':
          window.gtag('event', event.name, {
            event_category: 'engagement',
            value: event.value,
            ...event.metadata,
            ...this.enrichEventData(event)
          });
          break;

        case 'error':
          window.gtag('event', 'exception', {
            description: event.metadata?.message || event.name,
            fatal: event.metadata?.fatal || false,
            ...this.enrichEventData(event)
          });
          break;

        default:
          // Custom events
          window.gtag('event', event.name, {
            event_category: 'custom',
            ...event.metadata,
            ...this.enrichEventData(event)
          });
      }

      // Also send to Measurement Protocol for server-side tracking
      if (process.env.GA_API_SECRET) {
        await this.sendMeasurementProtocol(event);
      }
    } catch (error) {
      console.error('Google Analytics tracking error:', error);
    }
  }

  private enrichEventData(event: AnalyticsEvent): Record<string, any> {
    return {
      timestamp: event.timestamp || Date.now(),
      session_id: event.sessionId,
      user_id: event.userId,
      engagement_time_msec: Date.now() - (event.timestamp || Date.now())
    };
  }

  private async sendMeasurementProtocol(event: AnalyticsEvent): Promise<void> {
    const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${this.config.measurementId}&api_secret=${process.env.GA_API_SECRET}`;

    const payload = {
      client_id: event.sessionId || 'anonymous',
      user_id: event.userId,
      timestamp_micros: (event.timestamp || Date.now()) * 1000,
      events: [{
        name: this.mapEventName(event),
        params: {
          ...event.metadata,
          value: event.value,
          engagement_time_msec: 100
        }
      }]
    };

    try {
      await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('GA Measurement Protocol error:', error);
    }
  }

  private mapEventName(event: AnalyticsEvent): string {
    const mapping: Record<string, string> = {
      page_view: 'page_view',
      swipe: 'swipe_navigation',
      click: 'select_content',
      engagement: 'user_engagement',
      error: 'exception'
    };

    return mapping[event.type] || event.name;
  }

  async getMetrics(timeRange: { start: Date; end: Date }): Promise<any> {
    // This would typically use GA4 Reporting API
    // For now, return mock data structure
    return {
      service: this.name,
      timeRange,
      metrics: {
        pageViews: 0,
        users: 0,
        sessions: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        events: []
      }
    };
  }

  destroy(): void {
    // Cleanup if needed
    this.isInitialized = false;
  }
}

// Declare global types
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}