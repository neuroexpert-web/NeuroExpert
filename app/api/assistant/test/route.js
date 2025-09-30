import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    apiKeyPresent: !!(process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY),
    apiKeyLength: (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '').length,
    apiKeyName: process.env.GOOGLE_GEMINI_API_KEY ? 'GOOGLE_GEMINI_API_KEY' : (process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : (process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'NEXT_PUBLIC_GEMINI_API_KEY' : 'not_set')),
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    message: 'API test endpoint is working'
  });
}