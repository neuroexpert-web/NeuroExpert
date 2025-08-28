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
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded',
          color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#333',
          font: {
            size: 14,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                const value = data.datasets[0].data[i];
                const visitors = Math.round(value * 1200);

                return {
                  text: [
                    `${label}`,
                    `${value}% • ${visitors.toLocaleString('ru-RU')} чел.`
                  ],
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                  index: i,
                  fontColor: darkMode ? ['white', 'rgba(255,255,255,0.6)'] : ['#333', '#666']
                };
              });
            }
            return [];
          }
        }
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
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: false,
    }
  };

  if (!chartData) return <div className="chart-loading">Загрузка данных...</div>;

  return (
    <div className="chart-container" style={{ height: '100%', position: 'relative' }}>
      <Doughnut options={options} data={chartData} />
      <div className="chart-center-text">
        <div className="total-visits">42.3K</div>
        <div className="visits-label">Визитов</div>
      </div>
    </div>
  );
}