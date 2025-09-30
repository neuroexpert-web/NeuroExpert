import { NextResponse } from 'next/server';

// Simple CSRF/Same-Site protection middleware
// Blocks state-changing requests (POST/PUT/PATCH/DELETE) coming from other origins.
// For enhanced security add a CSRF token check in the future.
export function middleware(request) {
  const method = request.method.toUpperCase();

  // Only protect non-safe HTTP methods
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // If Origin header exists and does NOT match current host, block the request
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { error: 'CSRF protection: invalid origin.' },
        { status: 403 }
      );
    }

    // If Origin is present and same-site, allow. Otherwise require custom header.
    if (origin && host && origin.includes(host)) {
      // same-site, allow without extra header
    } else {
      const csrfHeader = request.headers.get('x-neuroexpert-csrf');
      if (!csrfHeader) {
        return NextResponse.json(
          { error: 'CSRF protection: missing CSRF header.' },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

// Apply to every API route
export const config = {
  matcher: ['/api/:path*'],
};