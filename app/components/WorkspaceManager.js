'use client';

import { useEffect, useState } from 'react';

export default function WorkspaceManager() {
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    // Initialize workspace
    initializeWorkspace();
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const initializeWorkspace = () => {
    // Initialize navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        if (view) {
          switchView(view);
        }
      });
    });

    // Initialize KPI animations
    setTimeout(() => {
      const kpiValues = document.querySelectorAll('.kpi-value');
      kpiValues.forEach(value => {
        animateValue(value);
      });
    }, 100);

    // Initialize keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.global-search input');
        if (searchInput) searchInput.focus();
      }
    });
  };

  const switchView = (view) => {
    setActiveView(view);
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.view === view) {
        item.classList.add('active');
      }
    });
  };

  const animateValue = (element) => {
    const text = element.textContent;
    const match = text.match(/[\d,]+/);
    if (!match) return;

    const endValue = parseFloat(match[0].replace(/,/g, ''));
    const duration = 1000;
    const startTime = Date.now();
    const startValue = 0;

    const updateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = startValue + (endValue - startValue) * progress;
      
      if (text.includes('₽')) {
        element.textContent = `₽ ${currentValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      } else if (text.includes('%')) {
        element.textContent = `${currentValue.toFixed(1)}%`;
      } else {
        element.textContent = Math.round(currentValue).toString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    updateValue();
  };

  // Update time in status bar
  useEffect(() => {
    const timeElement = document.querySelector('.current-time');
    if (timeElement) {
      const hours = systemTime.getHours().toString().padStart(2, '0');
      const minutes = systemTime.getMinutes().toString().padStart(2, '0');
      timeElement.textContent = `${hours}:${minutes}`;
    }
  }, [systemTime]);

  return null;
}