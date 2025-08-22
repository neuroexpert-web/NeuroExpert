# 🚀 Быстрое развертывание NeuroExpert

## ✅ Проект готов к развертыванию!

Сборка успешно завершена. Вот самые быстрые способы развернуть проект:

## Вариант 1: GitHub + Vercel (Рекомендуется)

1. **Залейте код на GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Импортируйте в Vercel:**
- Откройте https://vercel.com/new
- Нажмите "Import Git Repository"
- Выберите ваш репозиторий NeuroExpert
- Нажмите "Deploy"

## Вариант 2: Netlify Drop (Без регистрации)

1. **Создайте статический экспорт:**
```bash
# Измените в next.config.js
# output: 'export'

# Пересоберите
npm run build
```

2. **Перетащите папку:**
- Откройте https://app.netlify.com/drop
- Перетащите папку `.next` или `out`

## Вариант 3: Railway (One-Click)

Нажмите на кнопку в README:
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/nextjs)

## Вариант 4: Render.com

У вас уже есть `render.yaml`:
1. Push на GitHub
2. Создайте новый Web Service на render.com
3. Подключите репозиторий

## 🔐 Переменные окружения

Добавьте в панели хостинга:
```
JWT_SECRET=your-secure-secret
ADMIN_PASSWORD_HASH=your-hash
GOOGLE_GEMINI_API_KEY=your-key (optional)
ANTHROPIC_API_KEY=your-key (optional)
```

## 📱 Локальный доступ

Проект уже запущен локально:
- Development: http://localhost:3000
- Production build готов в папке `.next`

## 🆘 Проблемы с Vercel?

### Альтернативный вход:
1. https://vercel.com/login/github
2. Или создайте новый аккаунт с другим email

### Через терминал:
```bash
# Сброс токена
rm -rf ~/.vercel

# Новый логин
npx vercel login

# Deploy
npx vercel --prod
```

---

**Проект полностью готов к развертыванию!** 
Выберите любой удобный способ выше.