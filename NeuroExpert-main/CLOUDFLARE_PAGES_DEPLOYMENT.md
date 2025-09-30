# Развертывание NeuroExpert на Cloudflare Pages

## Пошаговая инструкция

### 1. Подключение репозитория GitHub

1. Войдите в Cloudflare Dashboard: https://dash.cloudflare.com/
2. Выберите "Workers & Pages" в левом меню
3. Нажмите "Create" → "Pages" → "Connect to Git"
4. Авторизуйте GitHub и выберите репозиторий `neuroexpert`

### 2. Настройка конфигурации сборки

При настройке проекта укажите следующие параметры:

**Build settings:**
- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`

### 3. Переменные окружения (Environment Variables)

Добавьте все необходимые переменные окружения:

```
GOOGLE_GEMINI_API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
ADMIN_PASSWORD_HASH=your_admin_password_hash_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
NODE_VERSION=20
```

### 4. Настройки для Next.js на Cloudflare Pages

Cloudflare Pages автоматически определяет Next.js проект и использует `@cloudflare/next-on-pages` для правильной сборки.

### 5. Дополнительные настройки (Advanced)

**Compatibility date**: `2024-01-01`
**Node.js version**: `20.x`

### 6. Запуск развертывания

1. Нажмите "Save and Deploy"
2. Дождитесь завершения первого деплоя
3. После успешного деплоя вы получите URL вида: `https://neuroexpert.pages.dev`

### 7. Настройка кастомного домена (опционально)

1. Перейдите в настройки проекта
2. Выберите "Custom domains"
3. Добавьте ваш домен
4. Следуйте инструкциям по настройке DNS

## Автоматические деплои

После настройки каждый push в main ветку будет автоматически запускать новое развертывание.

## Проверка статуса

Вы можете проверить статус деплоя в разделе "Deployments" вашего проекта в Cloudflare Dashboard.

## Отладка

Если возникают проблемы:
1. Проверьте логи сборки в Cloudflare Dashboard
2. Убедитесь, что все переменные окружения установлены
3. Проверьте совместимость с Cloudflare Pages: https://developers.cloudflare.com/pages/framework-guides/nextjs/

## API Token (для CI/CD)

Если вам нужен API токен для автоматизации:
1. Перейдите в "My Profile" → "API Tokens"
2. Создайте токен с правами "Cloudflare Pages:Edit"
3. Сохраните токен в безопасном месте