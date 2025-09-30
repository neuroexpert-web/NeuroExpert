# 🔐 Настройка секретов и API ключей

## GitHub Secrets

Перейдите в Settings → Secrets and variables → Actions и добавьте:

### Обязательные:
```env
# Vercel
VERCEL_TOKEN=<получить на https://vercel.com/account/tokens>
VERCEL_ORG_ID=<из .vercel/project.json>
VERCEL_PROJECT_ID=<из .vercel/project.json>

# AI API ключи
GOOGLE_GEMINI_API_KEY=<получить на https://makersuite.google.com/app/apikey>
ANTHROPIC_API_KEY=<получить на https://console.anthropic.com/settings/keys>

# Безопасность
JWT_SECRET=<сгенерировать: openssl rand -base64 32>
ADMIN_PASSWORD_HASH=<сгенерировать: npm run generate:password>

# Telegram
TELEGRAM_BOT_TOKEN=<получить у @BotFather>
TELEGRAM_CHAT_ID=<ваш chat ID>
```

### Опциональные (для полной функциональности):
```env
# Аналитика
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_YM_COUNTER_ID=12345678
NEXT_PUBLIC_FB_PIXEL_ID=1234567890
NEXT_PUBLIC_VK_PIXEL_ID=VK-RTRG-XXXXXX

# Мониторинг
SENTRY_DSN=<получить на https://sentry.io>
SENTRY_AUTH_TOKEN=<для source maps>

# База данных (если используется)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Email (если нужна отправка)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=<app password>

# Платежи (если нужны)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# GitHub интеграции
GITHUB_APP_ID=<для автоматизации>
GITHUB_PRIVATE_KEY=<private key файл>

# Внешние сервисы
SNYK_TOKEN=<для security scanning>
PERCY_TOKEN=<для визуального тестирования>
CHROMATIC_PROJECT_TOKEN=<для UI тестирования>
```

## Vercel Environment Variables

В Vercel Dashboard → Settings → Environment Variables добавьте те же переменные.

### Разделение по окружениям:
- **Production**: основные ключи
- **Preview**: тестовые ключи
- **Development**: локальные ключи

## Локальная разработка

Создайте файл `.env.local`:
```env
# AI
GOOGLE_GEMINI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here

# Auth
JWT_SECRET=local-dev-secret
ADMIN_PASSWORD_HASH=$2a$10$...

# Analytics (optional for local)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_YM_COUNTER_ID=

# Telegram (optional for local)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

## Генерация секретов

### JWT Secret:
```bash
openssl rand -base64 32
```

### Admin Password Hash:
```bash
node scripts/generate-password-hash.js your-secure-password
```

### Database URL format:
```
postgresql://username:password@host:port/database
mysql://username:password@host:port/database
```

## Получение API ключей

### Google Gemini:
1. Перейдите на https://makersuite.google.com/app/apikey
2. Создайте новый API ключ
3. Ограничьте по IP/домену для безопасности

### Anthropic Claude:
1. Зарегистрируйтесь на https://console.anthropic.com
2. Settings → API Keys → Create Key

### Telegram Bot:
1. Напишите @BotFather в Telegram
2. `/newbot` → следуйте инструкциям
3. Получите токен
4. Для chat ID: напишите боту и используйте https://api.telegram.org/bot<TOKEN>/getUpdates

### Google Analytics:
1. https://analytics.google.com → Admin
2. Create Property → Web
3. Получите Measurement ID (G-XXXXXXXXXX)

### Яндекс.Метрика:
1. https://metrika.yandex.ru
2. Добавить счетчик
3. Получите номер счетчика

### Facebook Pixel:
1. https://business.facebook.com/events_manager
2. Connect Data Sources → Web → Get Started
3. Получите Pixel ID

### VK Pixel:
1. https://ads.vk.com → Ретаргетинг
2. Создать пиксель
3. Получите код пикселя

## Безопасность

### ⚠️ ВАЖНО:
- НИКОГДА не коммитьте секреты в репозиторий
- Используйте разные ключи для разных окружений
- Регулярно ротируйте ключи
- Ограничивайте API ключи по IP/домену
- Используйте GitHub Secret Scanning

### Проверка на утечки:
```bash
# Установите gitleaks
brew install gitleaks

# Проверьте репозиторий
gitleaks detect --source . -v
```

## Troubleshooting

### Ошибка "Missing environment variable":
1. Проверьте название переменной
2. Убедитесь, что она добавлена в нужное окружение
3. Перезапустите сервер после изменения .env.local

### API ключ не работает:
1. Проверьте срок действия
2. Проверьте ограничения (IP, домен)
3. Проверьте квоты/лимиты

### Vercel не видит переменные:
1. Проверьте окружение (Production/Preview)
2. Передеплойте после добавления переменных
3. Используйте префикс NEXT_PUBLIC_ для клиентских переменных