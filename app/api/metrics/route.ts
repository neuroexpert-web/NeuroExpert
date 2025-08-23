import { NextResponse } from 'next/server';
import { analytics } from '../../utils/analytics';

// Симуляция данных метрик (в реальном приложении данные из БД)
async function getSystemMetrics() {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Основные метрики
  const metrics = {
    overview: {
      totalUsers: 1847,
      activeUsers: 342,
      totalProjects: 89,
      completedProjects: 67,
      avgROI: 287,
      totalRevenue: 18500000,
      monthlyGrowth: 23.5
    },
    
    // Временные метрики
    timeline: {
      daily: generateTimelineData(24, 'hour'),
      weekly: generateTimelineData(7, 'day'),
      monthly: generateTimelineData(30, 'day'),
      yearly: generateTimelineData(12, 'month')
    },
    
    // KPI
    kpi: {
      conversionRate: {
        value: 34.7,
        target: 30,
        trend: 'up',
        change: 15.6
      },
      customerSatisfaction: {
        value: 4.8,
        target: 4.5,
        trend: 'up',
        change: 6.7
      },
      projectDeliveryTime: {
        value: 2.3,
        target: 3,
        trend: 'down',
        change: -23.3
      },
      supportResponseTime: {
        value: 15,
        target: 30,
        trend: 'down',
        change: -50
      }
    },
    
    // Распределение по услугам
    serviceDistribution: [
      { name: 'AI Директор Pro', value: 35, revenue: 6475000 },
      { name: 'Автоматизация процессов', value: 28, revenue: 5180000 },
      { name: 'AI Директор Basic', value: 18, revenue: 3330000 },
      { name: 'Аналитика данных', value: 12, revenue: 2220000 },
      { name: 'Custom AI решения', value: 7, revenue: 1295000 }
    ],
    
    // Географическое распределение
    geoDistribution: [
      { region: 'Москва', clients: 42, revenue: 7770000 },
      { region: 'Санкт-Петербург', clients: 23, revenue: 4255000 },
      { region: 'Регионы', clients: 18, revenue: 3330000 },
      { region: 'СНГ', clients: 6, revenue: 1110000 },
      { region: 'Удаленно', clients: 11, revenue: 2035000 }
    ],
    
    // Производительность команды
    teamPerformance: {
      developers: {
        utilization: 87,
        projectsCompleted: 23,
        avgDeliveryTime: 2.1,
        satisfaction: 4.9
      },
      aiSpecialists: {
        utilization: 92,
        projectsCompleted: 18,
        avgDeliveryTime: 2.5,
        satisfaction: 4.7
      },
      projectManagers: {
        utilization: 78,
        projectsCompleted: 45,
        avgDeliveryTime: 2.3,
        satisfaction: 4.8
      }
    },
    
    // AI метрики
    aiMetrics: {
      totalInteractions: 28453,
      successfulResponses: 26789,
      avgResponseTime: 1.2,
      userSatisfaction: 91,
      tasksAutomated: 3456,
      timeSaved: 8923, // часов
      costSaved: 4461500 // рублей
    },
    
    // Финансовые показатели
    financial: {
      mrr: 4625000, // Monthly Recurring Revenue
      arr: 55500000, // Annual Recurring Revenue
      churnRate: 2.3,
      ltv: 8500000, // Lifetime Value
      cac: 180000, // Customer Acquisition Cost
      ltvCacRatio: 47.2
    }
  };

  return metrics;
}

// Генерация данных временной линии
function generateTimelineData(points: number, type: string) {
  const data = [];
  const baseValue = 100;
  
  for (let i = 0; i < points; i++) {
    const variation = Math.random() * 40 - 20;
    const value = Math.round(baseValue + variation + (i * 2));
    
    let label = '';
    const now = new Date();
    
    switch(type) {
      case 'hour':
        const hour = new Date(now.getTime() - (points - i) * 60 * 60 * 1000);
        label = hour.getHours() + ':00';
        break;
      case 'day':
        const day = new Date(now.getTime() - (points - i) * 24 * 60 * 60 * 1000);
        label = day.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        break;
      case 'month':
        const month = new Date(now.getFullYear(), now.getMonth() - (points - i), 1);
        label = month.toLocaleDateString('ru-RU', { month: 'short' });
        break;
    }
    
    data.push({ label, value, timestamp: new Date() });
  }
  
  return data;
}

// Получение метрик в реальном времени
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';
    const category = searchParams.get('category') || 'all';
    
    const metrics = await getSystemMetrics();
    
    // Фильтрация по категории
    let filteredMetrics = metrics;
    if (category !== 'all') {
      filteredMetrics = {
        ...metrics,
        [category]: metrics[category as keyof typeof metrics]
      };
    }
    
    // Трекинг запроса метрик
    analytics.trackEvent('metrics_viewed', {
      period,
      category
    });
    
    return NextResponse.json({
      success: true,
      data: filteredMetrics,
      timestamp: new Date(),
      period,
      category
    });
    
  } catch (error) {
    console.error('Metrics error:', error);
    analytics.trackError(error as Error, 'metrics_fetch');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch metrics' 
      },
      { status: 500 }
    );
  }
}

// WebSocket endpoint для реального времени (в Next.js используем polling)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    // Обработка различных типов событий
    switch(type) {
      case 'track_event':
        analytics.trackEvent(data.event, data.properties);
        break;
        
      case 'track_metric':
        // Здесь можно сохранять метрики в БД
        console.log('Tracking metric:', data);
        break;
        
      case 'alert':
        // Отправка уведомлений при критических метриках
        if (data.severity === 'critical') {
          await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `🚨 Критическая метрика: ${data.metric}\nЗначение: ${data.value}\nПорог: ${data.threshold}`
            })
          });
        }
        break;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Event processed'
    });
    
  } catch (error) {
    console.error('Metrics event error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process event' 
      },
      { status: 500 }
    );
  }
}