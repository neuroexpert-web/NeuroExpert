# 🔍 Проверка работы сайта

## Скажите мне ваш домен на Vercel!

Например:
- `neuroexpert.vercel.app`
- `my-project-name.vercel.app`
- или ваш кастомный домен

## Как только вы скажете домен, откройте эти ссылки:

### 1. Тестовая страница диагностики:
```
https://ВАШ-ДОМЕН/test.html
```

### 2. API диагностика:
```
https://ВАШ-ДОМЕН/api/debug
```

### 3. Проверка AI:
```
https://ВАШ-ДОМЕН/api/assistant/test
```

### 4. Проверка Telegram:
```
https://ВАШ-ДОМЕН/api/telegram/test
```

## Или проверьте через консоль браузера (F12):

```javascript
// Тест AI
fetch('/api/assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    question: 'Привет!',
    model: 'gemini'
  })
})
.then(res => res.json())
.then(data => console.log('AI Response:', data))
.catch(err => console.error('Error:', err));

// Тест Telegram
fetch('/api/contact-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Тест',
    email: 'test@test.com',
    phone: '+79991234567',
    message: 'Тестовое сообщение'
  })
})
.then(res => res.json())
.then(data => console.log('Form Response:', data))
.catch(err => console.error('Error:', err));
```

## Проверьте в Vercel Dashboard:

1. **Откройте ваш проект**
2. **Settings → Environment Variables**
3. **Проверьте что есть:**
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. **Functions → Logs** - посмотрите логи ошибок

Скажите мне ваш домен и я дам точные ссылки!