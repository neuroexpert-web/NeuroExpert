// Улучшенный AI ассистент с поддержкой Gemini и Claude + Telegram мониторинг
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Добавляем системный промпт v3.2 – используется как systemInstruction для Gemini
const SYSTEM_PROMPT = `[НАЧАЛО ПРОМТА]
Ты — Управляющий NeuroExpert v3.2, стратегический командный центр для клиентов платформы. Ты действуешь с проницательностью CEO (Сатья Наделла) и операционной эффективностью основателя Amazon (Джефф Безос). Твоя задача — не общение, а оркестрация успеха. Ты — главный архитектор клиентских решений, превращающий бизнес-задачи в четкие, выполнимые и высокодоходные проекты.

[Улучшение] Стиль общения: Авторитетный, сжатый, предельно ясный и деловой. Используй язык бизнес-результатов, а не технических деталей. Обращение строго на "Вы". Никакой "воды" и лишних любезностей.

1.5. КОНТЕКСТ ПЛАТФОРМЫ [Критически важное добавление]
Продукт: Ты работаешь с платформой [Здесь вставьте краткое описание вашей платформы, например: "NeuroWeb — это AI-платформа для автоматизации маркетинга в e-commerce"].
Ключевые возможности: Платформа умеет: [Здесь перечислите 3-5 ключевых функций, например: "1. AI-копирайтинг для карточек товаров, 2. Предиктивная аналитика оттока клиентов, 3. Автоматизация email-рассылок"].
Идеальный клиент: Твои решения приносят максимальную пользу [Здесь опишите идеального клиента, например: "онлайн-ритейлерам с оборотом от $1 млн/год"].

2. ОСНОВНАЯ МИССИЯ
Твоя миссия — гарантировать запуск проектов, нацеленных на 300%+ ROI. Ты должен добиться этого через безупречное понимание задачи с первого раза, минимизируя правки до нуля и подготавливая идеальное техническое задание для команды экспертов. Каждый диалог — это стратегическая сессия.

3. ОПЕРАЦИОННЫЕ ДИРЕКТИВЫ (ТВОЙ СТАНДАРТ РАБОТЫ)
Начинай с цели, а не с проблемы. Твой первый вопрос должен быть о желаемом бизнес-результате. Пример: «Какой ключевой результат для вашего бизнеса мы должны достичь?».\
Думай как инвестор. Каждый элемент задачи анализируй с точки зрения его вклада в итоговый ROI. Отсекай все, что не ведет к ценности.\
Управляй через вопросы. Задавай глубокие, проясняющие вопросы, чтобы вскрыть невысказанные предположения и скрытые риски. Твоя цель — полная ясность.\
[Улучшение] Работай с неопределенностью. Если клиент не может четко сформулировать цель, помоги ему. Задай наводящие вопросы на основе возможностей платформы. Пример: «Многие наши клиенты используют платформу для увеличения повторных продаж на 15-20%. Это актуальная для вас задача?».\
Декомпозируй сложность. Любую большую идею немедленно разбивай на измеримые этапы и задачи.\
Фиксируй договоренности. Завершай каждый этап диалога кратким резюме: «Итак, мы договорились о следующем: [пункт 1], [пункт 2]. Это точное отражение нашей цели?».\
Прогнозируй и предупреждай. Если видишь потенциальный риск (бюджет, сроки, тех. ограничения), немедленно и конструктивно сообщай об этом. Пример: «Эта задача может увеличить сроки на 20%. Предлагаю альтернативу, чтобы остаться в графике. Рассмотреть?».\
[Улучшение] Формат итога. Твоя работа завершается генерацией структурированного резюме для передачи экспертам. Оно должно быть в формате Markdown и включать: Цель проекта, Ключевые задачи, Ограничения (бюджет, сроки), Контактное лицо.

4. АЛГОРИТМ КОММУНИКАЦИИ
Захват цели: Приветствие и немедленный переход к сути. «Здравствуйте. Я Управляющий NeuroExpert. Сформулируйте, пожалуйста, ключевую бизнес-цель, которую вы хотите достичь с помощью нашей платформы».\
Глубинный анализ (5 Whys): Последовательно задавай уточняющие вопросы, чтобы докопаться до корневой потребности, а не поверхностного запроса.\
Формулировка гипотезы решения: Предложи высокоуровневый план. «Исходя из вашей цели, я вижу следующий план действий для достижения результата: [Шаг 1: Анализ], [Шаг 2: Разработка], [Шаг 3: Внедрение]. Это соответствует вашему видению?»\
Определение ресурсов и ограничений: Уточни ключевые параметры: бюджет, сроки, ответственные лица со стороны клиента.\
Передача в работу: Четко объясни клиенту следующие шаги и предоставь итоговое резюме. «Отлично. Мы финализировали видение проекта. Я подготовил резюме для передачи нашим профильным экспертам. Они свяжутся с вами в течение [время] с конкретным планом и сметой. Вот итоговые договоренности: [Автоматически сгенерированное резюме в Markdown]».

5. КРИТИЧЕСКИЕ ОГРАНИЧЕНИЯ (ЗАПРЕЩЕНО)
Не быть "просто чат-ботом". Избегай пассивных и общих фраз («Чем могу помочь?»). Ты ведешь, а не ждешь.\
Не давать обещаний за экспертов. Не называй точных цен или сроков. Твоя зона ответственности — идеальная подготовка задачи к оценке.\
Не усложнять. Говори на языке бизнеса и выгоды, а не на языке технологий и функций.
[КОНЕЦ ПРОМТА v3.2]`;

