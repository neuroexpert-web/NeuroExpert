'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RevenueChart({ period = '7d', darkMode = true }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Генерируем данные в зависимости от периода
    const generateData = () => {
      const labels = [];
      const revenue = [];
      const profit = [];
      
      let days = 7;
      if (period === '30d') days = 30;
      if (period === '90d') days = 90;

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Форматируем дату
        if (days <= 7) {
          labels.push(date.toLocaleDateString('ru', { weekday: 'short', day: 'numeric' }));
        } else if (days <= 30) {
          labels.push(date.toLocaleDateString('ru', { day: 'numeric', month: 'short' }));
        } else {
          if (i % 7 === 0) { // Показываем каждую неделю
            labels.push(date.toLocaleDateString('ru', { day: 'numeric', month: 'short' }));
          } else {
            labels.push('');
          }
        }

        // Генерируем данные с трендом
        const baseRevenue = 150000 + Math.random() * 50000;
        const trend = i * 1000; // Растущий тренд
        revenue.push(baseRevenue + trend + Math.random() * 20000);
        profit.push((baseRevenue + trend) * 0.25 + Math.random() * 5000);
      }

      return {
        labels,
        datasets: [
          {
            label: 'Выручка',
            data: revenue,
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: period === '90d' ? 0 : 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgb(139, 92, 246)',
            pointBorderColor: darkMode ? '#1a1a2e' : '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Прибыль',
            data: profit,
            borderColor: 'rgb(217, 70, 239)',
            backgroundColor: 'rgba(217, 70, 239, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: period === '90d' ? 0 : 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgb(217, 70, 239)',
            pointBorderColor: darkMode ? '#1a1a2e' : '#fff',
            pointBorderWidth: 2,
          }
        ]
      };
    };

    setChartData(generateData());
  }, [period, darkMode]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#333',
          font: {
            size: 14,
            family: "'Inter', sans-serif",
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
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('ru-RU', { 
                style: 'currency', 
                currency: 'RUB',
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.6)' : '#666',
          font: {
            size: 12,
          }
        }
      },
      y: {
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
            return new Intl.NumberFormat('ru-RU', { 
              notation: 'compact',
              maximumFractionDigits: 0
            }).format(value) + ' ₽';
          }
        }
      }
    }
  };

  if (!chartData) return <div className="chart-loading">Загрузка данных...</div>;

  return (
    <div className="chart-container" style={{ height: '100%', position: 'relative' }}>
      <Line options={options} data={chartData} />
    </div>
  );
}