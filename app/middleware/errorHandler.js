/**
 * Professional Error Handling Middleware for NeuroExpert
 * Provides consistent error responses and logging
 */

import { NextResponse } from 'next/server';
import { createLogger } from '../utils/logger';

const logger = createLogger('ErrorHandler');

// Error types
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', retryAfter = 60) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfter });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service, originalError) {
    super(
      `External service error: ${service}`,
      503,
      'EXTERNAL_SERVICE_ERROR',
      { service, originalError: originalError.message }
    );
  }
}

// Error response formatter
function formatErrorResponse(error, requestId) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const response = {
    error: {
      message: error.message,
      code: error.code || 'INTERNAL_ERROR',
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
      requestId
    }
  };

  // Add details in development or for operational errors
  if (isDevelopment || error.isOperational) {
    if (error.details) {
      response.error.details = error.details;
    }
  }

  // Add stack trace in development
  if (isDevelopment && error.stack) {
    response.error.stack = error.stack.split('\n');
  }

  return response;
}

// Main error handler
export function handleError(error, request) {
  const requestId = request.headers.get('x-request-id') || 
                   Math.random().toString(36).substring(7);

  // Log error
  logger.error('Request error', {
    error: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    requestId,
    url: request.url,
    method: request.method
  });

  // Send alert for critical errors
  if (!error.isOperational || error.statusCode >= 500) {
    logger.security('Critical error detected', {
      error: error.message,
      url: request.url
    });
  }

  // Format and return error response
  const statusCode = error.statusCode || 500;
  const response = formatErrorResponse(error, requestId);

  return NextResponse.json(response, { 
    status: statusCode,
    headers: {
      'X-Request-ID': requestId
    }
  });
}

// Async error wrapper for route handlers
export function asyncHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, request);
    }
  };
}

// Error middleware for Next.js
export async function errorMiddleware(request, next) {
  try {
    const response = await next();
    return response;
  } catch (error) {
    return handleError(error, request);
  }
}

// Validation helper
export function validate(schema, data) {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Required check
    if (rules.required && !value) {
      errors.push({
        field,
        message: `${field} is required`
      });
      continue;
    }
    
    // Skip other validations if field is not present and not required
    if (!value && !rules.required) continue;
    
    // Type check
    if (rules.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rules.type) {
        errors.push({
          field,
          message: `${field} must be of type ${rules.type}`
        });
      }
    }
    
    // Pattern check
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push({
        field,
        message: rules.message || `${field} format is invalid`
      });
    }
    
    // Min length
    if (rules.minLength && value.length < rules.minLength) {
      errors.push({
        field,
        message: `${field} must be at least ${rules.minLength} characters`
      });
    }
    
    // Max length
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push({
        field,
        message: `${field} must not exceed ${rules.maxLength} characters`
      });
    }
    
    // Custom validator
    if (rules.validate) {
      const error = rules.validate(value, data);
      if (error) {
        errors.push({
          field,
          message: error
        });
      }
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  
  return true;
}

// Common validation schemas
export const schemas = {
  email: {
    type: 'string',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format'
  },
  
  phone: {
    type: 'string',
    pattern: /^[\d\s\-\+\(\)]+$/,
    minLength: 10,
    message: 'Invalid phone number'
  },
  
  password: {
    type: 'string',
    required: true,
    minLength: 8,
    validate: (value) => {
      if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter';
      if (!/[0-9]/.test(value)) return 'Password must contain number';
      return null;
    }
  },
  
  url: {
    type: 'string',
    pattern: /^https?:\/\/.+/,
    message: 'Invalid URL format'
  }
};

// Error recovery strategies
export const ErrorRecovery = {
  retry: async (fn, options = {}) => {
    const { retries = 3, delay = 1000, backoff = 2 } = options;
    let lastError;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        logger.warn(`Retry attempt ${i + 1} failed`, { error: error.message });
        
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(backoff, i)));
        }
      }
    }
    
    throw lastError;
  },
  
  fallback: async (fn, fallbackValue) => {
    try {
      return await fn();
    } catch (error) {
      logger.warn('Using fallback value', { error: error.message });
      return fallbackValue;
    }
  },
  
  circuit: (() => {
    const states = new Map();
    
    return async (key, fn, options = {}) => {
      const { threshold = 5, timeout = 60000 } = options;
      const state = states.get(key) || { failures: 0, lastFailure: 0 };
      
      // Check if circuit is open
      if (state.failures >= threshold) {
        const timeSinceLastFailure = Date.now() - state.lastFailure;
        if (timeSinceLastFailure < timeout) {
          throw new Error(`Circuit breaker open for ${key}`);
        }
        // Reset circuit
        state.failures = 0;
      }
      
      try {
        const result = await fn();
        state.failures = 0;
        states.set(key, state);
        return result;
      } catch (error) {
        state.failures++;
        state.lastFailure = Date.now();
        states.set(key, state);
        throw error;
      }
    };
  })()
};