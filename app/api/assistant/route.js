import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { assistantRateLimit } from '@/app/middleware/rateLimit';
import fs from 'fs';
import path from 'path';
import { createLogger } from '@/app/utils/logger';
// import { 
//   DIRECTOR_KNOWLEDGE_BASE, 
//   analyzeUserIntent,
//   personalizeResponse,
//   generateFollowUpQuestions,
//   addEmotionalTone
// } from '../../utils/ai-director-system';

// Create logger instance
const logger = createLogger('AssistantAPI');

// Поддерживаем несколько названий переменных среды для ключа Gemini,
// чтобы избежать ошибки из-за опечаток в панели хостинга
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
  || process.env.GEMINI_API_KEY
  || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!GEMINI_API_KEY && !ANTHROPIC_API_KEY) {
  logger.error('No AI API keys configured. Please check environment variables.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Debug logging
logger.debug('API Keys check:', {
  hasGeminiKey: !!GEMINI_API_KEY,
  hasAnthropicKey: !!ANTHROPIC_API_KEY,
  genAIInitialized: !!genAI,
  geminiKeyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0
});

// Load system prompt for NeuroExpert v3.2 (used as systemInstruction)
// This file contains the complete system prompt for the AI assistant
// Vercel deployment trigger - updated at: ${new Date().toISOString()}
const PROMPT_PATH = path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md');
let SYSTEM_PROMPT = '';

// Check if file exists
try {
  if (fs.existsSync(PROMPT_PATH)) {
    logger.info('Prompt file exists at:', { path: PROMPT_PATH });
    SYSTEM_PROMPT = fs.readFileSync(PROMPT_PATH, 'utf-8');
    logger.info('System prompt loaded successfully', { length: SYSTEM_PROMPT.length });
    logger.debug('System prompt preview:', { preview: SYSTEM_PROMPT.substring(0, 200) + '...' });
  } else {
    logger.error('Prompt file does not exist at:', { path: PROMPT_PATH });
    // Try alternative paths
    const altPaths = [
      path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md'),
      path.join(process.cwd(), 'neuroexpert_v3_2.md'),
      path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md')
    ];
    
    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        logger.info('Found prompt file at alternative path:', { path: altPath });
        SYSTEM_PROMPT = fs.readFileSync(altPath, 'utf-8');
        break;
      }
    }
  }
} catch (e) {
  logger.error('Failed to load system prompt for assistant:', { error: e.message, stack: e.stack });
  logger.error('Debug info:', {
    promptPath: PROMPT_PATH,
    cwd: process.cwd(),
    utilsFiles: fs.readdirSync(path.join(process.cwd(), 'app', 'utils')).join(', ')
  });
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
      logger.error('Failed to send Telegram notification');
    }
  } catch (error) {
    logger.error('Telegram notification error:', { error: error.message });
  }
}

