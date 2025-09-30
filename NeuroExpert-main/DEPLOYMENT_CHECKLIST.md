# ✅ Чек-лист перед развертыванием на Netlify

## 🔍 Код и конфигурация

- [x] Все компоненты используют `dynamic` import с `ssr: false` для браузерных API
- [x] Нет прямых обращений к `window`, `document`, `navigator` без проверок
- [x] `package.json` содержит все необходимые зависимости
- [x] `netlify.toml` настроен правильно
- [x] Создан `.env.example` файл с примерами переменных
- [x] `.gitignore` исключает `.env.local` и другие чувствительные файлы

## 📦 Зависимости

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@google/generative-ai": "^0.15.0"
  },
  "devDependencies": {
    "@netlify/plugin-nextjs": "^5.0.0"
  }
}
```

## 🔐 Переменные окружения

### Обязательные:
- [ ] `GOOGLE_GEMINI_API_KEY` - для AI чата
- [ ] `TELEGRAM_BOT_TOKEN` - для уведомлений
- [ ] `TELEGRAM_CHAT_ID` - для получения уведомлений

### Опциональные:
- [ ] `ANTHROPIC_API_KEY` - для Claude AI
- [ ] `NEXT_PUBLIC_GA_ID` - Google Analytics
- [ ] `NEXT_PUBLIC_YM_ID` - Яндекс.Метрика

## 🚀 Команды для развертывания

```bash
# 1. Проверка локальной сборки
npm run build

# 2. Очистка кэша
rm -rf .next node_modules
npm install

# 3. Создание/обновление репозитория
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

## 📋 Настройки Netlify

### Build settings:
- **Branch:** main
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** `netlify/functions`

### Плагины:
- [x] `@netlify/plugin-nextjs` (добавлен в netlify.toml)

## 🧪 Тестирование после развертывания

- [ ] Главная страница загружается без ошибок
- [ ] AI чат отвечает на вопросы
- [ ] Контактная форма отправляется
- [ ] Telegram уведомления приходят
- [ ] Анимации работают плавно
- [ ] Мобильная версия адаптивна
- [ ] PWA функции работают (установка приложения)
- [ ] Нет ошибок в консоли браузера
- [ ] API endpoints отвечают корректно

## ⚠️ Возможные проблемы

1. **Build timeout** - оптимизируйте сборку или увеличьте лимит
2. **Function timeout** - serverless функции должны отвечать быстро
3. **CORS ошибки** - проверьте заголовки в netlify.toml
4. **404 на API** - проверьте редиректы в netlify.toml

## 📱 Контакты для проверки

- Телефон: +7 (904) 047-63-83
- Email: aineuroexpert@gmail.com
- Telegram бот для уведомлений настроен

## 🎯 Финальные шаги

1. [ ] Загрузить код на GitHub
2. [ ] Подключить репозиторий к Netlify
3. [ ] Добавить все переменные окружения
4. [ ] Запустить первую сборку
5. [ ] Проверить все функции
6. [ ] Настроить кастомный домен (опционально)
7. [ ] Включить автоматические деплои

---

✨ После выполнения всех пунктов ваш сайт будет готов к работе!
