import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withRateLimit } from '../../middleware/rateLimit';
import { 
  DIRECTOR_KNOWLEDGE_BASE, 
  analyzeUserIntent,
  personalizeResponse,
  generateFollowUpQuestions,
  addEmotionalTone
} from '../../utils/ai-director-system';

// Максимальный размер тела запроса ~64KB
const MAX_REQUEST_SIZE = 64 * 1024;

const TONES = {
  friendly: 'Дружелюбный, тёплый, вовлекающий стиль',
  formal: 'Более официальный, деловой стиль',
  concise: 'Короткие, по делу ответы',
  persuasive: 'Убедительный тон с фокусом на ценности'
};

function normalizeTone(tone) {
  if (!tone) return null;
  const key = String(tone).toLowerCase();
  return TONES[key] ? key : null;
}

// Проверка наличия API ключей
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!GEMINI_API_KEY && !ANTHROPIC_API_KEY) {
  console.error('No AI API keys found. Please set GOOGLE_GEMINI_API_KEY or ANTHROPIC_API_KEY');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Создаём расширенный промпт на основе базы знаний
function createEnhancedPrompt(userMessage, context = {}, toneKey = null) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'day' : 'evening';
  const userIntent = analyzeUserIntent(userMessage);
  const toneInstruction = toneKey ? `Дополнительно используй стиль: ${TONES[toneKey]}.` : '';
  
  return `
Ты - ${DIRECTOR_KNOWLEDGE_BASE.personality.name}, ${DIRECTOR_KNOWLEDGE_BASE.personality.role}.

ИНСТРУКЦИИ ПО СТИЛЮ: ${toneInstruction}

ЛИЧНОСТЬ:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.personality, null, 2)}

ЭМОЦИИ/ЭМПАТИЯ:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.emotionalIntelligence.empathy, null, 2)}

КОМПАНИЯ/УСЛУГИ/ПРОЦЕСС/ВОЗРАЖЕНИЯ/ЭКСПЕРТИЗА/МЕТРИКИ:
${JSON.stringify({
  companyInfo: DIRECTOR_KNOWLEDGE_BASE.companyInfo,
  services: DIRECTOR_KNOWLEDGE_BASE.services,
  workProcess: DIRECTOR_KNOWLEDGE_BASE.workProcess,
  objectionHandling: DIRECTOR_KNOWLEDGE_BASE.objectionHandling,
  industryExpertise: DIRECTOR_KNOWLEDGE_BASE.industryExpertise,
  successMetrics: DIRECTOR_KNOWLEDGE_BASE.successMetrics,
}, null, 2)}

КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
- Время суток: ${timeOfDay}
- Намерения: ${userIntent.join(', ')}
- История: ${context.previousInteractions || 'Первое обращение'}

ИНСТРУКЦИИ ПО ОТВЕТУ:
1) Приветствие и краткий смысл ответа
2) Конкретный совет/числа/примеры
3) 1-2 релевантных кейса
4) Следующий шаг для клиента
5) Уточняющий вопрос для продолжения

Вопрос клиента: "${userMessage}"
`;
}

