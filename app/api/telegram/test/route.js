import { NextResponse } from 'next/server';

export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  const diagnostics = {
    status: 'Telegram API Test',
    timestamp: new Date().toISOString(),
    config: {
      hasToken: !!TELEGRAM_BOT_TOKEN,
      tokenLength: TELEGRAM_BOT_TOKEN ? TELEGRAM_BOT_TOKEN.length : 0,
      tokenFormat: TELEGRAM_BOT_TOKEN ? 
        (TELEGRAM_BOT_TOKEN.match(/^\d+:[\w-]+$/) ? 'valid' : 'invalid format') : 
        'missing',
      hasChatId: !!TELEGRAM_CHAT_ID,
      chatIdFormat: TELEGRAM_CHAT_ID ? 
        (TELEGRAM_CHAT_ID.match(/^-?\d+$/) ? 'valid' : 'invalid format') : 
        'missing'
    },
    tests: {}
  };
  
  // Test 1: Check bot info
  if (TELEGRAM_BOT_TOKEN) {
    try {
      const botInfoResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
      );
      const botInfo = await botInfoResponse.json();
      diagnostics.tests.botInfo = {
        success: botInfo.ok,
        botName: botInfo.result?.username,
        botId: botInfo.result?.id,
        error: botInfo.description
      };
    } catch (error) {
      diagnostics.tests.botInfo = {
        success: false,
        error: error.message
      };
    }
  }
  
  // Test 2: Send test message
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const testMessage = `🧪 *Тестовое сообщение*\n\n` +
        `✅ Telegram уведомления настроены правильно!\n` +
        `🕐 Время: ${new Date().toLocaleString('ru-RU')}\n` +
        `🌐 Источник: NeuroExpert API Test`;
        
      const sendResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: testMessage,
            parse_mode: 'Markdown'
          })
        }
      );
      
      const sendResult = await sendResponse.json();
      diagnostics.tests.sendMessage = {
        success: sendResult.ok,
        messageId: sendResult.result?.message_id,
        error: sendResult.description
      };
    } catch (error) {
      diagnostics.tests.sendMessage = {
        success: false,
        error: error.message
      };
    }
  }
  
  // Recommendations
  diagnostics.recommendations = [];
  
  if (!TELEGRAM_BOT_TOKEN) {
    diagnostics.recommendations.push({
      issue: 'TELEGRAM_BOT_TOKEN не установлен',
      solution: '1. Создайте бота через @BotFather в Telegram\n2. Скопируйте токен\n3. Добавьте в переменные окружения'
    });
  }
  
  if (!TELEGRAM_CHAT_ID) {
    diagnostics.recommendations.push({
      issue: 'TELEGRAM_CHAT_ID не установлен',
      solution: '1. Добавьте бота в чат/канал\n2. Отправьте сообщение в чат\n3. Используйте getUpdates API для получения chat_id'
    });
  }
  
  if (diagnostics.tests.botInfo && !diagnostics.tests.botInfo.success) {
    diagnostics.recommendations.push({
      issue: 'Токен бота недействителен',
      solution: 'Проверьте правильность токена. Он должен быть в формате: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz'
    });
  }
  
  if (diagnostics.tests.sendMessage && !diagnostics.tests.sendMessage.success) {
    diagnostics.recommendations.push({
      issue: 'Не удается отправить сообщение',
      solution: 'Убедитесь что:\n1. Бот добавлен в чат\n2. Chat ID правильный\n3. У бота есть права на отправку сообщений'
    });
  }
  
  return NextResponse.json(diagnostics, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// POST endpoint для отправки тестового сообщения с кастомным текстом
export async function POST(request) {
  try {
    const { message } = await request.json();
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({
        success: false,
        error: 'Telegram не настроен. Добавьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID'
      }, { status: 400 });
    }
    
    const telegramMessage = `📨 *Тест формы обратной связи*\n\n${message || 'Тестовое сообщение'}\n\n🕐 ${new Date().toLocaleString('ru-RU')}`;
    
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown'
        })
      }
    );
    
    const result = await response.json();
    
    return NextResponse.json({
      success: result.ok,
      messageId: result.result?.message_id,
      error: result.description
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}