# 📱 TELEGRAM ИНТЕГРАЦИЯ - ПОДРОБНАЯ НАСТРОЙКА

## 🎯 ПОЛНОЕ РУКОВОДСТВО ПО TELEGRAM ДЛЯ NEUROEXPERT

Этот документ содержит **исчерпывающие инструкции** по настройке Telegram интеграции с примерами команд, скриптами и troubleshooting.

---

## 🤖 СОЗДАНИЕ TELEGRAM БОТА

### Шаг 1: Регистрация через @BotFather

1. **Найдите @BotFather** в Telegram: [t.me/botfather](https://t.me/botfather)
2. **Отправьте команды**:
   ```
   /start
   /newbot
   ```
3. **Введите данные**:
   - Имя бота: `NeuroExpert Notifications`
   - Username: `neuroexpert_notifications_bot`
   - Описание: `Уведомления о заявках с платформы NeuroExpert`

4. **Сохраните токен**: `1234567890:AAEhBP0av18gDaXwBgKen6rG9aTzjrun4q8`

### Шаг 2: Настройка бота в @BotFather

```bash
# Установка описания
/setdescription
NeuroExpert Notifications Bot

Бот для автоматических уведомлений о новых заявках, системных событиях и аналитике платформы NeuroExpert.

Функции:
🆕 Уведомления о заявках
📊 Ежедневная аналитика  
⚡ Системные алерты
🛡️ Мониторинг безопасности

# Краткое описание
/setabouttext
Официальный бот платформы NeuroExpert для уведомлений и мониторинга

# Команды бота
/setcommands
start - 🚀 Запуск бота и приветствие
status - ⚡ Статус всех систем платформы
stats - 📊 Статистика за сегодня/неделю/месяц
leads - 📋 Последние заявки (только для админов)
health - 💚 Детальная проверка здоровья системы
analytics - 📈 Аналитические данные
settings - ⚙️ Настройки уведомлений
help - ❓ Помощь и список команд
ping - 🏓 Проверка связи с ботом

# Дополнительные настройки
/setjoingroups - Disable
/setprivacy - Disable
```

---

## 🆔 ПОЛУЧЕНИЕ CHAT ID (3 СПОСОБА)

### Способ 1: Через API (Рекомендуется)

1. **Отправьте любое сообщение боту** (например: "Привет")
2. **Откройте в браузере**:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
3. **Найдите в JSON ответе**:
   ```json
   {
     "update_id": 123456789,
     "message": {
       "message_id": 1,
       "from": {
         "id": 987654321,
         "is_bot": false,
         "first_name": "Ваше Имя"
       },
       "chat": {
         "id": 987654321,  <- ЭТО ВАШ CHAT_ID
         "first_name": "Ваше Имя",
         "type": "private"
       }
     }
   }
   ```

### Способ 2: Для группового чата

1. **Добавьте бота в группу**
2. **Сделайте бота администратором** (обязательно!)
3. **Отправьте сообщение в группу**: `/start`
4. **Используйте тот же API запрос**
5. **Chat ID группы будет отрицательным**: `-1001234567890`

### Способ 3: Через специальных ботов

1. **@userinfobot**: [t.me/userinfobot](https://t.me/userinfobot)
   - Отправьте `/start` 
   - Получите ваш User ID

2. **@get_id_bot**: [t.me/get_id_bot](https://t.me/get_id_bot)
   - Добавьте в группу для получения Group ID

---

## ⚙️ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

### Базовая конфигурация:
```env
# Основные настройки
TELEGRAM_BOT_TOKEN=1234567890:AAEhBP0av18gDaXwBgKen6rG9aTzjrun4q8
TELEGRAM_CHAT_ID=987654321
TELEGRAM_ADMIN_CHAT_ID=987654321

# Настройки уведомлений
TELEGRAM_NOTIFICATIONS_ENABLED=true
TELEGRAM_ALERTS_ENABLED=true
TELEGRAM_DEBUG_ENABLED=false

# Для групповых чатов
TELEGRAM_GROUP_CHAT_ID=-1001234567890
TELEGRAM_THREAD_ID=123  # Если используете топики
```

### Расширенная конфигурация:
```env
# Разные типы уведомлений в разные чаты
TELEGRAM_LEADS_CHAT_ID=111111111      # Заявки
TELEGRAM_ALERTS_CHAT_ID=222222222     # Алерты  
TELEGRAM_ANALYTICS_CHAT_ID=333333333  # Аналитика
TELEGRAM_LOGS_CHANNEL_ID=-1001111111  # Логи (канал)

# Настройки отправки
TELEGRAM_RATE_LIMIT=20                # Сообщений в минуту
TELEGRAM_RETRY_ATTEMPTS=3             # Попытки повтора
TELEGRAM_TIMEOUT=10000                # Таймаут в мс

# Webhook настройки
TELEGRAM_WEBHOOK_URL=https://neuroexpert.ai/api/telegram-webhook
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret_key
```

---

## 📬 ТИПЫ УВЕДОМЛЕНИЙ И ШАБЛОНЫ

### 1. Новая заявка
```javascript
const newLeadTemplate = `🆕 <b>Новая заявка!</b>

👤 <b>Имя:</b> {name}
🏢 <b>Компания:</b> {company}
📧 <b>Email:</b> {email}
📱 <b>Телефон:</b> {phone}
💼 <b>Тема:</b> {topic}
💬 <b>Сообщение:</b> {message}

🔗 <b>Источник:</b> {source}
🌍 <b>Локация:</b> {location}
🕐 <b>Время:</b> {timestamp}

<i>Ответить в течение 15 минут для максимальной конверсии!</i>`;
```

### 2. Системные алерты
```javascript
const systemAlertTemplate = `🚨 <b>Системное уведомление</b>

⚠️ <b>Тип:</b> {alertType}
🔧 <b>Компонент:</b> {component}
📝 <b>Описание:</b> {message}
📊 <b>Уровень:</b> {severity}

🕐 <b>Время:</b> {timestamp}
🔗 <b>Подробности:</b> https://neuroexpert.ai/admin

{actionRequired}`;
```

### 3. Ежедневная аналитика
```javascript
const dailyStatsTemplate = `📊 <b>Отчет за {date}</b>

👥 <b>Посещений:</b> {visits} ({visitsTrend})
🆕 <b>Новых пользователей:</b> {newUsers} ({newUsersTrend})
📝 <b>Заявок:</b> {leads} ({leadsTrend})
💰 <b>Конверсия:</b> {conversion}% ({conversionTrend})

🔝 <b>Топ источники:</b>
{topSources}

📈 <b>Тренд недели:</b> {weeklyTrend}`;
```

### 4. Performance алерты
```javascript
const performanceAlertTemplate = `⚡ <b>Performance Alert</b>

📊 <b>Метрика:</b> {metric}
📈 <b>Значение:</b> {value} ({threshold})
🎯 <b>Страница:</b> {page}

🕐 <b>Время:</b> {timestamp}
🔧 <b>Действие:</b> {recommendedAction}`;
```

---

## 🎮 ИНТЕРАКТИВНЫЕ КОМАНДЫ БОТА

### Обработчик команд:
```javascript
// app/api/telegram-webhook/route.js
export async function POST(request) {
  const body = await request.json();
  const { message, callback_query } = body;
  
  if (message?.text) {
    await handleTextMessage(message);
  }
  
  if (callback_query) {
    await handleCallbackQuery(callback_query);
  }
  
  return new Response('OK');
}

async function handleTextMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;
  const userId = message.from.id;
  
  // Проверка прав доступа
  if (!isAuthorizedUser(userId)) {
    await sendMessage(chatId, '❌ У вас нет доступа к этому боту');
    return;
  }
  
  switch (text) {
    case '/start':
      await sendWelcomeMessage(chatId, message.from.first_name);
      break;
      
    case '/status':
      await sendSystemStatus(chatId);
      break;
      
    case '/stats':
      await sendStatistics(chatId);
      break;
      
    case '/leads':
      await sendRecentLeads(chatId);
      break;
      
    case '/health':
      await sendHealthCheck(chatId);
      break;
      
    case '/analytics':
      await sendAnalytics(chatId);
      break;
      
    case '/settings':
      await sendSettingsMenu(chatId);
      break;
      
    case '/help':
      await sendHelpMessage(chatId);
      break;
      
    case '/ping':
      await sendMessage(chatId, '🏓 Понг! Бот работает исправно');
      break;
      
    default:
      await sendMessage(chatId, '❓ Неизвестная команда. Используйте /help');
  }
}
```

### Интерактивные кнопки:
```javascript
async function sendSettingsMenu(chatId) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🔔 Уведомления ВКЛ', callback_data: 'toggle_notifications' },
        { text: '🚨 Алерты ВКЛ', callback_data: 'toggle_alerts' }
      ],
      [
        { text: '📊 Ежедневные отчеты', callback_data: 'toggle_daily_reports' },
        { text: '⚡ Performance мониторинг', callback_data: 'toggle_performance' }
      ],
      [
        { text: '🛠️ Настройки фильтров', callback_data: 'filter_settings' },
        { text: '⏰ Расписание отчетов', callback_data: 'schedule_settings' }
      ]
    ]
  };
  
  await sendMessage(chatId, '⚙️ Настройки уведомлений:', keyboard);
}
```

---

## 🔧 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### Основные функции:
```javascript
// app/utils/telegram.js
class TelegramBot {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
  }
  
  async sendMessage(chatId, text, keyboard = null) {
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };
    
    if (keyboard) {
      payload.reply_markup = keyboard;
    }
    
    const response = await fetch(`${this.baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    return response.json();
  }
  
  async sendPhoto(chatId, photo, caption = '') {
    const payload = {
      chat_id: chatId,
      photo: photo,
      caption: caption,
      parse_mode: 'HTML'
    };
    
    const response = await fetch(`${this.baseUrl}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    return response.json();
  }
  
  async sendDocument(chatId, document, caption = '') {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', document);
    formData.append('caption', caption);
    
    const response = await fetch(`${this.baseUrl}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  }
}
```

### Автоматизация и расписание:
```javascript
// app/utils/telegram-scheduler.js
import cron from 'node-cron';

// Ежедневный отчет в 9:00
cron.schedule('0 9 * * *', async () => {
  const stats = await getDailyStats();
  const message = formatDailyReport(stats);
  await sendToAdmins(message);
});

// Проверка здоровья системы каждые 15 минут
cron.schedule('*/15 * * * *', async () => {
  const health = await checkSystemHealth();
  if (health.status !== 'healthy') {
    await sendAlert(`🚨 Система требует внимания: ${health.message}`);
  }
});

// Еженедельный отчет по воскресеньям в 10:00
cron.schedule('0 10 * * 0', async () => {
  const weeklyStats = await getWeeklyStats();
  const report = await generateWeeklyReport(weeklyStats);
  await sendDocument(ADMIN_CHAT_ID, report, '📊 Еженедельный отчет');
});
```

---

## 🛡️ БЕЗОПАСНОСТЬ И ПРАВА ДОСТУПА

### Управление доступом:
```javascript
// app/utils/telegram-auth.js
const AUTHORIZED_USERS = [
  123456789,  // Основной админ
  987654321,  // Технический админ
  555666777   // Менеджер
];

const USER_ROLES = {
  123456789: 'super_admin',
  987654321: 'admin', 
  555666777: 'manager'
};

function isAuthorizedUser(userId) {
  return AUTHORIZED_USERS.includes(userId);
}

function getUserRole(userId) {
  return USER_ROLES[userId] || 'guest';
}

function hasPermission(userId, action) {
  const role = getUserRole(userId);
  
  const permissions = {
    super_admin: ['*'],
    admin: ['view_stats', 'view_leads', 'system_control'],
    manager: ['view_stats', 'view_leads'],
    guest: []
  };
  
  return permissions[role]?.includes(action) || permissions[role]?.includes('*');
}
```

### Rate limiting:
```javascript
// app/utils/telegram-rate-limit.js
const userRateLimits = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const userLimit = userRateLimits.get(userId) || { count: 0, resetTime: now + 60000 };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + 60000;
  }
  
  if (userLimit.count >= 10) { // 10 команд в минуту
    return false;
  }
  
  userLimit.count++;
  userRateLimits.set(userId, userLimit);
  return true;
}
```

---

## 🧪 ТЕСТИРОВАНИЕ И ОТЛАДКА

### Команды для тестирования:
```bash
# Проверка подключения к API
curl "https://api.telegram.org/bot<BOT_TOKEN>/getMe"

# Отправка тестового сообщения
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<CHAT_ID>",
    "text": "🧪 Тест подключения NeuroExpert"
  }'