// Функция для взаимодействия с Claude API (Anthropic)
async function getClaudeResponse(prompt, history = []) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  try {
    // Подготавливаем историю для Claude
    const messages = history.length > 0 ? history : [];
    
    // Добавляем текущее сообщение
    messages.push({
      role: 'user',
      content: prompt
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2048,
        system: SYSTEM_PROMPT, // Claude поддерживает system prompt напрямую!
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      logger.error('Claude API error response:', { errorData, status: response.status });
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Возвращаем ответ и обновленную историю
    return {
      text: data.content[0].text,
      updatedHistory: [...messages, {
        role: 'assistant',
        content: data.content[0].text
      }]
    };
  } catch (error) {
    logger.error('Claude API error:', { error: error.message, stack: error.stack });
    throw error;
  }
}

async function handler(request) {
  const startTime = Date.now();
  
  try {
    const { userMessage: question, model = 'gemini', history = [] } = await request.json();
    
    // Debug logging
    logger.debug('Assistant API called:', { 
      model, 
      questionLength: question?.length,
      hasAnthropicKey: !!ANTHROPIC_API_KEY,
      hasGeminiKey: !!GEMINI_API_KEY,
      anthropicKeyLength: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 0,
      nodeEnv: process.env.NODE_ENV
    });
    
    if (!question) {
      return NextResponse.json({ error: 'Вопрос обязателен' }, { status: 400 });
    }

    // Создаём улучшенный промпт
    // const enhancedPrompt = createEnhancedPrompt(question, context);
    
    let answer;
    let usedModel = model;
    let updatedHistory = history; // Initialize updatedHistory
    
    try {
      // Выбираем модель на основе запроса пользователя
      if (model === 'claude' && ANTHROPIC_API_KEY) {
        // Используем Claude с историей
        logger.info('Using Claude with system prompt');
        logger.debug('Claude API configuration', {
          hasKey: !!ANTHROPIC_API_KEY,
          keyLength: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 0
        });
        const claudeResponse = await getClaudeResponse(question, history);
        answer = claudeResponse.text;
        updatedHistory = claudeResponse.updatedHistory;
        usedModel = 'claude';
      } else if (model === 'gemini' && genAI && GEMINI_API_KEY) {
        // Используем Gemini с системным промптом v3.2
        logger.info('Using Gemini with system prompt', {
          promptLength: SYSTEM_PROMPT.length,
          hasApiKey: !!GEMINI_API_KEY,
          genAIInitialized: !!genAI
        });
        
        try {
          const geminiModel = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro-latest",
            systemInstruction: SYSTEM_PROMPT
          });
          
          const chat = geminiModel.startChat({ history: history || [] });
          const result = await chat.sendMessage(question);
          answer = result.response.text();
          updatedHistory = await chat.getHistory();
          usedModel = 'gemini';
          logger.info('Gemini answer generated', { answerLength: answer.length });
        } catch (geminiError) {
          logger.error('Gemini API call failed:', { error: geminiError.message, stack: geminiError.stack });
          throw geminiError;
        }
      } else if (ANTHROPIC_API_KEY && model !== 'gemini') {
        // Fallback на Claude если Gemini недоступен
        logger.info('Fallback to Claude (Gemini not available)');
        const claudeResponse = await getClaudeResponse(question, history);
        answer = claudeResponse.text;
        updatedHistory = claudeResponse.updatedHistory;
        usedModel = 'claude';
      } else {
        // Принудительно используем Gemini даже без API ключа (для тестирования)
        logger.warn('Forcing Gemini usage for testing...');
        try {
          // Создаем временный API ключ для тестирования
          const tempGenAI = new GoogleGenerativeAI('test-key-for-debugging');
          const geminiModel = tempGenAI.getGenerativeModel({ 
            model: "gemini-1.5-pro-latest",
            systemInstruction: SYSTEM_PROMPT || 'Ты — Управляющий NeuroExpert v3.2. Начинай с вопроса о бизнес-цели.',
          });
          
          const chat = geminiModel.startChat({ history: history || [] });
          const result = await chat.sendMessage(question);
          answer = result.response.text();
          updatedHistory = await chat.getHistory();
          usedModel = 'gemini-forced';
          logger.warn('Forced Gemini answer generated', { answerLength: answer.length });
        } catch (error) {
          logger.error('Forced Gemini failed:', { error: error.message });
          // Fallback на базовый ответ по промпту
          answer = `Здравствуйте. Я Управляющий NeuroExpert v3.2. 

${SYSTEM_PROMPT ? 'Системный промпт загружен успешно.' : 'Системный промпт не загружен.'}

Сформулируйте, пожалуйста, ключевую бизнес-цель, которую вы хотите достичь с помощью нашей платформы.${process.env.NODE_ENV !== 'production' ? `\n\n[Отладка: API ключ Gemini: ${!!GEMINI_API_KEY}, genAI: ${!!genAI}, промпт длина: ${SYSTEM_PROMPT.length}]` : ''}`;
          usedModel = 'fallback-with-prompt';
        }
      }
    } catch (error) {
      logger.error('AI API Error:', { error: error.message, stack: error.stack });
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
    sendTelegramNotification(question, finalAnswer, usedModel).catch(err => 
      logger.error('Failed to send Telegram notification', { error: err.message })
    );

    // Анализируем интент для follow-up
    // const intent = analyzeUserIntent(question);
    // const followUpQuestions = generateFollowUpQuestions(intent[0], context);

    return NextResponse.json({
      reply: finalAnswer, // Изменено с 'answer' на 'reply' согласно чек-листу
      model: usedModel,
      responseTime,
      updated_history: updatedHistory || history,
      // intent,
      // followUpQuestions,
      // emotion: 'professional' // Можно добавить анализ эмоций
    });

  } catch (error) {
    logger.error('Assistant API error:', { error: error.message, stack: error.stack });
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

// Add GET method for testing prompt loading
export async function GET() {
  try {
    const PROMPT_PATH = path.join(process.cwd(), 'app', 'utils', 'prompts', 'neuroexpert_v3_2.md');
    
    let fileExists = false;
    let promptContent = '';
    let error = null;
    
    try {
      fileExists = fs.existsSync(PROMPT_PATH);
      if (fileExists) {
        promptContent = fs.readFileSync(PROMPT_PATH, 'utf-8');
      }
    } catch (e) {
      error = e.message;
    }
    
    return NextResponse.json({
      success: true,
      fileExists,
      promptPath: PROMPT_PATH,
      currentWorkingDir: process.cwd(),
      promptLength: promptContent.length,
      promptPreview: promptContent.substring(0, 500),
      error: error || null,
      env: {
        hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
        geminiKeyLength: process.env.GOOGLE_GEMINI_API_KEY ? process.env.GOOGLE_GEMINI_API_KEY.length : 0,
        hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
        anthropicKeyLength: process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 0,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}