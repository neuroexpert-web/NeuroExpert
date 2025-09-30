# 📚 ПОДРОБНАЯ ИНСТРУКЦИЯ: Развертывание NeuroExpert на Cloudflare Pages

## 🚀 Шаг 1: Регистрация на Cloudflare

### 1.1 Откройте браузер и перейдите:
```
https://dash.cloudflare.com/sign-up
```

### 1.2 Заполните форму регистрации:
- **Email address**: ваш_email@gmail.com
- **Password**: создайте надежный пароль (минимум 8 символов)
- ✅ Поставьте галочку "I agree to Cloudflare's Terms of Service"
- Нажмите **"Sign Up"**

### 1.3 Альтернатива - вход через Google:
- Нажмите **"Sign up with Google"**
- Выберите ваш Google аккаунт
- Разрешите доступ

### 1.4 Подтверждение email:
- Откройте вашу почту
- Найдите письмо от Cloudflare
- Нажмите **"Verify email"**

## 🎯 Шаг 2: Вход в панель управления

### 2.1 После подтверждения вы попадете в Dashboard
- Если нет, войдите через: https://dash.cloudflare.com

### 2.2 Пропустите начальную настройку:
- Если появится "Add a website" - нажмите **"Skip"**
- Мы будем использовать Pages, а не основной функционал

## 📄 Шаг 3: Переход к Cloudflare Pages

### 3.1 В левом меню найдите:
- Иконка с тремя линиями (☰) если меню свернуто
- Найдите **"Workers & Pages"**
- Нажмите на него

### 3.2 Выберите вкладку Pages:
- Вверху будет две вкладки: "Workers" и **"Pages"**
- Нажмите на **"Pages"**

## 🔨 Шаг 4: Создание проекта

### 4.1 Нажмите кнопку:
```
Create a project
```

### 4.2 Выберите способ:
- **"Connect to Git"** (НЕ Direct Upload!)

## 🔗 Шаг 5: Подключение GitHub

### 5.1 Авторизация GitHub:
- Нажмите **"Connect GitHub"**
- Откроется окно GitHub
- Введите логин/пароль GitHub если нужно
- Нажмите **"Authorize Cloudflare Pages"**

### 5.2 Выбор репозитория:
- В поле поиска введите: `AI-Audit`
- Найдите репозиторий: **aineuroexpert-cell/AI-Audit**
- Нажмите на него

### 5.3 Если репозиторий не отображается:
- Нажмите **"Configure GitHub access"**
- Выберите "All repositories" или добавьте конкретный
- Сохраните и вернитесь

## ⚙️ Шаг 6: Настройка сборки (ВАЖНО!)

### 6.1 Основные настройки:

| Поле | Значение |
|------|----------|
| **Project name** | `neuroexpert` |
| **Production branch** | `main` |

### 6.2 Build settings:

| Поле | Значение |
|------|----------|
| **Framework preset** | Выберите **Next.js** из выпадающего списка |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Root directory (Advanced)** | Оставить пустым |

### 6.3 Environment variables (ОЧЕНЬ ВАЖНО!):

Прокрутите вниз до **"Environment variables"**

Нажмите **"Add variable"** и добавьте ВСЕ эти переменные:

#### Переменная 1:
- **Variable name**: `NODE_VERSION`
- **Value**: `18`
- Нажмите **"Add variable"**

#### Переменная 2:
- **Variable name**: `GOOGLE_GEMINI_API_KEY`
- **Value**: Ваш ключ от Google AI
- Как получить:
  1. Откройте https://makersuite.google.com/app/apikey
  2. Нажмите "Create API Key"
  3. Скопируйте ключ
- Нажмите **"Add variable"**

#### Переменная 3:
- **Variable name**: `JWT_SECRET`
- **Value**: Любая случайная строка 32 символа
- Пример: `your-super-secret-jwt-key-123456`
- Или сгенерируйте: https://randomkeygen.com/
- Нажмите **"Add variable"**

#### Переменная 4:
- **Variable name**: `ADMIN_PASSWORD_HASH`
- **Value**: `$2a$10$k8Y5A3UmPQ5l6J9H8K3Jqe5N9Q5L6M9K8J3H6G5F4D3S2A1Z0X9Y8`
- Это хеш для пароля "admin123" (ОБЯЗАТЕЛЬНО смените позже!)
- Нажмите **"Add variable"**

