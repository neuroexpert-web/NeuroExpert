'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkspaceProvider } from './WorkspaceContext';

// Простые заглушки компонентов для тестирования
const WorkspaceHeader = ({ openWindow, notifications, userProfile }) => (
  <header className="workspace-header">
    <div className="header-left">
      <div className="workspace-logo">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2"/>
        </svg>
        <span>NeuroExpert Workspace</span>
      </div>
    </div>
    <div className="header-right">
      <span>{userProfile.name}</span>
      <div className="user-avatar">{userProfile.avatar}</div>
    </div>
  </header>
);

const WorkspaceSidebar = ({ openWindow }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', type: 'dashboard' },
    { id: 'analytics', label: 'Аналитика', type: 'analytics' },
    { id: 'tasks', label: 'Задачи', type: 'tasks' },
    { id: 'documents', label: 'Документы', type: 'documents' }
  ];

  return (
    <aside className="workspace-sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                className="menu-item"
                onClick={() => {
                  console.log('Menu clicked:', item.type);
                  openWindow(item.type);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const WorkspaceWindow = ({ window, onClose, isActive, onActivate }) => (
  <div 
    className={`workspace-window ${isActive ? 'active' : ''}`}
    style={{
      left: window.position.x,
      top: window.position.y,
      width: window.size.width,
      height: window.size.height,
      zIndex: isActive ? 1000 : window.zIndex
    }}
    onClick={onActivate}
  >
    <div className="window-header">
      <h3 className="window-title">{window.title}</h3>
      <button className="window-control close" onClick={(e) => {
        e.stopPropagation();
        onClose(window.id);
      }}>×</button>
    </div>
    <div className="window-body">
      <p>Window Type: {window.type}</p>
      <p>Window ID: {window.id}</p>
    </div>
  </div>
);

export default function WorkspaceLayoutFixed() {
  console.log('WorkspaceLayoutFixed rendering...');
  
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [userProfile] = useState({
    name: 'Демо пользователь',
    avatar: 'ДП'
  });

  const openWindow = useCallback((type) => {
    console.log('Opening window:', type);
    const newWindow = {
      id: Date.now(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 500, height: 400 },
      zIndex: windows.length + 1
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindow(newWindow.id);
  }, [windows.length]);

  const closeWindow = useCallback((windowId) => {
    console.log('Closing window:', windowId);
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
  }, [activeWindow]);

  const workspaceValue = {
    windows,
    activeWindow,
    notifications: [],
    userProfile,
    openWindow,
    closeWindow,
    setActiveWindow
  };

  return (
    <WorkspaceProvider value={workspaceValue}>
      <div className="workspace-layout">
        <WorkspaceHeader 
          openWindow={openWindow}
          notifications={[]}
          userProfile={userProfile}
        />
        <div className="workspace-body">
          <WorkspaceSidebar openWindow={openWindow} />
          <main className="workspace-main">
            <div className="workspace-welcome">
              <h1>Добро пожаловать в личный кабинет!</h1>
              <p>Нажмите на пункты меню слева, чтобы открыть окна</p>
              <p>Открыто окон: {windows.length}</p>
            </div>
            {windows.map(window => (
              <WorkspaceWindow
                key={window.id}
                window={window}
                onClose={closeWindow}
                isActive={activeWindow === window.id}
                onActivate={() => setActiveWindow(window.id)}
              />
            ))}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}