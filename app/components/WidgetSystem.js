'use client';

import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

export default function WidgetSystem() {
  const [widgets, setWidgets] = useState([]);
  const [charts, setCharts] = useState({});

  useEffect(() => {
    // Инициализация виджетов
    initializeWidgets();
    
    // Обновление данных каждые 5 секунд
    const updateInterval = setInterval(updateWidgetData, 5000);
    
    return () => {
      clearInterval(updateInterval);
      // Очистка графиков
      Object.values(charts).forEach(chart => chart.destroy());
    };
  }, []);

  const initializeWidgets = () => {
    // KPI виджеты
    animateKPIValues();
    
    // График продаж
    initSalesChart();
    
    // Спарклайны
    initSparklines();
    
    // Активность команды
    loadTeamActivity();
    
    // AI рекомендации
    loadAIRecommendations();
  };

  const animateKPIValues = () => {
    const kpiWidgets = document.querySelectorAll('.kpi-widget');
    
    kpiWidgets.forEach(widget => {
      const valueElement = widget.querySelector('.kpi-value');
      if (valueElement) {
        const finalValue = valueElement.textContent;
        const isRevenue = finalValue.includes('₽');
        const numericValue = parseFloat(finalValue.replace(/[^0-9.-]/g, ''));
        
        // Анимация от 0 до финального значения
        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
          }
          
          if (isRevenue) {
            valueElement.textContent = `₽ ${currentValue.toFixed(1)}K`;
          } else if (finalValue.includes('%')) {
            valueElement.textContent = `${currentValue.toFixed(1)}%`;
          } else {
            valueElement.textContent = Math.round(currentValue).toString();
          }
        }, 20);
      }
    });
  };

  const initSalesChart = () => {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: generateTimeLabels(30),
        datasets: [{
          label: 'Продажи',
          data: generateSalesData(30),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#8b5cf6',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)',
              callback: function(value) {
                return '₽' + value + 'K';
              }
            }
          }
        }
      }
    });

    setCharts(prev => ({ ...prev, sales: chart }));
  };

  const initSparklines = () => {
    const sparklines = document.querySelectorAll('.kpi-sparkline');
    
    sparklines.forEach((sparkline, index) => {
      const canvas = document.createElement('canvas');
      sparkline.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      const sparkChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array(20).fill(''),
          datasets: [{
            data: generateSparklineData(),
            borderColor: index % 2 === 0 ? '#10b981' : '#f59e0b',
            borderWidth: 2,
            pointRadius: 0,
            fill: false
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

  const loadTeamActivity = () => {
    const activities = [
      { user: 'АК', name: 'Анна Ким', action: 'завершила задачу "Анализ конкурентов"', time: '5 мин назад' },
      { user: 'ИП', name: 'Иван Петров', action: 'создал новый отчет по продажам', time: '15 мин назад' },
      { user: 'МС', name: 'Мария Соколова', action: 'обновила данные клиента #2451', time: '1 час назад' },
      { user: 'ДН', name: 'Дмитрий Новиков', action: 'запустил email-кампанию', time: '2 часа назад' }
    ];

    const activityList = document.querySelector('.activity-list');
    if (activityList) {
      activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
          <div class="activity-avatar">${activity.user}</div>
          <div class="activity-content">
            <div class="activity-text"><strong>${activity.name}</strong> ${activity.action}</div>
            <div class="activity-time">${activity.time}</div>
          </div>
        </div>
      `).join('');
    }
  };

  const loadAIRecommendations = () => {
    const recommendations = [
      {
        priority: 'Высокий',
        text: 'Обратите внимание на снижение конверсии в сегменте B2B на 15%. Рекомендуется провести A/B тестирование новой посадочной страницы.',
        actions: ['Создать тест', 'Подробнее']
      },
      {
        priority: 'Средний',
        text: 'Оптимальное время для запуска email-кампании: четверг 10:00-11:00. Ожидаемое увеличение открываемости на 23%.',
        actions: ['Запланировать', 'Отклонить']
      }
    ];

    const aiWidget = document.querySelector('.ai-recommendations-widget .widget-content');
    if (aiWidget) {
      aiWidget.innerHTML = recommendations.map(rec => `
        <div class="ai-recommendation-item">
          <div class="ai-priority">${rec.priority}</div>
          <div class="ai-text">${rec.text}</div>
          <div class="ai-actions">
            ${rec.actions.map((action, i) => `
              <button class="ai-action-btn ${i > 0 ? 'secondary' : ''}">${action}</button>
            `).join('')}
          </div>
        </div>
      `).join('');
    }
  };

  const updateWidgetData = () => {
    // Обновление KPI
    const kpiChanges = document.querySelectorAll('.kpi-change');
    kpiChanges.forEach(change => {
      const currentValue = parseFloat(change.textContent);
      const newValue = currentValue + (Math.random() - 0.5) * 0.5;
      change.textContent = `${newValue > 0 ? '+' : ''}${newValue.toFixed(1)}%`;
      change.className = `kpi-change ${newValue > 0 ? 'positive' : 'negative'}`;
    });

    // Обновление графика продаж
    if (charts.sales) {
      const newData = generateSalesData(1);
      charts.sales.data.datasets[0].data.shift();
      charts.sales.data.datasets[0].data.push(newData[0]);
      charts.sales.update('none');
    }
  };

  // Вспомогательные функции
  const generateTimeLabels = (count) => {
    const labels = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      labels.push(date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }));
    }
    return labels;
  };

  const generateSalesData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(Math.round(150 + Math.random() * 100));
    }
    return data;
  };

  const generateSparklineData = () => {
    return Array(20).fill(0).map(() => Math.random() * 100);
  };

  return null;
}