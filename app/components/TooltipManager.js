'use client';

import { useEffect } from 'react';

export default function TooltipManager() {
  useEffect(() => {
    // Управление тултипами
    const helpButtons = document.querySelectorAll('.help-icon');
    
    helpButtons.forEach(button => {
      const tooltipId = button.getAttribute('aria-describedby');
      const tooltip = document.getElementById(tooltipId);
      
      if (tooltip) {
        // Показать тултип при наведении или фокусе
        const showTooltip = () => {
          tooltip.hidden = false;
          tooltip.style.opacity = '1';
          tooltip.style.visibility = 'visible';
          tooltip.style.transform = 'translateY(0)';
        };
        
        // Скрыть тултип
        const hideTooltip = () => {
          tooltip.style.opacity = '0';
          tooltip.style.visibility = 'hidden';
          tooltip.style.transform = 'translateY(-5px)';
          setTimeout(() => {
            tooltip.hidden = true;
          }, 300);
        };
        
        button.addEventListener('mouseenter', showTooltip);
        button.addEventListener('focus', showTooltip);
        button.addEventListener('mouseleave', hideTooltip);
        button.addEventListener('blur', hideTooltip);
        
        // Закрыть по Escape
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            hideTooltip();
            button.blur();
          }
        });
      }
    });
    
    // Управление фильтрами периода
    const periodFilters = document.querySelectorAll('.filter-btn');
    periodFilters.forEach(btn => {
      btn.addEventListener('click', function() {
        // Убрать активный класс со всех кнопок
        periodFilters.forEach(b => b.classList.remove('active'));
        // Добавить активный класс на нажатую кнопку
        this.classList.add('active');
        
        // Здесь можно добавить логику обновления графиков
        const period = this.getAttribute('data-period');
        console.log('Выбран период:', period);
        
        // Эмулируем обновление данных
        const event = new CustomEvent('periodChanged', { detail: { period } });
        window.dispatchEvent(event);
      });
    });
    
    // Управление кнопкой обновления
    const refreshButton = document.querySelector('.refresh-button');
    if (refreshButton) {
      refreshButton.addEventListener('click', () => {
        // Анимация вращения
        const svg = refreshButton.querySelector('svg');
        svg.style.animation = 'spin 1s ease-in-out';
        
        setTimeout(() => {
          svg.style.animation = '';
          
          // Эмулируем обновление данных
          const event = new CustomEvent('dataRefresh');
          window.dispatchEvent(event);
        }, 1000);
      });
    }
    
    // Добавляем анимацию для кнопки обновления
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
}