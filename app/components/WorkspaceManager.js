'use client';

import { useEffect, useState, useCallback } from 'react';

export default function WorkspaceManager() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [widgets, setWidgets] = useState([]);
  const [notifications, setNotifications] = useState(3);
  
  // Initialize workspace
  useEffect(() => {
    // Load saved workspace state from localStorage
    const savedState = localStorage.getItem('workspaceState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setIsSidebarCollapsed(state.sidebarCollapsed || false);
      setActiveSection(state.activeSection || 'dashboard');
    }
    
    // Initialize widgets
    initializeWidgets();
    
    // Set up keyboard shortcuts
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K - Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.global-search')?.focus();
      }
      
      // Cmd/Ctrl + B - Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Initialize default widgets
  const initializeWidgets = () => {
    const defaultWidgets = [
      { id: 'revenue', type: 'kpi', title: 'Выручка за месяц', value: '₽7.2M', change: '+12.5%', trend: 'positive' },
      { id: 'clients', type: 'kpi', title: 'Активные клиенты', value: '3,482', change: '+8.3%', trend: 'positive' },
      { id: 'conversion', type: 'kpi', title: 'Конверсия', value: '4.2%', change: '-0.5%', trend: 'negative' },
      { id: 'tasks', type: 'kpi', title: 'Задачи', value: '24/31', change: '77%', trend: 'neutral' }
    ];
    setWidgets(defaultWidgets);
  };
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const newState = !prev;
      // Save state
      localStorage.setItem('workspaceState', JSON.stringify({
        sidebarCollapsed: newState,
        activeSection
      }));
      return newState;
    });
  }, [activeSection]);
  
  // Handle navigation
  const handleNavigation = useCallback((section) => {
    setActiveSection(section);
    // Save state
    localStorage.setItem('workspaceState', JSON.stringify({
      sidebarCollapsed: isSidebarCollapsed,
      activeSection: section
    }));
    
    // Trigger section change event for other components
    window.dispatchEvent(new CustomEvent('workspace-section-change', { detail: section }));
  }, [isSidebarCollapsed]);
  
  // Handle search
  const handleSearch = useCallback((query) => {
    if (!query) return;
    
    // Implement search logic
    console.log('Searching for:', query);
    
    // Show search results in a modal or dedicated view
    window.dispatchEvent(new CustomEvent('workspace-search', { detail: query }));
  }, []);
  
  // Sidebar toggle effect
  useEffect(() => {
    const sidebar = document.querySelector('.workspace-sidebar');
    if (sidebar) {
      if (isSidebarCollapsed) {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    }
  }, [isSidebarCollapsed]);
  
  // Navigation click handlers
  useEffect(() => {
    const navItems = document.querySelectorAll('.nav-item');
    
    const handleNavClick = (e) => {
      e.preventDefault();
      const section = e.currentTarget.getAttribute('data-section');
      if (section) {
        handleNavigation(section);
        
        // Update active state
        navItems.forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
      }
    };
    
    navItems.forEach(item => {
      item.addEventListener('click', handleNavClick);
    });
    
    return () => {
      navItems.forEach(item => {
        item.removeEventListener('click', handleNavClick);
      });
    };
  }, [handleNavigation]);
  
  // Search functionality
  useEffect(() => {
    const searchInput = document.querySelector('.global-search');
    let searchTimeout;
    
    const handleSearchInput = (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value;
      
      // Debounce search
      searchTimeout = setTimeout(() => {
        if (query.length > 2) {
          handleSearch(query);
        }
      }, 300);
    };
    
    searchInput?.addEventListener('input', handleSearchInput);
    
    return () => {
      searchInput?.removeEventListener('input', handleSearchInput);
      clearTimeout(searchTimeout);
    };
  }, [handleSearch]);
  
  // Real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notifications
      if (Math.random() > 0.8) {
        setNotifications(prev => prev + 1);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Update notification badge
  useEffect(() => {
    const badge = document.querySelector('.notification-badge');
    if (badge && notifications > 0) {
      badge.style.display = 'block';
    } else if (badge) {
      badge.style.display = 'none';
    }
  }, [notifications]);
  
  // Theme toggle
  useEffect(() => {
    const themeToggle = document.querySelector('.theme-toggle');
    
    const handleThemeToggle = () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };
    
    themeToggle?.addEventListener('click', handleThemeToggle);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
    
    return () => {
      themeToggle?.removeEventListener('click', handleThemeToggle);
    };
  }, []);
  
  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1200 && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial size
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarCollapsed]);
  
  return null; // This component manages state and events, no UI
}