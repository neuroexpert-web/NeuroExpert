# 🔐 АНАЛИЗ ПРОБЛЕМ БЕЗОПАСНОСТИ GITHUB

**Дата:** 20 августа 2025

---

## 🚨 ВОЗМОЖНЫЕ ПРИЧИНЫ ОШИБОК ИЗ-ЗА НАСТРОЕК БЕЗОПАСНОСТИ

### 1. **Branch Protection Rules**
Если включены правила защиты ветки main:
- ❌ Требование Pull Request перед merge
- ❌ Требование code review
- ❌ Блокировка force push
- ❌ Требование проверки статусов

**Решение:**
```bash
# Временно отключить в GitHub Settings → Branches → main
# Или создать новую ветку для деплоя
git checkout -b production-deploy
git push origin production-deploy
```

### 2. **Secrets и Permissions**
Проблемы с GitHub Secrets:
- ❌ Отсутствие необходимых secrets
- ❌ Ограничения на использование secrets в форках
- ❌ Истекшие токены

**Проверить в GitHub:**
- Settings → Secrets and variables → Actions
- Убедиться что есть:
  - `GOOGLE_GEMINI_API_KEY`
  - `JWT_SECRET`
  - `ADMIN_PASSWORD_HASH`
  - `VERCEL_TOKEN` (если используется)

### 3. **GitHub Actions Permissions**
Ограничения workflows:
- ❌ Read-only permissions для GITHUB_TOKEN
- ❌ Отключены Actions для репозитория
- ❌ Ограничения на внешние Actions

**Решение:**
```
Settings → Actions → General → Workflow permissions
→ Выбрать "Read and write permissions"
```

### 4. **Vercel Integration**
Проблемы с интеграцией:
- ❌ Отозваны permissions для Vercel app
- ❌ Изменился scope доступа
- ❌ Блокировка webhooks

**Проверить:**
1. GitHub Settings → Applications → Authorized OAuth Apps → Vercel
2. Vercel Dashboard → Settings → Git → Reconnect

### 5. **CSP и Security Headers**
Слишком строгие заголовки:
- ❌ X-Content-Type-Options: nosniff блокирует CSS
- ❌ CSP блокирует внешние ресурсы
- ❌ CORS ограничения

---

## 🔧 РЕКОМЕНДУЕМЫЕ ДЕЙСТВИЯ

### Шаг 1: Проверить Branch Protection
```bash
# Попробовать push в новую ветку
git checkout -b test-deploy
git push origin test-deploy
```

### Шаг 2: Проверить Vercel Integration
1. Зайти в Vercel Dashboard
2. Project Settings → Git
3. Нажать "Disconnect" и затем "Connect" заново
4. Выбрать репозиторий и ветку

### Шаг 3: Временно упростить безопасность
В `next.config.js`:
```javascript
const ContentSecurityPolicy = `
  default-src * 'unsafe-inline' 'unsafe-eval';
  script-src * 'unsafe-inline' 'unsafe-eval';
  style-src * 'unsafe-inline';
`;
```

### Шаг 4: Проверить GitHub Secrets
```bash
# В GitHub Actions логах проверить
# Есть ли warnings о missing secrets
```

### Шаг 5: Альтернативный деплой
Если ничего не помогает:
```bash
# Локальный build и деплой через Vercel CLI
npm install -g vercel
vercel --prod
```

---

## 📋 ЧЕКЛИСТ ПРОВЕРКИ

- [ ] Branch protection rules отключены или настроены правильно
- [ ] GitHub Secrets добавлены и актуальны  
- [ ] Workflow permissions = read/write
- [ ] Vercel integration переподключена
- [ ] CSP headers не блокируют ресурсы
- [ ] GITHUB_TOKEN имеет нужные права
- [ ] Webhooks от Vercel не заблокированы

---

## 🆘 ЭКСТРЕННОЕ РЕШЕНИЕ

Если ничего не работает, создать новый репозиторий:
```bash
# Клонировать в новый репозиторий
git remote add new-origin https://github.com/YOUR_USER/NEW_REPO.git
git push new-origin main
```

Затем подключить новый репозиторий к Vercel.