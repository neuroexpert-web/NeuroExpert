// Система автоматизации обновлений контента NeuroExpert v3.0
'use client';
import { useState, useEffect } from 'react';

class ContentAutomation {
  constructor() {
    this.updateQueue = [];
    this.automationRules = new Map();
    this.lastUpdateCheck = Date.now();
    this.updateInterval = 5 * 60 * 1000; // 5 минут

    this.initializeAutomation();
  }

  initializeAutomation() {
    // Загружаем правила автоматизации
    this.loadAutomationRules();

    // Запускаем периодическую проверку обновлений
    setInterval(() => {
      this.checkForUpdates();
    }, this.updateInterval);

    // Автоматическое обновление популярности FAQ
    this.startFAQPopularityTracking();

    // Автоматическое обновление рекомендаций
    this.startRecommendationEngine();
  }

  loadAutomationRules() {
    const savedRules = localStorage.getItem('automation_rules');
    if (savedRules) {
      const rules = JSON.parse(savedRules);
      rules.forEach((rule) => {
        this.automationRules.set(rule.id, rule);
      });
    } else {
      // Создаем базовые правила автоматизации
      this.createDefaultRules();
    }
  }

  createDefaultRules() {
    const defaultRules = [
      {
        id: 'faq_popularity_update',
        name: 'Обновление популярности FAQ',
        type: 'faq_automation',
        enabled: true,
        trigger: 'user_interaction',
        action: 'update_popularity',
        frequency: 'realtime',
        conditions: {
          minInteractions: 5,
          timeWindow: 24 * 60 * 60 * 1000, // 24 часа
        },
      },
      {
        id: 'auto_add_trending_faq',
        name: 'Автодобавление популярных вопросов',
        type: 'content_generation',
        enabled: true,
        trigger: 'question_frequency',
        action: 'create_faq_entry',
        frequency: 'daily',
        conditions: {
          minOccurrences: 3,
          timeWindow: 7 * 24 * 60 * 60 * 1000, // 7 дней
        },
      },
      {
        id: 'personalization_update',
        name: 'Обновление персонализации',
        type: 'user_behavior',
        enabled: true,
        trigger: 'user_action',
        action: 'update_recommendations',
        frequency: 'realtime',
        conditions: {
          minActions: 1,
        },
      },
      {
        id: 'content_freshness_check',
        name: 'Проверка актуальности контента',
        type: 'content_maintenance',
        enabled: true,
        trigger: 'time_based',
        action: 'flag_outdated_content',
        frequency: 'weekly',
        conditions: {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        },
      },
    ];

    defaultRules.forEach((rule) => {
      this.automationRules.set(rule.id, rule);
    });

    this.saveAutomationRules();
  }

  saveAutomationRules() {
    const rules = Array.from(this.automationRules.values());
    localStorage.setItem('automation_rules', JSON.stringify(rules));
  }

  // Автоматическое отслеживание популярности FAQ
  startFAQPopularityTracking() {
    // Слушаем события взаимодействия с FAQ
    document.addEventListener('faq_question_viewed', (event) => {
      this.updateFAQPopularity(event.detail.questionId);
    });

    document.addEventListener('faq_question_searched', (event) => {
      this.trackSearchQuery(event.detail.query);
    });
  }

  updateFAQPopularity(questionId) {
    const rule = this.automationRules.get('faq_popularity_update');
    if (!rule || !rule.enabled) return;

    // Получаем текущие данные FAQ
    const faqData = this.getCurrentFAQData();
    const question = faqData.find((q) => q.id === questionId);

    if (question) {
      question.popularity = (question.popularity || 0) + 1;
      question.lastViewed = Date.now();

      // Обновляем в localStorage
      this.updateFAQData(faqData);

      console.log(`📈 FAQ popularity updated for question ${questionId}`);
    }
  }

  trackSearchQuery(query) {
    const searchQueries = JSON.parse(localStorage.getItem('search_queries') || '[]');

    searchQueries.push({
      query: query.toLowerCase(),
      timestamp: Date.now(),
    });

    // Храним только последние 1000 запросов
    if (searchQueries.length > 1000) {
      searchQueries.splice(0, searchQueries.length - 1000);
    }

    localStorage.setItem('search_queries', JSON.stringify(searchQueries));

    // Проверяем, нужно ли создать новый FAQ
    this.checkForNewFAQCreation(query);
  }

