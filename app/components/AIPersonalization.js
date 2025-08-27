'use client';

import { useEffect, useState, useRef } from 'react';

export default function AIPersonalization() {
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const behaviorTracker = useRef({
    clicks: {},
    timeSpent: {},
    features: {},
    lastActivity: Date.now()
  });
  
  useEffect(() => {
    // Load user profile
    loadUserProfile();
    
    // Initialize behavior tracking
    initializeBehaviorTracking();
    
    // Start AI analysis
    startAIAnalysis();
    
    // Listen for AI events
    window.addEventListener('ai-command', handleAICommand);
    
    return () => {
      window.removeEventListener('ai-command', handleAICommand);
      saveBehaviorData();
    };
  }, []);
  
  const loadUserProfile = () => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      // Create default profile
      const defaultProfile = {
        id: 'user-' + Date.now(),
        role: 'analyst',
        preferences: {
          dashboardLayout: 'default',
          theme: 'dark',
          language: 'ru',
          notifications: true,
          dataRefreshRate: 30
        },
        usage: {
          mostUsedFeatures: [],
          averageSessionDuration: 0,
          lastLogin: Date.now()
        }
      };
      setUserProfile(defaultProfile);
      localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
    }
  };
  
  const initializeBehaviorTracking = () => {
    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-trackable]');
      if (target) {
        const feature = target.getAttribute('data-trackable');
        behaviorTracker.current.clicks[feature] = (behaviorTracker.current.clicks[feature] || 0) + 1;
      }
    });
    
    // Track time spent on sections
    let currentSection = 'dashboard';
    let sectionStartTime = Date.now();
    
    window.addEventListener('workspace-section-change', (e) => {
      const previousSection = currentSection;
      const timeSpent = Date.now() - sectionStartTime;
      
      behaviorTracker.current.timeSpent[previousSection] = 
        (behaviorTracker.current.timeSpent[previousSection] || 0) + timeSpent;
      
      currentSection = e.detail;
      sectionStartTime = Date.now();
    });
    
    // Track feature usage
    window.addEventListener('feature-used', (e) => {
      const feature = e.detail;
      behaviorTracker.current.features[feature] = 
        (behaviorTracker.current.features[feature] || 0) + 1;
    });
    
    // Save behavior data periodically
    setInterval(() => {
      saveBehaviorData();
    }, 60000); // Every minute
  };
  
  const saveBehaviorData = () => {
    const data = {
      ...behaviorTracker.current,
      lastSaved: Date.now()
    };
    localStorage.setItem('userBehavior', JSON.stringify(data));
  };
  
  const startAIAnalysis = () => {
    // Analyze user behavior and generate recommendations
    setInterval(() => {
      analyzeAndRecommend();
    }, 300000); // Every 5 minutes
    
    // Initial analysis
    setTimeout(analyzeAndRecommend, 5000);
  };
  
  const analyzeAndRecommend = () => {
    const behavior = behaviorTracker.current;
    const newRecommendations = [];
    
    // Analyze most clicked features
    const sortedClicks = Object.entries(behavior.clicks)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    if (sortedClicks.length > 0) {
      const [topFeature] = sortedClicks[0];
      newRecommendations.push({
        id: 'rec-' + Date.now(),
        type: 'feature',
        title: 'Оптимизация рабочего процесса',
        description: `Вы часто используете ${getFeatureName(topFeature)}. Попробуйте горячие клавиши для быстрого доступа.`,
        action: 'show-shortcuts',
        priority: 'medium'
      });
    }
    
    // Analyze time patterns
    const totalTime = Object.values(behavior.timeSpent).reduce((a, b) => a + b, 0);
    const analyticsTime = behavior.timeSpent.analytics || 0;
    
    if (analyticsTime > totalTime * 0.4) {
      newRecommendations.push({
        id: 'rec-' + Date.now() + 1,
        type: 'insight',
        title: 'Фокус на аналитике',
        description: 'Вы проводите много времени в аналитике. Настройте автоматические отчеты для экономии времени.',
        action: 'setup-reports',
        priority: 'high'
      });
    }
    
    // Check for anomalies
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour <= 6) {
      newRecommendations.push({
        id: 'rec-' + Date.now() + 2,
        type: 'wellbeing',
        title: 'Поздняя работа',
        description: 'Вы работаете в позднее время. Не забывайте об отдыхе для поддержания продуктивности.',
        action: 'schedule-reminder',
        priority: 'low'
      });
    }
    
    // Update recommendations
    setRecommendations(newRecommendations);
    updateAIRecommendationsUI(newRecommendations);
  };
  
  const getFeatureName = (feature) => {
    const featureNames = {
      'new-task': 'создание задач',
      'analytics': 'аналитику',
      'reports': 'отчеты',
      'ai-chat': 'AI-ассистента'
    };
    return featureNames[feature] || feature;
  };
  
  const updateAIRecommendationsUI = (recommendations) => {
    const aiRecContainer = document.querySelector('.ai-recommendations');
    if (!aiRecContainer) return;
    
    aiRecContainer.innerHTML = recommendations.map(rec => `
      <div class="ai-rec-item" data-rec-id="${rec.id}">
        <svg class="ai-rec-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z"/>
        </svg>
        <div class="ai-rec-content">
          <div class="ai-rec-title">${rec.title}</div>
          <div class="ai-rec-desc">${rec.description}</div>
        </div>
      </div>
    `).join('');
  };
  
  const handleAICommand = async (e) => {
    const { command, params } = e.detail;
    
    switch (command) {
      case 'analyze-data':
        await analyzeDataPattern(params);
        break;
      case 'suggest-optimization':
        suggestOptimization(params);
        break;
      case 'predict-trend':
        predictTrend(params);
        break;
      case 'chat':
        handleAIChat(params);
        break;
    }
  };
  
  const analyzeDataPattern = async (params) => {
    // Simulate AI data analysis
    const analysis = {
      patterns: [
        'Обнаружен рост конверсии в вечернее время',
        'Сегмент VIP-клиентов показывает увеличение активности',
        'Эффективность email-кампаний выросла на 23%'
      ],
      anomalies: [
        'Необычное снижение трафика из социальных сетей',
        'Повышенный отток в сегменте новых пользователей'
      ],
      recommendations: [
        'Увеличить бюджет на вечернюю рекламу',
        'Запустить retention-кампанию для новых пользователей'
      ]
    };
    
    // Display results
    window.dispatchEvent(new CustomEvent('ai-analysis-complete', { detail: analysis }));
  };
  
  const suggestOptimization = (params) => {
    const optimizations = {
      dashboard: [
        'Переместите виджет "Конверсия" выше для быстрого доступа',
        'Добавьте график трендов для отслеживания динамики'
      ],
      workflow: [
        'Автоматизируйте создание еженедельных отчетов',
        'Настройте уведомления о критических изменениях KPI'
      ],
      performance: [
        'Включите кэширование данных для ускорения загрузки',
        'Оптимизируйте частоту обновления виджетов'
      ]
    };
    
    const category = params.category || 'workflow';
    const suggestions = optimizations[category] || optimizations.workflow;
    
    window.dispatchEvent(new CustomEvent('ai-suggestions', { detail: suggestions }));
  };
  
  const predictTrend = (params) => {
    // Simple trend prediction based on historical data
    const metric = params.metric || 'revenue';
    const period = params.period || 30;
    
    // Generate prediction
    const prediction = {
      metric,
      current: 100,
      predicted: 115,
      confidence: 0.82,
      factors: [
        'Сезонный рост',
        'Успешная маркетинговая кампания',
        'Улучшение конверсии'
      ]
    };
    
    window.dispatchEvent(new CustomEvent('ai-prediction', { detail: prediction }));
  };
  
  const handleAIChat = (params) => {
    const { message } = params;
    
    // Simple AI responses
    const responses = {
      'привет': 'Здравствуйте! Как я могу помочь вам сегодня?',
      'помощь': 'Я могу помочь с анализом данных, оптимизацией процессов и ответами на вопросы о платформе.',
      'отчет': 'Какой отчет вы хотели бы создать? Я могу помочь с продажами, аналитикой или пользовательской активностью.',
      'default': 'Я анализирую ваш запрос. Могу я уточнить, что именно вас интересует?'
    };
    
    const keyword = Object.keys(responses).find(k => 
      message.toLowerCase().includes(k)
    );
    
    const response = responses[keyword] || responses.default;
    
    // Add AI insights based on current data
    const insights = [];
    if (message.includes('продаж') || message.includes('выручк')) {
      insights.push('Продажи показывают рост на 12% по сравнению с прошлым месяцем.');
    }
    if (message.includes('клиент')) {
      insights.push('Активность клиентов увеличилась на 8% за последнюю неделю.');
    }
    
    window.dispatchEvent(new CustomEvent('ai-response', { 
      detail: { 
        message: response,
        insights,
        timestamp: Date.now()
      }
    }));
  };
  
  // Adaptive UI based on usage
  useEffect(() => {
    if (!userProfile) return;
    
    // Adjust dashboard based on role
    const roleConfigs = {
      analyst: {
        priorityWidgets: ['analytics', 'reports', 'trends'],
        theme: 'dark'
      },
      manager: {
        priorityWidgets: ['kpi', 'team', 'tasks'],
        theme: 'dark'
      },
      executive: {
        priorityWidgets: ['revenue', 'summary', 'alerts'],
        theme: 'light'
      }
    };
    
    const config = roleConfigs[userProfile.role] || roleConfigs.analyst;
    
    // Apply configuration
    if (config.theme !== userProfile.preferences.theme) {
      document.body.classList.toggle('light-theme', config.theme === 'light');
    }
    
    // Reorder widgets based on priority
    // This would be implemented with the widget system
  }, [userProfile]);
  
  return null; // This component manages AI personalization, no UI
}