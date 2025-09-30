import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    // TODO: Проверить аутентификацию пользователя
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Деактивировать агента в БД
    // const agent = await db.agents.update({
    //   where: { id: parseInt(id) },
    //   data: { 
    //     isActive: false,
    //     deactivatedAt: new Date()
    //   }
    // });

    // TODO: Рассчитать стоимость использования и списать с баланса
    // const usageTime = calculateUsageTime(agent.activatedAt, new Date());
    // const cost = usageTime * agent.costPerHour;
    // 
    // await db.users.update({
    //   where: { id: session.user.id },
    //   data: { 
    //     balance: { decrement: cost }
    //   }
    // });
    //
    // await db.transactions.create({
    //   data: {
    //     userId: session.user.id,
    //     agentId: parseInt(id),
    //     amount: cost,
    //     type: 'agent_usage',
    //     status: 'completed'
    //   }
    // });

    // Mock ответ
    return NextResponse.json({
      success: true,
      message: 'Agent deactivated successfully',
      agent: {
        id: parseInt(id),
        isActive: false,
        deactivatedAt: new Date().toISOString(),
        usageCost: 0, // TODO: рассчитать реальную стоимость
      }
    });
  } catch (error) {
    console.error('Error deactivating agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to deactivate agent' },
      { status: 500 }
    );
  }
}
