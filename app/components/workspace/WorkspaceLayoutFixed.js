'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Динамический импорт компонентов
const SmartCustomerChat = dynamic(() => import('../SmartCustomerChat'), {
  ssr: false,
  loading: () => <div>Загрузка чата...</div>
});

// Компонент окна дашборда
const DashboardWindow = () => {
  const metrics = [
    { label: 'Выручка за месяц', value: '₽12.4M', change: '+24%', positive: true },
    { label: 'Активные клиенты', value: '3,847', change: '+12%', positive: true },
    { label: 'Конверсия', value: '4.2%', change: '-5%', positive: false },
    { label: 'Средний чек', value: '₽3,220', change: '+8%', positive: true }
  ];

  return (
    <div className="dashboard-content">
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <h4>{metric.label}</h4>
            <div className="metric-value">{metric.value}</div>
            <div className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>
      <div className="chart-container">
        <h3>График выручки</h3>
        <div className="chart-placeholder">
          <svg viewBox="0 0 400 200" className="revenue-chart">
            <path d="M 0 150 Q 100 100 200 120 T 400 80" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="3"/>
            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Компонент окна аналитики
const AnalyticsWindow = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  return (
    <div className="analytics-content">
      <div className="analytics-header">
        <h3>Аналитика бизнеса</h3>
        <div className="period-selector">
          {['day', 'week', 'month', 'year'].map(period => (
            <button 
              key={period}
              className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'day' ? 'День' : 
               period === 'week' ? 'Неделя' :
               period === 'month' ? 'Месяц' : 'Год'}
            </button>
          ))}
        </div>
      </div>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>Источники трафика</h4>
          <div className="traffic-sources">
            <div className="source-item">
              <span>Органический поиск</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '65%'}}></div>
              </div>
              <span>65%</span>
            </div>
            <div className="source-item">
              <span>Социальные сети</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '25%'}}></div>
              </div>
              <span>25%</span>
            </div>
            <div className="source-item">
              <span>Прямые заходы</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '10%'}}></div>
              </div>
              <span>10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент окна задач
