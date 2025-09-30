# 🚀 Пошаговая инструкция ручного развертывания

## ✅ Чек-лист полного развертывания на Netlify

### Шаг 1: Подготовка репозитория ✅

```bash
# Проверить что все коммиты отправлены
git status
git log --oneline -5
git push origin main
```

**Результат:** Все файлы должны быть в GitHub репозитории `AI-Audit`

---

### Шаг 2: Создание нового сайта на Netlify

1. **Откройте:** [netlify.com](https://netlify.com)
2. **Войдите** в аккаунт или создайте новый
3. **Нажмите:** "Add new site" → "Import an existing project"
4. **Выберите:** "Deploy with GitHub"
5. **Авторизуйтесь** в GitHub если потребуется
6. **Найдите репозиторий:** `aineuroexpert-cell/AI-Audit`
7. **Нажмите:** "Deploy site"

---

### Шаг 3: Настройка сборки

**В настройках деплоя укажите:**

| Параметр | Значение |
|----------|----------|
| **Branch to deploy** | `main` |
| **Build command** | `npm run build` |
| **Publish directory** | `out` |
| **Functions directory** | `netlify/functions` |

**⚠️ Важно:** Publish directory должен быть `out`, а не `.next`!

---

### Шаг 4: Настройка переменных окружения

1. Перейдите в **Site settings** → **Environment variables**
2. Нажмите **"Add variable"**
3. Добавьте:

| Key | Value | Описание |
|-----|-------|----------|
| `GEMINI_API_KEY` | `ВАШ_GEMINI_API_KEY` | Google AI Studio API ключ для ИИ-функций |
| `NODE_ENV` | `production` | Режим работы приложения |

**⚠️ КРИТИЧНО:** GEMINI_API_KEY обязателен для работы AI Assistant!

**Где взять API ключ:**
1. Откройте [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Войдите в Google аккаунт
3. Нажмите "Create API key"
4. Скопируйте ключ (начинается с `AIza...`)
5. Вставьте в Netlify Environment Variables

---

### Шаг 5: Проверка файлов конфигурации

**Убедитесь что файлы на месте:**

#### ✅ `netlify.toml`
```toml
[build]
  command = "npm ci && npm run build"
  publish = "out"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### ✅ `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
```

#### ✅ `public/_redirects`
```
/*    /index.html   200
```

#### ✅ `netlify/functions/assistant.js`
Файл должен существовать для AI-функций

---

### Шаг 6: Запуск деплоя

1. **В Netlify панели** нажмите "Trigger deploy"
2. **Выберите:** "Deploy site"
3. **Дождитесь** завершения сборки (3-5 минут)
4. **Проверьте логи** если есть ошибки

---

### Шаг 7: Проверка работоспособности

#### ✅ Основные функции:

- [ ] **Сайт загружается** без ошибок
- [ ] **AI-Управляющий** отображается с аватаром 👨‍💼
- [ ] **Блок безопасности** 🔒 виден над управляющим
- [ ] **Анимация нейросети** 🧠 работает в фоне
- [ ] **Бизнес-калькулятор** с выбором отрасли
- [ ] **FAQ обновлен** с вопросами про безопасность

#### ✅ AI-функции:

- [ ] **Управляющий отвечает** на вопросы
- [ ] **Нет ошибок** в консоли браузера (F12)
- [ ] **API ключ работает** (проверить в Network tab)

---

### Шаг 8: Оптимизация (опционально)

#### Настройка домена:
1. **Site settings** → **Domain management**
2. **Add custom domain** → введите ваш домен
3. **Настройте DNS** у регистратора

#### Настройка уведомлений:
1. **Site settings** → **Build & deploy** → **Deploy notifications**
2. **Add notification** → Email/Slack

---

## 🚨 Решение проблем

### Проблема: "Build failed"
**Решение:**
```bash
# Локально проверить сборку
npm ci
npm run build
```

### Проблема: "AI-управляющий не отвечает"
**Решение:**
1. Проверить API ключ в Environment variables
2. Проверить Functions → assistant → View logs
3. Перегенерировать API ключ на ai.google.dev

### Проблема: "Сайт показывает старую версию"
**Решение:**
1. Очистить кэш: Ctrl+Shift+R
2. Проверить Deploys → последний коммит
3. Trigger deploy manually

### Проблема: "404 при навигации"
**Решение:**
Проверить файл `public/_redirects`

---

## 📋 Финальный чек-лист

- [ ] ✅ Репозиторий обновлен
- [ ] ✅ Netlify сайт создан
- [ ] ✅ Настройки сборки правильные
- [ ] ✅ API ключ добавлен
- [ ] ✅ Деплой успешный
- [ ] ✅ Все функции работают
- [ ] ✅ Анимации отображаются
- [ ] ✅ AI-управляющий отвечает

---

## 🎯 Ожидаемый результат

После успешного деплоя вы получите:

🌟 **Современную платформу с:**
- 👨‍💼 AI-Управляющим с анимированным аватаром
- 🔒 Блоком гарантий безопасности данных
- 🧠 Анимированной нейросетью в фоне
- 💰 Бизнес-калькулятором ROI цифровизации
- ⚡ Плавными анимациями и эффектами

**Время выполнения:** 15-20 минут

**Удачного деплоя! 🚀**
