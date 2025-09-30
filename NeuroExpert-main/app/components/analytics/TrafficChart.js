'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController
} from 'chart.js';

// Регистрируем необходимые компоненты
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

export default function TrafficChart({ darkMode = true }) {
  // Данные источников трафика с разными цветами
  const trafficData = [
    { name: 'SEO', fullName: 'Google/Яндекс (SEO)', value: 35, color: '#8b5cf6', icon: '🔍' },
    { name: 'Соцсети', fullName: 'Instagram/VK/TG', value: 25, color: '#ec4899', icon: '📱' },
    { name: 'Прямые', fullName: 'Прямые заходы', value: 18, color: '#06b6d4', icon: '🔗' },
    { name: 'Email', fullName: 'Email рассылки', value: 12, color: '#10b981', icon: '📧' },
    { name: 'Реклама', fullName: 'Яндекс.Директ/Google Ads', value: 7, color: '#f59e0b', icon: '💰' },
    { name: 'Партнёры', fullName: 'Партнёрские ссылки', value: 3, color: '#ef4444', icon: '🤝' }
  ];

  const data = {
    labels: trafficData.map(item => item.fullName),
    datasets: [
      {
        data: trafficData.map(item => item.value),
        backgroundColor: trafficData.map(item => item.color),
        borderColor: darkMode ? '#1a1a2e' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: darkMode ? '#fff' : '#333',
        bodyColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#666',
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
    rotation: -90,
    animation: {
      animateRotate: true,
      duration: 1000
    }
  };

  const totalVisitors = 42300;

  return (
    <div className="traffic-chart-container">
      <div className="chart-area">
        <div className="chart-canvas-wrapper">
          <Doughnut data={data} options={options} />
          <div className="chart-center-text">
            <div className="center-value">{(totalVisitors / 1000).toFixed(1)}K</div>
            <div className="center-label">Визитов</div>
          </div>
        </div>
      </div>
      
      <div className="traffic-legend-grid">
        {trafficData.map((source, index) => (
          <div key={index} className="traffic-legend-item">
            <div 
              className="legend-color-dot" 
              style={{backgroundColor: source.color}}
            ></div>
            <div className="legend-info">
              <div className="legend-name" title={source.fullName}>
                <span className="legend-icon">{source.icon}</span>
                <span>{source.name}</span>
              </div>
              <div className="legend-stats">
                <span className="legend-percent">{source.value}%</span>
                <span className="legend-visitors">
                  {(totalVisitors * source.value / 100 / 1000).toFixed(1)}K
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}