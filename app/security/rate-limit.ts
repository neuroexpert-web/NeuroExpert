/**
 * Rate limiting middleware
 */

import { NextRequest } from 'next/server';
import { securityManager } from '../analytics/security';

export interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetTime?: number;
}

/**
 * Rate limit middleware
 */
export async function rateLimit(request: NextRequest): Promise<RateLimitResult> {
  // Get identifier (IP address or user ID)
  const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';
  
  const identifier = ip;

  // Rate limit config from env
  const config = {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  };

  // Check rate limit
  const allowed = securityManager.checkRateLimit(identifier, config);

  return {
    allowed,
    remaining: allowed ? config.maxRequests - 1 : 0,
    resetTime: Date.now() + config.windowMs
  };
}