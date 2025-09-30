# 🎯 Детальное руководство по настройке Netlify

## 📝 Шаг 1: Создание нового сайта

### При импорте из GitHub:

1. **Add new site** → **Import an existing project**
2. **Connect to Git provider** → **GitHub**
3. **Pick a repository** → Выберите ваш репозиторий

## 📋 Шаг 2: Настройки сборки (Build settings)

### Заполните ВСЕ поля точно так:

```
Branch to deploy:        main (или cursor/say-hello-2df0)
Base directory:          [оставьте пустым]
Build command:           npm run build
Publish directory:       .next
Functions directory:     netlify/functions
```

### Дополнительные настройки:

```
Production branch:       main
Deploy log visibility:   Logs are public
Build status:           Active
```

## 🔐 Шаг 3: Переменные окружения (Environment Variables)

### Перейдите в: Site settings → Environment variables → Add a variable

### 1️⃣ ОБЯЗАТЕЛЬНЫЕ переменные:

#### GOOGLE_GEMINI_API_KEY
```
Key:    GOOGLE_GEMINI_API_KEY
Value:  [ваш API ключ от Google Gemini]
Scopes: ✅ Production ✅ Preview ✅ Deploy Previews ✅ Branch deploys ✅ Local development
```
**Как получить:**
1. Перейдите на https://aistudio.google.com/apikey
2. Нажмите "Create API Key"
3. Выберите проект или создайте новый
4. Скопируйте ключ вида: AIzaSyD-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

#### TELEGRAM_BOT_TOKEN
```
Key:    TELEGRAM_BOT_TOKEN
Value:  [токен вашего Telegram бота]
Scopes: ✅ Production ✅ Preview ✅ Deploy Previews ✅ Branch deploys ✅ Local development
```
**Как получить:**
1. Откройте @BotFather в Telegram
2. Отправьте `/newbot`
3. Придумайте имя бота (например: NeuroExpert Notifications)
4. Придумайте username (например: neuroexpert_notify_bot)
5. Скопируйте токен вида: 1234567890:AAEhBP0av18gDaXwBgKen6rG9aTzjrun4

#### TELEGRAM_CHAT_ID
```
Key:    TELEGRAM_CHAT_ID
Value:  [ваш chat ID]
Scopes: ✅ Production ✅ Preview ✅ Deploy Previews ✅ Branch deploys ✅ Local development
```
**Как получить:**
1. Отправьте любое сообщение вашему боту
2. Откройте в браузере: https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates
3. Найдите в ответе: "chat":{"id":123456789}
4. Скопируйте число (это ваш chat_id)

### 2️⃣ ОПЦИОНАЛЬНЫЕ переменные:

#### ANTHROPIC_API_KEY (для Claude AI)
```
Key:    ANTHROPIC_API_KEY
Value:  [ваш API ключ от Anthropic]
Scopes: ✅ Production ✅ Preview ✅ Deploy Previews ✅ Branch deploys ✅ Local development
```
**Как получить:**
1. Зарегистрируйтесь на https://console.anthropic.com
2. Перейдите в Account Settings → API Keys
3. Нажмите "Create Key"
4. Скопируйте ключ вида: sk-ant-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

#### NEXT_PUBLIC_GA_ID (Google Analytics)
```
Key:    NEXT_PUBLIC_GA_ID
Value:  [ваш Google Analytics ID]
Scopes: ✅ Production ✅ Preview ✅ Deploy Previews ✅ Branch deploys ✅ Local development
```
**Как получить:**
1. Перейдите в Google Analytics
2. Админ → Создать ресурс
3. После создания найдите Measurement ID
4. Скопируйте ID вида: G-XXXXXXXXXX

#### NEXT_PUBLIC_YM_ID (Яндекс.Метрика)
```
Key:    NEXT_PUBLIC_YM_ID
Value:  [номер счетчика Яндекс.Метрики]
Scopes: ✅ Production ✅ Preview ✅ Deploy Previews ✅ Branch deploys ✅ Local development
```
**Как получить:**
1. Зайдите в https://metrika.yandex.ru
2. Нажмите "Добавить счетчик"
3. Заполните данные сайта
4. Скопируйте номер счетчика (только цифры): 12345678

