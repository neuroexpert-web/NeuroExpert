'use client';

import { useEffect, useRef } from 'react';

export default function WindowManager() {
  const windowsRef = useRef([]);
  const draggedWindow = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Инициализация управления окнами
    const floatingWindows = document.querySelectorAll('.floating-window');
    
    floatingWindows.forEach(window => {
      const header = window.querySelector('.window-header');
      const minimizeBtn = window.querySelector('.window-minimize');
      const maximizeBtn = window.querySelector('.window-maximize');
      const closeBtn = window.querySelector('.window-close');
      
      // Перетаскивание окна
      if (header) {
        header.addEventListener('mousedown', startDrag);
      }
      
      // Кнопки управления
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => minimizeWindow(window));
      }
      
      if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => maximizeWindow(window));
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeWindow(window));
      }
      
      // Изменение размера
      addResizeHandles(window);
    });
    
    // Глобальные обработчики
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    return () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    };
  }, []);
  
  // Перетаскивание
  const startDrag = (e) => {
    if (e.target.classList.contains('window-control')) return;
    
    const window = e.target.closest('.floating-window');
    draggedWindow.current = window;
    
    const rect = window.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Поднять окно наверх
    bringToFront(window);
  };
  
  const drag = (e) => {
    if (!draggedWindow.current) return;
    
    const workspace = document.querySelector('.workspace-area');
    const workspaceRect = workspace.getBoundingClientRect();
    
    let newX = e.clientX - dragOffset.current.x - workspaceRect.left;
    let newY = e.clientY - dragOffset.current.y - workspaceRect.top;
    
    // Ограничения
    newX = Math.max(0, Math.min(newX, workspaceRect.width - draggedWindow.current.offsetWidth));
    newY = Math.max(0, Math.min(newY, workspaceRect.height - draggedWindow.current.offsetHeight));
    
    draggedWindow.current.style.left = newX + 'px';
    draggedWindow.current.style.top = newY + 'px';
  };
  
  const stopDrag = () => {
    draggedWindow.current = null;
  };
  
  // Управление окнами
  const minimizeWindow = (window) => {
    window.classList.add('minimized');
    window.style.transform = 'scale(0.2)';
    window.style.opacity = '0';
    
    setTimeout(() => {
      window.style.display = 'none';
    }, 300);
  };
  
  const maximizeWindow = (window) => {
    if (window.classList.contains('maximized')) {
      // Восстановить
      window.classList.remove('maximized');
      window.style.width = window.dataset.originalWidth;
      window.style.height = window.dataset.originalHeight;
      window.style.left = window.dataset.originalLeft;
      window.style.top = window.dataset.originalTop;
    } else {
      // Развернуть
      window.dataset.originalWidth = window.style.width;
      window.dataset.originalHeight = window.style.height;
      window.dataset.originalLeft = window.style.left;
      window.dataset.originalTop = window.style.top;
      
      window.classList.add('maximized');
      window.style.width = '100%';
      window.style.height = '100%';
      window.style.left = '0';
      window.style.top = '0';
    }
  };
  
  const closeWindow = (window) => {
    window.style.transform = 'scale(0.8)';
    window.style.opacity = '0';
    
    setTimeout(() => {
      window.classList.remove('active');
      window.style.display = 'none';
    }, 300);
  };
  
  const bringToFront = (window) => {
    const allWindows = document.querySelectorAll('.floating-window');
    allWindows.forEach((w, index) => {
      w.style.zIndex = w === window ? 200 : 100 + index;
    });
  };
  
  // Изменение размера
  const addResizeHandles = (window) => {
    const handles = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];
    
    handles.forEach(direction => {
      const handle = document.createElement('div');
      handle.className = `resize-handle resize-${direction}`;
      handle.addEventListener('mousedown', (e) => startResize(e, window, direction));
      window.appendChild(handle);
    });
  };
  
  const startResize = (e, window, direction) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = window.offsetWidth;
    const startHeight = window.offsetHeight;
    const startLeft = window.offsetLeft;
    const startTop = window.offsetTop;
    
    const doResize = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      if (direction.includes('e')) {
        window.style.width = Math.max(400, startWidth + dx) + 'px';
      }
      if (direction.includes('s')) {
        window.style.height = Math.max(300, startHeight + dy) + 'px';
      }
      if (direction.includes('w')) {
        const newWidth = Math.max(400, startWidth - dx);
        window.style.width = newWidth + 'px';
        window.style.left = (startLeft + startWidth - newWidth) + 'px';
      }
      if (direction.includes('n')) {
        const newHeight = Math.max(300, startHeight - dy);
        window.style.height = newHeight + 'px';
        window.style.top = (startTop + startHeight - newHeight) + 'px';
      }
    };
    
    const stopResize = () => {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
    };
    
    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  };
  
  return null;
}