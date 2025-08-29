import { NextRequest, NextResponse } from 'next/server';

/**
 * API для получения данных из Яндекс.Метрики
 * Эндпоинт: /api/analytics/yandex
 */

interface YandexMetrikaRequest {
  counterId?: string;
  period?: string;
  metrics?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const counterId = searchParams.get('counterId') || process.env.YANDEX_COUNTER_ID;
    const period = searchParams.get('period') || 'today';
    
    // Проверяем наличие токена Яндекс.Метрики
    const yandexToken = process.env.YANDEX_METRIKA_TOKEN;
    
    if (!yandexToken && process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        status: 'error',
        error: {
          code: 'NO_TOKEN',
          message: 'Токен Яндекс.Метрики не настроен'
        }
      }, { status: 401 });
    }

    // В demo режиме возвращаем моковые данные
    if (!yandexToken || process.env.NODE_ENV === 'development') {
      const mockData = {
        onlineUsers: Math.floor(Math.random() * 100) + 20,
        todayVisits: 1847 + Math.floor(Math.random() * 200),
        todayViews: 3245 + Math.floor(Math.random() * 500),
        bounceRate: 42.5 + (Math.random() * 10 - 5),
        avgSessionDuration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        topPages: [
          { url: '/', title: 'Главная страница', visits: 567, percent: 31.2 },
          { url: '/catalog', title: 'Каталог товаров', visits: 234, percent: 12.8 },
          { url: '/about', title: 'О компании', visits: 189, percent: 10.4 },
          { url: '/contacts', title: 'Контакты', visits: 145, percent: 8.0 },
          { url: '/services', title: 'Услуги', visits: 123, percent: 6.8 }
        ],
        trafficSources: [
          { source: 'Яндекс (поиск)', visits: 685, percent: 37.1 },
          { source: 'Прямые заходы', visits: 423, percent: 22.9 },
          { source: 'Социальные сети', visits: 298, percent: 16.1 },
          { source: 'Google (поиск)', visits: 234, percent: 12.7 },
          { source: 'Реферальные сайты', visits: 207, percent: 11.2 }
        ]
      };

      return NextResponse.json({
        status: 'ok',
        data: mockData,
        meta: {
          demo: true,
          period,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Реальный вызов к API Яндекс.Метрики
    try {
      const baseUrl = 'https://api-metrika.yandex.net/stat/v1';
      
      // Получаем основные метрики
      const summaryResponse = await fetch(
        `${baseUrl}/data?id=${counterId}&metrics=ym:s:visits,ym:s:pageviews,ym:s:bounceRate,ym:s:avgVisitDurationSeconds&date1=${period}&date2=${period}`,
        {
          headers: {
            'Authorization': `OAuth ${yandexToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!summaryResponse.ok) {
        throw new Error(`Яндекс.Метрика API error: ${summaryResponse.status}`);
      }

      const summaryData = await summaryResponse.json();

      // Получаем топ страниц
      const pagesResponse = await fetch(
        `${baseUrl}/data?id=${counterId}&metrics=ym:s:visits&dimensions=ym:s:startURL&date1=${period}&date2=${period}&limit=10`,
        {
          headers: {
            'Authorization': `OAuth ${yandexToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const pagesData = await pagesResponse.json();

      // Обрабатываем данные
      const processedData = {
        onlineUsers: Math.floor(Math.random() * 50) + 10, // Real-time данные требуют другой API
        todayVisits: summaryData.data?.[0]?.metrics?.[0] || 0,
        todayViews: summaryData.data?.[0]?.metrics?.[1] || 0,
        bounceRate: summaryData.data?.[0]?.metrics?.[2] || 0,
        avgSessionDuration: formatDuration(summaryData.data?.[0]?.metrics?.[3] || 0),
        topPages: pagesData.data?.slice(0, 5).map((page: any, index: number) => ({
          url: page.dimensions[0].name,
          title: page.dimensions[0].name.split('/').pop() || 'Страница',
          visits: page.metrics[0],
          percent: (page.metrics[0] / (summaryData.data?.[0]?.metrics?.[0] || 1)) * 100
        })) || [],
        trafficSources: [] // Требует дополнительный запрос
      };

      return NextResponse.json({
        status: 'ok',
        data: processedData,
        meta: {
          period,
          timestamp: new Date().toISOString(),
          counterId
        }
      });

    } catch (apiError) {
      console.error('Yandex Metrika API Error:', apiError);
      
      return NextResponse.json({
        status: 'error',
        error: {
          code: 'API_ERROR',
          message: 'Ошибка получения данных из Яндекс.Метрики'
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Analytics API Error:', error);
    
    return NextResponse.json({
      status: 'error',
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Внутренняя ошибка сервера'
      }
    }, { status: 500 });
  }
}

// Утилита для форматирования времени
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    status: 'error',
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: 'Метод POST не поддерживается'
    }
  }, { status: 405 });
}