#### Переменная 5:
- **Variable name**: `TELEGRAM_BOT_TOKEN`
- **Value**: Ваш токен бота (если есть)
- Если нет, оставьте пустым: ``
- Нажмите **"Add variable"**

#### Переменная 6:
- **Variable name**: `TELEGRAM_CHAT_ID`
- **Value**: Ваш chat ID (если есть)
- Если нет, оставьте пустым: ``
- Нажмите **"Add variable"**

#### Переменная 7:
- **Variable name**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://neuroexpert.pages.dev`
- Нажмите **"Add variable"**

### 6.4 Проверьте все переменные:
У вас должно быть 7 переменных:
1. NODE_VERSION = 18
2. GOOGLE_GEMINI_API_KEY = ваш-ключ
3. JWT_SECRET = случайная-строка
4. ADMIN_PASSWORD_HASH = $2a$10$...
5. TELEGRAM_BOT_TOKEN = токен-или-пусто
6. TELEGRAM_CHAT_ID = id-или-пусто
7. NEXT_PUBLIC_SITE_URL = https://neuroexpert.pages.dev

## 🚀 Шаг 7: Запуск развертывания

### 7.1 Нажмите большую кнопку:
```
Save and Deploy
```

### 7.2 Наблюдайте за процессом:
- Откроется страница с логами сборки
- Процесс займет 3-5 минут
- Вы увидите:
  - Initializing build environment ✓
  - Cloning repository ✓
  - Installing dependencies ✓
  - Building application ✓
  - Deploying to Cloudflare's global network ✓

### 7.3 Если сборка не удалась:
- Проверьте логи ошибок
- Чаще всего проблема в:
  - Неправильной версии Node (должна быть 18)
  - Отсутствующих переменных окружения
  - Неправильном build command

## ✅ Шаг 8: Проверка работы

### 8.1 После успешной сборки:
- Вы увидите сообщение **"Success! Your site is live"**
- Появится ссылка: `https://neuroexpert.pages.dev`

### 8.2 Откройте сайт:
- Нажмите на ссылку
- Или введите в браузере: `https://neuroexpert.pages.dev`

### 8.3 Проверьте функциональность:
1. Загрузилась ли главная страница?
2. Работает ли анимация логотипа?
3. Нажмите "Запустить демо" - открывается ли AI директор?
4. Можно ли закрыть AI директора?

## 🔧 Шаг 9: Настройка автоматических обновлений

### 9.1 Проверьте вкладку Deployments:
- В проекте перейдите на вкладку **"Deployments"**
- Вы должны видеть "Production" deployment

### 9.2 Автоматические обновления уже включены!
- Каждый push в ветку `main` на GitHub
- Автоматически запустит новую сборку
- Сайт обновится через 3-5 минут

## 🎯 Шаг 10: Дополнительные настройки

### 10.1 Custom Domain (опционально):
- Settings → Custom domains
- Add custom domain
- Следуйте инструкциям DNS

### 10.2 Web Analytics:
- Settings → Web Analytics
- Enable Web Analytics (бесплатно!)

### 10.3 Настройка Preview deployments:
- Settings → Builds & deployments
- Preview deployments уже включены
- Каждый PR будет иметь свой URL

## 🚨 Частые проблемы и решения:

### Проблема 1: Build failed
**Решение**: 
- Проверьте NODE_VERSION = 18
- Проверьте все переменные окружения

### Проблема 2: 404 ошибка
**Решение**:
- Подождите 5 минут после деплоя
- Проверьте правильность build output directory

### Проблема 3: AI не работает
**Решение**:
- Проверьте GOOGLE_GEMINI_API_KEY
- Убедитесь что ключ активен

## 📞 Поддержка:

- **Cloudflare Community**: community.cloudflare.com
- **Документация**: developers.cloudflare.com/pages
- **Status**: cloudflarestatus.com

## 🎉 Поздравляю! Ваш сайт развернут!

**Ваш адрес**: https://neuroexpert.pages.dev

**Что дальше**:
1. Протестируйте все функции
2. Настройте свой домен (если есть)
3. Включите аналитику
4. Наслаждайтесь автоматическими обновлениями!

---

**Совет**: Сохраните эту инструкцию, она пригодится для будущих проектов!