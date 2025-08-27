'use client';

import { useState } from 'react';
import { useWorkspace } from './WorkspaceContext';

export default function WorkspaceSidebar() {
  const { openWindow, sidebarCollapsed, setSidebarCollapsed } = useWorkspace();
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Дашборд',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2"/>
        </svg>
      ),
      action: () => openWindow('dashboard')
    },
    {
      id: 'analytics',
      label: 'Аналитика',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 20V10M12 20V4M6 20v-6" strokeWidth="2"/>
        </svg>
      ),
      action: () => openWindow('analytics')
    },
    {
      id: 'orders',
      label: 'Заказы',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
          <path d="M3 9h18M9 21V9" strokeWidth="2"/>
        </svg>
      ),
      action: () => openWindow('orders')
    },
    {
      id: 'documents',
      label: 'Документы',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeWidth="2"/>
          <path d="M13 2v7h7" strokeWidth="2"/>
        </svg>
      ),
      action: () => openWindow('documents')
    },
    {
      id: 'integrations',
      label: 'Интеграции',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeWidth="2"/>
        </svg>
      ),
      action: () => openWindow('integrations')
    },
    {
      id: 'support',
      label: 'Поддержка',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="2"/>
          <path d="M12 17h.01" strokeWidth="2"/>
        </svg>
      ),
      action: () => openWindow('support')
    }
  ];

  const handleItemClick = (item) => {
    console.log('Sidebar item clicked:', item.id);
    setActiveItem(item.id);
    if (item.action) {
      item.action();
    } else {
      console.error('No action defined for item:', item.id);
    }
  };

  return (
    <aside className={`workspace-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        aria-label={sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d={sidebarCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} strokeWidth="2"/>
        </svg>
      </button>

      <nav className="sidebar-nav" role="navigation" aria-label="Основная навигация">
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item)}
                aria-label={item.label}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="menu-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="menu-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!sidebarCollapsed && (
          <div className="workspace-stats">
            <div className="stat-mini">
              <span className="stat-label">Активных окон</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat-mini">
              <span className="stat-label">Время работы</span>
              <span className="stat-value">2ч 15м</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}