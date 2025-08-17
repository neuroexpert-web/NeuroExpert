/**
 * Rate Limiting Middleware for Next.js API Routes
 * Protects against brute force and DDoS attacks
 */

import { NextResponse } from 'next/server';

const rateLimit = new Map();

// Configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  max: {
    default: 60,        // 60 requests per minute by default
    auth: 5,            // 5 login attempts per minute
    ai: 20,             // 20 AI requests per minute
    contact: 5,         // 5 contact form submissions per minute
  },
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

/**
 * Get client identifier (IP address with fallbacks)
 */
function getClientId(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         'unknown';
}

/**
 * Clean up old entries from rate limit map
 */
function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, data] of rateLimit.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_CONFIG.windowMs) {
      rateLimit.delete(key);
    }
  }
}

/**
 * Rate limiting middleware factory
 * @param {string} endpoint - The endpoint type (auth, ai, contact, etc.)
 * @returns {Function} Middleware function
 */
export function createRateLimiter(endpoint = 'default') {
  const maxRequests = RATE_LIMIT_CONFIG.max[endpoint] || RATE_LIMIT_CONFIG.max.default;

  return async function rateLimitMiddleware(req, res, next) {
    // Skip rate limiting in development
    if (process.env.NODE_ENV === 'development') {
      return next ? next() : undefined;
    }

    const clientId = getClientId(req);
    const key = `${clientId}:${endpoint}`;
    const now = Date.now();

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance
      cleanupOldEntries();
    }

    // Get or create client data
    let clientData = rateLimit.get(key);
    if (!clientData) {
      clientData = {
        count: 0,
        firstRequest: now,
      };
      rateLimit.set(key, clientData);
    }

    // Check if window has expired
    if (now - clientData.firstRequest > RATE_LIMIT_CONFIG.windowMs) {
      clientData.count = 0;
      clientData.firstRequest = now;
    }

    // Increment request count
    clientData.count++;

    // Set rate limit headers
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - clientData.count));
      res.setHeader('X-RateLimit-Reset', new Date(clientData.firstRequest + RATE_LIMIT_CONFIG.windowMs).toISOString());
    }

    // Check if limit exceeded
    if (clientData.count > maxRequests) {
      if (res && typeof res.status === 'function') {
        return res.status(429).json({
          error: RATE_LIMIT_CONFIG.message,
          retryAfter: Math.ceil((clientData.firstRequest + RATE_LIMIT_CONFIG.windowMs - now) / 1000),
        });
      }
      return false; // For non-HTTP contexts
    }

    // Continue to next middleware
    return next ? next() : true;
  };
}

/**
 * Wrapper for Next.js API routes
 */
export function withRateLimit(handler, endpoint = 'default') {
  const rateLimiter = createRateLimiter(endpoint);
  
  return async (req, res) => {
    return new Promise((resolve) => {
      rateLimiter(req, res, async () => {
        resolve(await handler(req, res));
      });
    });
  };
}

/**
 * Rate limit check for non-HTTP contexts
 */
export function checkRateLimit(clientId, endpoint = 'default') {
  const req = { headers: { 'x-real-ip': clientId } };
  const rateLimiter = createRateLimiter(endpoint);
  return rateLimiter(req, {}, () => true);
}

/**
 * Wrapper for Next.js App Router-compatible routes
 */
export function withRateLimitRoute(handler, endpoint = 'default') {
  const maxRequests = RATE_LIMIT_CONFIG.max[endpoint] || RATE_LIMIT_CONFIG.max.default;

  return async (request, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      return handler(request, ...args);
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const key = `${ip}:${endpoint}`;
    const now = Date.now();

    let clientData = rateLimit.get(key);
    if (!clientData || now - clientData.firstRequest > RATE_LIMIT_CONFIG.windowMs) {
      clientData = { count: 0, firstRequest: now };
      rateLimit.set(key, clientData);
    }

    clientData.count++;

    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(maxRequests));
    headers.set('X-RateLimit-Remaining', String(Math.max(0, maxRequests - clientData.count)));
    headers.set('X-RateLimit-Reset', new Date(clientData.firstRequest + RATE_LIMIT_CONFIG.windowMs).toISOString());

    if (clientData.count > maxRequests) {
      const retryAfterSec = Math.ceil((clientData.firstRequest + RATE_LIMIT_CONFIG.windowMs - now) / 1000);
      headers.set('Retry-After', String(retryAfterSec));
      return NextResponse.json({ error: RATE_LIMIT_CONFIG.message, retryAfter: retryAfterSec }, { status: 429, headers });
    }

    const response = await handler(request, ...args);
    try {
      if (response && response.headers && typeof response.headers.set === 'function') {
        response.headers.set('X-RateLimit-Limit', String(maxRequests));
        response.headers.set('X-RateLimit-Remaining', String(Math.max(0, maxRequests - clientData.count)));
        response.headers.set('X-RateLimit-Reset', new Date(clientData.firstRequest + RATE_LIMIT_CONFIG.windowMs).toISOString());
      }
    } catch {}
    return response;
  };
}

// Export configurations for customization
export const rateLimitConfig = RATE_LIMIT_CONFIG;