# 🚀 Полное руководство по развертыванию NeuroExpert на Netlify

## 📋 Содержание
1. [Подготовка проекта](#подготовка-проекта)
2. [Настройка Netlify](#настройка-netlify)
3. [Переменные окружения](#переменные-окружения)
4. [Развертывание](#развертывание)
5. [Проверка и отладка](#проверка-и-отладка)
6. [Частые ошибки и решения](#частые-ошибки-и-решения)

## 🎯 Подготовка проекта

### 1. Проверка локальной работоспособности

```bash
# Установка зависимостей
npm install

# Локальный запуск
npm run dev
```

Убедитесь, что приложение работает на http://localhost:3000

### 2. Проверка сборки

```bash
# Тестовая сборка
npm run build

# Если сборка прошла успешно, очистите кэш
rm -rf .next
```

### 3. Подготовка репозитория

```bash
# Инициализация git (если еще не сделано)
git init

# Добавление всех файлов
git add .

# Коммит
git commit -m "Initial deployment to Netlify"

# Создание репозитория на GitHub
# 1. Зайдите на https://github.com/new
# 2. Создайте новый репозиторий (например, neuroexpert-app)
# 3. НЕ инициализируйте с README

# Подключение к GitHub
git remote add origin https://github.com/YOUR_USERNAME/neuroexpert-app.git
git branch -M main
git push -u origin main
```

## 🔧 Настройка Netlify

### 1. Регистрация и вход

1. Перейдите на [netlify.com](https://netlify.com)
2. Нажмите "Sign up" → "GitHub" (рекомендуется)
3. Авторизуйтесь через GitHub

### 2. Создание нового сайта

1. В панели управления нажмите **"Add new site"** → **"Import an existing project"**
2. Выберите **"Deploy with GitHub"**
3. Авторизуйте Netlify для доступа к вашим репозиториям
4. Найдите и выберите репозиторий `neuroexpert-app`

### 3. Настройка сборки

На странице настройки укажите:

- **Branch to deploy:** `main`
- **Base directory:** (оставьте пустым)
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** `netlify/functions`

### 4. Важные настройки

В разделе **"Build settings"**:
- ✅ **Clear cache before each build** - НЕ включайте (замедлит сборку)
- ✅ **Production branch:** `main`

## 🔐 Переменные окружения

### 1. Обязательные переменные

В Netlify Dashboard → Site settings → Environment variables добавьте:

```env
# API ключи (ОБЯЗАТЕЛЬНО)
GOOGLE_GEMINI_API_KEY=ваш_ключ_gemini
TELEGRAM_BOT_TOKEN=ваш_токен_telegram_бота
TELEGRAM_CHAT_ID=ваш_chat_id

# Опциональные
ANTHROPIC_API_KEY=ваш_ключ_claude_если_есть
NEXT_PUBLIC_GA_ID=ваш_google_analytics_id
NEXT_PUBLIC_YM_ID=ваш_yandex_metrica_id
```

### 2. Как получить ключи

#### Google Gemini API:
1. Перейдите на [ai.google.dev](https://ai.google.dev)
2. Нажмите "Get API key"
3. Создайте новый проект или выберите существующий
4. Скопируйте API ключ

#### Telegram Bot:
1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен вида `1234567890:AAEhBP0av18gDa...`

#### Telegram Chat ID:
1. Отправьте любое сообщение вашему боту
2. Откройте `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Найдите `"chat":{"id":123456789}`
4. Скопируйте число (это ваш chat_id)

### 3. Добавление переменных в Netlify

1. Site settings → Environment variables
2. Нажмите "Add a variable"
3. Выберите "Add a single variable"
4. Key: `GOOGLE_GEMINI_API_KEY`
5. Value: `ваш_ключ`
6. Scopes: оставьте все галочки
7. Нажмите "Add variable"
8. Повторите для всех переменных

## 🚀 Развертывание

### 1. Первое развертывание

После настройки переменных:
1. Нажмите **"Deploy site"**
2. Дождитесь завершения сборки (3-5 минут)
3. Проверьте логи на наличие ошибок

### 2. Проверка статуса

- 🟢 **Published** - успешно развернуто
- 🟡 **Building** - идет сборка
- 🔴 **Failed** - ошибка (смотрите логи)

### 3. Настройка домена

1. Site settings → Domain management
2. Нажмите "Add custom domain"
3. Введите ваш домен (например, `neuroexpert.ai`)
4. Следуйте инструкциям по настройке DNS

Или используйте бесплатный поддомен Netlify:
- Нажмите "Change site name"
- Введите желаемое имя (например, `neuroexpert`)
- Ваш сайт будет доступен по адресу `neuroexpert.netlify.app`

## ✅ Проверка и отладка

### 1. Проверка функциональности

После развертывания проверьте:

- [ ] Главная страница загружается
- [ ] AI чат работает (попробуйте задать вопрос)
- [ ] Контактная форма отправляется
- [ ] Анимации работают плавно
- [ ] Мобильная версия отображается корректно

### 2. Проверка API

Откройте консоль браузера (F12) и проверьте:
- Нет ошибок 404 или 500
- API запросы проходят успешно
- Нет CORS ошибок

### 3. Проверка уведомлений

1. Отправьте тестовое сообщение через контактную форму
2. Проверьте, пришло ли уведомление в Telegram
3. Попробуйте AI чат - должно прийти уведомление

## ❌ Частые ошибки и решения

### Ошибка: "Module not found"

```bash
Module not found: Can't resolve '@google/generative-ai'
```

**Решение:**
1. Убедитесь, что все зависимости в package.json
2. Очистите кэш в Netlify: Deploy settings → Clear cache and retry

### Ошибка: "Build exceeded maximum allowed runtime"

**Решение:**
1. Оптимизируйте next.config.js
2. Удалите неиспользуемые зависимости
3. Используйте `target: 'serverless'`

### Ошибка: "Function invocation failed"

**Решение:**
1. Проверьте переменные окружения
2. Проверьте логи функций: Functions → View logs
3. Убедитесь, что API ключи действительны

### Ошибка: "CORS policy"

**Решение:**
1. Проверьте netlify.toml - должны быть правильные заголовки
2. Убедитесь, что используете относительные пути для API

### Ошибка: "Page not found" на обновление

**Решение:**
Добавьте в netlify.toml:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📊 Мониторинг

### 1. Аналитика Netlify

- Bandwidth usage - использование трафика
- Build minutes - время сборки
- Functions - использование serverless функций

### 2. Логи

- Deploy log - логи сборки
- Function log - логи serverless функций
- Analytics - встроенная аналитика

### 3. Оповещения

Настройте оповещения:
1. Site settings → Build & deploy → Deploy notifications
2. Добавьте email для уведомлений о failed builds

## 🔄 Обновление сайта

### Автоматическое развертывание

При каждом push в main ветку:
```bash
git add .
git commit -m "Update: описание изменений"
git push origin main
```

Netlify автоматически начнет сборку и развертывание.

### Ручное развертывание

1. Deploys → Trigger deploy → Deploy site
2. Или перетащите папку проекта в Netlify Dashboard

## 🎉 Поздравляем!

Ваш сайт развернут и работает! 

### Что дальше?

1. Настройте мониторинг uptime (например, UptimeRobot)
2. Добавьте Google Analytics для отслеживания посетителей
3. Настройте автоматические бэкапы
4. Рассмотрите Pro план Netlify для дополнительных функций

### Полезные ссылки

- [Netlify Docs](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Поддержка Netlify](https://www.netlify.com/support/)

---

💡 **Совет:** Сохраните это руководство и используйте как чек-лист при каждом развертывании!