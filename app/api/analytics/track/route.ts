import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/analytics';
import { validateEvent } from '@/lib/analytics/validation';
import { rateLimit } from '@/lib/security/rate-limit';
import { verifyCSRF } from '@/lib/security/csrf';
import { authenticateRequest } from '@/lib/security/auth';

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

    // Authentication (optional for basic events)
    const auth = await authenticateRequest(request);

    // Parse and validate event
    const body = await request.json();
    const validationResult = validateEvent(body);
    
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: 'Invalid event data', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Enrich event with context
    const event = {
      ...body,
      timestamp: Date.now(),
      userId: auth?.userId,
      sessionId: auth?.sessionId || request.headers.get('x-session-id'),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      referrer: request.headers.get('referer')
    };

    // Track event
    const analytics = getAnalytics();
    analytics.track(event);

    return NextResponse.json(
      { success: true, eventId: event.timestamp },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics track error:', error);
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