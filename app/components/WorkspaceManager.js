'use client';

import { useEffect, useState, useCallback } from 'react';

export default function WorkspaceManager() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState('');

  // Обновление времени
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Обработчик навигации
  const handleNavigation = useCallback((view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    
    // Обновляем активный элемент навигации
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.view === view) {
        item.classList.add('active');
      }
    });

    // Скрываем все секции и показываем активную
    document.querySelectorAll('.workspace-section').forEach(section => {
      section.style.display = 'none';
    });
    
    const activeSection = document.getElementById(`${view}-section`);
    if (activeSection) {
      activeSection.style.display = 'block';
    }
  }, []);

  // Обработчик сайдбара
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
    const sidebar = document.querySelector('.workspace-sidebar');
    const workspaceArea = document.querySelector('.workspace-area');
    
    if (window.innerWidth > 1200) {
      sidebar?.classList.toggle('collapsed');
      workspaceArea?.classList.toggle('expanded');
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
      sidebar?.classList.toggle('mobile-open');
    }
  }, [sidebarCollapsed, mobileMenuOpen]);

  // Инициализация обработчиков событий
  useEffect(() => {
    // Навигация
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.dataset.view;
        if (view) handleNavigation(view);
      });
    });

    // Кнопка меню для мобильных
    const menuBtn = document.querySelector('.menu-toggle');
    if (menuBtn) {
      menuBtn.addEventListener('click', toggleSidebar);
    }

    // Обновление статусбара
    const statusTime = document.querySelector('.status-time');
    if (statusTime && currentTime) {
      statusTime.textContent = currentTime;
    }

    // Обработчик изменения размера окна
    const handleResize = () => {
      if (window.innerWidth > 1200 && mobileMenuOpen) {
        setMobileMenuOpen(false);
        document.querySelector('.workspace-sidebar')?.classList.remove('mobile-open');
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      navItems.forEach(item => {
        item.removeEventListener('click', () => {});
      });
      if (menuBtn) {
        menuBtn.removeEventListener('click', toggleSidebar);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [handleNavigation, toggleSidebar, currentTime, mobileMenuOpen]);

  // Обработчик уведомлений
  useEffect(() => {
    const notificationBtn = document.querySelector('.notification-btn');
    const badge = document.querySelector('.notification-badge');
    
    if (notificationBtn && badge) {
      badge.textContent = notifications.toString();
      
      notificationBtn.addEventListener('click', () => {
        console.log('Открыть панель уведомлений');
        // Здесь можно добавить логику открытия панели уведомлений
      });
    }
  }, [notifications]);

  // Обработчик поиска
  useEffect(() => {
    const searchInput = document.querySelector('.global-search input');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        console.log('Поиск:', query);
        // Здесь можно добавить логику поиска
      });
    }
  }, []);

  // Обработчик быстрых действий
  useEffect(() => {
    const quickActions = document.querySelectorAll('.quick-action');
    
    quickActions.forEach(action => {
      action.addEventListener('click', () => {
        const actionType = action.dataset.action;
        console.log('Быстрое действие:', actionType);
        
        switch (actionType) {
          case 'new-report':
            console.log('Создать новый отчет');
            break;
          case 'new-task':
            console.log('Создать новую задачу');
            break;
          case 'export-data':
            console.log('Экспортировать данные');
            break;
          case 'settings':
            console.log('Открыть настройки');
            break;
          default:
            break;
        }
      });
    });
  }, []);

  // Анимация виджетов при загрузке
  useEffect(() => {
    const widgets = document.querySelectorAll('.kpi-widget, .chart-widget, .activity-widget, .quick-actions-widget, .ai-widget');
    
    widgets.forEach((widget, index) => {
      widget.style.opacity = '0';
      widget.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        widget.style.transition = 'all 0.5s ease';
        widget.style.opacity = '1';
        widget.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, [activeView]);

  // Обработчик темы
  useEffect(() => {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        console.log('Переключение темы');
        // Здесь можно добавить логику переключения темы
      });
    }
  }, []);

  return null; // Этот компонент управляет DOM напрямую
}