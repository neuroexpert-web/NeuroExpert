// Функция для отправки уведомлений в Telegram
exports.handler = async (event, context) => {
  // CORS заголовки
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Обработка preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Проверка метода
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Получаем данные из запроса
    const { type, data } = JSON.parse(event.body || '{}');
    
    // Проверяем наличие токена и chat ID
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.error('Telegram credentials not configured');
      return {
        statusCode: 200, // Возвращаем 200, чтобы не ломать фронтенд
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Telegram не настроен' 
        })
      };
    }

    // Формируем сообщение в зависимости от типа
    let message = '';
    
    switch (type) {
      case 'roi_calculation':
        message = `🎯 *Новый расчет ROI*\n\n` +
          `📊 *Бизнес:* ${data.businessSize}\n` +
          `🏭 *Отрасль:* ${data.industry}\n` +
          `💰 *Выручка:* ${data.revenue?.toLocaleString('ru-RU')} ₽/мес\n` +
          `💵 *Бюджет:* ${data.budget?.toLocaleString('ru-RU')} ₽\n\n` +
          `📈 *Результат ROI:* ${data.roi}%\n` +
          `💸 *Экономия:* ${data.savings?.toLocaleString('ru-RU')} ₽/мес\n` +
          `🚀 *Рост выручки:* +${data.growth}%\n` +
          `⏱ *Окупаемость:* ${data.payback} мес\n\n` +
          `📅 _${new Date().toLocaleString('ru-RU')}_`;
        break;
        
      case 'contact_form':
        message = `📨 *Новая заявка с сайта*\n\n` +
          `👤 *Имя:* ${data.name}\n` +
          `📱 *Телефон:* ${data.phone}\n` +
          `📧 *Email:* ${data.email || 'Не указан'}\n` +
          `🏢 *Компания:* ${data.company || 'Не указана'}\n` +
          `💬 *Сообщение:* ${data.message || 'Без сообщения'}\n\n` +
          `📅 _${new Date().toLocaleString('ru-RU')}_`;
        break;
        
      case 'ai_chat':
        message = `🤖 *Активность в AI чате*\n\n` +
          `❓ *Вопрос:* ${data.question}\n` +
          `💡 *Ответ AI:* ${data.answer?.substring(0, 200)}...\n` +
          `📊 *Длина диалога:* ${data.dialogLength} сообщений\n\n` +
          `📅 _${new Date().toLocaleString('ru-RU')}_`;
        break;
        
      case 'demo_request':
        message = `🎯 *Запрос демо-доступа*\n\n` +
          `👤 *Контакт:* ${data.contact}\n` +
          `🏢 *Компания:* ${data.company || 'Не указана'}\n` +
          `📊 *Интересует:* ${data.interest || 'Общая демонстрация'}\n\n` +
          `📅 _${new Date().toLocaleString('ru-RU')}_`;
        break;
        
      default:
        message = `📌 *Новое событие*\n\n` +
          `Тип: ${type}\n` +
          `Данные: ${JSON.stringify(data, null, 2)}\n\n` +
          `📅 _${new Date().toLocaleString('ru-RU')}_`;
    }

    // Отправляем сообщение в Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Ошибка отправки в Telegram',
          error: result.description 
        })
      };
    }

    // Успешная отправка
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Уведомление отправлено',
        telegram_message_id: result.result.message_id
      })
    };

  } catch (error) {
    console.error('Telegram notify error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      })
    };
  }
};