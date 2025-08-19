/**
 * AI Agents Manager - Централизованная система управления AI-агентами
 * Поддерживает: OpenAI Assistants, Claude, Google Gemini, Custom Agents
 * Version: 1.0.0
 */

import { createLogger } from './logger';

const logger = createLogger('AIAgentsManager');

// Конфигурация доступных агентов
const AGENT_CONFIGS = {
  openai: {
    name: 'OpenAI Assistant',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    capabilities: ['chat', 'analysis', 'code', 'vision'],
    maxTokens: 4096,
    temperature: 0.7
  },
  claude: {
    name: 'Claude 3',
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-opus-20240229',
    capabilities: ['chat', 'analysis', 'code', 'long-context'],
    maxTokens: 4096,
    temperature: 0.7
  },
  gemini: {
    name: 'Google Gemini',
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    model: 'gemini-pro',
    capabilities: ['chat', 'analysis', 'multimodal'],
    maxTokens: 30720,
    temperature: 0.7
  },
  custom: {
    name: 'Custom Agent',
    endpoint: process.env.CUSTOM_AGENT_ENDPOINT,
    apiKey: process.env.CUSTOM_AGENT_API_KEY,
    capabilities: ['specialized']
  }
};

// Класс для управления качеством ответов
class QualityManager {
  constructor() {
    this.metrics = {
      responseTime: [],
      satisfaction: [],
      accuracy: [],
      engagement: []
    };
  }

  async evaluateResponse(response, context) {
    const evaluation = {
      clarity: this.evaluateClarity(response),
      relevance: this.evaluateRelevance(response, context),
      helpfulness: this.evaluateHelpfulness(response),
      tone: this.evaluateTone(response),
      completeness: this.evaluateCompleteness(response, context)
    };

    const score = Object.values(evaluation).reduce((a, b) => a + b, 0) / Object.keys(evaluation).length;
    
    return {
      score,
      evaluation,
      suggestions: this.generateImprovements(evaluation)
    };
  }

  evaluateClarity(response) {
    // Оценка ясности и понятности ответа
    const factors = {
      sentenceLength: response.split('.').map(s => s.split(' ').length),
      technicalTerms: this.countTechnicalTerms(response),
      structure: this.analyzeStructure(response)
    };
    
    // Простая формула оценки (0-100)
    const avgSentenceLength = factors.sentenceLength.reduce((a, b) => a + b, 0) / factors.sentenceLength.length;
    const clarityScore = Math.max(0, 100 - (avgSentenceLength - 15) * 2 - factors.technicalTerms * 5);
    
    return Math.min(100, clarityScore);
  }

  evaluateRelevance(response, context) {
    // Оценка релевантности ответа контексту
    const keywords = this.extractKeywords(context.query);
    const responseKeywords = this.extractKeywords(response);
    const overlap = keywords.filter(k => responseKeywords.includes(k)).length;
    
    return (overlap / keywords.length) * 100;
  }

  evaluateHelpfulness(response) {
    // Оценка полезности ответа
    const indicators = {
      hasExamples: /например|for example|к примеру/i.test(response),
      hasSteps: /шаг \d|step \d|во-первых|во-вторых/i.test(response),
      hasLinks: /http|www\.|подробнее|more info/i.test(response),
      hasConclusion: /итог|заключение|вывод|conclusion|summary/i.test(response)
    };
    
    const score = Object.values(indicators).filter(Boolean).length * 25;
    return score;
  }

  evaluateTone(response) {
    // Оценка тона общения
    const positiveIndicators = /спасибо|пожалуйста|рад помочь|с удовольствием|отлично/i;
    const negativeIndicators = /нельзя|невозможно|не могу|отказ|запрещено/i;
    
    let score = 70; // Базовый балл
    if (positiveIndicators.test(response)) score += 20;
    if (negativeIndicators.test(response)) score -= 30;
    
    return Math.max(0, Math.min(100, score));
  }

  evaluateCompleteness(response, context) {
    // Оценка полноты ответа
    const expectedElements = this.identifyExpectedElements(context.query);
    const foundElements = expectedElements.filter(elem => 
      response.toLowerCase().includes(elem.toLowerCase())
    );
    
    return (foundElements.length / expectedElements.length) * 100;
  }

