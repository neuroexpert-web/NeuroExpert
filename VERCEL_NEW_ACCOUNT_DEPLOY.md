# 🚀 Развертывание NeuroExpert на Vercel через новый аккаунт

## Шаг 1: Создание нового Google аккаунта

1. Откройте [accounts.google.com/signup](https://accounts.google.com/signup)
2. Заполните форму:
   - Имя и фамилия (можно использовать псевдоним)
   - Придумайте новый email (например: `neuroexpert2025@gmail.com`)
   - Создайте надежный пароль
3. Подтвердите номер телефона (можно использовать тот же)
4. Запишите данные нового аккаунта

## Шаг 2: Создание нового GitHub аккаунта

1. Откройте [github.com/signup](https://github.com/signup)
2. Используйте новый Google email
3. Придумайте username (например: `neuroexpert-deploy`)
4. Подтвердите email
5. Выберите бесплатный план

## Шаг 3: Копирование проекта

### Вариант А: Fork репозитория (самый простой)
1. Войдите в новый GitHub аккаунт
2. Откройте [github.com/aineuroexpert-cell/AI-Audit](https://github.com/aineuroexpert-cell/AI-Audit)
3. Нажмите кнопку **Fork** в правом верхнем углу
4. Дождитесь создания копии

### Вариант Б: Загрузка архива
1. Скачайте проект как ZIP:
   ```
   https://github.com/aineuroexpert-cell/AI-Audit/archive/refs/heads/main.zip
   ```
2. Распакуйте архив
3. Создайте новый репозиторий в новом GitHub аккаунте
4. Загрузите файлы через веб-интерфейс GitHub

### Вариант В: Через Git (если установлен)
```bash
# Клонируйте проект
git clone https://github.com/aineuroexpert-cell/AI-Audit.git neuroexpert-new
cd neuroexpert-new

# Удалите старый remote
git remote remove origin

# Создайте новый репозиторий на GitHub и добавьте его
git remote add origin https://github.com/ВАШ_НОВЫЙ_USERNAME/neuroexpert.git

# Отправьте код
git push -u origin main
```

## Шаг 4: Регистрация в Vercel

1. Откройте [vercel.com/signup](https://vercel.com/signup)
2. Выберите **Continue with GitHub**
3. Авторизуйтесь с новым GitHub аккаунтом
4. Разрешите Vercel доступ к репозиториям

## Шаг 5: Развертывание проекта

1. В Vercel Dashboard нажмите **Add New Project**
2. Выберите ваш форкнутый/загруженный репозиторий
3. Настройки:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: оставьте пустым
   - **Build Command**: `npm run build`
   - **Output Directory**: оставьте по умолчанию

## Шаг 6: Переменные окружения

Нажмите **Environment Variables** и добавьте:

```
GOOGLE_GEMINI_API_KEY=ваш_ключ_gemini
JWT_SECRET=любая_случайная_строка
ADMIN_PASSWORD_HASH=хэш_пароля_админа
TELEGRAM_BOT_TOKEN=токен_бота (опционально)
TELEGRAM_CHAT_ID=id_чата (опционально)
```

### Получение GOOGLE_GEMINI_API_KEY:
1. Войдите в новый Google аккаунт
2. Откройте [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
3. Нажмите **Create API Key**
4. Скопируйте ключ

## Шаг 7: Деплой

1. Нажмите **Deploy**
2. Дождитесь завершения (3-5 минут)
3. Получите ссылку вида `https://neuroexpert-xxxxxx.vercel.app`

## 🎯 Быстрый способ через GitHub Import

Если не хотите использовать Git:

1. В новом GitHub аккаунте нажмите **+** → **Import repository**
2. URL старого репозитория: `https://github.com/aineuroexpert-cell/AI-Audit`
3. Придумайте имя для нового репозитория
4. Выберите **Public**
5. Нажмите **Begin import**

## 💡 Советы

1. **Имя проекта в Vercel**: используйте уникальное имя (например, `neuroexpert-2025`)
2. **Бесплатный план Vercel**: 
   - Неограниченные личные проекты
   - 100GB bandwidth в месяц
   - Автоматический HTTPS

3. **Альтернативные email сервисы**:
   - ProtonMail (не требует телефон)
   - Outlook
   - Yahoo Mail

## ⚡ Экспресс-метод (5 минут)

1. Создайте GitHub через новый email
2. Импортируйте репозиторий через GitHub Import
3. Зарегистрируйтесь в Vercel через GitHub
4. Разверните проект одним кликом

## 🔐 Безопасность

- Используйте разные пароли для каждого сервиса
- Сохраните все данные доступа в надежном месте
- Включите 2FA где возможно

---

**Результат**: Ваш проект будет доступен на Vercel через 5-10 минут!