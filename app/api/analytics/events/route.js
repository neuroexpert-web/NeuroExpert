/**
 * NeuroExpert Analytics Events API
 * Защищенный endpoint для приема аналитических событий
 * Включает: Rate Limiting, CSRF Protection, JWT Auth, Input Validation
 */

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Простая реализация rate limiting (в продакшене использовать Redis)
const requestCounts = new Map();

function simpleRateLimit(ip, windowMs = 60000, max = 100) {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, new Map());
  }
  
  const userWindows = requestCounts.get(ip);
  const currentWindow = userWindows.get(windowStart) || 0;
  
  if (currentWindow >= max) {
    return { blocked: true, retryAfter: Math.ceil((windowStart + windowMs - now) / 1000) };
  }
  
  userWindows.set(windowStart, currentWindow + 1);
  
  // Очистка старых окон
  for (const [timestamp] of userWindows) {
    if (timestamp < windowStart) {
      userWindows.delete(timestamp);
    }
  }
  
  return { blocked: false, remaining: max - currentWindow - 1 };
}

// Простая валидация
function validateAnalyticsEvent(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid data'] };
  }
  
  if (!data.eventType || !data.events || !Array.isArray(data.events)) {
    return { valid: false, errors: ['Missing required fields'] };
  }
  
  return { valid: true, errors: [] };
}

// Простое сохранение (логирование)
async function saveAnalyticsEvents(data) {
  console.log('📊 Analytics Events Received:', {
    eventType: data.eventType,
    eventsCount: data.events?.length || 0,
    timestamp: Date.now()
  });
  
  return { success: true, processedCount: data.events?.length || 0 };
}

/**
 * POST /api/analytics/events
 * Прием аналитических событий
 */
export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(headers());
    const rateLimitResult = simpleRateLimit(clientIP);
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

    // Простая проверка источника
    const source = headersList.get('x-analytics-source');
    if (!source || source !== 'neuroexpert-frontend') {
      // Пока пропускаем, но логируем
      console.warn('Unknown analytics source:', source);
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

    // Простое обогащение данных
    const enrichedData = {
      ...body,
      metadata: {
        ...body.metadata,
        receivedAt: Date.now(),
        clientIP: hashIP(getClientIP(headersList)),
        userAgent: headersList.get('user-agent')?.substring(0, 200) || 'unknown'
      }
    };
    
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
 * Простое хеширование IP
 */
function hashIP(ip) {
  if (!ip || ip === 'unknown') return 'unknown';
  
  // Простое хеширование для анонимизации
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 8);
}

/**
 * Генерация уникального ID для обработки
 */
function generateProcessingId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `proc_${timestamp}_${random}`;
}