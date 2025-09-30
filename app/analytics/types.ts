/**
 * Analytics Types and Interfaces
 */

export interface AnalyticsEvent {
  type: 'page_view' | 'swipe' | 'click' | 'engagement' | 'error' | 'custom';
  name: string;
  value?: number;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsService {
  name: string;
  track(event: AnalyticsEvent): Promise<void>;
  trackError?(error: Error, context?: Record<string, any>): Promise<void>;
  getMetrics?(timeRange: { start: Date; end: Date }): Promise<any>;
  destroy?(): void;
}

export interface ServiceConfig {
  enabled: boolean;
  apiKey?: string;
  projectId?: string;
  options?: Record<string, any>;
}

export interface GoogleAnalyticsConfig extends ServiceConfig {
  measurementId: string;
  debug?: boolean;
}

export interface YandexMetricaConfig extends ServiceConfig {
  counterId: string;
  clickmap?: boolean;
  trackLinks?: boolean;
  accurateTrackBounce?: boolean;
  trackHash?: boolean;
  webvisor?: boolean;
}

export interface SentryConfig extends ServiceConfig {
  dsn: string;
  environment?: string;
  tracesSampleRate?: number;
  debug?: boolean;
}

export interface AppMetricaConfig extends ServiceConfig {
  apiKey: string;
  appVersion?: string;
}

export interface OpenReplayConfig extends ServiceConfig {
  projectKey: string;
  ingestPoint?: string;
}

export interface HotjarConfig extends ServiceConfig {
  siteId: string;
  hotjarVersion?: number;
}

export interface QueueConfig {
  maxSize: number;
  flushInterval: number;
  maxRetries: number;
  batchSize: number;
  debounceTime?: number;
  throttleTime?: number;
}

export interface AnalyticsConfig {
  services: {
    googleAnalytics?: GoogleAnalyticsConfig;
    yandexMetrica?: YandexMetricaConfig;
    sentry?: SentryConfig;
    appMetrica?: AppMetricaConfig;
    openReplay?: OpenReplayConfig;
    hotjar?: HotjarConfig;
  };
  queue: QueueConfig;
  privacy: {
    anonymizeIp: boolean;
    respectDoNotTrack: boolean;
    cookieConsent: boolean;
    dataRetention: number; // days
  };
  performance: {
    enableDebugMode: boolean;
    sampleRate: number; // 0-1
    enableAutoPageTracking: boolean;
  };
}

export interface DashboardMetrics {
  pageViews: number;
  uniqueUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  swipeInteractions: number;
  errorRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
  userFlow: Array<{ from: string; to: string; count: number }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
}

export interface SecurityContext {
  userId?: string;
  sessionId: string;
  ipAddress?: string;
  userAgent: string;
  timestamp: number;
  csrfToken?: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: any) => string;
}