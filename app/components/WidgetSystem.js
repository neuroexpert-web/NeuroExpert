'use client';

import { useEffect, useState } from 'react';

export default function WidgetSystem() {
  const [widgets, setWidgets] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    // Load saved widget configuration
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      // Initialize with default widgets
      initializeDefaultWidgets();
    }
    
    // Set up drag and drop
    initializeDragAndDrop();
    
    // Listen for widget events
    window.addEventListener('toggle-edit-mode', handleToggleEditMode);
    window.addEventListener('add-widget', handleAddWidget);
    window.addEventListener('remove-widget', handleRemoveWidget);
    
    return () => {
      window.removeEventListener('toggle-edit-mode', handleToggleEditMode);
      window.removeEventListener('add-widget', handleAddWidget);
      window.removeEventListener('remove-widget', handleRemoveWidget);
    };
  }, []);
  
  const initializeDefaultWidgets = () => {
    const defaultWidgets = [
      {
        id: 'revenue-widget',
        type: 'kpi',
        title: 'Выручка за месяц',
        position: { x: 0, y: 0 },
        size: { width: 1, height: 1 },
        config: {
          metric: 'revenue',
          period: 'month',
          showChart: true
        }
      },
      {
        id: 'clients-widget',
        type: 'kpi',
        title: 'Активные клиенты',
        position: { x: 1, y: 0 },
        size: { width: 1, height: 1 },
        config: {
          metric: 'active_clients',
          showTrend: true
        }
      },
      {
        id: 'sales-chart',
        type: 'chart',
        title: 'График продаж',
        position: { x: 0, y: 1 },
        size: { width: 2, height: 2 },
        config: {
          chartType: 'line',
          metrics: ['revenue', 'orders'],
          period: '30d'
        }
      },
      {
        id: 'activity-feed',
        type: 'activity',
        title: 'Активность команды',
        position: { x: 2, y: 0 },
        size: { width: 1, height: 2 },
        config: {
          showAvatars: true,
          limit: 10
        }
      }
    ];
    
    setWidgets(defaultWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(defaultWidgets));
  };
  
  const handleToggleEditMode = () => {
    setIsEditMode(prev => !prev);
    const dashboard = document.querySelector('.dashboard-grid');
    if (dashboard) {
      dashboard.classList.toggle('edit-mode');
    }
  };
  
  const handleAddWidget = (e) => {
    const { type, config } = e.detail;
    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      title: config.title || 'Новый виджет',
      position: findEmptyPosition(),
      size: getDefaultSize(type),
      config
    };
    
    const updatedWidgets = [...widgets, newWidget];
    setWidgets(updatedWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updatedWidgets));
  };
  
  const handleRemoveWidget = (e) => {
    const widgetId = e.detail;
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    setWidgets(updatedWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updatedWidgets));
  };
  
  const findEmptyPosition = () => {
    // Simple algorithm to find empty space in grid
    const grid = new Array(10).fill(null).map(() => new Array(10).fill(false));
    
    widgets.forEach(widget => {
      for (let y = widget.position.y; y < widget.position.y + widget.size.height; y++) {
        for (let x = widget.position.x; x < widget.position.x + widget.size.width; x++) {
          if (grid[y] && grid[y][x] !== undefined) {
            grid[y][x] = true;
          }
        }
      }
    });
    
    // Find first empty position
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (!grid[y][x]) {
          return { x, y };
        }
      }
    }
    
    return { x: 0, y: 0 };
  };
  
  const getDefaultSize = (type) => {
    switch (type) {
      case 'kpi':
        return { width: 1, height: 1 };
      case 'chart':
        return { width: 2, height: 2 };
      case 'activity':
      case 'tasks':
        return { width: 1, height: 2 };
      default:
        return { width: 1, height: 1 };
    }
  };
  
  const initializeDragAndDrop = () => {
    let draggedWidget = null;
    let placeholder = null;
    
    const handleDragStart = (e) => {
      if (!isEditMode) return;
      
      const widget = e.target.closest('.widget');
      if (!widget) return;
      
      draggedWidget = widget;
      widget.classList.add('dragging');
      
      // Create placeholder
      placeholder = document.createElement('div');
      placeholder.className = 'widget-placeholder';
      placeholder.style.width = widget.offsetWidth + 'px';
      placeholder.style.height = widget.offsetHeight + 'px';
    };
    
    const handleDragOver = (e) => {
      if (!draggedWidget || !placeholder) return;
      e.preventDefault();
      
      const dashboard = document.querySelector('.dashboard-grid');
      const afterElement = getDragAfterElement(dashboard, e.clientY);
      
      if (afterElement == null) {
        dashboard.appendChild(placeholder);
      } else {
        dashboard.insertBefore(placeholder, afterElement);
      }
    };
    
    const handleDragEnd = (e) => {
      if (!draggedWidget) return;
      
      draggedWidget.classList.remove('dragging');
      
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.replaceChild(draggedWidget, placeholder);
        
        // Update widget positions
        updateWidgetPositions();
      }
      
      draggedWidget = null;
      placeholder = null;
    };
    
    const getDragAfterElement = (container, y) => {
      const draggableElements = [...container.querySelectorAll('.widget:not(.dragging)')];
      
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    };
    
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragend', handleDragEnd);
    
    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragend', handleDragEnd);
    };
  };
  
  const updateWidgetPositions = () => {
    const dashboard = document.querySelector('.dashboard-grid');
    const widgetElements = dashboard.querySelectorAll('.widget');
    
    const updatedWidgets = Array.from(widgetElements).map((el, index) => {
      const widgetId = el.getAttribute('data-widget-id');
      const widget = widgets.find(w => w.id === widgetId);
      
      if (widget) {
        // Calculate new position based on index
        const columns = 4; // Adjust based on grid
        return {
          ...widget,
          position: {
            x: index % columns,
            y: Math.floor(index / columns)
          }
        };
      }
      
      return null;
    }).filter(Boolean);
    
    setWidgets(updatedWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updatedWidgets));
  };
  
  // Widget action handlers
  useEffect(() => {
    const handleWidgetAction = (e) => {
      const actionBtn = e.target.closest('.widget-action');
      if (!actionBtn) return;
      
      const action = actionBtn.getAttribute('data-action');
      const widget = actionBtn.closest('.widget');
      const widgetId = widget?.getAttribute('data-widget-id');
      
      switch (action) {
        case 'refresh':
          refreshWidget(widgetId);
          break;
        case 'settings':
          openWidgetSettings(widgetId);
          break;
        case 'remove':
          if (confirm('Удалить этот виджет?')) {
            window.dispatchEvent(new CustomEvent('remove-widget', { detail: widgetId }));
          }
          break;
      }
    };
    
    document.addEventListener('click', handleWidgetAction);
    return () => document.removeEventListener('click', handleWidgetAction);
  }, []);
  
  const refreshWidget = (widgetId) => {
    const widget = document.querySelector(`[data-widget-id="${widgetId}"]`);
    if (widget) {
      widget.classList.add('loading');
      
      // Simulate data refresh
      setTimeout(() => {
        widget.classList.remove('loading');
        
        // Trigger widget update event
        window.dispatchEvent(new CustomEvent('widget-refresh', { 
          detail: { widgetId, timestamp: Date.now() }
        }));
      }, 1000);
    }
  };
  
  const openWidgetSettings = (widgetId) => {
    // Open settings modal for widget
    window.dispatchEvent(new CustomEvent('open-widget-settings', { detail: widgetId }));
  };
  
  // Apply widget draggable attribute
  useEffect(() => {
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
      widget.setAttribute('draggable', isEditMode);
    });
  }, [isEditMode, widgets]);
  
  return null; // This component manages widget system, no UI
}