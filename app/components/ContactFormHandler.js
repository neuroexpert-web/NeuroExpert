'use client';

import { useEffect } from 'react';

export default function ContactFormHandler() {
  useEffect(() => {
    // Обработка отправки формы
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      const form = e.target;
      const formData = new FormData(form);
      
      // Валидация полей
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
      }
      
      // Показываем состояние загрузки
      showLoadingState(form);
      
      // Собираем данные для отправки
      const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        topic: formData.get('topic'),
        solutions: formData.getAll('solutions'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        source: 'redesign-contact-form'
      };
      
      try {
        // Имитация отправки на сервер
        await sendToServer(data);
        
        // Успешная отправка
        showSuccessNotification('Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.');
        
        // Очищаем форму
        form.reset();
        
        // Отправляем в Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'Contact',
            event_label: data.topic || 'general'
          });
        }
        
      } catch (error) {
        console.error('Form submission error:', error);
        showErrorNotification('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
      } finally {
        hideLoadingState(form);
      }
    };
    
    // Валидация формы
    const validateForm = (formData) => {
      const errors = {};
      
      // Имя
      const name = formData.get('name');
      if (!name || name.trim().length < 2) {
        errors.name = 'Введите корректное имя';
      }
      
      // Email
      const email = formData.get('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        errors.email = 'Введите корректный email';
      }
      
      // Телефон
      const phone = formData.get('phone');
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phone || phone.length < 10 || !phoneRegex.test(phone)) {
        errors.phone = 'Введите корректный номер телефона';
      }
      
      // Согласие с политикой
      const privacy = formData.get('privacy');
      if (!privacy) {
        errors.privacy = 'Необходимо согласие с политикой конфиденциальности';
      }
      
      return errors;
    };
    
    // Показать ошибки
    const showErrors = (errors) => {
      // Сбрасываем предыдущие ошибки
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });
      
      // Показываем новые ошибки
      Object.keys(errors).forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
          const formGroup = input.closest('.form-group');
          if (formGroup) {
            formGroup.classList.add('error');
            
            // Создаем сообщение об ошибке
            let errorMsg = formGroup.querySelector('.error-message');
            if (!errorMsg) {
              errorMsg = document.createElement('span');
              errorMsg.className = 'error-message';
              formGroup.appendChild(errorMsg);
            }
            errorMsg.textContent = errors[field];
          }
        }
      });
    };
    
    // Состояние загрузки
    const showLoadingState = (form) => {
      form.classList.add('form-loading');
      const submitBtn = form.querySelector('.btn-submit-form');
      if (submitBtn) {
        submitBtn.disabled = true;
      }
    };
    
    const hideLoadingState = (form) => {
      form.classList.remove('form-loading');
      const submitBtn = form.querySelector('.btn-submit-form');
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    };
    
    // Отправка на сервер
    const sendToServer = async (data) => {
      try {
        const response = await fetch('/api/contact-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Ошибка отправки формы');
        }
        
        console.log('Form submitted successfully:', result);
        return result;
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      }
    };
    
    // Уведомления
    const showSuccessNotification = (message) => {
      showNotification(message, 'success');
    };
    
    const showErrorNotification = (message) => {
      showNotification(message, 'error');
    };
    
    const showNotification = (message, type) => {
      const notification = document.createElement('div');
      notification.className = `contact-notification ${type}`;
      notification.innerHTML = `
        ${type === 'success' ? 
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round"/></svg>' :
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round"/></svg>'
        }
        <span>${message}</span>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
    };
    
    // Маска для телефона
    const setupPhoneMask = () => {
      const phoneInput = document.getElementById('contact-phone');
      if (!phoneInput) return;
      
      phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.startsWith('7')) {
          value = value.substring(1);
        }
        
        if (value.length > 0) {
          formattedValue = '+7 ';
          if (value.length > 0) {
            formattedValue += '(' + value.substring(0, 3);
          }
          if (value.length >= 3) {
            formattedValue += ') ';
          }
          if (value.length > 3) {
            formattedValue += value.substring(3, 6);
          }
          if (value.length > 6) {
            formattedValue += '-' + value.substring(6, 8);
          }
          if (value.length > 8) {
            formattedValue += '-' + value.substring(8, 10);
          }
        }
        
        e.target.value = formattedValue;
      });
      
      phoneInput.addEventListener('focus', function(e) {
        if (e.target.value === '') {
          e.target.value = '+7 ';
        }
      });
    };
    
    // Автозаполнение темы при выборе решения
    const setupTopicAutoSelect = () => {
      const solutionCheckboxes = document.querySelectorAll('input[name="solutions"]');
      const topicSelect = document.getElementById('contact-topic');
      
      if (!topicSelect) return;
      
      solutionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          if (this.checked && !topicSelect.value) {
            // Автоматически выбираем соответствующую тему
            const solutionToTopic = {
              'crm': 'demo',
              'analytics': 'demo',
              'automation': 'integration',
              'integration': 'integration'
            };
            
            const topic = solutionToTopic[this.value];
            if (topic) {
              topicSelect.value = topic;
              topicSelect.style.animation = 'highlightField 0.5s ease-out';
              setTimeout(() => {
                topicSelect.style.animation = '';
              }, 500);
            }
          }
        });
      });
    };
    
    // Валидация в реальном времени
    const setupRealtimeValidation = () => {
      // Email
      const emailInput = document.getElementById('contact-email');
      if (emailInput) {
        emailInput.addEventListener('blur', function() {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const formGroup = this.closest('.form-group');
          
          if (this.value && !emailRegex.test(this.value)) {
            formGroup.classList.add('error');
            showFieldError(formGroup, 'Введите корректный email');
          } else {
            formGroup.classList.remove('error');
            hideFieldError(formGroup);
          }
        });
      }
      
      // Имя
      const nameInput = document.getElementById('contact-name');
      if (nameInput) {
        nameInput.addEventListener('blur', function() {
          const formGroup = this.closest('.form-group');
          
          if (this.value && this.value.trim().length < 2) {
            formGroup.classList.add('error');
            showFieldError(formGroup, 'Имя должно содержать минимум 2 символа');
          } else {
            formGroup.classList.remove('error');
            hideFieldError(formGroup);
          }
        });
      }
    };
    
    const showFieldError = (formGroup, message) => {
      let errorMsg = formGroup.querySelector('.error-message');
      if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
      }
      errorMsg.textContent = message;
    };
    
    const hideFieldError = (formGroup) => {
      const errorMsg = formGroup.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
    };
    
    // Добавляем стили для подсветки
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes highlightField {
          0% {
            background: rgba(255, 255, 255, 0.05);
          }
          50% {
            background: rgba(139, 92, 246, 0.2);
            border-color: var(--contact-gradient-start);
          }
          100% {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      `;
      document.head.appendChild(style);
    };
    
    // Прикрепляем обработчик к форме
    const form = document.getElementById('mainContactForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
    
    // Инициализация
    setupPhoneMask();
    setupTopicAutoSelect();
    setupRealtimeValidation();
    addStyles();
    
    // Cleanup
    return () => {
      if (form) {
        form.removeEventListener('submit', handleFormSubmit);
      }
    };
  }, []);

  return null;
}