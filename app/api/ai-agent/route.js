import { NextResponse } from 'next/server';
import { getAIAgentsManager } from '../../utils/ai-agents-manager';
import { apiRateLimit } from '../../middleware/rateLimit';
import { createLogger } from '../../utils/logger';

const logger = createLogger('AIAgentAPI');

// Инициализация менеджера при старте
const agentsManager = getAIAgentsManager();

export async function POST(request) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimit(request);
    if (rateLimitResult.status === 429) {
      return rateLimitResult;
    }

    const body = await request.json();
    const { 
      query, 
      conversationId, 
      context = {},
      agentPreference,
      requireCapabilities = []
    } = body;

    if (!query) {
      return NextResponse.json({
        error: 'Query is required',
        code: 'MISSING_QUERY'
      }, { status: 400 });
    }

    // Обработка запроса через AI Agents Manager
    const result = await agentsManager.processQuery(query, {
      conversationId,
      ...context,
      agentPreference,
      requireCapabilities
    });

    // Логирование для аналитики
    logger.info('AI Agent query processed', {
      agent: result.agent,
      quality: result.quality.score,
      responseTime: result.responseTime
    });

    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    }, {
      headers: {
        'X-Agent-Used': result.agent,
        'X-Quality-Score': result.quality.score.toString(),
        ...rateLimitResult.headers
      }
    });

  } catch (error) {
    logger.error('AI Agent API error', { error: error.message });
    
    return NextResponse.json({
      error: 'Failed to process query',
      message: error.message,
      code: 'PROCESSING_ERROR'
    }, { status: 500 });
  }
}

// GET endpoint для получения метрик агентов
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentName = searchParams.get('agent');
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Получение истории разговора
      const history = await agentsManager.getConversationHistory(conversationId);
      return NextResponse.json({
        success: true,
        data: {
          conversationId,
          history,
          messageCount: history.length
        }
      });
    }

    if (agentName) {
      // Получение метрик конкретного агента
      const metrics = await agentsManager.getAgentMetrics(agentName);
      if (!metrics) {
        return NextResponse.json({
          error: 'Agent not found',
          code: 'AGENT_NOT_FOUND'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          agent: agentName,
          metrics
        }
      });
    }

    // Получение общей информации о всех агентах
    const agents = ['openai', 'claude', 'gemini', 'custom'];
    const allMetrics = {};
    
    for (const agent of agents) {
      const metrics = await agentsManager.getAgentMetrics(agent);
      if (metrics) {
        allMetrics[agent] = metrics;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        agents: allMetrics,
        summary: {
          totalAgents: Object.keys(allMetrics).length,
          bestPerforming: getBestPerformingAgent(allMetrics)
        }
      }
    });

  } catch (error) {
    logger.error('AI Agent metrics error', { error: error.message });
    
    return NextResponse.json({
      error: 'Failed to get metrics',
      message: error.message,
      code: 'METRICS_ERROR'
    }, { status: 500 });
  }
}

function getBestPerformingAgent(metrics) {
  let bestAgent = null;
  let bestScore = 0;

  for (const [agent, data] of Object.entries(metrics)) {
    if (data.satisfaction.avg > bestScore) {
      bestScore = data.satisfaction.avg;
      bestAgent = agent;
    }
  }

  return {
    agent: bestAgent,
    satisfactionScore: bestScore
  };
}