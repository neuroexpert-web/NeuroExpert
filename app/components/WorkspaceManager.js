'use client';

import { useEffect, useState, useCallback } from 'react';

export default function WorkspaceManager() {
  const [activeView, setActiveView] = useState('dashboard');
  const [windows, setWindows] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Новая заявка от клиента', time: '5 мин назад' },
    { id: 2, text: 'Отчет за неделю готов', time: '1 час назад' }
  ]);

  // Инициализация workspace
  useEffect(() => {
    // Восстановление сохраненного состояния
    const savedState = localStorage.getItem('workspaceState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setActiveView(state.activeView || 'dashboard');
      setWindows(state.windows || []);
    }

    // Установка обработчиков событий
    const handleKeyPress = (e) => {
      // Горячие клавиши
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'k': // Поиск
            e.preventDefault();
            document.querySelector('.global-search input')?.focus();
            break;
          case 'n': // Новая задача
            e.preventDefault();
            openWindow('task-create');
            break;
          case '/': // AI помощник
            e.preventDefault();
            openWindow('ai-assistant');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Сохранение состояния
  useEffect(() => {
    const state = { activeView, windows };
    localStorage.setItem('workspaceState', JSON.stringify(state));
  }, [activeView, windows]);

  // Управление окнами
  const openWindow = useCallback((windowType) => {
    const newWindow = {
      id: Date.now(),
      type: windowType,
      position: { x: 100 + windows.length * 20, y: 100 + windows.length * 20 },
      size: { width: 600, height: 400 },
      minimized: false
    };
    setWindows([...windows, newWindow]);
  }, [windows]);

  const closeWindow = useCallback((windowId) => {
    setWindows(windows.filter(w => w.id !== windowId));
  }, [windows]);

  // Переключение видов
  const switchView = useCallback((view) => {
    setActiveView(view);
    // Анимация переключения
    const workspace = document.querySelector('.workspace-area');
    workspace.style.opacity = '0';
    setTimeout(() => {
      workspace.style.opacity = '1';
    }, 150);
  }, []);

  // Обработка навигации
  useEffect(() => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        if (view) switchView(view);
      });
    });
  }, [switchView]);

  // Управление темой
  useEffect(() => {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      });
    }

    // Восстановление темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  }, []);

  // Обработка уведомлений
  useEffect(() => {
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        // Показать панель уведомлений
        console.log('Показать уведомления:', notifications);
      });
    }
  }, [notifications]);

  // Поиск
  useEffect(() => {
    const searchInput = document.querySelector('.global-search input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length > 2) {
          // Выполнить поиск
          console.log('Поиск:', query);
        }
      });
    }
  }, []);

  return null; // Этот компонент управляет состоянием, но не рендерит UI
}