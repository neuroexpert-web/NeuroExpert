import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Получаем данные из запроса
    const { token, chatId, testMessage } = await request.json();
    
    if (!token || !chatId) {
      return NextResponse.json({
        success: false,
        error: 'Token и Chat ID обязательны'
      });
    }

    // Тестируем отправку сообщения
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Attempting to send to Telegram');
    }

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage || `🧪 Тест от NeuroExpert\n\nВремя: ${new Date().toLocaleString('ru-RU')}\nСреда: ${process.env.NODE_ENV || 'development'}`
      })
    });

    const result = await response.json();
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Telegram API response received');
    }

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Сообщение успешно отправлено!',
        messageId: result.result.message_id,
        chat: result.result.chat
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Telegram API error',
        details: result
      });
    }
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Также создадим метод для проверки текущих переменных
export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  // Тестируем текущие переменные окружения
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`,
        { method: 'GET' }
      );
      
      const botInfo = await response.json();
      
      if (botInfo.ok) {
        // Также проверим, можем ли отправить сообщение
        const testResponse = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: `✅ Диагностика Telegram уведомлений\n\nБот: @${botInfo.result.username}\nВремя: ${new Date().toLocaleString('ru-RU')}`
            })
          }
        );
        
        const testResult = await testResponse.json();
        
        return NextResponse.json({
          configured: true,
          bot: {
            username: botInfo.result.username,
            firstName: botInfo.result.first_name,
            canSendMessages: botInfo.result.can_join_groups,
            canReadMessages: botInfo.result.can_read_all_group_messages
          },
          testMessage: {
            sent: testResult.ok,
            error: testResult.description,
            messageId: testResult.result?.message_id
          },
          environment: process.env.NODE_ENV
        });
      } else {
        return NextResponse.json({
          configured: true,
          error: 'Invalid bot token',
          details: botInfo
        });
      }
    } catch (error) {
      return NextResponse.json({
        configured: true,
        error: 'Failed to connect to Telegram API',
        details: error.message
      });
    }
  }
  
  return NextResponse.json({
    configured: false,
    message: 'Telegram переменные не настроены',
    hasToken: !!TELEGRAM_BOT_TOKEN,
    hasChatId: !!TELEGRAM_CHAT_ID
  });
}