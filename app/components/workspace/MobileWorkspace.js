'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Динамические импорты для мобильных компонентов
const SmartCustomerChat = dynamic(() => import('../SmartCustomerChat'), {
  ssr: false,
  loading: () => <div className="loading-spinner">Загрузка...</div>
});

export default function MobileWorkspace({ userEmail, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Новый отчет готов', time: '5 мин', unread: true },
    { id: 2, text: 'Задача выполнена', time: '1 час', unread: false }
  ]);

  // Мобильные вкладки
  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Главная' },
    { id: 'analytics', icon: '📈', label: 'Аналитика' },
    { id: 'tasks', icon: '✓', label: 'Задачи' },
    { id: 'documents', icon: '📁', label: 'Файлы' },
    { id: 'more', icon: '⋯', label: 'Еще' }
  ];

  // Компонент дашборда для мобильных
  const MobileDashboard = () => {
    const metrics = [
      { label: 'Выручка', value: '₽12.4M', change: '+24%', positive: true },
      { label: 'Клиенты', value: '3,847', change: '+12%', positive: true },
      { label: 'Конверсия', value: '4.2%', change: '-5%', positive: false },
      { label: 'Ср. чек', value: '₽3,220', change: '+8%', positive: true }
    ];

    return (
      <div className="mobile-dashboard">
        <div className="metrics-scroll">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card-mobile">
              <div className="metric-header">
                <span className="metric-label">{metric.label}</span>
                <span className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
                  {metric.change}
                </span>
              </div>
              <div className="metric-value">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="quick-actions-mobile">
          <h3>Быстрые действия</h3>
          <div className="action-buttons">
            <button className="action-btn">
              <span>📊</span>
              Создать отчет
            </button>
            <button className="action-btn">
              <span>📝</span>
              Новая задача
            </button>
            <button className="action-btn">
              <span>📤</span>
              Загрузить файл
            </button>
            <button className="action-btn">
              <span>💬</span>
              Поддержка
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Последняя активность</h3>
          <div className="activity-items">
            <div className="activity-item">
              <span className="activity-icon">📊</span>
              <div className="activity-details">
                <p>Создан отчет за декабрь</p>
                <span className="activity-time">10 минут назад</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✓</span>
              <div className="activity-details">
                <p>Задача "Обновить презентацию" выполнена</p>
                <span className="activity-time">2 часа назад</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Компонент аналитики для мобильных
  const MobileAnalytics = () => {
    const [period, setPeriod] = useState('month');

    return (
      <div className="mobile-analytics">
        <div className="period-selector-mobile">
          {['day', 'week', 'month'].map(p => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'day' ? 'День' : p === 'week' ? 'Неделя' : 'Месяц'}
            </button>
          ))}
        </div>

        <div className="chart-placeholder-mobile">
          <svg viewBox="0 0 300 150" className="mobile-chart">
            <path 
              d="M 0 120 Q 75 80 150 90 T 300 60" 
              fill="none" 
              stroke="url(#mobile-gradient)" 
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="mobile-gradient">
                <stop offset="0%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="stats-list">
          <div className="stat-item">
            <span className="stat-label">Новые клиенты</span>
            <span className="stat-value">324</span>
            <span className="stat-change positive">+16.5%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Средний чек</span>
            <span className="stat-value">₽3,450</span>
            <span className="stat-change positive">+7.8%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Конверсия</span>
            <span className="stat-value">3.8%</span>
            <span className="stat-change positive">+0.5%</span>
          </div>
        </div>
      </div>
    );
  };

  // Компонент задач для мобильных
  const MobileTasks = () => {
    const [tasks, setTasks] = useState([
      { id: 1, title: 'Проверить отчеты', done: false, priority: 'high' },
      { id: 2, title: 'Созвон с клиентом', done: false, priority: 'medium' },
      { id: 3, title: 'Обновить презентацию', done: true, priority: 'low' }
    ]);

    const toggleTask = (id) => {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, done: !task.done } : task
      ));
    };

    return (
      <div className="mobile-tasks">
        <button className="add-task-btn-mobile">
          + Добавить задачу
        </button>

        <div className="tasks-list-mobile">
          {tasks.map(task => (
            <div key={task.id} className={`task-item-mobile ${task.done ? 'done' : ''}`}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <div className="task-content">
                <span className="task-title">{task.title}</span>
                <span className={`task-priority ${task.priority}`}>
                  {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Компонент документов для мобильных
  const MobileDocuments = () => {
    const documents = [
      { name: 'Отчет Q4.pdf', size: '2.4 MB', icon: '📄' },
      { name: 'Презентация.pptx', size: '15.7 MB', icon: '📑' },
      { name: 'Договор.docx', size: '245 KB', icon: '📝' }
    ];

    return (
      <div className="mobile-documents">
        <button className="upload-btn-mobile">
          ⬆ Загрузить файл
        </button>

        <div className="documents-list-mobile">
          {documents.map((doc, index) => (
            <div key={index} className="document-item-mobile">
              <span className="doc-icon">{doc.icon}</span>
              <div className="doc-info">
                <p className="doc-name">{doc.name}</p>
                <span className="doc-size">{doc.size}</span>
              </div>
              <button className="doc-action">⬇</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Компонент "Еще" для мобильных
  const MobileMore = () => {
    const menuItems = [
      { icon: '🔌', label: 'Интеграции', badge: '3' },
      { icon: '⚙️', label: 'Настройки' },
      { icon: '👤', label: 'Профиль' },
      { icon: '❓', label: 'Помощь' },
      { icon: '📤', label: 'Экспорт данных' }
    ];

    return (
      <div className="mobile-more">
        <div className="menu-list">
          {menuItems.map((item, index) => (
            <button key={index} className="menu-item-mobile">
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.badge && <span className="menu-badge">{item.badge}</span>}
              <span className="menu-arrow">›</span>
            </button>
          ))}
        </div>

        <button className="logout-btn-mobile" onClick={onLogout}>
          🚪 Выйти
        </button>
      </div>
    );
  };

  // Рендер активной вкладки
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <MobileDashboard />;
      case 'analytics': return <MobileAnalytics />;
      case 'tasks': return <MobileTasks />;
      case 'documents': return <MobileDocuments />;
      case 'more': return <MobileMore />;
      default: return <MobileDashboard />;
    }
  };

  return (
    <div className="mobile-workspace">
      {/* Хедер */}
      <header className="mobile-header">
        <div className="header-content">
          <h1 className="mobile-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2"/>
            </svg>
            <span>NeuroExpert</span>
          </h1>
          <button 
            className="notification-btn-mobile"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="notification-dot"></span>
            )}
          </button>
        </div>
      </header>

      {/* Контент */}
      <main className="mobile-content">
        {renderActiveTab()}
      </main>

      {/* Нижняя навигация */}
      <nav className="mobile-bottom-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Уведомления */}
      {showNotifications && (
        <div className="notifications-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notifications-panel" onClick={e => e.stopPropagation()}>
            <div className="notifications-header">
              <h3>Уведомления</h3>
              <button onClick={() => setShowNotifications(false)}>×</button>
            </div>
            <div className="notifications-list">
              {notifications.map(notif => (
                <div key={notif.id} className={`notification-mobile ${notif.unread ? 'unread' : ''}`}>
                  <p>{notif.text}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .mobile-workspace {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0a0a1f;
          color: white;
        }

        /* Хедер */
        .mobile-header {
          background: rgba(20, 20, 35, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 600;
        }

        .notification-btn-mobile {
          position: relative;
          background: none;
          border: none;
          font-size: 20px;
          padding: 8px;
          color: white;
        }

        .notification-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
        }

        /* Контент */
        .mobile-content {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 16px;
          padding-bottom: 80px;
        }

        /* Нижние табы */
        .mobile-bottom-tabs {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(20, 20, 35, 0.98);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          padding-bottom: calc(8px + env(safe-area-inset-bottom));
        }

        .tab-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 8px;
          min-width: 64px;
        }

        .tab-item.active {
          color: #8b5cf6;
        }

        .tab-icon {
          font-size: 22px;
        }

        .tab-label {
          font-size: 11px;
        }

        /* Дашборд */
        .mobile-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .metrics-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px;
        }

        .metrics-scroll::-webkit-scrollbar {
          display: none;
        }

        .metric-card-mobile {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          min-width: 140px;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .metric-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .metric-change {
          font-size: 12px;
          font-weight: 600;
        }

        .metric-change.positive {
          color: #10b981;
        }

        .metric-change.negative {
          color: #ef4444;
        }

        .metric-value {
          font-size: 22px;
          font-weight: 700;
        }

        /* Быстрые действия */
        .quick-actions-mobile h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .action-btn span {
          font-size: 24px;
        }

        /* Активность */
        .recent-activity h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }

        .activity-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
        }

        .activity-icon {
          font-size: 20px;
        }

        .activity-details {
          flex: 1;
        }

        .activity-details p {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Остальные стили для других вкладок */
        .period-selector-mobile {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .period-btn {
          flex: 1;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 14px;
        }

        .period-btn.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: #8b5cf6;
        }

        .chart-placeholder-mobile {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .mobile-chart {
          width: 100%;
          height: 150px;
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
        }

        .stat-change {
          font-size: 13px;
        }

        /* Дополнительные мобильные стили */
        @media (max-width: 320px) {
          .action-buttons {
            grid-template-columns: 1fr;
          }
          
          .tab-item {
            min-width: 56px;
          }
          
          .tab-icon {
            font-size: 20px;
          }
          
          .tab-label {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}