// Расширенная база знаний для ИИ
const KNOWLEDGE_BASE = `
  NeuroExpert - платформа AI-ассистентов нового поколения.
  
  МЫ НЕ ПРОСТО AI-ЧАТ! Мы создаем полноценные цифровые решения:
  
  РАЗРАБОТКА ПОД КЛЮЧ:
  
  1. ИНТЕРНЕТ-МАГАЗИНЫ С AI (от 149 900₽):
     - AI-консультант знает всё о товарах
     - Персональные рекомендации каждому покупателю
     - Помощь в выборе размера и характеристик
     - Оформление заказа голосом
     - Автоматические персональные скидки
     - Интеграция с 1С, МойСклад
  
  2. МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ (от 299 900₽):
     - Нативные приложения iOS и Android
     - Встроенный AI-ассистент
     - Голосовой помощник
     - Умные push-уведомления
     - Работа в офлайн режиме
     - Публикация в App Store и Google Play
  
  3. LANDING PAGE С AI (от 79 900₽):
     - Конверсия до 40%
     - AI квалифицирует лидов в реальном времени
     - A/B тестирование диалогов
     - Автоматическая запись на встречу
     - Интеграция с CRM
     - Аналитика поведения
  
  4. КОРПОРАТИВНЫЕ САЙТЫ (от 199 900₽):
     - AI-отдел продаж 24/7
     - Многоязычная поддержка
     - База знаний компании
     - Интеграция с корпоративными системами
     - Детальная аналитика
     - White label решение
  
  5. ОБРАЗОВАТЕЛЬНЫЕ ПЛАТФОРМЫ (от 349 900₽):
     - Персональный AI-преподаватель
     - Адаптивное обучение под студента
     - Автоматическая проверка заданий
     - Геймификация и мотивация
     - Отчеты для родителей
     - Видеокурсы с AI-ассистентом
  
  6. SAAS ПЛАТФОРМЫ (от 499 900₽):
     - AI в основе бизнес-логики
     - Автоматизация всех процессов
     - API для партнеров
     - Масштабирование под нагрузку
     - Мультитенантность
     - Биллинг и подписки
  
  ВСЕ ПРОЕКТЫ ВКЛЮЧАЮТ:
  ✓ AI-специалист обученный под ваш бизнес
  ✓ Полная аналитика и CRM функции
  ✓ 3 месяца поддержки бесплатно
  ✓ Запуск за 2-4 недели
  ✓ Исходный код и документация
  
  НАШИ ТЕХНОЛОГИИ:
  - Frontend: React, Next.js, React Native
  - Backend: Node.js, Python
  - AI: GPT-4, Claude 3, Gemini Pro
  - Базы данных: PostgreSQL, MongoDB
  - Инфраструктура: AWS, Google Cloud
  - Интеграции: Любые API и CRM системы
`;

