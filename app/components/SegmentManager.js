'use client';

import { useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function SegmentManager() {
  useEffect(() => {
    // Инициализация графика демографии
    const initDemographicsChart = (canvasId, segmentType) => {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      
      // Данные для разных сегментов
      const chartData = {
        loyal: {
          labels: ['25-34 лет', '35-44 лет', '45+ лет'],
          data: [45, 30, 25],
          backgroundColor: ['#8b5cf6', '#ec4899', '#3b82f6']
        },
        new: {
          labels: ['18-24 лет', '25-34 лет', '35-44 лет'],
          data: [35, 45, 20],
          backgroundColor: ['#10b981', '#6ee7b7', '#047857']
        },
        vip: {
          labels: ['35-44 лет', '45-54 лет', '55+ лет'],
          data: [40, 35, 25],
          backgroundColor: ['#f59e0b', '#fbbf24', '#f97316']
        },
        'churn-risk': {
          labels: ['18-24 лет', '25-34 лет', 'Другие'],
          data: [25, 35, 40],
          backgroundColor: ['#ef4444', '#f87171', '#fca5a5']
        }
      };

      const data = chartData[segmentType] || chartData.loyal;

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.data,
            backgroundColor: data.backgroundColor,
            borderWidth: 0,
            spacing: 2
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
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            animateScale: false,
            duration: 1000
          }
        }
      });
    };

    // Инициализация графика для активного сегмента
    const activeSegment = document.querySelector('.segment-item.active');
    if (activeSegment) {
      const segmentType = activeSegment.getAttribute('data-segment') || 'loyal';
      initDemographicsChart('loyalDemographicsChart', segmentType);
    }

    // Обработчик переключения сегментов
    const handleSegmentClick = (e) => {
      const segmentItem = e.currentTarget;
      const segmentType = segmentItem.getAttribute('data-segment');
      
      if (!segmentType) return;

      // Анимация переключения контента
      const allContents = document.querySelectorAll('.segment-content');
      allContents.forEach(content => {
        content.style.opacity = '0';
        setTimeout(() => {
          content.style.opacity = '1';
        }, 300);
      });

      // Обновление графика
      setTimeout(() => {
        const canvas = document.getElementById('loyalDemographicsChart');
        if (canvas) {
          const chart = Chart.getChart(canvas);
          if (chart) {
            chart.destroy();
          }
          initDemographicsChart('loyalDemographicsChart', segmentType);
        }
      }, 350);
    };

    // Добавляем обработчики на все сегменты
    const segmentItems = document.querySelectorAll('.segment-item[data-segment]');
    segmentItems.forEach(item => {
      item.addEventListener('click', handleSegmentClick);
    });

    // Обработка клавиатурной навигации
    const handleKeyNavigation = (e) => {
      const current = document.activeElement;
      if (!current.classList.contains('segment-item')) return;

      let next;
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          next = current.nextElementSibling;
          if (next && next.classList.contains('segment-item')) {
            next.focus();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          next = current.previousElementSibling;
          if (next && next.classList.contains('segment-item')) {
            next.focus();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyNavigation);

    // Симуляция загрузки данных
    const simulateDataLoading = () => {
      const segments = document.querySelectorAll('.segment-content');
      segments.forEach(segment => {
        const loader = document.createElement('div');
        loader.className = 'segment-loading';
        loader.textContent = 'Загрузка данных...';
        
        // Показываем загрузчик на короткое время
        segment.insertBefore(loader, segment.firstChild);
        
        setTimeout(() => {
          loader.remove();
        }, 800);
      });
    };

    // Анимация чисел при загрузке
    const animateNumbers = () => {
      const numbers = document.querySelectorAll('.stat-card h4, .ltv-value');
      numbers.forEach(el => {
        const finalText = el.textContent;
        const hasSymbol = finalText.includes('₽') || finalText.includes('%');
        const numericPart = parseFloat(finalText.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(numericPart)) {
          let current = 0;
          const increment = numericPart / 30;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericPart) {
              current = numericPart;
              clearInterval(timer);
              el.textContent = finalText;
            } else {
              if (hasSymbol) {
                if (finalText.includes('₽')) {
                  el.textContent = `₽ ${current.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
                } else if (finalText.includes('%')) {
                  el.textContent = `${current.toFixed(1)}%`;
                }
              } else {
                el.textContent = current.toFixed(0);
              }
            }
          }, 50);
        }
      });
    };

    // Запускаем анимации при загрузке
    setTimeout(() => {
      animateNumbers();
    }, 500);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyNavigation);
      // Удаляем все графики
      const charts = document.querySelectorAll('canvas');
      charts.forEach(canvas => {
        const chart = Chart.getChart(canvas);
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, []);

  return null;
}