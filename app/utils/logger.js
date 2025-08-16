/**
 * Professional Logging System for NeuroExpert
 * Supports multiple log levels, structured logging, and external services
 */

import { format } from 'date-fns';

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

// Current log level from environment
const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

// Colors for console output
const COLORS = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[32m', // Green
  TRACE: '\x1b[90m', // Gray
  RESET: '\x1b[0m'
};

class Logger {
  constructor(context = 'App') {
    this.context = context;
    this.requestId = null;
  }

  setRequestId(requestId) {
    this.requestId = requestId;
  }

  _formatMessage(level, message, data = {}) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(this.requestId && { requestId: this.requestId }),
      ...(Object.keys(data).length > 0 && { data }),
      ...(process.env.NODE_ENV === 'production' && { env: 'production' })
    };

    return logEntry;
  }

  _shouldLog(level) {
    return LOG_LEVELS[level] <= CURRENT_LOG_LEVEL;
  }

  _log(level, message, data) {
    if (!this._shouldLog(level)) return;

    const logEntry = this._formatMessage(level, message, data);

    // Console output
    if (process.env.NODE_ENV !== 'production') {
      const color = COLORS[level];
      const prefix = `${color}[${level}]${COLORS.RESET}`;
      console.log(`${prefix} ${logEntry.timestamp} [${logEntry.context}] ${message}`);
      if (Object.keys(data).length > 0) {
        console.log('  Data:', JSON.stringify(data, null, 2));
      }
    } else {
      // Production: structured JSON logs
      console.log(JSON.stringify(logEntry));
    }

    // Send to external services in production
    if (process.env.NODE_ENV === 'production') {
      this._sendToExternalService(logEntry);
    }
  }

  async _sendToExternalService(logEntry) {
    // Send critical errors to Telegram
    if (logEntry.level === 'ERROR' && process.env.TELEGRAM_BOT_TOKEN) {
      try {
        const message = `
🚨 ERROR in ${logEntry.context}
${logEntry.message}
${logEntry.data ? JSON.stringify(logEntry.data, null, 2) : ''}
Time: ${logEntry.timestamp}
        `;

        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: message,
              parse_mode: 'HTML'
            })
          }
        );
      } catch (error) {
        console.error('Failed to send error to Telegram:', error);
      }
    }

    // Send to Sentry if configured
    if (process.env.SENTRY_DSN && typeof window !== 'undefined' && window.Sentry) {
      if (logEntry.level === 'ERROR') {
        window.Sentry.captureException(new Error(logEntry.message), {
          extra: logEntry.data,
          tags: {
            context: logEntry.context
          }
        });
      } else if (logEntry.level === 'WARN') {
        window.Sentry.captureMessage(logEntry.message, 'warning');
      }
    }
  }

  error(message, data = {}) {
    this._log('ERROR', message, data);
  }

  warn(message, data = {}) {
    this._log('WARN', message, data);
  }

  info(message, data = {}) {
    this._log('INFO', message, data);
  }

  debug(message, data = {}) {
    this._log('DEBUG', message, data);
  }

  trace(message, data = {}) {
    this._log('TRACE', message, data);
  }

  // Performance logging
  time(label) {
    if (this._shouldLog('DEBUG')) {
      console.time(`[${this.context}] ${label}`);
    }
  }

  timeEnd(label) {
    if (this._shouldLog('DEBUG')) {
      console.timeEnd(`[${this.context}] ${label}`);
    }
  }

  // Metrics logging
  metric(name, value, unit = '') {
    this._log('INFO', `Metric: ${name}`, { value, unit });
  }

  // Security event logging
  security(event, details = {}) {
    this._log('WARN', `Security Event: ${event}`, details);
  }

  // API request logging
  apiRequest(method, url, data = {}) {
    this._log('INFO', `API Request: ${method} ${url}`, data);
  }

  apiResponse(method, url, status, duration) {
    this._log('INFO', `API Response: ${method} ${url}`, { status, duration });
  }
}

// Factory function to create logger instances
export function createLogger(context) {
  return new Logger(context);
}

// Default logger instance
export const logger = new Logger('Default');

// Express/Next.js middleware
export function loggerMiddleware(req, res, next) {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  const logger = new Logger('HTTP');
  logger.setRequestId(requestId);
  
  // Attach logger to request
  req.logger = logger;
  
  // Log request
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  });
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    logger.info(`Response: ${req.method} ${req.url}`, {
      status: res.statusCode,
      duration: `${duration}ms`
    });
    
    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        url: req.url,
        duration: `${duration}ms`
      });
    }
    
    originalEnd.apply(res, args);
  };
  
  next();
}

// Utility functions
export function logError(error, context = 'Unknown') {
  const logger = new Logger(context);
  logger.error(error.message || 'Unknown error', {
    stack: error.stack,
    code: error.code,
    ...error
  });
}

export function logPerformance(operation, duration, context = 'Performance') {
  const logger = new Logger(context);
  if (duration > 1000) {
    logger.warn(`Slow operation: ${operation}`, { duration: `${duration}ms` });
  } else {
    logger.debug(`Operation completed: ${operation}`, { duration: `${duration}ms` });
  }
}