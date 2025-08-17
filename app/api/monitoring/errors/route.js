import { NextResponse } from 'next/server';
import errorMonitor from '../../../utils/monitoring';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Проверка авторизации администратора
function verifyAdminToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request) {
  // Проверяем авторизацию
  if (!verifyAdminToken(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Получаем статистику ошибок
  const stats = errorMonitor.getStats();
  
  return NextResponse.json({
    success: true,
    stats
  });
}

export async function POST(request) {
  try {
    const { error, context } = await request.json();
    
    if (!error || !error.message) {
      return NextResponse.json(
        { error: 'Invalid error data' },
        { status: 400 }
      );
    }
    
    // Логируем ошибку
    await errorMonitor.logError(error, {
      ...context,
      source: 'api',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });
    
    return NextResponse.json({
      success: true,
      message: 'Error logged successfully'
    });
  } catch (error) {
    console.error('Error logging error:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}