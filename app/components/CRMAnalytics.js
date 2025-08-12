// CRM и аналитическая система для NeuroExpert v3.0
'use client';
import { useState, useEffect } from 'react';

class CRMAnalytics {
  constructor() {
    this.analytics = {
      users: new Map(),
      events: [],
      sessions: new Map(),
      metrics: {
        totalUsers: 0,
        activeUsers: 0,
        conversions: 0,
        avgSessionTime: 0,
        popularServices: {},
        npsScore: 0,
        satisfactionScore: 0
      }
    };
    
    this.crmData = {
      leads: [],
      customers: [],
      interactions: [],
      feedback: []
    };
    
    this.initializeTracking();
  }

  initializeTracking() {
    // Отслеживание сессий пользователей
    const sessionId = this.generateSessionId();
    const startTime = Date.now();
    
    this.analytics.sessions.set(sessionId, {
      id: sessionId,
      startTime,
      events: [],
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      isActive: true
    });

    // Автосохранение данных каждые 30 секунд
    setInterval(() => {
      this.saveToLocalStorage();
    }, 30000);

    // Отслеживание закрытия страницы
    window.addEventListener('beforeunload', () => {
      this.endSession(sessionId);
    });
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Отслеживание событий пользователей
  trackEvent(eventType, data = {}) {
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      timestamp: Date.now(),
      data,
      sessionId: this.getCurrentSessionId(),
      userId: this.getCurrentUserId()
    };

    this.analytics.events.push(event);
    this.updateMetrics(event);
    
    // Отправляем в CRM если это важное событие
    if (['lead_generated', 'form_submitted', 'service_requested'].includes(eventType)) {
      this.addToCRM(event);
    }

    console.log('📊 Tracked event:', event);
  }

