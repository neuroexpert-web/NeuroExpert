import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Симуляция данных Google Analytics
    const mockData = {
      activeUsers: Math.floor(Math.random() * 500) + 200,
      pageViews: Math.floor(Math.random() * 2000) + 1000,
      sessions: Math.floor(Math.random() * 800) + 400,
      newUsers: Math.floor(Math.random() * 300) + 150,
      trafficSources: [
        { source: 'Organic Search', percentage: 45, users: 1240 },
        { source: 'Direct', percentage: 28, users: 770 },
        { source: 'Social', percentage: 15, users: 410 },
        { source: 'Referral', percentage: 12, users: 330 }
      ],
      topCountries: [
        { country: 'Russia', users: 1850 },
        { country: 'Belarus', users: 420 },
        { country: 'Kazakhstan', users: 380 }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ошибка получения данных Google Analytics' },
      { status: 500 }
    );
  }
}