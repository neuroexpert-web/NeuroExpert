import { NextRequest, NextResponse } from 'next/server';
import type { SystemMetrics, ApiResponse } from '@/types/dashboard';

/**
 * /api/systemmetrics - Системные метрики для мониторинга
 * Трехуровневый мониторинг: хост, приложение, БД/кэш
 */

// Генерация реалистичных демо-данных
function generateSystemMetrics(): SystemMetrics {
  const baseTime = Date.now();
  
  return {
    host: {
      cpuPct: +(45 + Math.random() * 30).toFixed(1),
      ramUsedPct: +(60 + Math.random() * 25).toFixed(1),
      disk: [
        {
          mount: "/",
          usedPct: +(50 + Math.random() * 30).toFixed(1),
          iops: Math.floor(400 + Math.random() * 300),
          latencyMs: +(2 + Math.random() * 4).toFixed(1)
        },
        {
          mount: "/var/log",
          usedPct: +(70 + Math.random() * 20).toFixed(1),
          iops: Math.floor(100 + Math.random() * 150),
          latencyMs: +(1.5 + Math.random() * 2).toFixed(1)
        }
      ],
      net: {
        inMbps: +(80 + Math.random() * 60).toFixed(1),
        outMbps: +(65 + Math.random() * 50).toFixed(1),
        errors: Math.floor(Math.random() * 3)
      }
    },
    app: {
      rps: Math.floor(150 + Math.random() * 100),
      latencyMs: {
        p50: Math.floor(80 + Math.random() * 40),
        p95: Math.floor(300 + Math.random() * 200),
        p99: Math.floor(700 + Math.random() * 400)
      },
      errorRatePct: +(Math.random() * 0.5).toFixed(2),
      queues: {
        requests: Math.floor(Math.random() * 25)
      }
    },
    db: {
      connections: Math.floor(30 + Math.random() * 30),
      slowQueries: Math.floor(Math.random() * 8),
      cacheHitPct: +(94 + Math.random() * 5).toFixed(1),
      replicationLagSec: Math.floor(Math.random() * 3)
    },
    build: {
      version: "2025.08.29-1",
      uptimeSec: Math.floor(baseTime / 1000) % 86400 // Секунды с начала дня
    }
  };
}

// Проверка авторизации и роли
function checkAuth(request: NextRequest): { authorized: boolean; role?: string } {
  const authHeader = request.headers.get('authorization');
  
  // Для демо всегда авторизуем как Admin
  if (!authHeader?.startsWith('Bearer ')) {
    return { authorized: true, role: 'Admin' };
  }
  
  const token = authHeader.substring(7);
  
  // Для демо поддерживаем специальный токен
  if (token === 'demo-token') {
    return { authorized: true, role: 'Admin' };
  }
  
  // TODO: Здесь будет JWT проверка
  // const payload = jwt.verify(token, process.env.JWT_SECRET);
  // return { authorized: true, role: payload.role };
  
  // Для демо всегда авторизуем
  return { authorized: true, role: 'Admin' };
}

// Фильтрация данных по роли
function filterByRole(metrics: SystemMetrics, role: string): SystemMetrics {
  switch (role) {
    case 'Client':
      // Клиенты видят только агрегированные статусы
      return {
        host: {
          cpuPct: metrics.host.cpuPct,
          ramUsedPct: metrics.host.ramUsedPct,
          disk: [{ 
            mount: "Общий", 
            usedPct: metrics.host.disk[0].usedPct, 
            iops: 0, 
            latencyMs: 0 
          }],
          net: { inMbps: 0, outMbps: 0, errors: 0 }
        },
        app: {
          rps: metrics.app.rps,
          latencyMs: { p50: metrics.app.latencyMs.p95, p95: 0, p99: 0 },
          errorRatePct: metrics.app.errorRatePct,
          queues: { requests: 0 }
        },
        db: {
          connections: 0,
          slowQueries: 0,
          cacheHitPct: metrics.db.cacheHitPct,
          replicationLagSec: 0
        },
        build: metrics.build
      };
      
    case 'Manager':
      // Менеджеры видят операционные метрики без низкоуровневых деталей
      return {
        ...metrics,
        host: {
          ...metrics.host,
          disk: metrics.host.disk.map(d => ({ ...d, iops: 0, latencyMs: 0 }))
        }
      };
      
    case 'Admin':
    default:
      // Админы видят все
      return metrics;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Проверка авторизации
    const { authorized, role } = checkAuth(request);
    if (!authorized) {
      return NextResponse.json({
        status: "error",
        error: { code: "UNAUTHORIZED", message: "Invalid or missing authorization token" }
      } as ApiResponse<never>, { status: 401 });
    }

    // Получение параметров
    const { searchParams } = new URL(request.url);
    const env = searchParams.get('env') || 'prod';
    
    // Генерация метрик
    const rawMetrics = generateSystemMetrics();
    const filteredMetrics = filterByRole(rawMetrics, role || 'Client');
    
    const response: ApiResponse<SystemMetrics> = {
      status: "ok",
      data: filteredMetrics,
      meta: {
        env,
        ts: new Date().toISOString(),
        role,
        refreshInterval: 15000 // 15 секунд
      },
      links: {
        dashboard: "/dashboard/infrastructure",
        alerts: "/dashboard/alerts"
      }
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('SystemMetrics API Error:', error);
    
    return NextResponse.json({
      status: "error",
      error: { 
        code: "INTERNAL_ERROR", 
        message: "Failed to fetch system metrics" 
      }
    } as ApiResponse<never>, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}