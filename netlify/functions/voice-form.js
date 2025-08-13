// Обработчик голосовой формы NeuroExpert
exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  // Обработка preflight OPTIONS запросов
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let voiceData;
  try {
    const body = JSON.parse(event.body || '{}');
    voiceData = {
      phone: body.phone,
      transcription: body.transcription || '',
      audioUrl: body.audioUrl || '',
      duration: body.duration || 0,
      source: 'voice_form',
      timestamp: new Date().toISOString()
    };
  } catch (parseError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  // Валидация обязательных полей
  if (!voiceData.phone) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Номер телефона обязателен для отправки голосового сообщения'
      })
    };
  }

  if (!voiceData.transcription && !voiceData.audioUrl) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Необходимо записать голосовое сообщение'
      })
    };
  }

  // Валидация телефона
  const phoneRegex = /^[\+]?[1-9][\d]{6,14}$/;
  if (!phoneRegex.test(voiceData.phone.replace(/[\s\-\(\)]/g, ''))) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Неверный формат номера телефона' 
      })
    };
  }

  try {
    // Анализ голосового сообщения
    const analysis = analyzeVoiceMessage(voiceData);
    
    // Создание лида для CRM
    const voiceLead = {
      id: `voice_lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: voiceData.timestamp,
      source: voiceData.source,
      priority: analysis.priority,
      status: 'new',
      type: 'voice_message',
      contact: {
        phone: voiceData.phone
      },
      voice: {
        transcription: voiceData.transcription,
        audioUrl: voiceData.audioUrl,
        duration: voiceData.duration,
        sentiment: analysis.sentiment,
        keywords: analysis.keywords,
        urgency: analysis.urgency
      },
      metadata: {
        userAgent: event.headers['user-agent'] || '',
        ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || '',
        referrer: event.headers.referer || ''
      }
    };

    // В production здесь будет:
    // - Сохранение аудио файла в облачное хранилище
    // - Профессиональная транскрипция через Speech-to-Text API
    // - Интеграция с реальной CRM
    console.log('🎤 New voice lead created:', JSON.stringify(voiceLead, null, 2));

    // Отправка уведомления команде
    await sendVoiceNotification(voiceLead);

    // Автоответ клиенту
    const autoResponse = generateVoiceAutoResponse(voiceData, analysis);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: autoResponse.message,
        leadId: voiceLead.id,
        expectedCallTime: autoResponse.expectedCallTime,
        analysis: {
          sentiment: analysis.sentiment,
          urgency: analysis.urgency
        },
        timestamp: voiceData.timestamp
      })
    };

  } catch (error) {
    console.error('Error processing voice form:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Произошла ошибка при обработке голосового сообщения. Попробуйте позже или позвоните нам напрямую.',
        timestamp: new Date().toISOString()
      })
    };
  }
};

// Функция анализа голосового сообщения
function analyzeVoiceMessage(voiceData) {
  const transcription = voiceData.transcription.toLowerCase();
  
  // Анализ приоритета
  let priority = 'medium';
  let urgency = 'normal';
  let sentiment = 'neutral';
  let keywords = [];

  // Определение срочности
  const urgentWords = ['срочно', 'быстро', 'сегодня', 'завтра', 'немедленно', 'критично'];
  if (urgentWords.some(word => transcription.includes(word))) {
    urgency = 'high';
    priority = 'high';
  }

  // Определение бизнес-намерений
  const businessWords = ['бюджет', 'проект', 'компания', 'бизнес', 'услуги', 'стоимость', 'цена'];
  const businessMatches = businessWords.filter(word => transcription.includes(word));
  if (businessMatches.length > 0) {
    keywords.push(...businessMatches);
    if (businessMatches.length >= 2) {
      priority = 'high';
    }
  }

  // Определение настроения
  const positiveWords = ['интересно', 'отлично', 'хорошо', 'нравится', 'впечатляет'];
  const negativeWords = ['проблема', 'плохо', 'не работает', 'жалоба'];
  
  if (positiveWords.some(word => transcription.includes(word))) {
    sentiment = 'positive';
  } else if (negativeWords.some(word => transcription.includes(word))) {
    sentiment = 'negative';
    priority = 'high'; // Жалобы требуют быстрого реагирования
  }

  // Определение готовности к покупке
  const readyToBuyWords = ['готов', 'хочу', 'нужно', 'заказать', 'купить'];
  if (readyToBuyWords.some(word => transcription.includes(word))) {
    priority = 'high';
    keywords.push('ready_to_buy');
  }

  return {
    priority,
    urgency,
    sentiment,
    keywords
  };
}

// Функция отправки уведомлений о голосовом сообщении
async function sendVoiceNotification(voiceLead) {
  // В production здесь будет:
  // - Email с аудио файлом
  // - Telegram уведомление с транскрипцией
  // - CRM создание задачи с высоким приоритетом
  
  console.log(`🔊 Voice Notification: New ${voiceLead.priority} priority voice message (${voiceLead.voice.duration}s)`);
  console.log(`📝 Transcription: "${voiceLead.voice.transcription}"`);
  console.log(`😊 Sentiment: ${voiceLead.voice.sentiment}, Urgency: ${voiceLead.voice.urgency}`);
  
  // Имитация задержки отправки
  await new Promise(resolve => setTimeout(resolve, 800));
}

// Функция генерации автоответа для голосовой формы
function generateVoiceAutoResponse(voiceData, analysis) {
  const hour = new Date().getHours();
  const isWorkingHours = hour >= 9 && hour <= 18;
  
  let expectedCallTime;
  let message;
  
  // Персонализированный ответ на основе анализа
  if (analysis.urgency === 'high') {
    expectedCallTime = isWorkingHours ? '10 минут' : 'сегодня до 20:00';
    message = `Спасибо за ваше сообщение! Мы поняли, что вопрос срочный. Наш специалист перезвонит вам по номеру ${voiceData.phone} ${isWorkingHours ? 'в течение 10 минут' : 'сегодня до 20:00'}.`;
  } else if (analysis.priority === 'high') {
    expectedCallTime = isWorkingHours ? '15 минут' : 'в течение 2 часов';
    message = `Спасибо за подробное сообщение! Наш эксперт подготовит персональные рекомендации и перезвонит вам по номеру ${voiceData.phone} ${expectedCallTime}.`;
  } else {
    expectedCallTime = isWorkingHours ? '30 минут' : 'завтра с 9:00';
    message = `Спасибо за ваше голосовое сообщение! Мы внимательно его прослушали. Наш консультант перезвонит вам по номеру ${voiceData.phone} ${expectedCallTime}.`;
  }

  // Дополнительная информация на основе настроения
  if (analysis.sentiment === 'negative') {
    message += ' Мы обязательно решим вашу проблему!';
  } else if (analysis.sentiment === 'positive') {
    message += ' Будем рады обсудить возможности сотрудничества!';
  }

  return { message, expectedCallTime };
}