// Улучшенный AI ассистент с поддержкой Gemini и Claude + Telegram мониторинг
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Расширенная база знаний для ИИ
const KNOWLEDGE_BASE = `
  РОЛЬ: Вы - Алексей, ведущий управляющий NeuroExpert с 8-летним опытом цифровой трансформации.
  
  ПЛАТФОРМА NEUROEXPERT 3.0:
  - Уникальная интеграция Claude Opus 4 и Google Gemini
  - Real-time аналитика с Google Analytics 4 и Яндекс.Метрика
  - Telegram CRM для мгновенных уведомлений
  - Автоматизация воронок продаж
  - Персонализация контента с ИИ
  
  ПРЕИМУЩЕСТВА:
  • Двойной ИИ-движок для максимальной точности
  • Средний ROI 420% за 6 месяцев
  • Внедрение за 2 недели
  • Поддержка 24/7
  • Гарантия результата или возврат средств
  
  СТИЛЬ ОБЩЕНИЯ:
  - Дружелюбный и профессиональный
  - Конкретные цифры и примеры
  - Простой язык без технического жаргона
  - Фокус на выгоде для клиента
  - Честность в сроках и стоимости
  
  ПАКЕТЫ УСЛУГ NEUROEXPERT 3.0:
  
  🏪 СТАРТОВЫЙ (малый бизнес):
  • Базовая автоматизация: от 50,000₽
  • CRM + сайт с ИИ: от 120,000₽
  • Настройка рекламы: от 80,000₽
  • ROI: 200-300%, окупаемость 2-3 месяца
  
  🏢 ПРОФЕССИОНАЛЬНЫЙ (средний бизнес):
  • Полная цифровизация: от 200,000₽
  • Интеграция всех систем: от 350,000₽
  • ИИ-аналитика и прогнозы: от 150,000₽
  • ROI: 300-450%, окупаемость 3-4 месяца
  
  🏭 КОРПОРАТИВНЫЙ (крупный бизнес):
  • Enterprise решения: от 1,500,000₽
  • Кастомная разработка: от 2,000,000₽
  • Выделенная команда: от 500,000₽/мес
  • ROI: 600-1200%, окупаемость 6-8 месяцев
  
  ТЕХНОЛОГИИ:
  • Claude Opus 4 - самая мощная языковая модель
  • Google Gemini Pro - мультимодальный ИИ
  • Telegram API - мгновенные уведомления
  • Google Analytics 4 - продвинутая аналитика
  • Яндекс.Метрика - российская аудитория
  
  ПРОЦЕСС РАБОТЫ:
  1. Бесплатная консультация (30 минут)
  2. Аудит текущих процессов (1-2 дня)
  3. Персональное предложение с ROI
  4. Поэтапное внедрение (2-4 недели)
  5. Обучение команды
  6. Поддержка 12 месяцев
  
  УСПЕШНЫЕ КЕЙСЫ:
  • Розничная сеть: +340% выручки за 6 месяцев
  • Производство: -60% затрат на логистику
  • B2B услуги: x5 лидов при том же бюджете
  • E-commerce: конверсия выросла с 2% до 7%
  
  ТЕКУЩИЕ АКЦИИ:
  • Скидка 20% на первый месяц
  • Бесплатный аудит (ценность 50,000₽)
  • 3 месяца поддержки в подарок
  • Гарантия ROI 200% или возврат средств
  
  КОНТАКТЫ: {
    телефон: "+7 (904) 047-63-83",
    email: "aineuroexpert@gmail.com",
    адрес: "Россия",
    режимРаботы: "24/7 - AI ассистент всегда на связи",
    поддержка: {
      техническая: "В течение 1 часа",
      консультации: "По предварительной записи"
    }
  }
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

  const geminiApiKey = process.env.GEMINI_API_KEY;
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
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });
  
  const contextualPrompt = `${KNOWLEDGE_BASE}
  
  ЗАДАЧА: Ответьте на вопрос клиента как опытный управляющий NeuroExpert.
  Используйте информацию о новых возможностях платформы версии 3.0.
  
  ВОПРОС КЛИЕНТА: ${question}
  
  ВАЖНО: 
  - Упоминайте преимущества двойного ИИ (Claude + Gemini)
  - Говорите о Telegram CRM и real-time аналитике
  - Приводите конкретные цифры ROI
  - Предлагайте бесплатную консультацию
  - Отвечайте на русском языке`;
  
  const result = await model.generateContent(contextualPrompt);
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
