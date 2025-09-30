/**
 * API endpoint для инициации платежа через x402
 * POST /api/payment/initiate
 */

import { NextResponse } from 'next/server';
import { createX402Client } from '../../../../utils/x402Client';
import { X402_CONFIG } from '../../../../lib/x402Config';

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, chain, token } = body;

    // Валидация
    if (!amount || amount < X402_CONFIG.limits.minAmount || amount > X402_CONFIG.limits.maxAmount) {
      return NextResponse.json(
        { error: `Сумма должна быть от ${X402_CONFIG.limits.minAmount} до ${X402_CONFIG.limits.maxAmount} USD` },
        { status: 400 }
      );
    }

    // TODO: Получить userId из сессии/токена
    // TODO: Проверить дневной лимит пользователя
    // TODO: Создать запись о платеже в базе данных

    // Инициализация x402 клиента
    const x402Client = createX402Client();
    
    // Создание деталей платежа
    const paymentDetails = await x402Client.initiatePayment(
      amount,
      chain || X402_CONFIG.defaultChain,
      token || X402_CONFIG.defaultToken
    );

    // TODO: Сохранить paymentDetails в базе данных для последующей верификации

    return NextResponse.json({
      success: true,
      paymentDetails: paymentDetails,
      message: 'Платеж инициирован. Подпишите транзакцию в кошельке.'
    }, { status: 200 });

  } catch (error) {
    console.error('Ошибка инициации платежа:', error);
    return NextResponse.json(
      { error: error.message || 'Не удалось инициировать платеж' },
      { status: 500 }
    );
  }
}