  // Добавление данных в CRM
  addToCRM(event) {
    const crmEntry = {
      id: `crm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: event.type,
      data: event.data,
      status: 'new',
      priority: this.calculatePriority(event),
      source: 'neuroexpert_website'
    };

    if (event.type === 'lead_generated' || event.type === 'form_submitted') {
      this.crmData.leads.push(crmEntry);
    } else {
      this.crmData.interactions.push(crmEntry);
    }

    // Автоматически отправляем в внешнюю CRM (симуляция)
    this.sendToExternalCRM(crmEntry);
  }

  calculatePriority(event) {
    const priorityMap = {
      'service_requested': 'high',
      'form_submitted': 'high',
      'lead_generated': 'medium',
      'voice_feedback': 'medium',
      'quiz_completed': 'low',
      'page_view': 'low'
    };
    return priorityMap[event.type] || 'low';
  }

  async sendToExternalCRM(data) {
    try {
      // В реальном проекте здесь будет API call к внешней CRM
      const response = await fetch('/api/crm/add-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('✅ Data sent to CRM:', data.id);
      }
    } catch (error) {
      console.error('❌ Failed to send to CRM:', error);
      // Сохраняем в очередь для повторной отправки
      this.addToRetryQueue(data);
    }
  }

  addToRetryQueue(data) {
    const retryQueue = JSON.parse(localStorage.getItem('crm_retry_queue') || '[]');
    retryQueue.push(data);
    localStorage.setItem('crm_retry_queue', JSON.stringify(retryQueue));
  }

  // Обновление метрик
  updateMetrics(event) {
    const metrics = this.analytics.metrics;
    
    // Общие метрики
    if (event.type === 'session_start') {
      metrics.totalUsers++;
      metrics.activeUsers++;
    }

    // Конверсии
    if (['form_submitted', 'service_requested', 'lead_generated'].includes(event.type)) {
      metrics.conversions++;
    }

    // Популярные услуги
    if (event.type === 'service_viewed' && event.data.serviceType) {
      metrics.popularServices[event.data.serviceType] = 
        (metrics.popularServices[event.data.serviceType] || 0) + 1;
    }

    // NPS и удовлетворенность
    if (event.type === 'nps_score' && event.data.score) {
      this.updateNPSScore(event.data.score);
    }

    if (event.type === 'satisfaction_feedback' && event.data.rating) {
      this.updateSatisfactionScore(event.data.rating);
    }
  }

  updateNPSScore(score) {
    const existingScores = JSON.parse(localStorage.getItem('nps_scores') || '[]');
    existingScores.push(score);
    localStorage.setItem('nps_scores', JSON.stringify(existingScores));
    
    // Пересчитываем средний NPS
    const total = existingScores.reduce((sum, s) => sum + s, 0);
    this.analytics.metrics.npsScore = Math.round(total / existingScores.length);
  }

  updateSatisfactionScore(rating) {
    const existingRatings = JSON.parse(localStorage.getItem('satisfaction_ratings') || '[]');
    existingRatings.push(rating);
    localStorage.setItem('satisfaction_ratings', JSON.stringify(existingRatings));
    
    // Пересчитываем средний рейтинг
    const total = existingRatings.reduce((sum, r) => sum + r, 0);
    this.analytics.metrics.satisfactionScore = Math.round((total / existingRatings.length) * 10) / 10;
  }

  // Получение аналитических данных
  getAnalytics() {
    return {
      summary: this.analytics.metrics,
      recentEvents: this.analytics.events.slice(-50),
      activeSessions: Array.from(this.analytics.sessions.values()).filter(s => s.isActive),
      crmSummary: {
        totalLeads: this.crmData.leads.length,
        totalCustomers: this.crmData.customers.length,
        totalInteractions: this.crmData.interactions.length,
        pendingActions: this.crmData.leads.filter(l => l.status === 'new').length
      }
    };
  }

  // Методы для интеграции с компонентами
  trackPageView(pageName) {
    this.trackEvent('page_view', { page: pageName });
  }

  trackFormSubmission(formType, formData) {
    this.trackEvent('form_submitted', { 
      formType, 
      formData: this.sanitizeFormData(formData) 
    });
  }

  trackServiceInterest(serviceType, packageType) {
    this.trackEvent('service_viewed', { serviceType, packageType });
  }

  trackVoiceFeedback(duration, transcription) {
    this.trackEvent('voice_feedback', { duration, hasTranscription: !!transcription });
  }

  trackQuizCompletion(quizType, score, timeSpent) {
    this.trackEvent('quiz_completed', { quizType, score, timeSpent });
  }

  trackPersonalizationAction(action, data) {
    this.trackEvent('personalization', { action, data });
  }

  sanitizeFormData(data) {
    // Удаляем чувствительные данные для аналитики
    const sanitized = { ...data };
    delete sanitized.phone;
    delete sanitized.email;
    return {
      hasPhone: !!data.phone,
      hasEmail: !!data.email,
      fieldsCount: Object.keys(data).length
    };
  }

  getCurrentSessionId() {
    return Array.from(this.analytics.sessions.keys()).find(id => 
      this.analytics.sessions.get(id).isActive
    );
  }

  getCurrentUserId() {
    return localStorage.getItem('neuroexpert_user_id') || 'anonymous';
  }

  endSession(sessionId) {
    const session = this.analytics.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
      
      // Обновляем среднее время сессии
      const activeSessions = Array.from(this.analytics.sessions.values())
        .filter(s => s.endTime);
      const totalDuration = activeSessions.reduce((sum, s) => sum + s.duration, 0);
      this.analytics.metrics.avgSessionTime = Math.round(totalDuration / activeSessions.length);
    }
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('neuroexpert_analytics', JSON.stringify({
        metrics: this.analytics.metrics,
        recentEvents: this.analytics.events.slice(-100),
        crmData: this.crmData
      }));
    } catch (error) {
      console.error('Failed to save analytics to localStorage:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('neuroexpert_analytics');
      if (saved) {
        const data = JSON.parse(saved);
        this.analytics.metrics = { ...this.analytics.metrics, ...data.metrics };
        this.analytics.events = data.recentEvents || [];
        this.crmData = { ...this.crmData, ...data.crmData };
      }
    } catch (error) {
      console.error('Failed to load analytics from localStorage:', error);
    }
  }
}

// Глобальный экземпляр аналитики
const globalCRM = new CRMAnalytics();

// React компонент для отображения аналитики (для админ-панели)
function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateAnalytics = () => {
      setAnalytics(globalCRM.getAnalytics());
    };

    updateAnalytics();
    const interval = setInterval(updateAnalytics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!analytics) return null;

  return (
    <>
      {/* Кнопка для открытия панели аналитики */}
      <button 
        className="analytics-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Открыть панель аналитики"
      >
        📊
      </button>

      {isVisible && (
        <div className="analytics-dashboard">
          <div className="analytics-header">
            <h3>📊 Аналитика NeuroExpert</h3>
            <button 
              className="close-btn"
              onClick={() => setIsVisible(false)}
            >
              ✕
            </button>
          </div>

          <div className="analytics-grid">
            <div className="metric-card">
              <h4>👥 Пользователи</h4>
              <div className="metric-value">{analytics.summary.totalUsers}</div>
              <div className="metric-label">Всего посетителей</div>
            </div>

            <div className="metric-card">
              <h4>🎯 Конверсии</h4>
              <div className="metric-value">{analytics.summary.conversions}</div>
              <div className="metric-label">Заявок подано</div>
            </div>

            <div className="metric-card">
              <h4>⏱️ Время на сайте</h4>
              <div className="metric-value">
                {Math.round(analytics.summary.avgSessionTime / 60000)}м
              </div>
              <div className="metric-label">Среднее время</div>
            </div>

            <div className="metric-card">
              <h4>😊 NPS Score</h4>
              <div className="metric-value">{analytics.summary.npsScore}</div>
              <div className="metric-label">Из 10</div>
            </div>

            <div className="metric-card">
              <h4>📋 CRM Лиды</h4>
              <div className="metric-value">{analytics.crmSummary.totalLeads}</div>
              <div className="metric-label">Новых лидов</div>
            </div>

            <div className="metric-card">
              <h4>🔔 К обработке</h4>
              <div className="metric-value">{analytics.crmSummary.pendingActions}</div>
              <div className="metric-label">Требуют внимания</div>
            </div>
          </div>

          <div className="popular-services">
            <h4>🏆 Популярные услуги</h4>
            {Object.entries(analytics.summary.popularServices).map(([service, count]) => (
              <div key={service} className="service-stat">
                <span>{service}</span>
                <span className="count">{count}</span>
              </div>
            ))}
          </div>

          <div className="recent-events">
            <h4>📝 Последние события</h4>
            <div className="events-list">
              {analytics.recentEvents.slice(-5).map(event => (
                <div key={event.id} className="event-item">
                  <span className="event-type">{event.type}</span>
                  <span className="event-time">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .analytics-toggle {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
        }

        .analytics-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
        }

        .analytics-dashboard {
          position: fixed;
          bottom: 80px;
          left: 20px;
          width: 400px;
          max-height: 600px;
          background: var(--card);
          border: 2px solid var(--accent);
          border-radius: 16px;
          padding: 20px;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(125, 211, 252, 0.2);
        }

        .analytics-header h3 {
          margin: 0;
          color: var(--text);
        }

        .close-btn {
          background: transparent;
          border: 1px solid rgba(125, 211, 252, 0.3);
          color: var(--muted);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .metric-card {
          background: rgba(125, 211, 252, 0.05);
          border: 1px solid rgba(125, 211, 252, 0.2);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .metric-card h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: var(--muted);
        }

        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: var(--accent);
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 10px;
          color: var(--muted);
        }

        .popular-services,
        .recent-events {
          margin-bottom: 16px;
        }

        .popular-services h4,
        .recent-events h4 {
          margin: 0 0 12px 0;
          color: var(--text);
          font-size: 14px;
        }

        .service-stat {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid rgba(125, 211, 252, 0.1);
          font-size: 12px;
        }

        .service-stat .count {
          color: var(--accent);
          font-weight: bold;
        }

        .events-list {
          max-height: 120px;
          overflow-y: auto;
        }

        .event-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 11px;
          border-bottom: 1px solid rgba(125, 211, 252, 0.1);
        }

        .event-type {
          color: var(--text);
        }

        .event-time {
          color: var(--muted);
        }

        @media (max-width: 768px) {
          .analytics-dashboard {
            width: calc(100vw - 40px);
            left: 20px;
            right: 20px;
          }

          .analytics-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </>
  );
}

// Экспортируем для использования в других компонентах
export { globalCRM as CRMAnalytics, AnalyticsDashboard };
export default AnalyticsDashboard;
