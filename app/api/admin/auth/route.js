import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { withRateLimit } from '../../../middleware/rateLimit';

// Получаем секретный ключ и хешированный пароль из переменных окружения
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$YourHashedPasswordHere';

async function postHandler(request) {
  try {
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

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        role: 'admin',
        timestamp: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      token,
      expiresIn: 86400 // 24 hours in seconds
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(postHandler, 'auth');

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