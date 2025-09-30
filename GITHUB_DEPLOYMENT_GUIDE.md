# Развертывание NeuroExpert через GitHub

## Способ 1: GitHub Actions + Бесплатные хостинги

### Шаг 1: Настройка секретов в GitHub

1. Перейдите в репозиторий → Settings → Secrets and variables → Actions
2. Нажмите "New repository secret"
3. Добавьте следующие секреты:

#### Общие секреты (для всех платформ):
- `GOOGLE_GEMINI_API_KEY` - ваш API ключ Gemini
- `JWT_SECRET` - секретный ключ для JWT
- `ADMIN_PASSWORD_HASH` - хэш пароля админа

#### Для Netlify:
- `NETLIFY_AUTH_TOKEN` - получите на https://app.netlify.com/user/applications#personal-access-tokens
- `NETLIFY_SITE_ID` - ID вашего сайта в Netlify

#### Для Vercel:
- `VERCEL_TOKEN` - получите на https://vercel.com/account/tokens
- `VERCEL_ORG_ID` - найдите в настройках проекта
- `VERCEL_PROJECT_ID` - найдите в настройках проекта

#### Для Render:
- `RENDER_API_KEY` - получите на https://dashboard.render.com/account/api-keys
- `RENDER_SERVICE_ID` - ID вашего сервиса

### Шаг 2: Запуск развертывания

1. Перейдите в Actions → Deploy to Production
2. Нажмите "Run workflow"
3. Выберите ветку main
4. Нажмите "Run workflow"

## Способ 2: Railway (самый простой)

Railway позволяет развернуть прямо из GitHub без настройки:

1. Перейдите на https://railway.app
2. Нажмите "Start a New Project"
3. Выберите "Deploy from GitHub repo"
4. Авторизуйтесь через GitHub
5. Выберите репозиторий `AI-Audit`
6. Railway автоматически определит Next.js и развернёт

### Настройка переменных в Railway:
1. В дашборде Railway выберите ваш проект
2. Перейдите в Variables
3. Добавьте все переменные из `.env.example`

## Способ 3: Render.com

1. Создайте аккаунт на https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Выберите `aineuroexpert-cell/AI-Audit`
5. Настройки:
   - Name: `neuroexpert`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Добавьте переменные окружения
7. Create Web Service

## Способ 4: Fly.io

```bash
# Установите Fly CLI
curl -L https://fly.io/install.sh | sh

# Авторизуйтесь
fly auth login

# Создайте приложение
fly launch --name neuroexpert

# Развернитесь
fly deploy
```

## Способ 5: GitHub Codespaces (для разработки)

1. В репозитории нажмите "Code" → "Codespaces"
2. Create codespace on main
3. В терминале Codespaces:
```bash
npm install
npm run dev
```
4. Codespaces автоматически создаст публичный URL

## Рекомендации

### Для продакшена рекомендую:
1. **Railway** - самый простой, есть бесплатный план
2. **Render** - стабильный, автодеплой из GitHub
3. **Fly.io** - быстрый, глобальная CDN

### Для тестирования:
1. **GitHub Codespaces** - встроенная IDE
2. **Netlify** - быстрый деплой для превью

## Автоматизация

После настройки GitHub Actions, каждый push в main будет автоматически:
1. Запускать тесты
2. Собирать проект
3. Развертывать на выбранные платформы

## Мониторинг

Проверить статус деплоя можно:
- GitHub Actions: вкладка Actions в репозитории
- Railway: https://railway.app/dashboard
- Render: https://dashboard.render.com
- Netlify: https://app.netlify.com