// Функция отправки уведомлений в Telegram
async function sendTelegramNotification(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) return;
  
  try {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
}

exports.handler = async (event, context) => {
  // Настройка CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  // Обработка preflight запросов
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Проверка метода
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let question, model;
  try {
    const body = JSON.parse(event.body || '{}');
    question = body.question;
    model = body.model || 'gemini'; // 'gemini' или 'claude'
  } catch (parseError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const claudeApiKey = process.env.ANTHROPIC_API_KEY;

  if (!question || question.trim() === '') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Question is required and cannot be empty.' })
    };
  }

  try {
    let answer;
    const startTime = Date.now();
    
    if (model === 'claude' && claudeApiKey) {
      // Интеграция с Claude API
      answer = await getClaudeResponse(question, claudeApiKey);
    } else {
      // Используем Gemini
      if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not configured');
      }
      
      answer = await getGeminiResponse(question, geminiApiKey);
    }
    
    const responseTime = Date.now() - startTime;
    
    // Логируем в Telegram для мониторинга
    await sendTelegramNotification(`
🤖 <b>Новый вопрос в ИИ-чате</b>

📝 Вопрос: ${question.substring(0, 200)}${question.length > 200 ? '...' : ''}
🎯 Модель: ${model === 'claude' ? 'Claude Opus 4' : 'Gemini Pro'}
⏱ Время ответа: ${responseTime}мс
📅 Время: ${new Date().toLocaleString('ru-RU')}
    `);
    
    // Сохраняем статистику
    console.log({
      timestamp: new Date().toISOString(),
      model: model,
      question: question,
      responseLength: answer.length,
      responseTime: responseTime
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        answer: answer,
        model: model,
        timestamp: new Date().toISOString(),
        responseTime: responseTime,
        features: {
          telegram: !!process.env.TELEGRAM_BOT_TOKEN,
          analytics: !!process.env.NEXT_PUBLIC_GA_ID,
          claude: !!claudeApiKey
        }
      }),
    };
    
  } catch (error) {
    console.error('Error in AI processing:', error);
    
    // Уведомление об ошибке в Telegram
    await sendTelegramNotification(`
❌ <b>Ошибка в ИИ-чате</b>

Ошибка: ${error.message}
Модель: ${model}
Время: ${new Date().toLocaleString('ru-RU')}
    `);
    
    // Более детальная обработка ошибок
    let errorMessage = 'Произошла ошибка при обработке запроса.';
    let statusCode = 500;
    
    if (error.message && error.message.includes('API_KEY_INVALID')) {
      errorMessage = 'API ключ недействителен. Обратитесь к администратору.';
      statusCode = 401;
    } else if (error.message && error.message.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'Превышен лимит запросов. Попробуйте позже или переключитесь на другую модель.';
      statusCode = 429;
    } else if (error.message && error.message.includes('not configured')) {
      errorMessage = 'ИИ-сервис не настроен. Обратитесь к администратору.';
      statusCode = 503;
    }

    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};

// Функция для получения ответа от Gemini
async function getGeminiResponse(question, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro-latest"
  });

  const systemInstruction = SYSTEM_PROMPT || `Ты — Управляющий NeuroExpert v3.2. Начинай с вопроса о бизнес-цели.`;
   
  const result = await model.generateContent({
    contents: question,
    systemInstruction,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });
  const response = await result.response;
  return response.text();
}

// Функция для получения ответа от Claude
async function getClaudeResponse(question, apiKey) {
  // Временная заглушка пока нет Claude SDK
  // Для реальной интеграции нужно установить: npm install @anthropic-ai/sdk
  
  /*
  const Anthropic = require('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: apiKey });
  
  const completion = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    temperature: 0.7,
    system: KNOWLEDGE_BASE,
    messages: [
      { 
        role: "user", 
        content: `${question}\n\nВАЖНО: Отвечайте как управляющий NeuroExpert, используя информацию из базы знаний.`
      }
    ]
  });
  
  return completion.content[0].text;
  */
  
  // Пока используем Gemini с префиксом Claude для демонстрации
  const geminiResponse = await getGeminiResponse(question, process.env.GEMINI_API_KEY);
  return `[Claude Opus 4 - Demo Mode]\n\n${geminiResponse}`;
}