  countTechnicalTerms(text) {
    const technicalTerms = /API|SDK|framework|backend|frontend|database|algorithm/gi;
    return (text.match(technicalTerms) || []).length;
  }

  analyzeStructure(text) {
    // Анализ структуры текста
    const hasParagraphs = text.split('\n\n').length > 1;
    const hasList = /[\d\-\*]\.\s|•/m.test(text);
    const hasHeaders = /#{1,6}\s|[А-ЯA-Z]{3,}:/m.test(text);
    
    return (hasParagraphs ? 30 : 0) + (hasList ? 40 : 0) + (hasHeaders ? 30 : 0);
  }

  extractKeywords(text) {
    // Простое извлечение ключевых слов
    const stopWords = new Set(['и', 'в', 'на', 'с', 'the', 'a', 'an', 'and', 'or', 'but']);
    return text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 10);
  }

  identifyExpectedElements(query) {
    // Определение ожидаемых элементов в ответе
    const elements = [];
    
    if (/как|how/i.test(query)) elements.push('шаг', 'сначала', 'затем');
    if (/почему|why/i.test(query)) elements.push('потому что', 'причина', 'because');
    if (/что такое|what is/i.test(query)) elements.push('это', 'является', 'представляет');
    if (/сколько|how much|how many/i.test(query)) elements.push('число', 'количество', 'стоимость');
    
    return elements;
  }

  generateImprovements(evaluation) {
    const suggestions = [];
    
    if (evaluation.clarity < 70) {
      suggestions.push('Упростите предложения и избегайте сложных терминов');
    }
    if (evaluation.relevance < 70) {
      suggestions.push('Убедитесь, что ответ напрямую отвечает на вопрос');
    }
    if (evaluation.helpfulness < 50) {
      suggestions.push('Добавьте примеры или пошаговые инструкции');
    }
    if (evaluation.tone < 70) {
      suggestions.push('Используйте более позитивный и дружелюбный тон');
    }
    if (evaluation.completeness < 70) {
      suggestions.push('Расширьте ответ, охватив все аспекты вопроса');
    }
    
    return suggestions;
  }
}

