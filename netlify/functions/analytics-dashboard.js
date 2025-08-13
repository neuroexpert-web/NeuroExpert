// Аналитический дашборд для мониторинга заявок NeuroExpert
exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  // Обработка preflight OPTIONS запросов
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Простая авторизация (в production используйте JWT)
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const providedPassword = event.queryStringParameters?.password;
  
  if (providedPassword !== adminPassword) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized access' })
    };
  }

  try {
    // Получение параметров
    const period = event.queryStringParameters?.period || 'today';
    const format = event.queryStringParameters?.format || 'json';
    
    // Генерация аналитических данных
    const analytics = generateAnalytics(period);
    
    if (format === 'html') {
      // Возврат HTML дашборда
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'text/html; charset=utf-8'
        },
        body: generateHTMLDashboard(analytics, period)
      };
    }
    
    // Возврат JSON данных
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        period,
        analytics,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error generating analytics:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to generate analytics dashboard',
        timestamp: new Date().toISOString()
      })
    };
  }
};

// Функция генерации аналитических данных
function generateAnalytics(period) {
  // В production здесь будет обращение к реальной базе данных
  // Сейчас генерируем демо-данные для показа возможностей
  
  const now = new Date();
  const baseLeads = period === 'today' ? 15 : period === 'week' ? 89 : 342;
  
  return {
    summary: {
      totalLeads: baseLeads + Math.floor(Math.random() * 10),
      contactForms: Math.floor(baseLeads * 0.7),
      voiceMessages: Math.floor(baseLeads * 0.3),
      highPriority: Math.floor(baseLeads * 0.25),
      mediumPriority: Math.floor(baseLeads * 0.55),
      lowPriority: Math.floor(baseLeads * 0.2),
      conversionRate: (65 + Math.random() * 20).toFixed(1) + '%',
      averageResponseTime: (12 + Math.random() * 8).toFixed(1) + ' мин'
    },
    
    hourlyDistribution: generateHourlyData(),
    
    sourceAnalytics: {
      'contact_form': Math.floor(baseLeads * 0.7),
      'voice_form': Math.floor(baseLeads * 0.3),
      'direct': Math.floor(baseLeads * 0.1),
      'organic': Math.floor(baseLeads * 0.4),
      'paid': Math.floor(baseLeads * 0.3),
      'social': Math.floor(baseLeads * 0.2)
    },
    
    priorityTrends: {
      high: {
        current: Math.floor(baseLeads * 0.25),
        change: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 20) + '%'
      },
      medium: {
        current: Math.floor(baseLeads * 0.55),
        change: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 15) + '%'
      },
      low: {
        current: Math.floor(baseLeads * 0.2),
        change: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 10) + '%'
      }
    },
    
    voiceAnalytics: {
      averageDuration: (35 + Math.random() * 25).toFixed(1) + 'с',
      sentimentDistribution: {
        positive: Math.floor(baseLeads * 0.3 * 0.6),
        neutral: Math.floor(baseLeads * 0.3 * 0.3),
        negative: Math.floor(baseLeads * 0.3 * 0.1)
      },
      topKeywords: ['бюджет', 'услуги', 'проект', 'срочно', 'компания']
    },
    
    recentLeads: generateRecentLeads(5)
  };
}

// Генерация почасовых данных
function generateHourlyData() {
  const data = {};
  for (let hour = 0; hour < 24; hour++) {
    // Больше заявок в рабочее время
    const workingHours = hour >= 9 && hour <= 18;
    const baseValue = workingHours ? 3 + Math.random() * 5 : Math.random() * 2;
    data[hour] = Math.floor(baseValue);
  }
  return data;
}

