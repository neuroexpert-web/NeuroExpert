import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    apiKeyPresent: !!process.env.GOOGLE_GEMINI_API_KEY,
    apiKeyLength: process.env.GOOGLE_GEMINI_API_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}