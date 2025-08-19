# 🔧 Интеграция Telegram с формой обратной связи

## Текущее состояние:

✅ **Что уже готово:**
- Serverless функция `telegram-notify.js` для отправки уведомлений
- Обработчик формы `contact-form.js` 
- Переменные окружения добавлены (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)

❌ **Что НЕ работает:**
- Форма НЕ отправляет уведомления в Telegram
- Нет связи между `contact-form.js` и `telegram-notify.js`

## Решение:

### Вариант 1: Добавить вызов Telegram в contact-form.js

В файле `/netlify/functions/contact-form.js` после строки 99 добавить:

```javascript
// Отправка уведомления в Telegram
try {
  const telegramResponse = await fetch(`${process.env.URL}/.netlify/functions/telegram-notify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'contact_form',
      data: {
        name,
        phone: formattedPhone,
        email,
        company,
        message
      }
    })
  });
  
  const telegramResult = await telegramResponse.json();
  console.log('Telegram notification:', telegramResult);
} catch (telegramError) {
  console.error('Failed to send Telegram notification:', telegramError);
  // Не прерываем основной процесс, если Telegram не работает
}
```

### Вариант 2: Прямая отправка из contact-form.js

Добавить в начало `contact-form.js`:

```javascript
const sendTelegramNotification = async (data) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) return;
  
  const message = `📨 *Новая заявка с сайта*\n\n` +
    `👤 *Имя:* ${data.name}\n` +
    `📱 *Телефон:* ${data.phone}\n` +
    `📧 *Email:* ${data.email || 'Не указан'}\n` +
    `🏢 *Компания:* ${data.company || 'Не указана'}\n` +
    `💬 *Сообщение:* ${data.message || 'Без сообщения'}\n\n` +
    `📅 _${new Date().toLocaleString('ru-RU')}_`;
  
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (error) {
    console.error('Telegram send error:', error);
  }
};
```

И вызвать после валидации:
```javascript
await sendTelegramNotification(lead);
```

## Проверка работы:

1. **Убедитесь, что переменные окружения добавлены в Netlify:**
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

2. **Проверьте форматы:**
   - Token: `1234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`
   - Chat ID: `123456789` (положительное число для личных чатов)

3. **Тестовая отправка через API:**
```bash
curl -X POST "https://ваш-сайт.netlify.app/.netlify/functions/telegram-notify" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "contact_form",
    "data": {
      "name": "Тест",
      "phone": "+7 999 123-45-67",
      "email": "test@test.com",
      "message": "Тестовое сообщение"
    }
  }'
```

## Отладка:

Если не работает, проверьте:
1. Netlify Functions → Logs → contact-form
2. Ищите ошибки типа "Telegram credentials not configured"
3. Проверьте, что бот активен (напишите ему /start)

## Безопасность:

- Токен бота НИКОГДА не должен быть в коде
- Используйте только переменные окружения
- Не логируйте токен в консоль