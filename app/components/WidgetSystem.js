'use client';

import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

export default function WidgetSystem() {
  const [widgets, setWidgets] = useState([]);
  const [charts, setCharts] = useState({});

  useEffect(() => {
    // Initialize widget system
    initializeWidgets();
    
    // Initialize charts
    initializeCharts();
    
    // Setup widget interactions
    setupWidgetInteractions();
    
    // Setup grid layout
    setupGridLayout();
  }, []);

  // Initialize all widgets
  const initializeWidgets = () => {
    const widgetElements = document.querySelectorAll('.widget');
    const widgetList = [];
    
    widgetElements.forEach((widget, index) => {
      const widgetId = widget.id || `widget-${index}`;
      widget.id = widgetId;
      
      widgetList.push({
        id: widgetId,
        type: widget.dataset.widgetType || 'default',
        position: { x: 0, y: 0 },
        size: { width: 1, height: 1 },
        preferences: {}
      });
    });
    
    setWidgets(widgetList);
  };

  // Initialize chart widgets
  const initializeCharts = () => {
    // Revenue Chart
    const revenueCanvas = document.getElementById('revenue-chart');
    if (revenueCanvas) {
      const ctx = revenueCanvas.getContext('2d');
      const revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: generateDateLabels(30),
          datasets: [{
            label: 'Выручка',
            data: generateRevenueData(30),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(30, 30, 45, 0.9)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(139, 92, 246, 0.5)',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: (context) => `₽${(context.parsed.y / 1000).toFixed(1)}M`
              }
            }
          },
          scales: {
            x: {
              grid: { 
                color: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: { 
                color: 'rgba(255, 255, 255, 0.5)',
                maxRotation: 0
              }
            },
            y: {
              grid: { 
                color: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: { 
                color: 'rgba(255, 255, 255, 0.5)',
                callback: (value) => `₽${(value / 1000).toFixed(0)}M`
              }
            }
          }
        }
      });
      
      setCharts(prev => ({ ...prev, revenue: revenueChart }));
    }

    // Sparkline charts for KPI widgets
    document.querySelectorAll('.metric-sparkline').forEach((canvas, index) => {
      const ctx = canvas.getContext('2d');
      const sparkline = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array(20).fill(''),
          datasets: [{
            data: generateSparklineData(20),
            borderColor: index % 2 === 0 ? '#10b981' : '#f59e0b',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }
      });
    });
  };

  // Generate date labels
  const generateDateLabels = (days) => {
    const labels = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }));
    }
    
    return labels;
  };

  // Generate revenue data
  const generateRevenueData = (days) => {
    const data = [];
    let baseValue = 5000000; // 5M rubles
    
    for (let i = 0; i < days; i++) {
      // Add some realistic variation
      const dailyVariation = (Math.random() - 0.5) * 0.1;
      const weekendFactor = (i % 7 === 0 || i % 7 === 6) ? 0.7 : 1;
      const trend = 1 + (i / days) * 0.1; // 10% growth over period
      
      baseValue = baseValue * (1 + dailyVariation) * weekendFactor * trend;
      data.push(Math.round(baseValue));
    }
    
    return data;
  };

  // Generate sparkline data
  const generateSparklineData = (points) => {
    const data = [];
    let value = 50;
    
    for (let i = 0; i < points; i++) {
      value += (Math.random() - 0.5) * 10;
      value = Math.max(20, Math.min(80, value));
      data.push(value);
    }
    
    return data;
  };

  // Setup widget interactions
  const setupWidgetInteractions = () => {
    // Widget hover effects
    document.querySelectorAll('.widget').forEach(widget => {
      widget.addEventListener('mouseenter', () => {
        widget.style.transform = 'translateY(-2px)';
      });
      
      widget.addEventListener('mouseleave', () => {
        widget.style.transform = 'translateY(0)';
      });
    });

    // Widget actions menu
    addWidgetMenus();
    
    // Make widgets draggable (optional)
    if (window.innerWidth > 1200) {
      makeWidgetsDraggable();
    }
  };

  // Add widget action menus
  const addWidgetMenus = () => {
    document.querySelectorAll('.widget-header').forEach(header => {
      const menuBtn = document.createElement('button');
      menuBtn.className = 'widget-menu-btn';
      menuBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
          <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
        </svg>
      `;
      
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showWidgetMenu(header.closest('.widget'));
      });
      
      header.appendChild(menuBtn);
    });
  };

  // Show widget menu
  const showWidgetMenu = (widget) => {
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'widget-menu';
    menu.innerHTML = `
      <div class="menu-item" data-action="refresh">
        <svg width="16" height="16"><path d="M14 8A6 6 0 112 8a6 6 0 0112 0z" stroke="currentColor" fill="none"/></svg>
        Обновить
      </div>
      <div class="menu-item" data-action="settings">
        <svg width="16" height="16"><path d="M8 10a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/></svg>
        Настройки
      </div>
      <div class="menu-item" data-action="fullscreen">
        <svg width="16" height="16"><path d="M2 8V2h6M14 8v6H8" stroke="currentColor" fill="none"/></svg>
        Развернуть
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item" data-action="remove">
        <svg width="16" height="16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" fill="none"/></svg>
        Удалить
      </div>
    `;
    
    // Position menu
    const rect = widget.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.top + 40}px`;
    menu.style.right = `${window.innerWidth - rect.right}px`;
    
    document.body.appendChild(menu);
    
    // Handle menu actions
    menu.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        handleWidgetAction(widget, action);
        menu.remove();
      });
    });
    
    // Close menu on outside click
    setTimeout(() => {
      document.addEventListener('click', () => menu.remove(), { once: true });
    }, 100);
  };

  // Handle widget actions
  const handleWidgetAction = (widget, action) => {
    switch (action) {
      case 'refresh':
        refreshWidget(widget);
        break;
      case 'settings':
        openWidgetSettings(widget);
        break;
      case 'fullscreen':
        toggleWidgetFullscreen(widget);
        break;
      case 'remove':
        removeWidget(widget);
        break;
    }
  };

  // Refresh widget data
  const refreshWidget = (widget) => {
    widget.classList.add('loading');
    
    // Simulate data refresh
    setTimeout(() => {
      widget.classList.remove('loading');
      
      // Update KPI value if it's a KPI widget
      if (widget.classList.contains('kpi-widget')) {
        const valueElement = widget.querySelector('.metric-value');
        if (valueElement) {
          const currentValue = parseFloat(valueElement.textContent.replace(/[^\d.-]/g, ''));
          const newValue = currentValue * (1 + (Math.random() - 0.5) * 0.1);
          valueElement.textContent = `₽${(newValue / 1000).toFixed(1)}M`;
        }
      }
    }, 1000);
  };

  // Toggle widget fullscreen
  const toggleWidgetFullscreen = (widget) => {
    widget.classList.toggle('fullscreen');
    
    if (widget.classList.contains('fullscreen')) {
      widget.style.position = 'fixed';
      widget.style.top = '80px';
      widget.style.left = '20px';
      widget.style.right = '20px';
      widget.style.bottom = '20px';
      widget.style.zIndex = '100';
    } else {
      widget.style.position = '';
      widget.style.top = '';
      widget.style.left = '';
      widget.style.right = '';
      widget.style.bottom = '';
      widget.style.zIndex = '';
    }
  };

  // Remove widget
  const removeWidget = (widget) => {
    widget.style.transform = 'scale(0.8)';
    widget.style.opacity = '0';
    setTimeout(() => widget.remove(), 300);
  };

  // Make widgets draggable
  const makeWidgetsDraggable = () => {
    // Implement grid-based drag and drop for widgets
    // This is a placeholder for more complex implementation
  };

  // Setup responsive grid layout
  const setupGridLayout = () => {
    const grid = document.querySelector('.dashboard-grid');
    if (!grid) return;
    
    // Observe grid changes
    const resizeObserver = new ResizeObserver(() => {
      adjustGridLayout();
    });
    
    resizeObserver.observe(grid);
  };

  // Adjust grid layout based on screen size
  const adjustGridLayout = () => {
    const width = window.innerWidth;
    const grid = document.querySelector('.dashboard-grid');
    
    if (!grid) return; // Добавлена проверка на null
    
    if (width < 768) {
      grid.style.gridTemplateColumns = '1fr';
    } else if (width < 1200) {
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    } else {
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    }
  };

  // Add widget system styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .widget-menu-btn {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0;
        transition: all 0.2s ease;
      }
      
      .widget:hover .widget-menu-btn {
        opacity: 1;
      }
      
      .widget-menu-btn:hover {
        background: var(--ws-bg-tertiary);
        color: var(--color-text-light);
      }
      
      .widget-menu {
        background: var(--ws-surface-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--ws-border-color);
        border-radius: 8px;
        padding: 8px;
        min-width: 160px;
        box-shadow: var(--ws-shadow-lg);
        z-index: 1000;
      }
      
      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        color: var(--color-text-light);
        transition: all 0.2s ease;
      }
      
      .menu-item:hover {
        background: var(--ws-surface-glass-hover);
      }
      
      .menu-divider {
        height: 1px;
        background: var(--ws-border-color);
        margin: 8px 0;
      }
      
      .widget.fullscreen {
        animation: expand-fullscreen 0.3s ease-out;
      }
      
      @keyframes expand-fullscreen {
        from {
          transform: scale(0.9);
          opacity: 0.8;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component manages behavior, not UI
}