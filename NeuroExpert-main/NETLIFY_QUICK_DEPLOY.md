# 🚀 Деплой на Netlify за 3 минуты (Без блокировок!)

## ✅ Преимущества Netlify для вас:

1. **Никаких блокировок** - регистрация через GitHub
2. **Автодеплой** - каждый push обновляет сайт
3. **Бесплатно** - 100GB трафика в месяц
4. **Preview** - отдельный URL для каждого PR
5. **Отличная поддержка Next.js**

## 📋 Пошаговая инструкция:

### Шаг 1: Регистрация (30 секунд)
1. Откройте [app.netlify.com](https://app.netlify.com)
2. Нажмите **"Sign up"**
3. Выберите **"GitHub"** (не email!)
4. Авторизуйтесь в GitHub

### Шаг 2: Импорт проекта (1 минута)
1. Нажмите **"Import an existing project"**
2. Выберите **"Import from Git"**
3. Нажмите **"GitHub"**
4. Найдите и выберите **`aineuroexpert-cell/AI-Audit`**

### Шаг 3: Настройка сборки (30 секунд)
Netlify автоматически определит настройки, но проверьте:

```
Base directory: (оставить пустым)
Build command: npm run build
Publish directory: .next
Functions directory: netlify/functions
```

### Шаг 4: Переменные окружения (1 минута)
Нажмите **"Show advanced"** → **"New variable"**

Добавьте каждую переменную:

| Key | Value |
|-----|-------|
| `GOOGLE_GEMINI_API_KEY` | ваш-ключ-от-Google-AI |
| `JWT_SECRET` | любая-случайная-строка-32 |
| `ADMIN_PASSWORD_HASH` | $2a$10$ваш-хеш-пароля |
| `TELEGRAM_BOT_TOKEN` | ваш-токен-бота |
| `TELEGRAM_CHAT_ID` | ваш-chat-id |
| `NODE_VERSION` | 18 |

### Шаг 5: Деплой! (30 секунд)
1. Нажмите **"Deploy site"**
2. Подождите 2-3 минуты
3. Готово! 🎉

## 🔗 После деплоя:

### Ваш сайт будет доступен по адресу:
```
https://случайное-имя.netlify.app
```

### Чтобы изменить имя:
1. Site settings → Domain management
2. Options → Edit site name
3. Введите: `neuroexpert`
4. Сохраните

### Новый адрес:
```
https://neuroexpert.netlify.app
```

## 🎯 Автоматизация настроена!

Теперь каждый раз когда вы делаете:
```bash
git add .
git commit -m "Изменения"
git push origin main
```

**Сайт автоматически обновится через 1-2 минуты!**

## 🆘 Если что-то не работает:

### AI не отвечает:
- Проверьте `GOOGLE_GEMINI_API_KEY` в Site settings → Environment variables
- Убедитесь что ключ активен в [Google AI Studio](https://makersuite.google.com/app/apikey)

### Ошибка сборки:
- Проверьте логи в Deploys → Посмотреть логи
- Убедитесь что `NODE_VERSION = 18`

### CSS не загружается:
- Очистите кеш браузера (Ctrl+F5)
- Проверьте в режиме инкогнито

## 📱 Мобильное приложение Netlify

Управляйте деплоями с телефона:
- [iOS App](https://apps.apple.com/app/netlify/id1555179234)
- [Android App](https://play.google.com/store/apps/details?id=com.netlify.app)

## 💡 Полезные функции Netlify:

1. **Формы** - работают без настройки backend
2. **Functions** - serverless функции включены
3. **Analytics** - $9/месяц (опционально)
4. **Split Testing** - A/B тесты бесплатно
5. **Plugins** - оптимизация изображений и т.д.

## 🎉 Поздравляю!

Ваша платформа теперь:
- ✅ Развернута на надежном хостинге
- ✅ Обновляется автоматически
- ✅ Имеет Preview для каждого изменения
- ✅ Защищена SSL сертификатом
- ✅ Оптимизирована для скорости

**Netlify = Отличная альтернатива Vercel без блокировок!**