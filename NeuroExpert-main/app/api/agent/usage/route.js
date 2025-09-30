/**
 * API endpoint для получения данных о потреблении агентов
 * GET /api/agent/usage
 */

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // TODO: Получить userId из сессии/токена
    // TODO: Запросить данные о потреблении агентов из базы данных
    // TODO: Агрегировать данные по различным метрикам

    // Временная заглушка с mock данными
    const mockUsageData = {
      tasksCompleted: 150,
      dataProcessed: 250, // в ГБ
      activeTime: 10, // в часах
      apiCalls: 1250,
      agentBreakdown: [
        {
          agentId: 'agent-001',
          name: 'Аналитический агент',
          tasksCompleted: 80,
          cost: 45.50
        },
        {
          agentId: 'agent-002',
          name: 'Агент обработки данных',
          tasksCompleted: 70,
          cost: 38.20
        }
      ],
      estimatedCost: 83.70, // в USD
      period: {
        start: new Date(Date.now() - 30 * 86400000).toISOString(),
        end: new Date().toISOString()
      }
    };

    return NextResponse.json(mockUsageData, { status: 200 });

  } catch (error) {
    console.error('Ошибка получения данных о потреблении:', error);
    return NextResponse.json(
      { error: 'Не удалось получить данные о потреблении' },
      { status: 500 }
    );
  }
}
