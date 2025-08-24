import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: Date.now(),
    service: 'neuroexpert-analytics',
    version: '3.0.0'
  });
}