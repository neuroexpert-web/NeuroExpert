export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withRateLimit } from '../../../middleware/rateLimit';

async function handler() {
  return NextResponse.json({
    status: 'ok',
    apiKeyPresent: !!process.env.GOOGLE_GEMINI_API_KEY,
    apiKeyLength: process.env.GOOGLE_GEMINI_API_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    message: 'API test endpoint is working'
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export const GET = withRateLimit(handler, 'ai');