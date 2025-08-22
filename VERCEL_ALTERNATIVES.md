# 🚀 Альтернативы Vercel для быстрого деплоя

## 1. Netlify (Самый простой)

### Без регистрации - прямо из терминала:
```bash
# Установить Netlify CLI
npm install -g netlify-cli

# Собрать проект
npm run build

# Развернуть без логина
npx netlify deploy --dir=.next --prod
```

### Или перетащите папку:
1. Откройте https://app.netlify.com/drop
2. Перетащите папку `.next` после сборки
3. Получите ссылку мгновенно!

## 2. Render.com

### Быстрый деплой:
```bash
# Уже есть конфигурация!
cat render.yaml

# Просто пуш в GitHub и подключите репозиторий на render.com
```

## 3. Railway.app

### One-click deploy:
1. Нажмите кнопку в README
2. Или используйте CLI:
```bash
npm install -g @railway/cli
railway login
railway up
```

## 4. GitHub Pages (Бесплатно)

### Для статического экспорта:
```bash
# Изменить в next.config.js
# output: 'export'

# Собрать
npm run build

# Развернуть
npx gh-pages -d out
```

## 5. Cloudflare Pages

### Супер быстрый CDN:
```bash
# Установить Wrangler
npm install -g wrangler

# Развернуть
npx wrangler pages deploy .next --project-name=neuroexpert
```

## 6. Локальный туннель (для тестов)

### Мгновенный доступ из интернета:
```bash
# Запустить локально
npm run dev

# В другом терминале
npx localtunnel --port 3000
# или
npx ngrok http 3000
```

## 🔐 Если проблема с авторизацией Vercel:

### 1. Сброс токена:
```bash
rm -rf ~/.vercel
npx vercel login
```

### 2. Использование токена напрямую:
```bash
export VERCEL_TOKEN="your-token-here"
npx vercel --token $VERCEL_TOKEN
```

### 3. Деплой через GitHub:
1. Пуш кода в GitHub
2. Импорт проекта на vercel.com/import
3. Автоматический деплой при каждом пуше

## 📱 Проблемы со входом?

### Возможные причины:
- Блокировка cookies
- VPN/Proxy проблемы  
- Старый аккаунт GitHub/GitLab
- 2FA проблемы

### Решения:
1. Попробуйте другой браузер
2. Отключите расширения браузера
3. Используйте инкогнито режим
4. Войдите через GitHub: vercel.com/login/github

## 🚨 Экстренный деплой

Если срочно нужно показать проект:

```bash
# 1. Быстрый статический хостинг
npx serve .next -p 3000

# 2. Через Python
cd .next && python -m http.server 8000

# 3. Через Node.js
npx http-server .next
```

---

**Рекомендую начать с Netlify Drop - это самый быстрый способ без регистрации!**