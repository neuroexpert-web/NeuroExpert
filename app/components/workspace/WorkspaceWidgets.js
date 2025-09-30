'use client';

import { useEffect, useState } from 'react';
import { useWorkspace } from './WorkspaceContext';

export default function WorkspaceWidgets() {
  const { widgets, updateWidget } = useWorkspace();
  const [isDragging, setIsDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - widget.position.x,
      y: e.clientY - widget.position.y
    });
    setIsDragging(widgetId);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateWidget(isDragging, {
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const renderWidgetContent = (widget) => {
    switch (widget.type) {
      case 'kpi':
        return (
          <div className="kpi-widget">
            <div className="kpi-value">{widget.value}</div>
            <div className={`kpi-change ${widget.change?.startsWith('-') ? 'negative' : ''}`}>
              {widget.change}
            </div>
            {widget.lastUpdate && (
              <div className="kpi-update-time">
                Обновлено: {new Date(widget.lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </div>
        );
      
      case 'chart':
        return (
          <div className="chart-widget">
            <canvas width="100%" height="100%"></canvas>
            <div className="chart-placeholder">
              <svg width="100" height="60" viewBox="0 0 100 60" fill="none" stroke="#8a2be2">
                <path d="M0 50 L20 40 L40 45 L60 30 L80 35 L100 20" strokeWidth="2"/>
              </svg>
              <p>График обновляется в реальном времени</p>
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="activity-widget">
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-dot"></span>
                <div className="activity-content">
                  <p>Новый заказ #1234</p>
                  <time>5 минут назад</time>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-dot"></span>
                <div className="activity-content">
                  <p>Клиент оставил отзыв</p>
                  <time>15 минут назад</time>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-dot"></span>
                <div className="activity-content">
                  <p>Задача завершена</p>
                  <time>1 час назад</time>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="widgets-container">
      {widgets.map(widget => (
        <div
          key={widget.id}
          className={`workspace-widget ${isDragging === widget.id ? 'dragging' : ''}`}
          style={{
            left: widget.position.x,
            top: widget.position.y,
            width: widget.size.width,
            height: widget.size.height
          }}
        >
          <div 
            className="widget-header"
            onMouseDown={(e) => handleMouseDown(e, widget.id)}
          >
            <h3 className="widget-title">{widget.title}</h3>
            <div className="widget-controls">
              <button 
                className="widget-control"
                aria-label="Настройки виджета"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" strokeWidth="2"/>
                </svg>
              </button>
              <button 
                className="widget-control"
                aria-label="Закрыть виджет"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="widget-body">
            {renderWidgetContent(widget)}
          </div>
        </div>
      ))}
    </div>
  );
}