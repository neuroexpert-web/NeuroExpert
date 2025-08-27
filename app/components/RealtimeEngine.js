'use client';

import { useEffect, useRef } from 'react';

export default function RealtimeEngine() {
  const notificationsRef = useRef([]);
  const metricsRef = useRef({});
  const websocketRef = useRef(null);

  useEffect(() => {
    // Инициализация real-time подключения
    initializeRealtime();
    
    // Симуляция real-time обновлений
    const simulationInterval = setInterval(simulateRealtimeData, 3000);
    
    return () => {
      clearInterval(simulationInterval);
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const initializeRealtime = () => {
    // В реальном приложении здесь было бы подключение к WebSocket
    console.log('Инициализация real-time engine...');
    
    // Симуляция WebSocket подключения
    websocketRef.current = {
      send: (data) => console.log('Отправка:', data),
      close: () => console.log('WebSocket закрыт')
    };
    
    // Инициализация метрик
    updateSystemMetrics();
  };

  const simulateRealtimeData = () => {
    // Случайные события
    const eventTypes = [
      { type: 'new_order', message: 'Новый заказ #', icon: '📦' },
      { type: 'user_action', message: 'Пользователь выполнил действие:', icon: '👤' },
      { type: 'metric_update', message: 'Обновление метрики:', icon: '📊' },
      { type: 'system_alert', message: 'Системное уведомление:', icon: '⚠️' }
    ];
    
    if (Math.random() > 0.7) {
      const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      createNotification(event);
    }
    
    // Обновление метрик
    updateLiveMetrics();
    
    // Обновление статус-бара
    updateStatusBar();
  };

  const createNotification = (event) => {
    const notification = {
      id: Date.now(),
      ...event,
      message: event.message + ' ' + Math.floor(Math.random() * 9999),
      timestamp: new Date().toLocaleTimeString('ru-RU')
    };
    
    notificationsRef.current.unshift(notification);
    
    // Показать badge на кнопке уведомлений
    const notificationBtn = document.querySelector('.notification-btn');
    const badge = notificationBtn?.querySelector('.notification-badge');
    if (badge) {
      badge.style.display = 'block';
    }
    
    // Показать toast уведомление
    showToastNotification(notification);
  };

  const showToastNotification = (notification) => {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div class="toast-icon">${notification.icon}</div>
      <div class="toast-content">
        <div class="toast-title">${notification.type.replace('_', ' ').toUpperCase()}</div>
        <div class="toast-message">${notification.message}</div>
      </div>
      <button class="toast-close">×</button>
    `;
    
    // Стили для toast
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: rgba(139, 92, 246, 0.9);
      backdrop-filter: blur(10px);
      color: white;
      padding: 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
      z-index: 1000;
    `;
    
    document.body.appendChild(toast);
    
    // Анимация появления
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Закрытие
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => removeToast(toast), 5000);
  };

  const removeToast = (toast) => {
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 300);
  };

  const updateLiveMetrics = () => {
    // Обновление случайных метрик
    const metrics = {
      activeUsers: Math.floor(234 + Math.random() * 50),
      serverLoad: Math.floor(45 + Math.random() * 30),
      responseTime: Math.floor(120 + Math.random() * 80),
      errorRate: (0.5 + Math.random() * 2).toFixed(2)
    };
    
    metricsRef.current = metrics;
    
    // Обновление виджетов с live данными
    const liveElements = document.querySelectorAll('[data-live-metric]');
    liveElements.forEach(element => {
      const metric = element.getAttribute('data-live-metric');
      if (metrics[metric]) {
        animateValue(element, parseFloat(element.textContent), metrics[metric]);
      }
    });
  };

  const updateSystemMetrics = () => {
    // CPU и память (симуляция)
    const cpuUsage = Math.floor(20 + Math.random() * 40);
    const memoryUsage = Math.floor(3.2 + Math.random() * 2);
    
    const cpuElement = document.querySelector('[data-metric="cpu"]');
    const memoryElement = document.querySelector('[data-metric="memory"]');
    
    if (cpuElement) cpuElement.textContent = `CPU: ${cpuUsage}%`;
    if (memoryElement) memoryElement.textContent = `RAM: ${memoryUsage}GB`;
  };

  const updateStatusBar = () => {
    // Обновление времени
    const timeElement = document.querySelector('.current-time');
    if (timeElement) {
      timeElement.textContent = new Date().toLocaleTimeString('ru-RU');
    }
    
    // Обновление счетчика активных окон
    const activeWindows = document.querySelectorAll('.floating-window.active').length;
    const windowsCount = document.querySelector('.windows-count');
    if (windowsCount) {
      windowsCount.textContent = `Окна: ${activeWindows}`;
    }
    
    // Обновление прогресса
    const progressBars = document.querySelectorAll('.system-progress');
    progressBars.forEach(bar => {
      const currentWidth = parseInt(bar.style.width) || 0;
      const targetWidth = Math.floor(Math.random() * 100);
      animateProgressBar(bar, currentWidth, targetWidth);
    });
  };

  const animateValue = (element, start, end) => {
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const value = start + (end - start) * easeOutQuad(progress);
      element.textContent = typeof end === 'string' ? value.toFixed(2) : Math.round(value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const animateProgressBar = (bar, start, end) => {
    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const width = start + (end - start) * easeOutQuad(progress);
      bar.style.width = width + '%';
      
      // Изменение цвета в зависимости от значения
      if (width > 80) {
        bar.style.background = 'var(--workspace-danger)';
      } else if (width > 60) {
        bar.style.background = 'var(--workspace-warning)';
      } else {
        bar.style.background = 'var(--workspace-success)';
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const easeOutQuad = (t) => t * (2 - t);

  // Публичный API для других компонентов
  useEffect(() => {
    window.realtimeEngine = {
      getNotifications: () => notificationsRef.current,
      getMetrics: () => metricsRef.current,
      sendMessage: (message) => websocketRef.current?.send(message)
    };
  }, []);

  return null;
}