'use client';

import { useEffect } from 'react';

export default function PricingCalculator() {
  useEffect(() => {
    // Расчет стоимости
    const calculatePrice = () => {
      // Базовые цены
      const basePrices = {
        'plan-start': 39900,
        'plan-business': 89900,
        'plan-enterprise': 199900
      };
      
      // Получаем выбранный тариф
      const selectedPlan = document.querySelector('input[name="base-plan"]:checked');
      const basePrice = selectedPlan ? parseInt(selectedPlan.value) : 39900;
      
      // Получаем количество пользователей
      const usersSlider = document.getElementById('users-slider');
      const users = parseInt(usersSlider.value);
      
      // Дополнительная стоимость за пользователей
      let usersCost = 0;
      if (users > 10) {
        usersCost = (users - 10) * 500; // 500₽ за каждого дополнительного пользователя
      }
      
      // Получаем объем данных
      const dataSlider = document.getElementById('data-slider');
      const dataGB = parseInt(dataSlider.value);
      
      // Дополнительная стоимость за данные
      let dataCost = 0;
      if (dataGB > 100) {
        dataCost = Math.floor((dataGB - 100) / 100) * 1000; // 1000₽ за каждые 100ГБ
      }
      
      // Получаем количество интеграций
      const integrationsSlider = document.getElementById('integrations-slider');
      const integrations = parseInt(integrationsSlider.value);
      
      // Дополнительная стоимость за интеграции
      let integrationsCost = 0;
      if (integrations > 5) {
        integrationsCost = (integrations - 5) * 2000; // 2000₽ за каждую дополнительную интеграцию
      }
      
      // Дополнительные опции
      let optionsCost = 0;
      const optionCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      optionCheckboxes.forEach(checkbox => {
        optionsCost += parseInt(checkbox.value);
      });
      
      // Общая стоимость до скидки
      const subtotal = basePrice + usersCost + dataCost + integrationsCost + optionsCost;
      
      // Получаем период
      const selectedPeriod = document.querySelector('input[name="period"]:checked');
      const periodMonths = selectedPeriod ? parseInt(selectedPeriod.value) : 1;
      
      // Расчет скидки
      let discount = 0;
      if (periodMonths === 3) {
        discount = subtotal * 0.05; // 5% скидка за квартал
      } else if (periodMonths === 12) {
        discount = subtotal * 0.15; // 15% скидка за год
      }
      
      // Итоговая стоимость
      const total = subtotal - discount;
      
      // Обновляем отображение
      updatePriceDisplay(basePrice, optionsCost + usersCost + dataCost + integrationsCost, discount, total);
    };
    
    // Обновление отображения цен
    const updatePriceDisplay = (base, options, discount, total) => {
      const baseCostEl = document.getElementById('base-cost');
      const optionsCostEl = document.getElementById('options-cost');
      const discountAmountEl = document.getElementById('discount-amount');
      const totalCostEl = document.getElementById('total-cost');
      
      if (baseCostEl) baseCostEl.textContent = formatPrice(base);
      if (optionsCostEl) optionsCostEl.textContent = formatPrice(options);
      if (discountAmountEl) discountAmountEl.textContent = discount > 0 ? `-${formatPrice(discount)}` : '0₽';
      if (totalCostEl) {
        totalCostEl.textContent = formatPrice(total);
        // Анимация изменения цены
        totalCostEl.style.animation = 'priceUpdate 0.5s ease-out';
        setTimeout(() => {
          totalCostEl.style.animation = '';
        }, 500);
      }
    };
    
    // Форматирование цены
    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price) + '₽';
    };
    
    // Обновление отображения значений слайдеров
    const updateSliderDisplays = () => {
      // Пользователи
      const usersSlider = document.getElementById('users-slider');
      const usersValue = document.getElementById('users-value');
      if (usersSlider && usersValue) {
        usersSlider.addEventListener('input', function() {
          usersValue.textContent = this.value;
          calculatePrice();
        });
      }
      
      // Данные
      const dataSlider = document.getElementById('data-slider');
      const dataValue = document.getElementById('data-value');
      if (dataSlider && dataValue) {
        dataSlider.addEventListener('input', function() {
          const gb = parseInt(this.value);
          if (gb >= 1000) {
            dataValue.textContent = (gb / 1000).toFixed(1) + ' ТБ';
          } else {
            dataValue.textContent = gb + ' ГБ';
          }
          calculatePrice();
        });
      }
      
      // Интеграции
      const integrationsSlider = document.getElementById('integrations-slider');
      const integrationsValue = document.getElementById('integrations-value');
      if (integrationsSlider && integrationsValue) {
        integrationsSlider.addEventListener('input', function() {
          integrationsValue.textContent = this.value;
          calculatePrice();
        });
      }
    };
    
    // Добавление слушателей событий
    const setupEventListeners = () => {
      // Выбор тарифа
      const planRadios = document.querySelectorAll('input[name="base-plan"]');
      planRadios.forEach(radio => {
        radio.addEventListener('change', calculatePrice);
      });
      
      // Выбор периода
      const periodRadios = document.querySelectorAll('input[name="period"]');
      periodRadios.forEach(radio => {
        radio.addEventListener('change', calculatePrice);
      });
      
      // Дополнительные опции
      const optionCheckboxes = document.querySelectorAll('input[type="checkbox"]');
      optionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
      });
      
      // Кнопки выбора тарифа
      const selectButtons = document.querySelectorAll('.plan-select-btn');
      selectButtons.forEach(button => {
        button.addEventListener('click', function() {
          const planType = this.getAttribute('data-plan');
          selectPlan(planType);
        });
      });
    };
    
    // Выбор тарифа через кнопку
    const selectPlan = (planType) => {
      const planMap = {
        'start': 'plan-start',
        'business': 'plan-business',
        'enterprise': 'plan-enterprise'
      };
      
      const radioId = planMap[planType];
      if (radioId) {
        const radio = document.getElementById(radioId);
        if (radio) {
          radio.checked = true;
          calculatePrice();
          
          // Прокрутка к калькулятору
          const calculator = document.querySelector('.pricing-calculator');
          if (calculator) {
            calculator.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          
          // Подсветка выбранного тарифа
          showPlanHighlight(planType);
        }
      }
    };
    
    // Подсветка выбранного тарифа
    const showPlanHighlight = (planType) => {
      const allPlans = document.querySelectorAll('.pricing-plan');
      allPlans.forEach(plan => {
        plan.classList.remove('selected');
      });
      
      const selectedPlan = document.querySelector(`[data-plan="${planType}"]`);
      if (selectedPlan) {
        selectedPlan.classList.add('selected');
        selectedPlan.style.animation = 'planSelect 0.5s ease-out';
        setTimeout(() => {
          selectedPlan.style.animation = '';
        }, 500);
      }
    };
    
    // Тултипы для слайдеров
    const setupTooltips = () => {
      const sliders = document.querySelectorAll('.custom-slider');
      
      sliders.forEach(slider => {
        const tooltip = slider.getAttribute('data-tooltip');
        if (tooltip) {
          slider.addEventListener('mouseenter', function(e) {
            showTooltip(e.target, tooltip);
          });
          
          slider.addEventListener('mouseleave', function() {
            hideTooltip();
          });
        }
      });
    };
    
    // Показать тултип
    const showTooltip = (element, text) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'slider-tooltip';
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
        max-width: 250px;
        text-align: center;
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
    
    // Обработчики кнопок действий
    const setupActionButtons = () => {
      // Получить индивидуальное предложение
      const getOfferBtn = document.querySelector('.btn-get-offer');
      if (getOfferBtn) {
        getOfferBtn.addEventListener('click', () => {
          collectAndSendOffer();
        });
      }
      
      // Связаться с отделом продаж
      const contactSalesBtn = document.querySelector('.btn-contact-sales');
      if (contactSalesBtn) {
        contactSalesBtn.addEventListener('click', () => {
          showContactForm();
        });
      }
    };
    
    // Сбор данных и отправка предложения
    const collectAndSendOffer = () => {
      const data = {
        plan: document.querySelector('input[name="base-plan"]:checked')?.id,
        users: document.getElementById('users-slider')?.value,
        data: document.getElementById('data-slider')?.value,
        integrations: document.getElementById('integrations-slider')?.value,
        period: document.querySelector('input[name="period"]:checked')?.value,
        options: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.name),
        totalPrice: document.getElementById('total-cost')?.textContent
      };
      
      // Показываем уведомление
      showNotification('Ваше предложение формируется. Мы свяжемся с вами в течение 24 часов!');
      
      // Здесь можно добавить отправку на сервер
      console.log('Offer data:', data);
    };
    
    // Показать форму контакта
    const showContactForm = () => {
      const form = document.createElement('div');
      form.className = 'contact-form-modal';
      form.innerHTML = `
        <div class="form-content">
          <h2>Связаться с отделом продаж</h2>
          <form id="salesContactForm">
            <div class="form-group">
              <label>Имя *</label>
              <input type="text" name="name" required>
            </div>
            <div class="form-group">
              <label>Компания</label>
              <input type="text" name="company">
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" name="email" required>
            </div>
            <div class="form-group">
              <label>Телефон *</label>
              <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
              <label>Комментарий</label>
              <textarea name="comment" rows="3" placeholder="Расскажите о ваших потребностях"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-submit">Отправить</button>
              <button type="button" class="btn-cancel">Отмена</button>
            </div>
          </form>
        </div>
      `;
      
      document.body.appendChild(form);
      
      // Обработчики
      form.querySelector('.btn-cancel').addEventListener('click', () => {
        form.remove();
      });
      
      form.querySelector('#salesContactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Спасибо! Наш менеджер свяжется с вами в ближайшее время.');
        form.remove();
      });
    };
    
    // Уведомления
    const showNotification = (message) => {
      const notification = document.createElement('div');
      notification.className = 'pricing-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 0.875rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
        z-index: 10000;
        max-width: 350px;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
    };
    
    // Добавляем стили
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .pricing-plan.selected {
          transform: scale(1.08);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.5);
        }
        
        @keyframes planSelect {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1.08);
          }
        }
        
        @keyframes priceUpdate {
          0% {
            transform: scale(1);
            color: white;
          }
          50% {
            transform: scale(1.2);
            color: #fbbf24;
          }
          100% {
            transform: scale(1);
            color: white;
          }
        }
        
        .contact-form-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
          padding: 2rem;
        }
        
        .form-content {
          background: #1a1a2e;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 500px;
          width: 100%;
          animation: slideInUp 0.3s ease-out;
        }
        
        .form-content h2 {
          color: white;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .form-content .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-content label {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-content input,
        .form-content textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }
        
        .form-content input:focus,
        .form-content textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }
        
        .btn-submit,
        .btn-cancel {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .btn-submit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }
        
        .btn-submit:hover {
          transform: translateY(-2px);
        }
        
        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }
        
        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
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
      updateSliderDisplays();
      setupEventListeners();
      setupTooltips();
      setupActionButtons();
      calculatePrice(); // Начальный расчет
      addStyles();
    }, 500);

  }, []);

  return null;
}