'use client';

import { useEffect } from 'react';

export default function SolutionsManager() {
  useEffect(() => {
    // Управление фильтрами по отраслям
    const setupIndustryFilters = () => {
      const filters = document.querySelectorAll('.industry-filters input[type="checkbox"]');
      const solutionCards = document.querySelectorAll('.solution-card');
      const allFilter = document.querySelector('input[value="all"]');
      
      // Обработчик для фильтра "Все отрасли"
      if (allFilter) {
        allFilter.addEventListener('change', function() {
          if (this.checked) {
            // Снимаем выделение с других фильтров
            filters.forEach(filter => {
              if (filter !== this) {
                filter.checked = false;
              }
            });
            // Показываем все карточки
            solutionCards.forEach(card => {
              card.style.display = 'block';
              card.style.animation = 'fadeInUp 0.5s ease-out';
            });
          }
        });
      }
      
      // Обработчики для остальных фильтров
      filters.forEach(filter => {
        if (filter.value !== 'all') {
          filter.addEventListener('change', function() {
            // Снимаем выделение с "Все отрасли"
            if (allFilter && this.checked) {
              allFilter.checked = false;
            }
            
            updateVisibleSolutions();
          });
        }
      });
      
      function updateVisibleSolutions() {
        const activeFilters = Array.from(filters)
          .filter(f => f.checked && f.value !== 'all')
          .map(f => f.value);
        
        if (activeFilters.length === 0) {
          // Если ничего не выбрано, выбираем "Все отрасли"
          if (allFilter) {
            allFilter.checked = true;
          }
          solutionCards.forEach(card => {
            card.style.display = 'block';
          });
          return;
        }
        
        solutionCards.forEach(card => {
          const cardIndustries = card.getAttribute('data-industry')?.split(' ') || [];
          const shouldShow = activeFilters.some(filter => cardIndustries.includes(filter));
          
          if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease-out';
          } else {
            card.style.display = 'none';
          }
        });
        
        // Показываем сообщение, если нет подходящих решений
        const visibleCards = Array.from(solutionCards).filter(card => card.style.display !== 'none');
        if (visibleCards.length === 0) {
          showNoResultsMessage();
        } else {
          hideNoResultsMessage();
        }
      }
    };

    // Раскрытие деталей решения
    const setupSolutionDetails = () => {
      const detailButtons = document.querySelectorAll('.btn-details');
      
      detailButtons.forEach(button => {
        button.addEventListener('click', function() {
          const card = this.closest('.solution-card');
          const details = card.querySelector('.solution-details');
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          
          if (isExpanded) {
            // Скрываем детали
            details.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
              details.hidden = true;
            }, 300);
            this.setAttribute('aria-expanded', 'false');
          } else {
            // Показываем детали
            details.hidden = false;
            details.style.animation = 'slideDown 0.3s ease-out';
            this.setAttribute('aria-expanded', 'true');
            
            // Плавная прокрутка к деталям
            setTimeout(() => {
              details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
          }
        });
      });
    };

    // Выбор пакета
    const setupPackageSelection = () => {
      const selectButtons = document.querySelectorAll('.btn-select');
      
      selectButtons.forEach(button => {
        button.addEventListener('click', function() {
          const packageCard = this.closest('.package-card');
          const packageName = packageCard.querySelector('h4').textContent;
          
          // Анимация выбора
          packageCard.style.transform = 'scale(0.98)';
          setTimeout(() => {
            packageCard.style.transform = '';
          }, 200);
          
          // Показываем уведомление
          showNotification(`Вы выбрали пакет "${packageName}". Менеджер свяжется с вами в течение 15 минут.`);
          
          // Здесь можно добавить отправку данных на сервер
          console.log('Selected package:', packageName);
        });
      });
    };

    // Сравнение пакетов
    const setupPackageComparison = () => {
      const compareBtn = document.querySelector('.btn-compare');
      if (compareBtn) {
        compareBtn.addEventListener('click', function() {
          // Здесь можно открыть модальное окно со сравнением
          showComparisonModal();
        });
      }
    };

    // Кнопки CTA
    const setupCTAButtons = () => {
      const consultBtn = document.querySelector('.btn-consult');
      const calcBtn = document.querySelector('.btn-calc');
      
      if (consultBtn) {
        consultBtn.addEventListener('click', function() {
          // Открываем чат или форму консультации
          showNotification('Открывается форма консультации...');
        });
      }
      
      if (calcBtn) {
        calcBtn.addEventListener('click', function() {
          // Переход к калькулятору
          const calculator = document.querySelector('#roi-calculator');
          if (calculator) {
            calculator.scrollIntoView({ behavior: 'smooth' });
          } else {
            showNotification('Калькулятор откроется в новом окне');
          }
        });
      }
    };

    // Анимация метрик при скролле
    const animateMetricsOnScroll = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const metrics = entry.target.querySelectorAll('.metric-value');
            metrics.forEach(metric => {
              animateMetricValue(metric);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      const metricSections = document.querySelectorAll('.solution-metrics');
      metricSections.forEach(section => {
        observer.observe(section);
      });
    };

    // Анимация значения метрики
    const animateMetricValue = (element) => {
      const text = element.textContent;
      const match = text.match(/([+-]?)(\d+\.?\d*)/);
      
      if (match) {
        const prefix = match[1] || '';
        const value = parseFloat(match[2]);
        const suffix = text.replace(match[0], '');
        const duration = 1500;
        const startTime = performance.now();
        
        const updateValue = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const current = value * easeOutQuart(progress);
          element.textContent = prefix + current.toFixed(value % 1 !== 0 ? 1 : 0) + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateValue);
          }
        };
        
        requestAnimationFrame(updateValue);
      }
    };

    const easeOutQuart = (t) => {
      return 1 - Math.pow(1 - t, 4);
    };

    // Показать сообщение "Нет результатов"
    const showNoResultsMessage = () => {
      const existingMessage = document.querySelector('.no-results-message');
      if (!existingMessage) {
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
          <p>По выбранным фильтрам решений не найдено.</p>
          <button class="reset-filters-btn">Сбросить фильтры</button>
        `;
        
        const grid = document.querySelector('.solutions-grid');
        grid.appendChild(message);
        
        // Обработчик сброса
        message.querySelector('.reset-filters-btn').addEventListener('click', () => {
          const allFilter = document.querySelector('input[value="all"]');
          if (allFilter) {
            allFilter.click();
          }
        });
      }
    };

    const hideNoResultsMessage = () => {
      const message = document.querySelector('.no-results-message');
      if (message) {
        message.remove();
      }
    };

    // Модальное окно сравнения
    const showComparisonModal = () => {
      const modal = document.createElement('div');
      modal.className = 'comparison-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Сравнение пакетов</h2>
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Функция</th>
                <th>Старт</th>
                <th>Бизнес</th>
                <th>Энтерпрайз</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Клиентов в CRM</td>
                <td>До 100</td>
                <td>До 1000</td>
                <td>Безлимит</td>
              </tr>
              <tr>
                <td>AI-консультанты</td>
                <td>1</td>
                <td>3</td>
                <td>Безлимит</td>
              </tr>
              <tr>
                <td>Аналитика</td>
                <td>Базовая</td>
                <td>Продвинутая</td>
                <td>Кастомная</td>
              </tr>
              <tr>
                <td>Интеграции</td>
                <td>5</td>
                <td>Безлимит</td>
                <td>Безлимит + API</td>
              </tr>
              <tr>
                <td>Поддержка</td>
                <td>5/2</td>
                <td>24/7</td>
                <td>24/7 + Команда</td>
              </tr>
            </tbody>
          </table>
          <button class="close-modal">Закрыть</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Закрытие модального окна
      modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    // Уведомления
    const showNotification = (message) => {
      const notification = document.createElement('div');
      notification.className = 'solution-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 0.875rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
        z-index: 1000;
        max-width: 300px;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 4000);
    };

    // Добавляем стили для модального окна и анимаций
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .no-results-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .reset-filters-btn {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .reset-filters-btn:hover {
          background: rgba(139, 92, 246, 0.3);
        }
        
        .comparison-modal {
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
          animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content {
          background: #1a1a2e;
          border-radius: 20px;
          padding: 2rem;
          max-width: 800px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideInUp 0.3s ease-out;
        }
        
        .modal-content h2 {
          color: white;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }
        
        .comparison-table th,
        .comparison-table td {
          padding: 1rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .comparison-table th {
          background: rgba(139, 92, 246, 0.2);
          color: white;
          font-weight: 600;
        }
        
        .comparison-table td {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .comparison-table td:first-child {
          text-align: left;
          font-weight: 500;
        }
        
        .close-modal {
          display: block;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-modal:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 1;
            max-height: 500px;
          }
          to {
            opacity: 0;
            max-height: 0;
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(30px);
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    setTimeout(() => {
      setupIndustryFilters();
      setupSolutionDetails();
      setupPackageSelection();
      setupPackageComparison();
      setupCTAButtons();
      animateMetricsOnScroll();
      addStyles();
    }, 500);

  }, []);

  return null;
}