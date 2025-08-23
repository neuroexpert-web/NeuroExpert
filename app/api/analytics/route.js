import { NextResponse } from 'next/server';
import { securityMiddleware, getClientIP, validators } from '../../utils/security';

// Временное хранилище для демо (в продакшене использовать БД)
const analyticsStore = [];

export async function POST(request) {
  // Проверка безопасности
  const securityCheck = await securityMiddleware(request);
  if (securityCheck) return securityCheck;

  try {
    const event = await request.json();
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Валидация данных
    if (!event.eventType || !event.eventName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Дополняем событие серверными данными
    const enrichedEvent = {
      ...event,
      serverTimestamp: Date.now(),
      ip: ip,
      userAgent: userAgent,
      processed: true
    };

    // Сохраняем событие
    analyticsStore.push(enrichedEvent);

    // В продакшене здесь должна быть отправка в БД или внешний сервис
    if (process.env.NODE_ENV === 'production') {
      // await saveToDatabase(enrichedEvent);
      // await sendToAnalyticsService(enrichedEvent);
    }

    // Отправляем в Telegram для важных событий
    if (['roi_calculation', 'form_submit', 'error'].includes(event.eventType)) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `📊 Analytics Event: ${event.eventName}\nType: ${event.eventType}\nDetails: ${JSON.stringify(event.properties, null, 2)}`
          })
        });
      } catch (error) {
        console.error('Failed to send to Telegram:', error);
      }
    }

    return NextResponse.json({
      success: true,
      eventId: enrichedEvent.timestamp,
      processed: true
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process event' },
      { status: 500 }
    );
  }
}

// Endpoint для получения аналитики (только для авторизованных)
export async function GET(request) {
  // В продакшене добавить проверку авторизации
  const { searchParams } = new URL(request.url);
  const eventType = searchParams.get('eventType');
  const limit = parseInt(searchParams.get('limit') || '100');

  let events = analyticsStore;

  // Фильтрация по типу
  if (eventType) {
    events = events.filter(e => e.eventType === eventType);
  }

  // Ограничение количества
  events = events.slice(-limit);

  // Агрегация статистики
  const stats = {
    total: analyticsStore.length,
    byType: {},
    lastHour: 0,
    uniqueSessions: new Set()
  };

  const hourAgo = Date.now() - 3600000;

  analyticsStore.forEach(event => {
    // По типам
    stats.byType[event.eventType] = (stats.byType[event.eventType] || 0) + 1;
    
    // За последний час
    if (event.timestamp > hourAgo) {
      stats.lastHour++;
    }
    
    // Уникальные сессии
    if (event.sessionId) {
      stats.uniqueSessions.add(event.sessionId);
    }
  });

  stats.uniqueSessions = stats.uniqueSessions.size;

  return NextResponse.json({
    success: true,
    events,
    stats,
    timestamp: Date.now()
  });
}