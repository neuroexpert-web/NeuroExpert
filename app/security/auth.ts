/**
 * Authentication middleware
 */

import { NextRequest } from 'next/server';
// JWT будет добавлен позже
// import jwt from 'jsonwebtoken';

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
    // Verify JWT token - заглушка пока JWT не подключен
    // const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    
    // Временная заглушка
    return {
      userId: 'temp-user',
      sessionId: generateSessionId(),
      role: 'user' as const
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