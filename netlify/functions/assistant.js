// Улучшенный AI ассистент с поддержкой Gemini и Claude + Telegram мониторинг
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

  const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
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
  const geminiResponse = await getGeminiResponse(question, process.env.GOOGLE_GEMINI_API_KEY);
  return `[Claude Opus 4 - Demo Mode]\n\n${geminiResponse}`;
}
