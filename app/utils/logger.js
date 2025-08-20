/**
 * Enhanced logging utility with context support
 * Provides colored output in development and structured logging
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

const LOG_COLORS = {
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
    // Безопасная проверка для клиентской стороны
    this.isDevelopment = typeof process !== 'undefined' 
      ? process.env.NODE_ENV !== 'production'
      : false;
    this.logLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;
  }

  _formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const color = LOG_COLORS[level] || '';
    const reset = LOG_COLORS.RESET;
    
    if (this.isDevelopment) {
      // Colored output for development
      const contextStr = `[${this.context}]`;
      const levelStr = `[${level}]`;
      return `${color}${timestamp} ${levelStr} ${contextStr} ${message}${reset}`;
    } else {
      // Structured logging for production
      return JSON.stringify({
        timestamp,
        level,
        context: this.context,
        message,
        ...data
      });
    }
  }

  _shouldLog(level) {
    return LOG_LEVELS[level] <= this.logLevel;
  }

  _log(level, message, data = {}) {
    if (!this._shouldLog(level)) return;

    const formattedMessage = this._formatMessage(level, message, data);
    
    switch (level) {
      case 'ERROR':
        console.error(formattedMessage);
        if (data && Object.keys(data).length > 0) {
          console.error(data);
        }
        break;
      case 'WARN':
        console.warn(formattedMessage);
        if (data && Object.keys(data).length > 0) {
          console.warn(data);
        }
        break;
      default:
        console.log(formattedMessage);
        if (data && Object.keys(data).length > 0) {
          console.log(data);
        }
    }
  }

  error(message, error) {
    const errorData = error instanceof Error ? {
      error: error.message,
      stack: error.stack,
      name: error.name
    } : { error };
    
    this._log('ERROR', message, errorData);
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

  // Convenience methods
  log(message, data = {}) {
    this.info(message, data);
  }

  critical(message, error) {
    // Always log critical errors regardless of environment
    console.error(`[CRITICAL] [${this.context}] ${message}`, error);
    // Here you can add Sentry or other error tracking
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

  // Create child logger with new context
  child(context) {
    return new Logger(`${this.context}:${context}`);
  }
}

// Factory function to create logger instances
export function createLogger(context) {
  return new Logger(context);
}

// Default logger instance
const defaultLogger = new Logger();

export default defaultLogger;

// Export individual methods for convenience
export const { log, error, warn, info, debug, trace, critical } = defaultLogger;