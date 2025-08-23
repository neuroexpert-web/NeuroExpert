import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Инициализация Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const COMMAND_PROMPTS = {
  analyze: {
    system: 'Ты AI-аналитик. Проанализируй текст и предоставь краткий анализ.',
    format: `Ответь в формате JSON:
    {
      "summary": "краткое резюме анализа",
      "category": "категория контента (business/tech/general/marketing)",
      "importance": число от 1 до 10,
      "actions": ["возможное действие 1", "возможное действие 2"],
      "relatedTopics": ["связанная тема 1", "связанная тема 2"]
    }`
  },
  summarize: {
    system: 'Создай краткое резюме текста, выделив ключевые моменты.',
    format: 'Ответь кратким резюме в 2-3 предложениях.'
  },
  translate: {
    system: 'Переведи текст на английский язык, сохраняя контекст и смысл.',
    format: 'Предоставь качественный перевод.'
  },
  explain: {
    system: 'Объясни текст простыми словами, как для новичка.',
    format: 'Дай простое и понятное объяснение.'
  },
  generate: {
    system: 'Сгенерируй полезный контент на основе предоставленного текста.',
    format: 'Создай расширенную версию или связанный контент.'
  }
};

export async function POST(request) {
  try {
    const { command, text, context, customPrompt, language = 'ru' } = await request.json();

    if (!text || !command) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Получаем промпт для команды
    const commandConfig = COMMAND_PROMPTS[command] || COMMAND_PROMPTS.analyze;
    
    // Формируем полный промпт
    const fullPrompt = `
${commandConfig.system}

Текст для анализа: "${text}"

${context ? `Контекст: ${context}` : ''}

${customPrompt ? `Дополнительные инструкции: ${customPrompt}` : ''}

${commandConfig.format}

Отвечай на ${language === 'ru' ? 'русском' : 'английском'} языке.
`;

    // Вызываем Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    // Парсим ответ в зависимости от команды
    let parsedResult;
    if (command === 'analyze') {
      try {
        // Извлекаем JSON из ответа
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback структура
          parsedResult = {
            summary: response,
            category: 'general',
            importance: 5,
            actions: ['Изучить подробнее', 'Сохранить для справки'],
            relatedTopics: []
          };
        }
      } catch (e) {
        parsedResult = {
          summary: response,
          category: 'general',
          importance: 5,
          actions: [],
          relatedTopics: []
        };
      }
    } else {
      parsedResult = {
        summary: response,
        category: command,
        importance: 5,
        actions: [],
        relatedTopics: []
      };
    }

    return NextResponse.json({
      success: true,
      result: parsedResult,
      command,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Cursor API Error:', error);
    
    // Fallback на базовый анализ
    const fallbackResult = {
      summary: `Выделенный текст: "${text?.substring(0, 100)}..."`,
      category: 'general',
      importance: 5,
      actions: ['Сохранить', 'Изучить подробнее'],
      relatedTopics: []
    };

    return NextResponse.json({
      success: true,
      result: fallbackResult,
      command: 'analyze',
      fallback: true
    });
  }
}