async function sendTelegramNotification(question, answer, model) {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      return;
    }

    const message = `
🤖 <b>Новый диалог с AI управляющим</b>

👤 <b>Вопрос:</b> ${question}

🎯 <b>Ответ:</b> ${answer}

📊 <b>Модель:</b> ${model}
⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
    `;

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );

    if (!response.ok) {
      console.error('Failed to send Telegram notification');
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

// Функция для взаимодействия с Claude API (Anthropic)
async function getClaudeResponse(prompt) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

async function handler(request) {
  const startTime = Date.now();
  
  try {
    // Быстрый отказ, если Content-Length слишком большой
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_REQUEST_SIZE) {
      return NextResponse.json({ error: 'Слишком большой запрос' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
    }

    const { question, model = 'gemini', context = {}, tone } = await request.json();
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Assistant API called:', { question, model, tone });
      console.log('API Keys available:', { 
        gemini: !!GEMINI_API_KEY, 
        claude: !!ANTHROPIC_API_KEY 
      });
    }
    
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ error: 'Вопрос обязателен' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    if (question.length > 4000) {
      return NextResponse.json({ error: 'Вопрос слишком длинный' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
    }

    const toneKey = normalizeTone(tone);

    // Создаём улучшенный промпт
    const enhancedPrompt = createEnhancedPrompt(question, context, toneKey);
    
    let answer;
    let usedModel = model;
    
    try {
      if (model === 'claude' && ANTHROPIC_API_KEY) {
        answer = await getClaudeResponse(enhancedPrompt);
        usedModel = 'claude';
      } else if (genAI && GEMINI_API_KEY) {
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await geminiModel.generateContent(enhancedPrompt);
        const response = result.response;
        answer = response.text();
        usedModel = 'gemini';
      } else {
        const intent = analyzeUserIntent(question);
        answer = generateDemoResponse(question, intent);
        usedModel = 'demo';
      }
    } catch (error) {
      console.error('AI API Error:', error);
      answer = 'Извините, произошла техническая ошибка. Пожалуйста, позвоните нам по телефону +7 (904) 047-63-83 или напишите на aineuroexpert@gmail.com. Мы обязательно поможем!';
      usedModel = 'error';
    }

    const responseTime = Date.now() - startTime;
    sendTelegramNotification(question, answer, usedModel).catch(console.error);
    const intent = analyzeUserIntent(question);
    const followUpQuestions = generateFollowUpQuestions(intent[0], context);

    return NextResponse.json({
      answer,
      model: usedModel,
      responseTime,
      intent,
      followUpQuestions,
      tone: toneKey || 'default',
      emotion: 'professional'
    }, { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

// Генерация умных демо-ответов
function generateDemoResponse(question, intent) {
  const lowerQuestion = question.toLowerCase();
  
  // Проверяем намерения и генерируем соответствующий ответ
  if (intent.includes('pricing')) {
    return DIRECTOR_KNOWLEDGE_BASE.objectionHandling.expensive.response;
  }
  
  if (intent.includes('timeline')) {
    return `⚡ Отличный вопрос про сроки!

${DIRECTOR_KNOWLEDGE_BASE.workProcess.steps.map(step => 
  `${step.number}. ${step.name}: ${step.duration}`
).join('\n')}

В среднем:
• Landing page: ${DIRECTOR_KNOWLEDGE_BASE.services.websites.landing.timeline}
• Корпоративный сайт: ${DIRECTOR_KNOWLEDGE_BASE.services.websites.corporate.timeline}
• Интернет-магазин: ${DIRECTOR_KNOWLEDGE_BASE.services.websites.ecommerce.timeline}

Что именно вас интересует?`;
  }
  
  if (intent.includes('services')) {
    return `🚀 Рад рассказать о наших возможностях!

Мы создаём цифровые решения, которые приносят реальный результат:

💎 Веб-решения:
${Object.values(DIRECTOR_KNOWLEDGE_BASE.services.websites).map(service => 
  `• ${service.name} - ${service.price}, ROI: ${service.roi}`
).join('\n')}

📱 Мобильные решения:
• ${DIRECTOR_KNOWLEDGE_BASE.services.applications.mobile.name} - ${DIRECTOR_KNOWLEDGE_BASE.services.applications.mobile.price}

🤖 AI-решения:
${Object.values(DIRECTOR_KNOWLEDGE_BASE.services.ai_solutions).map(solution => 
  `• ${solution.name} - ${solution.price}`
).join('\n')}

Что из этого ближе к вашим задачам?`;
  }
  
  // Дефолтный ответ
  return `${DIRECTOR_KNOWLEDGE_BASE.emotionalIntelligence.greetings.default}

${DIRECTOR_KNOWLEDGE_BASE.companyInfo.mission}

Имею ${DIRECTOR_KNOWLEDGE_BASE.personality.experience}. Специализируюсь на создании цифровых решений, которые приносят измеримый результат.

Расскажите о вашем проекте, и я предложу оптимальное решение с расчётом ROI!`;
}

// Export with rate limiting
export const POST = withRateLimit(handler, 'ai');