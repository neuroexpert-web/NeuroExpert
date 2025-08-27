'use client';

import { useEffect } from 'react';

export default function AIPersonalization() {
  useEffect(() => {
    personalizeWorkspace();
  }, []);

  const personalizeWorkspace = () => {
    // Get user preferences from localStorage
    const preferences = getUserPreferences();
    
    // Apply personalization
    if (preferences.favoriteWidgets) {
      reorderWidgets(preferences.favoriteWidgets);
    }
    
    // Add AI recommendations based on usage
    generateRecommendations();
  };

  const getUserPreferences = () => {
    const stored = localStorage.getItem('workspace-preferences');
    return stored ? JSON.parse(stored) : {
      favoriteWidgets: ['revenue', 'clients', 'conversion'],
      theme: 'dark',
      notifications: true
    };
  };

  const reorderWidgets = (favoriteIds) => {
    // Reorder dashboard widgets based on preferences
    const grid = document.querySelector('.dashboard-grid');
    if (grid) {
      favoriteIds.forEach((id, index) => {
        const widget = grid.querySelector(`[data-widget-id="${id}"]`);
        if (widget) {
          widget.style.order = index;
        }
      });
    }
  };

  const generateRecommendations = () => {
    const recommendations = [
      {
        title: 'Оптимизация конверсии',
        text: 'Конверсия снизилась на 2%. Рекомендуем провести A/B тестирование главной страницы.'
      },
      {
        title: 'Пиковые часы',
        text: 'Большинство заказов приходит с 14:00 до 16:00. Увеличьте рекламный бюджет в это время.'
      },
      {
        title: 'Новый сегмент',
        text: 'Обнаружен растущий сегмент молодых предпринимателей. Создайте для них специальное предложение.'
      }
    ];

    const recContainer = document.querySelector('.ai-recommendations-list');
    if (recContainer) {
      // Add random recommendation
      const rec = recommendations[Math.floor(Math.random() * recommendations.length)];
      const existingRecs = recContainer.querySelectorAll('.ai-rec-item');
      if (existingRecs.length < 3) {
        const newRec = document.createElement('div');
        newRec.className = 'ai-rec-item';
        newRec.innerHTML = `
          <div class="ai-rec-title">${rec.title}</div>
          <div class="ai-rec-text">${rec.text}</div>
        `;
        recContainer.appendChild(newRec);
      }
    }
  };

  return null;
}