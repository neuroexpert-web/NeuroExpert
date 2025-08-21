# 🔧 Исправление проблем сборки на Vercel

## Исправленные проблемы:

### 1. ✅ Ошибка Husky
**Проблема:** `sh: line 1: husky: command not found`
**Решение:** Обновлен скрипт `prepare` для пропуска Husky в production окружении

### 2. ✅ Ошибки Sentry API
**Проблема:** `'startTransaction' is not exported from '@sentry/nextjs'`
**Решение:** Обновлены методы для совместимости с Sentry v8:
- `startTransaction` → `startSpan`
- `new Sentry.Replay` → `Sentry.replayIntegration`

### 3. ✅ ESLint в production
**Проблема:** `ESLint must be installed in order to run during builds`
**Решение:** Отключена проверка ESLint на Vercel через `ignoreDuringBuilds: process.env.VERCEL`

## Изменения в коде:

### `/app/utils/sentry.js`
- Заменены устаревшие методы API
- Использование `startSpan` вместо `startTransaction`
- Обновлен формат `setStatus`

### `/sentry.client.config.ts`
- `new Sentry.Replay()` → `Sentry.replayIntegration()`

### `/next.config.js`
- Условное отключение ESLint для Vercel

### `/package.json`
- Обновлен скрипт `prepare` для пропуска Husky

## Дополнительные рекомендации:

1. **Переменные окружения на Vercel:**
   ```
   NEXT_PUBLIC_SENTRY_DSN=ваш_dsn
   SENTRY_ORG=ваша_организация
   SENTRY_PROJECT=ваш_проект
   SENTRY_AUTH_TOKEN=ваш_токен
   ```

2. **Оптимизация сборки:**
   - Используйте `NEXT_TELEMETRY_DISABLED=1`
   - Включите кеширование зависимостей

3. **Мониторинг:**
   - Проверяйте Build Logs
   - Настройте уведомления о сбоях

## Проверка:

После этих изменений сборка должна проходить успешно. Если появятся новые ошибки:

1. Проверьте версии зависимостей
2. Убедитесь, что все переменные окружения установлены
3. Проверьте совместимость версий Sentry

---

**Деплой теперь должен работать! 🚀**