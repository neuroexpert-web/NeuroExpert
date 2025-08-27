'use client';

import { useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

export default function NotificationCenter() {
  const { notifications } = useWorkspace();
  
  // Запрос разрешения на push-уведомления
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Показ push-уведомлений
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      if ('Notification' in window && Notification.permission === 'granted' && !latestNotification.shown) {
        new Notification(latestNotification.title, {
          body: latestNotification.message,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: latestNotification.id.toString(),
          requireInteraction: false
        });
        
        // Помечаем уведомление как показанное
        latestNotification.shown = true;
      }
    }
  }, [notifications]);

  return (
    <div className="notification-toast-container" aria-live="polite" aria-atomic="true">
      {notifications.slice(0, 3).map((notification, index) => (
        <div 
          key={notification.id} 
          className={`notification-toast ${notification.type}`}
          style={{
            animation: `slideIn 0.3s ease-out`,
            animationDelay: `${index * 0.1}s`,
            opacity: 0,
            animationFillMode: 'forwards'
          }}
        >
          <div className="notification-icon">
            {notification.type === 'success' && '✅'}
            {notification.type === 'error' && '❌'}
            {notification.type === 'warning' && '⚠️'}
            {notification.type === 'info' && 'ℹ️'}
          </div>
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
          <button className="notification-close" aria-label="Закрыть">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}