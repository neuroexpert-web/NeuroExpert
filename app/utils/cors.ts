/**
 * CORS configuration for production
 */

import { NextRequest } from 'next/server';

// Разрешенные источники
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  'https://neuroexpert.ai',
  'https://www.neuroexpert.ai',
  'https://neuroexpert.vercel.app',
  'https://neuroexpert.netlify.app',
].filter(Boolean);

// Разрешенные методы
const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];

// Разрешенные заголовки
const allowedHeaders = [
  'Content-Type',
  'Authorization',
  'X-CSRF-Token',
  'X-Requested-With',
  'X-Session-ID'
];

export interface CORSHeaders {
  'Access-Control-Allow-Origin'?: string;
  'Access-Control-Allow-Methods'?: string;
  'Access-Control-Allow-Headers'?: string;
  'Access-Control-Allow-Credentials'?: string;
  'Access-Control-Max-Age'?: string;
}

/**
 * Get CORS headers based on request origin
 */
export function getCORSHeaders(request: NextRequest): CORSHeaders {
  const origin = request.headers.get('origin');
  const headers: CORSHeaders = {};

  // В development разрешаем все источники
  if (process.env.NODE_ENV === 'development') {
    headers['Access-Control-Allow-Origin'] = origin || '*';
    headers['Access-Control-Allow-Methods'] = allowedMethods.join(', ');
    headers['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers['Access-Control-Max-Age'] = '86400';
    return headers;
  }

  // В production проверяем origin
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = allowedMethods.join(', ');
    headers['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers['Access-Control-Max-Age'] = '86400';
  }

  return headers;
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (process.env.NODE_ENV === 'development') return true;
  return allowedOrigins.includes(origin);
}

/**
 * Apply CORS headers to response
 */
export function applyCORSHeaders(response: Response, request: NextRequest): Response {
  const corsHeaders = getCORSHeaders(request);
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}
