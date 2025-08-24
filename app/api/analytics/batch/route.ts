import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/analytics';
import { validateBatch } from '@/analytics/validation';
import { rateLimit } from '@/security/rate-limit';
import { verifyCSRF } from '@/security/csrf';
import { authenticateRequest } from '@/security/auth';

export async function POST(request: NextRequest) {
  try {
    // Security checks
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // CSRF verification
    const csrfValid = await verifyCSRF(request);
    if (!csrfValid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    // Authentication
    const auth = await authenticateRequest(request);

    // Parse and validate batch
    const body = await request.json();
    const events = body.events || body;
    
    const validationResult = validateBatch(events);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: 'Invalid batch data', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Enrich events with context
    const enrichedEvents = events.map((event: any) => ({
      ...event,
      timestamp: event.timestamp || Date.now(),
      userId: event.userId || auth?.userId,
      sessionId: event.sessionId || auth?.sessionId || request.headers.get('x-session-id'),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    }));

    // Track events
    const analytics = getAnalytics();
    const results = [];
    
    for (const event of enrichedEvents) {
      try {
        analytics.track(event);
        results.push({ success: true, eventId: event.timestamp });
      } catch (error) {
        results.push({ success: false, error: 'Failed to track event' });
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        processed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics batch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Session-ID',
      'Access-Control-Max-Age': '86400',
    },
  });
}