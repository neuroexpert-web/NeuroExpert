import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Инициализация Google Analytics Data API
const analytics = google.analyticsdata('v1beta');

// Получение аутентификации
async function getAuth() {
  try {
    // Используем сервисный аккаунт для доступа к GA4
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    
    return auth;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric') || 'all';
    const dateRange = searchParams.get('dateRange') || 'today';
    
    // Получаем аутентификацию
    const auth = await getAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Property ID для GA4
    const propertyId = process.env.NEXT_PUBLIC_GA4_PROPERTY_ID;
    
    // Определяем диапазон дат
    let startDate = 'today';
    let endDate = 'today';
    
    switch (dateRange) {
      case 'week':
        startDate = '7daysAgo';
        break;
      case 'month':
        startDate = '30daysAgo';
        break;
      case 'year':
        startDate = '365daysAgo';
        break;
    }

    // Базовые метрики
    const metrics = [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' },
      { name: 'conversions' },
      { name: 'totalRevenue' }
    ];

    // Измерения
    const dimensions = [
      { name: 'date' },
      { name: 'sessionSource' },
      { name: 'deviceCategory' },
      { name: 'country' },
      { name: 'pagePath' }
    ];

    // Запрос к GA4 API
    const response = await analytics.properties.runReport({
      property: `properties/${propertyId}`,
      auth,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics,
        dimensions,
        limit: 100
      }
    });

    // Обработка результатов
    const data = response.data;
    
    // Форматируем данные для дашборда
    const analyticsData = {
      realtime: {
        users: parseInt(data.rows?.[0]?.metricValues?.[0]?.value || 0),
        pageviews: parseInt(data.rows?.[0]?.metricValues?.[2]?.value || 0),
        activeSessions: parseInt(data.rows?.[0]?.metricValues?.[1]?.value || 0)
      },
      traffic: {
        total: data.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[1]?.value || 0), 0) || 0,
        sources: extractTrafficSources(data.rows)
      },
      conversions: {
        total: data.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[5]?.value || 0), 0) || 0,
        rate: parseFloat(data.rows?.[0]?.metricValues?.[3]?.value || 0) * 100,
        revenue: parseFloat(data.rows?.reduce((sum, row) => sum + parseFloat(row.metricValues[6]?.value || 0), 0) || 0)
      },
      behavior: {
        bounceRate: parseFloat(data.rows?.[0]?.metricValues?.[3]?.value || 0) * 100,
        avgDuration: parseFloat(data.rows?.[0]?.metricValues?.[4]?.value || 0),
        deviceTypes: extractDeviceTypes(data.rows)
      },
      topPages: extractTopPages(data.rows)
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('GA4 API Error:', error);
    
    // Возвращаем демо-данные если нет доступа к реальным
    return NextResponse.json({
      demo: true,
      message: 'Using demo data. Configure Google Analytics credentials for real data.',
      realtime: {
        users: Math.floor(Math.random() * 100) + 50,
        pageviews: Math.floor(Math.random() * 500) + 200,
        activeSessions: Math.floor(Math.random() * 80) + 30
      },
      traffic: {
        total: 15420,
        sources: [
          { name: 'Google', visits: 6500, percentage: 42 },
          { name: 'Яндекс', visits: 4200, percentage: 27 },
          { name: 'Прямой', visits: 2300, percentage: 15 },
          { name: 'Социальные', visits: 1400, percentage: 9 },
          { name: 'Реферальный', visits: 1020, percentage: 7 }
        ]
      },
      conversions: {
        total: 245,
        rate: 3.8,
        revenue: 2450000
      },
      behavior: {
        bounceRate: 42.5,
        avgDuration: 185,
        deviceTypes: [
          { type: 'Desktop', percentage: 58 },
          { type: 'Mobile', percentage: 37 },
          { type: 'Tablet', percentage: 5 }
        ]
      }
    });
  }
}

// Вспомогательные функции для обработки данных
function extractTrafficSources(rows) {
  const sources = {};
  
  rows?.forEach(row => {
    const source = row.dimensionValues[1]?.value || 'direct';
    const sessions = parseInt(row.metricValues[1]?.value || 0);
    
    if (sources[source]) {
      sources[source] += sessions;
    } else {
      sources[source] = sessions;
    }
  });
  
  const total = Object.values(sources).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(sources)
    .map(([name, visits]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      visits,
      percentage: Math.round((visits / total) * 100)
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);
}

function extractDeviceTypes(rows) {
  const devices = {};
  
  rows?.forEach(row => {
    const device = row.dimensionValues[2]?.value || 'desktop';
    const sessions = parseInt(row.metricValues[1]?.value || 0);
    
    if (devices[device]) {
      devices[device] += sessions;
    } else {
      devices[device] = sessions;
    }
  });
  
  const total = Object.values(devices).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(devices)
    .map(([type, sessions]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      percentage: Math.round((sessions / total) * 100)
    }));
}

function extractTopPages(rows) {
  const pages = {};
  
  rows?.forEach(row => {
    const page = row.dimensionValues[4]?.value || '/';
    const views = parseInt(row.metricValues[2]?.value || 0);
    
    if (pages[page]) {
      pages[page] += views;
    } else {
      pages[page] = views;
    }
  });
  
  return Object.entries(pages)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}