'use client';

import { useEffect, useRef, useState } from 'react';

export default function RealtimeEngine() {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const updateIntervals = useRef({});
  const eventSource = useRef(null);

  useEffect(() => {
    // Initialize real-time engine
    initializeRealtimeConnection();
    
    // Start real-time updates
    startRealtimeUpdates();
    
    // Initialize push notifications
    initializePushNotifications();
    
    // Clean up on unmount
    return () => {
      stopRealtimeUpdates();
      if (eventSource.current) {
        eventSource.current.close();
      }
    };
  }, []);

  // Initialize real-time connection (simulated)
  const initializeRealtimeConnection = () => {
    // In production, this would be WebSocket or SSE connection
    console.log('Initializing real-time connection...');
    
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      updateConnectionStatus(true);
      showNotification('Подключение установлено', 'success');
    }, 1000);
  };

  // Update connection status in UI
  const updateConnectionStatus = (connected) => {
    const statusElement = document.querySelector('.connection-status');
    if (statusElement) {
      statusElement.classList.toggle('connected', connected);
      statusElement.title = connected ? 'Подключено' : 'Отключено';
    }
  };

  // Start all real-time updates
  const startRealtimeUpdates = () => {
    // KPI updates every 5 seconds
    updateIntervals.current.kpi = setInterval(() => {
      updateKPIData();
    }, 5000);
    
    // Chart updates every 10 seconds
    updateIntervals.current.charts = setInterval(() => {
      updateChartData();
    }, 10000);
    
    // Activity feed updates every 15 seconds
    updateIntervals.current.activity = setInterval(() => {
      addNewActivity();
    }, 15000);
    
    // AI recommendations every 30 seconds
    updateIntervals.current.ai = setInterval(() => {
      updateAIRecommendations();
    }, 30000);
    
    // System metrics every 3 seconds
    updateIntervals.current.system = setInterval(() => {
      updateSystemMetrics();
    }, 3000);
  };

  // Stop all updates
  const stopRealtimeUpdates = () => {
    Object.values(updateIntervals.current).forEach(interval => {
      clearInterval(interval);
    });
  };

  // Update KPI data with animations
  const updateKPIData = () => {
    const kpiData = [
      { id: 'revenue', change: (Math.random() - 0.5) * 0.05 },
      { id: 'customers', change: Math.floor(Math.random() * 10 - 2) },
      { id: 'conversion', change: (Math.random() - 0.5) * 0.5 },
      { id: 'tasks', change: Math.floor(Math.random() * 5 - 2) }
    ];
    
    kpiData.forEach(kpi => {
      const widget = document.querySelector(`[data-kpi="${kpi.id}"]`);
      if (!widget) return;
      
      const valueElement = widget.querySelector('.metric-value');
      const trendElement = widget.querySelector('.metric-trend');
      
      if (valueElement) {
        // Animate value change
        const currentValue = parseFloat(valueElement.textContent.replace(/[^\d.-]/g, ''));
        let newValue;
        
        switch (kpi.id) {
          case 'revenue':
            newValue = currentValue * (1 + kpi.change);
            animateValue(valueElement, currentValue, newValue, 1000, '₽', 'M');
            break;
          case 'customers':
            newValue = Math.max(0, currentValue + kpi.change);
            animateValue(valueElement, currentValue, newValue, 1000);
            break;
          case 'conversion':
            newValue = Math.max(0, Math.min(100, currentValue + kpi.change));
            animateValue(valueElement, currentValue, newValue, 1000, '', '%');
            break;
          case 'tasks':
            newValue = Math.max(0, currentValue + kpi.change);
            animateValue(valueElement, currentValue, newValue, 1000);
            break;
        }
        
        // Update trend
        if (trendElement && kpi.id !== 'tasks') {
          const isPositive = kpi.change > 0;
          trendElement.className = `metric-trend ${isPositive ? 'trend-positive' : 'trend-negative'}`;
          trendElement.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="${isPositive ? 'M6 2l4 6H2z' : 'M6 10l4-6H2z'}" fill="currentColor"/>
            </svg>
            ${Math.abs(kpi.id === 'revenue' ? kpi.change * 100 : kpi.change).toFixed(1)}${kpi.id === 'conversion' ? '' : '%'}
          `;
        }
      }
    });
  };

  // Animate numeric values
  const animateValue = (element, start, end, duration, prefix = '', suffix = '') => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = start + (end - start) * easeOutQuad(progress);
      
      if (prefix === '₽') {
        element.textContent = `${prefix}${(value / 1000).toFixed(1)}${suffix}`;
      } else {
        element.textContent = `${prefix}${value.toFixed(suffix === '%' ? 1 : 0)}${suffix}`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  // Easing function
  const easeOutQuad = (t) => t * (2 - t);

  // Update chart data
  const updateChartData = () => {
    // Update main revenue chart
    if (window.revenueChart) {
      const newDataPoint = window.revenueChart.data.datasets[0].data[29] * (1 + (Math.random() - 0.5) * 0.1);
      window.revenueChart.data.datasets[0].data.shift();
      window.revenueChart.data.datasets[0].data.push(newDataPoint);
      window.revenueChart.data.labels.shift();
      window.revenueChart.data.labels.push(new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }));
      window.revenueChart.update('none');
    }
    
    // Update sparklines
    document.querySelectorAll('.metric-sparkline').forEach((canvas, index) => {
      if (canvas.chart) {
        const data = canvas.chart.data.datasets[0].data;
        data.shift();
        data.push(50 + (Math.random() - 0.5) * 30);
        canvas.chart.update('none');
      }
    });
  };

  // Add new activity
  const addNewActivity = () => {
    const activities = [
      { icon: '📊', title: 'Отчет сформирован', description: 'Еженедельная аналитика готова' },
      { icon: '🎯', title: 'Цель достигнута', description: 'План продаж выполнен на 105%' },
      { icon: '👥', title: 'Новая регистрация', description: 'Компания "Инновация" создала аккаунт' },
      { icon: '💬', title: 'Новое сообщение', description: 'Запрос от клиента в поддержке' },
      { icon: '🚀', title: 'Обновление системы', description: 'Развернута версия 2.4.1' },
      { icon: '⚡', title: 'Быстрый рост', description: 'Трафик увеличился на 25%' }
    ];
    
    const activityFeed = document.querySelector('.activity-widget .widget-content');
    if (!activityFeed) return;
    
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.opacity = '0';
    activityItem.style.transform = 'translateX(-20px)';
    
    activityItem.innerHTML = `
      <div class="activity-icon">${activity.icon}</div>
      <div class="activity-content">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-description">${activity.description}</div>
      </div>
      <div class="activity-time">только что</div>
    `;
    
    activityFeed.insertBefore(activityItem, activityFeed.firstChild);
    
    // Animate in
    requestAnimationFrame(() => {
      activityItem.style.transition = 'all 0.3s ease';
      activityItem.style.opacity = '1';
      activityItem.style.transform = 'translateX(0)';
    });
    
    // Update times of existing items
    activityFeed.querySelectorAll('.activity-item').forEach((item, index) => {
      if (index > 0) {
        const timeElement = item.querySelector('.activity-time');
        if (timeElement) {
          const minutes = index * 15;
          timeElement.textContent = minutes < 60 ? `${minutes} мин назад` : `${Math.floor(minutes / 60)} ч назад`;
        }
      }
    });
    
    // Remove old items
    const items = activityFeed.querySelectorAll('.activity-item');
    if (items.length > 10) {
      items[items.length - 1].remove();
    }
    
    // Show notification for important activities
    if (Math.random() > 0.7) {
      showNotification(activity.title, 'info', activity.description);
    }
  };

  // Update AI recommendations
  const updateAIRecommendations = () => {
    const recommendations = [
      {
        priority: 'high',
        title: 'Критическое снижение конверсии',
        text: 'Конверсия упала на 15% за последние 3 часа. Рекомендуется проверить работу платежной системы.',
        action: 'Проверить систему'
      },
      {
        priority: 'medium',
        title: 'Оптимизация рекламной кампании',
        text: 'Кампания "Лето 2024" показывает CTR ниже среднего. Предлагаю изменить таргетинг.',
        action: 'Настроить кампанию'
      },
      {
        priority: 'low',
        title: 'Автоматизация отчетности',
        text: 'Вы тратите 2 часа в неделю на создание отчетов. Можно автоматизировать этот процесс.',
        action: 'Настроить автоматизацию'
      }
    ];
    
    const aiWidget = document.querySelector('.ai-widget .widget-content');
    if (!aiWidget) return;
    
    // Clear old recommendations
    aiWidget.innerHTML = '';
    
    // Add new recommendations
    recommendations.forEach((rec, index) => {
      const recElement = document.createElement('div');
      recElement.className = 'ai-recommendation';
      recElement.style.opacity = '0';
      recElement.style.transform = 'translateY(20px)';
      
      recElement.innerHTML = `
        <div class="ai-rec-header">
          <span class="ai-priority priority-${rec.priority}">
            ${rec.priority === 'high' ? 'Высокий' : rec.priority === 'medium' ? 'Средний' : 'Низкий'}
          </span>
          <h4>${rec.title}</h4>
        </div>
        <p class="ai-rec-content">${rec.text}</p>
        <a href="#" class="ai-rec-action">
          ${rec.action}
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" fill="none"/>
          </svg>
        </a>
      `;
      
      aiWidget.appendChild(recElement);
      
      // Animate in
      setTimeout(() => {
        recElement.style.transition = 'all 0.3s ease';
        recElement.style.opacity = '1';
        recElement.style.transform = 'translateY(0)';
      }, index * 100);
    });
  };

  // Update system metrics in status bar
  const updateSystemMetrics = () => {
    // CPU usage
    const cpuProgress = document.querySelector('.cpu-progress .progress-fill-mini');
    if (cpuProgress) {
      const usage = 20 + Math.random() * 40; // 20-60%
      cpuProgress.style.width = `${usage}%`;
    }
    
    // Memory usage
    const memProgress = document.querySelector('.memory-progress .progress-fill-mini');
    if (memProgress) {
      const usage = 40 + Math.random() * 30; // 40-70%
      memProgress.style.width = `${usage}%`;
    }
    
    // Update time
    const timeElement = document.querySelector('.current-time');
    if (timeElement) {
      const now = new Date();
      timeElement.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Show notification
  const showNotification = (title, type = 'info', description = '') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-icon">
        ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        ${description ? `<div class="notification-description">${description}</div>` : ''}
      </div>
      <button class="notification-close">×</button>
    `;
    
    // Add to notifications container
    let container = document.querySelector('.notifications-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notifications-container';
      document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 50);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
    
    // Update notification count
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      const count = parseInt(badge.textContent) || 0;
      badge.textContent = count + 1;
      badge.style.display = 'flex';
    }
  };

  // Initialize push notifications
  const initializePushNotifications = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      // Request permission on first interaction
      document.addEventListener('click', () => {
        Notification.requestPermission();
      }, { once: true });
    }
  };

  // Add notification styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .notifications-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .notification {
        background: var(--ws-surface-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--ws-border-color);
        border-radius: 8px;
        padding: 16px;
        min-width: 320px;
        max-width: 420px;
        display: flex;
        gap: 12px;
        box-shadow: var(--ws-shadow-lg);
        transform: translateX(400px);
        transition: transform 0.3s ease;
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification-success {
        border-color: var(--ws-metric-positive);
      }
      
      .notification-error {
        border-color: var(--ws-metric-negative);
      }
      
      .notification-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
      
      .notification-success .notification-icon {
        background: rgba(16, 185, 129, 0.2);
        color: var(--ws-metric-positive);
      }
      
      .notification-error .notification-icon {
        background: rgba(239, 68, 68, 0.2);
        color: var(--ws-metric-negative);
      }
      
      .notification-info .notification-icon {
        background: rgba(59, 130, 246, 0.2);
        color: var(--ws-metric-info);
      }
      
      .notification-content {
        flex: 1;
      }
      
      .notification-title {
        font-weight: 600;
        color: var(--color-text-light);
        margin-bottom: 4px;
      }
      
      .notification-description {
        font-size: 14px;
        color: var(--color-text-secondary);
      }
      
      .notification-close {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
      }
      
      .notification-close:hover {
        background: var(--ws-bg-tertiary);
        color: var(--color-text-light);
      }
      
      .connection-status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--ws-metric-negative);
        transition: all 0.3s ease;
      }
      
      .connection-status.connected {
        background: var(--ws-metric-positive);
        box-shadow: 0 0 8px var(--ws-metric-positive);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component manages behavior, not UI
}