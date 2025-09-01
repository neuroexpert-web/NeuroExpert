import { NextResponse } from 'next/server';

export async function GET() {
  // Проверяем наличие всех необходимых переменных окружения
  const analyticsConfig = {
    googleAnalytics: {
      configured: !!(
        process.env.NEXT_PUBLIC_GA4_ID && 
        process.env.NEXT_PUBLIC_GA4_PROPERTY_ID &&
        process.env.GOOGLE_PROJECT_ID &&
        process.env.GOOGLE_CLIENT_EMAIL
      ),
      variables: {
        GA4_ID: process.env.NEXT_PUBLIC_GA4_ID ? '✅ Установлен' : '❌ Отсутствует',
        GA4_PROPERTY_ID: process.env.NEXT_PUBLIC_GA4_PROPERTY_ID ? '✅ Установлен' : '❌ Отсутствует',
        GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID ? '✅ Установлен' : '❌ Отсутствует',
        GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL ? '✅ Установлен' : '❌ Отсутствует',
        GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? '✅ Установлен' : '❌ Отсутствует'
      }
    },
    yandexMetrika: {
      configured: !!(
        process.env.NEXT_PUBLIC_YM_ID && 
        process.env.YANDEX_METRIKA_TOKEN
      ),
      variables: {
        YM_ID: process.env.NEXT_PUBLIC_YM_ID ? '✅ Установлен' : '❌ Отсутствует',
        YANDEX_METRIKA_TOKEN: process.env.YANDEX_METRIKA_TOKEN ? '✅ Установлен' : '❌ Отсутствует'
      }
    },
    facebookPixel: {
      configured: !!process.env.NEXT_PUBLIC_FB_PIXEL_ID,
      variables: {
        FB_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID ? '✅ Установлен' : '❌ Отсутствует'
      }
    },
    hotjar: {
      configured: !!process.env.NEXT_PUBLIC_HOTJAR_ID,
      variables: {
        HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID ? '✅ Установлен' : '❌ Отсутствует',
        HOTJAR_VERSION: process.env.NEXT_PUBLIC_HOTJAR_VERSION ? '✅ Установлен' : '❌ Отсутствует'
      }
    },
    googleAds: {
      configured: !!(
        process.env.NEXT_PUBLIC_GOOGLE_ADS_ID &&
        process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID
      ),
      variables: {
        GOOGLE_ADS_ID: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? '✅ Установлен' : '❌ Отсутствует',
        GOOGLE_ADS_CONVERSION_ID: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ? '✅ Установлен' : '❌ Отсутствует'
      }
    }
  };

  // Проверяем, какие сервисы полностью настроены
  const summary = {
    totalServices: 5,
    configuredServices: Object.values(analyticsConfig).filter(service => service.configured).length,
    services: {
      'Google Analytics 4': analyticsConfig.googleAnalytics.configured ? '✅ Настроен' : '❌ Не настроен',
      'Яндекс.Метрика': analyticsConfig.yandexMetrika.configured ? '✅ Настроен' : '❌ Не настроен',
      'Facebook Pixel': analyticsConfig.facebookPixel.configured ? '✅ Настроен' : '❌ Не настроен',
      'Hotjar': analyticsConfig.hotjar.configured ? '✅ Настроен' : '❌ Не настроен',
      'Google Ads': analyticsConfig.googleAds.configured ? '✅ Настроен' : '❌ Не настроен'
    }
  };

  // Тестируем подключение к API (только если настроены)
  const apiTests = {};

  // Тест Google Analytics
  if (analyticsConfig.googleAnalytics.configured) {
    try {
      const gaResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/analytics/google?dateRange=today`);
      const gaData = await gaResponse.json();
      apiTests.googleAnalytics = {
        status: gaResponse.ok ? '✅ Работает' : '❌ Ошибка',
        isRealData: !gaData.demo,
        message: gaData.message || 'Подключение успешно'
      };
    } catch (error) {
      apiTests.googleAnalytics = {
        status: '❌ Ошибка',
        error: error.message
      };
    }
  }

  // Тест Яндекс.Метрики
  if (analyticsConfig.yandexMetrika.configured) {
    try {
      const ymResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/analytics/yandex?dateRange=today`);
      const ymData = await ymResponse.json();
      apiTests.yandexMetrika = {
        status: ymResponse.ok ? '✅ Работает' : '❌ Ошибка',
        isRealData: !ymData.demo,
        message: ymData.message || 'Подключение успешно'
      };
    } catch (error) {
      apiTests.yandexMetrika = {
        status: '❌ Ошибка',
        error: error.message
      };
    }
  }

  // Генерируем рекомендации
  const recommendations = [];
  
  if (!analyticsConfig.googleAnalytics.configured) {
    recommendations.push({
      service: 'Google Analytics 4',
      action: 'Настройте переменные окружения для GA4',
      priority: 'high',
      docs: 'См. файл .env.example.analytics для инструкций'
    });
  }
  
  if (!analyticsConfig.yandexMetrika.configured) {
    recommendations.push({
      service: 'Яндекс.Метрика',
      action: 'Получите OAuth токен и ID счетчика',
      priority: 'high',
      docs: 'https://yandex.ru/dev/metrika/doc/api2/intro.html'
    });
  }

  if (summary.configuredServices === 0) {
    recommendations.push({
      service: 'Общее',
      action: 'Начните с настройки хотя бы одного сервиса аналитики',
      priority: 'critical',
      docs: 'Рекомендуем начать с Google Analytics 4 или Яндекс.Метрики'
    });
  }

  return NextResponse.json({
    status: summary.configuredServices > 0 ? 'partial' : 'not_configured',
    summary,
    details: analyticsConfig,
    apiTests,
    recommendations,
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}