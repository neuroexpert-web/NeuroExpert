import { NextResponse } from 'next/server';

// Telegram Bot API endpoint
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Проверяем тип запроса
    if (body.action === 'send_notification') {
      return await sendNotification(body);
    } else if (body.action === 'webhook') {
      return await handleWebhook(body);
    } else if (body.action === 'setup_bot') {
      return await setupBot();
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Telegram API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Отправка уведомления
async function sendNotification({ chatId, message, options = {} }) {
  if (!chatId || !message) {
    return NextResponse.json(
      { error: 'Missing chatId or message' },
      { status: 400 }
    );
  }

  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
    ...options
  };

  // Добавляем кнопки если есть
  if (options.buttons) {
    payload.reply_markup = {
      inline_keyboard: options.buttons
    };
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Failed to send message');
    }

    return NextResponse.json({
      success: true,
      messageId: data.result.message_id
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Обработка вебхука от Telegram
async function handleWebhook(update) {
  // Проверяем, что это сообщение
  if (update.message) {
    const { chat, text, from } = update.message;
    
    // Логируем для отладки
    console.log(`Telegram message from ${from.username}: ${text}`);
    
    // Обрабатываем команды
    if (text === '/start') {
      await sendWelcomeMessage(chat.id, from.first_name);
    } else if (text === '/help') {
      await sendHelpMessage(chat.id);
    } else if (text === '/status') {
      await sendStatusMessage(chat.id);
    } else {
      // Обрабатываем обычные сообщения
      await processUserMessage(chat.id, text, from);
    }
  }
  
  // Обрабатываем callback кнопки
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
  }
  
  return NextResponse.json({ ok: true });
}

// Приветственное сообщение
async function sendWelcomeMessage(chatId, firstName) {
  const message = `
🚀 <b>Добро пожаловать в NeuroExpert Bot!</b>

Привет, ${firstName}! 👋

Я помогу вам:
• 📊 Получать уведомления о важных событиях
• 📈 Следить за аналитикой в реальном времени
• 🤖 Быстро получать ответы на вопросы
• 📱 Управлять платформой прямо из Telegram

Используйте /help для списка команд.
  `;
  
  const buttons = [
    [
      { text: '🔗 Подключить аккаунт', callback_data: 'connect_account' },
      { text: '📊 Демо аналитики', callback_data: 'show_demo' }
    ],
    [
      { text: '💬 Задать вопрос', callback_data: 'ask_question' }
    ]
  ];
  
  await sendNotification({
    chatId,
    message,
    options: { buttons }
  });
}

// Сообщение помощи
async function sendHelpMessage(chatId) {
  const message = `
📋 <b>Доступные команды:</b>

/start - Начать работу с ботом
/help - Показать это сообщение
/status - Статус вашего аккаунта
/analytics - Краткая аналитика
/subscribe - Подписаться на уведомления
/unsubscribe - Отписаться от уведомлений
/settings - Настройки уведомлений

💡 <i>Совет: Вы также можете просто написать свой вопрос, и я постараюсь помочь!</i>
  `;
  
  await sendNotification({ chatId, message });
}

// Статус аккаунта
async function sendStatusMessage(chatId) {
  // Здесь должна быть проверка в базе данных
  const isConnected = false; // Заглушка
  
  const message = isConnected ? `
✅ <b>Аккаунт подключен</b>

• Платформа: NeuroExpert
• Тариф: Бизнес
• Активен до: 31.12.2025
• Уведомления: Включены

📊 Перейти в личный кабинет: neuroexpert.io/dashboard
  ` : `
❌ <b>Аккаунт не подключен</b>

Для подключения:
1. Зайдите в личный кабинет NeuroExpert
2. Перейдите в Настройки → Интеграции
3. Нажмите "Подключить Telegram"
4. Следуйте инструкциям

Или нажмите кнопку ниже для быстрого подключения.
  `;
  
  const buttons = isConnected ? [] : [
    [{ text: '🔗 Подключить аккаунт', callback_data: 'connect_account' }]
  ];
  
  await sendNotification({
    chatId,
    message,
    options: { buttons }
  });
}

// Обработка обычных сообщений
async function processUserMessage(chatId, text, from) {
  // Здесь можно добавить интеграцию с AI для ответов
  await sendNotification({
    chatId,
    message: `Я получил ваше сообщение: "${text}". Скоро здесь будет AI-ассистент, который сможет ответить на любые вопросы о NeuroExpert! 🤖`,
  });
}

// Обработка нажатий на кнопки
async function handleCallbackQuery(callbackQuery) {
  const { data, from, message } = callbackQuery;
  const chatId = message.chat.id;
  
  switch (data) {
    case 'connect_account':
      await sendNotification({
        chatId,
        message: '🔗 Для подключения перейдите по ссылке: https://neuroexpert.io/connect-telegram?chat_id=' + chatId
      });
      break;
      
    case 'show_demo':
      await sendDemoAnalytics(chatId);
      break;
      
    case 'ask_question':
      await sendNotification({
        chatId,
        message: '💬 Просто напишите ваш вопрос, и я постараюсь помочь!'
      });
      break;
  }
  
  // Отвечаем на callback query чтобы убрать "часики"
  await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQuery.id })
  });
}

// Демо аналитики
async function sendDemoAnalytics(chatId) {
  const message = `
📊 <b>Демо аналитика за сегодня:</b>

📈 <b>Продажи</b>
• Выручка: 156,430 ₽ (+23%)
• Заказов: 47 (+15%)
• Средний чек: 3,328 ₽ (+7%)

👥 <b>Клиенты</b>
• Новых: 12
• Вернувшихся: 35
• Конверсия: 3.2%

🎯 <b>Маркетинг</b>
• CTR: 2.8% (+0.5%)
• CAC: 1,240 ₽ (-18%)
• ROI: 285%

💡 <b>AI Рекомендация:</b>
Увеличьте бюджет на контекстную рекламу на 15% - прогнозируемый рост выручки +42,000 ₽/мес

<i>Это демо данные. Подключите аккаунт для реальной аналитики.</i>
  `;
  
  await sendNotification({ chatId, message });
}

// Настройка бота (webhook)
async function setupBot() {
  const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/integrations/telegram`;
  
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query']
      })
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Endpoint для проверки статуса
  return NextResponse.json({
    status: 'ok',
    bot: process.env.TELEGRAM_BOT_TOKEN ? 'configured' : 'not configured'
  });
}