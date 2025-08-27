'use client';

import { useEffect } from 'react';

export default function AudienceTooltips() {
  useEffect(() => {
    // Управление тултипами для страницы аудитории
    const initTooltips = () => {
      const helpButtons = document.querySelectorAll('.help-icon');
      
      helpButtons.forEach(button => {
        const tooltipId = button.getAttribute('aria-describedby');
        const tooltip = document.getElementById(tooltipId);
        
        if (tooltip) {
          // Показать тултип
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
    };

    // Интерактивные подсказки при первом посещении
    const showFirstTimeHints = () => {
      const hasSeenHints = localStorage.getItem('audienceHintsSeen');
      if (hasSeenHints) return;

      const hints = [
        {
          element: '.segment-selector-panel',
          message: 'Выберите сегмент клиентов для детального анализа',
          position: 'right'
        },
        {
          element: '.segment-stats-overview',
          message: 'Ключевые показатели сегмента обновляются в реальном времени',
          position: 'bottom'
        },
        {
          element: '.ai-recommendation-for-segment',
          message: 'AI анализирует поведение сегмента и предлагает стратегии роста',
          position: 'top'
        }
      ];

      const currentHint = 0;

      const showHint = (index) => {
        if (index >= hints.length) {
          localStorage.setItem('audienceHintsSeen', 'true');
          return;
        }

        const hint = hints[index];
        const element = document.querySelector(hint.element);
        if (!element) {
          showHint(index + 1);
          return;
        }

        const rect = element.getBoundingClientRect();
        
        // Создаем подсказку
        const hintEl = document.createElement('div');
        hintEl.className = 'interactive-hint';
        hintEl.innerHTML = `
          <div class="hint-content">
            <p>${hint.message}</p>
            <button class="hint-close">Понятно</button>
          </div>
          <div class="hint-arrow"></div>
        `;

        // Позиционирование
        hintEl.style.position = 'fixed';
        hintEl.style.zIndex = '10000';
        
        switch(hint.position) {
          case 'right':
            hintEl.style.left = `${rect.right + 20}px`;
            hintEl.style.top = `${rect.top + rect.height / 2}px`;
            hintEl.style.transform = 'translateY(-50%)';
            hintEl.classList.add('hint-right');
            break;
          case 'bottom':
            hintEl.style.left = `${rect.left + rect.width / 2}px`;
            hintEl.style.top = `${rect.bottom + 20}px`;
            hintEl.style.transform = 'translateX(-50%)';
            hintEl.classList.add('hint-bottom');
            break;
          case 'top':
            hintEl.style.left = `${rect.left + rect.width / 2}px`;
            hintEl.style.bottom = `${window.innerHeight - rect.top + 20}px`;
            hintEl.style.transform = 'translateX(-50%)';
            hintEl.classList.add('hint-top');
            break;
        }

        document.body.appendChild(hintEl);

        // Подсветка элемента
        element.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.4)';
        element.style.transition = 'box-shadow 0.3s ease';

        // Обработчик закрытия
        const closeButton = hintEl.querySelector('.hint-close');
        closeButton.addEventListener('click', () => {
          hintEl.remove();
          element.style.boxShadow = '';
          showHint(index + 1);
        });
      };

      // Запускаем подсказки через 1 секунду
      setTimeout(() => {
        showHint(0);
      }, 1000);
    };

    // Стили для подсказок
    const addHintStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .interactive-hint {
          max-width: 280px;
          animation: hintFadeIn 0.3s ease-out;
        }
        
        .hint-content {
          background: white;
          color: #1a1a1a;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .hint-content p {
          margin: 0 0 12px 0;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .hint-close {
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .hint-close:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }
        
        .hint-arrow {
          width: 0;
          height: 0;
          border: 8px solid transparent;
          position: absolute;
        }
        
        .hint-right .hint-arrow {
          border-right-color: white;
          left: -16px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .hint-bottom .hint-arrow {
          border-bottom-color: white;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .hint-top .hint-arrow {
          border-top-color: white;
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        @keyframes hintFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    initTooltips();
    addHintStyles();
    
    // Показываем подсказки только на странице аудитории
    if (document.querySelector('#page-audience')) {
      showFirstTimeHints();
    }

    // Cleanup
    return () => {
      const hints = document.querySelectorAll('.interactive-hint');
      hints.forEach(hint => hint.remove());
    };
  }, []);

  return null;
}