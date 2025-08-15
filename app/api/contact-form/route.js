import { NextResponse } from 'next/server';

async function sendTelegramNotification(formData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://neuroexpert.onrender.com'}/api/telegram-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact_form',
        data: {
          ...formData,
          timestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
        }
      })
    });
    
    if (!response.ok) {
      console.error('Failed to send Telegram notification');
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.name || (!formData.email && !formData.phone)) {
      return NextResponse.json(
        { error: 'Имя и контактные данные обязательны' },
        { status: 400 }
      );
    }
    
    // Send Telegram notification
    await sendTelegramNotification(formData);
    
    // Here you could also:
    // - Save to database
    // - Send email notification
    // - Integrate with CRM
    
    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена'
    });
    
  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { error: 'Ошибка при отправке заявки' },
      { status: 500 }
    );
  }
}