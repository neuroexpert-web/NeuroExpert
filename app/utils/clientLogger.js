/**
 * Client-side logger for React components
 * Safe to use in browser environment
 */

class ClientLogger {
  constructor(context = 'Client') {
    this.context = context;
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  _formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = `[${level}] [${this.context}]`;
    
    if (this.isDevelopment) {
      // In development, use colored console output
      const colors = {
        ERROR: 'color: #ff0000',
        WARN: 'color: #ff9800',
        INFO: 'color: #2196f3',
        DEBUG: 'color: #4caf50'
      };
      
      console.log(
        `%c${prefix} ${timestamp} ${message}`,
        colors[level] || '',
        data || ''
      );
    } else {
      // In production, send to analytics or monitoring service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'log', {
          event_category: 'application_log',
          event_label: level,
          custom_parameter: {
            context: this.context,
            message,
            data: JSON.stringify(data),
            timestamp
          }
        });
      }
      
      // Also send errors to Sentry if available
      if (level === 'ERROR' && typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.captureException(new Error(message), {
          extra: data,
          tags: {
            context: this.context
          }
        });
      }
    }
  }

  error(message, data) {
    this._formatMessage('ERROR', message, data);
  }

  warn(message, data) {
    this._formatMessage('WARN', message, data);
  }

  info(message, data) {
    this._formatMessage('INFO', message, data);
  }

  debug(message, data) {
    if (this.isDevelopment) {
      this._formatMessage('DEBUG', message, data);
    }
  }

  // Performance measurement
  time(label) {
    if (this.isDevelopment && typeof console.time === 'function') {
      console.time(`[${this.context}] ${label}`);
    }
  }

  timeEnd(label) {
    if (this.isDevelopment && typeof console.timeEnd === 'function') {
      console.timeEnd(`[${this.context}] ${label}`);
    }
  }

  // Group logging for complex operations
  group(label) {
    if (this.isDevelopment && typeof console.group === 'function') {
      console.group(`[${this.context}] ${label}`);
    }
  }

  groupEnd() {
    if (this.isDevelopment && typeof console.groupEnd === 'function') {
      console.groupEnd();
    }
  }
}

// Factory function
export function createClientLogger(context) {
  return new ClientLogger(context);
}

// Default instance
export const clientLogger = new ClientLogger('App');

// React hook for component logging
export function useLogger(componentName) {
  const logger = new ClientLogger(componentName);
  
  // Log component lifecycle in development
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Component mounted');
    
    // Return cleanup function
    return () => {
      logger.debug('Component unmounted');
    };
  }
  
  return logger;
}