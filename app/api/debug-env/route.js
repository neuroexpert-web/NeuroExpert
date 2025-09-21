import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';
const ADMIN_DEBUG_TOKEN = process.env.ADMIN_DEBUG_TOKEN || null;

export async function GET(request) {
  // В продакшене доступ только по защищённому токену в заголовке
  if (isProduction) {
    const token = request.headers.get('x-admin-debug-token');
    if (!ADMIN_DEBUG_TOKEN || !token || token !== ADMIN_DEBUG_TOKEN) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  // Минимизируем утечки: в проде возвращаем только булевые статусы без длин/префиксов значений
  const baseInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  const diagnostics = {
    ...baseInfo,
    telegramConfigured: {
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChatId: !!process.env.TELEGRAM_CHAT_ID,
    },
    otherVars: {
      hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY || !!process.env.GEMINI_API_KEY || !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
    },
    deployment: {
      region: process.env.VERCEL_REGION || 'unknown',
      url: process.env.VERCEL_URL || 'unknown',
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    }
  };

  // В режиме разработки можно вернуть расширенные сведения для отладки
  if (!isProduction) {
    diagnostics.telegramConfigured.tokenLength = process.env.TELEGRAM_BOT_TOKEN?.length || 0;
    diagnostics.allTelegramVars = Object.keys(process.env)
      .filter(key => key.includes('TELEGRAM'))
      .map(key => ({
        name: key,
        exists: !!process.env[key]
      }));
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}