# Получение обновлений
curl "https://api.telegram.org/bot<BOT_TOKEN>/getUpdates"

# Установка webhook
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://neuroexpert.ai/api/telegram-webhook",
    "secret_token": "your_secret_token"
  }'

# Удаление webhook (для отладки)
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/deleteWebhook"
```

### Тестирование через API платформы:
```bash
# Тест уведомления о новой заявке
curl -X POST "http://localhost:3000/api/telegram-notify" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "new_lead",
    "data": {
      "name": "Тестовый Пользователь",
      "company": "ООО Тест",
      "email": "test@test.com",
      "phone": "+7 (999) 123-45-67",
      "message": "Тестовое сообщение"
    }
  }'

# Тест системного алерта
curl -X POST "http://localhost:3000/api/telegram-notify" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "system_alert",
    "data": {
      "level": "warning",
      "component": "AI Service",
      "message": "Превышен лимит запросов"
    }
  }'
```

---

## 📊 МОНИТОРИНГ И АНАЛИТИКА

### Метрики бота:
```javascript
// app/utils/telegram-analytics.js
class TelegramAnalytics {
  async trackMessage(type, chatId, success) {
    // Отправка метрик в аналитику
    await analytics.track('telegram_message', {
      type,
      chatId,
      success,
      timestamp: new Date()
    });
  }
  