  checkForNewFAQCreation(query) {
    const rule = this.automationRules.get('auto_add_trending_faq');
    if (!rule || !rule.enabled) return;

    const searchQueries = JSON.parse(localStorage.getItem('search_queries') || '[]');
    const timeWindow = rule.conditions.timeWindow;
    const cutoffTime = Date.now() - timeWindow;

    // Подсчитываем частоту похожих запросов
    const similarQueries = searchQueries.filter((sq) => {
      return (
        sq.timestamp > cutoffTime && this.calculateSimilarity(sq.query, query.toLowerCase()) > 0.7
      );
    });

    if (similarQueries.length >= rule.conditions.minOccurrences) {
      this.generateAutoFAQ(query, similarQueries.length);
    }
  }

  calculateSimilarity(str1, str2) {
    // Простая функция подсчета схожести строк
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const commonWords = words1.filter((word) => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  generateAutoFAQ(query, frequency) {
    const autoFAQ = {
      id: `auto_${Date.now()}`,
      category: 'Автогенерация',
      question: this.beautifyQuery(query),
      answer:
        'Этот вопрос был добавлен автоматически на основе запросов пользователей. Пожалуйста, добавьте подробный ответ.',
      popularity: frequency,
      isActive: false, // Требует модерации
      isAutoGenerated: true,
      generatedAt: Date.now(),
    };

    const faqData = this.getCurrentFAQData();
    faqData.push(autoFAQ);
    this.updateFAQData(faqData);

    // Добавляем в очередь модерации
    this.addToModerationQueue(autoFAQ);

    console.log('🤖 Auto-generated FAQ:', autoFAQ);
  }

  beautifyQuery(query) {
    // Приводим запрос к виду вопроса
    let beautified = query.charAt(0).toUpperCase() + query.slice(1);
    if (!beautified.endsWith('?')) {
      beautified += '?';
    }
    return beautified;
  }

  addToModerationQueue(item) {
    const moderationQueue = JSON.parse(localStorage.getItem('moderation_queue') || '[]');
    moderationQueue.push({
      id: item.id,
      type: 'auto_faq',
      item,
      createdAt: Date.now(),
      status: 'pending',
    });
    localStorage.setItem('moderation_queue', JSON.stringify(moderationQueue));
  }

  // Система рекомендаций
  startRecommendationEngine() {
    // Обновляем рекомендации при действиях пользователя
    document.addEventListener('user_action', (event) => {
      this.updatePersonalRecommendations(event.detail);
    });
  }

  updatePersonalRecommendations(actionData) {
    const rule = this.automationRules.get('personalization_update');
    if (!rule || !rule.enabled) return;

    const userId = actionData.userId || 'anonymous';
    const userProfile = this.getUserProfile(userId);

    // Обновляем профиль пользователя
    userProfile.actions.push({
      type: actionData.type,
      data: actionData.data,
      timestamp: Date.now(),
    });

    // Генерируем новые рекомендации
    const recommendations = this.generateRecommendations(userProfile);
    userProfile.recommendations = recommendations;

    this.saveUserProfile(userId, userProfile);
  }

  getUserProfile(userId) {
    const profiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
    return (
      profiles[userId] || {
        id: userId,
        createdAt: Date.now(),
        actions: [],
        preferences: {},
        recommendations: [],
        segment: 'unknown',
      }
    );
  }

  saveUserProfile(userId, profile) {
    const profiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
    profiles[userId] = profile;
    localStorage.setItem('user_profiles', JSON.stringify(profiles));
  }

  generateRecommendations(userProfile) {
    const recommendations = [];

    // Анализируем действия пользователя
    const recentActions = userProfile.actions.slice(-10);
    const actionTypes = recentActions.map((a) => a.type);

    // Рекомендации на основе поведения
    if (actionTypes.includes('service_viewed')) {
      recommendations.push({
        type: 'service',
        title: 'Персональная консультация',
        reason: 'На основе просмотренных услуг',
        priority: 8,
      });
    }

    if (actionTypes.includes('quiz_completed')) {
      recommendations.push({
        type: 'course',
        title: 'Углубленный курс по цифровизации',
        reason: 'Вы показали интерес к обучению',
        priority: 7,
      });
    }

    if (actionTypes.includes('faq_searched')) {
      recommendations.push({
        type: 'consultation',
        title: 'Бесплатная консультация',
        reason: 'У вас есть вопросы - мы поможем',
        priority: 9,
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // Проверка актуальности контента
  checkForUpdates() {
    const rule = this.automationRules.get('content_freshness_check');
    if (!rule || !rule.enabled) return;

    const now = Date.now();
    const maxAge = rule.conditions.maxAge;

    // Проверяем FAQ
    const faqData = this.getCurrentFAQData();
    const outdatedFAQ = faqData.filter((item) => {
      const lastUpdated = item.lastUpdated || item.createdAt || 0;
      return now - lastUpdated > maxAge;
    });

    if (outdatedFAQ.length > 0) {
      this.flagOutdatedContent('faq', outdatedFAQ);
    }

    // Проверяем услуги
    const servicesData = this.getCurrentServicesData();
    const outdatedServices = servicesData.filter((item) => {
      const lastUpdated = item.lastUpdated || item.createdAt || 0;
      return now - lastUpdated > maxAge;
    });

    if (outdatedServices.length > 0) {
      this.flagOutdatedContent('services', outdatedServices);
    }
  }

  flagOutdatedContent(type, items) {
    const flags = JSON.parse(localStorage.getItem('content_flags') || '[]');

    items.forEach((item) => {
      flags.push({
        id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        itemId: item.id,
        reason: 'Устаревший контент',
        createdAt: Date.now(),
        status: 'active',
      });
    });

    localStorage.setItem('content_flags', JSON.stringify(flags));
    console.log(`🚩 Flagged ${items.length} outdated ${type} items`);
  }

  // Утилиты для работы с данными
  getCurrentFAQData() {
    const adminContent = localStorage.getItem('admin_content');
    if (adminContent) {
      return JSON.parse(adminContent).faq || [];
    }
    return [];
  }

  updateFAQData(faqData) {
    const adminContent = JSON.parse(localStorage.getItem('admin_content') || '{}');
    adminContent.faq = faqData;
    localStorage.setItem('admin_content', JSON.stringify(adminContent));
  }

  getCurrentServicesData() {
    const adminContent = localStorage.getItem('admin_content');
    if (adminContent) {
      return JSON.parse(adminContent).services || [];
    }
    return [];
  }

  // Публичные методы для интеграции с компонентами
  trackFAQView(questionId) {
    document.dispatchEvent(
      new CustomEvent('faq_question_viewed', {
        detail: { questionId },
      })
    );
  }

  trackFAQSearch(query) {
    document.dispatchEvent(
      new CustomEvent('faq_question_searched', {
        detail: { query },
      })
    );
  }

  trackUserAction(type, data, userId = 'anonymous') {
    document.dispatchEvent(
      new CustomEvent('user_action', {
        detail: { type, data, userId },
      })
    );
  }

  getAutomationStatus() {
    return {
      totalRules: this.automationRules.size,
      activeRules: Array.from(this.automationRules.values()).filter((r) => r.enabled).length,
      lastUpdateCheck: this.lastUpdateCheck,
      queueSize: this.updateQueue.length,
      moderationQueue: JSON.parse(localStorage.getItem('moderation_queue') || '[]').length,
    };
  }

  getModerationQueue() {
    return JSON.parse(localStorage.getItem('moderation_queue') || '[]');
  }

  approveModeration(itemId) {
    const queue = this.getModerationQueue();
    const item = queue.find((q) => q.id === itemId);

    if (item && item.type === 'auto_faq') {
      // Активируем автогенерированный FAQ
      const faqData = this.getCurrentFAQData();
      const faq = faqData.find((f) => f.id === item.id);
      if (faq) {
        faq.isActive = true;
        this.updateFAQData(faqData);
      }

      // Удаляем из очереди модерации
      const updatedQueue = queue.filter((q) => q.id !== itemId);
      localStorage.setItem('moderation_queue', JSON.stringify(updatedQueue));

      console.log('✅ Auto-generated FAQ approved:', itemId);
    }
  }

  rejectModeration(itemId) {
    const queue = this.getModerationQueue();
    const updatedQueue = queue.filter((q) => q.id !== itemId);
    localStorage.setItem('moderation_queue', JSON.stringify(updatedQueue));

    console.log('❌ Auto-generated content rejected:', itemId);
  }
}

// Создаем глобальный экземпляр автоматизации
const globalAutomation = new ContentAutomation();

// React компонент для отображения статуса автоматизации
function AutomationStatus() {
  const [status, setStatus] = useState(null);
  const [moderationQueue, setModerationQueue] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(globalAutomation.getAutomationStatus());
      setModerationQueue(globalAutomation.getModerationQueue());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 10000); // Обновляем каждые 10 секунд

    return () => clearInterval(interval);
  }, []);

  const handleApprove = (itemId) => {
    globalAutomation.approveModeration(itemId);
    setModerationQueue(globalAutomation.getModerationQueue());
  };

  const handleReject = (itemId) => {
    globalAutomation.rejectModeration(itemId);
    setModerationQueue(globalAutomation.getModerationQueue());
  };

  if (!status) return null;

  return (
    <>
      <button
        className="automation-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Статус автоматизации"
      >
        🤖
        {moderationQueue.length > 0 && (
          <span className="notification-badge">{moderationQueue.length}</span>
        )}
      </button>

      {isVisible && (
        <div className="automation-panel">
          <div className="automation-header">
            <h3>🤖 Автоматизация</h3>
            <button onClick={() => setIsVisible(false)}>✕</button>
          </div>

          <div className="automation-stats">
            <div className="stat">
              <span>Правил активно:</span>
              <span>
                {status.activeRules}/{status.totalRules}
              </span>
            </div>
            <div className="stat">
              <span>В очереди модерации:</span>
              <span>{moderationQueue.length}</span>
            </div>
            <div className="stat">
              <span>Последняя проверка:</span>
              <span>{new Date(status.lastUpdateCheck).toLocaleTimeString()}</span>
            </div>
          </div>

          {moderationQueue.length > 0 && (
            <div className="moderation-section">
              <h4>📋 Требует модерации</h4>
              {moderationQueue.map((item) => (
                <div key={item.id} className="moderation-item">
                  <div className="item-info">
                    <strong>{item.item.question}</strong>
                    <small>Автогенерация от {new Date(item.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleApprove(item.id)} className="approve-btn">
                      ✅
                    </button>
                    <button onClick={() => handleReject(item.id)} className="reject-btn">
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .automation-toggle {
          position: fixed;
          bottom: 20px;
          right: 80px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
          transition: all 0.3s ease;
          position: relative;
        }

        .automation-toggle:hover {
          transform: scale(1.1);
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .automation-panel {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 350px;
          max-height: 500px;
          background: var(--card);
          border: 2px solid #f59e0b;
          border-radius: 16px;
          padding: 16px;
          z-index: 1001;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.3s ease-out;
        }

        .automation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
        }

        .automation-header h3 {
          margin: 0;
          color: var(--text);
        }

        .automation-header button {
          background: transparent;
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: var(--muted);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
        }

        .automation-stats {
          margin-bottom: 16px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 12px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.1);
        }

        .stat span:first-child {
          color: var(--muted);
        }

        .stat span:last-child {
          color: var(--text);
          font-weight: bold;
        }

        .moderation-section h4 {
          margin: 16px 0 8px 0;
          color: var(--text);
          font-size: 14px;
        }

        .moderation-item {
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-info {
          flex: 1;
        }

        .item-info strong {
          color: var(--text);
          font-size: 12px;
          display: block;
          margin-bottom: 4px;
        }

        .item-info small {
          color: var(--muted);
          font-size: 10px;
        }

        .item-actions {
          display: flex;
          gap: 4px;
        }

        .approve-btn,
        .reject-btn {
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .approve-btn {
          background: #22c55e;
          color: white;
        }

        .reject-btn {
          background: #ef4444;
          color: white;
        }

        .approve-btn:hover,
        .reject-btn:hover {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .automation-panel {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
          }
        }
      `}</style>
    </>
  );
}

// Экспортируем для использования в других компонентах
export { globalAutomation as ContentAutomation, AutomationStatus };
export default AutomationStatus;
