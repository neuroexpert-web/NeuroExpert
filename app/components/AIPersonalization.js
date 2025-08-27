'use client';

import { useEffect, useState, useRef } from 'react';

export default function AIPersonalization() {
  const [userBehavior, setUserBehavior] = useState({
    interactions: [],
    preferences: {},
    patterns: {},
    lastActivity: new Date()
  });
  
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const behaviorTracking = useRef(true);
  const mlModel = useRef(null);

  useEffect(() => {
    // Initialize AI personalization
    initializePersonalization();
    
    // Start behavior tracking
    startBehaviorTracking();
    
    // Load user profile
    loadUserProfile();
    
    // Initialize ML model
    initializeMLModel();
    
    // Clean up
    return () => {
      behaviorTracking.current = false;
    };
  }, []);

  // Initialize personalization system
  const initializePersonalization = () => {
    console.log('Initializing AI Personalization...');
    
    // Set up event listeners for user interactions
    document.addEventListener('click', trackClick);
    document.addEventListener('scroll', trackScroll);
    document.addEventListener('mousemove', throttle(trackMouseMovement, 1000));
    
    // Initialize personalized layout
    applyPersonalizedLayout();
    
    // Start anomaly detection
    startAnomalyDetection();
  };

  // Load user profile and preferences
  const loadUserProfile = () => {
    const savedProfile = localStorage.getItem('ai-user-profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserBehavior(prev => ({ ...prev, ...profile }));
      
      // Apply saved preferences
      applyUserPreferences(profile.preferences);
    }
  };

  // Initialize ML model (simulated)
  const initializeMLModel = () => {
    // In production, this would load a real ML model
    mlModel.current = {
      predict: (features) => {
        // Simulate predictions based on features
        return {
          nextAction: predictNextAction(features),
          recommendedWidgets: predictWidgetOrder(features),
          anomalyScore: calculateAnomalyScore(features)
        };
      }
    };
  };

  // Track user clicks
  const trackClick = (e) => {
    if (!behaviorTracking.current) return;
    
    const target = e.target;
    const interaction = {
      type: 'click',
      element: target.tagName,
      class: target.className,
      id: target.id,
      timestamp: new Date(),
      position: { x: e.clientX, y: e.clientY }
    };
    
    updateUserBehavior(interaction);
    
    // Check for patterns
    detectClickPatterns(interaction);
  };

  // Track scrolling behavior
  const trackScroll = throttle(() => {
    if (!behaviorTracking.current) return;
    
    const scrollPosition = window.scrollY;
    const scrollPercentage = (scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    const interaction = {
      type: 'scroll',
      position: scrollPosition,
      percentage: scrollPercentage,
      timestamp: new Date()
    };
    
    updateUserBehavior(interaction);
  }, 500);

  // Track mouse movement patterns
  const trackMouseMovement = (e) => {
    if (!behaviorTracking.current) return;
    
    // Analyze mouse movement for engagement
    const interaction = {
      type: 'mousemove',
      position: { x: e.clientX, y: e.clientY },
      timestamp: new Date()
    };
    
    // Detect hovering patterns
    detectHoverPatterns(interaction);
  };

  // Update user behavior data
  const updateUserBehavior = (interaction) => {
    setUserBehavior(prev => {
      const updated = {
        ...prev,
        interactions: [...prev.interactions.slice(-99), interaction],
        lastActivity: new Date()
      };
      
      // Save to localStorage periodically
      if (updated.interactions.length % 10 === 0) {
        saveUserProfile(updated);
      }
      
      return updated;
    });
  };

  // Save user profile
  const saveUserProfile = (profile) => {
    localStorage.setItem('ai-user-profile', JSON.stringify({
      preferences: profile.preferences,
      patterns: profile.patterns,
      lastActivity: profile.lastActivity
    }));
  };

  // Detect click patterns
  const detectClickPatterns = (interaction) => {
    const recentClicks = userBehavior.interactions
      .filter(i => i.type === 'click')
      .slice(-10);
    
    // Detect frequently clicked areas
    if (recentClicks.length >= 5) {
      const commonElements = {};
      recentClicks.forEach(click => {
        const key = `${click.element}.${click.class}`;
        commonElements[key] = (commonElements[key] || 0) + 1;
      });
      
      // Find most clicked element
      const mostClicked = Object.entries(commonElements)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (mostClicked && mostClicked[1] >= 3) {
        suggestOptimization('frequent_interaction', mostClicked[0]);
      }
    }
  };

  // Detect hover patterns
  const detectHoverPatterns = (interaction) => {
    // Implement hover pattern detection
    // This could identify areas of interest or confusion
  };

  // Apply personalized layout
  const applyPersonalizedLayout = () => {
    const preferences = userBehavior.preferences;
    
    // Reorder widgets based on usage
    if (preferences.widgetOrder) {
      reorderWidgets(preferences.widgetOrder);
    }
    
    // Adjust density based on preference
    if (preferences.uiDensity) {
      adjustUIDensity(preferences.uiDensity);
    }
    
    // Set preferred theme
    if (preferences.theme) {
      document.body.dataset.theme = preferences.theme;
    }
  };

  // Apply user preferences
  const applyUserPreferences = (preferences) => {
    // Color scheme preference
    if (preferences.colorScheme) {
      document.documentElement.style.setProperty('--user-accent-color', preferences.colorScheme);
    }
    
    // Font size preference
    if (preferences.fontSize) {
      document.documentElement.style.fontSize = `${preferences.fontSize}px`;
    }
    
    // Animation preference
    if (preferences.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
  };

  // Reorder widgets based on usage patterns
  const reorderWidgets = (order) => {
    const grid = document.querySelector('.dashboard-grid');
    if (!grid) return;
    
    const widgets = Array.from(grid.children);
    const reordered = order
      .map(id => widgets.find(w => w.id === id))
      .filter(Boolean);
    
    // Clear and re-append in new order
    grid.innerHTML = '';
    reordered.forEach(widget => grid.appendChild(widget));
  };

  // Adjust UI density
  const adjustUIDensity = (density) => {
    const root = document.documentElement;
    
    switch (density) {
      case 'compact':
        root.style.setProperty('--ws-widget-gap', '12px');
        root.style.setProperty('--widget-padding', '16px');
        break;
      case 'comfortable':
        root.style.setProperty('--ws-widget-gap', '20px');
        root.style.setProperty('--widget-padding', '20px');
        break;
      case 'spacious':
        root.style.setProperty('--ws-widget-gap', '28px');
        root.style.setProperty('--widget-padding', '24px');
        break;
    }
  };

  // Start anomaly detection
  const startAnomalyDetection = () => {
    setInterval(() => {
      if (!behaviorTracking.current) return;
      
      const features = extractUserFeatures();
      const predictions = mlModel.current?.predict(features);
      
      if (predictions?.anomalyScore > 0.8) {
        handleAnomaly(predictions);
      }
      
      // Update AI suggestions
      updateAISuggestions(predictions);
    }, 30000); // Check every 30 seconds
  };

  // Extract user features for ML
  const extractUserFeatures = () => {
    const recent = userBehavior.interactions.slice(-50);
    
    return {
      clickRate: recent.filter(i => i.type === 'click').length / 50,
      scrollDepth: Math.max(...recent.filter(i => i.type === 'scroll').map(i => i.percentage || 0)),
      activeTime: (new Date() - new Date(userBehavior.lastActivity)) / 1000,
      widgetInteractions: countWidgetInteractions(recent),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };
  };

  // Count widget interactions
  const countWidgetInteractions = (interactions) => {
    const counts = {};
    interactions
      .filter(i => i.type === 'click' && i.element === 'DIV')
      .forEach(i => {
        const widget = i.class?.match(/widget-(\w+)/)?.[1];
        if (widget) {
          counts[widget] = (counts[widget] || 0) + 1;
        }
      });
    return counts;
  };

  // Predict next user action
  const predictNextAction = (features) => {
    // Simulate prediction based on time and patterns
    const hour = features.timeOfDay;
    
    if (hour >= 9 && hour <= 11) {
      return 'check_analytics';
    } else if (hour >= 14 && hour <= 16) {
      return 'review_tasks';
    } else {
      return 'view_summary';
    }
  };

  // Predict optimal widget order
  const predictWidgetOrder = (features) => {
    const interactions = features.widgetInteractions;
    
    // Sort widgets by interaction frequency
    return Object.entries(interactions)
      .sort(([,a], [,b]) => b - a)
      .map(([widget]) => widget);
  };

  // Calculate anomaly score
  const calculateAnomalyScore = (features) => {
    // Simple anomaly detection based on activity patterns
    if (features.activeTime > 3600) return 0.9; // Inactive for over an hour
    if (features.clickRate < 0.1) return 0.8; // Very low engagement
    if (features.scrollDepth < 10) return 0.7; // Not exploring content
    
    return 0.2; // Normal behavior
  };

  // Handle detected anomalies
  const handleAnomaly = (predictions) => {
    console.warn('Anomaly detected:', predictions);
    
    // Show helpful prompt
    showAIAssistant('Нужна помощь? Я заметил, что вы испытываете затруднения.');
  };

  // Update AI suggestions
  const updateAISuggestions = (predictions) => {
    if (!predictions) return;
    
    const suggestions = [];
    
    // Suggest next action
    if (predictions.nextAction) {
      suggestions.push({
        type: 'action',
        title: 'Рекомендуемое действие',
        text: getActionText(predictions.nextAction),
        action: predictions.nextAction
      });
    }
    
    // Suggest widget reorganization
    if (predictions.recommendedWidgets?.length > 0) {
      suggestions.push({
        type: 'layout',
        title: 'Оптимизация интерфейса',
        text: 'Переставить виджеты для удобства?',
        widgets: predictions.recommendedWidgets
      });
    }
    
    setAiSuggestions(suggestions);
    
    // Show inline suggestions
    if (suggestions.length > 0) {
      showInlineSuggestion(suggestions[0]);
    }
  };

  // Get action text
  const getActionText = (action) => {
    const texts = {
      check_analytics: 'Проверить аналитику за сегодня',
      review_tasks: 'Просмотреть активные задачи',
      view_summary: 'Посмотреть сводку дня'
    };
    return texts[action] || 'Продолжить работу';
  };

  // Show inline suggestion
  const showInlineSuggestion = (suggestion) => {
    const container = document.querySelector('.ai-suggestion-inline');
    if (!container) return;
    
    container.innerHTML = `
      <div class="suggestion-icon">💡</div>
      <div class="suggestion-content">
        <strong>${suggestion.title}:</strong> ${suggestion.text}
      </div>
      <button class="suggestion-action" data-action="${suggestion.action || suggestion.type}">
        Применить
      </button>
      <button class="suggestion-dismiss">✕</button>
    `;
    
    container.classList.add('show');
    
    // Handle actions
    container.querySelector('.suggestion-action')?.addEventListener('click', (e) => {
      applySuggestion(suggestion);
      container.classList.remove('show');
    });
    
    container.querySelector('.suggestion-dismiss')?.addEventListener('click', () => {
      container.classList.remove('show');
    });
  };

  // Apply AI suggestion
  const applySuggestion = (suggestion) => {
    switch (suggestion.type) {
      case 'action':
        performSuggestedAction(suggestion.action);
        break;
      case 'layout':
        reorderWidgets(suggestion.widgets);
        saveUserProfile({
          ...userBehavior,
          preferences: {
            ...userBehavior.preferences,
            widgetOrder: suggestion.widgets
          }
        });
        break;
    }
  };

  // Perform suggested action
  const performSuggestedAction = (action) => {
    switch (action) {
      case 'check_analytics':
        document.querySelector('[data-view="analytics"]')?.click();
        break;
      case 'review_tasks':
        window.openFloatingWindow?.('task-manager-window');
        break;
      case 'view_summary':
        // Scroll to summary section
        document.querySelector('.dashboard-grid')?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  // Show AI assistant
  const showAIAssistant = (message) => {
    const assistant = document.getElementById('ai-assistant-window');
    if (assistant) {
      // Open AI assistant window
      window.openFloatingWindow?.('ai-assistant-window');
      
      // Add message to chat
      const chatContent = assistant.querySelector('.chat-content');
      if (chatContent) {
        const messageEl = document.createElement('div');
        messageEl.className = 'ai-message';
        messageEl.innerHTML = `
          <div class="message-avatar">🤖</div>
          <div class="message-content">${message}</div>
        `;
        chatContent.appendChild(messageEl);
        chatContent.scrollTop = chatContent.scrollHeight;
      }
    }
  };

  // Suggest optimization based on patterns
  const suggestOptimization = (type, data) => {
    console.log('Optimization suggestion:', type, data);
    
    // Create specific suggestions based on type
    switch (type) {
      case 'frequent_interaction':
        showInlineSuggestion({
          type: 'shortcut',
          title: 'Создать быстрый доступ',
          text: `Вы часто используете ${data}. Добавить на панель быстрого доступа?`,
          element: data
        });
        break;
    }
  };

  // Throttle function
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  // Add AI personalization styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ai-suggestion-inline {
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--ws-surface-glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--ws-border-active);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: var(--ws-shadow-lg);
        z-index: 100;
        transition: transform 0.3s ease;
      }
      
      .ai-suggestion-inline.show {
        transform: translateX(-50%) translateY(0);
      }
      
      .suggestion-icon {
        font-size: 24px;
      }
      
      .suggestion-content {
        flex: 1;
        font-size: 14px;
        color: var(--color-text-light);
      }
      
      .suggestion-action {
        padding: 8px 16px;
        background: linear-gradient(135deg, var(--gradient-cta-start), var(--gradient-cta-end));
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .suggestion-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(138, 43, 226, 0.4);
      }
      
      .suggestion-dismiss {
        width: 32px;
        height: 32px;
        background: var(--ws-bg-tertiary);
        border: none;
        border-radius: 50%;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .suggestion-dismiss:hover {
        background: var(--ws-surface-glass-hover);
        color: var(--color-text-light);
      }
      
      .reduce-motion * {
        animation: none !important;
        transition: none !important;
      }
      
      .ai-message {
        display: flex;
        gap: 12px;
        padding: 12px;
        margin-bottom: 8px;
      }
      
      .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--ws-bg-tertiary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }
      
      .message-content {
        flex: 1;
        background: var(--ws-bg-tertiary);
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        color: var(--color-text-light);
      }
    `;
    document.head.appendChild(style);
    
    // Create suggestion container
    const suggestionContainer = document.createElement('div');
    suggestionContainer.className = 'ai-suggestion-inline';
    document.body.appendChild(suggestionContainer);
    
    return () => {
      document.head.removeChild(style);
      suggestionContainer.remove();
    };
  }, []);

  return null; // This component manages behavior, not UI
}