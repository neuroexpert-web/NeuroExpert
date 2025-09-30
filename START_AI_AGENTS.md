# 🎯 ЗАПУСК AI-АГЕНТОВ - ФИНАЛЬНАЯ ИНСТРУКЦИЯ

## ⚡ Быстрый запуск (2 минуты)

### 1️⃣ Создайте файл `.env.local`:
```bash
touch .env.local
```

### 2️⃣ Добавьте в него ваши API ключи:
```env
# Обязательный минимум - хотя бы один ключ
GOOGLE_GEMINI_API_KEY=ваш_ключ_здесь

# Дополнительные агенты (опционально)
OPENAI_API_KEY=ваш_ключ_openai
ANTHROPIC_API_KEY=ваш_ключ_claude

# Для безопасности админки
JWT_SECRET=любая_случайная_строка_32_символа
ADMIN_PASSWORD_HASH=$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC
```

### 3️⃣ Перезапустите сервер:
```bash
# Остановите текущий сервер (Ctrl+C)
# Запустите заново
npm run dev
```

### 4️⃣ Проверьте работу:
Откройте http://localhost:3000 и найдите чат-виджет

## 🔍 Где взять API ключи?

### Google Gemini (БЕСПЛАТНО):
1. Перейдите на https://makersuite.google.com/app/apikey
2. Нажмите "Create API Key"
3. Скопируйте ключ

### OpenAI (платно):
1. https://platform.openai.com/api-keys
2. Create new secret key
3. Скопируйте ключ

### Claude (платно):
1. https://console.anthropic.com/
2. API Keys → Create Key
3. Скопируйте ключ

## ✅ Проверка интеграции

### Тест через консоль:
```bash
# Запустите в новом терминале
node test-ai-integration.js
```

### Тест через браузер:
1. Откройте http://localhost:3000
2. Найдите AI Chat виджет
3. Задайте вопрос: "Привет! Расскажи о своих возможностях"

### Тест через API:
```bash
curl -X POST http://localhost:3000/api/ai-agent \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Как улучшить обслуживание клиентов?",
    "context": {
      "businessType": "ecommerce"
    }
  }'
```

## 📱 Добавление чата на страницу

### Вариант 1: На главную страницу
Отредактируйте `/app/page.js`:
```javascript
import SmartCustomerChat from './components/SmartCustomerChat';

// В конце компонента Page, перед закрывающим </main>
<SmartCustomerChat />
```

### Вариант 2: Плавающий виджет
Добавьте в `/app/layout.js`:
```javascript
import SmartCustomerChat from './components/SmartCustomerChat';

// Перед закрывающим </body>
<div style={{
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 1000
}}>
  <SmartCustomerChat />
</div>
```

## 🎨 Кастомизация

### Изменение приветствия:
В файле `/app/components/SmartCustomerChat.js` найдите:
```javascript
content: 'Здравствуйте! Я ваш персональный AI-консультант. Чем могу помочь?',
```

### Изменение цветов:
В файле `/app/components/SmartCustomerChat.module.css`:
```css
/* Основной цвет */
--primary-color: #00ff88;
/* Вторичный цвет */
--secondary-color: #00ccff;
```

## 📊 Мониторинг в админке

1. Войдите в админку (пароль по умолчанию: `admin`)
2. Добавьте новую вкладку в `/app/components/AdminPanel.js`:
```javascript
// В массив вкладок добавьте:
{ id: 'ai', label: '🤖 AI Агенты', count: 0 }

// В switch для рендера контента:
case 'ai':
  return <AIAgentsDashboard />;
```

## 🚀 Готово к использованию!

### Что вы получаете:
- ✅ Умный AI-консультант на сайте
- ✅ Автоматический выбор лучшего агента
- ✅ Оценка качества каждого ответа
- ✅ Персонализация общения
- ✅ Полная аналитика

### Следующие шаги:
1. Обучите агентов информации о вашем бизнесе
2. Настройте персонализированные ответы
3. Мониторьте качество через дашборд
4. Собирайте обратную связь от клиентов

---

**💡 Подсказка**: Начните с Gemini API - он бесплатный и отлично подходит для большинства задач!

**🆘 Проблемы?** Проверьте:
- Правильно ли скопированы API ключи
- Перезапущен ли сервер после добавления ключей
- Нет ли ошибок в консоли браузера

**🎉 Успехов в улучшении общения с клиентами!**