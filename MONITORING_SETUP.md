# 📊 Настройка мониторинга для NeuroExpert

## ✅ Что было настроено

### 1. **Централизованное логирование**
- Создан `app/utils/logger.js` - профессиональная система логирования
- Поддержка уровней: ERROR, WARN, INFO, DEBUG, TRACE
- Структурированные логи с метаданными
- Цветной вывод для разработки

### 2. **Система мониторинга**
- Создан `app/utils/monitoring.js` - центр управления мониторингом
- Интеграция с Vercel Analytics
- Подготовка к интеграции с Sentry
- Отслеживание событий и ошибок
- Измерение производительности

### 3. **Error Boundary**
- Создан `app/components/ErrorBoundary.js`
- Перехват ошибок React компонентов
- Красивая страница ошибки для пользователей
- Автоматическая отправка ошибок в мониторинг

### 4. **Analytics API**
- Создан `app/api/analytics/route.js`
- Сбор пользовательских событий
- Endpoint для просмотра аналитики (dev mode)

### 5. **Скрипт миграции**
- Создан `scripts/migrate-console-logs.js`
- Автоматическая замена console.log на logger
- Поддержка dry-run режима

## 🚀 Как включить мониторинг

### 1. Vercel Analytics (Бесплатно)
```bash
# Уже добавлено в package.json
npm install @vercel/analytics

# В Vercel Dashboard:
# Settings → Analytics → Enable Analytics
```

### 2. Запуск миграции console.log
```bash
# Сначала проверьте что будет изменено
node scripts/migrate-console-logs.js --dry-run

# Затем примените изменения
node scripts/migrate-console-logs.js
```

### 3. Sentry (Опционально)
```bash
# Установка
npm install @sentry/nextjs

# Добавьте в .env.local
SENTRY_DSN=your-sentry-dsn-here

# Инициализация произойдет автоматически
```

## 📈 Использование

### Логирование
```javascript
import { logger } from '@/app/utils/logger';

// Вместо console.log
logger.info('User logged in', { userId: 123 });

// Вместо console.error
logger.error('Payment failed', { error, orderId });

// Дополнительные уровни
logger.warn('Slow query detected', { duration: 5000 });
logger.debug('Cache miss', { key: 'user-profile' });
```

### Отслеживание событий
```javascript
import { monitoring, ANALYTICS_EVENTS } from '@/app/utils/monitoring';

// Отслеживание действий пользователя
monitoring.trackEvent(ANALYTICS_EVENTS.USER_LOGIN, {
  method: 'email',
  success: true
});

// Отслеживание ошибок
monitoring.trackError(error, {
  severity: 'high',
  context: 'payment-processing'
});

// Измерение производительности
monitoring.startPerformanceMeasure('api-call');
// ... выполнение операции
const duration = monitoring.endPerformanceMeasure('api-call');
```

## 📊 Просмотр аналитики

### Development
```bash
# Просмотр последних событий
curl http://localhost:3000/api/analytics

# Фильтрация по типу
curl http://localhost:3000/api/analytics?event=error

# Ограничение количества
curl http://localhost:3000/api/analytics?limit=50
```

### Production
- Vercel Dashboard → Analytics
- Sentry Dashboard (если настроен)
- Логи в Vercel → Functions → Logs

## 🎯 Преимущества

1. **Видимость**: Понимание что происходит в приложении
2. **Отладка**: Быстрый поиск и исправление ошибок
3. **Производительность**: Отслеживание медленных операций
4. **UX**: Понимание поведения пользователей
5. **Безопасность**: Нет console.log в production

## ⚠️ Важные замечания

1. **Не логируйте секретные данные** (пароли, токены, ключи API)
2. **Используйте правильные уровни** логирования
3. **В production** автоматически отключаются DEBUG и TRACE логи
4. **Регулярно проверяйте** логи на наличие ошибок

---

Система мониторинга настроена и готова к использованию! 🎉