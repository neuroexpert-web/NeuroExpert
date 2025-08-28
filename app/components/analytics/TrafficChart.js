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
      labels: ['Органический поиск', 'Социальные сети', 'Прямые заходы', 'Email рассылки', 'Реклама', 'Рефералы'],
      datasets: [
        {
          data: [35, 25, 18, 12, 7, 3],
          backgroundColor: [
            'rgba(139, 92, 246, 0.8)',
            'rgba(217, 70, 239, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(126, 34, 206, 0.8)',
            'rgba(107, 33, 168, 0.8)',
          ],
          borderColor: darkMode ? '#1a1a2e' : '#fff',
          borderWidth: 2,
          hoverOffset: 10,
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
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#333',
          font: {
            size: 13,
            family: "'Inter', sans-serif",
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                const value = data.datasets[0].data[i];

                return {
                  text: `${label}: ${value}%`,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                  index: i
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
            const percentage = ((value / total) * 100).toFixed(1);
            
            return [
              `${label}`,
              `${value}% от общего трафика`,
              `≈ ${Math.round(value * 1200)} посетителей`
            ];
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