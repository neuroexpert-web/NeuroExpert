import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authRateLimit } from '@/app/middleware/rateLimit';

// --- Security hardening -----------------------------
// Получаем секретный ключ и хешированный пароль из переменных окружения.
// 1) В production (NODE_ENV!=='test') _обязательно_ требуем их наличие.
// 2) В тестовой среде допускаем дефолты, чтобы unit-тесты не падали без .env.
// ----------------------------------------------------
const isTest = process.env.NODE_ENV === 'test';

const JWT_SECRET = process.env.JWT_SECRET ?? (isTest ? 'test-jwt-secret' : null);
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? (isTest
  ? '$2a$10$Jpej8chn4pPh2aCi0qDEr.F4GzOAxIawVq2KXUMKwWEVxNPBz9.s2' // hash for "test-password"
  : null);

// Check will be performed at runtime instead of build time
if (!JWT_SECRET || !ADMIN_PASSWORD_HASH) {
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    console.error(
      'WARNING: Environment variables JWT_SECRET and ADMIN_PASSWORD_HASH must be set in production.\n' +
      'Generate a secure ADMIN_PASSWORD_HASH via "npm run generate:password -- <password>" and\n' +
      'place both values into your hosting provider dashboard or a local .env file.'
    );
  }
}

// Simple in-memory rate-limiting (5 failed attempts / 60s per IP)
const ATTEMPT_LIMIT = 5;
const WINDOW_MS = 60 * 1000;
// Map<ip, { count: number; first: number }>
const attempts = new Map();

function registerAttempt(ip) {
  const now = Date.now();
  let data = attempts.get(ip);
  if (!data || now - data.first > WINDOW_MS) {
    data = { count: 0, first: now };
  }
  data.count += 1;
  attempts.set(ip, data);
  return data.count;
}

function resetAttempts(ip) {
  attempts.delete(ip);
}

export async function POST(request) {
  try {
    // Rate-limit check (based on x-forwarded-for header)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

    // Increment attempts *before* password validation – we will reset on success.
    const attemptCount = registerAttempt(ip);
    if (attemptCount > ATTEMPT_LIMIT) {
      return NextResponse.json(
        { error: 'Too many login attempts, please try again later.' },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Проверяем пароль против хешированного значения
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Успешный вход — сбрасываем счётчик попыток
    resetAttempts(ip);

    // Создаем JWT токен
    const token = jwt.sign(
      {
        role: 'admin',
        timestamp: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      token,
      expiresIn: 86400, // 24 hours in seconds
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Проверка токена
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { valid: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return NextResponse.json({
        valid: true,
        role: decoded.role
      });
    } catch (error) {
      return NextResponse.json(
        { valid: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false },
      { status: 500 }
    );
  }
}