import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Симуляция данных Яндекс.Метрики
    const mockData = {
      visitors: Math.floor(Math.random() * 200) + 50,
      todayVisitors: Math.floor(Math.random() * 10000) + 5000,
      pageViews: Math.floor(Math.random() * 15000) + 8000,
      bounceRate: (Math.random() * 30 + 20).toFixed(1),
      avgSessionDuration: (Math.random() * 300 + 120).toFixed(0),
      topPages: [
        { page: '/', views: 2840 },
        { page: '/services', views: 1920 },
        { page: '/about', views: 1450 },
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ошибка получения данных Яндекс.Метрики' },
      { status: 500 }
    );
  }
}