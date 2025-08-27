'use client';

import { useEffect, useRef } from 'react';

export default function RealtimeEngine() {
  const updateIntervals = useRef({});
  const chartInstances = useRef({});
  
  useEffect(() => {
    // Initialize real-time updates
    initializeKPIUpdates();
    initializeChartUpdates();
    initializeActivityFeed();
    initializeNotifications();
    
    // Listen for manual refresh events
    window.addEventListener('widget-refresh', handleWidgetRefresh);
    
    return () => {
      // Clear all intervals
      Object.values(updateIntervals.current).forEach(clearInterval);
      window.removeEventListener('widget-refresh', handleWidgetRefresh);
    };
  }, []);
  
  const initializeKPIUpdates = () => {
    // Update KPI values every 30 seconds
    updateIntervals.current.kpi = setInterval(() => {
      updateKPIWidgets();
    }, 30000);
    
    // Initial update
    updateKPIWidgets();
  };
  
  const updateKPIWidgets = () => {
    const kpiWidgets = document.querySelectorAll('.kpi-widget');
    
    kpiWidgets.forEach(widget => {
      const valueElement = widget.querySelector('.kpi-value');
      const changeElement = widget.querySelector('.kpi-change');
      
      if (valueElement) {
        // Simulate real-time data changes
        const currentValue = parseFloat(valueElement.textContent.replace(/[^\d.-]/g, ''));
        const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
        const newValue = currentValue * (1 + variation);
        
        // Format based on widget type
        const widgetType = widget.getAttribute('data-metric');
        let formattedValue;
        
        switch (widgetType) {
          case 'revenue':
            formattedValue = `₽${(newValue / 1000).toFixed(1)}M`;
            break;
          case 'clients':
            formattedValue = Math.round(newValue).toLocaleString();
            break;
          case 'conversion':
            formattedValue = `${newValue.toFixed(1)}%`;
            break;
          case 'tasks':
            const completed = Math.round(newValue * 0.77);
            const total = Math.round(newValue);
            formattedValue = `${completed}/${total}`;
            break;
          default:
            formattedValue = newValue.toFixed(2);
        }
        
        // Animate value change
        animateValue(valueElement, valueElement.textContent, formattedValue, 500);
        
        // Update trend
        if (changeElement && variation !== 0) {
          const trendValue = (variation * 100).toFixed(1);
          const isPositive = variation > 0;
          
          changeElement.textContent = `${isPositive ? '+' : ''}${trendValue}%`;
          changeElement.className = `kpi-change ${isPositive ? 'positive' : 'negative'}`;
          
          // Flash effect
          changeElement.style.animation = 'none';
          setTimeout(() => {
            changeElement.style.animation = 'pulse 0.5s ease-out';
          }, 10);
        }
      }
    });
  };
  
  const animateValue = (element, start, end, duration) => {
    const startNumber = parseFloat(start.replace(/[^\d.-]/g, '')) || 0;
    const endNumber = parseFloat(end.replace(/[^\d.-]/g, '')) || 0;
    const range = endNumber - startNumber;
    const startTime = Date.now();
    
    const update = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startNumber + (range * easeOutQuart);
      
      // Format the current value similar to the end format
      let formatted = end.replace(/[\d.-]+/, currentValue.toFixed(1));
      element.textContent = formatted;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = end;
      }
    };
    
    requestAnimationFrame(update);
  };
  
  const initializeChartUpdates = () => {
    // Initialize Chart.js instances
    const chartCanvases = document.querySelectorAll('.chart-container canvas');
    
    chartCanvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      const chartId = canvas.id;
      
      if (window.Chart) {
        // Create chart based on type
        if (chartId === 'salesChart') {
          chartInstances.current[chartId] = createSalesChart(ctx);
        } else if (chartId === 'revenueSparkline') {
          chartInstances.current[chartId] = createSparklineChart(ctx);
        }
      }
    });
    
    // Update charts every 10 seconds
    updateIntervals.current.charts = setInterval(() => {
      updateCharts();
    }, 10000);
  };
  
  const createSalesChart = (ctx) => {
    const data = {
      labels: generateTimeLabels(30),
      datasets: [{
        label: 'Продажи',
        data: generateRandomData(30, 100000, 200000),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
    
    return new window.Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#a0a0a0',
              callback: function(value) {
                return '₽' + (value / 1000).toFixed(0) + 'k';
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            }
          },
          x: {
            ticks: {
              color: '#a0a0a0'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  };
  
  const createSparklineChart = (ctx) => {
    return new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(20).fill(''),
        datasets: [{
          data: generateRandomData(20, 80, 120),
          borderColor: '#10b981',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    });
  };
  
  const generateTimeLabels = (days) => {
    const labels = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }));
    }
    
    return labels;
  };
  
  const generateRandomData = (count, min, max) => {
    const data = [];
    let previousValue = (min + max) / 2;
    
    for (let i = 0; i < count; i++) {
      const change = (Math.random() - 0.5) * (max - min) * 0.1;
      previousValue = Math.max(min, Math.min(max, previousValue + change));
      data.push(Math.round(previousValue));
    }
    
    return data;
  };
  
  const updateCharts = () => {
    Object.entries(chartInstances.current).forEach(([chartId, chart]) => {
      if (chart && chart.data) {
        // Add new data point and remove oldest
        chart.data.datasets.forEach(dataset => {
          const newValue = generateNewDataPoint(dataset.data);
          dataset.data.push(newValue);
          dataset.data.shift();
        });
        
        // Update labels for time-based charts
        if (chartId === 'salesChart') {
          chart.data.labels.push(new Date().toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'short' 
          }));
          chart.data.labels.shift();
        }
        
        chart.update('none'); // Update without animation for smooth real-time effect
      }
    });
  };
  
  const generateNewDataPoint = (existingData) => {
    const lastValue = existingData[existingData.length - 1];
    const change = (Math.random() - 0.5) * lastValue * 0.1;
    return Math.round(lastValue + change);
  };
  
  const initializeActivityFeed = () => {
    // Update activity feed every 45 seconds
    updateIntervals.current.activity = setInterval(() => {
      addActivityItem();
    }, 45000);
  };
  
  const addActivityItem = () => {
    const feed = document.querySelector('.activity-feed');
    if (!feed) return;
    
    const activities = [
      { user: 'АК', action: 'создал новую задачу', target: 'Анализ конверсии' },
      { user: 'МП', action: 'завершил', target: 'Отчет по продажам' },
      { user: 'ЕС', action: 'обновил данные', target: 'Dashboard KPI' },
      { user: 'ДР', action: 'добавил комментарий к', target: 'Проект Alpha' },
      { user: 'НВ', action: 'загрузил документ', target: 'Презентация Q3' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.opacity = '0';
    activityItem.innerHTML = `
      <div class="activity-avatar">${randomActivity.user}</div>
      <div class="activity-content">
        <div class="activity-title">${randomActivity.action} "${randomActivity.target}"</div>
        <div class="activity-meta">только что</div>
      </div>
    `;
    
    feed.insertBefore(activityItem, feed.firstChild);
    
    // Animate in
    setTimeout(() => {
      activityItem.style.transition = 'opacity 0.3s ease-in';
      activityItem.style.opacity = '1';
    }, 10);
    
    // Remove old items if too many
    const items = feed.querySelectorAll('.activity-item');
    if (items.length > 10) {
      const lastItem = items[items.length - 1];
      lastItem.style.opacity = '0';
      setTimeout(() => lastItem.remove(), 300);
    }
  };
  
  const initializeNotifications = () => {
    // Simulate notifications
    updateIntervals.current.notifications = setInterval(() => {
      if (Math.random() > 0.7) {
        showNotification();
      }
    }, 60000); // Check every minute
  };
  
  const showNotification = () => {
    const notifications = [
      { title: 'Новое достижение', message: 'Конверсия выросла на 15%!', type: 'success' },
      { title: 'Требует внимания', message: 'Снижение трафика на 8%', type: 'warning' },
      { title: 'Задача завершена', message: 'Отчет готов к просмотру', type: 'info' }
    ];
    
    const notification = notifications[Math.floor(Math.random() * notifications.length)];
    
    // Update notification badge
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      badge.style.display = 'block';
    }
    
    // Show toast notification
    if (window.Notification && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon.png'
      });
    }
  };
  
  const handleWidgetRefresh = (e) => {
    const { widgetId } = e.detail;
    const widget = document.querySelector(`[data-widget-id="${widgetId}"]`);
    
    if (widget) {
      if (widget.classList.contains('kpi-widget')) {
        updateKPIWidgets();
      } else if (widget.querySelector('canvas')) {
        updateCharts();
      }
    }
  };
  
  // Request notification permission
  useEffect(() => {
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  return null; // This component manages real-time updates, no UI
}