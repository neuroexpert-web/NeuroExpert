# Cloudflare Pages Build Settings

## Основные настройки сборки

### Framework preset
`Next.js (Static HTML Export)`

### Build command
```
npm run build
```
Или оставьте пустым - Cloudflare автоматически определит команду для Next.js

### Build output directory
```
.next
```

### Root directory (optional)
```
/
```
Оставьте пустым, если проект в корне репозитория

## Deploy commands

### Production branch deploy command
Оставьте пустым - будет использоваться Build command

### Non-production branch deploy command  
Оставьте пустым - будет использоваться Build command

## Environment variables
```
NODE_VERSION=20
GOOGLE_GEMINI_API_KEY=your_key_here
JWT_SECRET=your_secret_here
ADMIN_PASSWORD_HASH=your_hash_here
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Advanced settings

### Node.js version
`20.x`

### NPM version
`10.x` (или оставьте auto)

### Build caching
`Enabled` (рекомендуется)

## Важные моменты:

1. **НЕ используйте** `npm run build:standalone` - это для других платформ
2. **НЕ указывайте** `out` как output directory - это для static export
3. **Убедитесь**, что выбран preset `Next.js`
4. **Deploy command оставляйте пустым** - Cloudflare сам определит

## Проверка после деплоя

После успешного деплоя проверьте:
1. Главная страница загружается
2. API endpoints работают (`/api/health`)
3. Стили применяются корректно
4. AI дуправляющий открывается