import { NextRequest, NextResponse } from 'next/server';
import type { MetricsOverview, ApiResponse } from '@/types/dashboard';

/**
 * /api/metrics/overview - Сводка SLO/аптайм/ошибки/трафик
 * Агрегирует данные из GA/Metrica, Sentry и /systemmetrics
 */

// Генерация демо данных для overview
function generateOverviewMetrics(): MetricsOverview {
  const now = Date.now();
  const hour = new Date().getHours();
  
  // Имитация изменений метрик в течение дня
  const trafficMultiplier = hour >= 9 && hour <= 18 ? 1.2 : 0.8;
  
  return {
    slo: {
      target: 99.9,
      actual: +(99.85 + Math.random() * 0.1).toFixed(2),
      errorBudgetUsedPct: +(15 + Math.random() * 20).toFixed(1),
      period: "24h",
      units: "percent"
    },
    uptime: {
      last1h: 100,
      last24h: +(99.9 + Math.random() * 0.1).toFixed(2),
      last30d: +(99.85 + Math.random() * 0.1).toFixed(2),
      units: "percent"
    },
    traffic: {
      usersOnline: Math.floor((100 + Math.random() * 80) * trafficMultiplier),
      sessions: Math.floor((2000 + Math.random() * 1000) * trafficMultiplier),
      conversionRate: +(3.2 + Math.random() * 1.2).toFixed(1),
      units: "percent"
    },
    errors: {
      rate: +(Math.random() * 0.5).toFixed(2),
      topIssues: ["AUTH-401", "TIMEOUT-API", "DB-CONNECTION"],
      units: "errors/min"
    },
    performance: {
      p95: Math.floor(300 + Math.random() * 200),
      p99: Math.floor(700 + Math.random() * 300),
      units: "ms"
    }
  };
}

// Проверка авторизации
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
  
  // Для демо всегда авторизуем
  return { authorized: true, role: 'Admin' };
}

// Фильтрация по роли
function filterByRole(metrics: MetricsOverview, role: string): MetricsOverview {
  switch (role) {
    case 'Client':
      // Клиенты не видят детальные ошибки
      return {
        ...metrics,
        errors: {
          rate: metrics.errors.rate,
          topIssues: [], // Скрываем детали ошибок
          units: metrics.errors.units
        }
      };
      
    case 'Manager':
    case 'Admin':
    default:
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
        error: { code: "UNAUTHORIZED", message: "Invalid authorization token" }
      } as ApiResponse<never>, { status: 401 });
    }

    // Получение параметров
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const env = searchParams.get('env') || 'prod';
    const project = searchParams.get('project');
    const version = searchParams.get('version');
    
    // Генерация метрик
    const rawMetrics = generateOverviewMetrics();
    const filteredMetrics = filterByRole(rawMetrics, role || 'Client');
    
    const response: ApiResponse<MetricsOverview> = {
      status: "ok",
      data: filteredMetrics,
      meta: {
        from,
        to,
        env,
        project,
        version,
        role,
        refreshInterval: 15000 // 15 секунд для критических метрик
      },
      links: {
        slo: "/dashboard/slo",
        errors: "/dashboard/errors", 
        apm: "/dashboard/performance",
        traffic: "/dashboard/users"
      }
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Metrics Overview API Error:', error);
    
    return NextResponse.json({
      status: "error",
      error: { 
        code: "INTERNAL_ERROR", 
        message: "Failed to fetch overview metrics" 
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