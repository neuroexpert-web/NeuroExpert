import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    message: 'API test endpoint is working'
  });
}