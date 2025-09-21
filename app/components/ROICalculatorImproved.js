'use client';

import { useState, useEffect, useCallback } from 'react';
import './ROICalculatorImproved.css';

export default function ROICalculatorImproved() {
  // Состояние калькулятора
  const [basePlan, setBasePlan] = useState('39900');
  const [users, setUsers] = useState(10);
  const [dataVolume, setDataVolume] = useState(100);
  const [integrations, setIntegrations] = useState(5);
  const [period, setPeriod] = useState('1');
  const [options, setOptions] = useState({
    support: false,
    api: false,
    custom: false,
    training: false
  });
  
  // ROI параметры
  const [currentRevenue, setCurrentRevenue] = useState(1000000);
  const [expectedGrowth, setExpectedGrowth] = useState(25);
  const [currentCosts, setCurrentCosts] = useState(300000);
  
  // Расчет стоимости
  const calculateCost = useCallback(() => {
    let basePrice = parseInt(basePlan);
    
    // Дополнительная стоимость за пользователей
    if (users > 100) {
      basePrice += (users - 100) * 100;
    }
    
    // Дополнительная стоимость за данные
    if (dataVolume > 1000) {
      basePrice += Math.floor((dataVolume - 1000) / 1000) * 5000;
    }
    
    // Дополнительная стоимость за интеграции
    if (integrations > 10) {
      basePrice += (integrations - 10) * 2000;
    }
    
    // Добавляем опции
    let optionsCost = 0;
    if (options.support) optionsCost += 10000;
    if (options.api) optionsCost += 15000;
    if (options.custom) optionsCost += 25000;
    
    let monthlyTotal = basePrice + optionsCost;
    
    // Скидка за период
    let discount = 0;
    if (period === '3') discount = 0.05;
    if (period === '12') discount = 0.15;
    
    const discountAmount = Math.round(monthlyTotal * discount);
    const finalMonthly = monthlyTotal - discountAmount;
    
    // Единоразовые платежи
    const oneTimeCost = options.training ? 30000 : 0;
    
    return {
      basePrice,
      optionsCost,
      discountAmount,
      monthlyTotal: finalMonthly,
      oneTimeCost,
      yearlyTotal: finalMonthly * 12 + oneTimeCost
    };
  }, [basePlan, users, dataVolume, integrations, period, options]);
  
  // Расчет ROI
  const calculateROI = useCallback(() => {
    const costs = calculateCost();
    const yearlyInvestment = costs.yearlyTotal;
    
    // Ожидаемый дополнительный доход от автоматизации
    const additionalRevenue = currentRevenue * (expectedGrowth / 100);
    
    // Ожидаемая экономия на операционных расходах (20% от текущих)
    const costSavings = currentCosts * 0.2;
    
    // Общая выгода
    const totalBenefit = additionalRevenue + costSavings;
    
    // ROI в процентах
    const roi = ((totalBenefit - yearlyInvestment) / yearlyInvestment) * 100;
    
    // Срок окупаемости в месяцах
    const paybackPeriod = yearlyInvestment / (totalBenefit / 12);
    
    return {
      yearlyInvestment,
      additionalRevenue,
      costSavings,
      totalBenefit,
      roi: Math.round(roi),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10
    };
  }, [calculateCost, currentRevenue, expectedGrowth, currentCosts]);
  
  const costs = calculateCost();
  const roi = calculateROI();
  
  // Обработчики изменений
  const handleOptionChange = (option) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };
  
  return (
    <div className="roi-calculator-improved glass-card">
      <h3>Калькулятор окупаемости и ROI</h3>
      <p className="calculator-subtitle">
        Рассчитайте реальную выгоду от внедрения NeuroExpert
      </p>
      
      <div className="calculator-content">
        {/* Левая колонка - Параметры системы */}
        <div className="calculator-column">
          <h4>Параметры системы</h4>
          
          {/* Выбор тарифа */}
          <div className="form-group">
            <label>Базовый тариф</label>
            <div className="plan-selector">
              <label className={`plan-option ${basePlan === '39900' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="base-plan" 
                  value="39900" 
                  checked={basePlan === '39900'}
                  onChange={(e) => setBasePlan(e.target.value)}
                />
                <div className="option-content">
                  <span className="plan-name">Старт</span>
                  <span className="plan-price">39 900₽</span>
                </div>
              </label>
              
              <label className={`plan-option ${basePlan === '89900' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="base-plan" 
                  value="89900"
                  checked={basePlan === '89900'}
                  onChange={(e) => setBasePlan(e.target.value)}
                />
                <div className="option-content">
                  <span className="plan-name">Бизнес</span>
                  <span className="plan-price">89 900₽</span>
                </div>
              </label>
              
              <label className={`plan-option ${basePlan === '199900' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="base-plan" 
                  value="199900"
                  checked={basePlan === '199900'}
                  onChange={(e) => setBasePlan(e.target.value)}
                />
                <div className="option-content">
                  <span className="plan-name">Enterprise</span>
                  <span className="plan-price">199 900₽</span>
                </div>
              </label>
            </div>
          </div>
          
          {/* Количество пользователей */}
          <div className="form-group">
            <label>
              Количество пользователей
              <span className="value-display">{users}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="1000" 
              value={users}
              onChange={(e) => setUsers(parseInt(e.target.value))}
              className="custom-slider"
            />
            <div className="slider-labels">
              <span>1</span>
              <span>500</span>
              <span>1000+</span>
            </div>
          </div>
          
          {/* Объем данных */}
          <div className="form-group">
            <label>
              Объем данных (ГБ)
              <span className="value-display">{dataVolume}</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max="10000" 
              value={dataVolume}
              onChange={(e) => setDataVolume(parseInt(e.target.value))}
              className="custom-slider"
              step="10"
            />
            <div className="slider-labels">
              <span>10 ГБ</span>
              <span>5 ТБ</span>
              <span>10 ТБ</span>
            </div>
          </div>
          
          {/* Период оплаты */}
          <div className="form-group">
            <label>Период оплаты</label>
            <div className="period-selector">
              <label className={`period-option ${period === '1' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="period" 
                  value="1"
                  checked={period === '1'}
                  onChange={(e) => setPeriod(e.target.value)}
                />
                <div className="option-content">
                  <span className="period-name">Месяц</span>
                  <span className="period-discount">0%</span>
                </div>
              </label>
              
              <label className={`period-option ${period === '3' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="period" 
                  value="3"
                  checked={period === '3'}
                  onChange={(e) => setPeriod(e.target.value)}
                />
                <div className="option-content">
                  <span className="period-name">Квартал</span>
                  <span className="period-discount">-5%</span>
                </div>
              </label>
              
              <label className={`period-option ${period === '12' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="period" 
                  value="12"
                  checked={period === '12'}
                  onChange={(e) => setPeriod(e.target.value)}
                />
                <div className="option-content">
                  <span className="period-name">Год</span>
                  <span className="period-discount">-15%</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Правая колонка - Параметры бизнеса */}
        <div className="calculator-column">
          <h4>Параметры вашего бизнеса</h4>
          
          {/* Текущая выручка */}
          <div className="form-group">
            <label>
              Текущая годовая выручка
              <span className="value-display">₽{currentRevenue.toLocaleString('ru-RU')}</span>
            </label>
            <input 
              type="range" 
              min="100000" 
              max="100000000" 
              value={currentRevenue}
              onChange={(e) => setCurrentRevenue(parseInt(e.target.value))}
              className="custom-slider"
              step="100000"
            />
            <div className="slider-labels">
              <span>100К</span>
              <span>50М</span>
              <span>100М+</span>
            </div>
          </div>
          
          {/* Ожидаемый рост */}
          <div className="form-group">
            <label>
              Ожидаемый рост выручки
              <span className="value-display">{expectedGrowth}%</span>
            </label>
            <input 
              type="range" 
              min="5" 
              max="100" 
              value={expectedGrowth}
              onChange={(e) => setExpectedGrowth(parseInt(e.target.value))}
              className="custom-slider"
              step="5"
            />
            <div className="slider-labels">
              <span>5%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Текущие операционные расходы */}
          <div className="form-group">
            <label>
              Операционные расходы в год
              <span className="value-display">₽{currentCosts.toLocaleString('ru-RU')}</span>
            </label>
            <input 
              type="range" 
              min="50000" 
              max="10000000" 
              value={currentCosts}
              onChange={(e) => setCurrentCosts(parseInt(e.target.value))}
              className="custom-slider"
              step="50000"
            />
            <div className="slider-labels">
              <span>50К</span>
              <span>5М</span>
              <span>10М</span>
            </div>
          </div>
          
          {/* Дополнительные опции */}
          <div className="form-group">
            <label>Дополнительные услуги</label>
            <div className="options-list">
              <label className={`option-item ${options.support ? 'selected' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={options.support}
                  onChange={() => handleOptionChange('support')}
                />
                <span className="option-text">
                  Поддержка 24/7 (+10 000₽/мес)
                </span>
              </label>
              
              <label className={`option-item ${options.api ? 'selected' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={options.api}
                  onChange={() => handleOptionChange('api')}
                />
                <span className="option-text">
                  Расширенный API (+15 000₽/мес)
                </span>
              </label>
              
              <label className={`option-item ${options.custom ? 'selected' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={options.custom}
                  onChange={() => handleOptionChange('custom')}
                />
                <span className="option-text">
                  Кастомные интеграции (+25 000₽/мес)
                </span>
              </label>
              
              <label className={`option-item ${options.training ? 'selected' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={options.training}
                  onChange={() => handleOptionChange('training')}
                />
                <span className="option-text">
                  Обучение команды (+30 000₽ разово)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Результаты расчета */}
      <div className="calculation-results">
        <div className="results-grid">
          {/* Стоимость */}
          <div className="result-card cost-card">
            <h5>Инвестиции</h5>
            <div className="result-details">
              <div className="detail-row">
                <span>В месяц:</span>
                <span className="value">₽{costs.monthlyTotal.toLocaleString('ru-RU')}</span>
              </div>
              <div className="detail-row">
                <span>В год:</span>
                <span className="value primary">₽{costs.yearlyTotal.toLocaleString('ru-RU')}</span>
              </div>
            </div>
          </div>
          
          {/* Выгода */}
          <div className="result-card benefit-card">
            <h5>Ожидаемая выгода</h5>
            <div className="result-details">
              <div className="detail-row">
                <span>Рост выручки:</span>
                <span className="value">₽{roi.additionalRevenue.toLocaleString('ru-RU')}</span>
              </div>
              <div className="detail-row">
                <span>Экономия:</span>
                <span className="value">₽{roi.costSavings.toLocaleString('ru-RU')}</span>
              </div>
              <div className="detail-row total">
                <span>Итого в год:</span>
                <span className="value success">₽{roi.totalBenefit.toLocaleString('ru-RU')}</span>
              </div>
            </div>
          </div>
          
          {/* ROI */}
          <div className="result-card roi-card">
            <h5>Показатели эффективности</h5>
            <div className="roi-metrics">
              <div className="metric">
                <span className="metric-label">ROI</span>
                <span className="metric-value highlight">{roi.roi}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Окупаемость</span>
                <span className="metric-value">{roi.paybackPeriod} мес</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Визуализация ROI */}
        <div className="roi-visualization">
          <div className="roi-chart">
            <div className="chart-bars">
              <div className="bar investment" style={{height: '40%'}}>
                <span className="bar-label">Инвестиции</span>
                <span className="bar-value">₽{(roi.yearlyInvestment/1000).toFixed(0)}К</span>
              </div>
              <div className="bar benefit" style={{height: '100%'}}>
                <span className="bar-label">Выгода</span>
                <span className="bar-value">₽{(roi.totalBenefit/1000).toFixed(0)}К</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="calculator-actions">
          <button className="btn-primary">
            Получить детальный расчет
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="btn-secondary">
            Обсудить с менеджером
          </button>
        </div>
      </div>
    </div>
  );
}