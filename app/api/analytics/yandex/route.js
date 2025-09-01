import { NextResponse } from 'next/server';

// Yandex Metrika API endpoint
const YM_API_URL = 'https://api-metrika.yandex.net/stat/v1';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric') || 'all';
    const dateRange = searchParams.get('dateRange') || 'today';
    
    // Получаем токен и ID счетчика
    const token = process.env.YANDEX_METRIKA_TOKEN;
    const counterId = process.env.NEXT_PUBLIC_YM_ID;
    
    if (!token || !counterId) {
      throw new Error('Yandex Metrika credentials not configured');
    }

    // Определяем диапазон дат
    let date1 = new Date();
    let date2 = new Date();
    
    switch (dateRange) {
      case 'today':
        // Сегодня
        break;
      case 'week':
        date1.setDate(date1.getDate() - 7);
        break;
      case 'month':
        date1.setDate(date1.getDate() - 30);
        break;
      case 'year':
        date1.setDate(date1.getDate() - 365);
        break;
    }

    // Форматируем даты
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    // Запросы к разным эндпоинтам Яндекс.Метрики
    const endpoints = {
      summary: `/data?id=${counterId}&metrics=ym:s:visits,ym:s:pageviews,ym:s:users,ym:s:bounceRate,ym:s:avgVisitDurationSeconds&date1=${formatDate(date1)}&date2=${formatDate(date2)}`,
      sources: `/data?id=${counterId}&dimensions=ym:s:lastTrafficSource&metrics=ym:s:visits&date1=${formatDate(date1)}&date2=${formatDate(date2)}&limit=10`,
      devices: `/data?id=${counterId}&dimensions=ym:s:deviceCategory&metrics=ym:s:visits&date1=${formatDate(date1)}&date2=${formatDate(date2)}`,
      pages: `/data?id=${counterId}&dimensions=ym:s:startURLPath&metrics=ym:s:pageviews&date1=${formatDate(date1)}&date2=${formatDate(date2)}&limit=10`,
      goals: `/goals/${counterId}`,
      realtime: `/online/${counterId}`
    };

    // Выполняем запросы параллельно
    const headers = {
      'Authorization': `OAuth ${token}`,
      'Accept': 'application/json'
    };

    const [summaryRes, sourcesRes, devicesRes, pagesRes, realtimeRes] = await Promise.all([
      fetch(YM_API_URL + endpoints.summary, { headers }),
      fetch(YM_API_URL + endpoints.sources, { headers }),
      fetch(YM_API_URL + endpoints.devices, { headers }),
      fetch(YM_API_URL + endpoints.pages, { headers }),
      fetch(`https://api-metrika.yandex.net/management/v1/counter/${counterId}/online`, { headers })
    ]);

    // Проверяем статусы ответов
    if (!summaryRes.ok || !sourcesRes.ok || !devicesRes.ok || !pagesRes.ok) {
      throw new Error('Failed to fetch Yandex Metrika data');
    }

    // Парсим ответы
    const [summary, sources, devices, pages, realtime] = await Promise.all([
      summaryRes.json(),
      sourcesRes.json(),
      devicesRes.json(),
      pagesRes.json(),
      realtimeRes.ok ? realtimeRes.json() : { users: 0 }
    ]);

    // Форматируем данные
    const analyticsData = {
      yandex: true,
      realtime: {
        users: realtime.users || 0,
        pageviews: realtime.pageviews || 0
      },
      summary: {
        visits: summary.data?.[0]?.metrics?.[0] || 0,
        pageviews: summary.data?.[0]?.metrics?.[1] || 0,
        users: summary.data?.[0]?.metrics?.[2] || 0,
        bounceRate: summary.data?.[0]?.metrics?.[3] || 0,
        avgDuration: summary.data?.[0]?.metrics?.[4] || 0
      },
      sources: formatSources(sources.data),
      devices: formatDevices(devices.data),
      topPages: formatPages(pages.data)
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Yandex Metrika API Error:', error);
    
    // Возвращаем демо-данные если нет доступа
    return NextResponse.json({
      demo: true,
      message: 'Using demo data. Configure Yandex Metrika credentials for real data.',
      realtime: {
        users: Math.floor(Math.random() * 50) + 20,
        pageviews: Math.floor(Math.random() * 200) + 100
      },
      summary: {
        visits: 8420,
        pageviews: 24560,
        users: 6230,
        bounceRate: 38.5,
        avgDuration: 210
      },
      sources: [
        { name: 'Яндекс', visits: 3500, percentage: 42 },
        { name: 'Google', visits: 2100, percentage: 25 },
        { name: 'Прямые заходы', visits: 1680, percentage: 20 },
        { name: 'Социальные сети', visits: 840, percentage: 10 },
        { name: 'Другое', visits: 300, percentage: 3 }
      ],
      devices: [
        { type: 'Компьютер', percentage: 62 },
        { type: 'Мобильный', percentage: 33 },
        { type: 'Планшет', percentage: 5 }
      ]
    });
  }
}

// Форматирование источников трафика
function formatSources(data) {
  if (!data || !data.length) return [];
  
  const total = data.reduce((sum, item) => sum + (item.metrics?.[0] || 0), 0);
  
  return data.map(item => ({
    name: item.dimensions?.[0]?.name || 'Неизвестно',
    visits: item.metrics?.[0] || 0,
    percentage: Math.round(((item.metrics?.[0] || 0) / total) * 100)
  }));
}

// Форматирование устройств
function formatDevices(data) {
  if (!data || !data.length) return [];
  
  const total = data.reduce((sum, item) => sum + (item.metrics?.[0] || 0), 0);
  
  return data.map(item => ({
    type: item.dimensions?.[0]?.name || 'Неизвестно',
    percentage: Math.round(((item.metrics?.[0] || 0) / total) * 100)
  }));
}

// Форматирование популярных страниц
function formatPages(data) {
  if (!data || !data.length) return [];
  
  return data.map(item => ({
    page: item.dimensions?.[0]?.name || '/',
    views: item.metrics?.[0] || 0
  }));
}