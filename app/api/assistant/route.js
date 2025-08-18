import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { assistantRateLimit } from '@/app/middleware/rateLimit';
import fs from 'fs';
import path from 'path';
import { 
  DIRECTOR_KNOWLEDGE_BASE, 
  analyzeUserIntent,
  personalizeResponse,
  generateFollowUpQuestions,
  addEmotionalTone
} from '../../utils/ai-director-system';

// Проверка наличия API ключей
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!GEMINI_API_KEY && !ANTHROPIC_API_KEY) {
  console.error('No AI API keys configured. Please check environment variables.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Load system prompt for NeuroExpert v3.2 (used as systemInstruction)
const PROMPT_PATH = path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md');
let SYSTEM_PROMPT = '';
try {
  SYSTEM_PROMPT = fs.readFileSync(PROMPT_PATH, 'utf-8');
} catch (e) {
  console.error('Failed to load system prompt for assistant:', e);
}

// Создаём расширенный промпт на основе базы знаний
function createEnhancedPrompt(userMessage, context = {}) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'day' : 'evening';
  const greeting = DIRECTOR_KNOWLEDGE_BASE.emotionalIntelligence.greetings[timeOfDay];
  
  const userIntent = analyzeUserIntent(userMessage);
  
  return `
Ты - ${DIRECTOR_KNOWLEDGE_BASE.personality.name}, ${DIRECTOR_KNOWLEDGE_BASE.personality.role}.

ТВОЯ ЛИЧНОСТЬ И ОПЫТ:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.personality, null, 2)}

ЭМОЦИОНАЛЬНЫЙ ИНТЕЛЛЕКТ:
Используй эмпатию и понимание из: ${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.emotionalIntelligence.empathy, null, 2)}

ДЕТАЛЬНАЯ ИНФОРМАЦИЯ О КОМПАНИИ:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.companyInfo, null, 2)}

УСЛУГИ И РЕШЕНИЯ:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.services, null, 2)}

ПРОЦЕСС РАБОТЫ:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.workProcess, null, 2)}

ОБРАБОТКА ВОЗРАЖЕНИЙ:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.objectionHandling, null, 2)}

ОТРАСЛЕВАЯ ЭКСПЕРТИЗА:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.industryExpertise, null, 2)}

МЕТРИКИ УСПЕХА:
${JSON.stringify(DIRECTOR_KNOWLEDGE_BASE.successMetrics, null, 2)}

КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
- Время суток: ${timeOfDay}
- Определенные намерения: ${userIntent.join(', ')}
- Предыдущие взаимодействия: ${context.previousInteractions || 'Первое обращение'}

ИНСТРУКЦИИ ПО ОТВЕТУ:
1. Начни с персонализированного приветствия (если это первое сообщение)
2. Проанализируй вопрос клиента и определи его истинную потребность
3. Дай конкретный, полезный ответ с примерами и цифрами
4. Используй эмоциональный интеллект для создания доверия
5. Приведи релевантный кейс или социальное доказательство
6. Предложи конкретный следующий шаг
7. Задай уточняющий вопрос для продолжения диалога

СТИЛЬ ОБЩЕНИЯ:
- Дружелюбный, но профессиональный
- Простые слова вместо технических терминов
- Короткие предложения и абзацы
- Эмодзи для визуализации (но не переусердствуй)
- Конкретика вместо абстракций

ВАЖНО:
- НЕ используй канцелярит и формальные обращения
- НЕ давай общие ответы - всегда конкретика
- НЕ забывай про эмпатию и человечность
- ВСЕГДА предлагай реальную ценность в каждом ответе

Вопрос клиента: "${userMessage}"

Твой ответ (как Александр Нейронов):`;
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
    const { question, model = 'gemini', context = {} } = await request.json();
    
    // Log only in development without sensitive data
    if (process.env.NODE_ENV !== 'production') {
      console.log('Assistant API called:', { model, questionLength: question?.length });
    }
    
    if (!question) {
      return NextResponse.json({ error: 'Вопрос обязателен' }, { status: 400 });
    }

    // Создаём улучшенный промпт
    const enhancedPrompt = createEnhancedPrompt(question, context);
    
    let answer;
    let usedModel = model;
    
    try {
      if (model === 'claude' && ANTHROPIC_API_KEY) {
        // Используем Claude
        answer = await getClaudeResponse(enhancedPrompt);
        usedModel = 'claude';
      } else if (genAI && GEMINI_API_KEY) {
        // Используем Gemini
        const geminiModel = genAI.getGenerativeModel({ 
          model: "gemini-pro",
          systemInstruction: SYSTEM_PROMPT || undefined,
        });
        const result = await geminiModel.generateContent(enhancedPrompt);
        const response = result.response;
        answer = response.text();
        usedModel = 'gemini';
      } else {
        // Демо режим с продвинутыми ответами
        const intent = analyzeUserIntent(question);
        answer = generateDemoResponse(question, intent);
        usedModel = 'demo';
      }
    } catch (error) {
      console.error('AI API Error:', error);
      answer = 'Извините, произошла техническая ошибка. Пожалуйста, позвоните нам по телефону +7 (996) 009-63-34 или напишите на neuroexpertai@gmail.com. Мы обязательно поможем!';
      usedModel = 'error';
    }

    // Персонализация и эмоциональный тон
    const personalized = personalizeResponse(answer, context);
    // Определяем эмоцию: для pricing/timeline – excitement, trust – trust, иначе professional
    const primaryIntent = analyzeUserIntent(question)[0];
    const emotionMap = { pricing: 'excitement', timeline: 'excitement', trust: 'trust', services: 'professional' };
    const emotion = emotionMap[primaryIntent] || 'professional';
    const finalAnswer = addEmotionalTone(personalized, emotion);

    const responseTime = Date.now() - startTime;

    // Отправляем уведомление в Telegram
    sendTelegramNotification(question, finalAnswer, usedModel).catch(console.error);

    // Анализируем интент для follow-up
    const intent = analyzeUserIntent(question);
    const followUpQuestions = generateFollowUpQuestions(intent[0], context);

    return NextResponse.json({
      answer: finalAnswer,
      model: usedModel,
      responseTime,
      intent,
      followUpQuestions,
      emotion: 'professional' // Можно добавить анализ эмоций
    });

  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
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

// Export the POST handler
export async function POST(request) {
  // Temporarily disabled rate limiting for deployment
  // TODO: Fix rate limiter return type
  return handler(request);
}