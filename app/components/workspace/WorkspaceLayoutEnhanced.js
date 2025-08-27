'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';

// Динамический импорт компонентов
const SmartCustomerChat = dynamic(() => import('../SmartCustomerChat'), {
  ssr: false,
  loading: () => <div>Загрузка чата...</div>
});

// Компонент поиска
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="search-bar" role="search">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="search"
        placeholder="Поиск по системе..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
        aria-label="Поиск"
      />
    </div>
  );
};

// Компонент быстрых действий
const QuickActions = ({ openWindow }) => {
  const actions = [
    { id: 'report', icon: '📊', label: 'Отчет' },
    { id: 'request', icon: '📝', label: 'Заявка' },
    { id: 'chat', icon: '💬', label: 'Чат' }
  ];

  return (
    <div className="quick-actions" role="toolbar">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => openWindow(action.id)}
          className="quick-action-btn"
          aria-label={action.label}
          title={action.label}
        >
          <span>{action.icon}</span>
        </button>
      ))}
    </div>
  );
};

// Компонент уведомлений
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Новый отчет готов', time: '5 мин назад' },
    { id: 2, type: 'success', message: 'Задача выполнена', time: '15 мин назад' },
    { id: 3, type: 'warning', message: 'Требуется внимание', time: '1 час назад' }
  ]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-center">
      <button 
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Уведомления"
        aria-expanded={isOpen}
      >
        <span className="notification-badge">{notifications.length}</span>
        🔔
      </button>
      {isOpen && (
        <div className="notification-dropdown" role="region" aria-label="Список уведомлений">
          <h4>Уведомления</h4>
          {notifications.map(notif => (
            <div key={notif.id} className={`notification-item ${notif.type}`}>
              <p>{notif.message}</p>
              <span className="notification-time">{notif.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Компонент виджета KPI с real-time обновлениями
const KPIWidget = ({ title, value, change, icon, updateInterval = 5000 }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [currentChange, setCurrentChange] = useState(change);

  useEffect(() => {
    const interval = setInterval(() => {
      // Симуляция real-time обновлений
      const fluctuation = (Math.random() - 0.5) * 10;
      const newValue = parseFloat(currentValue.replace(/[^0-9.-]+/g, ''));
      const updatedValue = (newValue + fluctuation).toFixed(1);
      const changeValue = ((fluctuation / newValue) * 100).toFixed(1);
      
      setCurrentValue(currentValue.includes('₽') ? `₽${updatedValue}M` : updatedValue);
      setCurrentChange(`${fluctuation > 0 ? '+' : ''}${changeValue}%`);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [currentValue, updateInterval]);

  return (
    <div className="kpi-widget" role="article" aria-label={`KPI: ${title}`}>
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <h4>{title}</h4>
      </div>
      <div className="kpi-value">{currentValue}</div>
      <div className={`kpi-change ${parseFloat(currentChange) > 0 ? 'positive' : 'negative'}`}>
        {currentChange}
      </div>
      <div className="kpi-sparkline">
        <svg viewBox="0 0 100 40" className="sparkline">
          <path 
            d="M 0 30 Q 25 20 50 25 T 100 15" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

// Компонент дашборда с настраиваемыми виджетами
const DashboardWindow = ({ userPreferences }) => {
  const [widgets, setWidgets] = useState([
    { id: 'revenue', title: 'Выручка за месяц', value: '₽12.4M', change: '+24%', icon: '💰', visible: true },
    { id: 'customers', title: 'Активные клиенты', value: '3847', change: '+12%', icon: '👥', visible: true },
    { id: 'conversion', title: 'Конверсия', value: '4.2%', change: '-5%', icon: '📈', visible: true },
    { id: 'average', title: 'Средний чек', value: '₽3220', change: '+8%', icon: '🛒', visible: true },
    { id: 'tasks', title: 'Активные задачи', value: '24', change: '+3%', icon: '📋', visible: true },
    { id: 'rating', title: 'Рейтинг', value: '4.8', change: '+0.2%', icon: '⭐', visible: true }
  ]);

  const [isDragging, setIsDragging] = useState(null);

  const handleDragStart = (e, widgetId) => {
    setIsDragging(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (isDragging && isDragging !== targetId) {
      const newWidgets = [...widgets];
      const dragIndex = newWidgets.findIndex(w => w.id === isDragging);
      const dropIndex = newWidgets.findIndex(w => w.id === targetId);
      const [removed] = newWidgets.splice(dragIndex, 1);
      newWidgets.splice(dropIndex, 0, removed);
      setWidgets(newWidgets);
    }
    setIsDragging(null);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h3>Главная панель</h3>
        <button className="customize-btn" aria-label="Настроить виджеты">
          ⚙️ Настроить
        </button>
      </div>
      
      <div className="widgets-grid">
        {widgets.filter(w => w.visible).map(widget => (
          <div
            key={widget.id}
            draggable
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, widget.id)}
            className={`widget-container ${isDragging === widget.id ? 'dragging' : ''}`}
          >
            <KPIWidget {...widget} />
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h4>График выручки (Real-time)</h4>
          <canvas id="revenue-chart" className="chart-canvas"></canvas>
        </div>
        <div className="chart-container">
          <h4>Источники трафика</h4>
          <canvas id="traffic-chart" className="chart-canvas"></canvas>
        </div>
      </div>
    </div>
  );
};

// Компонент интеграций
const IntegrationsWindow = () => {
  const integrations = [
    { id: 'google', name: 'Google Analytics', status: 'connected', icon: '📊' },
    { id: 'yandex', name: 'Яндекс.Метрика', status: 'connected', icon: '📈' },
    { id: 'telegram', name: 'Telegram Bot', status: 'disconnected', icon: '💬' },
    { id: 'crm', name: 'amoCRM', status: 'connected', icon: '🤝' },
    { id: 'payment', name: 'Stripe', status: 'disconnected', icon: '💳' }
  ];

  return (
    <div className="integrations-content">
      <h3>Интеграции и подключения</h3>
      <div className="integrations-grid">
        {integrations.map(integration => (
          <div key={integration.id} className="integration-card">
            <div className="integration-header">
              <span className="integration-icon">{integration.icon}</span>
              <h4>{integration.name}</h4>
            </div>
            <div className={`integration-status ${integration.status}`}>
              {integration.status === 'connected' ? '🟢 Подключено' : '🔴 Отключено'}
            </div>
            <button className="integration-action">
              {integration.status === 'connected' ? 'Настроить' : 'Подключить'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент истории действий
const ActivityHistory = () => {
  const [activities] = useState([
    { id: 1, action: 'Создан отчет', user: 'Вы', time: '10:15', type: 'report' },
    { id: 2, action: 'Изменены настройки', user: 'Админ', time: '09:45', type: 'settings' },
    { id: 3, action: 'Добавлен клиент', user: 'Менеджер', time: '09:30', type: 'client' },
    { id: 4, action: 'Выполнена задача', user: 'Вы', time: '08:20', type: 'task' }
  ]);

  return (
    <div className="activity-history">
      <h4>История действий</h4>
      <div className="activity-list">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">{
              activity.type === 'report' ? '📊' :
              activity.type === 'settings' ? '⚙️' :
              activity.type === 'client' ? '👤' : '✓'
            }</div>
            <div className="activity-details">
              <p>{activity.action}</p>
              <span>{activity.user} • {activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент окна с изменяемым размером
const ResizableWindow = ({ window, onClose, isActive, onActivate, onDrag, onResize, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(window.size);
  const windowRef = useRef(null);

  // Обработка перетаскивания
  const handleMouseDown = (e) => {
    if (e.target.className.includes('window-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onActivate();
    }
  };

  // Обработка изменения размера
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        onDrag(window.id, {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing) {
        const newWidth = size.width + (e.clientX - dragStart.x);
        const newHeight = size.height + (e.clientY - dragStart.y);
        setSize({
          width: Math.max(300, newWidth),
          height: Math.max(200, newHeight)
        });
        setDragStart({ x: e.clientX, y: e.clientY });
        onResize(window.id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, window.id, onDrag, onResize, size]);

  // Клавиатурная навигация
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose(window.id);
    } else if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'w':
          e.preventDefault();
          onClose(window.id);
          break;
        case 'm':
          e.preventDefault();
          // Максимизировать окно
          break;
      }
    }
  };

  return (
    <div 
      ref={windowRef}
      className={`workspace-window ${isActive ? 'active' : ''}`}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: size.width,
        height: size.height,
        zIndex: isActive ? 1000 : window.zIndex
      }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label={window.title}
    >
      <div className="window-header" role="banner">
        <h3 className="window-title">{window.title}</h3>
        <div className="window-controls" role="toolbar">
          <button 
            className="window-control minimize" 
            onClick={() => {}} 
            aria-label="Свернуть"
            title="Свернуть (Alt+M)"
          >
            _
          </button>
          <button 
            className="window-control maximize" 
            onClick={() => {}}
            aria-label="Развернуть"
            title="Развернуть (Alt+X)"
          >
            □
          </button>
          <button 
            className="window-control close" 
            onClick={(e) => {
              e.stopPropagation();
              onClose(window.id);
            }}
            aria-label="Закрыть"
            title="Закрыть (Ctrl+W)"
          >
            ×
          </button>
        </div>
      </div>
      <div className="window-body" role="main">
        {children}
      </div>
      <div 
        className="window-resize-handle"
        onMouseDown={handleResizeStart}
        aria-label="Изменить размер окна"
      />
    </div>
  );
};

// Компонент профиля и достижений (геймификация)
const ProfileProgress = ({ userRole, achievements }) => {
  const [level, setLevel] = useState(12);
  const [experience, setExperience] = useState(3450);
  const [nextLevelExp] = useState(5000);

  return (
    <div className="profile-progress">
      <div className="user-level">
        <span className="level-badge">Уровень {level}</span>
        <div className="experience-bar">
          <div 
            className="experience-fill" 
            style={{ width: `${(experience / nextLevelExp) * 100}%` }}
          />
          <span className="experience-text">{experience} / {nextLevelExp} XP</span>
        </div>
      </div>
      <div className="achievements">
        <h5>Достижения</h5>
        <div className="achievement-badges">
          <span className="achievement" title="Первый отчет">📊</span>
          <span className="achievement" title="100 клиентов">👥</span>
          <span className="achievement" title="Мастер аналитики">📈</span>
          <span className="achievement locked" title="Заблокировано">🔒</span>
        </div>
      </div>
    </div>
  );
};

// Главный компонент рабочего пространства
export default function WorkspaceLayoutEnhanced() {
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userRole] = useState('admin'); // admin, analyst, manager
  const [userPreferences, setUserPreferences] = useState({
    theme: 'dark',
    layout: 'default',
    widgets: ['revenue', 'customers', 'conversion', 'tasks']
  });

  // Загрузка сохраненной сессии
  useEffect(() => {
    const savedSession = localStorage.getItem('workspace-session');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setWindows(session.windows || []);
      setUserPreferences(session.preferences || userPreferences);
    }

    // Запрос разрешения на уведомления
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Симуляция push-уведомлений
    const notificationInterval = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('NeuroExpert', {
          body: 'Новые данные доступны в аналитике',
          icon: '/favicon.ico'
        });
      }
    }, 60000); // Каждую минуту

    return () => clearInterval(notificationInterval);
  }, []);

  // Сохранение сессии
  useEffect(() => {
    const session = {
      windows,
      preferences: userPreferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('workspace-session', JSON.stringify(session));
  }, [windows, userPreferences]);

  // Открытие окна
  const openWindow = useCallback((type) => {
    const windowConfigs = {
      dashboard: { title: '📊 Главная панель', size: { width: 800, height: 600 } },
      analytics: { title: '📈 Аналитика', size: { width: 900, height: 650 } },
      tasks: { title: '✓ Задачи', size: { width: 600, height: 700 } },
      documents: { title: '📁 Документы', size: { width: 650, height: 500 } },
      integrations: { title: '🔌 Интеграции', size: { width: 700, height: 550 } },
      chat: { title: '💬 AI Ассистент', size: { width: 450, height: 650 } },
      report: { title: '📊 Создать отчет', size: { width: 700, height: 600 } },
      request: { title: '📝 Новая заявка', size: { width: 600, height: 500 } }
    };

    const config = windowConfigs[type] || { 
      title: type, 
      size: { width: 600, height: 500 } 
    };

    const newWindow = {
      id: Date.now(),
      type,
      title: config.title,
      position: { 
        x: 100 + (windows.length * 30) % 400, 
        y: 50 + (windows.length * 30) % 300 
      },
      size: config.size,
      zIndex: windows.length + 1
    };

    setWindows([...windows, newWindow]);
    setActiveWindow(newWindow.id);

    // Добавляем опыт за открытие окна
    const event = new CustomEvent('userAction', { 
      detail: { action: 'openWindow', exp: 10 } 
    });
    window.dispatchEvent(event);
  }, [windows]);

  // Закрытие окна
  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  // Перемещение окна
  const handleDrag = (id, position) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  };

  // Изменение размера окна
  const handleResize = (id, size) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  };

  // Обработка поиска
  const handleSearch = (query) => {
    console.log('Поиск:', query);
    // Здесь будет логика поиска
  };

  // Обработка входа
  const handleLogin = (e) => {
    e.preventDefault();
    if (userEmail) {
      // Вход без пароля
      console.log('Вход выполнен для:', userEmail);
    }
  };

  // Рендер содержимого окна
  const renderWindowContent = (window) => {
    switch (window.type) {
      case 'dashboard':
        return <DashboardWindow userPreferences={userPreferences} />;
      case 'analytics':
        return <AnalyticsWindow />;
      case 'tasks':
        return <TasksWindow />;
      case 'documents':
        return <DocumentsWindow />;
      case 'integrations':
        return <IntegrationsWindow />;
      case 'chat':
        return <ChatWindow />;
      case 'report':
        return <ReportWindow />;
      case 'request':
        return <RequestWindow />;
      default:
        return <div>Неизвестный тип окна</div>;
    }
  };

  // Экран входа (без пароля)
  if (!userEmail) {
    return (
      <div className="workspace-login">
        <div className="login-container">
          <div className="login-header">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)">
              <defs>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2"/>
            </svg>
            <h1>NeuroExpert Workspace</h1>
            <p>Мультиоконное рабочее пространство для управления бизнесом</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email для входа</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                autoFocus
                aria-label="Email адрес"
              />
            </div>
            <button type="submit" className="login-btn">
              Войти в рабочее пространство
            </button>
            <p className="demo-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              Для демо входа используйте любой email
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Основной интерфейс
  return (
    <div className="workspace-enhanced" role="application" aria-label="NeuroExpert Workspace">
      {/* Верхняя панель */}
      <header className="workspace-header" role="banner">
        <div className="header-left">
          <div className="workspace-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2"/>
            </svg>
            <span>NeuroExpert</span>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="header-center">
          <QuickActions openWindow={openWindow} />
        </div>

        <div className="header-right">
          <NotificationCenter />
          <div className="user-menu">
            <button className="user-menu-btn" aria-label="Меню пользователя">
              <div className="user-avatar">{userEmail.charAt(0).toUpperCase()}</div>
              <span className="user-name">{userEmail}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="workspace-body">
        {/* Боковая панель */}
        <aside className="workspace-sidebar" role="navigation" aria-label="Главное меню">
          <nav className="sidebar-nav">
            <button 
              onClick={() => openWindow('dashboard')} 
              className="nav-btn"
              aria-label="Открыть главную панель"
            >
              <span>📊</span>
              <span className="nav-label">Дашборд</span>
            </button>
            <button 
              onClick={() => openWindow('analytics')} 
              className="nav-btn"
              aria-label="Открыть аналитику"
            >
              <span>📈</span>
              <span className="nav-label">Аналитика</span>
            </button>
            <button 
              onClick={() => openWindow('tasks')} 
              className="nav-btn"
              aria-label="Открыть задачи"
            >
              <span>✓</span>
              <span className="nav-label">Задачи</span>
            </button>
            <button 
              onClick={() => openWindow('documents')} 
              className="nav-btn"
              aria-label="Открыть документы"
            >
              <span>📁</span>
              <span className="nav-label">Документы</span>
            </button>
            <button 
              onClick={() => openWindow('integrations')} 
              className="nav-btn"
              aria-label="Открыть интеграции"
            >
              <span>🔌</span>
              <span className="nav-label">Интеграции</span>
            </button>
            <button 
              onClick={() => openWindow('chat')} 
              className="nav-btn"
              aria-label="Открыть чат поддержки"
            >
              <span>💬</span>
              <span className="nav-label">Поддержка</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <ProfileProgress userRole={userRole} />
            <ActivityHistory />
          </div>
        </aside>

        {/* Рабочая область */}
        <main className="workspace-main" role="main">
          <div className="workspace-desktop">
            {windows.length === 0 && (
              <div className="empty-desktop">
                <h2>Добро пожаловать в рабочее пространство!</h2>
                <p>Выберите модуль из меню слева или используйте быстрые действия</p>
                <div className="desktop-hints">
                  <div className="hint">
                    <kbd>Ctrl</kbd> + <kbd>N</kbd> - Новое окно
                  </div>
                  <div className="hint">
                    <kbd>Ctrl</kbd> + <kbd>W</kbd> - Закрыть окно
                  </div>
                  <div className="hint">
                    <kbd>Alt</kbd> + <kbd>Tab</kbd> - Переключение окон
                  </div>
                </div>
              </div>
            )}
            
            {windows.map(window => (
              <ResizableWindow
                key={window.id}
                window={window}
                isActive={activeWindow === window.id}
                onClose={closeWindow}
                onActivate={() => setActiveWindow(window.id)}
                onDrag={handleDrag}
                onResize={handleResize}
              >
                {renderWindowContent(window)}
              </ResizableWindow>
            ))}
          </div>
        </main>
      </div>

      {/* Панель статуса */}
      <footer className="workspace-status" role="contentinfo">
        <div className="status-left">
          <span className="status-item">
            <span className="status-dot online"></span>
            Система работает
          </span>
          <span className="status-item">
            Последнее обновление: {new Date().toLocaleTimeString()}
          </span>
        </div>
        <div className="status-right">
          <span className="status-item">
            Роль: {userRole === 'admin' ? 'Администратор' : 
                   userRole === 'analyst' ? 'Аналитик' : 'Менеджер'}
          </span>
          <button 
            className="logout-btn"
            onClick={() => setUserEmail('')}
            aria-label="Выйти из системы"
          >
            Выйти
          </button>
        </div>
      </footer>
    </div>
  );
}

// Дополнительные компоненты для полноты функционала
const AnalyticsWindow = () => {
  return <div>Аналитика (компонент из предыдущей версии)</div>;
};

const TasksWindow = () => {
  return <div>Задачи (компонент из предыдущей версии)</div>;
};

const DocumentsWindow = () => {
  return <div>Документы (компонент из предыдущей версии)</div>;
};

const ChatWindow = () => {
  return <SmartCustomerChat />;
};

const ReportWindow = () => {
  return (
    <div className="report-content">
      <h3>Создание отчета</h3>
      <form className="report-form">
        <div className="form-group">
          <label>Тип отчета</label>
          <select>
            <option>Финансовый отчет</option>
            <option>Отчет по клиентам</option>
            <option>Аналитический отчет</option>
          </select>
        </div>
        <div className="form-group">
          <label>Период</label>
          <input type="date" /> - <input type="date" />
        </div>
        <button type="submit">Сформировать отчет</button>
      </form>
    </div>
  );
};

const RequestWindow = () => {
  return (
    <div className="request-content">
      <h3>Новая заявка</h3>
      <form className="request-form">
        <div className="form-group">
          <label>Тема заявки</label>
          <input type="text" placeholder="Краткое описание" />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea rows="5" placeholder="Подробное описание..."></textarea>
        </div>
        <div className="form-group">
          <label>Приоритет</label>
          <select>
            <option>Низкий</option>
            <option>Средний</option>
            <option>Высокий</option>
          </select>
        </div>
        <button type="submit">Отправить заявку</button>
      </form>
    </div>
  );
};