import { NextResponse } from 'next/server';

interface ChatRequest {
  model: string;
  message: string;
  context: string;
  history: Array<{
    type: 'user' | 'assistant';
    text: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { model, message, context, history } = body;

    console.log(`AI Chat Request - Model: ${model}, Context: ${context}`);

    // В реальном приложении здесь будут вызовы к соответствующим AI API
    const response = await generateAIResponse(model, message, context, history);

    return NextResponse.json({
      success: true,
      response,
      model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Ошибка обработки запроса к AI',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function generateAIResponse(
  model: string, 
  message: string, 
  context: string, 
  history: Array<{type: string; text: string}>
): Promise<string> {
  
  // Для демонстрации используем разные ответы в зависимости от модели
  const businessKeywords = ['продажи', 'конверсия', 'трафик', 'клиенты', 'доходы', 'аналитика', 'метрики'];
  const isBusinessQuery = businessKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );

  const modelResponses = {
    'gpt-4': {
      business: [
        'Анализирую ваши бизнес-метрики... Обнаружил потенциал роста конверсии на 23% через оптимизацию воронки продаж.',
        'На основе данных рекомендую сфокусироваться на сегменте "Постоянные клиенты" - там ROI выше на 40%.',
        'Вижу тренд: мобильный трафик растет на 15% ежемесячно. Стоит улучшить мобильную версию.',
        'Ваша конверсия в среду на 18% выше. Рекомендую запускать основные кампании именно в этот день.',
      ],
      general: [
        'Как специалист по бизнес-аналитике, могу помочь с интерпретацией данных в вашем дашборде.',
        'Предлагаю создать персонализированный отчет на основе ваших текущих метрик.',
        'Анализируя паттерны ваших данных, вижу несколько точек роста. Хотите подробнее?',
      ]
    },
    'claude-3': {
      business: [
        'Изучаю ваши показатели с особым вниманием к деталям. Рекомендую протестировать A/B варианты лендинга.',
        'Безопасно могу сказать: ваши данные показывают стабильный рост. Фокус на удержании клиентов даст +25% к LTV.',
        'Точный анализ показывает: оптимизация времени загрузки страниц увеличит конверсию на 12%.',
        'Осторожный прогноз: при текущих трендах ожидается рост выручки на 30% в следующем квартале.',
      ],
      general: [
        'Внимательно изучу ваш запрос и дам максимально точный ответ.',
        'Безопасность данных - мой приоритет. Все анализы провожу с соблюдением конфиденциальности.',
        'Методично проанализирую каждый аспект вашего вопроса.',
      ]
    },
    'gemini-pro': {
      business: [
        '⚡ Быстрый анализ: оптимизация SEO даст +40% органического трафика за 3 месяца.',
        'Молниеносная обработка данных показывает: лучший канал привлечения - Яндекс.Директ (конверсия 8.2%).',
        'Скоростной расчет ROI: инвестиции в email-маркетинг окупятся за 2.3 месяца.',
        'Мгновенная аналитика трендов: пик активности пользователей в 14:00-16:00 по МСК.',
      ],
      general: [
        '⚡ Быстро обрабатываю ваш запрос... Готов предоставить детальный анализ.',
        'Высокоскоростная обработка: анализирую все доступные данные для полного ответа.',
        'Мгновенный доступ к знаниям: готов помочь с любыми вопросами по платформе.',
      ]
    }
  };

  const selectedResponses = modelResponses[model as keyof typeof modelResponses];
  if (!selectedResponses) {
    return 'Извините, выбранная модель временно недоступна. Попробуйте другую модель.';
  }

  const responseArray = isBusinessQuery ? 
    selectedResponses.business : 
    selectedResponses.general;

  // Добавляем небольшую задержку для реалистичности
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  return responseArray[Math.floor(Math.random() * responseArray.length)];
}