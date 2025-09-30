'use client';

import { useEffect } from 'react';

export default function ProcessTooltips() {
  useEffect(() => {
    // Подсказки при наведении на метрики
    const addMetricTooltips = () => {
      const metricCards = document.querySelectorAll('.metric-card');
      
      const tooltips = {
        'Автоматизация процессов': 'Процент бизнес-процессов, выполняющихся без участия человека. Включает автоматическую обработку заявок, отчётность и рутинные операции.',
        'Среднее время обработки': 'Время от поступления заявки до её полного выполнения. Включает все этапы обработки и согласования.',
        'Успешные сделки': 'Процент сделок, завершённых с положительным результатом. Учитываются только закрытые сделки за выбранный период.'
      };
      
      metricCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent;
        if (title && tooltips[title]) {
          card.style.position = 'relative';
          card.setAttribute('data-tooltip', tooltips[title]);
          
          card.addEventListener('mouseenter', showTooltip);
          card.addEventListener('mouseleave', hideTooltip);
        }
      });
    };

    // Показать тултип
    const showTooltip = (e) => {
      const card = e.currentTarget;
      const text = card.getAttribute('data-tooltip');
      
      const tooltip = document.createElement('div');
      tooltip.className = 'metric-tooltip';
      tooltip.textContent = text;
      tooltip.style.cssText = `
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        line-height: 1.4;
        max-width: 250px;
        text-align: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        white-space: normal;
      `;
      
      // Стрелка
      const arrow = document.createElement('div');
      arrow.style.cssText = `
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid rgba(0, 0, 0, 0.95);
      `;
      
      tooltip.appendChild(arrow);
      card.appendChild(tooltip);
      
      // Анимация появления
      setTimeout(() => {
        tooltip.style.opacity = '1';
      }, 10);
    };

    // Скрыть тултип
    const hideTooltip = (e) => {
      const tooltip = e.currentTarget.querySelector('.metric-tooltip');
      if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
          tooltip.remove();
        }, 300);
      }
    };

    // Онбординг для новых пользователей
    const showOnboarding = () => {
      const hasSeenOnboarding = localStorage.getItem('processOnboardingSeen');
      if (hasSeenOnboarding || !document.querySelector('#page-processes')) return;

      const steps = [
        {
          element: '.task-priorities',
          title: 'Приоритетные задачи',
          content: 'Здесь отображаются ваши текущие задачи, отсортированные по важности. Красные - критичные, жёлтые - важные, зелёные - обычные.',
          position: 'right'
        },
        {
          element: '.process-metrics',
          title: 'Ключевые метрики',
          content: 'Следите за эффективностью процессов в реальном времени. Наведите на карточку для подробной информации.',
          position: 'bottom'
        },
        {
          element: '.process-graph',
          title: 'Загрузка команд',
          content: 'Визуализация загруженности отделов помогает оптимально распределять ресурсы и предотвращать выгорание.',
          position: 'top'
        },
        {
          element: '.ai-insights',
          title: 'Умные рекомендации',
          content: 'AI анализирует ваши процессы и предлагает конкретные шаги для повышения эффективности.',
          position: 'top'
        }
      ];

      let currentStep = 0;
      let overlay, highlight, tooltip;

      const showStep = (index) => {
        if (index >= steps.length) {
          endOnboarding();
          return;
        }

        const step = steps[index];
        const element = document.querySelector(step.element);
        if (!element) {
          showStep(index + 1);
          return;
        }

        // Создаём оверлей
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'onboarding-overlay';
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            cursor: pointer;
          `;
          document.body.appendChild(overlay);
        }

        // Подсветка элемента
        const rect = element.getBoundingClientRect();
        if (!highlight) {
          highlight = document.createElement('div');
          highlight.className = 'onboarding-highlight';
          document.body.appendChild(highlight);
        }
        
        highlight.style.cssText = `
          position: fixed;
          top: ${rect.top - 10}px;
          left: ${rect.left - 10}px;
          width: ${rect.width + 20}px;
          height: ${rect.height + 20}px;
          border: 2px solid #8b5cf6;
          border-radius: 12px;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.4);
          z-index: 9999;
          pointer-events: none;
          transition: all 0.3s ease;
        `;

        // Подсказка
        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.className = 'onboarding-tooltip';
          document.body.appendChild(tooltip);
        }

        // Позиционирование подсказки
        const tooltipStyles = {
          position: 'fixed',
          zIndex: '10000',
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '320px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          color: '#1a1a1a'
        };

        switch(step.position) {
          case 'right':
            tooltipStyles.left = `${rect.right + 20}px`;
            tooltipStyles.top = `${rect.top + rect.height / 2}px`;
            tooltipStyles.transform = 'translateY(-50%)';
            break;
          case 'bottom':
            tooltipStyles.left = `${rect.left + rect.width / 2}px`;
            tooltipStyles.top = `${rect.bottom + 20}px`;
            tooltipStyles.transform = 'translateX(-50%)';
            break;
          case 'top':
            tooltipStyles.left = `${rect.left + rect.width / 2}px`;
            tooltipStyles.bottom = `${window.innerHeight - rect.top + 20}px`;
            tooltipStyles.transform = 'translateX(-50%)';
            break;
        }

        Object.assign(tooltip.style, tooltipStyles);

        tooltip.innerHTML = `
          <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: #8b5cf6;">
            ${step.title}
          </h3>
          <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">
            ${step.content}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; color: #666;">
              ${index + 1} из ${steps.length}
            </span>
            <div style="display: flex; gap: 10px;">
              <button onclick="window.skipProcessOnboarding()" style="
                padding: 8px 16px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                background: white;
                cursor: pointer;
                font-size: 14px;
              ">
                Пропустить
              </button>
              <button onclick="window.nextProcessStep()" style="
                padding: 8px 20px;
                border: none;
                border-radius: 6px;
                background: #8b5cf6;
                color: white;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
              ">
                ${index === steps.length - 1 ? 'Готово' : 'Далее'}
              </button>
            </div>
          </div>
        `;
      };

      const endOnboarding = () => {
        if (overlay) overlay.remove();
        if (highlight) highlight.remove();
        if (tooltip) tooltip.remove();
        localStorage.setItem('processOnboardingSeen', 'true');
      };

      // Глобальные функции для кнопок
      window.skipProcessOnboarding = endOnboarding;
      window.nextProcessStep = () => {
        currentStep++;
        showStep(currentStep);
      };

      // Запуск онбординга
      setTimeout(() => {
        showStep(0);
      }, 1000);
    };

    // Инициализация
    addMetricTooltips();
    showOnboarding();

    // Cleanup
    return () => {
      delete window.skipProcessOnboarding;
      delete window.nextProcessStep;
    };
  }, []);

  return null;
}