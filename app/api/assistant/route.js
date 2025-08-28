import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { assistantRateLimit } from '@/app/middleware/rateLimit';
import { validate, schemas } from '@/app/utils/validation';
import fs from 'fs';
import path from 'path';
// import { 
//   DIRECTOR_KNOWLEDGE_BASE, 
//   analyzeUserIntent,
//   personalizeResponse,
//   generateFollowUpQuestions,
//   addEmotionalTone
// } from '../../utils/ai-director-system';

// Поддерживаем несколько названий переменных среды для ключа Gemini,
// чтобы избежать ошибки из-за опечаток в панели хостинга
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
  || process.env.GEMINI_API_KEY
  || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
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
// This file contains the complete system prompt for the AI assistant
// Vercel deployment trigger - updated at: ${new Date().toISOString()}
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
      console.error('Claude API error response:', errorData);
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
    console.error('Claude API error:', error);
    throw error;
  }
}

async function handler(request) {
  const startTime = Date.now();
  
  try {
    const requestData = await request.json();
    
    // Поддерживаем два формата: старый (userMessage) и новый (message)
    const message = requestData.message || requestData.userMessage;
    const context = requestData.context || 'general';
    const systemPrompt = requestData.systemPrompt;
    
    // Валидация входных данных
    const validationResult = validate({ question: message }, schemas.apiRequest);
    
    if (!validationResult.isValid) {
      const firstError = Object.values(validationResult.errors)[0];
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    
    const { question } = validationResult.sanitizedData;
    const { model = 'gemini', history = [] } = requestData;
    
    // Debug logging
    console.log('Assistant API called:', { 
      model, 
      questionLength: question?.length,
      hasAnthropicKey: !!ANTHROPIC_API_KEY,
      hasGeminiKey: !!GEMINI_API_KEY,
      anthropicKeyLength: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 0,
      nodeEnv: process.env.NODE_ENV
    });

    // Создаём улучшенный промпт
    // const enhancedPrompt = createEnhancedPrompt(question, context);
    
    let answer;
    let usedModel = model;
    let updatedHistory = history; // Initialize updatedHistory
    
    try {
      // Выбираем модель на основе запроса пользователя
      if (model === 'claude' && ANTHROPIC_API_KEY) {
        // Используем Claude с историей
        console.log('Using Claude with system prompt');
        console.log('ANTHROPIC_API_KEY exists:', !!ANTHROPIC_API_KEY);
        console.log('ANTHROPIC_API_KEY length:', ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 0);
        const claudeResponse = await getClaudeResponse(question, history);
        answer = claudeResponse.text;
        updatedHistory = claudeResponse.updatedHistory;
        usedModel = 'claude';
      } else if (model === 'gemini' && genAI && GEMINI_API_KEY) {
        // Выбираем системный промпт в зависимости от контекста
        let finalSystemPrompt = SYSTEM_PROMPT;
        
        if (context === 'support' && systemPrompt) {
          finalSystemPrompt = systemPrompt;
          console.log('Using custom support system prompt');
        } else {
          console.log('Using default Gemini system prompt, length:', SYSTEM_PROMPT.length);
        }
        
        console.log('Gemini API key exists:', !!GEMINI_API_KEY);
        console.log('genAI initialized:', !!genAI);
        console.log('Context:', context);
        
        try {
          const geminiModel = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro-latest",
            systemInstruction: finalSystemPrompt
          });
          
          const chat = geminiModel.startChat({ history: history || [] });
          const result = await chat.sendMessage(question);
          answer = result.response.text();
          updatedHistory = await chat.getHistory();
          usedModel = 'gemini';
          console.log('Gemini answer generated, length:', answer.length);
        } catch (geminiError) {
          console.error('Gemini API call failed:', geminiError);
          throw geminiError;
        }
      } else if (ANTHROPIC_API_KEY && model !== 'gemini') {
        // Fallback на Claude если Gemini недоступен
        console.log('Fallback to Claude (Gemini not available)');
        const claudeResponse = await getClaudeResponse(question, history);
        answer = claudeResponse.text;
        updatedHistory = claudeResponse.updatedHistory;
        usedModel = 'claude';
      } else {
        // Принудительно используем Gemini даже без API ключа (для тестирования)
        console.log('Forcing Gemini usage for testing...');
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
          console.log('Forced Gemini answer generated, length:', answer.length);
        } catch (error) {
          console.error('Forced Gemini failed:', error);
          // Fallback на базовый ответ по промпту
          answer = `Здравствуйте. Я Управляющий NeuroExpert v3.2. 

${SYSTEM_PROMPT ? 'Системный промпт загружен успешно.' : 'Системный промпт не загружен.'}

Сформулируйте, пожалуйста, ключевую бизнес-цель, которую вы хотите достичь с помощью нашей платформы.${process.env.NODE_ENV !== 'production' ? `\n\n[Отладка: API ключ Gemini: ${!!GEMINI_API_KEY}, genAI: ${!!genAI}, промпт длина: ${SYSTEM_PROMPT.length}]` : ''}`;
          usedModel = 'fallback-with-prompt';
        }
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
      success: true,
      response: finalAnswer, // Для совместимости с UI поддержки
      reply: finalAnswer, // Изменено с 'answer' на 'reply' согласно чек-листу
      model: usedModel,
      context: context,
      responseTime,
      updated_history: updatedHistory || history,
      timestamp: new Date().toISOString(),
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