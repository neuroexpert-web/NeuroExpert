'use client';

import { useEffect } from 'react';

export default function ValuesTooltips() {
  useEffect(() => {
    // Расширенная информация о ценностях
    const valuesInfo = {
      innovation: {
        title: 'Инновации',
        description: 'Мы постоянно исследуем новые технологии и подходы',
        details: [
          'Инвестируем 20% прибыли в R&D',
          'Сотрудничаем с ведущими университетами',
          'Публикуем исследования в открытом доступе',
          'Проводим хакатоны и AI-конференции'
        ],
        stats: {
          'Патентов': '15+',
          'Научных публикаций': '50+',
          'Open-source проектов': '12'
        }
      },
      transparency: {
        title: 'Прозрачность',
        description: 'Открытость в коммуникации и процессах',
        details: [
          'Публичные отчеты о работе платформы',
          'Открытая документация API',
          'Прозрачное ценообразование',
          'Регулярные встречи с клиентами'
        ],
        stats: {
          'Uptime платформы': '99.9%',
          'Время ответа поддержки': '< 2ч',
          'Публичных отчетов': '48/год'
        }
      },
      responsibility: {
        title: 'Ответственность',
        description: 'Этичное использование AI и защита данных',
        details: [
          'Строгое соблюдение GDPR и законов о данных',
          'Ethical AI Committee в составе компании',
          'Регулярные аудиты безопасности',
          'Страхование данных клиентов'
        ],
        stats: {
          'Инцидентов безопасности': '0',
          'Сертификатов': '7',
          'Страховое покрытие': '$10M'
        }
      },
      partnership: {
        title: 'Партнерство',
        description: 'Долгосрочные отношения с клиентами',
        details: [
          'Персональный менеджер для каждого клиента',
          'Кастомизация решений под задачи',
          'Обучение команд клиентов',
          'Success-based pricing модели'
        ],
        stats: {
          'Retention Rate': '94%',
          'NPS': '72',
          'Среднее время сотрудничества': '3.5 года'
        }
      }
    };

    // Показать подробную информацию о ценности
    const showValueDetails = (valueType) => {
      const value = valuesInfo[valueType];
      if (!value) return;

      const popup = document.createElement('div');
      popup.className = 'value-popup';
      popup.innerHTML = `
        <div class="value-popup-content">
          <div class="value-popup-header">
            <h3>${value.title}</h3>
            <p>${value.description}</p>
          </div>
          
          <div class="value-popup-body">
            <div class="value-details-section">
              <h4>Что это значит для вас:</h4>
              <ul class="value-details-list">
                ${value.details.map(detail => `
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    ${detail}
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div class="value-stats-section">
              <h4>В цифрах:</h4>
              <div class="value-stats-grid">
                ${Object.entries(value.stats).map(([key, val]) => `
                  <div class="value-stat">
                    <span class="stat-value">${val}</span>
                    <span class="stat-label">${key}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <button class="value-popup-close">Понятно</button>
        </div>
      `;

      document.body.appendChild(popup);

      // Анимация появления
      requestAnimationFrame(() => {
        popup.classList.add('visible');
      });

      // Обработчики закрытия
      const closePopup = () => {
        popup.classList.remove('visible');
        setTimeout(() => {
          popup.remove();
        }, 300);
      };

      popup.querySelector('.value-popup-close').addEventListener('click', closePopup);
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          closePopup();
        }
      });
    };

    // Обработчики для кнопок "Узнать больше"
    const setupValueButtons = () => {
      const valueButtons = document.querySelectorAll('.value-learn-more');
      
      valueButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          const valueCard = this.closest('.value-card');
          const valueType = valueCard.getAttribute('data-value');
          showValueDetails(valueType);
        });
      });
    };

    // Счетчики для статистики миссии
    const animateMissionStats = () => {
      const statValues = document.querySelectorAll('.stat-value');
      
      statValues.forEach(stat => {
        const text = stat.textContent;
        const isYear = text.includes('20');
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const hasSlash = text.includes('/');
        
        if (!isYear && !hasSlash) {
          // Извлекаем число
          const match = text.match(/\d+/);
          if (match) {
            const target = parseInt(match[0]);
            const duration = 2000;
            const startTime = performance.now();
            
            const updateNumber = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              const current = Math.floor(target * easeOutQuart(progress));
              let displayText = current.toString();
              
              if (hasPlus) displayText += '+';
              if (hasPercent) displayText += '%';
              
              stat.textContent = displayText;
              
              if (progress < 1) {
                requestAnimationFrame(updateNumber);
              }
            };
            
            requestAnimationFrame(updateNumber);
          }
        }
      });
    };

    const easeOutQuart = (t) => {
      return 1 - Math.pow(1 - t, 4);
    };

    // Эффект параллакса для карточек ценностей
    const setupParallaxEffect = () => {
      const valueCards = document.querySelectorAll('.value-card');
      
      valueCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const deltaX = (x - centerX) / centerX;
          const deltaY = (y - centerY) / centerY;
          
          this.style.transform = `
            translateY(-5px)
            rotateX(${deltaY * -5}deg)
            rotateY(${deltaX * 5}deg)
            scale(1.02)
          `;
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(-5px) rotateX(0) rotateY(0) scale(1)';
        });
      });
    };

    // Интерактивные подсказки для статистики
    const addStatTooltips = () => {
      const statItems = document.querySelectorAll('.stat-item');
      const tooltips = {
        '2019': 'Начали с команды из 5 человек и мечты изменить мир',
        '500+': 'От стартапов до Fortune 500 компаний',
        '98%': 'Основано на независимых опросах клиентов',
        '24/7': 'Техподдержка и мониторинг без выходных'
      };
      
      statItems.forEach(item => {
        const value = item.querySelector('.stat-value').textContent;
        const tooltip = tooltips[value];
        
        if (tooltip) {
          item.style.cursor = 'help';
          item.setAttribute('title', tooltip);
          
          item.addEventListener('mouseenter', function() {
            showTooltip(this, tooltip);
          });
          
          item.addEventListener('mouseleave', function() {
            hideTooltip();
          });
        }
      });
    };

    // Показать тултип
    const showTooltip = (element, text) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'stat-tooltip';
      tooltip.textContent = text;
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = element.getBoundingClientRect();
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
      
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
      });
      
      window.currentTooltip = tooltip;
    };

    // Скрыть тултип
    const hideTooltip = () => {
      if (window.currentTooltip) {
        const tooltip = window.currentTooltip;
        tooltip.style.opacity = '0';
        setTimeout(() => {
          tooltip.remove();
        }, 300);
        window.currentTooltip = null;
      }
    };

    // Добавить стили
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .value-popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
          padding: 2rem;
        }
        
        .value-popup.visible {
          opacity: 1;
        }
        
        .value-popup-content {
          background: #1a1a2e;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 600px;
          width: 100%;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }
        
        .value-popup.visible .value-popup-content {
          transform: scale(1);
        }
        
        .value-popup-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .value-popup-header h3 {
          color: white;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        
        .value-popup-header p {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .value-details-section {
          margin-bottom: 2rem;
        }
        
        .value-details-section h4,
        .value-stats-section h4 {
          color: #a78bfa;
          font-size: 1.125rem;
          margin-bottom: 1rem;
        }
        
        .value-details-list {
          list-style: none;
          padding: 0;
        }
        
        .value-details-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .value-details-list svg {
          flex-shrink: 0;
          stroke: #10b981;
          margin-top: 2px;
        }
        
        .value-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1.5rem;
        }
        
        .value-stat {
          text-align: center;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 12px;
        }
        
        .value-stat .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ec4899;
          margin-bottom: 0.25rem;
        }
        
        .value-stat .stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
        }
        
        .value-popup-close {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .value-popup-close:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        
        @media (max-width: 640px) {
          .value-popup-content {
            padding: 1.5rem;
          }
          
          .value-stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Проверка видимости для анимаций
    const observeElements = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('mission-stats')) {
              animateMissionStats();
              observer.unobserve(entry.target);
            }
          }
        });
      }, { threshold: 0.5 });
      
      const missionStats = document.querySelector('.mission-stats');
      if (missionStats) {
        observer.observe(missionStats);
      }
    };

    // Инициализация
    setTimeout(() => {
      setupValueButtons();
      setupParallaxEffect();
      addStatTooltips();
      observeElements();
      addStyles();
    }, 500);

  }, []);

  return null;
}