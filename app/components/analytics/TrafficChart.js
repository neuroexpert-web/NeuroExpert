'use client';

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TrafficChart({ darkMode = true }) {
  const [chartData, setChartData] = useState(null);

  // Данные источников трафика
  const trafficSources = [
    {
      name: 'Google/Яндекс (SEO)',
      shortName: 'SEO',
      value: 35,
      color: '#8b5cf6',
      icon: '🔍',
      details: 'Органический поиск'
    },
    {
      name: 'Instagram/VK/TG',
      shortName: 'Соцсети',
      value: 25,
      color: '#d946ef',
      icon: '📱',
      details: 'Социальные сети'
    },
    {
      name: 'Прямые заходы',
      shortName: 'Прямые',
      value: 18,
      color: '#a855f7',
      icon: '🔗',
      details: 'Знают ваш сайт'
    },
    {
      name: 'Email рассылки',
      shortName: 'Email',
      value: 12,
      color: '#9333ea',
      icon: '📧',
      details: 'Подписчики'
    },
    {
      name: 'Яндекс.Директ/Google Ads',
      shortName: 'Реклама',
      value: 7,
      color: '#7e22ce',
      icon: '💰',
      details: 'Платный трафик'
    },
    {
      name: 'Партнёрские ссылки',
      shortName: 'Партнёры',
      value: 3,
      color: '#6b21a8',
      icon: '🤝',
      details: 'Реферальный трафик'
    }
  ];

  useEffect(() => {
    const data = {
      labels: trafficSources.map(s => s.name),
      datasets: [
        {
          data: trafficSources.map(s => s.value),
          backgroundColor: trafficSources.map(s => s.color),
          borderColor: darkMode ? '#1a1a2e' : '#ffffff',
          borderWidth: 2,
          hoverOffset: 10,
          hoverBorderWidth: 3,
          hoverBorderColor: '#ffffff',
        }
      ]
    };

    setChartData(data);
  }, [darkMode]);

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
        padding: 16,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const source = trafficSources[index];
            const totalVisitors = 42300;
            const visitors = Math.round(totalVisitors * source.value / 100);
            
            return [
              `${source.icon} ${source.name}`,
              `📊 ${source.value}% от общего трафика`,
              `👥 ${visitors.toLocaleString('ru-RU')} посетителей`,
              `💡 ${source.details}`
            ];
          },
          labelColor: function(context) {
            const index = context.dataIndex;
            const source = trafficSources[index];
            return {
              borderColor: source.color,
              backgroundColor: source.color,
              borderWidth: 2,
              borderRadius: 4
            };
          },
          title: function() {
            return 'Источник трафика';
          }
        }
      }
    },
    cutout: '70%',
    rotation: -90,
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 1000
    }
  };

  const totalVisitors = 42300;

  if (!chartData) return <div className="chart-loading">Загрузка данных...</div>;

  return (
    <div className="traffic-chart-container">
      <div className="chart-with-center">
        <Doughnut options={options} data={chartData} />
        <div className="chart-center-info">
          <div className="total-number">{(totalVisitors / 1000).toFixed(1)}K</div>
          <div className="total-label">Всего визитов</div>
          <div className="total-period">за 30 дней</div>
        </div>
      </div>
      
      <div className="traffic-sources-grid">
        {trafficSources.map((source, index) => (
          <div key={index} className="traffic-source-card">
            <div className="source-header">
              <span className="source-icon">{source.icon}</span>
              <div className="source-color-bar" style={{backgroundColor: source.color}}></div>
            </div>
            <div className="source-name">{source.shortName}</div>
            <div className="source-value">{source.value}%</div>
            <div className="source-visitors">
              {Math.round(totalVisitors * source.value / 100).toLocaleString('ru-RU')}
            </div>
            <div className="source-details">{source.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}