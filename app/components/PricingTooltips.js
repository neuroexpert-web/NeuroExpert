'use client';

import { useEffect } from 'react';

export default function PricingTooltips() {
  useEffect(() => {
    // FAQ анимации
    const setupFAQAnimations = () => {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        item.addEventListener('toggle', function() {
          if (this.open) {
            // Анимация открытия
            const content = this.querySelector('p');
            if (content) {
              content.style.animation = 'fadeIn 0.3s ease-out';
            }
            
            // Закрываем другие FAQ
            faqItems.forEach(otherItem => {
              if (otherItem !== this && otherItem.open) {
                otherItem.open = false;
              }
            });
          }
        });
      });
    };

    // Подсказки для функций тарифов
    const addFeatureTooltips = () => {
      const featureTooltips = {
        'Глубокий аудит бизнеса': 'Комплексный анализ всех бизнес-процессов с рекомендациями по оптимизации',
        'CRM-система': 'Управление клиентской базой, сделками, задачами и коммуникациями',
        'AI-аналитика': 'Машинное обучение для прогнозирования продаж и поведения клиентов',
        'Омниканальность': 'Единое управление всеми каналами коммуникации: email, чаты, соцсети, телефон',
        'SLA 99.9%': 'Гарантированная доступность платформы 99.9% времени с финансовыми компенсациями',
        'Кастомная разработка': 'Индивидуальные решения под уникальные задачи вашего бизнеса'
      };
      
      const features = document.querySelectorAll('.plan-features li');
      features.forEach(feature => {
        const text = feature.textContent.trim();
        Object.keys(featureTooltips).forEach(key => {
          if (text.includes(key)) {
            feature.style.cursor = 'help';
            feature.addEventListener('mouseenter', (e) => {
              showFeatureTooltip(e.currentTarget, featureTooltips[key]);
            });
            feature.addEventListener('mouseleave', hideFeatureTooltip);
          }
        });
      });
    };

    // Показать подсказку функции
    const showFeatureTooltip = (element, text) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'feature-tooltip';
      tooltip.textContent = text;
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        line-height: 1.4;
        max-width: 250px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let top = rect.top + rect.height / 2 - tooltipRect.height / 2;
      let left = rect.right + 10;
      
      // Проверка границ экрана
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = rect.left - tooltipRect.width - 10;
      }
      if (top < 10) {
        top = 10;
      }
      if (top + tooltipRect.height > window.innerHeight - 10) {
        top = window.innerHeight - tooltipRect.height - 10;
      }
      
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
      
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
      });
      
      element.activeTooltip = tooltip;
    };

    // Скрыть подсказку функции
    const hideFeatureTooltip = (e) => {
      const tooltip = e.currentTarget.activeTooltip;
      if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
          tooltip.remove();
        }, 300);
        e.currentTarget.activeTooltip = null;
      }
    };

    // Анимация цен при наведении
    const animatePrices = () => {
      const priceValues = document.querySelectorAll('.price-value');
      
      priceValues.forEach(price => {
        price.addEventListener('mouseenter', function() {
          this.style.animation = 'priceGlow 1s ease-in-out infinite';
        });
        
        price.addEventListener('mouseleave', function() {
          this.style.animation = '';
        });
      });
    };

    // Визуальные подсказки для слайдеров
    const enhanceSliders = () => {
      const sliders = document.querySelectorAll('.custom-slider');
      
      sliders.forEach(slider => {
        const container = document.createElement('div');
        container.className = 'slider-container';
        slider.parentNode.insertBefore(container, slider);
        container.appendChild(slider);
        
        // Создаем визуальный трек
        const track = document.createElement('div');
        track.className = 'slider-track-fill';
        container.appendChild(track);
        
        // Обновление трека при изменении
        const updateTrack = () => {
          const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
          track.style.width = percent + '%';
        };
        
        slider.addEventListener('input', updateTrack);
        updateTrack();
      });
    };

    // Интерактивные подсказки для опций
    const setupOptionHints = () => {
      const optionDetails = {
        'option-support': {
          title: 'Расширенная поддержка 24/7',
          benefits: [
            'Приоритетный ответ в течение 15 минут',
            'Выделенный менеджер',
            'Телефонная линия поддержки',
            'Удаленная помощь'
          ]
        },
        'option-api': {
          title: 'Расширенный API',
          benefits: [
            'Неограниченное количество запросов',
            'Webhooks и callbacks',
            'Приоритет обработки',
            'Расширенная документация'
          ]
        },
        'option-custom': {
          title: 'Кастомные интеграции',
          benefits: [
            'Интеграция с любыми системами',
            'Разработка под ключ',
            'Техническая поддержка интеграций',
            'Обновления и доработки'
          ]
        },
        'option-training': {
          title: 'Обучение команды',
          benefits: [
            'Онлайн-курс для всех сотрудников',
            'Персональные консультации',
            'Сертификаты об обучении',
            'База знаний и материалы'
          ]
        }
      };
      
      const optionBoxes = document.querySelectorAll('.option-box');
      optionBoxes.forEach(box => {
        const checkbox = box.parentElement.querySelector('input[type="checkbox"]');
        if (checkbox) {
          const optionName = checkbox.name;
          const details = optionDetails[optionName];
          
          if (details) {
            const infoIcon = document.createElement('span');
            infoIcon.className = 'option-info-icon';
            infoIcon.innerHTML = '?';
            box.appendChild(infoIcon);
            
            infoIcon.addEventListener('click', (e) => {
              e.stopPropagation();
              showOptionDetails(details);
            });
          }
        }
      });
    };

    // Показать детали опции
    const showOptionDetails = (details) => {
      const modal = document.createElement('div');
      modal.className = 'option-details-modal';
      modal.innerHTML = `
        <div class="option-details-content">
          <h3>${details.title}</h3>
          <p>Что включено:</p>
          <ul>
            ${details.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
          </ul>
          <button class="btn-close-details">Понятно</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('btn-close-details')) {
          modal.remove();
        }
      });
    };

    // Анимация прогресса при изменении периода
    const animatePeriodChange = () => {
      const periodOptions = document.querySelectorAll('input[name="period"]');
      const discountBadge = document.createElement('div');
      discountBadge.className = 'discount-badge';
      discountBadge.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, #10b981, #34d399);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 30px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
        z-index: 1000;
        pointer-events: none;
      `;
      
      periodOptions.forEach(option => {
        option.addEventListener('change', function() {
          if (this.value === '3') {
            showDiscountBadge(discountBadge, 'Скидка 5% активирована!');
          } else if (this.value === '12') {
            showDiscountBadge(discountBadge, 'Скидка 15% активирована!');
          }
        });
      });
    };

    // Показать значок скидки
    const showDiscountBadge = (badge, text) => {
      badge.textContent = text;
      document.body.appendChild(badge);
      
      // Позиционирование по центру экрана
      badge.style.top = '50%';
      badge.style.left = '50%';
      badge.style.transform = 'translate(-50%, -50%) scale(0)';
      
      requestAnimationFrame(() => {
        badge.style.opacity = '1';
        badge.style.transform = 'translate(-50%, -50%) scale(1)';
      });
      
      setTimeout(() => {
        badge.style.opacity = '0';
        badge.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
          if (badge.parentNode) {
            badge.remove();
          }
        }, 300);
      }, 2000);
    };

    // Добавляем стили
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .slider-container {
          position: relative;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        
        .slider-track-fill {
          position: absolute;
          height: 6px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 3px;
          pointer-events: none;
          top: 50%;
          transform: translateY(-50%);
          transition: width 0.3s ease;
        }
        
        .option-info-icon {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 20px;
          height: 20px;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #a78bfa;
          cursor: help;
          transition: all 0.3s ease;
        }
        
        .option-info-icon:hover {
          background: rgba(139, 92, 246, 0.3);
          transform: scale(1.1);
        }
        
        .option-details-modal {
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
          padding: 2rem;
        }
        
        .option-details-content {
          background: #1a1a2e;
          border-radius: 16px;
          padding: 2rem;
          max-width: 400px;
          animation: slideInUp 0.3s ease-out;
        }
        
        .option-details-content h3 {
          color: white;
          margin-bottom: 1rem;
        }
        
        .option-details-content p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }
        
        .option-details-content ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
        }
        
        .option-details-content li {
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.8);
          position: relative;
          padding-left: 1.5rem;
        }
        
        .option-details-content li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }
        
        .btn-close-details {
          width: 100%;
          padding: 0.75rem;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-close-details:hover {
          background: rgba(139, 92, 246, 0.3);
        }
        
        @keyframes priceGlow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2) drop-shadow(0 0 20px rgba(251, 191, 36, 0.5));
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    setTimeout(() => {
      setupFAQAnimations();
      addFeatureTooltips();
      animatePrices();
      enhanceSliders();
      setupOptionHints();
      animatePeriodChange();
      addStyles();
    }, 500);

  }, []);

  return null;
}