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
      analytics: {
        google: '/api/analytics/google',
        yandex: '/api/analytics/yandex',
        unified: '/api/analytics/unified',
        test: '/api/analytics/test'
      }
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
      hasTelegramBot: !!process.env.TELEGRAM_BOT_TOKEN,
      hasTelegramChat: !!process.env.TELEGRAM_CHAT_ID
    },
    telegram: {
      configured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChatId: !!process.env.TELEGRAM_CHAT_ID,
      tokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0
    },
    email: {
      configured: !!(process.env.SMTP_HOST || process.env.SENDGRID_API_KEY || process.env.MAILCHIMP_API_KEY),
      smtp: {
        host: !!process.env.SMTP_HOST,
        user: !!process.env.SMTP_USER,
        pass: !!process.env.SMTP_PASS
      },
      sendgrid: !!process.env.SENDGRID_API_KEY,
      mailchimp: !!process.env.MAILCHIMP_API_KEY
    }
  });
}