# 🚀 Netlify Quick Reference - Быстрая шпаргалка

## 📋 Build Settings (копируйте как есть)

```
Branch to deploy:        main
Base directory:          
Build command:           npm run build
Publish directory:       .next
Functions directory:     netlify/functions
```

## 🔐 Environment Variables (точные названия)

### ОБЯЗАТЕЛЬНЫЕ:

```
GOOGLE_GEMINI_API_KEY
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

### ОПЦИОНАЛЬНЫЕ:

```
ANTHROPIC_API_KEY
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_YM_ID
```

## 📝 Пример заполнения переменных

```env
# Google Gemini (ОБЯЗАТЕЛЬНО)
GOOGLE_GEMINI_API_KEY=AIzaSyD-abcdefghijklmnopqrstuvwxyz123456

# Telegram уведомления (ОБЯЗАТЕЛЬНО)
TELEGRAM_BOT_TOKEN=1234567890:AAEhBP0av18gDaXwBgKen6rG9aTzjrun4
TELEGRAM_CHAT_ID=123456789

# Claude AI (опционально)
ANTHROPIC_API_KEY=sk-ant-api03-abcdefghijklmnopqrstuvwxyz

# Аналитика (опционально)
NEXT_PUBLIC_GA_ID=G-ABC123XYZ9
NEXT_PUBLIC_YM_ID=12345678
```

## 🔗 Где получить ключи

1. **Google Gemini API:**
   - https://aistudio.google.com/apikey
   - Кнопка "Create API Key"

2. **Telegram Bot:**
   - Telegram → @BotFather
   - Команда: /newbot

3. **Telegram Chat ID:**
   - Отправьте сообщение боту
   - Откройте: https://api.telegram.org/bot{TOKEN}/getUpdates
   - Найдите: "chat":{"id":XXXXXXXXX}

4. **Claude AI:**
   - https://console.anthropic.com
   - Account Settings → API Keys

5. **Google Analytics:**
   - https://analytics.google.com
   - Админ → Создать ресурс → Measurement ID

6. **Яндекс.Метрика:**
   - https://metrika.yandex.ru
   - Добавить счетчик → Номер счетчика

## ⚡ Быстрая проверка после деплоя

1. Откройте сайт: https://ваш-сайт.netlify.app
2. Откройте консоль браузера (F12)
3. Проверьте вкладку Network на ошибки
4. Попробуйте:
   - [ ] Открыть AI чат
   - [ ] Отправить контактную форму
   - [ ] Проверить мобильную версию

## 🔴 Если что-то не работает

1. **AI чат не отвечает:**
   - Проверьте GOOGLE_GEMINI_API_KEY

2. **Telegram уведомления не приходят:**
   - Проверьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
   - Убедитесь что отправили /start боту

3. **Сборка падает:**
   - Проверьте логи в Netlify
   - Убедитесь что выбрана правильная ветка

---

💡 Сохраните эту шпаргалку для быстрого доступа!