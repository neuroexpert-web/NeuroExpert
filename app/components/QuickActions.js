'use client';
import { useState } from 'react';
import './QuickActions.css';

export default function QuickActions() {
  const [activeAction, setActiveAction] = useState(null);
  
  const actions = [
    {
      id: 'funnel',
      icon: '🚀',
      title: 'Создать воронку',
      description: 'Настройте автоматическую воронку продаж',
      color: '#4f46e5',
      steps: ['Выберите шаблон', 'Настройте этапы', 'Запустите кампанию']
    },
    {
      id: 'ads',
      icon: '📢',
      title: 'Запустить рекламу',
      description: 'Настройте таргетированную рекламу',
      color: '#06b6d4',
      steps: ['Выберите платформу', 'Создайте креативы', 'Установите бюджет']
    },
    {
      id: 'analytics',
      icon: '📊',
      title: 'Анализ конкурентов',
      description: 'Изучите стратегии конкурентов',
      color: '#10b981',
      steps: ['Добавьте конкурентов', 'Анализ позиций', 'Получите инсайты']
    },
    {
      id: 'report',
      icon: '📈',
      title: 'Экспорт отчета',
      description: 'Создайте подробный отчет',
      color: '#f59e0b',
      steps: ['Выберите метрики', 'Укажите период', 'Скачайте PDF']
    },
    {
      id: 'crm',
      icon: '👥',
      title: 'CRM импорт',
      description: 'Импортируйте базу клиентов',
      color: '#8b5cf6',
      steps: ['Загрузите файл', 'Маппинг полей', 'Начните работу']
    },
    {
      id: 'automation',
      icon: '⚡',
      title: 'Автоматизация',
      description: 'Настройте бизнес-процессы',
      color: '#ef4444',
      steps: ['Выберите процесс', 'Настройте правила', 'Активируйте']
    }
  ];

  const handleAction = (actionId) => {
    setActiveAction(actionId);
    
    // Отправляем событие в аналитику
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quick_action_click', {
        event_category: 'engagement',
        action_id: actionId
      });
    }

    // Отправляем уведомление в Telegram о популярных действиях
    if (actionId === 'funnel' || actionId === 'ads') {
      fetch('/.netlify/functions/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quick_action',
          data: {
            action: actions.find(a => a.id === actionId)?.title,
            timestamp: new Date().toISOString()
          }
        })
      }).catch(console.error);
    }

    // Имитация выполнения действия
    setTimeout(() => {
      alert(`Действие "${actions.find(a => a.id === actionId)?.title}" будет доступно после полной настройки платформы`);
      setActiveAction(null);
    }, 1000);
  };

  return (
    <div className="quick-actions">
      <div className="actions-header">
        <h3>
          <span className="actions-icon">⚡</span>
          Быстрые действия
        </h3>
        <span className="actions-badge">NEW</span>
      </div>

      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`action-card ${activeAction === action.id ? 'active' : ''}`}
            onClick={() => handleAction(action.id)}
            style={{ '--action-color': action.color }}
          >
            <div className="action-icon" style={{ background: `${action.color}20` }}>
              <span>{action.icon}</span>
            </div>
            <div className="action-content">
              <h4>{action.title}</h4>
              <p>{action.description}</p>
            </div>
            {activeAction === action.id && (
              <div className="action-progress">
                <div className="progress-spinner"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="actions-footer">
        <div className="footer-stats">
          <span className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-text">12 действий сегодня</span>
          </span>
          <span className="stat-item">
            <span className="stat-icon">⏱</span>
            <span className="stat-text">Среднее время: 2.5 мин</span>
          </span>
        </div>
        <button className="view-all-btn">
          Все действия →
        </button>
      </div>

      {/* Модальное окно с шагами (можно добавить позже) */}
      {activeAction && (
        <div className="action-modal">
          <div className="modal-content">
            <h3>{actions.find(a => a.id === activeAction)?.title}</h3>
            <div className="modal-steps">
              {actions.find(a => a.id === activeAction)?.steps.map((step, index) => (
                <div key={index} className="step-item">
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}