// Основной класс менеджера агентов
export class AIAgentsManager {
  constructor() {
    this.agents = new Map();
    this.qualityManager = new QualityManager();
    this.conversationHistory = new Map();
    this.activeAgent = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Инициализация доступных агентов
      for (const [key, config] of Object.entries(AGENT_CONFIGS)) {
        if (config.apiKey || config.endpoint) {
          const agent = await this.createAgent(key, config);
          this.agents.set(key, agent);
          logger.info(`Initialized agent: ${config.name}`);
        }
      }

      this.initialized = true;
      logger.info('AI Agents Manager initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize AI Agents Manager', { error: error.message });
      throw error;
    }
  }

  async createAgent(type, config) {
    switch (type) {
      case 'openai':
        return new OpenAIAgent(config);
      case 'claude':
        return new ClaudeAgent(config);
      case 'gemini':
        return new GeminiAgent(config);
      case 'custom':
        return new CustomAgent(config);
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }
  }

  async selectBestAgent(context) {
    // Интеллектуальный выбор лучшего агента для задачи
    const { query, requirements, previousAgents } = context;
    
    let bestAgent = null;
    let bestScore = 0;

    for (const [key, agent] of this.agents) {
      // Пропускаем агентов, которые уже использовались неудачно
      if (previousAgents?.includes(key)) continue;

      const score = await this.evaluateAgentFitness(agent, context);
      if (score > bestScore) {
        bestScore = score;
        bestAgent = key;
      }
    }

    return bestAgent || 'gemini'; // Default to Gemini
  }

  async evaluateAgentFitness(agent, context) {
    let score = 50; // Базовый балл

    // Оценка по возможностям
    const requiredCapabilities = this.identifyRequiredCapabilities(context.query);
    const matchedCapabilities = requiredCapabilities.filter(cap => 
      agent.config.capabilities.includes(cap)
    );
    score += matchedCapabilities.length * 10;

    // Оценка по производительности
    const agentMetrics = this.qualityManager.metrics[agent.config.name];
    if (agentMetrics?.satisfaction.length > 0) {
      const avgSatisfaction = agentMetrics.satisfaction.reduce((a, b) => a + b, 0) / agentMetrics.satisfaction.length;
      score += avgSatisfaction / 2;
    }

    // Оценка по контексту
    if (context.requiresLongContext && agent.config.maxTokens > 8000) score += 20;
    if (context.requiresVision && agent.config.capabilities.includes('vision')) score += 20;
    if (context.requiresCode && agent.config.capabilities.includes('code')) score += 15;

    return score;
  }

  identifyRequiredCapabilities(query) {
    const capabilities = [];
    
    if (/код|code|программ|function|class/i.test(query)) capabilities.push('code');
    if (/изображен|картин|фото|image|photo/i.test(query)) capabilities.push('vision');
    if (/анализ|исследова|analyze|research/i.test(query)) capabilities.push('analysis');
    if (/длинн|подробн|detailed|comprehensive/i.test(query)) capabilities.push('long-context');
    
    return capabilities.length > 0 ? capabilities : ['chat'];
  }

  async processQuery(query, context = {}) {
    await this.initialize();

    try {
      // Выбор лучшего агента для задачи
      const agentKey = await this.selectBestAgent({ query, ...context });
      const agent = this.agents.get(agentKey);
      
      if (!agent) {
        throw new Error('No suitable agent available');
      }

      logger.info(`Using agent: ${agent.config.name} for query`);

      // Подготовка контекста
      const conversationId = context.conversationId || this.generateConversationId();
      const history = this.conversationHistory.get(conversationId) || [];
      
      const enhancedContext = {
        ...context,
        history,
        timestamp: new Date().toISOString(),
        agentName: agent.config.name
      };

      // Получение ответа от агента
      const startTime = Date.now();
      const response = await agent.generateResponse(query, enhancedContext);
      const responseTime = Date.now() - startTime;

      // Оценка качества ответа
      const quality = await this.qualityManager.evaluateResponse(response.content, {
        query,
        context: enhancedContext
      });

      // Улучшение ответа при необходимости
      let finalResponse = response;
      if (quality.score < 70 && context.allowImprovement !== false) {
        finalResponse = await this.improveResponse(response, quality.suggestions, agent);
      }

      // Сохранение в истории
      history.push({
        role: 'user',
        content: query,
        timestamp: enhancedContext.timestamp
      });
      history.push({
        role: 'assistant',
        content: finalResponse.content,
        agent: agent.config.name,
        quality: quality.score,
        timestamp: new Date().toISOString()
      });
      this.conversationHistory.set(conversationId, history);

      // Обновление метрик
      this.updateMetrics(agent.config.name, {
        responseTime,
        satisfaction: quality.score,
        accuracy: quality.evaluation.relevance,
        engagement: history.length
      });

      return {
        content: finalResponse.content,
        agent: agent.config.name,
        quality,
        conversationId,
        responseTime,
        suggestions: quality.score < 80 ? quality.suggestions : []
      };

    } catch (error) {
      logger.error('Error processing query', { error: error.message });
      
      // Fallback на другого агента
      if (context.allowFallback !== false) {
        const fallbackContext = {
          ...context,
          previousAgents: [...(context.previousAgents || []), this.activeAgent],
          allowFallback: false
        };
        return this.processQuery(query, fallbackContext);
      }
      
      throw error;
    }
  }

  async improveResponse(originalResponse, suggestions, agent) {
    const improvementPrompt = `
Пожалуйста, улучшите следующий ответ, учитывая эти рекомендации:
${suggestions.join('\n')}

Оригинальный ответ:
${originalResponse.content}

Предоставьте улучшенную версию:`;

    const improvedResponse = await agent.generateResponse(improvementPrompt, {
      systemPrompt: 'Вы - эксперт по улучшению качества коммуникации с клиентами.'
    });

    return improvedResponse;
  }

  updateMetrics(agentName, metrics) {
    const agentMetrics = this.qualityManager.metrics[agentName] || {
      responseTime: [],
      satisfaction: [],
      accuracy: [],
      engagement: []
    };

    // Сохраняем последние 100 метрик
    Object.entries(metrics).forEach(([key, value]) => {
      if (agentMetrics[key]) {
        agentMetrics[key].push(value);
        if (agentMetrics[key].length > 100) {
          agentMetrics[key].shift();
        }
      }
    });

    this.qualityManager.metrics[agentName] = agentMetrics;
  }

  generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getConversationHistory(conversationId) {
    return this.conversationHistory.get(conversationId) || [];
  }

  async getAgentMetrics(agentName) {
    const metrics = this.qualityManager.metrics[agentName];
    if (!metrics) return null;

    const calculate = (arr) => {
      if (arr.length === 0) return { avg: 0, min: 0, max: 0 };
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      return {
        avg: Math.round(avg * 100) / 100,
        min: Math.min(...arr),
        max: Math.max(...arr)
      };
    };

    return {
      responseTime: calculate(metrics.responseTime),
      satisfaction: calculate(metrics.satisfaction),
      accuracy: calculate(metrics.accuracy),
      engagement: calculate(metrics.engagement),
      totalInteractions: metrics.satisfaction.length
    };
  }

  async trainAgent(agentKey, trainingData) {
    const agent = this.agents.get(agentKey);
    if (!agent) throw new Error(`Agent ${agentKey} not found`);

    // Здесь можно реализовать fine-tuning или дополнительное обучение
    logger.info(`Training agent ${agentKey} with ${trainingData.length} examples`);
    
    // Placeholder для будущей реализации
    return {
      success: true,
      message: 'Training scheduled'
    };
  }
}

