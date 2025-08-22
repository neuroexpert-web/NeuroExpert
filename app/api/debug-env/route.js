import { NextResponse } from 'next/server';

export async function GET() {
  // Проверяем все возможные проблемы с переменными окружения
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,

    // Проверяем наличие переменных
    telegramConfigured: {
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      tokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0,
      tokenStarts: process.env.TELEGRAM_BOT_TOKEN?.substring(0, 5) || 'NONE',
      hasChatId: !!process.env.TELEGRAM_CHAT_ID,
      chatIdValue: process.env.TELEGRAM_CHAT_ID || 'NONE',
    },

    // Проверяем другие важные переменные
    otherVars: {
      hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY || !!process.env.GEMINI_API_KEY,
      geminiKeyVariants: {
        GOOGLE_GEMINI_API_KEY: !!process.env.GOOGLE_GEMINI_API_KEY,
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        NEXT_PUBLIC_GEMINI_API_KEY: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      },
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },

    // Проверяем все переменные, начинающиеся с TELEGRAM
    allTelegramVars: Object.keys(process.env)
      .filter((key) => key.includes('TELEGRAM'))
      .map((key) => ({
        name: key,
        exists: !!process.env[key],
        length: process.env[key]?.length || 0,
      })),

    // Информация о деплойменте
    deployment: {
      region: process.env.VERCEL_REGION || 'unknown',
      url: process.env.VERCEL_URL || 'unknown',
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    },
  };

  // Если переменные есть, пробуем их использовать
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const testUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`;
      const response = await fetch(testUrl);
      const result = await response.json();

      diagnostics.telegramTest = {
        tested: true,
        success: result.ok,
        botUsername: result.result?.username || 'unknown',
        error: result.description || null,
      };
    } catch (error) {
      diagnostics.telegramTest = {
        tested: true,
        success: false,
        error: error.message,
      };
    }
  } else {
    diagnostics.telegramTest = {
      tested: false,
      reason: 'Variables not found',
    };
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
