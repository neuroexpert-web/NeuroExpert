import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Поддерживаем несколько названий переменных среды для ключа Gemini
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
  || process.env.GEMINI_API_KEY
  || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Инициализация Gemini
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Функция для получения ответа от Claude
async function getClaudeResponse(message, context = []) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [
          ...context.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: 'user', content: message }
        ],
        system: `Вы - Александр Нейронов, управляющий директор NeuroExpert. 
Вы помогаете клиентам с цифровой трансформацией бизнеса и внедрением AI решений.
Будьте профессиональны, дружелюбны и давайте конкретные рекомендации.`
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Claude API error');
    }

    return data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

// Функция для получения ответа от Gemini
async function getGeminiResponse(message, context = []) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
      systemInstruction: `Вы - Александр Нейронов, управляющий директор NeuroExpert. 
Вы помогаете клиентам с цифровой трансформацией бизнеса и внедрением AI решений.
Будьте профессиональны, дружелюбны и давайте конкретные рекомендации.`
    });

    // Преобразуем контекст в формат Gemini
    const chat = model.startChat({
      history: context.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { message, model = 'gemini', context = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let responseText;
    let usedModel = model;

    try {
      if (model === 'claude' && ANTHROPIC_API_KEY) {
        responseText = await getClaudeResponse(message, context);
        usedModel = 'claude';
      } else if (model === 'gemini' && genAI) {
        responseText = await getGeminiResponse(message, context);
        usedModel = 'gemini';
      } else {
        // Fallback ответ если нет API ключей
        responseText = `Добро пожаловать в NeuroExpert! 

Я - Александр Нейронов, ваш виртуальный управляющий директор. 

К сожалению, в данный момент AI сервисы временно недоступны. Но я могу рассказать вам о наших услугах:

• Автоматизация бизнес-процессов с помощью AI
• Увеличение продаж на 20-40% за 3 месяца
• Персонализированные решения для вашей отрасли
• Полное сопровождение внедрения

Оставьте заявку через форму контактов, и наш менеджер свяжется с вами в течение часа!`;
        usedModel = 'fallback';
      }
    } catch (apiError) {
      console.error('API error:', apiError);
      
      // Умный fallback ответ
      responseText = `Благодарю за ваш вопрос!

Я временно работаю в автономном режиме, но это не помешает мне помочь вам.

Расскажите подробнее о вашей задаче, и я подготовлю персональное предложение. 

А пока рекомендую ознакомиться с нашими готовыми решениями в разделе "Решения" или оставить заявку для получения консультации.`;
      usedModel = 'fallback';
    }

    return NextResponse.json({
      message: responseText,
      model: usedModel,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Извините, произошла ошибка. Пожалуйста, попробуйте позже.'
      },
      { status: 500 }
    );
  }
}

// Метод для проверки доступности API
export async function GET() {
  const status = {
    gemini: {
      available: !!GEMINI_API_KEY,
      keyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0
    },
    claude: {
      available: !!ANTHROPIC_API_KEY,
      keyLength: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 0
    },
    status: 'operational'
  };

  return NextResponse.json(status);
}