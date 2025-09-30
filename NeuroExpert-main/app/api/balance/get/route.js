/**
 * API endpoint для получения баланса пользователя
 * GET /api/balance/get
 */

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // TODO: Получить userId из сессии/токена
    // TODO: Запросить баланс из базы данных
    
    // Временная заглушка
    const mockBalance = {
      balance: 1000,
      currency: 'USD',
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(mockBalance, { status: 200 });
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
    return NextResponse.json(
      { error: 'Не удалось получить баланс' },
      { status: 500 }
    );
  }
}
