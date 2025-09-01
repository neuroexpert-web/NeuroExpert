# 📬 Настройка формы обратной связи NeuroExpert

## ✅ Текущий статус

### Что уже работает:
1. **Frontend форма** - полностью готова с валидацией
2. **API endpoint** - `/api/contact-form` принимает и обрабатывает заявки
3. **Валидация** - проверка всех полей на клиенте и сервере
4. **UI/UX** - анимации, уведомления, маска телефона

### Что нужно настроить:
1. **Telegram уведомления** - получение заявок в Telegram
2. **Email рассылка** - дублирование на почту
3. **CRM интеграция** - автоматическое создание лидов

## 🚀 Быстрая настройка

### Шаг 1: Telegram бот (рекомендуется)

1. Создайте бота через [@BotFather](https://t.me/botfather):
   ```
   /newbot
   Название: NeuroExpert Notifications
   Username: neuroexpert_notify_bot
   ```

2. Получите токен бота (выглядит как `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

3. Создайте группу/канал и добавьте бота администратором

4. Получите ID чата:
   - Отправьте сообщение в группу
   - Откройте: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Найдите `"chat":{"id":-1234567890}`

5. Добавьте в переменные окружения:
   ```bash
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
   TELEGRAM_CHAT_ID=-1234567890
   ```

### Шаг 2: Email уведомления (опционально)

#### Вариант A: SendGrid
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@neuroexpert.com
ADMIN_EMAIL=admin@yourcompany.com
```

#### Вариант B: SMTP
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=NeuroExpert <noreply@neuroexpert.com>
ADMIN_EMAIL=admin@yourcompany.com
```

### Шаг 3: CRM интеграция (опционально)

#### HubSpot:
```bash
HUBSPOT_API_KEY=your-private-app-key
HUBSPOT_PORTAL_ID=12345678
```

#### Bitrix24:
```bash
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/xxxxx/
```

## 🧪 Тестирование

### Автоматическое тестирование (только в dev режиме):
1. Откройте страницу "Контакты" (страница 9)
2. Прокрутите вниз - увидите блок "🧪 Тестирование формы обратной связи"
3. Нажмите "🚀 Запустить тесты"

### Ручное тестирование:
```bash
# Проверка настроек
curl http://localhost:3000/api/test

# Тестовая отправка формы
curl -X POST http://localhost:3000/api/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тест",
    "email": "test@example.com",
    "phone": "+7 999 123-45-67",
    "message": "Тестовое сообщение для проверки"
  }'
```

## 📋 Формат уведомлений

### Telegram:
```
🔔 Новая заявка с сайта NeuroExpert

👤 Имя: Иван Иванов
📧 Email: ivan@example.com
📱 Телефон: +7 (999) 123-45-67
💬 Сообщение: Интересует демонстрация платформы
🕐 Время: 20.01.2025, 15:30:45
```

### Email:
- Тема: "Новая заявка с сайта NeuroExpert"
- HTML шаблон с брендированным дизайном
- Кнопка быстрого ответа

## 🔧 Расширенные настройки

### Добавление полей в форму:
1. Отредактируйте `app/page.js` (секция контактов)
2. Обновите валидацию в `app/utils/validation.ts`
3. Добавьте обработку в `app/api/contact-form/route.js`

### Кастомные уведомления:
```javascript
// app/api/contact-form/route.js
const customMessage = `
🎯 Приоритетная заявка!
${data.topic === 'demo' ? '🔥 Запрос демо' : ''}
...
`;
```

### Интеграция с CRM:
```javascript
// Добавьте в app/api/contact-form/route.js
if (process.env.HUBSPOT_API_KEY) {
  await createHubSpotLead(data);
}
```

## ❓ Частые вопросы

**Q: Форма не отправляется?**
A: Проверьте консоль браузера и Network вкладку. Ошибки валидации показываются под полями.

**Q: Не приходят уведомления в Telegram?**
A: Убедитесь что:
- Бот добавлен в группу как администратор
- ID чата правильный (начинается с минуса для групп)
- Токен актуальный

**Q: Как изменить время ответа "15 минут"?**
A: Отредактируйте текст в `app/page.js` строка ~3449

**Q: Можно ли сохранять заявки в базу данных?**
A: Да, добавьте сохранение в `app/api/contact-form/route.js` используя Prisma/Supabase/др.

## 📊 Мониторинг

Все заявки логируются в консоль сервера с timestamp. В production рекомендуется:
1. Сохранять в базу данных
2. Отправлять в систему аналитики
3. Настроить алерты для критичных заявок

---

**Статус**: ✅ Форма обратной связи полностью функциональна и готова к использованию!