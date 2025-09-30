# 🧠 Руководство по интеграции Claude API в NeuroExpert

## 📋 Содержание

1. [Получение ключа API](#получение-ключа-api)
2. [Установка зависимостей](#установка-зависимостей)
3. [Настройка переменных окружения](#настройка-переменных-окружения)
4. [Обновление кода](#обновление-кода)
5. [Тестирование](#тестирование)
6. [Устранение неполадок](#устранение-неполадок)

## 🔑 Получение ключа API

### Шаг 1: Регистрация в Anthropic

1. Перейдите на [console.anthropic.com](https://console.anthropic.com)
2. Создайте аккаунт или войдите
3. Подтвердите email

### Шаг 2: Создание API ключа

1. В консоли перейдите в раздел **API Keys**
2. Нажмите **Create Key**
3. Дайте ключу понятное имя (например, "NeuroExpert Production")
4. Скопируйте ключ (он показывается только один раз!)

## 📦 Установка зависимостей

```bash
# В корне проекта
npm install @anthropic-ai/sdk
```

## 🔧 Настройка переменных окружения

### Локальная разработка

Создайте файл `.env.local` в корне проекта:

```env
# Existing variables
GEMINI_API_KEY=your_gemini_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Claude API
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
```

### Netlify Production

1. Откройте [app.netlify.com](https://app.netlify.com)
2. Выберите ваш сайт
3. Перейдите в **Site settings** → **Environment variables**
4. Добавьте переменную:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-xxxxxxxxxxxxx`
5. Нажмите **Save**

## 💻 Обновление кода

### 1. Обновите `netlify/functions/assistant.js`

Раскомментируйте Claude интеграцию:

```javascript
// В начале файла добавьте
const Anthropic = require('@anthropic-ai/sdk');

// В функции getClaudeResponse замените заглушку на:
async function getClaudeResponse(question, apiKey) {
  const anthropic = new Anthropic({ apiKey: apiKey });
  
  const completion = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1024,
    temperature: 0.7,
    system: KNOWLEDGE_BASE,
    messages: [
      { 
        role: "user", 
        content: `${question}\n\nВАЖНО: Отвечайте как управляющий NeuroExpert, используя информацию из базы знаний.`
      }
    ]
  });
  
  return completion.content[0].text;
}
```

### 2. Модели Claude

Доступные модели:
- `claude-3-opus-20240229` - Самая мощная модель
- `claude-3-sonnet-20240229` - Баланс скорости и качества
- `claude-3-haiku-20240307` - Самая быстрая модель

## 🧪 Тестирование

### 1. Локальное тестирование

```bash
# Запустите функции локально
netlify dev

# Проверьте работу Claude
curl -X POST http://localhost:8888/.netlify/functions/assistant \
  -H "Content-Type: application/json" \
  -d '{"question": "Расскажи о платформе NeuroExpert", "model": "claude"}'
```

### 2. Production тестирование

После деплоя проверьте в UI:
1. Откройте сайт
2. Нажмите на AI чат
3. Переключитесь на Claude
4. Задайте вопрос

## 🔍 Устранение неполадок

### Ошибка: "Claude API key not configured"

**Причина:** Ключ не установлен или неправильный

**Решение:**
1. Проверьте переменную окружения
2. Убедитесь, что ключ начинается с `sk-ant-`
3. Передеплойте сайт после добавления переменной

### Ошибка: "Rate limit exceeded"

**Причина:** Превышен лимит запросов

**Решение:**
1. Подождите 1 минуту
2. Обновите план на Anthropic
3. Используйте кэширование ответов

### Ошибка: "Model not found"

**Причина:** Неправильное имя модели

**Решение:**
Используйте актуальные имена моделей из документации

## 📊 Мониторинг использования

### Anthropic Console

1. Откройте [console.anthropic.com](https://console.anthropic.com)
2. Перейдите в **Usage**
3. Отслеживайте:
   - Количество запросов
   - Использованные токены
   - Расходы

### Telegram уведомления

Все запросы к Claude автоматически логируются в Telegram (если настроен).

## 💰 Стоимость

### Тарифы Claude (на момент написания)

| Модель | Входящие токены | Исходящие токены |
|--------|-----------------|------------------|
| Opus   | $15 / 1M токенов | $75 / 1M токенов |
| Sonnet | $3 / 1M токенов  | $15 / 1M токенов |
| Haiku  | $0.25 / 1M токенов | $1.25 / 1M токенов |

### Оптимизация расходов

1. **Используйте Haiku** для простых вопросов
2. **Кэшируйте ответы** на популярные вопросы
3. **Ограничьте max_tokens** до необходимого минимума
4. **Мониторьте использование** через консоль

## 🔒 Безопасность

1. **Никогда** не коммитьте API ключи
2. Используйте **переменные окружения**
3. Ограничьте доступ по **IP** (в Anthropic Console)
4. Регулярно **ротируйте** ключи

## 📞 Поддержка

- **Документация:** [docs.anthropic.com](https://docs.anthropic.com)
- **Сообщество:** [discord.gg/anthropic](https://discord.gg/anthropic)
- **Email:** support@anthropic.com

---

*Последнее обновление: Январь 2025*