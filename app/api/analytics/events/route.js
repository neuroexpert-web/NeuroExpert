/**
 * NeuroExpert Analytics Events API
 * Защищенный endpoint для приема аналитических событий
 * Включает: Rate Limiting, CSRF Protection, JWT Auth, Input Validation
 */

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import rateLimit from '../../../lib/security/rateLimit';
import { validateAnalyticsEvent } from '../../../lib/analytics/validation';
import { saveAnalyticsEvents } from '../../../lib/analytics/storage';
import { verifyAPIKey } from '../../../lib/security/auth';

// Rate limiting конфигурация
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100, // максимум 100 запросов за минуту
  message: 'Too many analytics requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/analytics/events
 * Прием аналитических событий
 */
export async function POST(request) {
  try {
    // Rate limiting
    const rateLimitResult = await limiter(request);
    if (rateLimitResult.blocked) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429 }
      );
    }

    // CSRF защита
    const headersList = headers();
    const origin = headersList.get('origin');
    const host = headersList.get('host');
    const referer = headersList.get('referer');
    
    // Проверка источника для защиты от CSRF
    if (!isValidOrigin(origin, host, referer)) {
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      );
    }

    // Проверка API ключа (для internal services)
    const apiKey = headersList.get('x-api-key');
    const source = headersList.get('x-analytics-source');
    
    if (source === 'internal' && !verifyAPIKey(apiKey)) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Парсинг и валидация данных
    const body = await request.json();
    const validationResult = validateAnalyticsEvent(body);
    
    if (!validationResult.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid event data',
          details: validationResult.errors 
        },
        { status: 400 }
      );
    }

    // Обогащение данных метаинформацией
    const enrichedData = enrichEventData(body, headersList);
    
    // Сохранение событий
    const saveResult = await saveAnalyticsEvents(enrichedData);
    
    // Логирование для аудита
    console.log('📊 Analytics events received:', {
      eventType: body.eventType,
      eventCount: body.events?.length || 0,
      source: source || 'frontend',
      ip: getClientIP(headersList),
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      processed: saveResult.processedCount,
      batchId: body.metadata?.batchId,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('❌ Analytics API error:', error);
    
    // Не раскрываем внутренние ошибки клиенту
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS для CORS preflight
 */
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': getAllowedOrigin(request),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Analytics-Source, X-API-Key, X-Batch-Size',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * Проверка валидности источника запроса
 */
function isValidOrigin(origin, host, referer) {
  const allowedOrigins = [
    `https://${host}`,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  ].filter(Boolean);

  // Проверка origin
  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  // Проверка referer как fallback
  if (referer) {
    return allowedOrigins.some(allowed => referer.startsWith(allowed));
  }

  // Для same-origin запросов origin может быть пустым
  return !origin && !referer;
}

/**
 * Получение разрешенного origin для CORS
 */
function getAllowedOrigin(request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ].filter(Boolean);

  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

/**
 * Получение IP адреса клиента
 */
function getClientIP(headers) {
  // Проверяем различные заголовки для получения реального IP
  const forwardedFor = headers.get('x-forwarded-for');
  const realIP = headers.get('x-real-ip');
  const cfConnectingIP = headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  
  return 'unknown';
}

/**
 * Обогащение данных события дополнительной информацией
 */
function enrichEventData(data, headers) {
  const timestamp = Date.now();
  const clientIP = getClientIP(headers);
  const userAgent = headers.get('user-agent');
  
  return {
    ...data,
    metadata: {
      ...data.metadata,
      receivedAt: timestamp,
      serverTimestamp: timestamp,
      clientIP: hashIP(clientIP), // Хешируем IP для приватности
      userAgent: sanitizeUserAgent(userAgent),
      processingId: generateProcessingId(),
      apiVersion: '3.0.0'
    },
    events: data.events?.map(event => ({
      ...event,
      serverReceivedAt: timestamp,
      processingFlags: {
        validated: true,
        enriched: true,
        sanitized: true
      }
    })) || []
  };
}

/**
 * Хеширование IP адреса для приватности
 */
function hashIP(ip) {
  if (!ip || ip === 'unknown') return 'unknown';
  
  // Простое хеширование для анонимизации
  const crypto = require('crypto');
  return crypto
    .createHash('sha256')
    .update(ip + process.env.IP_HASH_SALT || 'neuroexpert-salt')
    .digest('hex')
    .substring(0, 16);
}

/**
 * Санитизация User Agent
 */
function sanitizeUserAgent(userAgent) {
  if (!userAgent) return 'unknown';
  
  // Удаляем потенциально чувствительную информацию
  return userAgent
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]') // IP адреса
    .replace(/[A-Za-z0-9+/]{20,}/g, '[TOKEN]') // Потенциальные токены
    .substring(0, 500); // Ограничиваем длину
}

/**
 * Генерация уникального ID для обработки
 */
function generateProcessingId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `proc_${timestamp}_${random}`;
}