// Реализация агентов
class OpenAIAgent {
  constructor(config) {
    this.config = config;
  }

  async generateResponse(query, context) {
    // Реализация для OpenAI API
    const messages = [
      {
        role: 'system',
        content: context.systemPrompt || 'Вы - профессиональный и дружелюбный помощник.'
      },
      ...(context.history || []),
      {
        role: 'user',
        content: query
      }
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        usage: data.usage
      };
    } catch (error) {
      logger.error('OpenAI API error', { error: error.message });
      throw error;
    }
  }
}

class ClaudeAgent {
  constructor(config) {
    this.config = config;
  }

  async generateResponse(query, context) {
    // Реализация для Claude API
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          system: context.systemPrompt || 'Вы - профессиональный и дружелюбный помощник.'
        })
      });

      const data = await response.json();
      return {
        content: data.content[0].text,
        usage: data.usage
      };
    } catch (error) {
      logger.error('Claude API error', { error: error.message });
      throw error;
    }
  }
}

class GeminiAgent {
  constructor(config) {
    this.config = config;
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;
  }

  async generateResponse(query, context) {
    // Реализация для Gemini API
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: query
            }]
          }],
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.maxTokens
          }
        })
      });

      const data = await response.json();
      return {
        content: data.candidates[0].content.parts[0].text,
        usage: {
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        }
      };
    } catch (error) {
      logger.error('Gemini API error', { error: error.message });
      throw error;
    }
  }
}

class CustomAgent {
  constructor(config) {
    this.config = config;
  }

  async generateResponse(query, context) {
    // Реализация для кастомного агента
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          query,
          context
        })
      });

      const data = await response.json();
      return {
        content: data.response || data.content || data.text,
        usage: data.usage
      };
    } catch (error) {
      logger.error('Custom agent API error', { error: error.message });
      throw error;
    }
  }
}

// Синглтон для глобального использования
let managerInstance = null;

export function getAIAgentsManager() {
  if (!managerInstance) {
    managerInstance = new AIAgentsManager();
  }
  return managerInstance;
}

// Хелпер функции для быстрого доступа
export async function askAI(query, context = {}) {
  const manager = getAIAgentsManager();
  return manager.processQuery(query, context);
}

export async function getAgentPerformance(agentName) {
  const manager = getAIAgentsManager();
  return manager.getAgentMetrics(agentName);
}

export default AIAgentsManager;