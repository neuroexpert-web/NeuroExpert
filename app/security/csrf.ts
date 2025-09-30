/**
 * CSRF protection middleware
 */

import { NextRequest } from 'next/server';
import { securityManager } from '../analytics/security';

/**
 * Verify CSRF token
 */
export async function verifyCSRF(request: NextRequest): Promise<boolean> {
  // Skip CSRF for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }

  // Get CSRF token from header or cookie
  const token = request.headers.get('x-csrf-token') || 
                request.cookies.get('csrf-token')?.value;

  if (!token) {
    return false;
  }

  // Verify token
  return securityManager.verifyCSRFToken(token);
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return securityManager.generateCSRFToken();
}