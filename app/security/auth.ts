/**
 * Authentication middleware
 */

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthContext {
  userId?: string;
  sessionId?: string;
  role?: 'user' | 'admin';
}

/**
 * Authenticate request
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    
    return {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      role: decoded.role || 'user'
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}