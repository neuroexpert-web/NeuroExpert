'use client';

import { useState, useEffect, useCallback } from 'react';
import WorkspaceHeader from './WorkspaceHeader';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceWindows from './WorkspaceWindows';
import WorkspaceWidgets from './WorkspaceWidgets';
import NotificationCenter from './NotificationCenter';
import AIAssistant from './AIAssistant';
import { WorkspaceProvider } from './WorkspaceContext';

export default function WorkspaceLayout() {
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: 'Демо пользователь',
    role: 'admin',
    avatar: 'ДП',
    level: 5,
    points: 1250
  });

  // Загрузка сохраненной сессии
  useEffect(() => {
    const savedSession = localStorage.getItem('workspace-session');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setWindows(session.windows || []);
      setWidgets(session.widgets || []);
    } else {
      // Начальные виджеты
      setWidgets([
        { id: 'revenue', type: 'kpi', title: 'Выручка за месяц', value: '2.3M ₽', change: '+23%', position: { x: 0, y: 0 }, size: { width: 300, height: 150 } },
        { id: 'clients', type: 'kpi', title: 'Активные клиенты', value: '1,847', change: '+12%', position: { x: 320, y: 0 }, size: { width: 300, height: 150 } },
        { id: 'tasks', type: 'kpi', title: 'Задачи в работе', value: '23', change: '-5%', position: { x: 640, y: 0 }, size: { width: 300, height: 150 } },
        { id: 'chart', type: 'chart', title: 'Динамика продаж', position: { x: 0, y: 170 }, size: { width: 620, height: 300 } },
        { id: 'activity', type: 'activity', title: 'Последняя активность', position: { x: 640, y: 170 }, size: { width: 300, height: 300 } }
      ]);
    }
  }, []);

  // Сохранение сессии
  useEffect(() => {
    const session = { windows, widgets };
    localStorage.setItem('workspace-session', JSON.stringify(session));
  }, [windows, widgets]);

  // Real-time обновления (симуляция)
  useEffect(() => {
    const interval = setInterval(() => {
      // Обновление KPI
      setWidgets(prev => prev.map(widget => {
        if (widget.type === 'kpi' && widget.id === 'revenue') {
          const newValue = (2.3 + Math.random() * 0.1).toFixed(1);
          return { ...widget, value: `${newValue}M ₽`, lastUpdate: new Date() };
        }
        return widget;
      }));

      // Случайные уведомления
      if (Math.random() > 0.8) {
        addNotification({
          id: Date.now(),
          type: 'info',
          title: 'Новое событие',
          message: 'Получен новый заказ #' + Math.floor(Math.random() * 1000),
          timestamp: new Date()
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const openWindow = useCallback((type, data = {}) => {
    const newWindow = {
      id: Date.now(),
      type,
      title: data.title || getWindowTitle(type),
      position: { x: 100 + windows.length * 20, y: 100 + windows.length * 20 },
      size: { width: 600, height: 400 },
      minimized: false,
      maximized: false,
      data,
      zIndex: windows.length + 1
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindow(newWindow.id);
  }, [windows]);

  const closeWindow = useCallback((windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
  }, [activeWindow]);

  const updateWindow = useCallback((windowId, updates) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, ...updates } : w
    ));
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 10));
  }, []);

  const updateWidget = useCallback((widgetId, updates) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    ));
  }, []);

  const getWindowTitle = (type) => {
    const titles = {
      analytics: 'Аналитика',
      tasks: 'Управление задачами',
      orders: 'Заказы',
      documents: 'Документы',
      integrations: 'Интеграции',
      settings: 'Настройки'
    };
    return titles[type] || 'Новое окно';
  };

  const workspaceValue = {
    windows,
    activeWindow,
    notifications,
    userProfile,
    widgets,
    sidebarCollapsed,
    openWindow,
    closeWindow,
    updateWindow,
    setActiveWindow,
    addNotification,
    updateWidget,
    setSidebarCollapsed
  };

  return (
    <WorkspaceProvider value={workspaceValue}>
      <div className="workspace-layout">
        <WorkspaceHeader />
        <div className="workspace-body">
          <WorkspaceSidebar />
          <main className="workspace-main">
            <WorkspaceWidgets />
            <WorkspaceWindows />
          </main>
        </div>
        <NotificationCenter />
        <AIAssistant />
      </div>
    </WorkspaceProvider>
  );
}