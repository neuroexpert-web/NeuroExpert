import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API is working',
    endpoints: {
      assistant: '/api/assistant',
      assistantTest: '/api/assistant/test',
      contactForm: '/api/contact-form',
      telegramNotify: '/api/telegram-notify',
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
      hasTelegramBot: !!process.env.TELEGRAM_BOT_TOKEN,
      hasTelegramChat: !!process.env.TELEGRAM_CHAT_ID,
    },
  });
}
