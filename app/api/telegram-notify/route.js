import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Telegram API error:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();
    
    let message = '';
    
    switch (type) {
      case 'roi_calculation':
        message = `🧮 *Новый расчет ROI*\n\n` +
          `💰 Доход: ${data.revenue.toLocaleString('ru-RU')}₽\n` +
          `📊 Затраты: ${data.costs.toLocaleString('ru-RU')}₽\n` +
          `📈 ROI: ${data.roi}%\n` +
          `⏱ Время: ${data.timestamp}`;
        break;
        
      case 'contact_form':
        message = `📬 *Новая заявка*\n\n` +
          `👤 Имя: ${data.name}\n` +
          `📞 Телефон: ${data.phone || 'Не указан'}\n` +
          `📧 Email: ${data.email || 'Не указан'}\n` +
          `💬 Сообщение: ${data.message || 'Нет сообщения'}\n` +
          `⏱ Время: ${data.timestamp}`;
        break;
        
      case 'ai_chat':
        message = `🤖 *AI чат активность*\n\n` +
          `❓ Вопрос: ${data.question}\n` +
          `💡 Ответ: ${data.answer}\n` +
          `🎯 Модель: ${data.model}\n` +
          `⏱ Время: ${data.timestamp}`;
        break;
        
      default:
        message = `📢 *Уведомление*\n\n${JSON.stringify(data, null, 2)}`;
    }
    
    const success = await sendTelegramMessage(message);
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Telegram notify API error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}