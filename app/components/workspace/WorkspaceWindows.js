'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

export default function WorkspaceWindows() {
  const { windows, activeWindow, setActiveWindow, closeWindow, updateWindow } = useWorkspace();
  const [draggingWindow, setDraggingWindow] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingWindow, setResizingWindow] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleWindowMouseDown = (e, windowId) => {
    const window = windows.find(w => w.id === windowId);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    });
    setDraggingWindow(windowId);
    setActiveWindow(windowId);
  };

  const handleResizeMouseDown = (e, windowId) => {
    e.stopPropagation();
    const window = windows.find(w => w.id === windowId);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
    setResizingWindow(windowId);
  };

  const handleMouseMove = (e) => {
    if (draggingWindow) {
      updateWindow(draggingWindow, {
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }
      });
    } else if (resizingWindow) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      updateWindow(resizingWindow, {
        size: {
          width: Math.max(300, resizeStart.width + deltaX),
          height: Math.max(200, resizeStart.height + deltaY)
        }
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingWindow(null);
    setResizingWindow(null);
  };

  useEffect(() => {
    if (draggingWindow || resizingWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingWindow, resizingWindow, dragOffset, resizeStart]);

  const renderWindowContent = (window) => {
    switch (window.type) {
      case 'analytics':
        return (
          <div className="window-content analytics">
            <h2>Аналитика в реальном времени</h2>
            <div className="analytics-grid">
              <div className="metric-card">
                <h3>Конверсия</h3>
                <div className="metric-value">3.8%</div>
                <div className="metric-chart">📈</div>
              </div>
              <div className="metric-card">
                <h3>Средний чек</h3>
                <div className="metric-value">15,420₽</div>
                <div className="metric-chart">📊</div>
              </div>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="window-content tasks">
            <h2>Управление задачами</h2>
            <div className="task-list">
              <div className="task-item">
                <input type="checkbox" id="task1" />
                <label htmlFor="task1">Проверить отчеты за квартал</label>
                <span className="task-priority high">Высокий</span>
              </div>
              <div className="task-item">
                <input type="checkbox" id="task2" />
                <label htmlFor="task2">Обновить документацию API</label>
                <span className="task-priority medium">Средний</span>
              </div>
            </div>
            {window.data?.mode === 'create' && (
              <form className="task-form">
                <input type="text" placeholder="Название задачи" />
                <textarea placeholder="Описание"></textarea>
                <button type="submit">Создать задачу</button>
              </form>
            )}
          </div>
        );
      
      case 'documents':
        return (
          <div className="window-content documents">
            <h2>Документы</h2>
            <div className="document-list">
              <div className="document-item">
                <span className="doc-icon">📄</span>
                <div className="doc-info">
                  <h4>Отчет Q4 2024.pdf</h4>
                  <p>Обновлен: 2 дня назад</p>
                </div>
                <button className="doc-action">Скачать</button>
              </div>
              <div className="document-item">
                <span className="doc-icon">📊</span>
                <div className="doc-info">
                  <h4>Аналитика продаж.xlsx</h4>
                  <p>Обновлен: 1 неделю назад</p>
                </div>
                <button className="doc-action">Открыть</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="window-content default">
            <h2>{window.title}</h2>
            <p>Содержимое окна {window.type}</p>
          </div>
        );
    }
  };

  return (
    <>
      {windows.map(window => (
        <div
          key={window.id}
          className={`workspace-window ${window.minimized ? 'minimized' : ''} ${window.maximized ? 'maximized' : ''} ${activeWindow === window.id ? 'active' : ''}`}
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height,
            zIndex: activeWindow === window.id ? 1000 : window.zIndex
          }}
          onMouseDown={() => setActiveWindow(window.id)}
        >
          <div 
            className="window-header"
            onMouseDown={(e) => handleWindowMouseDown(e, window.id)}
          >
            <h3 className="window-title">{window.title}</h3>
            <div className="window-controls">
              <button 
                className="window-control minimize"
                onClick={() => updateWindow(window.id, { minimized: !window.minimized })}
                aria-label="Свернуть"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 12h8" strokeWidth="2"/>
                </svg>
              </button>
              <button 
                className="window-control maximize"
                onClick={() => updateWindow(window.id, { maximized: !window.maximized })}
                aria-label={window.maximized ? "Восстановить" : "Развернуть"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                </svg>
              </button>
              <button 
                className="window-control close"
                onClick={() => closeWindow(window.id)}
                aria-label="Закрыть"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="window-body">
            {renderWindowContent(window)}
          </div>
          {!window.maximized && (
            <div 
              className="resize-handle"
              onMouseDown={(e) => handleResizeMouseDown(e, window.id)}
            ></div>
          )}
        </div>
      ))}
    </>
  );
}