#!/usr/bin/env node

/**
 * Скрипт для быстрой интеграции AI-агентов в вашу платформу
 * Использование: node scripts/integrate-ai-agents.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
╔══════════════════════════════════════════╗
║   🤖 AI Agents Integration Script 🤖     ║
║   Интеграция качественных AI-агентов     ║
╚══════════════════════════════════════════╝
`);

const CONFIG_TEMPLATE = `
# AI Agents Configuration
# Добавьте эти переменные в ваш .env файл

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic Claude Configuration  
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-opus-20240229

# Google Gemini Configuration (уже есть в проекте)
# GOOGLE_GEMINI_API_KEY=your_gemini_key_here

# Custom Agent Configuration (опционально)
CUSTOM_AGENT_ENDPOINT=https://your-custom-agent.com/api
CUSTOM_AGENT_API_KEY=your_custom_agent_key_here

# Agent Quality Thresholds
MIN_QUALITY_SCORE=70
IMPROVEMENT_ENABLED=true

# Rate Limiting for AI Agents
AI_AGENT_RATE_LIMIT_WINDOW_MS=60000
AI_AGENT_RATE_LIMIT_MAX_REQUESTS=20
`;

const EXAMPLE_INTEGRATION = `
// Пример использования AI Agents Manager в вашем коде

import { askAI, getAgentPerformance } from '@/app/utils/ai-agents-manager';

// Простой запрос к AI
async function handleCustomerQuery(query) {
  try {
    const response = await askAI(query, {
      conversationId: 'conv_123',
      requireCapabilities: ['chat', 'analysis'],
      context: {
        customerName: 'Иван',
        previousPurchases: ['Product A', 'Product B']
      }
    });
    
    console.log('AI Response:', response.content);
    console.log('Used agent:', response.agent);
    console.log('Quality score:', response.quality.score);
    
    return response;
  } catch (error) {
    console.error('AI Error:', error);
    return { error: 'Failed to process query' };
  }
}

// Получение метрик производительности
async function checkAgentPerformance() {
  const metrics = await getAgentPerformance('gemini');
  console.log('Gemini metrics:', metrics);
}

// React компонент с AI интеграцией
function CustomerChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async (text) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.content,
          agent: data.data.agent
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chat-container">
      {/* Chat UI implementation */}
    </div>
  );
}
`;

const API_DOCUMENTATION = `
# API Documentation for AI Agents

## Endpoints

### POST /api/ai-agent
Отправить запрос к AI-агенту

**Request Body:**
\`\`\`json
{
  "query": "Как мне улучшить продажи?",
  "conversationId": "conv_123",
  "context": {
    "customerType": "premium",
    "history": []
  },
  "agentPreference": "claude",
  "requireCapabilities": ["analysis", "long-context"]
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "content": "Для улучшения продаж рекомендую...",
    "agent": "claude",
    "quality": {
      "score": 85,
      "evaluation": {
        "clarity": 90,
        "relevance": 88,
        "helpfulness": 82,
        "tone": 85,
        "completeness": 80
      }
    },
    "conversationId": "conv_123",
    "responseTime": 2341,
    "suggestions": []
  }
}
\`\`\`

### GET /api/ai-agent?agent=gemini
Получить метрики производительности агента

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "agent": "gemini",
    "metrics": {
      "responseTime": {
        "avg": 2150,
        "min": 1200,
        "max": 3500
      },
      "satisfaction": {
        "avg": 82.5,
        "min": 65,
        "max": 95
      },
      "accuracy": {
        "avg": 87.3,
        "min": 70,
        "max": 98
      },
      "totalInteractions": 156
    }
  }
}
\`\`\`

### GET /api/ai-agent?conversationId=conv_123
Получить историю разговора

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "history": [
      {
        "role": "user",
        "content": "Привет, мне нужна помощь",
        "timestamp": "2024-01-18T10:30:00Z"
      },
      {
        "role": "assistant",
        "content": "Здравствуйте! Я рад помочь вам...",
        "agent": "gemini",
        "quality": 85,
        "timestamp": "2024-01-18T10:30:02Z"
      }
    ],
    "messageCount": 2
  }
}
\`\`\`
`;

