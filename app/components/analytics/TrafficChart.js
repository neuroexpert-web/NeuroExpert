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

  useEffect(() => {
    const data = {
      labels: [
        'Google/Яндекс (SEO)', 
        'Instagram/VK/TG', 
        'Прямые заходы', 
        'Email рассылки', 
        'Яндекс.Директ/Google Ads', 
        'Партнёрские ссылки'
      ],
      datasets: [
        {
          data: [35, 25, 18, 12, 7, 3],
          backgroundColor: [
            'rgba(139, 92, 246, 0.9)',
            'rgba(217, 70, 239, 0.9)',
            'rgba(168, 85, 247, 0.9)',
            'rgba(147, 51, 234, 0.9)',
            'rgba(126, 34, 206, 0.9)',
            'rgba(107, 33, 168, 0.9)',
          ],
          borderColor: darkMode ? '#1a1a2e' : '#fff',
          borderWidth: 3,
          hoverOffset: 15,
          hoverBorderWidth: 4,
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
        display: false // Скрываем стандартную легенду, используем свою
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: darkMode ? '#fff' : '#333',
        bodyColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#666',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            
            const detailsMap = {
              'Google/Яндекс (SEO)': {
                visitors: Math.round(value * 1200),
                conversion: '4.2%',
                avgTime: '3:45',
                trend: '+15%',
                details: 'Основной источник качественного трафика'
              },
              'Instagram/VK/TG': {
                visitors: Math.round(value * 1200),
                conversion: '2.8%',
                avgTime: '2:30',
                trend: '+23%',
                details: 'Высокая вовлечённость, молодая аудитория'
              },
              'Прямые заходы': {
                visitors: Math.round(value * 1200),
                conversion: '6.5%',
                avgTime: '4:20',
                trend: '+5%',
                details: 'Лояльные клиенты, знают бренд'
              },
              'Email рассылки': {
                visitors: Math.round(value * 1200),
                conversion: '8.3%',
                avgTime: '5:15',
                trend: '+12%',
                details: 'Самая высокая конверсия'
              },
              'Яндекс.Директ/Google Ads': {
                visitors: Math.round(value * 1200),
                conversion: '3.7%',
                avgTime: '1:45',
                trend: '-3%',
                details: 'Платный трафик, требует оптимизации'
              },
              'Партнёрские ссылки': {
                visitors: Math.round(value * 1200),
                conversion: '5.1%',
                avgTime: '3:00',
                trend: '+8%',
                details: 'Качественный трафик от партнёров'
              }
            };
            
            const info = detailsMap[label] || {};
            
            return [
              `📍 ${label}`,
              `👥 ${info.visitors?.toLocaleString('ru-RU')} посетителей (${value}%)`,
              `💰 Конверсия: ${info.conversion}`,
              `⏱️ Время на сайте: ${info.avgTime}`,
              `📈 Динамика: ${info.trend}`,
              `💡 ${info.details}`
            ];
          },
          title: function() {
            return 'Детальная информация по источнику:';
          }
        }
      }
    },
    cutout: '65%',
    animation: {
      animateRotate: true,
      animateScale: false,
    },
    layout: {
      padding: 20
    },
    elements: {
      arc: {
        borderWidth: 3,
        borderRadius: 5
      }
    }
  };

  if (!chartData) return <div className="chart-loading">Загрузка данных...</div>;

  return (
    <div className="chart-container" style={{ height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <Doughnut options={options} data={chartData} />
        <div className="chart-center-text">
          <div className="total-visits">42.3K</div>
          <div className="visits-label">Визитов</div>
        </div>
      </div>
      
      {/* Цветные индикаторы источников */}
      <div className="traffic-legend">
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgb(139, 92, 246)'}}></span>
          <span className="legend-label">Google/Яндекс</span>
          <span className="legend-value">35%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgb(217, 70, 239)'}}></span>
          <span className="legend-label">Соцсети</span>
          <span className="legend-value">25%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgb(168, 85, 247)'}}></span>
          <span className="legend-label">Прямые</span>
          <span className="legend-value">18%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgb(147, 51, 234)'}}></span>
          <span className="legend-label">Email</span>
          <span className="legend-value">12%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgb(126, 34, 206)'}}></span>
          <span className="legend-label">Реклама</span>
          <span className="legend-value">7%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgb(107, 33, 168)'}}></span>
          <span className="legend-label">Партнёры</span>
          <span className="legend-value">3%</span>
        </div>
      </div>
    </div>
  );
}