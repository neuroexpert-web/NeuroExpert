import { NextResponse } from 'next/server';
import { rateLimitMiddleware } from '../../middleware/rateLimit';

async function contactFormHandler(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const { name, email, phone, message } = data;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Пожалуйста, введите корректный email' },
        { status: 400 }
      );
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone) || phone.length < 10) {
        return NextResponse.json(
          { error: 'Пожалуйста, введите корректный номер телефона' },
          { status: 400 }
        );
      }
    }
    
    // Log the submission (in production, save to database)
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    });
    
    // Log submission for debugging
    console.log('New contact form submission:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString(),
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChatId: !!process.env.TELEGRAM_CHAT_ID
    });
    
    // Send notification to Telegram if configured
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    console.log('Telegram config check:', {
      hasToken: !!TELEGRAM_BOT_TOKEN,
      tokenLength: TELEGRAM_BOT_TOKEN ? TELEGRAM_BOT_TOKEN.length : 0,
      hasChatId: !!TELEGRAM_CHAT_ID,
      chatIdValue: TELEGRAM_CHAT_ID || 'not set'
    });
    
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const telegramMessage = `🔔 <b>Новая заявка с сайта NeuroExpert</b>

👤 <b>Имя:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Телефон:</b> ${phone || 'Не указан'}
💬 <b>Сообщение:</b> ${message}
🕐 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;
        
        console.log('Sending Telegram message to chat:', TELEGRAM_CHAT_ID);
        
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const telegramBody = {
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML'
        };
        
        console.log('Telegram request URL:', telegramUrl.replace(TELEGRAM_BOT_TOKEN, 'TOKEN_HIDDEN'));
        console.log('Telegram request body:', telegramBody);
        
        const response = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(telegramBody)
        });
        
        const responseData = await response.json();
        console.log('Telegram API response:', responseData);
        
        if (!response.ok || !responseData.ok) {
          console.error('Failed to send Telegram notification:', {
            status: response.status,
            error: responseData.description || 'Unknown error',
            errorCode: responseData.error_code
          });
        } else {
          console.log('✅ Telegram notification sent successfully!', {
            messageId: responseData.result?.message_id,
            chatId: responseData.result?.chat?.id
          });
        }
      } catch (error) {
        console.error('Telegram notification error:', {
          message: error.message,
          stack: error.stack
        });
        // Don't fail the request if Telegram fails
      }
    } else {
      console.warn('⚠️ Telegram notifications not configured!');
      console.warn('Missing:', {
        token: !TELEGRAM_BOT_TOKEN ? 'TELEGRAM_BOT_TOKEN' : null,
        chatId: !TELEGRAM_CHAT_ID ? 'TELEGRAM_CHAT_ID' : null
      });
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке формы' },
      { status: 500 }
    );
  }
}

// Export with rate limiting
export async function POST(request) {
  const rateLimitCheck = await rateLimitMiddleware('/api/contact-form')(request);
  
  if (rateLimitCheck instanceof Response) {
    // Rate limit exceeded
    return rateLimitCheck;
  }
  
  // Process request with rate limit headers
  const response = await contactFormHandler(request);
  
  // Add rate limit headers to response
  Object.entries(rateLimitCheck.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}