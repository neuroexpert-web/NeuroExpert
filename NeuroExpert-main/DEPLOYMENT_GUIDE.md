# 🚀 Руководство по развертыванию платформы НейроЭксперт

## 📋 Содержание
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Развертывание на Vercel](#развертывание-на-vercel)
- [Развертывание на Render](#развертывание-на-render)
- [Развертывание с Docker](#развертывание-с-docker)
- [Настройка переменных окружения](#настройка-переменных-окружения)
- [Устранение проблем](#устранение-проблем)

## 📦 Требования

### Системные требования
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Docker и Docker Compose (для контейнерного развертывания)

### Минимальные требования к серверу
- CPU: 2 ядра
- RAM: 4 GB
- Диск: 10 GB

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/neuroexpert-web/NeuroExpert.git
cd NeuroExpert
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
```bash
cp .env.example .env
# Отредактируйте .env и заполните необходимые переменные
```

### 4. Генерация паролей и ключей
```bash
# Генерация JWT_SECRET
openssl rand -base64 32

# Генерация NEXTAUTH_SECRET
openssl rand -base64 32

# Генерация хеша пароля администратора
npm run generate:password -- <ваш-пароль>
```

### 5. Сборка и запуск
```bash
# Режим разработки
npm run dev

# Продакшн сборка
npm run build
npm run start
```

## ☁️ Развертывание на Vercel

### Автоматическое развертывание

1. Форкните репозиторий на GitHub
2. Зайдите на [vercel.com](https://vercel.com)
3. Нажмите "Import Project"
4. Выберите ваш форк репозитория
5. Настройте переменные окружения в интерфейсе Vercel
6. Нажмите "Deploy"

### Ручное развертывание через CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Развертывание
vercel

# Продакшн развертывание
vercel --prod
```

### Необходимые переменные окружения для Vercel
```
GOOGLE_GEMINI_API_KEY=your-key
JWT_SECRET=your-secret
NEXTAUTH_SECRET=your-secret
ADMIN_PASSWORD_HASH=your-hash
```

## 🔧 Развертывание на Render

### 1. Создание сервиса

1. Зайдите на [render.com](https://render.com)
2. Создайте новый Web Service
3. Подключите GitHub репозиторий
4. Настройте:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:render`

### 2. Настройка переменных окружения

В настройках сервиса добавьте переменные окружения из `.env.example`

### 3. Настройка базы данных (опционально)

Создайте PostgreSQL базу данных на Render и подключите через `DATABASE_URL`

## 🐳 Развертывание с Docker

### 1. Сборка и запуск с Docker Compose

```bash
# Создайте .env файл
cp .env.example .env

# Отредактируйте .env

# Запустите все сервисы
docker-compose up -d

# Проверьте статус
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### 2. Только приложение (без БД)

```bash
# Сборка образа
docker build -t neuroexpert .

# Запуск контейнера
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name neuroexpert-app \
  neuroexpert
```

### 3. Обновление

```bash
# Остановка контейнеров
docker-compose down

# Получение обновлений
git pull origin main

# Пересборка и запуск
docker-compose up -d --build
```

## 🔐 Настройка переменных окружения

### Критически важные переменные

1. **JWT_SECRET** - Секретный ключ для JWT токенов
   ```bash
   openssl rand -base64 32
   ```

2. **ADMIN_PASSWORD_HASH** - Хеш пароля администратора
   ```bash
   npm run generate:password -- <пароль>
   ```

3. **NEXTAUTH_SECRET** - Секретный ключ для NextAuth
   ```bash
   openssl rand -base64 32
   ```

4. **GOOGLE_GEMINI_API_KEY** - Ключ для Google AI
   - Получить на: https://makersuite.google.com/app/apikey

### Дополнительные переменные

- **DATABASE_URL** - Подключение к PostgreSQL
- **REDIS_URL** - Подключение к Redis
- **TELEGRAM_BOT_TOKEN** - Токен бота для уведомлений
- **TELEGRAM_CHAT_ID** - ID чата для уведомлений

## 🛠 Устранение проблем

### Ошибка: WorkspaceManager is not defined

**Решение**: Убедитесь, что используется последняя версия из репозитория:
```bash
git pull origin main
npm install
npm run build
```

### Ошибка: ESLint errors

**Решение**: Исправьте ошибки линтера:
```bash
npm run lint:fix
```

### Ошибка: Critical vulnerability

**Решение**: Обновите зависимости:
```bash
npm audit fix
```

### Ошибка: Cannot find module

**Решение**: Очистите кеш и переустановите зависимости:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Проблемы с памятью при сборке

**Решение**: Увеличьте лимит памяти для Node.js:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 📊 Мониторинг

### Проверка здоровья приложения
```bash
curl http://localhost:3000/api/health
```

### Просмотр логов Docker
```bash
docker-compose logs -f app
```

### Метрики производительности
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

## 🔄 Обновление

### Автоматическое обновление (GitHub Actions)
Настройте webhook в настройках репозитория для автоматического развертывания при push в main ветку.

### Ручное обновление
```bash
# Получение изменений
git pull origin main

# Установка новых зависимостей
npm install

# Пересборка
npm run build

# Перезапуск
pm2 restart neuroexpert
# или
docker-compose restart
```

## 📝 Чеклист перед развертыванием

- [ ] Все переменные окружения настроены
- [ ] Пароли и ключи сгенерированы безопасно
- [ ] SSL сертификат настроен (для продакшена)
- [ ] Резервное копирование настроено
- [ ] Мониторинг настроен
- [ ] Логирование настроено
- [ ] Тесты пройдены успешно

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи приложения
2. Проверьте переменные окружения
3. Обратитесь к документации в папке `/docs`
4. Создайте issue на GitHub

---

**Последнее обновление**: Декабрь 2024
**Версия**: 3.0.0