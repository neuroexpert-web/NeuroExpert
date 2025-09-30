'use client';

import { useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function ProcessManager() {
  useEffect(() => {
    // Инициализация графика загрузки ресурсов
    const initResourceChart = () => {
      const canvas = document.getElementById('resourceChart');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Продажи', 'Маркетинг', 'Поддержка', 'Разработка', 'HR'],
          datasets: [{
            label: 'Текущая загрузка',
            data: [78, 92, 65, 88, 45],
            backgroundColor: [
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(20, 184, 166, 0.8)',
              'rgba(249, 115, 22, 0.8)'
            ],
            borderColor: [
              'rgba(139, 92, 246, 1)',
              'rgba(236, 72, 153, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(20, 184, 166, 1)',
              'rgba(249, 115, 22, 1)'
            ],
            borderWidth: 1,
            borderRadius: 8,
            maxBarThickness: 60
          }, {
            label: 'Оптимальная загрузка',
            data: [80, 80, 80, 80, 80],
            type: 'line',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                color: 'rgba(255, 255, 255, 0.8)',
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: 12,
              titleFont: {
                size: 14,
                weight: '600'
              },
              bodyFont: {
                size: 13
              },
              displayColors: true,
              callbacks: {
                label: function(context) {
                  if (context.dataset.label === 'Текущая загрузка') {
                    return context.dataset.label + ': ' + context.parsed.y + '%';
                  }
                  return context.dataset.label + ': ' + context.parsed.y + '%';
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: {
                  size: 12
                }
              }
            },
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: false
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: {
                  size: 12
                },
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
          }
        }
      });
    };

    // Переключение видов графика
    const setupGraphControls = () => {
      const controlBtns = document.querySelectorAll('.control-btn');
      const chartContainer = document.querySelector('.chart-container');
      const departmentLoads = document.querySelector('.department-loads');
      
      controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          controlBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          
          const view = this.getAttribute('data-view');
          if (view === 'chart') {
            chartContainer.style.display = 'block';
            departmentLoads.style.display = 'none';
          } else {
            chartContainer.style.display = 'none';
            departmentLoads.style.display = 'grid';
          }
        });
      });
    };

    // Анимация кнопки обновления
    const setupRefreshButton = () => {
      const refreshBtn = document.querySelector('.refresh-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
          this.style.animation = 'spin 1s ease-in-out';
          
          // Имитация обновления данных
          setTimeout(() => {
            this.style.animation = '';
            
            // Обновляем числа с анимацией
            animateMetrics();
            
            // Показываем уведомление
            showNotification('Данные обновлены');
          }, 1000);
        });
      }
    };

    // Анимация метрик
    const animateMetrics = () => {
      const metrics = document.querySelectorAll('.metric-value');
      metrics.forEach(metric => {
        const text = metric.textContent;
        if (text.includes('%')) {
          const value = parseFloat(text);
          animateNumber(metric, 0, value, '%');
        }
      });
    };

    // Анимация чисел
    const animateNumber = (element, start, end, suffix = '') => {
      const duration = 1000;
      const startTime = performance.now();
      
      const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutQuart(progress);
        element.textContent = Math.floor(current) + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          element.textContent = end + suffix;
        }
      };
      
      requestAnimationFrame(updateNumber);
    };

    const easeOutQuart = (t) => {
      return 1 - Math.pow(1 - t, 4);
    };

    // Фильтрация задач
    const setupTaskFilters = () => {
      const filterBtns = document.querySelectorAll('.task-filters .filter-btn');
      const taskItems = document.querySelectorAll('.task-item');
      
      filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          filterBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          
          const filter = this.getAttribute('data-filter');
          
          taskItems.forEach(task => {
            if (filter === 'all') {
              task.style.display = 'flex';
            } else if (filter === 'high') {
              task.style.display = task.classList.contains('high-priority') ? 'flex' : 'none';
            } else if (filter === 'today') {
              // Здесь можно добавить логику для фильтрации по дате
              task.style.display = 'flex';
            }
          });
        });
      });
    };

    // Интерактивность задач
    const setupTaskInteractions = () => {
      const taskItems = document.querySelectorAll('.task-item');
      
      taskItems.forEach(task => {
        task.addEventListener('click', function() {
          // Анимация выбора
          this.style.transform = 'scale(0.98)';
          setTimeout(() => {
            this.style.transform = '';
          }, 100);
          
          // Здесь можно добавить открытие детальной информации о задаче
        });
      });
    };

    // Уведомления
    const showNotification = (message) => {
      const notification = document.createElement('div');
      notification.className = 'process-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(139, 92, 246, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-size: 0.875rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
        z-index: 1000;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    };

    // Добавляем стили для анимаций
    const addAnimationStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    setTimeout(() => {
      initResourceChart();
      setupGraphControls();
      setupRefreshButton();
      setupTaskFilters();
      setupTaskInteractions();
      animateMetrics();
      addAnimationStyles();
    }, 500);

    // Cleanup
    return () => {
      const canvas = document.getElementById('resourceChart');
      if (canvas) {
        const chart = Chart.getChart(canvas);
        if (chart) {
          chart.destroy();
        }
      }
    };
  }, []);

  return null;
}