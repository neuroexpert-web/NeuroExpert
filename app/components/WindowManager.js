'use client';

import { useEffect, useState } from 'react';

export default function WindowManager() {
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [draggedWindow, setDraggedWindow] = useState(null);

  useEffect(() => {
    // Initialize window management
    initializeWindows();
    
    // Add window controls event listeners
    addWindowControlListeners();
    
    // Initialize drag functionality
    initializeDragAndDrop();
  }, []);

  // Initialize floating windows
  const initializeWindows = () => {
    // Task Manager window
    const taskWindow = document.getElementById('task-manager-window');
    if (taskWindow) {
      setupWindow(taskWindow, { x: 100, y: 100, width: 600, height: 400 });
    }

    // AI Assistant window
    const aiWindow = document.getElementById('ai-assistant-window');
    if (aiWindow) {
      setupWindow(aiWindow, { x: 300, y: 200, width: 500, height: 600 });
    }
  };

  // Setup individual window
  const setupWindow = (windowElement, initialPosition) => {
    windowElement.style.left = `${initialPosition.x}px`;
    windowElement.style.top = `${initialPosition.y}px`;
    windowElement.style.width = `${initialPosition.width}px`;
    windowElement.style.height = `${initialPosition.height}px`;
    
    // Add to windows array
    setWindows(prev => [...prev, {
      id: windowElement.id,
      element: windowElement,
      position: initialPosition,
      minimized: false,
      maximized: false
    }]);
  };

  // Add window control listeners
  const addWindowControlListeners = () => {
    // Close buttons
    document.querySelectorAll('.window-control.close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const window = e.target.closest('.floating-window');
        closeWindow(window);
      });
    });

    // Minimize buttons
    document.querySelectorAll('.window-control.minimize').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const window = e.target.closest('.floating-window');
        minimizeWindow(window);
      });
    });

    // Maximize buttons
    document.querySelectorAll('.window-control.maximize').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const window = e.target.closest('.floating-window');
        maximizeWindow(window);
      });
    });
  };

  // Window actions
  const closeWindow = (windowElement) => {
    windowElement.classList.remove('active');
    updateWindowCount();
  };

  const minimizeWindow = (windowElement) => {
    windowElement.style.transform = 'scale(0.9)';
    windowElement.style.opacity = '0';
    setTimeout(() => {
      windowElement.classList.add('minimized');
      windowElement.style.transform = '';
      windowElement.style.opacity = '';
    }, 300);
    updateWindowCount();
  };

  const maximizeWindow = (windowElement) => {
    if (windowElement.classList.contains('maximized')) {
      // Restore
      const savedPosition = windowElement.dataset.savedPosition;
      if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        windowElement.style.left = pos.left;
        windowElement.style.top = pos.top;
        windowElement.style.width = pos.width;
        windowElement.style.height = pos.height;
      }
      windowElement.classList.remove('maximized');
    } else {
      // Maximize
      windowElement.dataset.savedPosition = JSON.stringify({
        left: windowElement.style.left,
        top: windowElement.style.top,
        width: windowElement.style.width,
        height: windowElement.style.height
      });
      
      windowElement.style.left = '20px';
      windowElement.style.top = '20px';
      windowElement.style.width = 'calc(100% - 40px)';
      windowElement.style.height = 'calc(100% - 40px)';
      windowElement.classList.add('maximized');
    }
  };

  // Drag and drop functionality
  const initializeDragAndDrop = () => {
    let isDragging = false;
    let currentWindow = null;
    let startX = 0;
    let startY = 0;
    let windowStartX = 0;
    let windowStartY = 0;

    // Add drag listeners to window headers
    document.querySelectorAll('.window-header').forEach(header => {
      header.addEventListener('mousedown', startDrag);
    });

    function startDrag(e) {
      if (e.target.closest('.window-control')) return; // Don't drag when clicking controls
      
      isDragging = true;
      currentWindow = e.target.closest('.floating-window');
      
      // Bring window to front
      document.querySelectorAll('.floating-window').forEach(w => {
        w.style.zIndex = '50';
      });
      currentWindow.style.zIndex = '51';
      
      startX = e.clientX;
      startY = e.clientY;
      windowStartX = currentWindow.offsetLeft;
      windowStartY = currentWindow.offsetTop;
      
      currentWindow.style.transition = 'none';
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
      
      e.preventDefault();
    }

    function drag(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newX = windowStartX + deltaX;
      let newY = windowStartY + deltaY;
      
      // Boundary constraints
      const workspaceArea = document.querySelector('.workspace-area');
      const maxX = workspaceArea.offsetWidth - currentWindow.offsetWidth;
      const maxY = workspaceArea.offsetHeight - currentWindow.offsetHeight;
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      
      currentWindow.style.left = `${newX}px`;
      currentWindow.style.top = `${newY}px`;
      
      // Add dragging class for visual feedback
      currentWindow.classList.add('dragging');
    }

    function stopDrag() {
      isDragging = false;
      if (currentWindow) {
        currentWindow.style.transition = '';
        currentWindow.classList.remove('dragging');
      }
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    }

    // Resize functionality
    addResizeHandles();
  };

  // Add resize handles to windows
  const addResizeHandles = () => {
    document.querySelectorAll('.floating-window').forEach(window => {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      resizeHandle.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M11 11L1 1M11 7L7 3M11 3L9 1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `;
      window.appendChild(resizeHandle);
      
      let isResizing = false;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;
      
      resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = window.offsetWidth;
        startHeight = window.offsetHeight;
        
        window.style.transition = 'none';
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        
        e.preventDefault();
        e.stopPropagation();
      });
      
      function resize(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newWidth = Math.max(400, startWidth + deltaX);
        const newHeight = Math.max(300, startHeight + deltaY);
        
        window.style.width = `${newWidth}px`;
        window.style.height = `${newHeight}px`;
      }
      
      function stopResize() {
        isResizing = false;
        window.style.transition = '';
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
      }
    });
  };

  // Update window count in status bar
  const updateWindowCount = () => {
    const activeWindows = document.querySelectorAll('.floating-window.active:not(.minimized)').length;
    const windowCountElement = document.querySelector('.window-count');
    if (windowCountElement) {
      windowCountElement.textContent = activeWindows;
    }
  };

  // Open window function
  window.openFloatingWindow = (windowId) => {
    const windowElement = document.getElementById(windowId);
    if (windowElement) {
      windowElement.classList.add('active');
      windowElement.classList.remove('minimized');
      
      // Bring to front
      document.querySelectorAll('.floating-window').forEach(w => {
        w.style.zIndex = '50';
      });
      windowElement.style.zIndex = '51';
      
      // Animate in
      windowElement.style.transform = 'scale(0.9)';
      windowElement.style.opacity = '0';
      setTimeout(() => {
        windowElement.style.transform = 'scale(1)';
        windowElement.style.opacity = '1';
      }, 50);
      
      updateWindowCount();
    }
  };

  // Add styles for resize handle
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .resize-handle {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 20px;
        height: 20px;
        cursor: nwse-resize;
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
        transition: opacity 0.2s ease;
      }
      
      .resize-handle:hover {
        opacity: 1;
      }
      
      .floating-window.dragging {
        opacity: 0.9;
        cursor: move;
      }
      
      .floating-window.minimized {
        display: none;
      }
      
      .floating-window.maximized {
        border-radius: 0;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component manages behavior, not UI
}