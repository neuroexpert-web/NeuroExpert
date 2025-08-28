'use client';

import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TrafficChart({ darkMode = true }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Уничтожаем предыдущий график если есть
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Создаем новый график
      chartInstance.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            'Google/Яндекс', 
            'Соцсети', 
            'Прямые', 
            'Email', 
            'Реклама', 
            'Партнёры'
          ],
          datasets: [{
            data: [35, 25, 18, 12, 7, 3],
            backgroundColor: [
              '#8b5cf6',
              '#ec4899',
              '#06b6d4',
              '#10b981',
              '#f59e0b',
              '#ef4444'
            ],
            borderWidth: 2,
            borderColor: '#1a1a2e',
            hoverOffset: 15
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
              enabled: true,
              backgroundColor: 'rgba(26, 26, 46, 0.95)',
              titleColor: '#fff',
              bodyColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'rgba(139, 92, 246, 0.3)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = 42300;
                  const visitors = Math.round(total * value / 100);
                  return `${label}: ${value}% (${visitors.toLocaleString('ru-RU')} чел.)`;
                }
              }
            }
          },
          cutout: '65%',
          rotation: -90
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [darkMode]);

  const sources = [
    { name: 'Google/Яндекс', value: 35, color: '#8b5cf6', icon: '🔍' },
    { name: 'Соцсети', value: 25, color: '#ec4899', icon: '📱' },
    { name: 'Прямые', value: 18, color: '#06b6d4', icon: '🔗' },
    { name: 'Email', value: 12, color: '#10b981', icon: '📧' },
    { name: 'Реклама', value: 7, color: '#f59e0b', icon: '💰' },
    { name: 'Партнёры', value: 3, color: '#ef4444', icon: '🤝' }
  ];

  return (
    <div className="traffic-chart-container">
      <div className="chart-area">
        <div className="chart-canvas-wrapper">
          <canvas ref={chartRef} />
          <div className="chart-center-text">
            <div className="center-value">42.3K</div>
            <div className="center-label">Визитов</div>
          </div>
        </div>
      </div>
      
      <div className="traffic-legend-grid">
        {sources.map((source, index) => (
          <div key={index} className="traffic-legend-item">
            <div className="legend-color-dot" style={{backgroundColor: source.color}}></div>
            <div className="legend-info">
              <div className="legend-name">
                <span className="legend-icon">{source.icon}</span>
                {source.name}
              </div>
              <div className="legend-stats">
                <span className="legend-percent">{source.value}%</span>
                <span className="legend-visitors">
                  {Math.round(42300 * source.value / 100).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}