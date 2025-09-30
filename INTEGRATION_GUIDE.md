# Руководство по интеграции аналитики NeuroExpert

## Быстрый старт

### 1. Установка переменных окружения

Добавьте в файл `.env.local`:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Яндекс.Метрика
NEXT_PUBLIC_YM_COUNTER_ID=12345678

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Security
JWT_SECRET=your-secret-key-min-32-chars
CSRF_SECRET=your-csrf-secret-min-32-chars
```

### 2. Проверка интеграции

SwipeContainer уже интегрирован с системой аналитики. Файл `/app/lib/analytics/client.js` предоставляет необходимые функции:

```javascript
// Эти функции уже используются в SwipeContainer
trackSwipe(direction, fromSection, toSection, method);
trackSectionView(sectionName, sectionIndex);
```

### 3. Дополнительные события

Для отслеживания дополнительных событий:

```javascript
import { clientAnalytics } from '@/lib/analytics/client';

// Отслеживание кастомного события
clientAnalytics.track('button_click', {
  button_name: 'cta_main',
  section: 'hero',
  timestamp: Date.now()
});

// Отслеживание ошибки
clientAnalytics.track('error', {
  message: error.message,
  stack: error.stack,
  component: 'ContactForm'
}, { priority: 'high' });
```

## API Endpoints

### Отправка события
```bash
POST /api/analytics/track
Content-Type: application/json
X-CSRF-Token: <token>

{
  "type": "custom",
  "name": "form_submit",
  "metadata": {
    "form_id": "contact",
    "fields_filled": 5
  }
}
```

### Батч отправка
```bash
POST /api/analytics/batch
Content-Type: application/json
X-CSRF-Token: <token>

{
  "events": [
    {...},
    {...}
  ]
}
```

### Получение метрик
```bash
GET /api/analytics/metrics?start=2024-01-01&end=2024-01-31
Authorization: Bearer <jwt-token>
```

## Дашборд аналитики

### Доступ к дашборду
1. Перейдите на `/dashboard/analytics`
2. Авторизуйтесь с правами администратора
3. Выберите период для анализа

### Основные метрики
- **Активные пользователи**: Количество уникальных пользователей в реальном времени
- **Популярные разделы**: Топ-5 самых посещаемых разделов
- **User Flow**: Визуализация переходов между разделами
- **Engagement Rate**: Процент вовлеченных пользователей

### Экспорт данных
1. Выберите период
2. Нажмите "Экспорт"
3. Выберите формат (JSON/CSV)

## Безопасность

### JWT токены
Для доступа к защищенным endpoints необходим JWT токен:

```javascript
const token = await fetch('/api/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'password'
  })
});
```

### CSRF защита
CSRF токен автоматически добавляется ко всем запросам. Для ручных запросов:

```javascript
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
```

### Rate Limiting
- 100 запросов в минуту на IP адрес
- 1000 запросов в час на пользователя
- Критические события обходят rate limiting

## Отладка

### Включение debug режима
```javascript
// В browser console
localStorage.setItem('analytics_debug', 'true');
```

### Просмотр очереди событий
```javascript
// В browser console
window.__ANALYTICS_QUEUE__
```

### Проверка статуса сервисов
```bash
GET /api/analytics/health
```

## Troubleshooting

### События не отправляются
1. Проверьте Network tab в DevTools
2. Убедитесь, что переменные окружения установлены
3. Проверьте CORS настройки

### Высокий bounce rate
1. Проверьте время загрузки страниц
2. Убедитесь, что контент соответствует ожиданиям
3. Проанализируйте user flow

### Ошибки аутентификации
1. Проверьте срок действия JWT токена
2. Убедитесь, что CSRF токен актуален
3. Проверьте права доступа пользователя

## Поддержка

- Документация: `/docs/analytics`
- API Reference: `/api-docs`
- Slack: #neuroexpert-analytics
- Email: analytics@neuroexpert.ai