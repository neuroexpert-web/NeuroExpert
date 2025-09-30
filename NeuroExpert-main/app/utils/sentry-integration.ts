/**
 * Sentry integration utilities
 */

import * as Sentry from '@sentry/nextjs';

export interface ErrorContext {
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

/**
 * Capture error with context
 */
export function captureError(error: Error | string, context?: ErrorContext): void {
  if (typeof error === 'string') {
    error = new Error(error);
  }

  if (context) {
    Sentry.withScope((scope) => {
      if (context.userId) {
        scope.setUser({ id: context.userId });
      }
      if (context.action) {
        scope.setTag('action', context.action);
      }
      if (context.metadata) {
        scope.setContext('metadata', context.metadata);
      }
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture security event
 */
export function captureSecurityEvent(event: string, details: Record<string, any>): void {
  Sentry.captureMessage(`Security Event: ${event}`, {
    level: 'warning',
    contexts: {
      security: details
    }
  });
}

/**
 * Track performance
 */
export function trackPerformance(name: string, fn: () => Promise<any>): Promise<any> {
  // В новой версии Sentry используется startSpan
  return Sentry.startSpan({ name }, async () => {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  });
}

/**
 * Monitor API endpoint
 */
export function monitorAPIEndpoint(endpoint: string, handler: Function) {
  return async (...args: any[]) => {
    return Sentry.startSpan({
      name: `API ${endpoint}`,
      op: 'http.server'
    }, async () => {
      try {
        const result = await handler(...args);
        return result;
      } catch (error) {
        captureError(error as Error, {
          action: `API ${endpoint}`,
          metadata: { args }
        });
        throw error;
      }
    });
  };
}

/**
 * Add breadcrumb for tracking
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
    timestamp: Date.now() / 1000
  });
}

/**
 * Check if Sentry is enabled
 */
export function isSentryEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN;
}