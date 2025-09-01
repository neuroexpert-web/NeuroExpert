'use client';

import { useEffect } from 'react';

export default function PricingComparison() {
  useEffect(() => {
    // Данные для сравнения тарифов
    const comparisonData = {
      features: [
        { name: 'Аудит бизнеса', start: true, business: true, enterprise: true },
        { name: 'Базовый сайт/лендинг', start: true, business: true, enterprise: true },
        { name: 'Интернет-магазин', start: false, business: true, enterprise: true },
        { name: 'Мобильное приложение', start: false, business: true, enterprise: true },
        { name: 'CRM-система', start: '100 клиентов', business: '1000+ клиентов', enterprise: 'Безлимит' },
        { name: 'Интеграции с мессенджерами', start: '3 канала', business: '10+ каналов', enterprise: 'Безлимит' },
        { name: 'AI-аналитика', start: 'Базовая', business: 'Расширенная', enterprise: 'Полная' },
        { name: 'Прогнозирование', start: false, business: true, enterprise: true },
        { name: 'Автоматизация продаж', start: 'Базовая', business: 'Продвинутая', enterprise: 'Полная' },
        { name: 'Обучение команды', start: '1 раз', business: 'Ежемесячно', enterprise: 'По запросу' },
        { name: 'Техподдержка', start: '5/7', business: '24/7', enterprise: '24/7 + менеджер' },
        { name: 'SLA гарантии', start: false, business: '99.5%', enterprise: '99.9%' },
        { name: 'Выделенный сервер', start: false, business: false, enterprise: true },
        { name: 'Кастомная разработка', start: false, business: 'Ограничено', enterprise: 'Полная' },
        { name: 'API доступ', start: 'Базовый', business: 'Расширенный', enterprise: 'Полный' }
      ]
    };

    // Показать полное сравнение
    const showFullComparison = () => {
      const modal = document.createElement('div');
      modal.className = 'comparison-modal';
      modal.innerHTML = `
        <div class="comparison-modal-content">
          <div class="modal-header">
            <h2>Полное сравнение тарифов</h2>
            <button class="modal-close" aria-label="Закрыть">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="comparison-table-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Возможности</th>
                  <th class="plan-header start">
                    <div class="plan-name">Старт</div>
                    <div class="plan-price">39 900₽/мес</div>
                  </th>
                  <th class="plan-header business">
                    <div class="plan-name">Бизнес</div>
                    <div class="plan-price">89 900₽/мес</div>
                    <div class="plan-badge">Популярный</div>
                  </th>
                  <th class="plan-header enterprise">
                    <div class="plan-name">Enterprise</div>
                    <div class="plan-price">199 900₽/мес</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                ${comparisonData.features.map(feature => `
                  <tr>
                    <td class="feature-name">${feature.name}</td>
                    <td class="feature-value">${renderFeatureValue(feature.start)}</td>
                    <td class="feature-value">${renderFeatureValue(feature.business)}</td>
                    <td class="feature-value">${renderFeatureValue(feature.enterprise)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="comparison-footer">
            <p>Не уверены какой тариф выбрать? Начните с бесплатного пробного периода!</p>
            <button class="btn-start-trial">
              Начать бесплатно
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Обработчики
      modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
      
      modal.querySelector('.btn-start-trial').addEventListener('click', () => {
        showTrialForm();
        closeModal(modal);
      });
    };

    // Рендер значения функции
    const renderFeatureValue = (value) => {
      if (value === true) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="check-icon"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/></svg>';
      } else if (value === false) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="cross-icon"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>';
      } else {
        return `<span class="text-value">${value}</span>`;
      }
    };

    // Закрыть модальное окно
    const closeModal = (modal) => {
      modal.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        modal.remove();
      }, 300);
    };

    // Форма пробного периода
    const showTrialForm = () => {
      const form = document.createElement('div');
      form.className = 'trial-form-modal';
      form.innerHTML = `
        <div class="form-content">
          <h2>Начать 14-дневный пробный период</h2>
          <p class="form-subtitle">Без привязки карты. Полный доступ к тарифу Бизнес.</p>
          
          <form id="trialForm">
            <div class="form-group">
              <label>Email для регистрации *</label>
              <input type="email" name="email" required placeholder="your@email.com">
            </div>
            <div class="form-group">
              <label>Название компании *</label>
              <input type="text" name="company" required placeholder="ООО Название">
            </div>
            <div class="form-group">
              <label>Ваша роль</label>
              <select name="role">
                <option value="">Выберите роль</option>
                <option value="ceo">CEO / Владелец</option>
                <option value="cto">CTO / Технический управляющий</option>
                <option value="marketing">Маркетинг</option>
                <option value="sales">Продажи</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" name="agree" required>
                Я согласен с <a href="#" class="terms-link">условиями использования</a> и <a href="#" class="terms-link">политикой конфиденциальности</a>
              </label>
            </div>
            <button type="submit" class="btn-submit-trial">
              Начать пробный период
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </form>
        </div>
      `;
      
      document.body.appendChild(form);
      
      // Обработчики
      form.addEventListener('click', (e) => {
        if (e.target === form) {
          form.remove();
        }
      });
      
      form.querySelector('#trialForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showSuccessMessage();
        form.remove();
      });
    };

    // Сообщение об успехе
    const showSuccessMessage = () => {
      const message = document.createElement('div');
      message.className = 'success-message';
      message.innerHTML = `
        <div class="message-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="success-icon">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
          </svg>
          <h3>Отлично! Ваш пробный период активирован</h3>
          <p>Мы отправили инструкции на ваш email. Добро пожаловать в NeuroExpert!</p>
          <button class="btn-close-success">Понятно</button>
        </div>
      `;
      
      document.body.appendChild(message);
      
      message.querySelector('.btn-close-success').addEventListener('click', () => {
        message.remove();
      });
    };

    // ROI калькулятор
    const setupROICalculator = () => {
      const roiButton = document.createElement('button');
      roiButton.className = 'roi-calculator-btn';
      roiButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
          <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2"/>
        </svg>
        Калькулятор ROI
      `;
      
      const comparisonSection = document.querySelector('.pricing-comparison');
      if (comparisonSection) {
        comparisonSection.appendChild(roiButton);
        
        roiButton.addEventListener('click', showROICalculator);
      }
    };

    // Показать ROI калькулятор
    const showROICalculator = () => {
      const modal = document.createElement('div');
      modal.className = 'roi-modal';
      modal.innerHTML = `
        <div class="roi-content">
          <h2>Калькулятор возврата инвестиций (ROI)</h2>
          <p class="roi-subtitle">Рассчитайте экономию с NeuroExpert</p>
          
          <form id="roiForm">
            <div class="roi-inputs">
              <div class="form-group">
                <label>Количество сотрудников</label>
                <input type="number" id="roi-employees" value="50" min="1">
              </div>
              <div class="form-group">
                <label>Средняя зарплата (₽/мес)</label>
                <input type="number" id="roi-salary" value="80000" min="0">
              </div>
              <div class="form-group">
                <label>Часов на рутину в день</label>
                <input type="number" id="roi-hours" value="3" min="0" max="8" step="0.5">
              </div>
              <div class="form-group">
                <label>Текущие расходы на CRM (₽/мес)</label>
                <input type="number" id="roi-current-crm" value="50000" min="0">
              </div>
            </div>
            
            <div class="roi-results">
              <h3>Ваша экономия с NeuroExpert:</h3>
              <div class="roi-metric">
                <span class="metric-label">Экономия времени:</span>
                <span class="metric-value" id="time-saved">0 часов/мес</span>
              </div>
              <div class="roi-metric">
                <span class="metric-label">Экономия на зарплатах:</span>
                <span class="metric-value" id="salary-saved">0₽/мес</span>
              </div>
              <div class="roi-metric">
                <span class="metric-label">Экономия на CRM:</span>
                <span class="metric-value" id="crm-saved">0₽/мес</span>
              </div>
              <div class="roi-total">
                <span class="total-label">Общая экономия:</span>
                <span class="total-value" id="total-saved">0₽/мес</span>
              </div>
              <div class="roi-payback">
                <span class="payback-label">Окупаемость:</span>
                <span class="payback-value" id="payback-period">0 мес</span>
              </div>
            </div>
          </form>
          
          <button class="btn-close-roi">Закрыть</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Расчет ROI
      const calculateROI = () => {
        const employees = parseInt(document.getElementById('roi-employees').value) || 0;
        const salary = parseInt(document.getElementById('roi-salary').value) || 0;
        const hoursPerDay = parseFloat(document.getElementById('roi-hours').value) || 0;
        const currentCRM = parseInt(document.getElementById('roi-current-crm').value) || 0;
        
        // Расчеты
        const workDaysPerMonth = 22;
        const hoursSavedPerMonth = employees * hoursPerDay * workDaysPerMonth * 0.7; // 70% автоматизации
        const hourlyRate = salary / (8 * workDaysPerMonth);
        const salarySaved = Math.floor(hoursSavedPerMonth * hourlyRate);
        const crmSaved = Math.floor(currentCRM * 0.4); // 40% экономия
        const totalSaved = salarySaved + crmSaved;
        const neuroExpertCost = 89900; // Тариф Бизнес
        const paybackMonths = neuroExpertCost > 0 ? Math.ceil(neuroExpertCost / (totalSaved - neuroExpertCost)) : 0;
        
        // Обновление результатов
        document.getElementById('time-saved').textContent = `${Math.floor(hoursSavedPerMonth)} часов/мес`;
        document.getElementById('salary-saved').textContent = formatPrice(salarySaved) + '/мес';
        document.getElementById('crm-saved').textContent = formatPrice(crmSaved) + '/мес';
        document.getElementById('total-saved').textContent = formatPrice(totalSaved) + '/мес';
        document.getElementById('payback-period').textContent = paybackMonths > 0 ? `${paybackMonths} мес` : 'Мгновенно';
      };
      
      // Форматирование цены
      const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price) + '₽';
      };
      
      // Слушатели событий
      modal.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateROI);
      });
      
      modal.querySelector('.btn-close-roi').addEventListener('click', () => {
        modal.remove();
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Начальный расчет
      calculateROI();
    };

    // Обработчик кнопки сравнения
    const setupComparisonButton = () => {
      const compareBtn = document.querySelector('.btn-compare-all');
      if (compareBtn) {
        compareBtn.addEventListener('click', showFullComparison);
      }
    };

    // Добавляем стили
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .comparison-modal,
        .trial-form-modal,
        .success-message,
        .roi-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
          padding: 2rem;
          overflow-y: auto;
        }
        
        .comparison-modal-content,
        .roi-content {
          background: #1a1a2e;
          border-radius: 24px;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideInUp 0.3s ease-out;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header h2 {
          color: white;
          margin: 0;
        }
        
        .modal-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }
        
        .modal-close svg {
          width: 24px;
          height: 24px;
          stroke: white;
        }
        
        .comparison-table-wrapper {
          overflow-x: auto;
          overflow-y: auto;
          flex: 1;
          padding: 2rem;
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }
        
        .comparison-table th,
        .comparison-table td {
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .comparison-table th {
          background: rgba(139, 92, 246, 0.1);
          color: white;
          font-weight: 600;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .feature-name {
          text-align: left !important;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .plan-header {
          vertical-align: top;
        }
        
        .plan-header .plan-name {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        
        .plan-header .plan-price {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .plan-header .plan-badge {
          margin-top: 0.5rem;
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #ec4899, #fbbf24);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .check-icon {
          width: 24px;
          height: 24px;
          stroke: #10b981;
          margin: 0 auto;
        }
        
        .cross-icon {
          width: 20px;
          height: 20px;
          stroke: #ef4444;
          margin: 0 auto;
        }
        
        .text-value {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
        }
        
        .comparison-footer {
          padding: 2rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .comparison-footer p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
        }
        
        .btn-start-trial {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-start-trial:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }
        
        .form-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
        }
        
        .form-group label {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-group input[type="email"],
        .form-group input[type="text"],
        .form-group select {
          width: 100%;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }
        
        .form-group input[type="checkbox"] {
          margin-right: 0.5rem;
        }
        
        .terms-link {
          color: #8b5cf6;
          text-decoration: none;
        }
        
        .terms-link:hover {
          text-decoration: underline;
        }
        
        .btn-submit-trial {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 2rem;
        }
        
        .btn-submit-trial:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
        }
        
        .success-message {
          backdrop-filter: blur(10px);
        }
        
        .message-content {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          max-width: 500px;
          text-align: center;
          animation: bounceIn 0.5s ease-out;
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          stroke: #10b981;
          margin: 0 auto 1.5rem;
        }
        
        .message-content h3 {
          color: #1a1a2e;
          margin-bottom: 1rem;
        }
        
        .message-content p {
          color: #666;
          margin-bottom: 2rem;
        }
        
        .btn-close-success {
          padding: 0.875rem 2rem;
          background: #1a1a2e;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-close-success:hover {
          background: #2a2a3e;
        }
        
        .roi-calculator-btn {
          position: absolute;
          top: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .roi-calculator-btn:hover {
          background: rgba(16, 185, 129, 0.3);
          transform: translateY(-2px);
        }
        
        .roi-content {
          padding: 2.5rem;
        }
        
        .roi-content h2 {
          color: white;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .roi-subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
        }
        
        .roi-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .roi-inputs input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }
        
        .roi-results {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 16px;
          padding: 2rem;
        }
        
        .roi-results h3 {
          color: white;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .roi-metric {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .metric-label {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .metric-value {
          color: #10b981;
          font-weight: 600;
        }
        
        .roi-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          margin-top: 1rem;
          border-top: 2px solid rgba(16, 185, 129, 0.3);
        }
        
        .total-label {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }
        
        .total-value {
          font-size: 2rem;
          font-weight: 700;
          color: #10b981;
        }
        
        .roi-payback {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
        }
        
        .payback-label {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .payback-value {
          color: #8b5cf6;
          font-weight: 600;
        }
        
        .btn-close-roi {
          width: 100%;
          padding: 0.875rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 2rem;
        }
        
        .btn-close-roi:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @media (max-width: 768px) {
          .comparison-table {
            font-size: 0.875rem;
          }
          
          .comparison-table th,
          .comparison-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    setTimeout(() => {
      setupComparisonButton();
      setupROICalculator();
      addStyles();
    }, 500);

  }, []);

  return null;
}