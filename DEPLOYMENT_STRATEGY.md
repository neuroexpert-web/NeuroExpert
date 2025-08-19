# 🚀 Стратегия развертывания NeuroExpert

## Основная платформа: Vercel

### Почему Vercel?
- **Оптимизирована для Next.js** - создатели Next.js
- **Автоматическая оптимизация** производительности
- **Edge Functions** для минимальной задержки
- **Превосходная интеграция** с GitHub
- **Бесплатный план** подходит для старта

### Быстрое развертывание на Vercel

1. **Через GitHub интеграцию:**
   ```bash
   # Убедитесь, что код в main ветке
   git push origin main
   ```
   
2. **Через Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

3. **Необходимые переменные окружения:**
   - `GOOGLE_GEMINI_API_KEY` - ключ для AI функций
   - `JWT_SECRET` - секрет для токенов авторизации
   - `TELEGRAM_BOT_TOKEN` - токен Telegram бота (опционально)
   - `TELEGRAM_CHAT_ID` - ID чата для уведомлений (опционально)

### Альтернативные платформы

Конфигурации для других платформ сохранены для гибкости:

- **Netlify** (`netlify.toml`) - хорошая альтернатива с serverless функциями
- **Render** (`render.yaml`) - для контейнерного деплоя
- **Railway** - быстрый деплой одной кнопкой
- **Docker** (`docker-compose.yml`) - для self-hosted решений

### Рекомендации

1. **Production**: Используйте Vercel
2. **Staging/Preview**: Автоматические preview deployments в Vercel
3. **Development**: Локальная разработка с `npm run dev`
4. **Self-hosted**: Docker compose для полного контроля

### Мониторинг

- Vercel Analytics для отслеживания производительности
- Vercel Logs для отладки
- Опционально: Sentry для отслеживания ошибок

---

*Последнее обновление: ${new Date().toISOString().split('T')[0]}*