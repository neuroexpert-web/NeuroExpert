# 🛡️ Руководство по настройке Sentry для NeuroExpert

## ✅ Что уже сделано

1. **Установлен Sentry SDK**: `@sentry/nextjs`
2. **Активированы конфигурационные файлы**:
   - `sentry.client.config.ts` - для клиента
   - `sentry.server.config.ts` - для сервера
   - `sentry.edge.config.ts` - для edge runtime
3. **Обновлен `next.config.js`** для интеграции с Sentry
4. **Создан `ErrorBoundary`** компонент для обработки ошибок
5. **Создана утилита** `app/utils/sentry.js` для работы с Sentry

## 🚀 Как настроить Sentry

### Шаг 1: Создайте аккаунт на Sentry

1. Перейдите на [sentry.io](https://sentry.io)
2. Зарегистрируйтесь или войдите
3. Создайте новый проект:
   - Platform: **Next.js**
   - Alert frequency: По вашему выбору
   - Project name: **neuroexpert**

### Шаг 2: Получите необходимые данные

После создания проекта, найдите:

1. **DSN** (Data Source Name):
   - Settings → Projects → neuroexpert → Client Keys (DSN)
   - Выглядит как: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

2. **Organization Slug**:
   - Settings → General Settings
   - В URL: `https://sentry.io/organizations/YOUR-ORG-SLUG/`

3. **Project Slug**:
   - Обычно совпадает с названием проекта: `neuroexpert`

4. **Auth Token** (для загрузки source maps):
   - Settings → Account → API → Auth Tokens → Create New Token
   - Scopes: `project:releases`, `org:read`

### Шаг 3: Добавьте переменные окружения

Создайте или обновите файл `.env.local`:

```bash
# Обязательно
NEXT_PUBLIC_SENTRY_DSN=https://ваш-dsn@xxx.ingest.sentry.io/xxx

# Опционально (для source maps)
SENTRY_ORG=ваша-организация
SENTRY_PROJECT=neuroexpert
SENTRY_AUTH_TOKEN=sntrys_ваш-токен

# Дополнительные настройки
SENTRY_ENVIRONMENT=production
```

### Шаг 4: Добавьте переменные в Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект **neuroexpert**
3. Settings → Environment Variables
4. Добавьте все переменные из `.env.local`

### Шаг 5: Используйте ErrorBoundary

Оберните ваше приложение в `ErrorBoundary`:

```jsx
// В app/layout.js
import ErrorBoundary from './components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

## 📊 Использование Sentry в коде

### Логирование ошибок

```javascript
import { captureException, captureMessage } from '@/app/utils/sentry';

// Захват исключения
try {
  // опасный код
} catch (error) {
  captureException(error, {
    user: { id: userId },
    action: 'form_submission'
  });
}

// Захват сообщения
captureMessage('Важное событие произошло', 'info');
```

### Добавление контекста пользователя

```javascript
import { setUserContext } from '@/app/utils/sentry';

// При входе пользователя
setUserContext({
  id: user.id,
  email: user.email,
  username: user.username
});

// При выходе
setUserContext(null);
```

### Измерение производительности

```javascript
import { measurePerformance } from '@/app/utils/sentry';

const result = await measurePerformance('api.fetch_data', async () => {
  return await fetchDataFromAPI();
});
```

## 🧪 Тестирование Sentry

### Проверка в development

```javascript
// Добавьте в любой компонент для теста
<button onClick={() => {
  throw new Error('Тестовая ошибка Sentry');
}}>
  Тест Sentry
</button>
```

### Проверка в production

1. Сделайте deploy на Vercel
2. Откройте сайт и вызовите ошибку
3. Проверьте Sentry Dashboard - ошибка должна появиться

## 📈 Мониторинг

### Performance Monitoring

Sentry автоматически отслеживает:
- Время загрузки страниц
- API запросы
- Database queries
- React component renders

### Session Replay

При ошибках Sentry записывает:
- Действия пользователя
- Состояние DOM
- Network запросы
- Console logs

## 🔧 Дополнительные настройки

### Фильтрация ошибок

В `sentry.client.config.ts` уже настроены фильтры для:
- Ошибок от браузерных расширений
- Сетевых ошибок
- Benign browser quirks

### Настройка уведомлений

1. Sentry Dashboard → Alerts → Create Alert
2. Выберите условия (например, > 10 ошибок за час)
3. Настройте уведомления (email, Slack, etc.)

## 🚨 Важные замечания

1. **Не логируйте sensitive данные** (пароли, токены, личные данные)
2. **Используйте разные environment** для dev/staging/production
3. **Регулярно проверяйте квоты** - бесплатный план ограничен
4. **Настройте alerts** для критичных ошибок

## 📞 Поддержка

- [Документация Sentry](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Next.js интеграция](https://github.com/getsentry/sentry-javascript/tree/master/packages/nextjs)
- [Примеры использования](https://github.com/getsentry/sentry-javascript/tree/master/packages/nextjs#usage)

---

**Sentry теперь готов к использованию! 🎉**

После добавления переменных окружения и деплоя, все ошибки будут автоматически отслеживаться.