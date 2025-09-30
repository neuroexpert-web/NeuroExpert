import { NextRequest } from 'next/server';
import type { RealtimeEvent } from '@/types/dashboard';

/**
 * /api/events - Server-Sent Events для real-time обновлений
 * Push-канал для критичных обновлений (аптайм, SLO, ошибки)
 */

// Проверка авторизации
function checkAuth(request: NextRequest): { authorized: boolean; role?: string } {
  const authHeader = request.headers.get('authorization');
  const token = new URL(request.url).searchParams.get('token');
  
  const authToken = authHeader?.replace('Bearer ', '') || token;
  
  if (!authToken) {
    return { authorized: false };
  }
  
  // Для демо поддерживаем специальный токен
  if (authToken === 'demo-token') {
    return { authorized: true, role: 'Admin' };
  }
  
  // TODO: Здесь будет JWT проверка
  return { authorized: false };
}

// Генерация реалтайм событий
function generateRealtimeEvent(type: string): RealtimeEvent {
  const now = new Date().toISOString();
  
  switch (type) {
    case 'heartbeat':
      return {
        type: 'heartbeat',
        data: { timestamp: now, status: 'alive' },
        timestamp: now
      };
      
    case 'metricUpdate':
      return {
        type: 'metricUpdate',
        data: {
          slo: {
            actual: +(99.85 + Math.random() * 0.1).toFixed(2),
            errorBudgetUsedPct: +(15 + Math.random() * 20).toFixed(1)
          },
          traffic: {
            usersOnline: Math.floor(100 + Math.random() * 80),
            sessions: Math.floor(2000 + Math.random() * 1000)
          },
          errors: {
            rate: +(Math.random() * 0.5).toFixed(2),
            totalErrors: Math.floor(80 + Math.random() * 20)
          },
          system: {
            cpuPct: +(45 + Math.random() * 30).toFixed(1),
            ramUsedPct: +(60 + Math.random() * 25).toFixed(1),
            rps: Math.floor(150 + Math.random() * 100)
          }
        },
        timestamp: now
      };
      
    case 'alert':
      const alerts = [
        { level: 'warning', message: 'CPU usage высокий', service: 'web' },
        { level: 'error', message: 'Timeout в API', service: 'api' },
        { level: 'info', message: 'Новый релиз развернут', service: 'deployment' }
      ];
      const alert = alerts[Math.floor(Math.random() * alerts.length)];
      
      return {
        type: 'alert',
        data: {
          ...alert,
          source: 'system',
          env: 'prod',
          ts: now,
          fingerprint: `${alert.service}-${Date.now()}`
        },
        timestamp: now
      };
      
    default:
      return {
        type: 'heartbeat',
        data: { timestamp: now },
        timestamp: now
      };
  }
}

export async function GET(request: NextRequest) {
  // Проверка авторизации
  const { authorized, role } = checkAuth(request);
  if (!authorized) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Получение параметров
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel') || 'general';
  const env = searchParams.get('env') || 'prod';

  // Настройка SSE
  const stream = new ReadableStream({
    start(controller) {
      // Функция отправки события
      const sendEvent = (event: RealtimeEvent) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      };

      // Отправляем приветственное сообщение
      sendEvent({
        type: 'heartbeat',
        data: { 
          message: `Connected to channel: ${channel}`, 
          role,
          env,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      });

      // Heartbeat каждые 30 секунд
      const heartbeatInterval = setInterval(() => {
        sendEvent(generateRealtimeEvent('heartbeat'));
      }, 30000);

      // Обновления метрик каждые 15 секунд
      const metricsInterval = setInterval(() => {
        sendEvent(generateRealtimeEvent('metricUpdate'));
      }, 15000);

      // Случайные алерты каждые 2 минуты
      const alertsInterval = setInterval(() => {
        if (Math.random() < 0.3) { // 30% вероятность
          sendEvent(generateRealtimeEvent('alert'));
        }
      }, 120000);

      // Очистка при закрытии соединения
      const cleanup = () => {
        clearInterval(heartbeatInterval);
        clearInterval(metricsInterval);  
        clearInterval(alertsInterval);
      };

      // Обработка закрытия соединения
      request.signal.addEventListener('abort', () => {
        cleanup();
        controller.close();
      });

      // Автоматическое закрытие через 10 минут
      setTimeout(() => {
        cleanup();
        controller.close();
      }, 10 * 60 * 1000);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Authorization',
    },
  });
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization',
    },
  });
}