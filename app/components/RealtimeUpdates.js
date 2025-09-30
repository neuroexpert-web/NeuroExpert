'use client';

import { useEffect, useState } from 'react';

export default function RealtimeUpdates() {
  const [kpiData, setKpiData] = useState({
    revenue: 7128.4,
    clients: 162,
    satisfaction: 4.85,
    conversion: 3.13
  });

  useEffect(() => {
    // Симуляция обновления данных в реальном времени
    const updateInterval = setInterval(() => {
      setKpiData(prev => ({
        revenue: prev.revenue + (Math.random() - 0.5) * 10,
        clients: prev.clients + Math.floor(Math.random() * 3),
        satisfaction: Math.max(0, Math.min(5, prev.satisfaction + (Math.random() - 0.5) * 0.1)),
        conversion: Math.max(0, prev.conversion + (Math.random() - 0.5) * 0.05)
      }));
      
      // Анимация изменения значений
      animateValue('kpi-revenue', kpiData.revenue);
      animateValue('kpi-clients', kpiData.clients);
      animateValue('kpi-satisfaction', kpiData.satisfaction);
      animateValue('kpi-conversion', kpiData.conversion);
    }, 5000); // Обновление каждые 5 секунд
    
    // WebSocket подключение (заглушка)
    // В реальном приложении здесь будет подключение к WebSocket серверу
    // const ws = new WebSocket('wss://api.neuroexpert.com/analytics');
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   setKpiData(data);
    // };
    
    return () => {
      clearInterval(updateInterval);
      // ws.close();
    };
  }, []);
  
  // Анимация изменения числовых значений
  const animateValue = (elementId, newValue) => {
    const element = document.querySelector(`#${elementId} .kpi-value`);
    if (!element) return;
    
    element.style.transform = 'scale(1.1)';
    element.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 300);
  };
  
  // Обработчики для кнопок действий
  useEffect(() => {
    const handleActionClick = (e) => {
      if (e.target.classList.contains('rec-action-button')) {
        const button = e.target;
        const actionText = button.textContent;
        
        // Анимация клика
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
        
        // Здесь будет логика обработки действий
        console.log('Action clicked:', actionText);
        
        // Показываем уведомление (можно заменить на модальное окно)
        showNotification(`Действие "${actionText}" инициировано`);
      }
    };
    
    document.addEventListener('click', handleActionClick);
    return () => document.removeEventListener('click', handleActionClick);
  }, []);
  
  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'action-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(16, 185, 129, 0.9);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };
  
  return null;
}