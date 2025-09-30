# 🎨 Полное руководство по развертыванию на Render.com

## 📊 Почему Render?

### Преимущества:
- ✅ **750 часов бесплатно** в месяц (достаточно для одного сайта 24/7)
- ✅ **Автоматический HTTPS** сертификат
- ✅ **Простая интеграция** с GitHub
- ✅ **Поддержка WebSockets** для real-time функций
- ✅ **Встроенный CDN** для статики
- ✅ **Логи в реальном времени**

### Ограничения бесплатного плана:
- ⚠️ Сайт "засыпает" после 15 минут неактивности
- ⚠️ Холодный старт ~30 секунд
- ⚠️ 512MB RAM / 0.1 CPU

## 🚀 Пошаговая инструкция

### Шаг 1: Регистрация на Render

1. Перейдите на [render.com](https://render.com)
2. Нажмите **"Get Started for Free"**
3. Выберите **"Sign up with GitHub"** (рекомендуется)
4. Авторизуйте Render для доступа к вашим репозиториям

### Шаг 2: Создание нового Web Service

1. В Dashboard нажмите **"New +"** → **"Web Service"**
2. Выберите **"Build and deploy from a Git repository"**
3. Нажмите **"Connect account"** если еще не подключили GitHub

### Шаг 3: Выбор репозитория

1. В списке найдите ваш репозиторий **"neuroexpert"** или **"AI-Audit"**
2. Нажмите **"Connect"**
3. Render автоматически определит, что это Node.js проект

### Шаг 4: Настройка сервиса

Заполните поля ТОЧНО так:

#### Basic Settings:
```
Name:                neuroexpert
Region:              Oregon (US West) или Frankfurt (EU Central)
Branch:              main (или cursor/say-hello-2df0)
Root Directory:      [оставить пустым]
Environment:         Node
Build Command:       npm install && npm run build
Start Command:       npm run start:render
```

#### Instance Type:
```
Plan:                Free ($0/month)
```

### Шаг 5: Переменные окружения

Прокрутите вниз до **"Environment Variables"** и добавьте:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `GOOGLE_GEMINI_API_KEY` | `ваш_ключ_gemini` |
| `TELEGRAM_BOT_TOKEN` | `ваш_telegram_bot_token` |
| `TELEGRAM_CHAT_ID` | `ваш_telegram_chat_id` |
| `PORT` | `10000` |

**Важно:** Render использует порт 10000 по умолчанию!

#### Добавление переменных:
1. Нажмите **"Add Environment Variable"**
2. Введите **Key** и **Value**
3. Повторите для каждой переменной

### Шаг 6: Advanced Settings (опционально)

```
Auto-Deploy:         Yes (рекомендуется)
Health Check Path:   /
Docker Command:      [оставить пустым]
Pre-Deploy Command:  [оставить пустым]
```

### Шаг 7: Создание сервиса

1. Проверьте все настройки
2. Нажмите **"Create Web Service"**
3. Начнется процесс сборки (5-10 минут первый раз)

## 📊 Мониторинг процесса

### Логи сборки:
- Вы увидите в реальном времени:
  ```
  ==> Cloning from https://github.com/...
  ==> Checking out commit abc123...
  ==> Running build command 'npm install && npm run build'
  ==> Installing dependencies...
  ==> Building application...
  ==> Build successful!
  ==> Starting service with 'npm run start:render'
  ```

### Индикаторы статуса:
- 🟡 **Building** - идет сборка
- 🟢 **Live** - сайт работает
- 🔴 **Failed** - ошибка (смотрите логи)

## 🔧 Отладка частых проблем

### Проблема: "Build failed"
**Решение:**
```bash
# В build command попробуйте:
npm ci --production=false && npm run build
```

### Проблема: "Port 3000 is already in use"
**Решение:**
Убедитесь что в `server.js`:
```javascript
const port = process.env.PORT || 10000; // Render использует PORT
```

### Проблема: "Cannot find module"
**Решение:**
1. Проверьте что все зависимости в `package.json`
2. Используйте `npm ci` вместо `npm install`

### Проблема: "Timeout during build"
**Решение:**
В `next.config.js` добавьте:
```javascript
module.exports = {
  ...nextConfig,
  eslint: {
    ignoreDuringBuilds: true
  }
}
```

## 🌐 Настройка кастомного домена

1. В настройках сервиса → **"Settings"** → **"Custom Domains"**
2. Нажмите **"Add Custom Domain"**
3. Введите ваш домен: `neuroexpert.com`
4. Добавьте DNS записи:
   ```
   Type: CNAME
   Name: www
   Value: neuroexpert.onrender.com
   
   Type: A
   Name: @
   Value: <IP от Render>
   ```

## 📈 Оптимизация производительности

### 1. Предотвращение "засыпания":
```javascript
// Добавьте в server.js
setInterval(() => {
  https.get(`https://${process.env.RENDER_EXTERNAL_URL}`);
}, 14 * 60 * 1000); // пинг каждые 14 минут
```

### 2. Оптимизация холодного старта:
```javascript
// next.config.js
module.exports = {
  ...nextConfig,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

### 3. Кэширование статики:
```javascript
// server.js
app.prepare().then(() => {
  createServer((req, res) => {
    // Кэшируем статику на 1 год
    if (req.url.startsWith('/_next/static')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    handle(req, res);
  }).listen(port);
});
```

## 🔍 Мониторинг и логи

### Просмотр логов:
1. Dashboard → Ваш сервис → **"Logs"**
2. Фильтры:
   - `Build logs` - логи сборки
   - `Deploy logs` - логи развертывания
   - `Service logs` - логи работы приложения

### Метрики:
- Dashboard → **"Metrics"**
- CPU использование
- Память
- Количество запросов

## 🚨 Команды для экстренных ситуаций

### Ручной редеплой:
1. Dashboard → **"Manual Deploy"**
2. Выберите коммит
3. **"Deploy"**

### Откат к предыдущей версии:
1. **"Events"** → Найдите успешный деплой
2. **"Rollback to this deploy"**

### Очистка кэша сборки:
1. **"Settings"** → **"Clear build cache"**

## ✅ Чек-лист после развертывания

- [ ] Сайт доступен по URL: `https://neuroexpert.onrender.com`
- [ ] AI чат открывается и отвечает
- [ ] Контактная форма отправляется
- [ ] Telegram уведомления приходят
- [ ] Нет ошибок в консоли браузера (F12)
- [ ] Мобильная версия работает

## 🎉 Поздравляем!

Ваш сайт развернут на Render! 

### Ваши ссылки:
- 🌐 Сайт: `https://neuroexpert.onrender.com`
- 📊 Dashboard: `https://dashboard.render.com`
- 📝 Логи: `https://dashboard.render.com/web/srv-xxx/logs`

### Что дальше?
1. Настройте кастомный домен
2. Включите автодеплой для автоматических обновлений
3. Рассмотрите платный план для:
   - Отсутствия "засыпания"
   - Больше RAM/CPU
   - Приоритетная поддержка

---

💡 **Совет:** Сохраните это руководство. Render может обновить интерфейс, но основные принципы останутся теми же!