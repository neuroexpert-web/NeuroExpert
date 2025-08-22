import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      anthropicKeyLength: process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 0,
      anthropicKeyStart: process.env.ANTHROPIC_API_KEY
        ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...'
        : 'NOT SET',

      hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
      geminiKeyLength: process.env.GOOGLE_GEMINI_API_KEY
        ? process.env.GOOGLE_GEMINI_API_KEY.length
        : 0,

      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    },
    timestamp: new Date().toISOString(),
  });
}
