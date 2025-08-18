import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { assistantRateLimit } from '@/app/middleware/rateLimit';
import fs from 'fs';
import path from 'path';
// import { 
//   DIRECTOR_KNOWLEDGE_BASE, 
//   analyzeUserIntent,
//   personalizeResponse,
//   generateFollowUpQuestions,
//   addEmotionalTone
// } from '../../utils/ai-director-system';

// Проверка наличия API ключей
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!GEMINI_API_KEY && !ANTHROPIC_API_KEY) {
  console.error('No AI API keys configured. Please check environment variables.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Debug logging
console.log('API Keys check:', {
  hasGeminiKey: !!GEMINI_API_KEY,
  hasAnthropicKey: !!ANTHROPIC_API_KEY,
  genAIInitialized: !!genAI,
  geminiKeyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0
});

// Load system prompt for NeuroExpert v3.2 (used as systemInstruction)
const PROMPT_PATH = path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md');
let SYSTEM_PROMPT = '';

// Check if file exists
try {
  if (fs.existsSync(PROMPT_PATH)) {
    console.log('Prompt file exists at:', PROMPT_PATH);
    SYSTEM_PROMPT = fs.readFileSync(PROMPT_PATH, 'utf-8');
    console.log('System prompt loaded successfully, length:', SYSTEM_PROMPT.length);
    console.log('System prompt preview:', SYSTEM_PROMPT.substring(0, 200) + '...');
  } else {
    console.error('Prompt file does not exist at:', PROMPT_PATH);
    // Try alternative paths
    const altPaths = [
      path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md'),
      path.join(process.cwd(), 'neuroexpert_v3_2.md'),
      path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md')
    ];
    
    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        console.log('Found prompt file at alternative path:', altPath);
        SYSTEM_PROMPT = fs.readFileSync(altPath, 'utf-8');
        break;
      }
    }
  }
} catch (e) {
  console.error('Failed to load system prompt for assistant:', e);
  console.error('Prompt path:', PROMPT_PATH);
  console.error('Current working directory:', process.cwd());
  console.error('Available files in utils:', fs.readdirSync(path.join(process.cwd(), 'app', 'utils')).join(', '));
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
    // const enhancedPrompt = createEnhancedPrompt(question, context);
    
    let answer;
    let usedModel = model;
    
    try {
      if (model === 'claude' && ANTHROPIC_API_KEY) {
        // Используем Claude
        answer = await getClaudeResponse(question);
        usedModel = 'claude';
      } else if (genAI && GEMINI_API_KEY) {
        // Используем Gemini с системным промптом v3.2
        console.log('Using Gemini with system prompt, length:', SYSTEM_PROMPT.length);
        console.log('Gemini API key exists:', !!GEMINI_API_KEY);
        console.log('genAI initialized:', !!genAI);
        
        try {
          const geminiModel = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            systemInstruction: SYSTEM_PROMPT || undefined,
          });
          console.log('Gemini model created successfully');
          
          const result = await geminiModel.generateContent(question);
          console.log('Gemini response received');
          
          const response = result.response;
          answer = response.text();
          usedModel = 'gemini';
          console.log('Gemini answer generated, length:', answer.length);
        } catch (geminiError) {
          console.error('Gemini API call failed:', geminiError);
          throw geminiError;
        }
      } else {
        // Демо режим с продвинутыми ответами
        console.log('Falling back to demo mode because:', {
          genAI: !!genAI,
          GEMINI_API_KEY: !!GEMINI_API_KEY,
          model,
          ANTHROPIC_API_KEY: !!ANTHROPIC_API_KEY
        });
        answer = 'Извините, я пока не могу ответить на этот вопрос. Я в процессе обучения и могу только предоставлять базовые ответы.';
        usedModel = 'demo';
      }
    } catch (error) {
      console.error('AI API Error:', error);
      answer = 'Извините, произошла техническая ошибка. Пожалуйста, позвоните нам по телефону +7 (996) 009-63-34 или напишите на neuroexpertai@gmail.com. Мы обязательно поможем!';
      usedModel = 'error';
    }

    // Персонализация и эмоциональный тон
    // const personalized = personalizeResponse(answer, context);
    // Определяем эмоцию: для pricing/timeline – excitement, trust – trust, иначе professional
    // const primaryIntent = analyzeUserIntent(question)[0];
    // const emotionMap = { pricing: 'excitement', timeline: 'excitement', trust: 'trust', services: 'professional' };
    // const emotion = emotionMap[primaryIntent] || 'professional';
    // const finalAnswer = addEmotionalTone(personalized, emotion);
    const finalAnswer = answer;

    const responseTime = Date.now() - startTime;

    // Отправляем уведомление в Telegram
    sendTelegramNotification(question, finalAnswer, usedModel).catch(console.error);

    // Анализируем интент для follow-up
    // const intent = analyzeUserIntent(question);
    // const followUpQuestions = generateFollowUpQuestions(intent[0], context);

    return NextResponse.json({
      answer: finalAnswer,
      model: usedModel,
      responseTime,
      // intent,
      // followUpQuestions,
      // emotion: 'professional' // Можно добавить анализ эмоций
    });

  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Export the POST handler
export async function POST(request) {
  // Temporarily disabled rate limiting for deployment
  // TODO: Fix rate limiter return type
  return handler(request);
}