# 🚀 ИНСТРУКЦИЯ ПО РАЗВЕРТЫВАНИЮ НА VERCEL

## 📋 БЫСТРЫЙ СПОСОБ (через веб-интерфейс)

### 1️⃣ Откройте Vercel и авторизуйтесь:
👉 https://vercel.com/login

### 2️⃣ Импортируйте проект:
1. Нажмите **"Add New..."** → **"Project"**
2. Выберите **"Import Git Repository"**
3. Если репозиторий на GitHub:
   - Авторизуйте Vercel для доступа к GitHub
   - Выберите репозиторий `neuroexpert` или `AI-Audit`
4. Если локальный проект:
   - Используйте **"Import Third-Party Git Repository"**
   - Или загрузите через CLI (см. ниже)

### 3️⃣ Настройте проект:
**Project Name**: `neuroexpert`  
**Framework Preset**: `Next.js`  
**Root Directory**: `./` (оставить пустым)  
**Build Command**: `npm run build`  
**Output Directory**: `.next`  

### 4️⃣ Добавьте переменные окружения:
Нажмите **"Environment Variables"** и добавьте:

```
GOOGLE_GEMINI_API_KEY = [ваш ключ Gemini API]
JWT_SECRET = [сгенерируйте случайную строку]
ADMIN_PASSWORD_HASH = $2a$10$[ваш хеш пароля]
NEXT_PUBLIC_SITE_URL = https://[ваш-проект].vercel.app
```

### 5️⃣ Нажмите **"Deploy"**

---

## 💻 АЛЬТЕРНАТИВНЫЙ СПОСОБ (через CLI)

### 1️⃣ Установите Vercel CLI:
```bash
npm i -g vercel
```

### 2️⃣ Авторизуйтесь:
```bash
vercel login
```
Следуйте инструкциям (откроется браузер)

### 3️⃣ Запустите деплой:
```bash
# В корне проекта выполните:
vercel

# Ответьте на вопросы:
# - Set up and deploy? → Y
# - Which scope? → выберите ваш аккаунт
# - Link to existing project? → N
# - Project name? → neuroexpert
# - In which directory? → ./
# - Override settings? → N
```

### 4️⃣ Деплой в production:
```bash
vercel --prod
```

---

## 🔐 ГЕНЕРАЦИЯ ПАРОЛЕЙ

### Для JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Для ADMIN_PASSWORD_HASH:
```bash
node scripts/generate-password-hash.js yourpassword
```

---

## 🎯 ПОСЛЕ ДЕПЛОЯ

1. **Проверьте сайт**: https://neuroexpert.vercel.app
2. **Настройте домен** (опционально): Settings → Domains
3. **Включите аналитику**: Settings → Analytics
4. **Настройте Preview Deployments** для команды

---

## ⚡ БЫСТРЫЙ ДЕПЛОЙ (если уже настроено)

```bash
# Просто выполните:
./deploy-vercel.sh

# Или вручную:
vercel --prod
```

---

## 🆘 ПРОБЛЕМЫ?

### "Token is not valid":
→ Выполните `vercel login`

### "Build failed":
→ Проверьте `npm run build` локально
→ Убедитесь, что все зависимости установлены

### "Environment variables missing":
→ Добавьте переменные в Vercel Dashboard
→ Settings → Environment Variables

---

**Проект готов к деплою!** Все конфигурационные файлы настроены. 🚀