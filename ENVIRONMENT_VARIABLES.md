# 🔑 ПОЛНЫЙ СПИСОК ПЕРЕМЕННЫХ ОКРУЖЕНИЯ ДЛЯ NETLIFY

## ⚠️ ОБЯЗАТЕЛЬНЫЕ переменные для работы AI:

### 1. **GEMINI_API_KEY** (Критически важная!)
```
Key: GEMINI_API_KEY
Value: ВАШ_КЛЮЧ_ОТ_GOOGLE_AI_STUDIO
```
**Где взять:** [ai.google.dev](https://ai.google.dev/) → "Get API key"

---

## 🚀 РЕКОМЕНДУЕМЫЕ переменные для production:

### 2. **NODE_ENV**
```
Key: NODE_ENV  
Value: production
```
**Назначение:** Оптимизация производительности Next.js

### 3. **NEXT_PUBLIC_SITE_URL**
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://ваш-сайт.netlify.app
```
**Назначение:** Базовый URL для API calls и SEO

### 4. **NEXT_PUBLIC_GA_ID** (Google Analytics)
```
Key: NEXT_PUBLIC_GA_ID
Value: G-XXXXXXXXXX
```
**Назначение:** Отслеживание посетителей и конверсий (РЕКОМЕНДУЕТСЯ!)

### 16. **NEXT_PUBLIC_YANDEX_METRICA_ID** (Яндекс.Метрика)
```
Key: NEXT_PUBLIC_YANDEX_METRICA_ID
Value: 12345678
```
**Назначение:** Российская аналитика с Вебвизором и картами кликов

---

## 📊 ПЕРЕМЕННЫЕ ДЛЯ CRM И АНАЛИТИКИ:

### 5. **NEXT_PUBLIC_CRM_ENDPOINT**
```
Key: NEXT_PUBLIC_CRM_ENDPOINT
Value: https://your-crm-api.com/webhook
```
**Назначение:** Интеграция с внешней CRM системой

### 6. **CRM_API_KEY**
```
Key: CRM_API_KEY
Value: ваш_crm_api_ключ
```
**Назначение:** Авторизация в CRM системе

### 7. **WEBHOOK_SECRET**
```
Key: WEBHOOK_SECRET
Value: случайная_строка_32_символа
```
**Назначение:** Безопасность webhook'ов

---

## 🔒 ПЕРЕМЕННЫЕ БЕЗОПАСНОСТИ:

### 8. **ADMIN_PASSWORD_HASH**
```
Key: ADMIN_PASSWORD_HASH
Value: $2b$10$хешированный_пароль
```
**Назначение:** Безопасный хеш пароля админ-панели

### 9. **JWT_SECRET**
```
Key: JWT_SECRET
Value: супер_секретный_ключ_64_символа
```
**Назначение:** Подписание JWT токенов

---

## 📧 ПЕРЕМЕННЫЕ ДЛЯ EMAIL:

### 10. **SMTP_HOST**
```
Key: SMTP_HOST
Value: smtp.gmail.com
```

### 11. **SMTP_USER**
```
Key: SMTP_USER
Value: your-email@gmail.com
```

### 12. **SMTP_PASS**
```
Key: SMTP_PASS
Value: ваш_пароль_приложения
```

---

## 📱 ПЕРЕМЕННЫЕ ДЛЯ TELEGRAM УВЕДОМЛЕНИЙ:

### 13. **TELEGRAM_BOT_TOKEN**
```
Key: TELEGRAM_BOT_TOKEN
Value: 1234567890:AAEhBP0av18gDaXwBgKen6rG9aTzjrun4
```
**Назначение:** Токен Telegram бота для уведомлений о заявках

### 14. **TELEGRAM_CHAT_ID**
```
Key: TELEGRAM_CHAT_ID
Value: 123456789
```
**Назначение:** ID чата для отправки уведомлений

### 15. **ADMIN_PASSWORD**
```
Key: ADMIN_PASSWORD
Value: your_secure_password
```
**Назначение:** Пароль для доступа к аналитическому дашборду

---

## 🎯 МИНИМАЛЬНЫЙ НАБОР ДЛЯ ЗАПУСКА:

### Для базовой функциональности:
1. **GEMINI_API_KEY** ← ОБЯЗАТЕЛЬНО!
2. **NODE_ENV=production**
3. **NEXT_PUBLIC_SITE_URL**

### Для уведомлений в Telegram:
4. **TELEGRAM_BOT_TOKEN** ← РЕКОМЕНДУЕТСЯ!
5. **TELEGRAM_CHAT_ID** ← РЕКОМЕНДУЕТСЯ!
6. **ADMIN_PASSWORD** ← ДЛЯ БЕЗОПАСНОСТИ!

### Остальные переменные добавляйте по мере необходимости.

---

## 📝 КАК ДОБАВИТЬ В NETLIFY:

1. **Зайдите в Netlify Dashboard**
2. **Выберите ваш сайт**
3. **Site settings** → **Environment variables**
4. **Add variable** для каждой переменной
5. **Save changes**
6. **Trigger redeploy** для применения

---

## 🔍 ПРОВЕРКА ПЕРЕМЕННЫХ:

После добавления проверьте в браузере:
- Откройте **Developer Tools** (F12)
- Перейдите в **Network** tab
- Отправьте вопрос AI-помощнику
- Проверьте что запрос к `/api/assistant` проходит успешно

---

## 🚨 ЧАСТЫЕ ОШИБКИ:

### ❌ "AI не отвечает"
**Причина:** Нет GEMINI_API_KEY или неверный ключ
**Решение:** Проверьте ключ на [ai.google.dev](https://ai.google.dev/)

### ❌ "500 Internal Server Error"
**Причина:** Неправильные переменные окружения
**Решение:** Проверьте Functions logs в Netlify

### ❌ "CORS errors"
**Причина:** Неправильный NEXT_PUBLIC_SITE_URL
**Решение:** Укажите точный URL вашего сайта

---

## 🎉 РЕЗУЛЬТАТ:

С правильными переменными окружения вы получите:
- ✅ Работающий AI-помощник
- ✅ CRM интеграцию 
- ✅ Email уведомления
- ✅ Безопасную админ-панель
- ✅ Аналитику пользователей

**Начните с GEMINI_API_KEY - это самое важное!** 🔑
