'use client';

import { useEffect, useState, useCallback } from 'react';

export default function WorkspaceManager() {
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [userPreferences, setUserPreferences] = useState({
    theme: 'dark',
    layout: 'default',
    widgets: ['kpi', 'chart', 'activity', 'quickActions', 'ai']
  });

  // Initialize workspace
  useEffect(() => {
    // Load user preferences from localStorage
    const savedPrefs = localStorage.getItem('workspace-preferences');
    if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs));
    }

    // Initialize navigation
    initializeNavigation();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize user menu
    initializeUserMenu();
    
    // Start real-time updates simulation
    startRealtimeUpdates();
  }, []);

  // Navigation handler
  const initializeNavigation = () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const viewName = item.dataset.view;
        if (viewName) {
          setActiveView(viewName);
          updateWorkspaceContent(viewName);
        }
      });
    });
  };

  // Search functionality
  const initializeSearch = () => {
    const searchInput = document.querySelector('.global-search input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        setSearchQuery(e.target.value);
        performSearch(e.target.value);
      });
    }
  };

  // Search implementation
  const performSearch = useCallback((query) => {
    if (query.length < 2) return;
    
    // Simulate search results
    console.log('Searching for:', query);
    
    // Add search suggestions
    const suggestions = [
      'Analytics Dashboard',
      'Customer Segments',
      'Revenue Reports',
      'Task Management',
      'AI Recommendations'
    ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
    
    // Update UI with suggestions (implement dropdown)
  }, []);

  // User menu handler
  const initializeUserMenu = () => {
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
      userProfile.addEventListener('click', () => {
        toggleUserMenu();
      });
    }
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    // Implement user menu dropdown
    console.log('Toggle user menu');
  };

  // Real-time updates simulation
  const startRealtimeUpdates = () => {
    // Update notification count
    setInterval(() => {
      setNotifications(prev => Math.max(0, prev + Math.floor(Math.random() * 3 - 1)));
    }, 30000);

    // Update KPI values
    updateKPIValues();
    setInterval(updateKPIValues, 10000);

    // Update activity feed
    updateActivityFeed();
    setInterval(updateActivityFeed, 20000);
  };

  // Update KPI values with animation
  const updateKPIValues = () => {
    const kpiWidgets = document.querySelectorAll('.kpi-widget .metric-value');
    kpiWidgets.forEach(widget => {
      const currentValue = parseFloat(widget.textContent.replace(/[^\d.-]/g, ''));
      const change = (Math.random() - 0.5) * 0.05; // ±5% change
      const newValue = currentValue * (1 + change);
      
      // Animate value change
      animateValue(widget, currentValue, newValue, 1000);
      
      // Update trend
      const trendElement = widget.closest('.kpi-widget').querySelector('.metric-trend');
      if (trendElement) {
        updateTrend(trendElement, change);
      }
    });
  };

  // Animate numeric value
  const animateValue = (element, start, end, duration) => {
    const startTime = Date.now();
    const isRevenue = element.closest('.kpi-widget').querySelector('.widget-title')?.textContent.includes('Выручка');
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = start + (end - start) * easeOutQuad(progress);
      
      if (isRevenue) {
        element.textContent = `₽${(value / 1000).toFixed(1)}M`;
      } else {
        element.textContent = value.toFixed(1);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  // Easing function
  const easeOutQuad = (t) => t * (2 - t);

  // Update trend indicator
  const updateTrend = (element, change) => {
    const isPositive = change > 0;
    element.className = `metric-trend ${isPositive ? 'trend-positive' : 'trend-negative'}`;
    element.innerHTML = `
      <svg class="trend-icon" width="16" height="16">
        <path d="${isPositive ? 'M8 4l6 8H2z' : 'M8 12l6-8H2z'}" fill="currentColor"/>
      </svg>
      ${Math.abs(change * 100).toFixed(1)}%
    `;
  };

  // Update activity feed
  const updateActivityFeed = () => {
    const activities = [
      { icon: '📊', title: 'Новый отчет готов', description: 'Аналитика продаж за текущий месяц' },
      { icon: '👤', title: 'Новый клиент', description: 'ООО "ТехноСтарт" завершил регистрацию' },
      { icon: '✅', title: 'Задача выполнена', description: 'Интеграция с CRM успешно завершена' },
      { icon: '🤖', title: 'AI рекомендация', description: 'Обнаружена возможность оптимизации' },
      { icon: '📈', title: 'Рост показателей', description: 'Конверсия увеличилась на 12%' }
    ];
    
    const activityWidget = document.querySelector('.activity-widget .widget-content');
    if (activityWidget) {
      const newActivity = activities[Math.floor(Math.random() * activities.length)];
      const activityItem = createActivityItem(newActivity);
      
      // Add new activity with animation
      activityItem.style.opacity = '0';
      activityItem.style.transform = 'translateY(-20px)';
      activityWidget.insertBefore(activityItem, activityWidget.firstChild);
      
      // Animate in
      setTimeout(() => {
        activityItem.style.transition = 'all 0.3s ease';
        activityItem.style.opacity = '1';
        activityItem.style.transform = 'translateY(0)';
      }, 50);
      
      // Remove old activities
      const allActivities = activityWidget.querySelectorAll('.activity-item');
      if (allActivities.length > 10) {
        allActivities[allActivities.length - 1].remove();
      }
    }
  };

  // Create activity item
  const createActivityItem = ({ icon, title, description }) => {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-icon">${icon}</div>
      <div class="activity-content">
        <div class="activity-title">${title}</div>
        <div class="activity-description">${description}</div>
      </div>
      <div class="activity-time">только что</div>
    `;
    return item;
  };

  // Update workspace content based on active view
  const updateWorkspaceContent = (view) => {
    console.log('Switching to view:', view);
    // Implement view switching logic
  };

  // Theme toggle handler
  useEffect(() => {
    const themeToggle = document.querySelector('.toggle-switch');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        themeToggle.classList.toggle('active');
        const isDark = themeToggle.classList.contains('active');
        setUserPreferences(prev => ({ ...prev, theme: isDark ? 'dark' : 'light' }));
        document.body.dataset.theme = isDark ? 'dark' : 'light';
      });
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('workspace-preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Update notification badge
  useEffect(() => {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      badge.textContent = notifications;
      badge.style.display = notifications > 0 ? 'flex' : 'none';
    }
  }, [notifications]);

  // Quick actions handler
  useEffect(() => {
    const quickActions = document.querySelectorAll('.quick-action-btn');
    quickActions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        handleQuickAction(action);
      });
    });
  }, []);

  // Handle quick actions
  const handleQuickAction = (action) => {
    switch (action) {
      case 'new-report':
        console.log('Creating new report...');
        break;
      case 'add-task':
        console.log('Adding new task...');
        break;
      case 'invite-user':
        console.log('Inviting user...');
        break;
      case 'export-data':
        console.log('Exporting data...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.global-search input')?.focus();
      }
      
      // Cmd/Ctrl + N for new task
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleQuickAction('add-task');
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        // Close any open modals
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return null; // This component manages behavior, not UI
}