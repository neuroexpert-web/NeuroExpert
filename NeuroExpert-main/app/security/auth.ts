/**
 * Authentication middleware with JWT support
 */

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

export interface AuthContext {
  userId?: string;
  sessionId?: string;
  role?: 'user' | 'admin';
  email?: string;
  exp?: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  sessionId: string;
  exp: number;
  iat: number;
}

// Безопасное получение JWT секрета
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  return secret;
};

/**
 * Authenticate request with JWT verification
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthContext | null> {
  // Get token from header or cookie
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7)
    : request.cookies.get('auth-token')?.value;

  if (!token) {
    // Return session ID for anonymous users
    return {
      sessionId: request.headers.get('x-session-id') || generateSessionId()
    };
  }

  try {
    // Verify JWT token
    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      sessionId: decoded.sessionId,
      role: decoded.role,
      exp: decoded.exp
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): string {
  const secret = getJWTSecret();
  
  return jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    secret,
    {
      algorithm: 'HS256'
    }
  );
}

/**
 * Refresh JWT token
 */
export function refreshToken(token: string): string | null {
  try {
    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // Generate new token with updated expiration
    return generateToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      sessionId: decoded.sessionId
    });
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

/**
 * Generate secure session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  const hash = createHash('sha256')
    .update(`${timestamp}-${random}`)
    .digest('hex')
    .substring(0, 16);
  
  return `${timestamp}-${hash}`;
}

/**
 * Validate token without throwing errors
 */
export function isTokenValid(token: string): boolean {
  try {
    const secret = getJWTSecret();
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}