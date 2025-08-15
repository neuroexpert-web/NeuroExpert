// Обработчик контактной формы с валидацией и сохранением
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

    // Валидация телефона (простая проверка)
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
      status: 'new',
      utm: {
        source: event.queryStringParameters?.utm_source || null,
        medium: event.queryStringParameters?.utm_medium || null,
        campaign: event.queryStringParameters?.utm_campaign || null
      }
    };

    // В production здесь должно быть сохранение в БД
    // Например: await saveToDatabase(lead);
    console.log('New lead:', lead);

    // Отправка email администратору (если настроен)
    if (process.env.ADMIN_EMAIL && process.env.SENDGRID_API_KEY) {
      // await sendAdminNotification(lead);
    }

    // Успешный ответ
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Заявка успешно отправлена',
        leadId: lead.id
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