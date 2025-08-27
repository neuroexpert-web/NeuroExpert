'use client';

import { useEffect, useState, useCallback } from 'react';

const WorkspaceManager = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [focusMode, setFocusMode] = useState(false);
  
  // Инициализация рабочего пространства
  useEffect(() => {
    // Загрузка сохраненных настроек из localStorage
    const savedSettings = localStorage.getItem('workspace-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setActiveSection(settings.activeSection || 'dashboard');
      setTheme(settings.theme || 'dark');
      setFocusMode(settings.focusMode || false);
    }
    
    // Установка темы
    document.documentElement.setAttribute('data-theme', theme);
    
    // Обработка размера экрана для мобильных
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);
  
  // Сохранение настроек
  const saveSettings = useCallback(() => {
    const settings = {
      activeSection,
      theme,
      focusMode,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('workspace-settings', JSON.stringify(settings));
  }, [activeSection, theme, focusMode]);
  
  useEffect(() => {
    saveSettings();
  }, [saveSettings]);
  
  // Переключение секций
  const handleSectionChange = (section) => {
    setActiveSection(section);
    
    // Для мобильных устройств закрываем сайдбар после выбора
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };
  
  // Переключение темы
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  // Переключение режима фокуса
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
    document.body.classList.toggle('focus-mode');
  };
  
  // Обработка навигационных элементов
  useEffect(() => {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        if (section) {
          handleSectionChange(section);
        }
      });
    });
    
    // Активная секция
    navItems.forEach(item => {
      const section = item.getAttribute('data-section');
      if (section === activeSection) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Переключение темы
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Мобильный toggle для сайдбара
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        setSidebarOpen(!sidebarOpen);
      });
    }
    
    return () => {
      navItems.forEach(item => {
        item.removeEventListener('click', () => {});
      });
    };
  }, [activeSection, sidebarOpen]);
  
  // Управление видимостью сайдбара
  useEffect(() => {
    const sidebar = document.querySelector('.workspace-sidebar');
    if (sidebar) {
      if (sidebarOpen) {
        sidebar.classList.add('open');
      } else {
        sidebar.classList.remove('open');
      }
    }
  }, [sidebarOpen]);
  
  // Обработка быстрых действий
  useEffect(() => {
    const quickActions = document.querySelectorAll('.quick-action');
    
    quickActions.forEach(action => {
      action.addEventListener('click', (e) => {
        e.preventDefault();
        const actionType = action.getAttribute('data-action');
        
        switch (actionType) {
          case 'new-report':
            console.log('Создание нового отчета...');
            break;
          case 'export-data':
            console.log('Экспорт данных...');
            break;
          case 'schedule-meeting':
            console.log('Планирование встречи...');
            break;
          case 'quick-analysis':
            console.log('Быстрый анализ...');
            break;
          default:
            console.log('Действие:', actionType);
        }
      });
    });
  }, []);
  
  // Обработка уведомлений
  useEffect(() => {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationBadge = document.querySelector('.notification-badge');
    
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        console.log('Открытие панели уведомлений...');
        
        // Сброс счетчика уведомлений
        if (notificationBadge) {
          notificationBadge.style.display = 'none';
        }
      });
    }
    
    // Симуляция новых уведомлений
    const simulateNotifications = () => {
      const randomInterval = Math.random() * 30000 + 30000; // 30-60 секунд
      
      setTimeout(() => {
        if (notificationBadge) {
          const count = parseInt(notificationBadge.textContent) || 0;
          notificationBadge.textContent = count + 1;
          notificationBadge.style.display = 'flex';
        }
        
        simulateNotifications();
      }, randomInterval);
    };
    
    simulateNotifications();
  }, []);
  
  // Поиск
  useEffect(() => {
    const searchInput = document.querySelector('.global-search input');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        
        if (query.length > 2) {
          console.log('Поиск:', query);
          // Здесь можно реализовать логику поиска
        }
      });
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          console.log('Выполнение поиска:', e.target.value);
        }
      });
    }
  }, []);
  
  // Управление пользовательским профилем
  useEffect(() => {
    const userProfile = document.querySelector('.user-profile');
    
    if (userProfile) {
      userProfile.addEventListener('click', () => {
        console.log('Открытие меню профиля...');
        // Здесь можно добавить dropdown меню
      });
    }
  }, []);
  
  // Клавиатурные сокращения
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl/Cmd + K для поиска
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.global-search input');
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Ctrl/Cmd + B для toggle сайдбара
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
      
      // Ctrl/Cmd + F для режима фокуса
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        toggleFocusMode();
      }
    };
    
    document.addEventListener('keydown', handleKeyboard);
    
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [sidebarOpen]);
  
  return null; // Этот компонент управляет DOM напрямую
};

export default WorkspaceManager;