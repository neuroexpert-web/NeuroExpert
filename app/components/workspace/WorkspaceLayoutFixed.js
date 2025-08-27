'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import MobileWorkspace from './MobileWorkspace';

// Динамический импорт компонентов
const SmartCustomerChat = dynamic(() => import('../SmartCustomerChat'), {
  ssr: false,
  loading: () => <div className="chat-loading">Загрузка чата...</div>
});

// ========== КОМПОНЕНТЫ ВЕРХНЕЙ ПАНЕЛИ ==========

// Компонент поиска
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length > 2) {
      // Симуляция результатов поиска
      const results = [
        { id: 1, title: 'Отчет за декабрь', type: 'document' },
        { id: 2, title: 'Настройки интеграций', type: 'settings' },
        { id: 3, title: 'Клиент: ООО Ромашка', type: 'client' }
      ].filter(item => 
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

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
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
        aria-label="Поиск"
      />
      {showResults && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(result => (
            <div key={result.id} className="search-result-item">
              <span className="result-type">{result.type}</span>
              <span className="result-title">{result.title}</span>
            </div>
          ))}
        </div>
      )}
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
    { id: 1, type: 'info', message: 'Новый отчет готов', time: '5 мин назад', read: false },
    { id: 2, type: 'success', message: 'Задача выполнена', time: '15 мин назад', read: false },
    { id: 3, type: 'warning', message: 'Требуется внимание', time: '1 час назад', read: true }
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-center">
      <button 
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Уведомления"
        aria-expanded={isOpen}
      >
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        🔔
      </button>
      {isOpen && (
        <div className="notification-dropdown" role="region" aria-label="Список уведомлений">
          <div className="notification-header">
            <h4>Уведомления</h4>
            <button onClick={clearAll} className="clear-btn">Очистить все</button>
          </div>
          {notifications.length === 0 ? (
            <p className="no-notifications">Нет новых уведомлений</p>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notif.id)}
              >
                <p>{notif.message}</p>
                <span className="notification-time">{notif.time}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ========== КОМПОНЕНТЫ ОКОН ==========

// Компонент виджета KPI с real-time обновлениями
const KPIWidget = ({ title, value, change, icon, updateInterval = 5000 }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [currentChange, setCurrentChange] = useState(change);

  useEffect(() => {
    const interval = setInterval(() => {
      // Симуляция real-time обновлений
      const fluctuation = (Math.random() - 0.5) * 10;
      const newValue = parseFloat(currentValue.toString().replace(/[^0-9.-]+/g, ''));
      const updatedValue = (newValue + fluctuation).toFixed(1);
      const changeValue = ((fluctuation / newValue) * 100).toFixed(1);
      
      setCurrentValue(currentValue.toString().includes('₽') ? `₽${updatedValue}M` : updatedValue);
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

// Компонент дашборда
const DashboardWindow = ({ userPreferences }) => {
  const [widgets, setWidgets] = useState([
    { id: 'revenue', title: 'Выручка за месяц', value: '₽12.4M', change: '+24%', icon: '💰', visible: true },
    { id: 'customers', title: 'Активные клиенты', value: '3847', change: '+12%', icon: '👥', visible: true },
    { id: 'conversion', title: 'Конверсия', value: '4.2%', change: '-5%', icon: '📈', visible: true },
    { id: 'average', title: 'Средний чек', value: '₽3220', change: '+8%', icon: '🛒', visible: true },
    { id: 'tasks', title: 'Активные задачи', value: '24', change: '+3%', icon: '📋', visible: true },
    { id: 'rating', title: 'Рейтинг', value: '4.8', change: '+0.2%', icon: '⭐', visible: true }
  ]);

  const [showCustomize, setShowCustomize] = useState(false);
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

  const toggleWidget = (id) => {
    setWidgets(widgets.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h3>Главная панель</h3>
        <button 
          className="customize-btn" 
          onClick={() => setShowCustomize(!showCustomize)}
          aria-label="Настроить виджеты"
        >
          ⚙️ Настроить
        </button>
      </div>
      
      {showCustomize && (
        <div className="customize-panel">
          <h4>Выберите виджеты для отображения:</h4>
          <div className="widget-toggles">
            {widgets.map(widget => (
              <label key={widget.id} className="widget-toggle">
                <input
                  type="checkbox"
                  checked={widget.visible}
                  onChange={() => toggleWidget(widget.id)}
                />
                <span>{widget.icon} {widget.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
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
          <div className="chart-placeholder">
            <svg viewBox="0 0 400 200" className="revenue-chart">
              <path d="M 0 150 Q 100 80 200 100 T 400 60" 
                    fill="none" 
                    stroke="url(#revenue-gradient)" 
                    strokeWidth="3"/>
              <defs>
                <linearGradient id="revenue-gradient">
                  <stop offset="0%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="chart-container">
          <h4>Источники трафика</h4>
          <div className="traffic-sources">
            <div className="source-item">
              <span className="source-name">Органический</span>
              <div className="source-bar" style={{width: '65%', background: '#8b5cf6'}}></div>
              <span className="source-value">65%</span>
            </div>
            <div className="source-item">
              <span className="source-name">Социальные</span>
              <div className="source-bar" style={{width: '25%', background: '#3b82f6'}}></div>
              <span className="source-value">25%</span>
            </div>
            <div className="source-item">
              <span className="source-name">Прямые</span>
              <div className="source-bar" style={{width: '10%', background: '#10b981'}}></div>
              <span className="source-value">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент аналитики
const AnalyticsWindow = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
  const metrics = {
    revenue: { name: 'Выручка', value: '₽45.2M', change: '+18%' },
    users: { name: 'Пользователи', value: '12,847', change: '+24%' },
    conversion: { name: 'Конверсия', value: '3.8%', change: '+0.5%' },
    retention: { name: 'Удержание', value: '78%', change: '+2%' }
  };

  return (
    <div className="analytics-content">
      <div className="analytics-header">
        <h3>Аналитика бизнеса</h3>
        <div className="analytics-controls">
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
          <button className="export-btn">
            📥 Экспорт
          </button>
        </div>
      </div>

      <div className="metrics-selector">
        {Object.entries(metrics).map(([key, metric]) => (
          <div 
            key={key}
            className={`metric-card ${selectedMetric === key ? 'active' : ''}`}
            onClick={() => setSelectedMetric(key)}
          >
            <h4>{metric.name}</h4>
            <p className="metric-value">{metric.value}</p>
            <span className={`metric-change ${metric.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {metric.change}
            </span>
          </div>
        ))}
      </div>

      <div className="analytics-chart">
        <svg viewBox="0 0 800 400" className="analytics-graph">
          <path d="M 0 300 L 100 250 L 200 280 L 300 200 L 400 180 L 500 150 L 600 120 L 700 100 L 800 80" 
                fill="none" 
                stroke="url(#analytics-gradient)" 
                strokeWidth="3"/>
          <defs>
            <linearGradient id="analytics-gradient">
              <stop offset="0%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="#3b82f6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="analytics-details">
        <h4>Детальная статистика</h4>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Показатель</th>
              <th>Текущий период</th>
              <th>Предыдущий</th>
              <th>Изменение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Новые клиенты</td>
              <td>324</td>
              <td>278</td>
              <td className="positive">+16.5%</td>
            </tr>
            <tr>
              <td>Средний чек</td>
              <td>₽3,450</td>
              <td>₽3,200</td>
              <td className="positive">+7.8%</td>
            </tr>
            <tr>
              <td>Отток клиентов</td>
              <td>2.3%</td>
              <td>3.1%</td>
              <td className="positive">-25.8%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Компонент задач
const TasksWindow = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Проверить отчеты за квартал', completed: false, priority: 'high', dueDate: '2025-01-20' },
    { id: 2, title: 'Созвон с клиентом', completed: false, priority: 'medium', dueDate: '2025-01-18' },
    { id: 3, title: 'Обновить презентацию', completed: true, priority: 'low', dueDate: '2025-01-17' },
    { id: 4, title: 'Подготовить документы', completed: false, priority: 'high', dueDate: '2025-01-19' }
  ]);

  const [filter, setFilter] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', dueDate: '' });

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    ));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.title) {
      setTasks([...tasks, {
        id: Date.now(),
        ...newTask,
        completed: false
      }]);
      setNewTask({ title: '', priority: 'medium', dueDate: '' });
      setShowAddTask(false);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div className="tasks-content">
      <div className="tasks-header">
        <h3>Мои задачи</h3>
        <button 
          className="add-task-btn"
          onClick={() => setShowAddTask(!showAddTask)}
        >
          + Добавить задачу
        </button>
      </div>

      <div className="tasks-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все ({tasks.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Активные ({tasks.filter(t => !t.completed).length})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Выполненные ({tasks.filter(t => t.completed).length})
        </button>
      </div>

      {showAddTask && (
        <form className="add-task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Название задачи"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            autoFocus
          />
          <select 
            value={newTask.priority}
            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
          >
            <option value="low">Низкий приоритет</option>
            <option value="medium">Средний приоритет</option>
            <option value="high">Высокий приоритет</option>
          </select>
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
          />
          <div className="form-actions">
            <button type="submit">Добавить</button>
            <button type="button" onClick={() => setShowAddTask(false)}>Отмена</button>
          </div>
        </form>
      )}

      <div className="tasks-list">
        {filteredTasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <div className="task-info">
              <span className="task-title">{task.title}</span>
              <div className="task-meta">
                <span className={`priority ${task.priority}`}>
                  {task.priority === 'high' ? '🔴 Высокий' :
                   task.priority === 'medium' ? '🟡 Средний' : '🟢 Низкий'}
                </span>
                {task.dueDate && (
                  <span className="due-date">📅 {task.dueDate}</span>
                )}
              </div>
            </div>
            <button 
              className="delete-task"
              onClick={() => deleteTask(task.id)}
              aria-label="Удалить задачу"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент документов
const DocumentsWindow = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Отчет Q4 2024.pdf', size: '2.4 MB', date: '2025-01-15', type: 'pdf' },
    { id: 2, name: 'Презентация продукта.pptx', size: '15.7 MB', date: '2025-01-14', type: 'pptx' },
    { id: 3, name: 'Договор №2345.docx', size: '245 KB', date: '2025-01-12', type: 'docx' },
    { id: 4, name: 'Финансовая модель.xlsx', size: '1.8 MB', date: '2025-01-10', type: 'xlsx' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const handleUpload = () => {
    // Симуляция загрузки файла
    const newDoc = {
      id: Date.now(),
      name: 'Новый документ.pdf',
      size: '1.2 MB',
      date: new Date().toISOString().split('T')[0],
      type: 'pdf'
    };
    setDocuments([newDoc, ...documents]);
  };

  const handleDownload = (doc) => {
    console.log('Скачивание:', doc.name);
    // Здесь будет логика скачивания
  };

  const handleDelete = (id) => {
    if (confirm('Удалить документ?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const filteredDocs = documents
    .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'xlsx': return '📊';
      case 'pptx': return '📑';
      default: return '📎';
    }
  };

  return (
    <div className="documents-content">
      <div className="documents-header">
        <h3>Документы</h3>
        <button className="upload-btn" onClick={handleUpload}>
          ⬆ Загрузить
        </button>
      </div>

      <div className="documents-controls">
        <input
          type="search"
          placeholder="Поиск документов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="doc-search"
        />
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="date">По дате</option>
          <option value="name">По названию</option>
        </select>
      </div>

      <div className="documents-list">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="document-item">
            <div className="doc-icon">{getFileIcon(doc.type)}</div>
            <div className="doc-info">
              <div className="doc-name">{doc.name}</div>
              <div className="doc-meta">{doc.size} • {doc.date}</div>
            </div>
            <div className="doc-actions">
              <button 
                className="doc-action"
                onClick={() => handleDownload(doc)}
                title="Скачать"
              >
                ⬇
              </button>
              <button 
                className="doc-action"
                onClick={() => handleDelete(doc.id)}
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент интеграций
const IntegrationsWindow = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'google', name: 'Google Analytics', status: 'connected', icon: '📊', lastSync: '2 часа назад' },
    { id: 'yandex', name: 'Яндекс.Метрика', status: 'connected', icon: '📈', lastSync: '1 час назад' },
    { id: 'telegram', name: 'Telegram Bot', status: 'disconnected', icon: '💬', lastSync: 'Не подключено' },
    { id: 'crm', name: 'amoCRM', status: 'connected', icon: '🤝', lastSync: '30 мин назад' },
    { id: 'payment', name: 'Stripe', status: 'disconnected', icon: '💳', lastSync: 'Не подключено' }
  ]);

  const toggleIntegration = (id) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            lastSync: integration.status === 'disconnected' ? 'Только что' : 'Не подключено'
          }
        : integration
    ));
  };

  const syncIntegration = (id) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, lastSync: 'Синхронизация...' }
        : integration
    ));

    // Симуляция синхронизации
    setTimeout(() => {
      setIntegrations(integrations.map(integration => 
        integration.id === id 
          ? { ...integration, lastSync: 'Только что' }
          : integration
      ));
    }, 2000);
  };

  return (
    <div className="integrations-content">
      <h3>Интеграции и подключения</h3>
      <p className="integrations-desc">
        Подключите внешние сервисы для расширения возможностей платформы
      </p>
      
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
            <div className="integration-sync">
              Последняя синхронизация: {integration.lastSync}
            </div>
            <div className="integration-actions">
              <button 
                className="integration-action primary"
                onClick={() => toggleIntegration(integration.id)}
              >
                {integration.status === 'connected' ? 'Отключить' : 'Подключить'}
              </button>
              {integration.status === 'connected' && (
                <button 
                  className="integration-action secondary"
                  onClick={() => syncIntegration(integration.id)}
                >
                  🔄 Синхронизировать
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент отчетов
const ReportWindow = () => {
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Симуляция генерации отчета
    setTimeout(() => {
      setIsGenerating(false);
      alert('Отчет успешно сформирован! Файл будет загружен автоматически.');
    }, 3000);
  };

  return (
    <div className="report-content">
      <h3>Создание отчета</h3>
      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Тип отчета</label>
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="financial">Финансовый отчет</option>
            <option value="clients">Отчет по клиентам</option>
            <option value="analytics">Аналитический отчет</option>
            <option value="sales">Отчет по продажам</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Период</label>
          <div className="date-range">
            <input 
              type="date" 
              value={dateRange.from}
              onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              required
            />
            <span>—</span>
            <input 
              type="date" 
              value={dateRange.to}
              onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Дополнительные параметры</label>
          <div className="report-options">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              Включить графики
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              Сравнение с прошлым периодом
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              Детализированная выгрузка
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isGenerating}
        >
          {isGenerating ? '⏳ Формирование...' : '📊 Сформировать отчет'}
        </button>
      </form>

      <div className="recent-reports">
        <h4>Последние отчеты</h4>
        <div className="reports-list">
          <div className="report-item">
            <span>📊 Финансовый отчет за декабрь</span>
            <button className="download-btn">⬇</button>
          </div>
          <div className="report-item">
            <span>👥 Отчет по клиентам Q4</span>
            <button className="download-btn">⬇</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент заявок
const RequestWindow = () => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'support'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Отправка заявки:', formData);
    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    // Очистка формы
    setFormData({
      subject: '',
      description: '',
      priority: 'medium',
      category: 'support'
    });
  };

  return (
    <div className="request-content">
      <h3>Новая заявка</h3>
      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Категория</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="support">Техническая поддержка</option>
            <option value="feature">Новая функция</option>
            <option value="bug">Сообщить об ошибке</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <div className="form-group">
          <label>Тема заявки</label>
          <input 
            type="text" 
            placeholder="Краткое описание проблемы"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea 
            rows="5" 
            placeholder="Подробно опишите вашу проблему или предложение..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Приоритет</label>
          <select 
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="low">🟢 Низкий</option>
            <option value="medium">🟡 Средний</option>
            <option value="high">🔴 Высокий</option>
            <option value="critical">🚨 Критический</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          📤 Отправить заявку
        </button>
      </form>

      <div className="request-info">
        <h4>Информация</h4>
        <p>🕐 Среднее время ответа: 2-4 часа</p>
        <p>📞 Горячая линия: +7 (495) 123-45-67</p>
        <p>📧 Email: support@neuroexpert.ai</p>
      </div>
    </div>
  );
};

// Компонент чата остается прежним
const ChatWindow = () => {
  return <SmartCustomerChat />;
};

// ========== ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ==========

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

// Компонент профиля и достижений
const ProfileProgress = ({ userRole }) => {
  const [level] = useState(12);
  const [experience] = useState(3450);
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

// ========== ГЛАВНЫЙ КОМПОНЕНТ ==========

export default function WorkspaceLayoutFixed() {
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userRole] = useState('admin');
  const [userPreferences, setUserPreferences] = useState({
    theme: 'dark',
    layout: 'default',
    widgets: ['revenue', 'customers', 'conversion', 'tasks']
  });
  const [isMobile, setIsMobile] = useState(false);

  // Проверка мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загрузка сохраненной сессии
  useEffect(() => {
    const savedSession = localStorage.getItem('workspace-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setWindows(session.windows || []);
        setUserPreferences(session.preferences || userPreferences);
      } catch (e) {
        console.error('Ошибка загрузки сессии:', e);
      }
    }

    // Запрос разрешения на уведомления
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
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
    // Здесь можно добавить логику поиска по системе
  };

  // Обработка входа
  const handleLogin = (e) => {
    e.preventDefault();
    if (userEmail) {
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

  // Мобильная версия
  if (isMobile && userEmail) {
    return <MobileWorkspace userEmail={userEmail} onLogout={() => setUserEmail('')} />;
  }

  // Основной интерфейс (десктоп)
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
                    <kbd>Ctrl</kbd> + <kbd>W</kbd> - Закрыть окно
                  </div>
                  <div className="hint">
                    <kbd>Esc</kbd> - Закрыть активное окно
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