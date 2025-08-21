# ⚡ Быстрый чеклист настройки NeuroExpert

## 🔴 КРИТИЧЕСКИ ВАЖНО (без этого не заработает)

### 1. Google Gemini API Key
```bash
# Получить здесь: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...
```

### 2. Создать `.env.local`
```bash
# Минимальный набор
GEMINI_API_KEY=AIzaSy...ваш_ключ_gemini
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_PASSWORD=СложныйПароль123!
```

### 3. Установить зависимости
```bash
npm install
npm run prepare  # активирует git hooks
```

---

## 🟡 ВАЖНО (для production)

### GitHub Secrets (Settings → Secrets → Actions)
```
GEMINI_API_KEY     # тот же что в .env.local
JWT_SECRET         # тот же что в .env.local  
ADMIN_PASSWORD     # тот же что в .env.local
CODECOV_TOKEN      # из codecov.io (опционально)
SNYK_TOKEN         # из snyk.io (опционально)
```

### GitHub Settings
1. **Settings → Security & analysis** → Включить все Dependabot опции
2. **Settings → Branches** → Add rule для `main` → Require status checks

---

## 🟢 РЕКОМЕНДУЕТСЯ

### Deployment (выберите один)

**Vercel (проще всего):**
```bash
npx vercel
# Следуйте инструкциям
# Добавьте env переменные в Dashboard
```

**Netlify:**
- Подключите GitHub repo
- Build command: `npm run build`
- Добавьте env переменные

### Мониторинг
```bash
# Sentry для отслеживания ошибок
npx @sentry/wizard@latest -i nextjs
```

---

## ✅ Проверка работоспособности

```bash
# 1. Локальный запуск
npm run dev
# Откройте http://localhost:3000

# 2. Проверьте AI ассистента
# Перейдите на /smart-ai
# Должен работать чат с Gemini

# 3. Проверьте админку
# Перейдите на /admin
# Используйте пароль из ADMIN_PASSWORD

# 4. Запустите тесты
npm test
npm run lint
npm run build
```

---

## 🚨 Частые проблемы

### "API key not valid"
- Проверьте правильность GEMINI_API_KEY
- Убедитесь что ключ активирован в Google Cloud

### "Build failed" 
- Запустите `npm run lint` и исправьте ошибки
- Проверьте все ли env переменные установлены

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Контакты для помощи

- GitHub Issues: создайте issue в репозитории
- Email: support@neuroexpert.ai

---

**Время на базовую настройку: ~15 минут**  
**Время на полную настройку: ~45 минут**