  async getUsageStats() {
    return {
      messagesTotal: await this.getMessageCount(),
      activeUsers: await this.getActiveUsers(),
      commandsUsage: await this.getCommandsStats(),
      errorRate: await this.getErrorRate()
    };
  }
}
```

---

## 🔄 TROUBLESHOOTING

### Частые проблемы и решения:

| Проблема | Причина | Решение |
|----------|---------|---------|
| Бот не отвечает | Неверный токен | Проверить токен через `/getMe` |
| 403 Forbidden | Бот заблокирован пользователем | Пользователь должен разблокировать |
| 400 Bad Request | Неверный chat_id | Проверить через `/getUpdates` |
| Webhook не работает | HTTPS не настроен | Настроить SSL сертификат |
| Сообщения не доходят | Rate limit | Уменьшить частоту отправки |

### Логирование:
```javascript
// app/utils/telegram-logger.js
function logTelegramEvent(event, data, error = null) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    data,
    error: error?.message,
    stack: error?.stack
  };
  
  console.log('Telegram Event:', JSON.stringify(logEntry, null, 2));
  
  // Отправка в Sentry при ошибках
  if (error && typeof Sentry !== 'undefined') {
    Sentry.captureException(error, { extra: { event, data } });
  }
}
```

---

## 🎯 ГОТОВЫЙ CHECKLIST

### Проверьте перед запуском:
- [ ] ✅ Бот создан через @BotFather
- [ ] ✅ Токен получен и добавлен в .env
- [ ] ✅ Chat ID получен и проверен
- [ ] ✅ Команды настроены в @BotFather
- [ ] ✅ Описание и about добавлены
- [ ] ✅ Webhook настроен (если нужен)
- [ ] ✅ Права доступа ограничены
- [ ] ✅ Rate limiting включен
- [ ] ✅ Тестовые сообщения отправляются
- [ ] ✅ Команды бота работают
- [ ] ✅ Уведомления доходят
- [ ] ✅ Аналитика собирается

**🎉 Telegram интеграция полностью настроена и готова к работе!**

---

*Подробное руководство подготовлено главным разработчиком Claude*  
*NeuroExpert Development Team*  
*Январь 2025*