import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    // TODO: Проверить аутентификацию пользователя
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Проверить баланс пользователя
    // const user = await db.users.findUnique({ where: { id: session.user.id } });
    // const agent = await db.agents.findUnique({ where: { id: parseInt(id) } });
    // 
    // if (user.balance < agent.costPerHour) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     error: 'Insufficient balance' 
    //   }, { status: 400 });
    // }

    // TODO: Активировать агента в БД
    // await db.agents.update({
    //   where: { id: parseInt(id) },
    //   data: { 
    //     isActive: true,
    //     activatedAt: new Date()
    //   }
    // });

    // Mock ответ
    return NextResponse.json({
      success: true,
      message: 'Agent activated successfully',
      agent: {
        id: parseInt(id),
        isActive: true,
        activatedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error activating agent:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to activate agent' },
      { status: 500 }
    );
  }
}
