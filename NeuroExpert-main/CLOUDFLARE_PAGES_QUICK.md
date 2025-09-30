# ⚡ Cloudflare Pages - Неограниченные сборки БЕСПЛАТНО!

## 🎯 Почему Cloudflare Pages решит вашу проблему:

| Проблема | Netlify | Cloudflare Pages |
|----------|---------|------------------|
| Лимит сборок | 300 минут/месяц ❌ | НЕОГРАНИЧЕННО ✅ |
| Количество деплоев | ~60-100 | 500/месяц |
| Скорость CDN | Хорошая | ЛУЧШАЯ В МИРЕ |
| DDoS защита | Платно | БЕСПЛАТНО |
| Трафик | 100GB | НЕОГРАНИЧЕННО |

## 🚀 Запуск за 5 минут:

### 1️⃣ Регистрация (30 сек)
👉 [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
- Можно через Google
- Подтвердите email сразу!

### 2️⃣ Создание проекта (1 мин)
1. В меню слева → **Pages**
2. **Create a project**
3. **Connect to Git**
4. Авторизуйте GitHub (появится окно)

### 3️⃣ Выбор репозитория (30 сек)
1. Найдите `aineuroexpert-cell/AI-Audit`
2. Нажмите **Begin setup**

### 4️⃣ Настройка сборки (1 мин)
```
Project name: neuroexpert
Production branch: main
Framework preset: Next.js (выберите из списка)
Build command: npm run build
Build output directory: (оставить пустым)
Root directory: / 
Node.js version: 18
```

### 5️⃣ Переменные окружения (2 мин)
Прокрутите вниз → **Environment variables** → **Add variable**

| Variable name | Value |
|--------------|-------|
| NODE_VERSION | 18 |
| GOOGLE_GEMINI_API_KEY | ваш-ключ-gemini |
| JWT_SECRET | любая-строка-32-символа |
| ADMIN_PASSWORD_HASH | $2a$10$хеш-пароля |
| TELEGRAM_BOT_TOKEN | токен-бота |
| TELEGRAM_CHAT_ID | chat-id |

### 6️⃣ DEPLOY! 🚀
- Нажмите **Save and Deploy**
- Ждите 3-5 минут
- Готово!

## 🔗 Ваши адреса:

### Временный:
```
https://neuroexpert.pages.dev
```

### Для каждого коммита:
```
https://[commit-hash].neuroexpert.pages.dev
```

## ✅ Что вы получаете:

1. **Автодеплой** - каждый push обновляет сайт
2. **Preview URL** - для каждого PR
3. **Откат** - к любой версии
4. **Аналитика** - встроенная и бесплатная
5. **Скорость** - самая быстрая CDN

## 🆘 Если что-то не работает:

### Build failed:
- Проверьте что выбрали Framework preset: Next.js
- NODE_VERSION должен быть 18 или 20

### 404 ошибка:
- Подождите 5 минут после деплоя
- Проверьте в другом браузере

### Environment variables:
- Settings → Environment variables
- Можно изменить после деплоя
- Нужен редеплой после изменения

## 💎 Бонусы Cloudflare:

1. **Custom Domain** - бесплатно
2. **Web Analytics** - без cookies
3. **Page Rules** - редиректы и кеш
4. **Workers** - serverless функции
5. **R2 Storage** - для файлов

## 📱 Мобильное управление:

Cloudflare Dashboard отлично работает на телефоне!

## 🎉 Поздравляю!

Теперь у вас:
- ✅ Неограниченные сборки
- ✅ Самый быстрый хостинг
- ✅ Полная автоматизация
- ✅ Бесплатно навсегда
- ✅ Никаких блокировок

**Cloudflare Pages = Решение всех проблем с лимитами!**