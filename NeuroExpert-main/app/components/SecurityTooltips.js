'use client';

import { useEffect } from 'react';

export default function SecurityTooltips() {
  useEffect(() => {
    // Словарь терминов безопасности
    const securityTerms = {
      'AES-256': 'Advanced Encryption Standard с ключом 256 бит - военный стандарт шифрования, практически невозможно взломать',
      'RSA-4096': 'Асимметричное шифрование с ключом 4096 бит для безопасного обмена данными',
      'End-to-end': 'Сквозное шифрование - данные зашифрованы от отправителя до получателя',
      'HSM': 'Hardware Security Module - аппаратный модуль для управления криптографическими ключами',
      '2FA/MFA': 'Двухфакторная/многофакторная аутентификация для дополнительной защиты аккаунта',
      'FIDO2': 'Стандарт аутентификации без паролей с использованием биометрии или аппаратных ключей',
      'WebAuthn': 'Web Authentication API - стандарт для безопасной аутентификации в веб-приложениях',
      'SAML 2.0': 'Security Assertion Markup Language - стандарт для единого входа (SSO)',
      'UEBA': 'User and Entity Behavior Analytics - анализ поведения для выявления аномалий',
      'DLP': 'Data Loss Prevention - предотвращение утечки конфиденциальных данных',
      'RPO': 'Recovery Point Objective - максимально допустимая потеря данных при восстановлении',
      'RTO': 'Recovery Time Objective - максимально допустимое время восстановления после сбоя',
      'SLA': 'Service Level Agreement - соглашение об уровне обслуживания с гарантиями',
      'Perfect Forward Secrecy': 'Каждая сессия использует уникальные ключи шифрования',
      'Threat Intelligence': 'Сбор и анализ данных об угрозах безопасности в реальном времени'
    };

    // Добавление тултипов к техническим терминам
    const addTooltipsToTerms = () => {
      const techDetails = document.querySelectorAll('.tech-details li, .tech-card p');
      
      techDetails.forEach(element => {
        const text = element.textContent;
        Object.keys(securityTerms).forEach(term => {
          if (text.includes(term)) {
            const regex = new RegExp(`\\b${term}\\b`, 'g');
            element.innerHTML = element.innerHTML.replace(regex, 
              `<span class="security-term" data-term="${term}">${term}</span>`
            );
          }
        });
      });
      
      // Добавляем обработчики для показа тултипов
      const terms = document.querySelectorAll('.security-term');
      terms.forEach(term => {
        term.addEventListener('mouseenter', showTermTooltip);
        term.addEventListener('mouseleave', hideTermTooltip);
        term.addEventListener('focus', showTermTooltip);
        term.addEventListener('blur', hideTermTooltip);
      });
    };

    // Показать тултип для термина
    const showTermTooltip = (e) => {
      const term = e.target;
      const termKey = term.getAttribute('data-term');
      const definition = securityTerms[termKey];
      
      if (!definition) return;
      
      const tooltip = document.createElement('div');
      tooltip.className = 'term-tooltip';
      tooltip.textContent = definition;
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        line-height: 1.4;
        max-width: 300px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      `;
      
      document.body.appendChild(tooltip);
      
      // Позиционирование
      const rect = term.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let top = rect.top - tooltipRect.height - 10;
      let left = rect.left + (rect.width - tooltipRect.width) / 2;
      
      // Проверка границ экрана
      if (top < 10) {
        top = rect.bottom + 10;
      }
      if (left < 10) {
        left = 10;
      }
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
      
      // Анимация появления
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
      });
      
      term.tooltip = tooltip;
    };

    // Скрыть тултип
    const hideTermTooltip = (e) => {
      const tooltip = e.target.tooltip;
      if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
          tooltip.remove();
        }, 300);
        e.target.tooltip = null;
      }
    };

    // Индикаторы безопасности с подсказками
    const addSecurityIndicators = () => {
      const indicators = [
        {
          selector: '.level-value',
          message: 'Рассчитывается на основе 50+ параметров безопасности и обновляется в реальном времени'
        },
        {
          selector: '.detail-item',
          messages: {
            'Защита 24/7': 'Круглосуточный мониторинг безопасности командой экспертов',
            'Шифрование AES-256': 'Военный стандарт шифрования, используемый правительствами',
            'Сертифицировано': 'Прошли независимый аудит международных организаций'
          }
        }
      ];
      
      indicators.forEach(indicator => {
        const elements = document.querySelectorAll(indicator.selector);
        elements.forEach(element => {
          element.style.cursor = 'help';
          element.setAttribute('tabindex', '0');
          
          element.addEventListener('click', () => {
            let message = indicator.message;
            if (indicator.messages) {
              const text = element.textContent.trim();
              message = indicator.messages[text] || message;
            }
            if (message) {
              showInfoPopup(message);
            }
          });
        });
      });
    };

    // Информационное всплывающее окно
    const showInfoPopup = (message) => {
      const popup = document.createElement('div');
      popup.className = 'info-popup';
      popup.innerHTML = `
        <div class="popup-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
          </svg>
          <p>${message}</p>
        </div>
      `;
      popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 12px;
        padding: 1.5rem;
        max-width: 400px;
        z-index: 10000;
        animation: popupIn 0.3s ease-out;
      `;
      
      document.body.appendChild(popup);
      
      // Закрытие по клику
      popup.addEventListener('click', () => {
        popup.style.animation = 'popupOut 0.3s ease-out';
        setTimeout(() => {
          popup.remove();
        }, 300);
      });
      
      // Автоматическое закрытие
      setTimeout(() => {
        if (document.body.contains(popup)) {
          popup.click();
        }
      }, 5000);
    };

    // Интерактивный тур по безопасности
    const initSecurityTour = () => {
      const hasSeenTour = localStorage.getItem('securityTourSeen');
      if (hasSeenTour || !document.querySelector('#security-section')) return;
      
      const tourSteps = [
        {
          element: '.security-level',
          title: 'Уровень защиты',
          content: 'Мы постоянно мониторим и улучшаем безопасность. Текущий уровень показывает общее состояние защиты платформы.',
          position: 'bottom'
        },
        {
          element: '.tech-card:first-child',
          title: 'Технологии защиты',
          content: 'Используем передовые технологии шифрования и защиты данных. Нажмите "Подробнее" для дополнительной информации.',
          position: 'right'
        },
        {
          element: '.certificate-card:first-child',
          title: 'Сертификаты',
          content: 'Наша безопасность подтверждена международными сертификатами. Вы можете просмотреть и скачать их.',
          position: 'top'
        }
      ];
      
      // Показать кнопку начала тура
      const tourButton = document.createElement('button');
      tourButton.className = 'start-tour-btn';
      tourButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
        </svg>
        Узнать о безопасности
      `;
      tourButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #10b981, #3b82f6);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        animation: pulse 2s ease-in-out infinite;
        z-index: 1000;
      `;
      
      document.body.appendChild(tourButton);
      
      tourButton.addEventListener('click', () => {
        startTour(tourSteps);
        tourButton.remove();
      });
    };

    // Запуск тура
    const startTour = (steps) => {
      const currentStep = 0;
      
      const showStep = (index) => {
        if (index >= steps.length) {
          endTour();
          return;
        }
        
        const step = steps[index];
        const element = document.querySelector(step.element);
        if (!element) {
          showStep(index + 1);
          return;
        }
        
        // Подсветка элемента
        element.classList.add('tour-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Показ подсказки
        const tooltip = createTourTooltip(step, index, steps.length);
        positionTourTooltip(tooltip, element, step.position);
        
        // Навигация
        tooltip.querySelector('.tour-next').addEventListener('click', () => {
          element.classList.remove('tour-highlight');
          tooltip.remove();
          showStep(index + 1);
        });
        
        tooltip.querySelector('.tour-skip').addEventListener('click', () => {
          element.classList.remove('tour-highlight');
          tooltip.remove();
          endTour();
        });
      };
      
      showStep(0);
    };

    // Создание подсказки тура
    const createTourTooltip = (step, index, total) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tour-tooltip';
      tooltip.innerHTML = `
        <h4>${step.title}</h4>
        <p>${step.content}</p>
        <div class="tour-navigation">
          <span class="tour-progress">${index + 1} из ${total}</span>
          <div class="tour-buttons">
            <button class="tour-skip">Пропустить</button>
            <button class="tour-next">${index === total - 1 ? 'Готово' : 'Далее'}</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(tooltip);
      return tooltip;
    };

    // Позиционирование подсказки тура
    const positionTourTooltip = (tooltip, element, position) => {
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let top, left;
      
      switch (position) {
        case 'bottom':
          top = rect.bottom + 20;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.right + 20;
          break;
        case 'top':
          top = rect.top - tooltipRect.height - 20;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        default:
          top = rect.bottom + 20;
          left = rect.left;
      }
      
      // Корректировка границ
      if (left < 20) left = 20;
      if (left + tooltipRect.width > window.innerWidth - 20) {
        left = window.innerWidth - tooltipRect.width - 20;
      }
      if (top < 20) top = rect.bottom + 20;
      
      tooltip.style.position = 'fixed';
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
    };

    // Завершение тура
    const endTour = () => {
      localStorage.setItem('securityTourSeen', 'true');
      const highlights = document.querySelectorAll('.tour-highlight');
      highlights.forEach(el => el.classList.remove('tour-highlight'));
    };

    // Добавляем стили
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .security-term {
          cursor: help;
          border-bottom: 1px dotted rgba(139, 92, 246, 0.5);
          transition: all 0.3s ease;
        }
        
        .security-term:hover {
          color: #a78bfa;
          border-bottom-color: #a78bfa;
        }
        
        .info-popup .popup-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          color: white;
        }
        
        .info-popup svg {
          flex-shrink: 0;
          stroke: #3b82f6;
        }
        
        .info-popup p {
          margin: 0;
          line-height: 1.6;
        }
        
        .tour-tooltip {
          background: white;
          color: #1a1a2e;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          max-width: 350px;
          z-index: 10001;
          animation: fadeIn 0.3s ease-out;
        }
        
        .tour-tooltip h4 {
          margin: 0 0 0.75rem 0;
          color: #8b5cf6;
          font-size: 1.125rem;
        }
        
        .tour-tooltip p {
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }
        
        .tour-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .tour-progress {
          font-size: 0.875rem;
          color: #666;
        }
        
        .tour-buttons {
          display: flex;
          gap: 0.75rem;
        }
        
        .tour-skip,
        .tour-next {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .tour-skip {
          background: transparent;
          color: #666;
        }
        
        .tour-skip:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .tour-next {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          color: white;
        }
        
        .tour-next:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .tour-highlight {
          position: relative;
          z-index: 1000;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.4);
          animation: highlightPulse 2s ease-in-out infinite;
        }
        
        @keyframes popupIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes popupOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }
        
        @keyframes highlightPulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.2);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    setTimeout(() => {
      addTooltipsToTerms();
      addSecurityIndicators();
      initSecurityTour();
      addStyles();
    }, 600);

  }, []);

  return null;
}