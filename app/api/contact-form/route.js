import { NextResponse } from 'next/server';
import { withRateLimit } from '../../middleware/rateLimit';

async function handler(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const { name, email, phone, message } = data;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }
    
    // Basic length constraints (non-blocking unless extreme)
    const MAX_NAME = 200;
    const MAX_EMAIL = 320;
    const MAX_PHONE = 50;
    const MAX_MESSAGE = 5000;
    if (name.length > MAX_NAME || email.length > MAX_EMAIL || (phone && phone.length > MAX_PHONE) || message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: 'Слишком длинные данные формы' },
        { status: 413, headers: { 'Cache-Control': 'no-store' } }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Пожалуйста, введите корректный email' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone) || phone.length < 10) {
        return NextResponse.json(
          { error: 'Пожалуйста, введите корректный номер телефона' },
          { status: 400, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }
    
    // Log the submission (avoid sensitive logs in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Contact form submission:', {
        name,
        email,
        phone,
        message,
        timestamp: new Date().toISOString()
      });
      
      console.log('New contact form submission:', {
        name,
        email,
        phone,
        message,
        timestamp: new Date().toISOString(),
        hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
        hasChatId: !!process.env.TELEGRAM_CHAT_ID
      });
    }
    
    // Send notification to Telegram if configured
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const telegramMessage = `
🔔 Новая заявка с сайта NeuroExpert

👤 Имя: ${name}
📧 Email: ${email}
📱 Телефон: ${phone || 'Не указан'}
💬 Сообщение: ${message}
🕐 Время: ${new Date().toLocaleString('ru-RU')}
        `;
        
        const response = await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: telegramMessage,
              parse_mode: 'HTML'
            })
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to send Telegram notification:', errorText);
        } else {
          console.log('Telegram notification sent successfully');
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
    }, { headers: { 'Cache-Control': 'no-store' } });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке формы' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

// Export with rate limiting
export const POST = withRateLimit(handler, 'contact');