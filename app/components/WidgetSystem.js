'use client';

import { useEffect } from 'react';

export default function WidgetSystem() {
  useEffect(() => {
    // Initialize Chart.js charts
    if (typeof Chart !== 'undefined') {
      initializeCharts();
    }
    
    // Simulate real-time updates
    startRealtimeUpdates();
  }, []);

  const initializeCharts = () => {
    // Sales Chart
    const salesCanvas = document.getElementById('salesChart');
    if (salesCanvas) {
      const ctx = salesCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
          datasets: [{
            label: 'Продажи',
            data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#a0a0a0',
                callback: function(value) {
                  return '₽' + value.toLocaleString();
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#a0a0a0'
              }
            }
          }
        }
      });
    }
  };

  const startRealtimeUpdates = () => {
    // Update KPI trends randomly
    setInterval(() => {
      const trends = document.querySelectorAll('.kpi-trend');
      trends.forEach(trend => {
        if (Math.random() > 0.7) {
          const isPositive = Math.random() > 0.5;
          trend.className = `kpi-trend trend-${isPositive ? 'positive' : 'negative'}`;
          const icon = trend.querySelector('.trend-icon');
          if (icon) {
            icon.innerHTML = isPositive ? '↑' : '↓';
          }
        }
      });
    }, 5000);

    // Update activity feed
    const activities = [
      'Новая заявка от клиента',
      'Обновление статуса задачи',
      'Входящий платеж получен',
      'Новый пользователь зарегистрирован',
      'Отчет сформирован'
    ];

    setInterval(() => {
      const activityList = document.querySelector('.activity-list');
      if (activityList && Math.random() > 0.6) {
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.innerHTML = `
          <div class="activity-avatar"></div>
          <div class="activity-content">
            <div class="activity-text">${activities[Math.floor(Math.random() * activities.length)]}</div>
            <div class="activity-time">только что</div>
          </div>
        `;
        
        activityList.insertBefore(newActivity, activityList.firstChild);
        
        // Remove old activities
        while (activityList.children.length > 5) {
          activityList.removeChild(activityList.lastChild);
        }
      }
    }, 8000);
  };

  return null;
}