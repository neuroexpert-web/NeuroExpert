import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
      Sentry.feedbackIntegration({
        colorScheme: "dark",
        showBranding: false,
        themeDark: {
          background: "var(--noir)",
          inputBackground: "var(--dark-card)",
          inputBorder: "var(--dark-border)",
          submitBackground: "var(--purple)",
          submitBackgroundHover: "var(--purple-dark)",
        }
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: 1.0,
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    environment: process.env.NODE_ENV,
    
    // Filtering
    beforeSend(event, hint) {
      // Filter out non-error events in production
      if (process.env.NODE_ENV === 'production' && event.level !== 'error') {
        return null;
      }
      
      // Add user context
      if (typeof window !== 'undefined') {
        event.contexts = {
          ...event.contexts,
          custom: {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }
        };
      }
      
      return event;
    },
    
    // Ignore common errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      /extension\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
    ],
  });
}