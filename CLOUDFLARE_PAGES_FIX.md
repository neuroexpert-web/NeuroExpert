# Исправление ошибки "корневой каталог не найден" в Cloudflare Pages

## Причины ошибки

1. Неправильные настройки Root directory
2. Проблемы с доступом к репозиторию
3. Неверная конфигурация сборки

## Решение

### Вариант 1: Использование веб-интерфейса

1. **Перейдите в настройки проекта** в Cloudflare Pages
2. **Build configurations** → **Build settings**
3. Установите следующие параметры:
   - **Framework preset:** `Next.js`
   - **Build command:** `npm run build` или `sh build-cloudflare.sh`
   - **Build output directory:** `.next`
   - **Root directory:** оставьте пустым или укажите `/`

### Вариант 2: Переподключение репозитория

1. Удалите текущий проект в Cloudflare Pages
2. Создайте новый проект
3. При подключении репозитория:
   - Убедитесь, что выбран правильный репозиторий `aineuroexpert-cell/AI-Audit`
   - Проверьте, что у Cloudflare есть доступ ко всем веткам
   - Выберите ветку `main`

### Вариант 3: Использование Cloudflare API

```bash
# Установите Wrangler глобально
npm install -g wrangler

# Авторизуйтесь
wrangler login

# Создайте проект Pages
wrangler pages project create neuroexpert

# Разверните проект
wrangler pages deploy .next --project-name=neuroexpert
```

## Проверочный чек-лист

- [ ] Репозиторий публичный или Cloudflare имеет доступ
- [ ] В корне репозитория есть `package.json`
- [ ] Root directory оставлен пустым или `/`
- [ ] Framework preset установлен как `Next.js`
- [ ] Build command: `npm run build`
- [ ] Build output directory: `.next`

## Альтернативные команды сборки

Если стандартная команда не работает, попробуйте:

1. `sh build-cloudflare.sh`
2. `npm ci && npm run build`
3. `npm install --production=false && npm run build`

## Environment переменные

Убедитесь, что добавлены все необходимые переменные:

```
NODE_VERSION=20
GOOGLE_GEMINI_API_KEY=your_key
JWT_SECRET=your_secret
ADMIN_PASSWORD_HASH=your_hash
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Если ничего не помогает

1. Попробуйте развернуть через GitHub Actions
2. Используйте Vercel или Netlify
3. Обратитесь в поддержку Cloudflare с логами ошибки