import { NextResponse } from 'next/server';
import { logger } from '../../utils/logger';

// Простое хранилище для аналитики (в production используйте БД)
const analyticsStore = [];
const MAX_EVENTS = 1000; // Ограничение для предотвращения переполнения памяти

export async function POST(request) {
  try {
    const body = await request.json();
    const { event, properties, timestamp, url, userAgent } = body;

    // Валидация данных
    if (!event || typeof event !== 'string') {
      return NextResponse.json(
        { error: 'Invalid event name' },
        { status: 400 }
      );
    }

    // Создание записи события
    const analyticsEvent = {
      id: Date.now().toString(),
      event,
      properties: properties || {},
      timestamp: timestamp || new Date().toISOString(),
      url,
      userAgent,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };

    // Сохранение события
    analyticsStore.push(analyticsEvent);

    // Ограничение размера хранилища
    if (analyticsStore.length > MAX_EVENTS) {
      analyticsStore.shift(); // Удаляем самое старое событие
    }

    // Логирование важных событий
    if (event.includes('error') || event.includes('critical')) {
      logger.error('Analytics Error Event', analyticsEvent);
    } else {
      logger.info('Analytics Event', { event, properties });
    }

    // В production отправляйте в внешний сервис аналитики
    // await sendToExternalAnalytics(analyticsEvent);

    return NextResponse.json({ success: true, id: analyticsEvent.id });
  } catch (error) {
    logger.error('Analytics API Error', { error: error.message });
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    );
  }
}

// Endpoint для получения аналитики (только для разработки)
export async function GET(request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');
  const eventType = searchParams.get('event');

  let events = [...analyticsStore].reverse(); // Новые события первыми

  // Фильтрация по типу события
  if (eventType) {
    events = events.filter(e => e.event.includes(eventType));
  }

  // Ограничение количества
  events = events.slice(0, limit);

  return NextResponse.json({
    total: analyticsStore.length,
    events,
    filtered: eventType ? true : false
  });
}