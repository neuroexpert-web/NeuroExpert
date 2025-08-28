'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function FunnelChart({ darkMode = true }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const data = {
      labels: ['Посетители', 'Регистрации', 'Добавили в корзину', 'Оформили заказ', 'Оплатили'],
      datasets: [
        {
          label: 'Количество пользователей',
          data: [10000, 4500, 2200, 1100, 850],
          backgroundColor: [
            'rgba(139, 92, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(126, 34, 206, 0.8)',
            'rgba(107, 33, 168, 0.8)',
          ],
          borderColor: [
            'rgb(139, 92, 246)',
            'rgb(168, 85, 247)',
            'rgb(147, 51, 234)',
            'rgb(126, 34, 206)',
            'rgb(107, 33, 168)',
          ],
          borderWidth: 1,
          borderRadius: 10,
          barPercentage: 0.8,
        }
      ]
    };

    setChartData(data);
  }, [darkMode]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
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
            const value = context.parsed.x;
            const label = context.label;
            const index = context.dataIndex;
            const previousValue = index > 0 ? context.dataset.data[index - 1] : value;
            const conversionRate = index > 0 ? ((value / previousValue) * 100).toFixed(1) : 100;
            
            return [
              `${label}: ${value.toLocaleString('ru-RU')} чел.`,
              index > 0 ? `Конверсия: ${conversionRate}%` : ''
            ].filter(Boolean);
          },
          afterLabel: function(context) {
            const index = context.dataIndex;
            const recommendations = [
              'Базовый трафик',
              'Упростите форму регистрации',
              'Добавьте напоминания о корзине',
              'Оптимизируйте checkout процесс',
              'Предложите альтернативные способы оплаты'
            ];
            return `💡 ${recommendations[index]}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.6)' : '#666',
          font: {
            size: 12,
          },
          callback: function(value) {
            return value.toLocaleString('ru-RU');
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#333',
          font: {
            size: 13,
            weight: '500',
          }
        }
      }
    }
  };

  if (!chartData) return <div className="chart-loading">Загрузка данных...</div>;

  return (
    <div className="chart-container" style={{ height: '100%', position: 'relative' }}>
      <Bar options={options} data={chartData} />
      <div className="funnel-stats">
        <div className="stat-item">
          <span className="stat-label">Общая конверсия:</span>
          <span className="stat-value">8.5%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Потенциал роста:</span>
          <span className="stat-value success">+2.3%</span>
        </div>
      </div>
    </div>
  );
}