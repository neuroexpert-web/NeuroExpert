# 🔑 ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ ДЛЯ NEUROEXPERT

## 📋 ОБЯЗАТЕЛЬНЫЕ КЛЮЧИ

### 🤖 AI ИНТЕГРАЦИЯ
```env
# Gemini AI (Google) - ОСНОВНОЙ AI управляющий
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GOOGLE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Anthropic Claude (опционально)
ANTHROPIC_API_KEY=YOUR_CLAUDE_API_KEY_HERE

# OpenAI (если планируете использовать)
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
```

### 🔒 БЕЗОПАСНОСТЬ
```env
# JWT для авторизации (64+ символов)
JWT_SECRET=YOUR_SECURE_64_CHAR_JWT_SECRET_HERE

# Админ пароль (bcrypt hash)
ADMIN_PASSWORD_HASH=YOUR_BCRYPT_HASH_HERE

# Секретный ключ приложения
APP_SECRET=YOUR_APP_SECRET_KEY_HERE
```

### 🌐 КОНФИГУРАЦИЯ
```env
# URL приложения
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 📞 TELEGRAM ИНТЕГРАЦИЯ
```env
# Telegram бот для уведомлений
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE
```

### 📊 АНАЛИТИКА
```env
# Google Analytics 4
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Yandex Metrica
NEXT_PUBLIC_YANDEX_METRICA_ID=12345678

# Sentry для мониторинга
SENTRY_DSN=YOUR_SENTRY_DSN_HERE
```

## 🚀 КАК НАСТРОИТЬ В VERCEL

1. Зайти в **Project Settings**
2. Открыть **Environment Variables**
3. Добавить каждую переменную
4. Сделать **Redeploy**

## 💡 МИНИМУМ ДЛЯ РАБОТЫ

Обязательно нужны только:
- `GEMINI_API_KEY`
- `JWT_SECRET`

Остальные ключи добавляются по необходимости.

---

**🎛️ Для Визуальной Студии все готово!**