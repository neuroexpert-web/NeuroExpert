import { NextResponse } from 'next/server';

// Объединенный API для всех аналитических сервисов
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'today';
    
    // Базовый URL для внутренних API запросов
    const baseUrl = request.nextUrl.origin;
    
    // Параллельные запросы ко всем сервисам
    const [googleData, yandexData] = await Promise.all([
      fetch(`${baseUrl}/api/analytics/google?dateRange=${dateRange}`).then(res => res.json()),
      fetch(`${baseUrl}/api/analytics/yandex?dateRange=${dateRange}`).then(res => res.json())
    ]);

    // Объединяем данные из разных источников
    const unifiedData = {
      lastUpdated: new Date().toISOString(),
      isRealData: !googleData.demo && !yandexData.demo,
      
      // Реалтайм данные (берем максимальные значения)
      realtime: {
        users: Math.max(googleData.realtime?.users || 0, yandexData.realtime?.users || 0),
        pageviews: googleData.realtime?.pageviews + yandexData.realtime?.pageviews || 0,
        activeSessions: googleData.realtime?.activeSessions || 0,
        topPages: googleData.topPages || []
      },
      
      // Трафик (объединяем источники)
      traffic: {
        total: (googleData.traffic?.total || 0) + (yandexData.summary?.visits || 0),
        sources: mergeTrafficSources(googleData.traffic?.sources, yandexData.sources)
      },
      
      // Конверсии
      conversions: {
        total: googleData.conversions?.total || 0,
        rate: googleData.conversions?.rate || 0,
        revenue: googleData.conversions?.revenue || 0,
        goals: [] // Будет заполнено из целей Метрики
      },
      
      // Поведение (усредняем показатели)
      behavior: {
        bounceRate: averageMetric(googleData.behavior?.bounceRate, yandexData.summary?.bounceRate),
        avgDuration: averageMetric(googleData.behavior?.avgDuration, yandexData.summary?.avgDuration),
        pagesPerSession: calculatePagesPerSession(googleData, yandexData),
        deviceTypes: mergeDeviceTypes(googleData.behavior?.deviceTypes, yandexData.devices)
      },
      
      // Рекламные кампании (получаем из Google Ads API)
      campaigns: await getCampaignData(dateRange),
      
      // Дополнительные метрики
      social: await getSocialMetrics(dateRange),
      seo: await getSEOMetrics(dateRange),
      
      // Рекомендации на основе данных
      recommendations: generateRecommendations(googleData, yandexData)
    };

    return NextResponse.json(unifiedData);
  } catch (error) {
    console.error('Unified Analytics Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}

// Объединение источников трафика
function mergeTrafficSources(googleSources = [], yandexSources = []) {
  const merged = {};
  
  // Добавляем данные Google
  googleSources.forEach(source => {
    merged[source.name] = (merged[source.name] || 0) + source.visits;
  });
  
  // Добавляем данные Яндекс
  yandexSources.forEach(source => {
    merged[source.name] = (merged[source.name] || 0) + source.visits;
  });
  
  // Преобразуем обратно в массив
  const total = Object.values(merged).reduce((sum, visits) => sum + visits, 0);
  
  return Object.entries(merged)
    .map(([name, visits]) => ({
      name,
      visits,
      percentage: Math.round((visits / total) * 100)
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);
}

// Объединение типов устройств
function mergeDeviceTypes(googleDevices = [], yandexDevices = []) {
  const deviceMap = {
    'Desktop': 'Компьютер',
    'Mobile': 'Мобильный',
    'Tablet': 'Планшет'
  };
  
  const merged = {};
  
  // Нормализуем и объединяем
  [...googleDevices, ...yandexDevices].forEach(device => {
    const normalizedType = deviceMap[device.type] || device.type;
    merged[normalizedType] = (merged[normalizedType] || 0) + device.percentage / 2;
  });
  
  return Object.entries(merged).map(([type, percentage]) => ({
    type,
    percentage: Math.round(percentage)
  }));
}

// Усреднение метрик
function averageMetric(metric1, metric2) {
  const validMetrics = [metric1, metric2].filter(m => m !== undefined && m !== null);
  if (validMetrics.length === 0) return 0;
  return validMetrics.reduce((sum, m) => sum + m, 0) / validMetrics.length;
}

// Расчет страниц за сессию
function calculatePagesPerSession(googleData, yandexData) {
  const googlePPS = googleData.traffic?.total ? 
    googleData.realtime?.pageviews / googleData.traffic.total : 0;
  const yandexPPS = yandexData.summary?.visits ? 
    yandexData.summary.pageviews / yandexData.summary.visits : 0;
  
  return Math.round(averageMetric(googlePPS, yandexPPS) * 10) / 10;
}

// Получение данных рекламных кампаний
async function getCampaignData(dateRange) {
  // Здесь будут реальные запросы к Google Ads и Яндекс.Директ
  // Пока возвращаем демо-данные
  return [
    { 
      name: 'Google Ads - Поиск',
      spend: 45000,
      clicks: 2300,
      conversions: 89,
      revenue: 890000,
      roi: 1878,
      cpc: 19.57,
      ctr: 3.2
    },
    {
      name: 'Яндекс.Директ',
      spend: 32000,
      clicks: 1850,
      conversions: 72,
      revenue: 650000,
      roi: 1931,
      cpc: 17.30,
      ctr: 2.8
    },
    {
      name: 'Facebook Ads',
      spend: 25000,
      clicks: 3200,
      conversions: 45,
      revenue: 380000,
      roi: 1420,
      cpc: 7.81,
      ctr: 1.5
    },
    {
      name: 'VK Реклама',
      spend: 15000,
      clicks: 2100,
      conversions: 39,
      revenue: 290000,
      roi: 1833,
      cpc: 7.14,
      ctr: 2.1
    }
  ];
}

// Получение социальных метрик
async function getSocialMetrics(dateRange) {
  return {
    followers: {
      vk: 12500,
      telegram: 8300,
      youtube: 5600
    },
    engagement: {
      avgLikes: 250,
      avgComments: 45,
      avgShares: 80
    },
    topPosts: [
      { title: 'Как AI изменит бизнес в 2025', likes: 580, shares: 120 },
      { title: 'Кейс: ROI 2000% с NeuroExpert', likes: 420, shares: 95 }
    ]
  };
}

// Получение SEO метрик
async function getSEOMetrics(dateRange) {
  return {
    organicTraffic: 4200,
    avgPosition: 12.5,
    topKeywords: [
      { keyword: 'AI для бизнеса', position: 3, clicks: 450 },
      { keyword: 'нейросети маркетинг', position: 5, clicks: 320 },
      { keyword: 'автоматизация продаж AI', position: 8, clicks: 280 }
    ],
    backlinks: 156,
    domainRating: 45
  };
}

// Генерация рекомендаций на основе данных
function generateRecommendations(googleData, yandexData) {
  const recommendations = [];
  
  // Анализ bounce rate
  const bounceRate = averageMetric(googleData.behavior?.bounceRate, yandexData.summary?.bounceRate);
  if (bounceRate > 50) {
    recommendations.push({
      priority: 'high',
      type: 'ux',
      title: 'Снизить показатель отказов',
      description: `Текущий bounce rate ${bounceRate.toFixed(1)}% выше нормы. Рекомендуем улучшить скорость загрузки и первое впечатление.`,
      impact: 'Потенциальное увеличение конверсии на 15-20%'
    });
  }
  
  // Анализ мобильного трафика
  const mobilePercentage = googleData.behavior?.deviceTypes?.find(d => d.type === 'Mobile')?.percentage || 0;
  if (mobilePercentage > 30 && bounceRate > 45) {
    recommendations.push({
      priority: 'high',
      type: 'mobile',
      title: 'Оптимизировать мобильную версию',
      description: `${mobilePercentage}% трафика с мобильных устройств. Улучшение мобильного UX критично.`,
      impact: 'Увеличение мобильных конверсий на 25-30%'
    });
  }
  
  // Анализ источников трафика
  const topSource = googleData.traffic?.sources?.[0];
  if (topSource && topSource.percentage > 50) {
    recommendations.push({
      priority: 'medium',
      type: 'traffic',
      title: 'Диверсифицировать источники трафика',
      description: `${topSource.name} приносит ${topSource.percentage}% трафика. Рекомендуем развивать другие каналы.`,
      impact: 'Снижение рисков и увеличение охвата на 30%'
    });
  }
  
  return recommendations;
}