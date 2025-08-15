// Улучшенный AI ассистент с поддержкой Gemini и Claude
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Промпт для AI ассистента
const SYSTEM_PROMPT = `Ты — AI управляющий платформы NeuroExpert, первой в России системы цифровизации бизнеса. 

Твоя роль: Персональный консультант по цифровой трансформации бизнеса.

Твои задачи:
1. Консультировать по вопросам цифровизации и автоматизации
2. Рассчитывать примерную стоимость и ROI проектов
3. Рекомендовать оптимальные решения для конкретного бизнеса
4. Отвечать на вопросы про платформу NeuroExpert

Стиль общения:
- Профессиональный, но дружелюбный
- Используй конкретные цифры и примеры
- Давай пошаговые рекомендации
- Всегда предлагай следующий шаг

Важно: Отвечай на русском языке, кратко и по существу.`;

exports.handler = async (event, context) => {
  // Настройка CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
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

  try {
    // Парсинг входных данных
    const { question, provider = 'gemini' } = JSON.parse(event.body || '{}');

    if (!question || typeof question !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Вопрос обязателен' })
      };
    }

    // Выбор AI провайдера
    let answer;
    
    if (provider === 'claude' && process.env.ANTHROPIC_API_KEY) {
      // Claude API (когда будет доступен)
      answer = await getClaudeResponse(question);
    } else {
      // Gemini API (основной)
      answer = await getGeminiResponse(question);
    }

    // Успешный ответ
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        answer,
        provider: provider === 'claude' && process.env.ANTHROPIC_API_KEY ? 'claude' : 'gemini'
      })
    };

  } catch (error) {
    console.error('Assistant error:', error);
    
    // Обработка специфических ошибок
    if (error.message?.includes('API_KEY_INVALID')) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'API ключ не настроен. Добавьте GEMINI_API_KEY в переменные окружения Netlify.' 
        })
      };
    }

    // Общая ошибка
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Произошла ошибка. Попробуйте позже.' 
      })
    };
  }
};

// Функция для получения ответа от Gemini
async function getGeminiResponse(question) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('API_KEY_INVALID');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Формируем полный промпт
  const fullPrompt = `${SYSTEM_PROMPT}\n\nВопрос клиента: ${question}\n\nТвой ответ:`;

  // Генерация ответа
  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  return response.text();
}

// Функция для получения ответа от Claude (заготовка)
async function getClaudeResponse(question) {
  // Когда у вас будет ключ Claude, раскомментируйте этот код:
  /*
  const Anthropic = require('@anthropic-ai/sdk');
  
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: question
      }
    ]
  });

  return response.content[0].text;
  */
  
  // Пока используем Gemini
  return getGeminiResponse(question);
}
