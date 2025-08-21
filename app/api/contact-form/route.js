import { NextResponse } from 'next/server';
import { apiRateLimit } from '@/app/middleware/rateLimit';

async function handler(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const { name, email, phone, message, company } = data;
    
    // Для оптимизированной формы требуются только имя и телефон
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Пожалуйста, укажите имя и телефон' },
        { status: 400 }
      );
    }
    
    // Email validation (optional now)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Пожалуйста, введите корректный email' },
          { status: 400 }
        );
      }
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
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        // Логирование для отладки
        console.log('Attempting to send Telegram notification:', {
          hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
          tokenLength: process.env.TELEGRAM_BOT_TOKEN?.length,
          chatId: process.env.TELEGRAM_CHAT_ID,
          chatIdType: typeof process.env.TELEGRAM_CHAT_ID
        });
        
        const telegramMessage = `
🔔 Новая заявка с сайта NeuroExpert

👤 Имя: ${name}
📱 Телефон: ${phone}
${email ? `📧 Email: ${email}` : ''}
${company ? `🏢 Компания: ${company}` : ''}
${message ? `💬 Сообщение: ${message}` : ''}
🕐 Время: ${new Date().toLocaleString('ru-RU')}

⚡ Перезвоните в течение 5 минут!
        `;
        
        const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        console.log('Telegram URL:', telegramUrl.replace(process.env.TELEGRAM_BOT_TOKEN, 'TOKEN_HIDDEN'));
        
        const response = await fetch(
          telegramUrl,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: telegramMessage
            })
          }
        );
        
        const responseData = await response.json();
        
        if (!response.ok || !responseData.ok) {
          console.error('Failed to send Telegram notification:', {
            status: response.status,
            statusText: response.statusText,
            error: responseData
          });
        } else {
          console.log('Telegram notification sent successfully:', {
            messageId: responseData.result?.message_id,
            chatId: responseData.result?.chat?.id
          });
        }
      } catch (error) {
        console.error('Telegram notification error:', error);
        // Don't fail the request if Telegram fails
      }
    } else {
      console.warn('Telegram notifications not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.');
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

// Export the POST handler
export async function POST(request) {
  // Temporarily disabled rate limiting for deployment
  // TODO: Fix rate limiter return type
  return handler(request);
}