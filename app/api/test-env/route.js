import { NextResponse } from 'next/server';

export async function GET() {
  // Безопасная проверка переменных окружения
  const envCheck = {
    GOOGLE_GEMINI_API_KEY: {
      exists: !!process.env.GOOGLE_GEMINI_API_KEY,
      length: process.env.GOOGLE_GEMINI_API_KEY?.length || 0,
      startsWith: process.env.GOOGLE_GEMINI_API_KEY?.substring(0, 5) || 'none'
    },
    GEMINI_API_KEY: {
      exists: !!process.env.GEMINI_API_KEY,
      length: process.env.GEMINI_API_KEY?.length || 0,
      startsWith: process.env.GEMINI_API_KEY?.substring(0, 5) || 'none'
    },
    OPENROUTER_API_KEY: {
      exists: !!process.env.OPENROUTER_API_KEY,
      length: process.env.OPENROUTER_API_KEY?.length || 0,
      startsWith: process.env.OPENROUTER_API_KEY?.substring(0, 5) || 'none'
    },
    ANTHROPIC_API_KEY: {
      exists: !!process.env.ANTHROPIC_API_KEY,
      length: process.env.ANTHROPIC_API_KEY?.length || 0,
      startsWith: process.env.ANTHROPIC_API_KEY?.substring(0, 5) || 'none'
    }
  };

  return NextResponse.json({
    success: true,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    envCheck
  });
}