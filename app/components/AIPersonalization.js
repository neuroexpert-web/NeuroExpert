'use client';

import { useEffect, useState } from 'react';

export default function AIPersonalization() {
  const [userProfile, setUserProfile] = useState({
    role: 'manager',
    preferences: {},
    behavior: []
  });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Загрузка профиля пользователя
    loadUserProfile();
    
    // Отслеживание поведения
    trackUserBehavior();
    
    // Персонализация интерфейса
    personalizeInterface();
    
    // Обновление рекомендаций каждые 10 секунд
    const interval = setInterval(updateRecommendations, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUserProfile = () => {
    // Загрузка сохраненного профиля
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  };

  const trackUserBehavior = () => {
    // Отслеживание кликов
    document.addEventListener('click', (e) => {
      const target = e.target;
      const action = {
        type: 'click',
        element: target.className,
        timestamp: Date.now()
      };
      
      setUserProfile(prev => ({
        ...prev,
        behavior: [...prev.behavior.slice(-99), action]
      }));
    });
    
    // Отслеживание времени на виджетах
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
      let startTime;
      
      widget.addEventListener('mouseenter', () => {
        startTime = Date.now();
      });
      
      widget.addEventListener('mouseleave', () => {
        if (startTime) {
          const duration = Date.now() - startTime;
          const widgetType = widget.querySelector('.widget-title')?.textContent;
          
          if (duration > 2000) { // Более 2 секунд
            updateWidgetPriority(widgetType, duration);
          }
        }
      });
    });
  };

  const updateWidgetPriority = (widgetType, duration) => {
    setUserProfile(prev => {
      const preferences = { ...prev.preferences };
      preferences[widgetType] = (preferences[widgetType] || 0) + duration;
      
      // Сохранение обновленного профиля
      const updatedProfile = { ...prev, preferences };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      return updatedProfile;
    });
  };

  const personalizeInterface = () => {
    // Персонализация на основе роли
    const roleBasedLayouts = {
      manager: ['kpi', 'team', 'tasks', 'analytics'],
      analyst: ['analytics', 'reports', 'data', 'insights'],
      admin: ['system', 'users', 'settings', 'logs']
    };
    
    // Перестановка виджетов на основе предпочтений
    setTimeout(() => {
      const dashboard = document.querySelector('.dashboard-grid');
      if (!dashboard) return;
      
      const widgets = Array.from(dashboard.querySelectorAll('.widget'));
      const sortedWidgets = widgets.sort((a, b) => {
        const aTitle = a.querySelector('.widget-title')?.textContent || '';
        const bTitle = b.querySelector('.widget-title')?.textContent || '';
        const aScore = userProfile.preferences[aTitle] || 0;
        const bScore = userProfile.preferences[bTitle] || 0;
        return bScore - aScore;
      });
      
      // Перестановка виджетов
      sortedWidgets.forEach(widget => dashboard.appendChild(widget));
    }, 1000);
  };

  const updateRecommendations = () => {
    // Анализ поведения и генерация рекомендаций
    const behaviorPatterns = analyzeBehavior();
    const newRecommendations = generateRecommendations(behaviorPatterns);
    
    setRecommendations(newRecommendations);
    
    // Обновление UI
    displayRecommendations(newRecommendations);
  };

  const analyzeBehavior = () => {
    const recentActions = userProfile.behavior.slice(-50);
    const patterns = {
      mostClickedElements: {},
      timeOfDay: new Date().getHours(),
      sessionDuration: Date.now() - (recentActions[0]?.timestamp || Date.now())
    };
    
    recentActions.forEach(action => {
      if (action.type === 'click') {
        patterns.mostClickedElements[action.element] = 
          (patterns.mostClickedElements[action.element] || 0) + 1;
      }
    });
    
    return patterns;
  };

  const generateRecommendations = (patterns) => {
    const recommendations = [];
    
    // Рекомендации на основе времени дня
    const hour = patterns.timeOfDay;
    if (hour >= 9 && hour <= 11) {
      recommendations.push({
        type: 'productivity',
        title: 'Оптимальное время для аналитики',
        text: 'Согласно вашим паттернам работы, сейчас лучшее время для глубокого анализа данных',
        action: 'Открыть аналитику'
      });
    }
    
    // Рекомендации на основе частых действий
    const mostClicked = Object.entries(patterns.mostClickedElements)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostClicked && mostClicked[1] > 5) {
      recommendations.push({
        type: 'optimization',
        title: 'Часто используемая функция',
        text: `Вы часто используете ${mostClicked[0]}. Хотите добавить быстрый доступ?`,
        action: 'Настроить'
      });
    }
    
    // AI-инсайты
    recommendations.push({
      type: 'insight',
      title: 'AI-прогноз на сегодня',
      text: 'Вероятность успешных сделок сегодня на 23% выше обычного. Рекомендуем активизировать отдел продаж.',
      action: 'Подробнее'
    });
    
    return recommendations;
  };

  const displayRecommendations = (recommendations) => {
    const aiWidget = document.querySelector('.ai-assistant-widget');
    if (!aiWidget) return;
    
    const content = aiWidget.querySelector('.widget-content');
    if (content) {
      content.innerHTML = `
        <div class="ai-personalized-content">
          <div class="ai-greeting">
            ${getPersonalizedGreeting()}
          </div>
          <div class="ai-recommendations-list">
            ${recommendations.map(rec => `
              <div class="ai-recommendation-card" data-type="${rec.type}">
                <div class="ai-rec-icon">${getRecommendationIcon(rec.type)}</div>
                <div class="ai-rec-content">
                  <h4>${rec.title}</h4>
                  <p>${rec.text}</p>
                </div>
                <button class="ai-rec-action">${rec.action}</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      // Добавление обработчиков
      content.querySelectorAll('.ai-rec-action').forEach((btn, index) => {
        btn.addEventListener('click', () => handleRecommendationAction(recommendations[index]));
      });
    }
  };

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const greetings = {
      morning: 'Доброе утро! Готовы к продуктивному дню?',
      day: 'Добрый день! Как проходит ваш рабочий день?',
      evening: 'Добрый вечер! Время подвести итоги дня',
      night: 'Работаете допоздна? Не забудьте отдохнуть!'
    };
    
    if (hour >= 5 && hour < 12) return greetings.morning;
    if (hour >= 12 && hour < 17) return greetings.day;
    if (hour >= 17 && hour < 22) return greetings.evening;
    return greetings.night;
  };

  const getRecommendationIcon = (type) => {
    const icons = {
      productivity: '⚡',
      optimization: '⚙️',
      insight: '💡',
      warning: '⚠️'
    };
    return icons[type] || '📌';
  };

  const handleRecommendationAction = (recommendation) => {
    console.log('Выполнение рекомендации:', recommendation);
    
    // Здесь можно добавить логику выполнения рекомендаций
    switch (recommendation.type) {
      case 'productivity':
        // Открыть раздел аналитики
        document.querySelector('[data-view="analytics"]')?.click();
        break;
      case 'optimization':
        // Открыть настройки
        openSettingsWindow();
        break;
      case 'insight':
        // Показать детальную информацию
        showInsightDetails(recommendation);
        break;
    }
  };

  const openSettingsWindow = () => {
    // Создание окна настроек
    const settingsWindow = document.createElement('div');
    settingsWindow.className = 'floating-window active';
    settingsWindow.style.cssText = 'left: 50%; top: 50%; transform: translate(-50%, -50%);';
    settingsWindow.innerHTML = `
      <div class="window-header">
        <div class="window-title">Настройки персонализации</div>
        <div class="window-controls">
          <div class="window-control window-close"></div>
        </div>
      </div>
      <div class="window-content">
        <h3>Быстрый доступ</h3>
        <p>Настройте виджеты и функции для быстрого доступа</p>
        <!-- Здесь будут настройки -->
      </div>
    `;
    
    document.querySelector('.floating-windows')?.appendChild(settingsWindow);
  };

  const showInsightDetails = (insight) => {
    // Показать модальное окно с деталями
    const modal = document.createElement('div');
    modal.className = 'insight-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>${insight.title}</h2>
        <p>${insight.text}</p>
        <div class="insight-charts">
          <!-- Здесь могут быть графики и дополнительные данные -->
        </div>
        <button class="modal-close">Закрыть</button>
      </div>
    `;
    
    document.body.appendChild(modal);
  };

  return null;
}