'use client';

import { useEffect } from 'react';

export default function RealtimeEngine() {
  useEffect(() => {
    // Simulate real-time data updates
    const updateInterval = setInterval(() => {
      updateMetrics();
    }, 3000);

    return () => clearInterval(updateInterval);
  }, []);

  const updateMetrics = () => {
    // Update random KPI values
    const kpiWidgets = document.querySelectorAll('.kpi-widget');
    kpiWidgets.forEach(widget => {
      if (Math.random() > 0.7) {
        const valueElement = widget.querySelector('.kpi-value');
        if (valueElement) {
          const currentValue = parseFloat(valueElement.textContent.replace(/[^\d.-]/g, ''));
          const change = (Math.random() - 0.5) * currentValue * 0.05; // ±5% change
          const newValue = currentValue + change;
          
          if (valueElement.textContent.includes('₽')) {
            valueElement.textContent = `₽ ${newValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
          } else if (valueElement.textContent.includes('%')) {
            valueElement.textContent = `${newValue.toFixed(1)}%`;
          } else {
            valueElement.textContent = Math.round(newValue).toString();
          }
          
          // Flash animation
          valueElement.style.animation = 'pulse 0.5s ease';
          setTimeout(() => {
            valueElement.style.animation = '';
          }, 500);
        }
      }
    });
  };

  return null;
}