const BEST_PRACTICES = `
# Best Practices для AI-агентов

## 1. Персонализация общения
- Используйте имя клиента в ответах
- Учитывайте историю взаимодействий
- Адаптируйте тон под тип клиента

## 2. Качество ответов
- Минимальный порог качества: 70%
- Автоматическое улучшение при низком качестве
- Регулярный мониторинг метрик

## 3. Выбор агента
- Gemini: для общих запросов и длинных контекстов
- Claude: для сложного анализа и креативных задач
- OpenAI: для кода и технических вопросов
- Custom: для специализированных задач

## 4. Оптимизация производительности
- Кэширование частых запросов
- Rate limiting для защиты от перегрузки
- Fallback на альтернативных агентов

## 5. Мониторинг и аналитика
- Отслеживание времени ответа
- Анализ удовлетворенности клиентов
- A/B тестирование разных агентов

## 6. Безопасность
- Храните API ключи в переменных окружения
- Используйте rate limiting
- Валидируйте входные данные
- Логируйте все взаимодействия

## 7. Обучение агентов
- Собирайте обратную связь
- Создавайте специализированные промпты
- Регулярно обновляйте базу знаний
`;

async function main() {
  console.log('\n📋 Шаги интеграции AI-агентов:\n');
  console.log('1. ✅ AI Agents Manager создан в /app/utils/ai-agents-manager.js');
  console.log('2. ✅ API endpoint создан в /app/api/ai-agent/route.js');
  console.log('3. ✅ Dashboard компонент создан в /app/components/AIAgentsDashboard.js');
  console.log('4. ⏳ Настройка переменных окружения');
  console.log('5. ⏳ Тестирование интеграции\n');

  const envPath = path.join(process.cwd(), '.env.local');
  
  const answer = await new Promise(resolve => {
    rl.question('Хотите создать файл с примером конфигурации? (y/n): ', resolve);
  });

  if (answer.toLowerCase() === 'y') {
    // Создаем файлы с документацией
    const docsDir = path.join(process.cwd(), 'docs', 'ai-agents');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Сохраняем конфигурацию
    fs.writeFileSync(
      path.join(docsDir, 'config-example.env'),
      CONFIG_TEMPLATE.trim()
    );
    console.log('✅ Создан файл: docs/ai-agents/config-example.env');

    // Сохраняем примеры интеграции
    fs.writeFileSync(
      path.join(docsDir, 'integration-examples.js'),
      EXAMPLE_INTEGRATION.trim()
    );
    console.log('✅ Создан файл: docs/ai-agents/integration-examples.js');

    // Сохраняем API документацию
    fs.writeFileSync(
      path.join(docsDir, 'api-documentation.md'),
      API_DOCUMENTATION.trim()
    );
    console.log('✅ Создан файл: docs/ai-agents/api-documentation.md');

    // Сохраняем best practices
    fs.writeFileSync(
      path.join(docsDir, 'best-practices.md'),
      BEST_PRACTICES.trim()
    );
    console.log('✅ Создан файл: docs/ai-agents/best-practices.md');

    console.log('\n📁 Все файлы созданы в папке docs/ai-agents/');
  }

  console.log('\n🎯 Следующие шаги:\n');
  console.log('1. Получите API ключи от провайдеров:');
  console.log('   - OpenAI: https://platform.openai.com/api-keys');
  console.log('   - Claude: https://console.anthropic.com/');
  console.log('   - Gemini: https://makersuite.google.com/app/apikey\n');
  
  console.log('2. Добавьте ключи в ваш .env файл');
  console.log('3. Перезапустите сервер разработки');
  console.log('4. Откройте /admin и найдите раздел AI Agents Dashboard');
  console.log('5. Протестируйте агентов с разными запросами\n');

  console.log('💡 Полезные команды:\n');
  console.log('   npm run dev           - запустить сервер разработки');
  console.log('   curl -X POST http://localhost:3000/api/ai-agent \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"query": "Привет, как дела?"}\'\n');

  console.log('📚 Документация создана в папке docs/ai-agents/\n');
  
  console.log('✨ Интеграция AI-агентов готова к использованию!');
  console.log('🚀 Ваш управляющий теперь может стать лучшим в общении с клиентами!\n');

  rl.close();
}

// Обработка ошибок
process.on('unhandledRejection', (error) => {
  console.error('❌ Ошибка:', error);
  process.exit(1);
});

// Запуск
main().catch(console.error);