import { NextResponse } from 'next/server';

export function middleware(request) {
  // Логируем все API запросы
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`API Route called: ${request.nextUrl.pathname}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};