# 🔧 Руководство по ручной настройке NeuroExpert

**Дата:** 17 января 2025  
**Время на настройку:** ~30-60 минут

## 📋 Содержание

1. [GitHub Settings](#1-github-settings)
2. [Необходимые API ключи](#2-необходимые-api-ключи)
3. [Локальная настройка](#3-локальная-настройка)
4. [Внешние сервисы](#4-внешние-сервисы)
5. [Deployment настройка](#5-deployment-настройка)
6. [Мониторинг и аналитика](#6-мониторинг-и-аналитика)
7. [Чеклист проверки](#7-финальный-чеклист)

---

## 1. GitHub Settings

### 1.1 Включение Dependabot

1. Перейдите в **Settings → Security & analysis**
2. Включите все опции:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Dependabot version updates

### 1.2 Branch Protection Rules

1. **Settings → Branches → Add rule**
2. Branch name pattern: `main`
3. Включите:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (минимум 1)
   - ✅ Dismiss stale pull request approvals
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require conversation resolution
   - ✅ Include administrators
   - ✅ Restrict who can push to matching branches

### 1.3 GitHub Secrets

Добавьте в **Settings → Secrets and variables → Actions**:

```bash
# Обязательные
GEMINI_API_KEY          # Ваш Google Gemini API ключ
ADMIN_PASSWORD          # Пароль для админ панели
JWT_SECRET              # Секрет для JWT токенов (сгенерируйте случайную строку)

# CI/CD сервисы
CODECOV_TOKEN           # Из https://codecov.io (бесплатно для open source)
SNYK_TOKEN              # Из https://snyk.io (бесплатно до 200 тестов/месяц)

# Deployment
VERCEL_TOKEN            # Из https://vercel.com/account/tokens
NETLIFY_AUTH_TOKEN      # Из https://app.netlify.com/user/applications
RENDER_API_KEY          # Из https://dashboard.render.com/account/api-keys

# Мониторинг (опционально)
SENTRY_DSN              # Из https://sentry.io
SLACK_WEBHOOK           # Webhook URL из Slack
DISCORD_WEBHOOK         # Webhook URL из Discord

# Аналитика (опционально)
GA_MEASUREMENT_ID       # Google Analytics 4
YANDEX_METRIKA_ID       # Яндекс.Метрика
```

### 1.4 GitHub Advanced Security (если доступно)

1. **Settings → Security & analysis → Code scanning**
2. Выберите "Set up code scanning"
3. Используйте "CodeQL Analysis" (уже настроен в workflows)

---

## 2. Необходимые API ключи

### 2.1 Google Gemini AI API (ОБЯЗАТЕЛЬНО)

1. Перейдите на https://makersuite.google.com/app/apikey
2. Нажмите "Create API Key"
3. Выберите проект или создайте новый
4. Скопируйте ключ вида: `AIzaSy...`
5. Добавьте в `.env.local`:
   ```
   GEMINI_API_KEY=AIzaSy...ваш_ключ
   ```

**Лимиты бесплатного плана:**
- 60 запросов в минуту
- 1500 запросов в день

### 2.2 JWT Secret (ОБЯЗАТЕЛЬНО)

Сгенерируйте безопасный секрет:
```bash
# Linux/Mac
openssl rand -base64 32

# Или Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Добавьте в `.env.local`:
```
JWT_SECRET=ваш_сгенерированный_секрет
```

### 2.3 Admin Password (ОБЯЗАТЕЛЬНО)

Создайте сильный пароль и добавьте в `.env.local`:
```
ADMIN_PASSWORD=СложныйПароль123!@#
```

---

## 3. Локальная настройка

### 3.1 Установка зависимостей

```bash
# Основные зависимости
npm install

# Активация Git hooks
npm run prepare
```

### 3.2 Создание .env.local

```bash
# Скопируйте пример
cp .env.example .env.local

# Отредактируйте файл
nano .env.local  # или используйте ваш редактор
```

**Минимальный .env.local:**
```env
# Обязательные
GEMINI_API_KEY=AIzaSy...
JWT_SECRET=ваш_jwt_secret
ADMIN_PASSWORD=ваш_админ_пароль

# База данных (если используется)
DATABASE_URL=postgresql://user:password@localhost:5432/neuroexpert
REDIS_URL=redis://localhost:6379

# Опционально
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.3 Проверка настройки

```bash
# Запустите тесты
npm run test

# Проверьте линтинг
npm run lint

# Проверьте типы
npm run type-check

# Запустите локально
npm run dev
```

---

## 4. Внешние сервисы

### 4.1 Codecov (для отчетов покрытия)

1. Зарегистрируйтесь на https://codecov.io
2. Добавьте репозиторий
3. Скопируйте токен из Settings
4. Добавьте `CODECOV_TOKEN` в GitHub Secrets

### 4.2 Snyk (безопасность зависимостей)

1. Зарегистрируйтесь на https://snyk.io
2. Подключите GitHub репозиторий
3. Получите API токен: Account Settings → General → Auth Token
4. Добавьте `SNYK_TOKEN` в GitHub Secrets

### 4.3 Sentry (мониторинг ошибок)

1. Создайте проект на https://sentry.io
2. Выберите платформу: Next.js
3. Следуйте инструкции установки:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
4. Добавьте DSN в `.env.local`:
   ```
   SENTRY_DSN=https://...@sentry.io/...
   ```

### 4.4 Уведомления (Slack/Discord)

**Slack:**
1. Создайте Incoming Webhook: https://api.slack.com/messaging/webhooks
2. Добавьте `SLACK_WEBHOOK` в GitHub Secrets

**Discord:**
1. Server Settings → Integrations → Webhooks → New Webhook
2. Добавьте `DISCORD_WEBHOOK` в GitHub Secrets

---

## 5. Deployment настройка

### 5.1 Vercel (рекомендуется)

1. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Подключите проект:
   ```bash
   vercel
   ```

3. Добавьте переменные окружения в Vercel Dashboard:
   - Project Settings → Environment Variables
   - Добавьте все из `.env.local`

4. Получите токен для CI/CD:
   - Account Settings → Tokens → Create

### 5.2 Netlify (альтернатива)

1. Подключите GitHub репозиторий в Netlify
2. Build settings:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
3. Environment variables → Add все из `.env.local`

### 5.3 Render (для backend)

Если используете отдельный backend:
1. Создайте Web Service на render.com
2. Подключите репозиторий
3. Добавьте environment variables
4. Получите API Key для автодеплоя

---

## 6. Мониторинг и аналитика

### 6.1 Google Analytics 4

1. Создайте property на https://analytics.google.com
2. Получите Measurement ID (G-XXXXXXXXXX)
3. Добавьте в `.env.local`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. Добавьте в `app/layout.tsx`:
   ```tsx
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
   ```

### 6.2 Яндекс.Метрика

1. Создайте счетчик на https://metrika.yandex.ru
2. Получите номер счетчика
3. Добавьте в `.env.local`:
   ```
   NEXT_PUBLIC_YM_ID=12345678
   ```

---

## 7. Финальный чеклист

### ✅ GitHub настройки
- [ ] Dependabot включен
- [ ] Branch protection настроен для main
- [ ] Все необходимые secrets добавлены
- [ ] CodeQL analysis включен

### ✅ Локальная среда
- [ ] `.env.local` создан со всеми ключами
- [ ] Git hooks активированы (`npm run prepare`)
- [ ] Все тесты проходят (`npm test`)
- [ ] Линтинг без ошибок (`npm run lint`)

### ✅ API ключи получены
- [ ] Google Gemini API Key
- [ ] JWT Secret сгенерирован
- [ ] Admin Password установлен
- [ ] Codecov токен (опционально)
- [ ] Snyk токен (опционально)

### ✅ Deployment
- [ ] Выбрана платформа (Vercel/Netlify)
- [ ] Environment variables настроены
- [ ] Автодеплой подключен

### ✅ Мониторинг
- [ ] Sentry настроен (опционально)
- [ ] Analytics подключен (опционально)
- [ ] Уведомления настроены (опционально)

---

## 🚀 Команды для проверки

```bash
# Проверка всей настройки
npm run check-all

# Если команды нет, выполните по отдельности:
npm run lint
npm run type-check
npm run test
npm run build

# Проверка безопасности
npm audit
npm run check-secrets  # если настроен

# Запуск production сборки локально
npm run build && npm run start
```

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `npm run dev` и смотрите консоль
2. Проверьте `.env.local` на наличие всех ключей
3. Убедитесь что все зависимости установлены: `npm ci`
4. Проверьте GitHub Actions на наличие ошибок

---

**Примечание**: Сохраните все API ключи в надежном месте (например, в менеджере паролей). Никогда не коммитьте их в репозиторий!