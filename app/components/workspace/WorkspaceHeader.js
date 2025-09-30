'use client';

import { useState } from 'react';
import { useWorkspace } from './WorkspaceContext';

export default function WorkspaceHeader() {
  const { userProfile, notifications, openWindow, addNotification } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addNotification({
        id: Date.now(),
        type: 'info',
        title: 'Поиск',
        message: `Поиск по запросу: "${searchQuery}"`,
        timestamp: new Date()
      });
      setSearchQuery('');
    }
  };

  const quickActions = [
    { id: 'report', label: 'Отчет', icon: '📊', action: () => openWindow('analytics') },
    { id: 'task', label: 'Задача', icon: '✓', action: () => openWindow('tasks', { mode: 'create' }) },
    { id: 'chat', label: 'Чат', icon: '💬', action: () => document.querySelector('.ai-assistant-trigger')?.click() }
  ];

  return (
    <header className="workspace-header" role="banner">
      <div className="header-left">
        <div className="workspace-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>NeuroExpert Workspace</span>
        </div>
      </div>

      <div className="header-center">
        <form className="global-search" onSubmit={handleSearch} role="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" aria-hidden="true">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input 
            type="search" 
            placeholder="Поиск по всем данным..." 
            aria-label="Глобальный поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </form>
      </div>

      <div className="header-right">
        {/* Быстрые действия */}
        <div className="quick-actions">
          {quickActions.map(action => (
            <button
              key={action.id}
              className="quick-action-btn"
              onClick={action.action}
              aria-label={action.label}
              title={action.label}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Уведомления */}
        <div className="notification-wrapper">
          <button 
            className="header-btn" 
            aria-label={`Уведомления${unreadCount > 0 ? `, ${unreadCount} непрочитанных` : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2"/>
            </svg>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown" role="region" aria-label="Центр уведомлений">
              <h3>Уведомления</h3>
              {notifications.length === 0 ? (
                <p className="no-notifications">Нет новых уведомлений</p>
              ) : (
                <ul className="notification-list">
                  {notifications.slice(0, 5).map(notif => (
                    <li key={notif.id} className={`notification-item ${notif.read ? 'read' : ''}`}>
                      <div className="notif-content">
                        <h4>{notif.title}</h4>
                        <p>{notif.message}</p>
                        <time>{new Date(notif.timestamp).toLocaleTimeString()}</time>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Профиль пользователя */}
        <div className="user-menu-wrapper">
          <button 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Меню пользователя"
            aria-expanded={showUserMenu}
          >
            <span className="user-info">
              <span className="user-name">{userProfile.name}</span>
              <span className="user-level">Уровень {userProfile.level}</span>
            </span>
            <div className="user-avatar" aria-hidden="true">{userProfile.avatar}</div>
          </button>

          {showUserMenu && (
            <div className="user-dropdown" role="menu">
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-label">Очки опыта</span>
                  <span className="stat-value">{userProfile.points}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '65%' }}></div>
                </div>
              </div>
              <ul>
                <li><button role="menuitem" onClick={() => openWindow('settings')}>Настройки</button></li>
                <li><button role="menuitem">Достижения</button></li>
                <li><button role="menuitem">Выйти</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}