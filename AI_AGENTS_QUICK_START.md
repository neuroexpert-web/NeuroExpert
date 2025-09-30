# 🚀 AI Agents - Быстрый старт

## ✅ Статус интеграции

### Что уже готово:
1. ✅ **AI Agents Manager** - централизованная система управления агентами
2. ✅ **API Endpoints** - готовые endpoints для работы с агентами
3. ✅ **Admin Dashboard** - панель мониторинга и управления
4. ✅ **Customer Chat Widget** - готовый чат для клиентов
5. ✅ **Система оценки качества** - автоматическая оценка и улучшение ответов

## 🔧 Настройка (3 минуты)

### Шаг 1: Добавьте API ключи
Создайте файл `.env.local` в корне проекта:

```bash
# Минимально необходимые ключи
GOOGLE_GEMINI_API_KEY=ваш_ключ_gemini
OPENAI_API_KEY=ваш_ключ_openai      # опционально
ANTHROPIC_API_KEY=ваш_ключ_claude   # опционально
```

### Шаг 2: Перезапустите сервер
```bash
npm run dev
```

### Шаг 3: Проверьте интеграцию
Откройте в браузере:
- http://localhost:3000 - главная страница
- Найдите кнопку "AI Chat" или добавьте компонент на страницу

## 💻 Использование в коде

### Простой запрос к AI:
```javascript
import { askAI } from '@/app/utils/ai-agents-manager';

const response = await askAI('Как улучшить продажи?');
console.log(response.content);
```

### Добавление чата на страницу:
```javascript
import SmartCustomerChat from '@/app/components/SmartCustomerChat';

function YourPage() {
  return (
    <div>
      <h1>Ваша страница</h1>
      <SmartCustomerChat />
    </div>
  );
}
```

### API запрос:
```bash
curl -X POST http://localhost:3000/api/ai-agent \
  -H "Content-Type: application/json" \
  -d '{"query": "Привет, как дела?"}'
```

## 📊 Мониторинг

### Просмотр метрик:
```bash
curl http://localhost:3000/api/ai-agent
```

### Admin Dashboard:
Добавьте компонент в админ-панель:
```javascript
import AIAgentsDashboard from '@/app/components/AIAgentsDashboard';

// В вашей админ-панели
<AIAgentsDashboard />
```

## 🎯 Возможности системы

### 1. Автоматический выбор агента
Система сама выбирает лучшего агента для каждой задачи:
- **Gemini** - для общих вопросов и длинных текстов
- **Claude** - для сложного анализа
- **OpenAI** - для технических задач

### 2. Оценка качества (0-100%)
Каждый ответ оценивается по критериям:
- Ясность изложения
- Релевантность вопросу
- Полезность информации
- Тон общения
- Полнота ответа

### 3. Автоматическое улучшение
Если качество ответа < 70%, система автоматически улучшает его

### 4. Персонализация
Учитывается контекст и история общения с клиентом

## 🛠️ Настройка под ваш бизнес

### 1. Изменение промптов
Отредактируйте системные промпты в `/app/utils/ai-agents-manager.js`:
```javascript
systemPrompt: 'Вы - профессиональный консультант компании [Ваша компания]...'
```

### 2. Добавление специализированных знаний
```javascript
const response = await askAI(query, {
  context: {
    companyInfo: 'Мы продаем...',
    productCatalog: [...],
    customerType: 'premium'
  }
});
```

### 3. Настройка качества
В `.env.local`:
```
MIN_QUALITY_SCORE=80  # Минимальное качество ответа
IMPROVEMENT_ENABLED=true  # Автоулучшение
```

## 📈 Аналитика и метрики

### Получение статистики агента:
```javascript
import { getAgentPerformance } from '@/app/utils/ai-agents-manager';

const metrics = await getAgentPerformance('gemini');
console.log(`Средняя удовлетворенность: ${metrics.satisfaction.avg}%`);
```

### Экспорт данных:
```bash
curl http://localhost:3000/api/ai-agent > metrics.json
```

## ⚡ Оптимизация производительности

1. **Кэширование частых вопросов** (уже встроено)
2. **Rate limiting** - 20 запросов в минуту (настраивается)
3. **Fallback на другие агенты** при ошибках

## 🔒 Безопасность

- ✅ API ключи хранятся в переменных окружения
- ✅ Rate limiting защищает от DDoS
- ✅ Валидация всех входных данных
- ✅ Логирование всех запросов

## 🆘 Troubleshooting

### Ошибка "No API keys configured"
- Убедитесь, что добавили ключи в `.env.local`
- Перезапустите сервер

### Низкое качество ответов
- Проверьте метрики в Dashboard
- Настройте промпты под ваши задачи
- Используйте более подходящего агента

### Медленные ответы
- Проверьте интернет-соединение
- Используйте кэширование
- Оптимизируйте размер контекста

## 📞 Поддержка

- Документация: `/docs/ai-agents/`
- API Reference: `/docs/ai-agents/api-documentation.md`
- Best Practices: `/docs/ai-agents/best-practices.md`

---

**🎉 Поздравляем! Ваша платформа теперь использует передовые AI-технологии для идеального общения с клиентами!**