'use client';

import { useEffect, useState } from 'react';

const WidgetSystem = () => {
  const [widgets, setWidgets] = useState({
    revenue: { id: 'revenue', enabled: true, position: 0 },
    clients: { id: 'clients', enabled: true, position: 1 },
    conversion: { id: 'conversion', enabled: true, position: 2 },
    tasks: { id: 'tasks', enabled: true, position: 3 },
    salesChart: { id: 'salesChart', enabled: true, position: 4 },
    teamActivity: { id: 'teamActivity', enabled: true, position: 5 },
    quickActions: { id: 'quickActions', enabled: true, position: 6 },
    aiRecommendations: { id: 'aiRecommendations', enabled: true, position: 7 }
  });
  
  const [editMode, setEditMode] = useState(false);
  
  // Инициализация виджетов
  useEffect(() => {
    const savedConfig = localStorage.getItem('widget-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setWidgets(config);
      } catch (e) {
        console.error('Failed to load widget config:', e);
      }
    }
  }, []);
  
  // Применение конфигурации виджетов
  useEffect(() => {
    const dashboardGrid = document.querySelector('.dashboard-grid');
    if (!dashboardGrid) return;
    
    const sortedWidgets = Object.values(widgets).sort((a, b) => a.position - b.position);
    
    sortedWidgets.forEach(widget => {
      const widgetEl = document.querySelector(`[data-widget="${widget.id}"]`);
      if (widgetEl) {
        if (widget.enabled) {
          widgetEl.style.display = '';
          widgetEl.style.order = widget.position;
        } else {
          widgetEl.style.display = 'none';
        }
      }
    });
    
    localStorage.setItem('widget-config', JSON.stringify(widgets));
  }, [widgets]);
  
  return null;
};

export default WidgetSystem;