// Генерация последних заявок
function generateRecentLeads(count) {
  const leads = [];
  const names = ['Иван Петров', 'Мария Сидорова', 'Алексей Смирнов', 'Елена Козлова', 'Дмитрий Волков'];
  const companies = ['ООО Рога и Копыта', 'ИП Иванов', 'ТД Прогресс', 'Альфа Групп', ''];
  const priorities = ['high', 'medium', 'low'];
  const sources = ['contact_form', 'voice_form'];
  
  for (let i = 0; i < count; i++) {
    const isVoice = Math.random() > 0.7;
    const lead = {
      id: `lead_${Date.now() - (i * 60000)}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(Date.now() - (i * 60000)).toISOString(),
      source: isVoice ? 'voice_form' : 'contact_form',
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      contact: {
        name: isVoice ? null : names[Math.floor(Math.random() * names.length)],
        phone: '+7 9' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
        company: Math.random() > 0.5 ? companies[Math.floor(Math.random() * companies.length)] : ''
      }
    };
    
    if (isVoice) {
      lead.voice = {
        duration: Math.floor(15 + Math.random() * 45),
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        urgency: Math.random() > 0.7 ? 'high' : 'normal'
      };
    }
    
    leads.push(lead);
  }
  
  return leads;
}

// Генерация HTML дашборда
function generateHTMLDashboard(analytics, period) {
  const periodName = {
    today: 'сегодня',
    week: 'за неделю', 
    month: 'за месяц'
  }[period] || period;
  
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuroExpert - Аналитика заявок</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; color: #7dd3fc; }
        .header p { color: #94a3b8; font-size: 1.1rem; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .metric-card { 
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
        }
        .metric-title { color: #94a3b8; font-size: 0.9rem; margin-bottom: 8px; }
        .metric-value { font-size: 2rem; font-weight: bold; color: #7dd3fc; }
        .metric-change { font-size: 0.9rem; margin-top: 8px; }
        .metric-change.positive { color: #22c55e; }
        .metric-change.negative { color: #ef4444; }
        .charts { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 40px; }
        .chart-card { 
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
        }
        .chart-title { font-size: 1.2rem; margin-bottom: 20px; color: #f8fafc; }
        .priority-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .priority-item:last-child { border-bottom: none; }
        .priority-label { display: flex; align-items: center; gap: 8px; }
        .priority-dot { width: 12px; height: 12px; border-radius: 50%; }
        .priority-dot.high { background: #ef4444; }
        .priority-dot.medium { background: #eab308; }
        .priority-dot.low { background: #22c55e; }
        .recent-leads { margin-top: 40px; }
        .lead-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .lead-info h4 { color: #f8fafc; margin-bottom: 4px; }
        .lead-info p { color: #94a3b8; font-size: 0.9rem; }
        .lead-meta { text-align: right; }
        .lead-priority { 
            padding: 4px 8px; 
            border-radius: 6px; 
            font-size: 0.8rem; 
            font-weight: bold;
        }
        .lead-priority.high { background: #ef4444; color: white; }
        .lead-priority.medium { background: #eab308; color: white; }
        .lead-priority.low { background: #22c55e; color: white; }
        .refresh-btn {
            background: linear-gradient(135deg, #7dd3fc, #0ea5e9);
            border: none;
            color: #0f172a;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
        }
        @media (max-width: 768px) {
            .charts { grid-template-columns: 1fr; }
            .metrics { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 NeuroExpert Analytics</h1>
            <p>Аналитика заявок ${periodName} • Обновлено: ${new Date().toLocaleString('ru-RU')}</p>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-title">Всего заявок</div>
                <div class="metric-value">${analytics.summary.totalLeads}</div>
                <div class="metric-change positive">Конверсия: ${analytics.summary.conversionRate}</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">Контактные формы</div>
                <div class="metric-value">${analytics.summary.contactForms}</div>
                <div class="metric-change">📝 Текстовые заявки</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">Голосовые сообщения</div>
                <div class="metric-value">${analytics.summary.voiceMessages}</div>
                <div class="metric-change">🎤 Ср. длительность: ${analytics.voiceAnalytics.averageDuration}</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">Время ответа</div>
                <div class="metric-value">${analytics.summary.averageResponseTime}</div>
                <div class="metric-change positive">⚡ Среднее время</div>
            </div>
        </div>
        
        <div class="charts">
            <div class="chart-card">
                <div class="chart-title">📈 Распределение по приоритету</div>
                ${Object.entries(analytics.priorityTrends).map(([priority, data]) => `
                    <div class="priority-item">
                        <div class="priority-label">
                            <div class="priority-dot ${priority}"></div>
                            <span>${priority === 'high' ? 'Высокий' : priority === 'medium' ? 'Средний' : 'Низкий'} приоритет</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold;">${data.current}</div>
                            <div style="font-size: 0.8rem; color: ${data.change.startsWith('+') ? '#22c55e' : '#ef4444'};">${data.change}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="chart-card">
                <div class="chart-title">😊 Анализ настроения (голос)</div>
                <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>😊 Позитивное</span>
                        <span>${analytics.voiceAnalytics.sentimentDistribution.positive}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>😐 Нейтральное</span>
                        <span>${analytics.voiceAnalytics.sentimentDistribution.neutral}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>😠 Негативное</span>
                        <span>${analytics.voiceAnalytics.sentimentDistribution.negative}</span>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <div style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 8px;">Топ ключевые слова:</div>
                    <div style="font-size: 0.8rem; color: #7dd3fc;">${analytics.voiceAnalytics.topKeywords.join(', ')}</div>
                </div>
            </div>
        </div>
        
        <div class="recent-leads">
            <div class="chart-card">
                <div class="chart-title">📋 Последние заявки</div>
                ${analytics.recentLeads.map(lead => `
                    <div class="lead-item">
                        <div class="lead-info">
                            <h4>${lead.contact.name || '🎤 Голосовое сообщение'}</h4>
                            <p>${lead.contact.phone}${lead.contact.company ? ` • ${lead.contact.company}` : ''}</p>
                            ${lead.voice ? `<p>📝 ${lead.voice.sentiment} настроение, ${lead.voice.duration}с</p>` : ''}
                        </div>
                        <div class="lead-meta">
                            <div class="lead-priority ${lead.priority}">${lead.priority.toUpperCase()}</div>
                            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px;">
                                ${new Date(lead.timestamp).toLocaleTimeString('ru-RU')}
                            </p>
                        </div>
                    </div>
                `).join('')}
                
                <button class="refresh-btn" onclick="window.location.reload()">
                    🔄 Обновить данные
                </button>
            </div>
        </div>
    </div>
</body>
</html>`;
}