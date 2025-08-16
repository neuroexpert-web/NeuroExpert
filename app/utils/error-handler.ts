import * as Sentry from '@sentry/nextjs';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  context?: Record<string, any>;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;
  context?: Record<string, any>;

  constructor(
    message: string, 
    statusCode: number = 500, 
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export function captureError(
  error: Error | AppError, 
  context?: Record<string, any>
): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error captured:', error);
    if (context) console.error('Context:', context);
    return;
  }

  // Send to Sentry in production
  Sentry.withScope((scope) => {
    // Add context
    if (context) {
      scope.setContext('additional', context);
    }

    // Add error level based on status code
    if ('statusCode' in error) {
      if (error.statusCode >= 500) {
        scope.setLevel('error');
      } else if (error.statusCode >= 400) {
        scope.setLevel('warning');
      } else {
        scope.setLevel('info');
      }
      
      scope.setTag('statusCode', error.statusCode);
    }

    // Add operational flag
    if ('isOperational' in error) {
      scope.setTag('isOperational', error.isOperational);
    }

    // Capture the error
    Sentry.captureException(error);
  });
}

export function captureMessage(
  message: string, 
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level.toUpperCase()}]`, message, context);
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (context) {
      scope.setContext('additional', context);
    }
    Sentry.captureMessage(message);
  });
}

// Error boundary helper
export function errorBoundaryHandler(
  error: Error, 
  errorInfo: { componentStack: string }
): void {
  captureError(error, { 
    componentStack: errorInfo.componentStack,
    errorBoundary: true 
  });
}