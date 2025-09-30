# 🚀 Ручное развертывание NeuroExpert на Render

## Шаг 1: Создание нового Web Service

1. Войдите в [Render Dashboard](https://dashboard.render.com)
2. Нажмите **New +** → **Web Service**
3. Выберите **Build and deploy from a Git repository**
4. Нажмите **Next**

## Шаг 2: Подключение репозитория

1. Нажмите **Connect GitHub**
2. Авторизуйтесь в GitHub
3. Найдите репозиторий `aineuroexpert-cell/AI-Audit`
4. Нажмите **Connect**

## Шаг 3: Настройки сервиса

Заполните поля точно как указано:

### Basic Settings:
- **Name:** `neuroexpert` (или любое другое уникальное имя)
- **Region:** `Oregon (US West)` (или ближайший к вам)
- **Branch:** `main`
- **Root Directory:** оставьте пустым
- **Runtime:** `Node`

### Build & Deploy:
- **Build Command:** 
  ```
  npm install && npm run build:render
  ```
- **Start Command:**
  ```
  npm run start:render
  ```

### Instance Type:
- Выберите **Free** для начала

## Шаг 4: Переменные окружения

Нажмите **Advanced** и добавьте следующие переменные:

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `20` |
| `NODE_ENV` | `production` |
| `GOOGLE_GEMINI_API_KEY` | Ваш ключ от [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `JWT_SECRET` | Любая случайная строка (например: `my-super-secret-key-123`) |
| `ADMIN_PASSWORD_HASH` | Сгенерируйте с помощью команды ниже |
| `TELEGRAM_BOT_TOKEN` | (опционально) Токен вашего Telegram бота |
| `TELEGRAM_CHAT_ID` | (опционально) ID чата для уведомлений |

### Генерация ADMIN_PASSWORD_HASH:

1. Клонируйте репозиторий локально:
   ```bash
   git clone https://github.com/aineuroexpert-cell/AI-Audit.git
   cd AI-Audit
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Запустите скрипт:
   ```bash
   node scripts/generate-password-hash.js
   ```

4. Введите желаемый пароль и скопируйте полученный хэш

## Шаг 5: Auto-Deploy

- **Auto-Deploy:** `Yes` (для автоматического деплоя при push в main)

## Шаг 6: Создание сервиса

1. Проверьте все настройки
2. Нажмите **Create Web Service**
3. Дождитесь завершения первого деплоя (5-10 минут)

## 🔍 Проверка деплоя

После успешного деплоя:

1. Откройте URL вашего сервиса (например: `https://neuroexpert.onrender.com`)
2. Проверьте главную страницу
3. Проверьте API: `https://neuroexpert.onrender.com/api/health`

## ⚠️ Важные моменты

1. **Бесплатный план Render**:
   - Сервис засыпает после 15 минут неактивности
   - Первый запрос после сна занимает 30-60 секунд
   - 750 часов бесплатно в месяц

2. **Логи**:
   - Проверяйте логи в разделе **Logs** если что-то не работает
   - Ищите ошибки, связанные с переменными окружения

3. **Переменные окружения**:
   - После добавления переменных сервис автоматически перезапустится
   - Убедитесь, что все ключи добавлены правильно

## 🆘 Если что-то пошло не так

1. Проверьте логи в Render Dashboard
2. Убедитесь, что все переменные окружения установлены
3. Попробуйте **Manual Deploy** → **Clear build cache & deploy**
4. Проверьте, что в репозитории последняя версия кода

## 📝 Альтернативные команды

Если стандартные команды не работают, попробуйте:

**Build Command:**
```
npm ci --production=false && npm run build
```

**Start Command:**
```
node node_modules/next/dist/bin/next start -p $PORT
```

---

Готово! Ваш сервис должен быть доступен по адресу `https://[имя-сервиса].onrender.com`