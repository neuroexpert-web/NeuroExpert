# 🔑 Настройка переменных окружения для Vercel

## Необходимые переменные для работы AI чата:

### 1. GOOGLE_GEMINI_API_KEY
- **Описание**: API ключ для Google Gemini AI
- **Как получить**: 
  1. Перейдите на https://makersuite.google.com/app/apikey
  2. Создайте новый API ключ
  3. Скопируйте ключ (начинается с "AI...")


### 2. GROQ_API_KEY
- **Описание**: API ключ для Mixtral через Groq (быстрый и бесплатный)
- **Как получить**: https://console.groq.com/keys


### 3. OPENROUTER_API_KEY (опционально)
- **Описание**: API ключ для GPT-4 через OpenRouter
- **Как получить**: https://openrouter.ai/


### 3. ANTHROPIC_API_KEY (опционально)
- **Описание**: API ключ для Claude AI
- **Как получить**: https://console.anthropic.com/

### 4. TELEGRAM_BOT_TOKEN (опционально)
- **Описание**: Токен для Telegram уведомлений
- **Как получить**: через @BotFather в Telegram

### 5. TELEGRAM_CHAT_ID (опционально)
- **Описание**: ID чата для уведомлений
- **Как получить**: через @userinfobot в Telegram

## 📝 Добавление в Vercel:

1. Зайдите в панель Vercel
2. Выберите ваш проект
3. Перейдите в Settings → Environment Variables
4. Добавьте переменные:
   - Name: `GOOGLE_GEMINI_API_KEY`
   - Value: `ваш_ключ_gemini`
   - Environment: Production, Preview, Development
5. Нажмите Save

## 🚀 После добавления:
- Сделайте redeploy проекта в Vercel
- AI чат начнет работать автоматически