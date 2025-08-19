// Альтернативная версия с прямой отправкой в Telegram
exports.handler = async (event, context) => {
  // CORS headers
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

  // Функция прямой отправки в Telegram
  const sendToTelegram = async (data) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.log('Telegram credentials not configured');
      return { success: false, message: 'Telegram not configured' };
    }
    
    const message = `📨 *Новая заявка с сайта*\n\n` +
      `👤 *Имя:* ${data.name}\n` +
      `📱 *Телефон:* ${data.phone}\n` +
      `📧 *Email:* ${data.email || 'Не указан'}\n` +
      `🏢 *Компания:* ${data.company || 'Не указана'}\n` +
      `💬 *Сообщение:* ${data.message || 'Без сообщения'}\n\n` +
      `🌐 *Источник:* NeuroExpert\n` +
      `📅 _${new Date().toLocaleString('ru-RU')}_`;
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      });
      
      const result = await response.json();
      
      if (result.ok) {
        return { success: true, messageId: result.result.message_id };
      } else {
        console.error('Telegram API error:', result);
        return { success: false, message: result.description };
      }
    } catch (error) {
      console.error('Telegram send error:', error);
      return { success: false, message: error.message };
    }
  };

  try {
    // Парсинг данных формы
    const { name, phone, email, company, message } = JSON.parse(event.body || '{}');

    // Валидация обязательных полей
    if (!name || !phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Имя и телефон обязательны для заполнения' 
        })
      };
    }

    // Валидация телефона
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Неверный формат телефона' 
        })
      };
    }

    // Валидация email (если указан)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false,
            error: 'Неверный формат email' 
          })
        };
      }
    }

    // Форматирование телефона
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 11 
      ? `+${cleanPhone[0]} (${cleanPhone.slice(1,4)}) ${cleanPhone.slice(4,7)}-${cleanPhone.slice(7,9)}-${cleanPhone.slice(9,11)}`
      : phone;

    // Создание записи о заявке
    const lead = {
      id: Date.now(),
      name,
      phone: formattedPhone,
      email: email || null,
      company: company || null,
      message: message || null,
      source: 'website',
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    console.log('New lead:', lead);

    // Отправка в Telegram
    const telegramResult = await sendToTelegram({
      name,
      phone: formattedPhone,
      email,
      company,
      message
    });

    if (!telegramResult.success) {
      console.error('Telegram notification failed:', telegramResult.message);
    } else {
      console.log('Telegram notification sent, message ID:', telegramResult.messageId);
    }

    // Успешный ответ
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Заявка успешно отправлена',
        leadId: lead.id,
        telegramSent: telegramResult.success
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Произошла ошибка при отправке заявки' 
      })
    };
  }
};