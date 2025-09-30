import { NextResponse } from 'next/server';

// Mock данные агентов
const mockAgents = [
  {
    id: 1,
    name: 'Агент по рекламе',
    description: 'Оптимизирует рекламные кампании и анализирует их эффективность.',
    isActive: true,
    costPerHour: 0.5,
    uptime: '12ч',
    tasksCompleted: 45,
    revenue: 125.50,
  },
  {
    id: 2,
    name: 'Агент по аналитике',
    description: 'Собирает и анализирует данные для принятия бизнес-решений.',
    isActive: false,
    costPerHour: 0.75,
    uptime: '0ч',
    tasksCompleted: 0,
    revenue: 0,
  },
  {
    id: 3,
    name: 'Цифровой управляющий',
    description: 'Автоматизирует рутинные задачи и управляет бизнес-процессами.',
    isActive: true,
    costPerHour: 1.0,
    uptime: '24ч',
    tasksCompleted: 120,
    revenue: 350.00,
  },
];

export async function GET() {
  try {
    // TODO: Заменить на реальный запрос к БД
    // const agents = await db.agents.findMany();
    
    return NextResponse.json({
      success: true,
      agents: mockAgents,
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
