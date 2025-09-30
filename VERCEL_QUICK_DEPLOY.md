# ⚡ Быстрый деплой на Vercel за 5 минут

## Самый простой способ:

### 1. Создайте новый GitHub аккаунт
- Используйте любой email (Gmail, Outlook, Yahoo)
- Username: например `neuroexpert-app`

### 2. Импортируйте проект (без Git!)
1. В новом GitHub нажмите **+** → **Import repository**
2. Вставьте URL: `https://github.com/aineuroexpert-cell/AI-Audit`
3. Имя нового репо: `neuroexpert`
4. Нажмите **Begin import** (займет 1-2 минуты)

### 3. Зарегистрируйтесь в Vercel
1. Откройте [vercel.com](https://vercel.com)
2. Нажмите **Sign Up**
3. Выберите **Continue with GitHub**
4. Войдите с новым GitHub

### 4. Разверните проект
1. В Vercel нажмите **Add New Project**
2. Выберите репозиторий `neuroexpert`
3. Добавьте переменные окружения:
   ```
   GOOGLE_GEMINI_API_KEY = AIzaSy... (получите на makersuite.google.com)
   JWT_SECRET = my-secret-key-123
   ADMIN_PASSWORD_HASH = $2b$10$... (или используйте тестовый ниже)
   ```

### 5. Нажмите Deploy!

## 🔑 Тестовые данные для быстрого старта:

```
GOOGLE_GEMINI_API_KEY = нужен настоящий ключ
JWT_SECRET = test-secret-key-12345
ADMIN_PASSWORD_HASH = $2b$10$X4kv7j5ZcG39WgogSl16au7eW0eL6lJnDPN6KJrp.XAiSUnSaFTXu
```
(тестовый пароль админа: `admin123`)

## 💡 Если Vercel требует подтверждение:

Попробуйте альтернативы:
1. **Netlify** - [netlify.com](https://netlify.com) (не требует подтверждения)
2. **Railway** - [railway.app](https://railway.app) (проще всего)
3. **Render** - [render.com](https://render.com) (есть бесплатный план)

## 📱 Альтернативные email для регистрации:

- **ProtonMail** - не требует телефон
- **Temp Mail** - временная почта для тестов
- **Outlook** - от Microsoft
- **Yahoo Mail** - классика

---

**Результат**: Ваш сайт будет доступен на `https://neuroexpert.vercel.app` через 3-5 минут!