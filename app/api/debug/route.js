import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';
const ADMIN_DEBUG_TOKEN = process.env.ADMIN_DEBUG_TOKEN || null;

export async function GET(request) {
  if (isProduction) {
    const token = request.headers.get('x-admin-debug-token');
    if (!ADMIN_DEBUG_TOKEN || !token || token !== ADMIN_DEBUG_TOKEN) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  return NextResponse.json({
    env: {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasGeminiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    },
    timestamp: new Date().toISOString()
  });
}