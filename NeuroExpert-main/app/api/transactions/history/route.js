/**
 * API endpoint для получения истории транзакций
 * GET /api/transactions/history
 */

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // TODO: Получить userId из сессии/токена
    // TODO: Запросить историю транзакций из базы данных
    // TODO: Добавить пагинацию и фильтрацию

    // Временная заглушка с mock данными
    const mockTransactions = [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0],
        description: 'Пополнение баланса через x402',
        amount: 500,
        type: 'deposit',
        status: 'completed',
        txHash: '0x1234...5678',
        chain: 'base',
        token: 'USDC'
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        description: 'Оплата услуг AI-агента',
        amount: -50,
        type: 'payment',
        status: 'completed',
        agentId: 'agent-001'
      },
      {
        id: 3,
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        description: 'Пополнение баланса',
        amount: 1000,
        type: 'deposit',
        status: 'completed',
        txHash: '0xabcd...efgh',
        chain: 'base',
        token: 'USDC'
      },
      {
        id: 4,
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        description: 'Оплата аналитического отчета',
        amount: -25,
        type: 'payment',
        status: 'completed',
        agentId: 'agent-002'
      }
    ];

    return NextResponse.json({
      transactions: mockTransactions,
      total: mockTransactions.length,
      page: 1,
      limit: 10
    }, { status: 200 });

  } catch (error) {
    console.error('Ошибка получения истории транзакций:', error);
    return NextResponse.json(
      { error: 'Не удалось получить историю транзакций' },
      { status: 500 }
    );
  }
}
