'use client';

import { useEffect, useState, useRef } from 'react';

export default function WindowManager() {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  
  useEffect(() => {
    // Initialize default windows
    const defaultWindows = [
      {
        id: 'task-manager',
        title: 'Менеджер задач',
        x: 100,
        y: 100,
        width: 600,
        height: 400,
        minimized: false,
        maximized: false,
        visible: false
      },
      {
        id: 'ai-assistant',
        title: 'AI Ассистент',
        x: 200,
        y: 150,
        width: 400,
        height: 500,
        minimized: false,
        maximized: false,
        visible: false
      }
    ];
    
    setWindows(defaultWindows);
    
    // Listen for window open events
    const handleOpenWindow = (e) => {
      const windowId = e.detail;
      openWindow(windowId);
    };
    
    window.addEventListener('open-window', handleOpenWindow);
    return () => window.removeEventListener('open-window', handleOpenWindow);
  }, []);
  
  // Open window
  const openWindow = (windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, visible: true, minimized: false } : w
    ));
    setActiveWindowId(windowId);
    
    // Add active class to window
    setTimeout(() => {
      const windowEl = document.querySelector(`#window-${windowId}`);
      if (windowEl) {
        windowEl.classList.add('active');
        bringToFront(windowId);
      }
    }, 0);
  };
  
  // Close window
  const closeWindow = (windowId) => {
    const windowEl = document.querySelector(`#window-${windowId}`);
    if (windowEl) {
      windowEl.classList.remove('active');
      setTimeout(() => {
        setWindows(prev => prev.map(w => 
          w.id === windowId ? { ...w, visible: false } : w
        ));
      }, 200);
    }
  };
  
  // Minimize window
  const minimizeWindow = (windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, minimized: true } : w
    ));
  };
  
  // Maximize/restore window
  const toggleMaximize = (windowId) => {
    setWindows(prev => prev.map(w => {
      if (w.id === windowId) {
        if (w.maximized) {
          // Restore
          return { ...w, maximized: false };
        } else {
          // Maximize
          return {
            ...w,
            maximized: true,
            prevX: w.x,
            prevY: w.y,
            prevWidth: w.width,
            prevHeight: w.height
          };
        }
      }
      return w;
    }));
  };
  
  // Bring window to front
  const bringToFront = (windowId) => {
    const allWindows = document.querySelectorAll('.floating-window');
    let maxZ = 100;
    
    allWindows.forEach(w => {
      const z = parseInt(w.style.zIndex || 100);
      if (z > maxZ) maxZ = z;
    });
    
    const targetWindow = document.querySelector(`#window-${windowId}`);
    if (targetWindow) {
      targetWindow.style.zIndex = maxZ + 1;
    }
    
    setActiveWindowId(windowId);
  };
  
  // Drag functionality
  useEffect(() => {
    let isDragging = false;
    let currentWindow = null;
    let startX = 0;
    let startY = 0;
    let windowStartX = 0;
    let windowStartY = 0;
    
    const handleMouseDown = (e) => {
      const header = e.target.closest('.window-header');
      if (!header || e.target.closest('.window-controls')) return;
      
      const windowEl = header.closest('.floating-window');
      if (!windowEl) return;
      
      isDragging = true;
      currentWindow = windowEl;
      startX = e.clientX;
      startY = e.clientY;
      
      const windowId = windowEl.id.replace('window-', '');
      const window = windows.find(w => w.id === windowId);
      if (window && !window.maximized) {
        windowStartX = window.x;
        windowStartY = window.y;
        
        currentWindow.style.cursor = 'move';
        document.body.style.cursor = 'move';
        
        bringToFront(windowId);
      }
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging || !currentWindow) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newX = windowStartX + deltaX;
      const newY = windowStartY + deltaY;
      
      // Constrain to viewport
      const maxX = window.innerWidth - currentWindow.offsetWidth;
      const maxY = window.innerHeight - currentWindow.offsetHeight - 60; // Account for header
      
      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));
      
      currentWindow.style.left = constrainedX + 'px';
      currentWindow.style.top = constrainedY + 'px';
      
      // Update state
      const windowId = currentWindow.id.replace('window-', '');
      setWindows(prev => prev.map(w => 
        w.id === windowId ? { ...w, x: constrainedX, y: constrainedY } : w
      ));
    };
    
    const handleMouseUp = () => {
      isDragging = false;
      currentWindow = null;
      document.body.style.cursor = '';
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [windows]);
  
  // Window control handlers
  useEffect(() => {
    const handleWindowControl = (e) => {
      const btn = e.target.closest('.window-control');
      if (!btn) return;
      
      const windowEl = btn.closest('.floating-window');
      if (!windowEl) return;
      
      const windowId = windowEl.id.replace('window-', '');
      const action = btn.getAttribute('data-action');
      
      switch (action) {
        case 'minimize':
          minimizeWindow(windowId);
          break;
        case 'maximize':
          toggleMaximize(windowId);
          break;
        case 'close':
          closeWindow(windowId);
          break;
      }
    };
    
    document.addEventListener('click', handleWindowControl);
    return () => document.removeEventListener('click', handleWindowControl);
  }, []);
  
  // Update window positions and states
  useEffect(() => {
    windows.forEach(window => {
      const windowEl = document.querySelector(`#window-${window.id}`);
      if (!windowEl) return;
      
      if (window.visible && !window.minimized) {
        windowEl.classList.add('active');
        
        if (window.maximized) {
          windowEl.style.left = '0';
          windowEl.style.top = '0';
          windowEl.style.width = '100%';
          windowEl.style.height = `calc(100% - ${60}px)`; // Account for header
        } else {
          windowEl.style.left = window.x + 'px';
          windowEl.style.top = window.y + 'px';
          windowEl.style.width = window.width + 'px';
          windowEl.style.height = window.height + 'px';
        }
      } else {
        windowEl.classList.remove('active');
      }
    });
  }, [windows]);
  
  // Quick action handlers
  useEffect(() => {
    const quickActions = document.querySelectorAll('.quick-action');
    
    const handleQuickAction = (e) => {
      const action = e.currentTarget.getAttribute('data-action');
      
      switch (action) {
        case 'new-task':
          openWindow('task-manager');
          // Trigger new task creation
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('create-new-task'));
          }, 300);
          break;
        case 'ai-chat':
          openWindow('ai-assistant');
          break;
        // Add more actions as needed
      }
    };
    
    quickActions.forEach(action => {
      action.addEventListener('click', handleQuickAction);
    });
    
    return () => {
      quickActions.forEach(action => {
        action.removeEventListener('click', handleQuickAction);
      });
    };
  }, []);
  
  return null; // This component manages window state, no UI
}