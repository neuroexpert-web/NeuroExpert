/**
 * API endpoint для верификации платежа через x402
 * POST /api/payment/verify
 */

import { NextResponse } from 'next/server';
import { createX402Client } from '../../../../utils/x402Client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { payload, txHash } = body;

    // Валидация
    if (!payload) {
      return NextResponse.json(
        { error: 'Отсутствует подписанный платежный payload' },
        { status: 400 }
      );
    }

    // TODO: Получить userId из сессии/токена
    // TODO: Получить оригинальные paymentDetails из базы данных
    // TODO: Проверить, что платеж еще не был обработан

    // Инициализация x402 клиента
    const x402Client = createX402Client();
    
    // Верификация платежа через facilitator
    const verifyResult = await x402Client.verifyPayment(payload);

    if (!verifyResult.valid) {
      return NextResponse.json({
        success: false,
        error: 'Платеж не прошел верификацию',
        reason: verifyResult.reason
      }, { status: 400 });
    }

    // Проведение платежа (settlement)
    const settlementResult = await x402Client.settlePayment(payload);

    // TODO: Обновить статус платежа в базе данных
    // TODO: Обновить баланс пользователя
    // TODO: Создать запись в истории транзакций

    return NextResponse.json({
      success: true,
      verified: true,
      txHash: settlementResult.txHash,
      status: settlementResult.status,
      blockNumber: settlementResult.blockNumber,
      message: 'Платеж успешно верифицирован и проведен'
    }, { status: 200 });

  } catch (error) {
    console.error('Ошибка верификации платежа:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Не удалось верифицировать платеж' 
      },
      { status: 500 }
    );
  }
}

/**
 * Проверка статуса транзакции
 * GET /api/payment/verify?txHash=0x...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const txHash = searchParams.get('txHash');
    const chain = searchParams.get('chain') || 'base';

    if (!txHash) {
      return NextResponse.json(
        { error: 'Отсутствует txHash' },
        { status: 400 }
      );
    }

    // Инициализация x402 клиента
    const x402Client = createX402Client();
    
    // Получение статуса транзакции
    const status = await x402Client.getPaymentStatus(txHash, chain);

    return NextResponse.json({
      success: true,
      ...status,
      explorerUrl: x402Client.getExplorerUrl(txHash, chain)
    }, { status: 200 });

  } catch (error) {
    console.error('Ошибка получения статуса транзакции:', error);
    return NextResponse.json(
      { error: error.message || 'Не удалось получить статус транзакции' },
      { status: 500 }
    );
  }
}
