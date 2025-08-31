# ✅ Решение проблемы с Vercel Deployment

## 🔍 Анализ проблемы

Ошибка `The 'functions' property cannot be used in conjunction with the 'builds' property` указывает на конфликт в конфигурации Vercel. 

### Что было сделано:

1. **Проверен локальный `vercel.json`** - файл был упрощен до минимальной конфигурации
2. **Обнаружены API Routes** - в проекте есть множество API endpoints в директории `app/api`
3. **Создана минимальная конфигурация** - теперь `vercel.json` содержит только:
```json
{
  "framework": "nextjs"
}
```

## 🛠 Решение

### Вариант 1: Через GitHub (Рекомендуется)

1. **Commit изменения**:
```bash
git add vercel.json vercel-deploy-trigger.json
git commit -m "Fix Vercel deployment - remove conflicting configuration"
git push origin main
```

2. **В Vercel Dashboard**:
   - Перейдите в проект
   - Нажмите "Redeploy"
   - Выберите "Use different commit" и выберите последний коммит
   - Включите опцию "Clear Build Cache"

### Вариант 2: Через Vercel CLI

Используйте подготовленный скрипт:
```bash
./vercel-clean-deploy.sh
```

Или вручную:
```bash
# Удалите локальную конфигурацию
rm -rf .vercel

# Переподключите проект
vercel

# При подключении выберите:
# - Link to existing project
# - Выберите ваш проект
# - Подтвердите настройки

# Деплой с очисткой кеша
vercel --prod --force
```

### Вариант 3: Полная переконфигурация в Vercel Dashboard

1. Зайдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Найдите ваш проект
3. Settings → General → Framework Preset
4. Убедитесь, что выбран "Next.js"
5. Settings → Functions (если есть такой раздел)
   - Удалите любые кастомные настройки
6. Settings → Environment Variables
   - Добавьте необходимые переменные:
     - `GEMINI_API_KEY`
     - `NEXT_PUBLIC_APP_URL`
     - Другие API ключи

## 📋 Чеклист после деплоя

- [ ] Главная страница загружается
- [ ] Навигация между 10 страницами работает
- [ ] AI ассистент отвечает на вопросы
- [ ] API endpoints доступны (`/api/health`)
- [ ] Нет ошибок в консоли браузера
- [ ] Мобильная версия работает корректно

## 🚨 Если проблема остается

1. **Проверьте логи сборки** в Vercel Dashboard → Functions → Logs
2. **Убедитесь**, что в репозитории нет других файлов конфигурации:
   - `now.json` (старый формат)
   - `.nowignore`
   - `vercel.json` в других директориях

3. **Создайте новый проект** в Vercel:
   - Это самый быстрый способ сбросить все настройки
   - Импортируйте репозиторий заново
   - Настройте переменные окружения

## 📞 Поддержка

Если ничего не помогает:
1. Откройте [Vercel Support](https://vercel.com/support)
2. Приложите:
   - Скриншот ошибки
   - Содержимое этого файла
   - Ссылку на репозиторий

---

**Статус**: Проблема должна быть решена после применения минимальной конфигурации
**Дата**: 31 января 2025
**Версия проекта**: 3.1.1