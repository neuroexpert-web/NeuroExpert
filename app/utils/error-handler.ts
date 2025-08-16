// Sentry temporarily disabled
// import * as Sentry from '@sentry/nextjs';

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

  // Sentry temporarily disabled - just log to console
  console.error('Production error:', error, context);
}

export function captureMessage(
  message: string, 
  level: string = 'info',
  context?: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level.toUpperCase()}]`, message, context);
    return;
  }

  // Sentry temporarily disabled - just log to console
  console.log(`[${level.toUpperCase()}]`, message, context);
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