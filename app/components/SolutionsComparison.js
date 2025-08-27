'use client';

import { useEffect } from 'react';

export default function SolutionsComparison() {
  useEffect(() => {
    // Калькулятор экономии для каждого решения
    const addEconomyCalculators = () => {
      const solutionCards = document.querySelectorAll('.solution-card');
      
      solutionCards.forEach(card => {
        const detailsSection = card.querySelector('.solution-details');
        if (detailsSection && !detailsSection.querySelector('.economy-calculator')) {
          const calculator = createEconomyCalculator(card);
          detailsSection.appendChild(calculator);
        }
      });
    };

    // Создание калькулятора экономии
    const createEconomyCalculator = (card) => {
      const solutionName = card.querySelector('h3').textContent;
      const metricValue = card.querySelector('.metric-value')?.textContent || '+30%';
      
      const calculator = document.createElement('div');
      calculator.className = 'economy-calculator';
      calculator.innerHTML = `
        <h5>Калькулятор экономии</h5>
        <div class="calc-inputs">
          <div class="input-group">
            <label>Текущие затраты (₽/мес)</label>
            <input type="number" class="current-cost" placeholder="100000" min="0">
          </div>
          <div class="input-group">
            <label>Количество сотрудников</label>
            <input type="number" class="employees-count" placeholder="10" min="1">
          </div>
        </div>
        <div class="calc-results" style="display: none;">
          <div class="result-item">
            <span class="result-label">Экономия в месяц:</span>
            <span class="result-value monthly-saving">0 ₽</span>
          </div>
          <div class="result-item">
            <span class="result-label">Экономия в год:</span>
            <span class="result-value yearly-saving">0 ₽</span>
          </div>
          <div class="result-item">
            <span class="result-label">Окупаемость:</span>
            <span class="result-value payback-period">0 мес</span>
          </div>
        </div>
        <button class="calc-btn">Рассчитать экономию</button>
      `;
      
      // Обработчик расчета
      const calcBtn = calculator.querySelector('.calc-btn');
      calcBtn.addEventListener('click', () => {
        calculateEconomy(calculator, solutionName);
      });
      
      // Автоматический расчет при вводе
      const inputs = calculator.querySelectorAll('input');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          const currentCost = calculator.querySelector('.current-cost').value;
          const employees = calculator.querySelector('.employees-count').value;
          if (currentCost && employees) {
            calculateEconomy(calculator, solutionName);
          }
        });
      });
      
      return calculator;
    };

    // Расчет экономии
    const calculateEconomy = (calculator, solutionName) => {
      const currentCost = parseFloat(calculator.querySelector('.current-cost').value) || 0;
      const employees = parseFloat(calculator.querySelector('.employees-count').value) || 1;
      
      // Базовые коэффициенты экономии для разных решений
      const savingRates = {
        'Автоматизация продаж': 0.35,
        'AI-маркетинг и сегментация': 0.40,
        'Прогнозирование спроса': 0.28,
        'Кредитный скоринг 2.0': 0.60,
        'Мониторинг качества': 0.45,
        'Персонализация UX': 0.30
      };
      
      const baseSavingRate = savingRates[solutionName] || 0.30;
      const employeeMultiplier = Math.min(1 + (employees - 1) * 0.02, 1.5); // До 50% больше экономии
      const effectiveSavingRate = baseSavingRate * employeeMultiplier;
      
      const monthlySaving = currentCost * effectiveSavingRate;
      const yearlySaving = monthlySaving * 12;
      
      // Стоимость решения (примерная)
      const solutionCosts = {
        'Автоматизация продаж': 89900,
        'AI-маркетинг и сегментация': 129900,
        'Прогнозирование спроса': 149900,
        'Кредитный скоринг 2.0': 199900,
        'Мониторинг качества': 179900,
        'Персонализация UX': 99900
      };
      
      const solutionCost = solutionCosts[solutionName] || 99900;
      const paybackMonths = monthlySaving > 0 ? Math.ceil(solutionCost / monthlySaving) : 0;
      
      // Обновляем результаты
      const results = calculator.querySelector('.calc-results');
      results.style.display = 'block';
      
      calculator.querySelector('.monthly-saving').textContent = formatCurrency(monthlySaving);
      calculator.querySelector('.yearly-saving').textContent = formatCurrency(yearlySaving);
      calculator.querySelector('.payback-period').textContent = `${paybackMonths} мес`;
      
      // Анимация результатов
      results.style.animation = 'fadeInUp 0.5s ease-out';
      
      // Подсветка выгодности
      if (paybackMonths <= 6) {
        results.classList.add('excellent-roi');
      } else if (paybackMonths <= 12) {
        results.classList.add('good-roi');
      }
    };

    // Форматирование валюты
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    // Интерактивное сравнение решений
    const addComparisonMode = () => {
      const compareButton = document.createElement('button');
      compareButton.className = 'compare-solutions-btn';
      compareButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/>
        </svg>
        Режим сравнения (0)
      `;
      
      const filterSection = document.querySelector('.filter-section');
      if (filterSection) {
        filterSection.appendChild(compareButton);
      }
      
      let compareMode = false;
      const selectedSolutions = new Set();
      
      compareButton.addEventListener('click', () => {
        compareMode = !compareMode;
        document.body.classList.toggle('compare-mode', compareMode);
        
        if (!compareMode && selectedSolutions.size > 0) {
          showComparisonResults(Array.from(selectedSolutions));
          selectedSolutions.clear();
          updateCompareButton();
        }
      });
      
      // Добавляем чекбоксы для сравнения
      const solutionCards = document.querySelectorAll('.solution-card');
      solutionCards.forEach(card => {
        const checkbox = document.createElement('div');
        checkbox.className = 'compare-checkbox';
        checkbox.innerHTML = `
          <input type="checkbox" id="compare-${card.querySelector('h3').textContent.replace(/\s/g, '-')}">
          <label>Сравнить</label>
        `;
        card.appendChild(checkbox);
        
        checkbox.querySelector('input').addEventListener('change', function() {
          const solutionName = card.querySelector('h3').textContent;
          if (this.checked) {
            selectedSolutions.add(solutionName);
          } else {
            selectedSolutions.delete(solutionName);
          }
          updateCompareButton();
        });
      });
      
      const updateCompareButton = () => {
        compareButton.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/>
          </svg>
          Режим сравнения (${selectedSolutions.size})
        `;
      };
    };

    // Показать результаты сравнения
    const showComparisonResults = (solutions) => {
      if (solutions.length < 2) {
        showNotification('Выберите минимум 2 решения для сравнения');
        return;
      }
      
      const modal = document.createElement('div');
      modal.className = 'solutions-comparison-modal';
      modal.innerHTML = `
        <div class="comparison-modal-content">
          <h2>Сравнение решений</h2>
          <div class="comparison-grid">
            ${solutions.map(solution => `
              <div class="comparison-item">
                <h3>${solution}</h3>
                <div class="comparison-metrics">
                  <div class="metric-row">
                    <span>ROI</span>
                    <span class="metric-value">${getROIForSolution(solution)}</span>
                  </div>
                  <div class="metric-row">
                    <span>Внедрение</span>
                    <span class="metric-value">${getTimeForSolution(solution)}</span>
                  </div>
                  <div class="metric-row">
                    <span>Стоимость</span>
                    <span class="metric-value">${getPriceForSolution(solution)}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="comparison-recommendation">
            <h4>Рекомендация AI</h4>
            <p>${getAIRecommendation(solutions)}</p>
          </div>
          <button class="close-comparison">Закрыть</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      modal.querySelector('.close-comparison').addEventListener('click', () => {
        modal.remove();
      });
    };

    // Вспомогательные функции для получения данных
    const getROIForSolution = (solutionName) => {
      const roi = {
        'Автоматизация продаж': '320%',
        'AI-маркетинг и сегментация': '280%',
        'Прогнозирование спроса': '250%',
        'Кредитный скоринг 2.0': '400%',
        'Мониторинг качества': '350%',
        'Персонализация UX': '200%'
      };
      return roi[solutionName] || '200%';
    };

    const getTimeForSolution = (solutionName) => {
      const time = {
        'Автоматизация продаж': '2-3 нед',
        'AI-маркетинг и сегментация': '3-4 нед',
        'Прогнозирование спроса': '4-5 нед',
        'Кредитный скоринг 2.0': '3-4 нед',
        'Мониторинг качества': '5-6 нед',
        'Персонализация UX': '2-3 нед'
      };
      return time[solutionName] || '3-4 нед';
    };

    const getPriceForSolution = (solutionName) => {
      const prices = {
        'Автоматизация продаж': 'от 89 900 ₽',
        'AI-маркетинг и сегментация': 'от 129 900 ₽',
        'Прогнозирование спроса': 'от 149 900 ₽',
        'Кредитный скоринг 2.0': 'от 199 900 ₽',
        'Мониторинг качества': 'от 179 900 ₽',
        'Персонализация UX': 'от 99 900 ₽'
      };
      return prices[solutionName] || 'от 99 900 ₽';
    };

    const getAIRecommendation = (solutions) => {
      if (solutions.includes('Автоматизация продаж') && solutions.includes('AI-маркетинг и сегментация')) {
        return 'Отличная комбинация! Эти решения работают синергично. Автоматизация продаж увеличит конверсию, а AI-маркетинг привлечёт более качественные лиды. Рекомендуем начать с автоматизации продаж.';
      }
      if (solutions.includes('Кредитный скоринг 2.0')) {
        return 'Кредитный скоринг имеет самый высокий ROI. Рекомендуем начать с него, если ваш бизнес связан с финансовыми услугами.';
      }
      return 'Все выбранные решения эффективны. Рекомендуем начать с решения с наименьшим сроком внедрения для быстрого получения результатов.';
    };

    // Уведомления
    const showNotification = (message) => {
      const notification = document.createElement('div');
      notification.className = 'comparison-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 0.875rem;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    };

    // Добавляем стили
    const addComparisonStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .economy-calculator {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .economy-calculator h5 {
          margin-bottom: 1rem;
          color: white;
          font-size: 1.125rem;
        }
        
        .calc-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }
        
        .input-group input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }
        
        .calc-results {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
        }
        
        .result-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        
        .result-label {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .result-value {
          font-weight: 600;
          color: white;
        }
        
        .calc-results.excellent-roi {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .calc-results.good-roi {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        
        .calc-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .calc-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        
        .compare-solutions-btn {
          margin-left: auto;
          padding: 0.75rem 1.5rem;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .compare-solutions-btn:hover {
          background: rgba(139, 92, 246, 0.3);
        }
        
        .compare-checkbox {
          position: absolute;
          top: 1rem;
          left: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 10;
        }
        
        body.compare-mode .compare-checkbox {
          opacity: 1;
        }
        
        .compare-checkbox input {
          margin-right: 0.5rem;
        }
        
        .compare-checkbox label {
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .solutions-comparison-modal {
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
        }
        
        .comparison-modal-content {
          background: #1a1a2e;
          border-radius: 20px;
          padding: 2rem;
          max-width: 900px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .comparison-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .comparison-item h3 {
          color: white;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }
        
        .metric-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .comparison-recommendation {
          background: rgba(139, 92, 246, 0.1);
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }
        
        .comparison-recommendation h4 {
          color: #a78bfa;
          margin-bottom: 0.75rem;
        }
        
        .comparison-recommendation p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }
        
        .close-comparison {
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
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    setTimeout(() => {
      addEconomyCalculators();
      addComparisonMode();
      addComparisonStyles();
    }, 600);

  }, []);

  return null;
}