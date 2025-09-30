# 🚀 PRODUCTION SETUP GUIDE - NEUROEXPERT

## 📋 КРАТКОЕ РУКОВОДСТВО ПО ЗАПУСКУ

Этот документ содержит **безопасные инструкции** для настройки NeuroExpert в production без примеров реальных ключей.

---

## 🚨 КРИТИЧЕСКИ ВАЖНЫЕ ПЕРЕМЕННЫЕ

### 1. AI СЕРВИСЫ (ОБЯЗАТЕЛЬНО)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
**Где получить**: [Google AI Studio](https://ai.google.dev/)  
**Лимиты**: 15 запросов/минуту (бесплатно)  
**Критичность**: 🔴 МАКСИМАЛЬНАЯ

### 2. БЕЗОПАСНОСТЬ (ОБЯЗАТЕЛЬНО)
```env
JWT_SECRET=your_64_character_random_string
ADMIN_PASSWORD_HASH=your_bcrypt_hash_here
```

**Генерация**:
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Пароль админа
npm run generate:password -- YourPassword123
```

---

## 📱 TELEGRAM ИНТЕГРАЦИЯ

### Создание бота:
1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Команда: `/newbot`
3. Назовите: `NeuroExpert Notifications`
4. Username: `neuroexpert_notifications_bot`
5. Сохраните токен

### Получение Chat ID:
1. Отправьте сообщение боту
2. Перейдите: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Найдите `"chat":{"id":123456789}`

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

---

## 📊 АНАЛИТИКА

### Google Analytics:
1. Создайте ресурс в [Google Analytics](https://analytics.google.com/)
2. Получите Measurement ID

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Яндекс.Метрика:
1. Добавьте сайт в [Метрике](https://metrica.yandex.ru/)
2. Получите ID счетчика

```env
NEXT_PUBLIC_YANDEX_METRICA_ID=12345678
```

---

## 📧 EMAIL НАСТРОЙКИ

### Gmail SMTP:
1. Включите 2FA в Google
2. Создайте пароль приложения
3. Используйте в настройках

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🗄️ БАЗЫ ДАННЫХ (ОПЦИОНАЛЬНО)

### PostgreSQL:
**Рекомендуемые провайдеры**:
- Supabase: Бесплатно до 500MB
- Neon: Бесплатно до 3GB  
- Railway: $5/месяц

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
```

---

## 🔗 CRM ИНТЕГРАЦИИ (ОПЦИОНАЛЬНО)

### Битрикс24:
1. Создайте входящий webhook
2. Получите URL вида: `https://portal.bitrix24.ru/rest/user_id/webhook_key/`

### amoCRM:
1. Создайте интеграцию в настройках
2. Получите Client ID и Secret

### HubSpot:
1. Создайте Private App
2. Получите API токен

---

## 💰 ПЛАТЕЖНЫЕ СИСТЕМЫ (ОПЦИОНАЛЬНО)

### ЮKassa:
1. Регистрация в Яндекс.Кассе
2. Получение Shop ID и Secret Key

### Stripe:
1. Регистрация в Stripe
2. Получение Publishable и Secret ключей

### Тинькофф:
1. Подключение эквайринга
2. Получение Terminal Key и Secret

---

## 🛡️ МОНИТОРИНГ

### Sentry (Рекомендуется):
1. Создайте проект в [Sentry.io](https://sentry.io/)
2. Получите DSN ключ

```env
SENTRY_DSN=https://public_key@sentry.io/project_id
```

---

## 🎯 МИНИМАЛЬНЫЙ НАБОР ДЛЯ ЗАПУСКА

### MVP конфигурация:
```env
# Только эти 3 переменные для базовой работы
GEMINI_API_KEY=your_key
JWT_SECRET=your_secret  
ADMIN_PASSWORD_HASH=your_hash
```

### Расширенная конфигурация:
```env
# MVP +
NEXT_PUBLIC_GA_ID=your_ga_id
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
SMTP_USER=your_email
SMTP_PASS=your_password
```

---

## 🔧 ПРОВЕРКА НАСТРОЕК

### Тестирование конфигурации:
```bash
# Health check
curl localhost:3000/api/health?detailed=true

# Debug переменных
curl localhost:3000/api/debug-env

# Тест Telegram
curl -X POST localhost:3000/api/telegram-test
```

---

## 💰 ПРИБЛИЗИТЕЛЬНЫЕ ЗАТРАТЫ

### Минимальный план (~$15-30/месяц):
- Vercel Pro: $20
- Gemini API: $5-10
- Gmail SMTP: Бесплатно

### Стандартный план (~$50-100/месяц):
- Хостинг: $20-40
- AI API: $10-30  
- База данных: $15-25
- Email сервис: $10-20

---

## 🚀 БЫСТРЫЙ СТАРТ

1. **Скопируйте** `.env.production.safe` в `.env.local`
2. **Замените** `your_*` на реальные значения
3. **Никогда не коммитьте** `.env.local` в Git!
4. **Проверьте** работоспособность через `/api/health`

---

## 📞 ПОДДЕРЖКА

**Если что-то не работает**:
1. AI не отвечает → Проверьте GEMINI_API_KEY
2. Админка не открывается → Проверьте ADMIN_PASSWORD_HASH
3. Нет уведомлений → Проверьте Telegram токены
4. Формы не отправляются → Проверьте SMTP настройки

---

**🎯 PLATFORM READY FOR PRODUCTION!**

*Руководство подготовлено главным разработчиком Claude*  
*NeuroExpert Development Team*  
*Январь 2025*