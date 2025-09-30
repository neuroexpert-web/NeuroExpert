# Исправление проблемы с Telegram уведомлениями

## Проблема
Telegram уведомления не приходят при отправке формы обратной связи.

## Причина
Переменные окружения `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` не загружены в окружение сервера.

## Решение

### 1. Локальная разработка

Создайте файл `.env.local` (уже создан) и заполните реальными значениями:

```bash
# Откройте файл
nano .env.local

# Добавьте ваши реальные значения:
TELEGRAM_BOT_TOKEN=ваш_реальный_токен_бота
TELEGRAM_CHAT_ID=ваш_реальный_chat_id
```

### 2. Перезапустите сервер

```bash
# Остановите текущий сервер
pkill -f "next dev"

# Запустите заново
npm run dev
```

### 3. Проверка на Vercel

Убедитесь, что переменные окружения добавлены в Vercel:

```bash
# Проверьте список переменных
vercel env ls

# Если нет, добавьте:
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
```

### 4. Альтернативный способ загрузки переменных из Vercel

```bash
# Загрузите переменные из Vercel в локальный .env.local
vercel env pull .env.local
```

## Тестирование

### 1. Проверка переменных окружения

```bash
# Проверка в консоли
node -e "console.log('BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set')"
node -e "console.log('CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? 'Set' : 'Not set')"
```

### 2. Тест через API

```bash
# Тест отправки формы
curl -X POST http://localhost:3000/api/contact-form \
  -H "Content-Type: application/json" \
  -H "x-neuroexpert-csrf: 1" \
  -d '{
    "name": "Тест",
    "email": "test@example.com",
    "phone": "+79991234567",
    "message": "Тестовое сообщение"
  }'
```

### 3. Прямой тест Telegram API

```bash
# Замените YOUR_BOT_TOKEN и YOUR_CHAT_ID на реальные значения
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "YOUR_CHAT_ID",
    "text": "Тест уведомления от NeuroExpert"
  }'
```

## Дополнительная диагностика

Если уведомления все еще не приходят:

1. **Проверьте токен бота**: Убедитесь, что бот активен и токен правильный
2. **Проверьте chat_id**: Отправьте сообщение боту и получите chat_id через:
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. **Проверьте логи**: В коде есть console.log для отладки

## Важно

- Не коммитьте файл `.env.local` в git
- Используйте переменные окружения Vercel для продакшена
- Убедитесь, что бот добавлен в нужный чат/канал