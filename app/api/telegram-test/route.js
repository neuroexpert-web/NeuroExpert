import { NextResponse } from 'next/server';

export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  // Проверка наличия переменных
  const config = {
    hasToken: !!TELEGRAM_BOT_TOKEN,
    tokenLength: TELEGRAM_BOT_TOKEN?.length || 0,
    tokenPrefix: TELEGRAM_BOT_TOKEN?.substring(0, 10) + '...' || 'NOT SET',
    hasChatId: !!TELEGRAM_CHAT_ID,
    chatId: TELEGRAM_CHAT_ID || 'NOT SET',
    environment: process.env.NODE_ENV || 'development'
  };
  
  // Если переменные есть, пробуем отправить тестовое сообщение
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const testMessage = `🧪 Тестовое сообщение от NeuroExpert\n\nВремя: ${new Date().toLocaleString('ru-RU')}\nСреда: ${config.environment}`;
      
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: testMessage
          })
        }
      );
      
      const result = await response.json();
      
      return NextResponse.json({
        config,
        testSent: true,
        telegramResponse: {
          ok: result.ok,
          error_code: result.error_code,
          description: result.description,
          messageId: result.result?.message_id
        }
      });
    } catch (error) {
      return NextResponse.json({
        config,
        testSent: false,
        error: error.message
      });
    }
  }
  
  return NextResponse.json({
    config,
    testSent: false,
    message: 'Telegram credentials not configured'
  });
}