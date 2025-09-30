import { NextResponse } from 'next/server';

// Simple in-memory rate limiter
// In production, use Redis or similar for distributed rate limiting
const rateLimitMap = new Map();

// Configuration
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'); // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'); // 100 requests per window

export function rateLimit(options = {}) {
  const {
    windowMs = WINDOW_MS,
    max = MAX_REQUESTS,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => {
      // Use IP address as key
      const forwarded = req.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
      return ip;
    }
  } = options;

  return async function rateLimitMiddleware(req) {
    const key = keyGenerator(req);
    const now = Date.now();

    // Clean up old entries
    for (const [k, data] of rateLimitMap.entries()) {
      if (now - data.windowStart > windowMs) {
        rateLimitMap.delete(k);
      }
    }

    // Get or create rate limit data for this key
    let data = rateLimitMap.get(key);
    if (!data || now - data.windowStart > windowMs) {
      data = {
        count: 0,
        windowStart: now
      };
      rateLimitMap.set(key, data);
    }

    // Increment request count
    data.count++;

    // Check if limit exceeded
    if (data.count > max) {
      const retryAfter = Math.ceil((data.windowStart + windowMs - now) / 1000);
      
      return NextResponse.json(
        {
          error: message,
          retryAfter: retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(data.windowStart + windowMs).toISOString()
          }
        }
      );
    }

    // Add rate limit headers to response
    const remaining = max - data.count;
    const reset = new Date(data.windowStart + windowMs).toISOString();

    return {
      headers: {
        'X-RateLimit-Limit': max.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset
      }
    };
  };
}

// Specific rate limiters for different endpoints
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'API rate limit exceeded. Please try again later.'
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts. Please try again later.'
});

export const assistantRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute (AI calls are expensive)
  message: 'AI assistant rate limit exceeded. Please wait before making more requests.'
});