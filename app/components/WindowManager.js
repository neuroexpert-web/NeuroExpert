'use client';

import { useEffect, useState } from 'react';

const WindowManager = () => {
  const [windows, setWindows] = useState({
    tasks: { open: false, x: 300, y: 80, width: 480, height: 600 },
    aiAssistant: { open: false, x: 'auto', y: 'auto', width: 400, height: 500 }
  });
  
  const [activeWindow, setActiveWindow] = useState(null);
  const [draggingWindow, setDraggingWindow] = useState(null);
  const [resizingWindow, setResizingWindow] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Открытие/закрытие окон
  const toggleWindow = (windowId) => {
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        open: !prev[windowId].open
      }
    }));
    
    if (!windows[windowId].open) {
      setActiveWindow(windowId);
    }
  };
  
  // Минимизация окна
  const minimizeWindow = (windowId) => {
    const windowEl = document.getElementById(`${windowId}-window`);
    if (windowEl) {
      windowEl.style.transform = 'scale(0.9) translateY(20px)';
      windowEl.style.opacity = '0';
      
      setTimeout(() => {
        setWindows(prev => ({
          ...prev,
          [windowId]: { ...prev[windowId], open: false }
        }));
        windowEl.style.transform = '';
        windowEl.style.opacity = '';
      }, 200);
    }
  };
  
  // Закрытие окна
  const closeWindow = (windowId) => {
    minimizeWindow(windowId);
  };
  
  // Управление окнами через DOM
  useEffect(() => {
    // Обработчики для кнопок открытия окон
    const taskBtn = document.querySelector('[data-window="tasks"]');
    const aiBtn = document.querySelector('[data-window="ai-assistant"]');
    
    if (taskBtn) {
      taskBtn.addEventListener('click', () => toggleWindow('tasks'));
    }
    
    if (aiBtn) {
      aiBtn.addEventListener('click', () => toggleWindow('aiAssistant'));
    }
    
    // Обновление позиций окон
    Object.entries(windows).forEach(([windowId, windowData]) => {
      const windowEl = document.getElementById(`${windowId === 'aiAssistant' ? 'ai-assistant' : windowId}-window`);
      
      if (windowEl && windowData.open) {
        windowEl.style.display = 'flex';
        
        if (windowData.x === 'auto') {
          windowEl.style.right = '40px';
          windowEl.style.left = 'auto';
        } else {
          windowEl.style.left = `${windowData.x}px`;
        }
        
        if (windowData.y === 'auto') {
          windowEl.style.bottom = '80px';
          windowEl.style.top = 'auto';
        } else {
          windowEl.style.top = `${windowData.y}px`;
        }
        
        windowEl.style.width = `${windowData.width}px`;
        windowEl.style.height = `${windowData.height}px`;
        
        // Активное окно
        if (windowId === activeWindow) {
          windowEl.classList.add('active');
        } else {
          windowEl.classList.remove('active');
        }
      } else if (windowEl) {
        windowEl.style.display = 'none';
      }
    });
  }, [windows, activeWindow]);
  
  // Перетаскивание окон
  useEffect(() => {
    const handleMouseDown = (e) => {
      const header = e.target.closest('.window-header');
      if (!header || e.target.closest('.window-controls')) return;
      
      const windowEl = header.closest('.floating-window');
      const windowId = windowEl.id.replace('-window', '');
      
      setDraggingWindow(windowId);
      setActiveWindow(windowId);
      
      const rect = windowEl.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      e.preventDefault();
    };
    
    const handleMouseMove = (e) => {
      if (!draggingWindow) return;
      
      const windowEl = document.getElementById(`${draggingWindow === 'aiAssistant' ? 'ai-assistant' : draggingWindow}-window`);
      if (!windowEl) return;
      
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      
      // Ограничения
      const maxX = window.innerWidth - windowEl.offsetWidth;
      const maxY = window.innerHeight - windowEl.offsetHeight - 32; // Учитываем статус бар
      
      const newX = Math.max(0, Math.min(x, maxX));
      const newY = Math.max(56, Math.min(y, maxY)); // Учитываем header
      
      windowEl.style.left = `${newX}px`;
      windowEl.style.top = `${newY}px`;
      windowEl.style.right = 'auto';
      windowEl.style.bottom = 'auto';
      
      setWindows(prev => ({
        ...prev,
        [draggingWindow]: {
          ...prev[draggingWindow],
          x: newX,
          y: newY
        }
      }));
    };
    
    const handleMouseUp = () => {
      setDraggingWindow(null);
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingWindow, dragOffset]);
  
  // Изменение размера окон
  useEffect(() => {
    const handleResizeStart = (e) => {
      const handle = e.target.closest('.window-resize-handle');
      if (!handle) return;
      
      const windowEl = handle.closest('.floating-window');
      const windowId = windowEl.id.replace('-window', '');
      
      setResizingWindow(windowId);
      setActiveWindow(windowId);
      
      e.preventDefault();
    };
    
    const handleResizeMove = (e) => {
      if (!resizingWindow) return;
      
      const windowEl = document.getElementById(`${resizingWindow === 'aiAssistant' ? 'ai-assistant' : resizingWindow}-window`);
      if (!windowEl) return;
      
      const rect = windowEl.getBoundingClientRect();
      const newWidth = Math.max(320, e.clientX - rect.left);
      const newHeight = Math.max(240, e.clientY - rect.top);
      
      windowEl.style.width = `${newWidth}px`;
      windowEl.style.height = `${newHeight}px`;
      
      setWindows(prev => ({
        ...prev,
        [resizingWindow]: {
          ...prev[resizingWindow],
          width: newWidth,
          height: newHeight
        }
      }));
    };
    
    const handleResizeEnd = () => {
      setResizingWindow(null);
    };
    
    document.addEventListener('mousedown', handleResizeStart);
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    
    return () => {
      document.removeEventListener('mousedown', handleResizeStart);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [resizingWindow]);
  
  // Обработка кнопок управления окнами
  useEffect(() => {
    const handleWindowControl = (e) => {
      const control = e.target.closest('.window-control');
      if (!control) return;
      
      const windowEl = control.closest('.floating-window');
      const windowId = windowEl.id.replace('-window', '');
      const action = control.getAttribute('data-action');
      
      switch (action) {
        case 'minimize':
          minimizeWindow(windowId === 'ai-assistant' ? 'aiAssistant' : windowId);
          break;
        case 'close':
          closeWindow(windowId === 'ai-assistant' ? 'aiAssistant' : windowId);
          break;
      }
    };
    
    document.addEventListener('click', handleWindowControl);
    
    return () => document.removeEventListener('click', handleWindowControl);
  }, []);
  
  // Клавиатурные сокращения для окон
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Alt + T для задач
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleWindow('tasks');
      }
      
      // Alt + A для AI ассистента
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        toggleWindow('aiAssistant');
      }
      
      // Escape для закрытия активного окна
      if (e.key === 'Escape' && activeWindow) {
        closeWindow(activeWindow);
        setActiveWindow(null);
      }
    };
    
    document.addEventListener('keydown', handleKeyboard);
    
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [activeWindow]);
  
  // Сохранение состояния окон
  useEffect(() => {
    const saveState = () => {
      localStorage.setItem('window-state', JSON.stringify(windows));
    };
    
    saveState();
  }, [windows]);
  
  // Загрузка состояния окон при инициализации
  useEffect(() => {
    const savedState = localStorage.getItem('window-state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setWindows(prev => ({
          ...prev,
          ...state
        }));
      } catch (e) {
        console.error('Failed to load window state:', e);
      }
    }
  }, []);
  
  // Обновление счетчика активных окон в статус баре
  useEffect(() => {
    const windowCount = document.querySelector('.window-count');
    if (windowCount) {
      const openWindows = Object.values(windows).filter(w => w.open).length;
      windowCount.textContent = `${openWindows} окон`;
    }
  }, [windows]);
  
  return null; // Этот компонент управляет DOM напрямую
};

export default WindowManager;