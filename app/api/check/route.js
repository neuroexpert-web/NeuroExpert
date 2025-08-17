import { NextResponse } from 'next/server';

export async function GET() {
  // Простая проверка без внешних зависимостей
  const check = {
    status: 'API работает',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV || 'не установлено',
      vercel: process.env.VERCEL ? 'да' : 'нет',
      vercelEnv: process.env.VERCEL_ENV || 'не установлено'
    },
    apiKeys: {
      gemini: {
        установлен: !!process.env.GEMINI_API_KEY,
        длина: process.env.GEMINI_API_KEY?.length || 0,
        корректныйФормат: process.env.GEMINI_API_KEY?.startsWith('AIzaSy') || false
      },
      geminiAlternative: {
        установлен: !!process.env.GOOGLE_GEMINI_API_KEY,
        длина: process.env.GOOGLE_GEMINI_API_KEY?.length || 0
      },
      telegram: {
        токен: {
          установлен: !!process.env.TELEGRAM_BOT_TOKEN,
          длина: process.env.TELEGRAM_BOT_TOKEN?.length || 0
        },
        chatId: {
          установлен: !!process.env.TELEGRAM_CHAT_ID,
          длина: process.env.TELEGRAM_CHAT_ID?.length || 0
        }
      }
    },
    рекомендации: []
  };

  // Рекомендации
  if (!check.apiKeys.gemini.установлен && !check.apiKeys.geminiAlternative.установлен) {
    check.рекомендации.push('Добавьте GEMINI_API_KEY в переменные окружения Vercel');
  }
  
  if (!check.apiKeys.telegram.токен.установлен) {
    check.рекомендации.push('Добавьте TELEGRAM_BOT_TOKEN для уведомлений');
  }
  
  if (!check.apiKeys.telegram.chatId.установлен) {
    check.рекомендации.push('Добавьте TELEGRAM_CHAT_ID для уведомлений');
  }

  if (check.apiKeys.gemini.установлен && !check.apiKeys.gemini.корректныйФормат) {
    check.рекомендации.push('Проверьте формат GEMINI_API_KEY - должен начинаться с AIzaSy');
  }

  return NextResponse.json(check, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}