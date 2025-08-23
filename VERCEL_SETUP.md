# 🚀 Настройка Vercel для NeuroExpert

## Переменные окружения

Добавьте эти переменные в настройках проекта Vercel:

### Обязательные переменные:

```bash
# Google AI (для чата)
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key

# Безопасность админ-панели
JWT_SECRET=your-secret-key-min-32-chars
ADMIN_PASSWORD_HASH=$2a$10$xxxxx
```

### Опциональные переменные:

```bash
# Аналитика
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_YM_ID=12345678

# Telegram уведомления
TELEGRAM_BOT_TOKEN=bot-token
TELEGRAM_CHAT_ID=chat-id

# Sentry (мониторинг ошибок)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## Как добавить переменные в Vercel:

1. Откройте проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в Settings → Environment Variables
3. Добавьте переменные для Production environment
4. Нажмите Save

## Функции по переменным:

| Функция | Требуемые переменные | Статус |
|---------|---------------------|---------|
| AI Чат | `GOOGLE_GENERATIVE_AI_API_KEY` | Обязательно |
| Админ панель | `JWT_SECRET`, `ADMIN_PASSWORD_HASH` | Обязательно |
| Google Analytics | `NEXT_PUBLIC_GA_ID` | Опционально |
| Яндекс.Метрика | `NEXT_PUBLIC_YM_ID` | Опционально |
| Telegram уведомления | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Опционально |
| Sentry | `NEXT_PUBLIC_SENTRY_DSN` | Опционально |

## Генерация паролей:

```bash
# Сгенерировать хеш пароля для админки
npm run generate:password
```

## Проверка деплоя:

После успешного деплоя проверьте:

1. **Главная страница** - должна загрузиться
2. **Свайпы** - работают между разделами
3. **ROI калькулятор** - считает и генерирует PDF
4. **AI чат** - отвечает (если есть API ключ)
5. **Админ панель** - `/admin` (если настроены переменные)

## Домены:

- Production: https://neuro-expertt.vercel.app/
- Preview: https://neuro-expertt-[hash].vercel.app/

## Troubleshooting:

### Ошибка сборки
- Проверьте логи в Vercel
- Убедитесь что все зависимости в package.json

### AI чат не работает
- Добавьте `GOOGLE_GENERATIVE_AI_API_KEY`

### Админ панель недоступна
- Добавьте `JWT_SECRET` и `ADMIN_PASSWORD_HASH`

### Аналитика не работает
- Добавьте соответствующие `NEXT_PUBLIC_` переменные