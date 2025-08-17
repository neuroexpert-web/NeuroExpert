# 🤖 Проверка работы AI ассистента

## Способы проверки:

### 1. Через браузер - Диагностика API
Откройте в браузере:
```
https://ваш-домен.vercel.app/api/assistant/test
```

Вы должны увидеть JSON с информацией:
- ✅ `hasGeminiKey: true` 
- ✅ `geminiKeyLength: 39`
- ✅ `geminiTest.success: true`

### 2. Через сайт - AI чат
1. Откройте ваш сайт
2. Нажмите на фиолетовую кнопку AI справа внизу
3. Напишите любой вопрос
4. AI должен ответить

### 3. Через консоль браузера (F12)
```javascript
// Проверка переменных
console.log('Gemini API configured:', !!process.env.NEXT_PUBLIC_GA_ID);

// Тестовый запрос к AI
fetch('/api/assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    question: 'Привет! Расскажи о себе.',
    model: 'gemini'
  })
})
.then(res => res.json())
.then(data => console.log('AI Response:', data));
```

### 4. Проверка в Network (F12)
1. Откройте DevTools → Network
2. Отправьте сообщение в AI чат
3. Найдите запрос к `/api/assistant`
4. Response должен содержать `answer` с текстом

## Если AI работает, вы увидите:
- ✅ Ответы на вопросы в чате
- ✅ Модель отображается (Gemini/Claude)
- ✅ Время ответа показывается
- ✅ Follow-up вопросы предлагаются

## Если есть проблемы:
1. Проверьте `/api/assistant/test` для диагностики
2. Убедитесь что переменные сохранены в Vercel
3. Сделайте redeploy если нужно
4. Проверьте логи в Vercel Dashboard → Functions

## Переменные должны быть:
- `GEMINI_API_KEY` - ключ от Google AI Studio
- `TELEGRAM_BOT_TOKEN` - токен бота (опционально)
- `TELEGRAM_CHAT_ID` - ID чата (опционально)