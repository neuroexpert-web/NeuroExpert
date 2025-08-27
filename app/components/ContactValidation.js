'use client';

import { useEffect } from 'react';

export default function ContactValidation() {
  useEffect(() => {
    // Подсказки при фокусе на поле
    const setupFieldHints = () => {
      const hints = {
        'contact-name': 'Пожалуйста, укажите ваше полное имя',
        'contact-company': 'Название вашей организации (необязательно)',
        'contact-email': 'Мы отправим подтверждение на этот адрес',
        'contact-phone': 'Для быстрой связи по срочным вопросам',
        'contact-message': 'Опишите вашу задачу или вопрос максимально подробно'
      };
      
      Object.keys(hints).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.addEventListener('focus', function() {
            showHint(this, hints[fieldId]);
          });
          
          field.addEventListener('blur', function() {
            hideHint();
          });
        }
      });
    };
    
    // Показать подсказку
    const showHint = (element, text) => {
      hideHint(); // Удаляем предыдущую подсказку
      
      const hint = document.createElement('div');
      hint.className = 'field-hint';
      hint.textContent = text;
      hint.style.cssText = `
        position: absolute;
        background: rgba(99, 102, 241, 0.95);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        z-index: 100;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        max-width: 250px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      `;
      
      document.body.appendChild(hint);
      
      const rect = element.getBoundingClientRect();
      const hintRect = hint.getBoundingClientRect();
      
      // Позиционирование
      let top = rect.bottom + 5;
      let left = rect.left;
      
      // Проверка границ
      if (left + hintRect.width > window.innerWidth - 10) {
        left = window.innerWidth - hintRect.width - 10;
      }
      
      hint.style.top = top + 'px';
      hint.style.left = left + 'px';
      
      requestAnimationFrame(() => {
        hint.style.opacity = '1';
      });
      
      window.currentHint = hint;
    };
    
    // Скрыть подсказку
    const hideHint = () => {
      if (window.currentHint) {
        const hint = window.currentHint;
        hint.style.opacity = '0';
        setTimeout(() => {
          hint.remove();
        }, 300);
        window.currentHint = null;
      }
    };
    
    // Проверка силы email
    const checkEmailStrength = () => {
      const emailInput = document.getElementById('contact-email');
      if (!emailInput) return;
      
      emailInput.addEventListener('input', function() {
        const email = this.value;
        const formGroup = this.closest('.form-group');
        
        // Удаляем предыдущий индикатор
        const existingIndicator = formGroup.querySelector('.email-strength');
        if (existingIndicator) {
          existingIndicator.remove();
        }
        
        if (email.length > 0) {
          const indicator = document.createElement('div');
          indicator.className = 'email-strength';
          
          // Проверяем популярные корпоративные домены
          const corporateDomains = ['gmail.com', 'mail.ru', 'yandex.ru', 'yahoo.com', 'hotmail.com'];
          const domain = email.split('@')[1];
          
          if (domain && !corporateDomains.includes(domain)) {
            indicator.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>
              </svg>
              <span>Корпоративный email</span>
            `;
            indicator.style.color = '#10b981';
          }
          
          formGroup.appendChild(indicator);
        }
      });
    };
    
    // Счетчик символов для сообщения
    const setupCharacterCounter = () => {
      const messageField = document.getElementById('contact-message');
      if (!messageField) return;
      
      const maxLength = 1000;
      const formGroup = messageField.closest('.form-group');
      
      // Создаем счетчик
      const counter = document.createElement('div');
      counter.className = 'character-counter';
      counter.style.cssText = `
        text-align: right;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 0.25rem;
      `;
      formGroup.appendChild(counter);
      
      // Обновление счетчика
      const updateCounter = () => {
        const length = messageField.value.length;
        counter.textContent = `${length} / ${maxLength}`;
        
        if (length > maxLength * 0.9) {
          counter.style.color = '#f59e0b';
        } else if (length > maxLength * 0.8) {
          counter.style.color = 'rgba(255, 255, 255, 0.7)';
        } else {
          counter.style.color = 'rgba(255, 255, 255, 0.5)';
        }
      };
      
      messageField.addEventListener('input', updateCounter);
      updateCounter();
    };
    
    // Проверка доступности сервера
    const checkServerAvailability = () => {
      const indicator = document.createElement('div');
      indicator.className = 'server-status';
      indicator.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 20px;
        font-size: 0.75rem;
        color: white;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 100;
      `;
      
      // Имитация проверки сервера
      setTimeout(() => {
        indicator.innerHTML = `
          <span class="status-dot" style="
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></span>
          <span>Сервер доступен</span>
        `;
        
        document.body.appendChild(indicator);
        
        requestAnimationFrame(() => {
          indicator.style.opacity = '1';
        });
        
        setTimeout(() => {
          indicator.style.opacity = '0';
          setTimeout(() => {
            indicator.remove();
          }, 300);
        }, 3000);
      }, 1000);
    };
    
    // Автосохранение черновика
    const setupDraftSaving = () => {
      const form = document.getElementById('mainContactForm');
      if (!form) return;
      
      const saveKey = 'contactFormDraft';
      
      // Загрузка черновика
      const loadDraft = () => {
        const draft = localStorage.getItem(saveKey);
        if (draft) {
          try {
            const data = JSON.parse(draft);
            Object.keys(data).forEach(key => {
              const field = form.querySelector(`[name="${key}"]`);
              if (field) {
                if (field.type === 'checkbox') {
                  field.checked = data[key];
                } else {
                  field.value = data[key];
                }
              }
            });
            
            showDraftNotification('Черновик восстановлен');
          } catch (e) {
            console.error('Error loading draft:', e);
          }
        }
      };
      
      // Сохранение черновика
      const saveDraft = () => {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
          if (key !== 'privacy') { // Не сохраняем согласие
            data[key] = value;
          }
        }
        
        localStorage.setItem(saveKey, JSON.stringify(data));
      };
      
      // Очистка черновика
      const clearDraft = () => {
        localStorage.removeItem(saveKey);
      };
      
      // Слушатели
      let saveTimeout;
      form.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveDraft, 1000);
      });
      
      form.addEventListener('submit', clearDraft);
      
      // Загружаем черновик при инициализации
      loadDraft();
    };
    
    // Уведомление о черновике
    const showDraftNotification = (message) => {
      const notification = document.createElement('div');
      notification.className = 'draft-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 0.75rem 1.5rem;
        background: rgba(99, 102, 241, 0.9);
        color: white;
        border-radius: 8px;
        font-size: 0.875rem;
        animation: slideInRight 0.3s ease-out;
        z-index: 1000;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    };
    
    // Добавляем стили
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .email-strength {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
          font-size: 0.75rem;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
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
    setupFieldHints();
    checkEmailStrength();
    setupCharacterCounter();
    checkServerAvailability();
    setupDraftSaving();
    addStyles();

  }, []);

  return null;
}