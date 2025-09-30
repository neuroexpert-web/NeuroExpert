# 🚀 Быстрый старт с Vercel за 5 минут

## ⚡ Метод 1: Через веб-интерфейс (Рекомендуется)

### 1. Перейдите на [vercel.com](https://vercel.com)
### 2. Нажмите "Import Git Repository"
### 3. Авторизуйтесь через GitHub
### 4. Выберите репозиторий `aineuroexpert-cell/AI-Audit`
### 5. Настройте проект:

```
Project Name: neuroexpert
Framework Preset: Next.js (автоматически определится)
Root Directory: ./ (оставить пустым)
Build Command: npm run build (автоматически)
Output Directory: .next (автоматически)
Install Command: npm install (автоматически)
```

### 6. Добавьте Environment Variables:

Нажмите "Environment Variables" и добавьте:

```bash
GOOGLE_GEMINI_API_KEY=ваш-ключ-gemini
JWT_SECRET=любая-случайная-строка-32-символа
ADMIN_PASSWORD_HASH=$2a$10$хеш-вашего-пароля
TELEGRAM_BOT_TOKEN=ваш-токен-бота
TELEGRAM_CHAT_ID=ваш-chat-id
NEXT_PUBLIC_SITE_URL=https://neuroexpert.vercel.app
```

### 7. Нажмите "Deploy"

✅ **Готово!** Через 1-2 минуты ваш сайт будет доступен!

## ⚡ Метод 2: Через CLI (для продвинутых)

```bash
# 1. Установите Vercel CLI
npm i -g vercel

# 2. Запустите деплой
vercel

# 3. Следуйте инструкциям:
# ? Set up and deploy "~/neuroexpert"? [Y/n] Y
# ? Which scope do you want to deploy to? Your Account
# ? Link to existing project? [y/N] N
# ? What's your project's name? neuroexpert
# ? In which directory is your code located? ./
# 🔗 Linked to your-account/neuroexpert
# 🔍 Inspect: https://vercel.com/your-account/neuroexpert/...
# ✅ Production: https://neuroexpert.vercel.app
```

## 🎯 Преимущества перед Render

| Функция | Vercel | Render |
|---------|---------|---------|
| Скорость деплоя | 30 сек | 5-10 мин |
| Автоматизация | ✅ Полная | ⚠️ Базовая |
| Preview для PR | ✅ Есть | ❌ Нет |
| Откат версий | ✅ 1 клик | ⚠️ Сложно |
| Edge Functions | ✅ Есть | ❌ Нет |
| Оптимизация | ✅ Автоматическая | ⚠️ Ручная |
| Next.js поддержка | ✅ Нативная | ⚠️ Общая |

## 🔧 После деплоя

### 1. Настройте домен (опционально)
- Vercel Dashboard → Settings → Domains
- Add Domain → введите ваш домен
- Следуйте инструкциям по DNS

### 2. Включите Analytics (бесплатно)
- Vercel Dashboard → Analytics → Enable

### 3. Настройте оповещения
- Settings → Notifications → Configure

## 🚨 Решение проблем

### Если сборка не удалась:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь что все env variables добавлены
3. Проверьте версию Node.js (должна быть 18+)

### Если AI не работает:
1. Проверьте GOOGLE_GEMINI_API_KEY
2. Убедитесь что ключ активен
3. Проверьте лимиты API

## 📱 Мобильное приложение Vercel

Скачайте приложение для управления деплоями с телефона:
- [iOS](https://apps.apple.com/app/vercel/id1586094928)
- [Android](https://play.google.com/store/apps/details?id=com.vercel.app)

## 🎉 Готово!

Теперь каждый `git push` автоматически обновит ваш сайт за 30 секунд!