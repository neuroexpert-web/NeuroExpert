# 🚀 Полное руководство по развертыванию на Netlify

## 🎯 Пошаговая инструкция

### Шаг 1: Подготовка репозитория

1. **Убедитесь, что все файлы коммитнуты:**
```bash
git add .
git commit -m "Финальная подготовка к деплою"
git push origin main
```

### Шаг 2: Создание сайта на Netlify

1. Войдите на [netlify.com](https://netlify.com)
2. Нажмите **"New site from Git"**
3. Выберите **GitHub** и авторизуйтесь
4. Выберите репозиторий: **AI-Audit**
5. Настройте параметры сборки:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`

### Шаг 3: Настройка переменных окружения

1. Перейдите в **Site settings** → **Environment variables**
2. Добавьте переменную:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `ВАШ_НОВЫЙ_GEMINI_API_KEY`

⚠️ **ВАЖНО:** Получите новый ключ на [ai.google.dev](https://ai.google.dev/) → Create API key → Copy

🔧 **Если ассистент не работает:**
1. Проверьте, что API ключ добавлен в Netlify Environment Variables
2. Перейдите в Functions → assistant → View function log для диагностики
3. Попробуйте Redeploy site после добавления ключа

### Шаг 4: Первый деплой

1. Нажмите **"Deploy site"**
2. Дождитесь завершения сборки (обычно 3-5 минут)
3. Откройте предоставленную ссылку (например: `https://amazing-curie-123456.netlify.app`)

## 🔧 Возможные проблемы и решения

### ❌ Ошибка: "Build failed"

**Причина:** Отсутствуют зависимости или неправильная конфигурация

**Решение:**
1. Проверьте логи сборки в Netlify
2. Убедитесь, что `package.json` содержит все зависимости
3. Проверьте версию Node.js (должна быть 18+)

### ❌ Ошибка: "Function invocation failed"

**Причина:** Неправильная настройка serverless функций

**Решение:**
1. Проверьте, что файл `netlify/functions/assistant.js` существует
2. Убедитесь, что переменная `GEMINI_API_KEY` настроена
3. Проверьте синтаксис JavaScript в функции

### ❌ Ошибка: "404 Not Found" при навигации

**Причина:** Неправильная настройка SPA роутинга

**Решение:**
1. Убедитесь, что файл `public/_redirects` существует
2. Проверьте содержимое: `/*    /index.html   200`

### ❌ Ошибка: "CORS blocked"

**Причина:** Проблемы с Cross-Origin запросами

**Решение:**
Функция уже настроена с CORS headers. Если проблема persists:
1. Очистите кэш браузера
2. Проверьте DevTools → Network tab для деталей

## 🔍 Проверка работоспособности

### ✅ Чек-лист после деплоя:

1. **Основная страница загружается:** ✅
2. **Калькулятор ROI работает:** введите числа и проверьте расчет ✅
3. **AI Ассистент отвечает:** задайте вопрос и дождитесь ответа ✅
4. **FAQ отображается корректно:** ✅
5. **Pop-up открывается и закрывается:** ✅
6. **Адаптивность на мобильных:** откройте с телефона ✅
7. **Анимации работают плавно:** проверьте hover эффекты ✅

### 🧪 Тест API функций:

```bash
# Протестируйте assistant функцию напрямую:
curl -X POST https://your-site.netlify.app/.netlify/functions/assistant \
  -H "Content-Type: application/json" \
  -d '{"question": "Что такое ROI?"}'
```

**Ожидаемый ответ:** JSON с полем `answer`

## 🔒 Безопасность

### Рекомендации после деплоя:

1. **Смените API ключ Gemini:**
   - Перейдите в [Google AI Studio](https://ai.google.dev/)
   - Отзовите старый ключ
   - Создайте новый
   - Обновите в Netlify Environment Variables

2. **Настройте домен (опционально):**
   - Site settings → Domain management
   - Add custom domain

3. **Включите HTTPS (автоматически):**
   - Netlify автоматически выдает SSL сертификат

## 📊 Мониторинг

### Логи и аналитика:

1. **Netlify Analytics:** Site overview → Analytics
2. **Function logs:** Functions → View logs
3. **Build logs:** Deploys → Build log

### Настройка уведомлений:

1. Site settings → Build & deploy → Deploy notifications
2. Добавьте email или Slack для уведомлений об ошибках

## 🚀 Автоматические деплои

Netlify автоматически пересобирает сайт при каждом push в main ветку.

**Отключить автодеплой:**
1. Site settings → Build & deploy
2. Снимите галочку "Auto publishing"

## 📈 Оптимизация производительности

### После успешного деплоя:

1. **Lighthouse audit:** откройте DevTools → Lighthouse
2. **Сжатие изображений:** оптимизируйте favicon.ico
3. **CDN:** Netlify автоматически использует CDN

---

## 🆘 Экстренная поддержка

### Если что-то пошло не так:

1. **Rollback к предыдущей версии:**
   - Deploys → Click on previous successful deploy → Publish deploy

2. **Проверка статуса Netlify:**
   - [status.netlify.com](https://status.netlify.com)

3. **Контакты поддержки:**
   - GitHub Issues в репозитории
   - Netlify Support (для платных планов)

**Время восстановления:** обычно 5-10 минут при rollback

---

**Удачного деплоя! 🎉**
