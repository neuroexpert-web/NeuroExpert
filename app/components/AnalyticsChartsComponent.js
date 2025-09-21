'use client';

import { useEffect } from 'react';

export default function AnalyticsCharts() {
  useEffect(() => {
    // Динамически загружаем Chart.js только на клиенте
    const loadCharts = async () => {
      const Chart = (await import('chart.js/auto')).default;
      
      // Глобальные настройки Chart.js
      Chart.defaults.color = 'rgba(255, 255, 255, 0.8)';
      Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
      Chart.defaults.font.family = 'Inter, sans-serif';
      
      // График динамики выручки
      const revenueCtx = document.getElementById('revenueChart');
      if (revenueCtx) {
        new Chart(revenueCtx, {
          type: 'line',
          data: {
            labels: Array.from({length: 30}, (_, i) => `День ${i + 1}`),
            datasets: [{
              label: 'Выручка (тыс. ₽)',
              data: Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 200),
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 5,
              borderWidth: 2
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
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                  size: 14
                },
                bodyFont: {
                  size: 16,
                  weight: 'bold'
                }
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 7
                }
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                  callback: function(value) {
                    return value + 'k';
                  }
                }
              }
            }
          }
        });
      }
      
      // График источников трафика
      const trafficCtx = document.getElementById('trafficChart');
      if (trafficCtx) {
        new Chart(trafficCtx, {
          type: 'doughnut',
          data: {
            labels: ['Органический', 'Платный', 'Социальные', 'Email', 'Прямой'],
            datasets: [{
              data: [35, 25, 20, 15, 5],
              backgroundColor: [
                '#8b5cf6',
                '#6366f1',
                '#3b82f6',
                '#06b6d4',
                '#10b981'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                  label: function(context) {
                    return context.label + ': ' + context.parsed + '%';
                  }
                }
              }
            }
          }
        });
      }
      
      // График воронки продаж
      const funnelCtx = document.getElementById('funnelChart');
      if (funnelCtx) {
        new Chart(funnelCtx, {
          type: 'bar',
          data: {
            labels: ['Посетители', 'Лиды', 'Квалифицированные', 'Предложения', 'Сделки'],
            datasets: [{
              label: 'Количество',
              data: [1000, 450, 200, 80, 30],
              backgroundColor: 'rgba(139, 92, 246, 0.8)',
              borderWidth: 0,
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)'
                }
              },
              y: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
      
      // Мини-графики sparklines для KPI
      const createSparkline = (elementId, data, color) => {
        const element = document.getElementById(elementId);
        if (element) {
          const canvas = document.createElement('canvas');
          element.appendChild(canvas);
          
          new Chart(canvas, {
            type: 'line',
            data: {
              labels: Array.from({length: 7}, (_, i) => i),
              datasets: [{
                data: data,
                borderColor: color,
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 0
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
        }
      };
      
      // Создаем sparklines
      createSparkline('revenue-sparkline', [100, 120, 115, 130, 125, 140, 138], '#8b5cf6');
      createSparkline('clients-sparkline', [10, 12, 15, 14, 18, 20, 22], '#10b981');
      createSparkline('satisfaction-sparkline', [4.9, 4.85, 4.8, 4.9, 4.85, 4.8, 4.85], '#f59e0b');
      createSparkline('conversion-sparkline', [2.8, 2.9, 3.0, 2.95, 3.1, 3.05, 3.13], '#3b82f6');
    };
    
    // Загружаем графики с небольшой задержкой для плавности
    const timer = setTimeout(loadCharts, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}