const TasksWindow = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Проверить отчеты', completed: false, priority: 'high' },
    { id: 2, title: 'Созвон с клиентом', completed: false, priority: 'medium' },
    { id: 3, title: 'Обновить презентацию', completed: true, priority: 'low' }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    ));
  };

  return (
    <div className="tasks-content">
      <div className="tasks-header">
        <h3>Мои задачи</h3>
        <button className="add-task-btn">+ Добавить задачу</button>
      </div>
      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className="task-title">{task.title}</span>
            <span className={`priority ${task.priority}`}>
              {task.priority === 'high' ? 'Высокий' :
               task.priority === 'medium' ? 'Средний' : 'Низкий'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент окна документов
const DocumentsWindow = () => {
  const documents = [
    { name: 'Отчет Q4 2024.pdf', size: '2.4 MB', date: '15.01.2025' },
    { name: 'Презентация продукта.pptx', size: '15.7 MB', date: '14.01.2025' },
    { name: 'Договор №2345.docx', size: '245 KB', date: '12.01.2025' }
  ];

  return (
    <div className="documents-content">
      <div className="documents-header">
        <h3>Документы</h3>
        <button className="upload-btn">⬆ Загрузить</button>
      </div>
      <div className="documents-list">
        {documents.map((doc, index) => (
          <div key={index} className="document-item">
            <div className="doc-icon">📄</div>
            <div className="doc-info">
              <div className="doc-name">{doc.name}</div>
              <div className="doc-meta">{doc.size} • {doc.date}</div>
            </div>
            <button className="doc-action">⬇</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент окна чата
const ChatWindow = () => {
  return (
    <div className="chat-window-content">
      <SmartCustomerChat />
    </div>
  );
};

// Компонент окна в рабочем пространстве
const WorkspaceWindow = ({ window, onClose, isActive, onActivate, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        onDrag(window.id, {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, window.id, onDrag]);

  const renderContent = () => {
    switch (window.type) {
      case 'dashboard': return <DashboardWindow />;
      case 'analytics': return <AnalyticsWindow />;
      case 'tasks': return <TasksWindow />;
      case 'documents': return <DocumentsWindow />;
      case 'chat': return <ChatWindow />;
      default: return <div>Неизвестный тип окна</div>;
    }
  };

  return (
    <div 
      className={`workspace-window ${isActive ? 'active' : ''}`}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: isActive ? 1000 : window.zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header">
        <h3 className="window-title">{window.title}</h3>
        <div className="window-controls">
          <button className="window-control minimize">_</button>
          <button className="window-control maximize">□</button>
          <button className="window-control close" onClick={(e) => {
            e.stopPropagation();
            onClose(window.id);
          }}>×</button>
        </div>
      </div>
      <div className="window-body">
        {renderContent()}
      </div>
    </div>
  );
};

// Главный компонент
export default function WorkspaceLayoutFixed() {
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const openWindow = useCallback((type) => {
    const titles = {
      dashboard: '📊 Дашборд',
      analytics: '📈 Аналитика',
      tasks: '✓ Задачи',
      documents: '📁 Документы',
      chat: '💬 AI Ассистент'
    };

    const sizes = {
      dashboard: { width: 600, height: 500 },
      analytics: { width: 700, height: 550 },
      tasks: { width: 500, height: 600 },
      documents: { width: 550, height: 450 },
      chat: { width: 400, height: 600 }
    };

    const newWindow = {
      id: Date.now(),
      type,
      title: titles[type] || type,
      position: { 
        x: 50 + (windows.length * 30) % 300, 
        y: 50 + (windows.length * 30) % 200 
      },
      size: sizes[type] || { width: 500, height: 400 },
      zIndex: windows.length + 1
    };

    setWindows([...windows, newWindow]);
    setActiveWindow(newWindow.id);
  }, [windows]);

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const handleDrag = (id, position) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.email && credentials.password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="workspace-login">
        <div className="login-container">
          <div className="login-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2"/>
            </svg>
            <h2>Workspace NeuroExpert</h2>
            <p>Войдите в ваше рабочее пространство</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
            <button type="submit">Войти</button>
            <p className="demo-hint">Для демо входа используйте любые данные</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-layout">
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
          <button className="notification-btn">
            <span className="notification-badge">3</span>
            🔔
          </button>
          <div className="user-info">
            <span>{credentials.email}</span>
            <button onClick={() => setIsLoggedIn(false)} className="logout-btn">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="workspace-body">
        <aside className="workspace-sidebar">
          <nav className="sidebar-nav">
            <button onClick={() => openWindow('dashboard')} className="nav-btn">
              <span>📊</span> Дашборд
            </button>
            <button onClick={() => openWindow('analytics')} className="nav-btn">
              <span>📈</span> Аналитика
            </button>
            <button onClick={() => openWindow('tasks')} className="nav-btn">
              <span>✓</span> Задачи
            </button>
            <button onClick={() => openWindow('documents')} className="nav-btn">
              <span>📁</span> Документы
            </button>
            <button onClick={() => openWindow('chat')} className="nav-btn">
              <span>💬</span> AI Ассистент
            </button>
          </nav>
        </aside>

        <main className="workspace-main">
          <div className="workspace-desktop">
            {windows.length === 0 && (
              <div className="empty-desktop">
                <h3>Добро пожаловать в Workspace!</h3>
                <p>Выберите приложение из меню слева</p>
              </div>
            )}
            {windows.map(window => (
              <WorkspaceWindow
                key={window.id}
                window={window}
                isActive={activeWindow === window.id}
                onClose={closeWindow}
                onActivate={() => setActiveWindow(window.id)}
                onDrag={handleDrag}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}