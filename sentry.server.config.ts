// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampleRate in a dynamic way
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Additional server options
  environment: process.env.NODE_ENV,
  
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry event (dev mode):', event);
      return null;
    }
    
    // Filter out specific errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      // Don't log expected errors
      if (error?.type === 'ValidationError') {
        return null;
      }
    }
    
    return event;
  },
});