## 🌐 Шаг 4: Настройка домена

### Site settings → Domain management

#### Вариант А: Бесплатный домен Netlify
1. Нажмите **"Change site name"**
2. Введите желаемое имя: `neuroexpert` (или другое)
3. Ваш сайт будет доступен по: `https://neuroexpert.netlify.app`

#### Вариант Б: Собственный домен
1. Нажмите **"Add custom domain"**
2. Введите ваш домен: `neuroexpert.ai`
3. Следуйте инструкциям по настройке DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: neuroexpert.netlify.app
   ```

## ⚡ Шаг 5: Дополнительные настройки

### Build & deploy → Continuous deployment

```
Build settings:
- Auto publishing:          ✅ Enabled
- Deploy previews:          ✅ Any pull request
- Branch deploys:           ✅ All
- Deploy notifications:     Добавьте email для уведомлений
```

### Build & deploy → Post processing

```
- Asset optimization:       ✅ Bundle CSS
- Asset optimization:       ✅ Bundle JS  
- Asset optimization:       ✅ Minify JS
- Pretty URLs:             ✅ Enabled
- Snippet injection:        ❌ Disabled (у нас свой analytics)
```

### Functions → Settings

```
- Functions directory:      netlify/functions
- Bundler:                 esbuild
- Node.js version:         18.x
```

## 📊 Шаг 6: Мониторинг и аналитика

### Analytics → Enable analytics
```
- Netlify Analytics:       $9/месяц (опционально)
- Показывает реальную статистику посещений
```

### Logs → Function logs
```
- Проверяйте логи функций для отладки
- Особенно важно для assistant.js и telegram-notify.js
```

## 🚨 Шаг 7: Проверка после развертывания

### Чек-лист проверки:

1. **Главная страница:**
   - [ ] Загружается без ошибок
   - [ ] Анимированный логотип работает
   - [ ] Фоновая анимация плавная

2. **AI Чат:**
   - [ ] Кнопка чата видна
   - [ ] Чат открывается
   - [ ] Отвечает на вопросы
   - [ ] Переключение между Gemini/Claude работает

3. **Контактная форма:**
   - [ ] Форма отправляется
   - [ ] Показывается сообщение об успехе
   - [ ] Приходит уведомление в Telegram

4. **Мобильная версия:**
   - [ ] Сайт адаптивен
   - [ ] Все элементы видны
   - [ ] Прокрутка работает

5. **API проверка (F12 → Network):**
   - [ ] /.netlify/functions/assistant - статус 200
   - [ ] /.netlify/functions/contact-form - статус 200
   - [ ] /.netlify/functions/telegram-notify - статус 200

## 🔴 Частые ошибки и решения

### Ошибка: "Build failed"
**Проверьте:**
- Все ли зависимости в package.json
- Правильная ли версия Node.js (18)
- Нет ли синтаксических ошибок

### Ошибка: "Function timeout"
**Решение:**
- Проверьте API ключи
- Убедитесь что Telegram бот активен
- Проверьте логи функций

### Ошибка: "CORS error"
**Решение:**
- Проверьте netlify.toml
- Убедитесь что используете относительные пути API

## 📱 Контакты для тестирования

После развертывания проверьте что отображаются:
- Телефон: **+7 (904) 047-63-83**
- Email: **aineuroexpert@gmail.com**

## 🎉 Финальный результат

После выполнения всех шагов у вас будет:
1. ✅ Рабочий сайт на https://ваш-домен.netlify.app
2. ✅ Функционирующий AI чат
3. ✅ Telegram уведомления о заявках
4. ✅ Аналитика подключена
5. ✅ SSL сертификат автоматически

---

💡 **Совет:** Сохраните все API ключи в надежном месте. Вы можете использовать менеджер паролей для их хранения.