'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './PricingCalculator.module.css';

export default function PricingCalculator() {
  // Состояния для всех параметров калькулятора
  const [selectedPlan, setSelectedPlan] = useState('plan-start');
  const [period, setPeriod] = useState(1);
  const [users, setUsers] = useState(10);
  const [dataVolume, setDataVolume] = useState(100);
  const [integrations, setIntegrations] = useState(5);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Дополнительные опции
  const [options, setOptions] = useState({
    aiAssistant: false,
    premiumSupport: false,
    customization: false,
    training: false
  });

  // Базовые цены тарифов
  const basePrices = {
    'plan-start': 39900,
    'plan-business': 89900,
    'plan-enterprise': 199900
  };

  // Цены дополнительных опций
  const optionPrices = {
    aiAssistant: 15000,
    premiumSupport: 10000,
    customization: 25000,
    training: 20000
  };

  // Расчет стоимости
  const calculatePrice = useCallback(() => {
    // Базовая цена
    let basePrice = basePrices[selectedPlan];
    
    // Дополнительная стоимость за пользователей
    let usersCost = 0;
    if (users > 10) {
      usersCost = (users - 10) * 500;
    }
    
    // Дополнительная стоимость за данные
    let dataCost = 0;
    if (dataVolume > 100) {
      dataCost = Math.floor((dataVolume - 100) / 100) * 1000;
    }
    
    // Дополнительная стоимость за интеграции
    let integrationsCost = 0;
    if (integrations > 5) {
      integrationsCost = (integrations - 5) * 2000;
    }
    
    // Стоимость дополнительных опций
    let optionsCost = 0;
    Object.entries(options).forEach(([key, value]) => {
      if (value) {
        optionsCost += optionPrices[key];
      }
    });
    
    // Общая стоимость до скидки
    const subtotal = basePrice + usersCost + dataCost + integrationsCost + optionsCost;
    
    // Расчет скидки
    let discount = 0;
    if (period === 3) {
      discount = subtotal * 0.05; // 5% скидка за квартал
    } else if (period === 12) {
      discount = subtotal * 0.15; // 15% скидка за год
    }
    
    // Итоговая стоимость
    const total = subtotal - discount;
    const monthlyPrice = total / period;
    
    return {
      basePrice,
      additionalCosts: usersCost + dataCost + integrationsCost,
      optionsCost,
      subtotal,
      discount,
      total,
      monthlyPrice
    };
  }, [selectedPlan, period, users, dataVolume, integrations, options]);

  const prices = calculatePrice();

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price));
  };

  // Обработчик изменения опций
  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Обработчик заказа
  const handleOrder = () => {
    setShowContactForm(true);
  };

  // Обработчик отправки формы
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('Заказ:', {
      ...data,
      plan: selectedPlan,
      period,
      users,
      dataVolume,
      integrations,
      options,
      total: prices.total
    });
    
    alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
    setShowContactForm(false);
  };

  return (
    <section className="pricing-section" id="pricing">
      <header className="section-header">
        <h2>Прозрачные цены без скрытых платежей</h2>
        <p>Гибкие тарифы для бизнеса любого размера. Платите только за то, что используете.</p>
      </header>

      <div className="pricing-container">
        {/* Выбор тарифа */}
        <div className="pricing-plans">
          <h3>1. Выберите базовый тариф</h3>
          <div className="plans-grid">
            <div 
              className={`pricing-plan glass-card ${selectedPlan === 'plan-start' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('plan-start')}
            >
              <h4>Start</h4>
              <div className="plan-price">₽{formatPrice(basePrices['plan-start'])}/мес</div>
              <ul className="plan-features">
                <li>До 10 пользователей</li>
                <li>100 ГБ хранилище</li>
                <li>5 интеграций</li>
                <li>Базовая аналитика</li>
                <li>Email поддержка</li>
              </ul>
            </div>

            <div 
              className={`pricing-plan glass-card recommended ${selectedPlan === 'plan-business' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('plan-business')}
            >
              <div className="recommended-badge">Популярный</div>
              <h4>Business</h4>
              <div className="plan-price">₽{formatPrice(basePrices['plan-business'])}/мес</div>
              <ul className="plan-features">
                <li>До 50 пользователей</li>
                <li>500 ГБ хранилище</li>
                <li>15 интеграций</li>
                <li>Расширенная аналитика</li>
                <li>Приоритетная поддержка</li>
                <li>AI-рекомендации</li>
              </ul>
            </div>

            <div 
              className={`pricing-plan glass-card ${selectedPlan === 'plan-enterprise' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('plan-enterprise')}
            >
              <h4>Enterprise</h4>
              <div className="plan-price">₽{formatPrice(basePrices['plan-enterprise'])}/мес</div>
              <ul className="plan-features">
                <li>Неограниченно пользователей</li>
                <li>Неограниченное хранилище</li>
                <li>Все интеграции</li>
                <li>Полная аналитика</li>
                <li>Персональный менеджер</li>
                <li>Кастомизация</li>
                <li>SLA 99.9%</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Период оплаты */}
        <div className="pricing-period">
          <h3>2. Выберите период оплаты</h3>
          <div className="period-options">
            <label className={`period-option ${period === 1 ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="period" 
                value="1"
                checked={period === 1}
                onChange={() => setPeriod(1)}
              />
              <span className="period-label">Ежемесячно</span>
              <span className="period-discount">Без скидки</span>
            </label>
            
            <label className={`period-option ${period === 3 ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="period" 
                value="3"
                checked={period === 3}
                onChange={() => setPeriod(3)}
              />
              <span className="period-label">Квартал</span>
              <span className="period-discount">Скидка 5%</span>
            </label>
            
            <label className={`period-option ${period === 12 ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="period" 
                value="12"
                checked={period === 12}
                onChange={() => setPeriod(12)}
              />
              <span className="period-label">Год</span>
              <span className="period-discount">Скидка 15%</span>
            </label>
          </div>
        </div>

        {/* Настройка параметров */}
        <div className="pricing-customization">
          <h3>3. Настройте под свои нужды</h3>
          
          <div className="slider-group">
            <label>
              <span className="slider-label">Количество пользователей: {users}</span>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={users}
                onChange={(e) => setUsers(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-info">
                {users > 10 && <span className="extra-cost">+₽{formatPrice((users - 10) * 500)}/мес</span>}
              </div>
            </label>
          </div>

          <div className="slider-group">
            <label>
              <span className="slider-label">Объём данных: {dataVolume} ГБ</span>
              <input 
                type="range" 
                min="10" 
                max="1000" 
                step="10"
                value={dataVolume}
                onChange={(e) => setDataVolume(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-info">
                {dataVolume > 100 && <span className="extra-cost">+₽{formatPrice(Math.floor((dataVolume - 100) / 100) * 1000)}/мес</span>}
              </div>
            </label>
          </div>

          <div className="slider-group">
            <label>
              <span className="slider-label">Количество интеграций: {integrations}</span>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={integrations}
                onChange={(e) => setIntegrations(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-info">
                {integrations > 5 && <span className="extra-cost">+₽{formatPrice((integrations - 5) * 2000)}/мес</span>}
              </div>
            </label>
          </div>
        </div>

        {/* Дополнительные опции */}
        <div className="pricing-options">
          <h3>4. Дополнительные опции</h3>
          <div className="options-grid">
            <label className={`option-card ${options.aiAssistant ? 'selected' : ''}`}>
              <input 
                type="checkbox" 
                checked={options.aiAssistant}
                onChange={() => handleOptionChange('aiAssistant')}
              />
              <div className="option-content">
                <h5>AI-ассистент Pro</h5>
                <p>Продвинутые AI функции и автоматизация</p>
                <span className="option-price">+₽{formatPrice(optionPrices.aiAssistant)}/мес</span>
              </div>
            </label>

            <label className={`option-card ${options.premiumSupport ? 'selected' : ''}`}>
              <input 
                type="checkbox" 
                checked={options.premiumSupport}
                onChange={() => handleOptionChange('premiumSupport')}
              />
              <div className="option-content">
                <h5>Premium поддержка</h5>
                <p>24/7 поддержка с SLA 1 час</p>
                <span className="option-price">+₽{formatPrice(optionPrices.premiumSupport)}/мес</span>
              </div>
            </label>

            <label className={`option-card ${options.customization ? 'selected' : ''}`}>
              <input 
                type="checkbox" 
                checked={options.customization}
                onChange={() => handleOptionChange('customization')}
              />
              <div className="option-content">
                <h5>Кастомизация</h5>
                <p>Индивидуальная настройка под ваш бизнес</p>
                <span className="option-price">+₽{formatPrice(optionPrices.customization)}/мес</span>
              </div>
            </label>

            <label className={`option-card ${options.training ? 'selected' : ''}`}>
              <input 
                type="checkbox" 
                checked={options.training}
                onChange={() => handleOptionChange('training')}
              />
              <div className="option-content">
                <h5>Обучение команды</h5>
                <p>Онлайн-курсы и личные тренинги</p>
                <span className="option-price">+₽{formatPrice(optionPrices.training)}/мес</span>
              </div>
            </label>
          </div>
        </div>

        {/* Итоговый расчет */}
        <div className="pricing-summary glass-card">
          <h3>Итоговая стоимость</h3>
          <div className="summary-breakdown">
            <div className="summary-line">
              <span>Базовый тариф:</span>
              <span>₽{formatPrice(prices.basePrice)}</span>
            </div>
            {prices.additionalCosts > 0 && (
              <div className="summary-line">
                <span>Дополнительные ресурсы:</span>
                <span>₽{formatPrice(prices.additionalCosts)}</span>
              </div>
            )}
            {prices.optionsCost > 0 && (
              <div className="summary-line">
                <span>Дополнительные опции:</span>
                <span>₽{formatPrice(prices.optionsCost)}</span>
              </div>
            )}
            {prices.discount > 0 && (
              <div className="summary-line discount">
                <span>Скидка за период:</span>
                <span>-₽{formatPrice(prices.discount)}</span>
              </div>
            )}
            <div className="summary-line total">
              <span>Итого за {period === 1 ? 'месяц' : period === 3 ? '3 месяца' : 'год'}:</span>
              <span>₽{formatPrice(prices.total)}</span>
            </div>
            {period > 1 && (
              <div className="summary-line monthly">
                <span>В месяц:</span>
                <span>₽{formatPrice(prices.monthlyPrice)}</span>
              </div>
            )}
          </div>
          
          <button 
            className="order-button"
            onClick={handleOrder}
          >
            Оформить подписку
          </button>
          
          <p className="summary-note">
            🔒 Безопасная оплата • Отмена в любое время • Гарантия возврата 30 дней
          </p>
        </div>
      </div>

      {/* Модальное окно с формой контакта */}
      {showContactForm && (
        <div className="contact-form-modal" onClick={() => setShowContactForm(false)}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <h2>Оформление подписки</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="company">Компания</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  required 
                  placeholder="ООО Рога и копыта"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Контактное лицо</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Иван Иванов"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="ivan@company.ru"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="comments">Комментарии</label>
                <textarea 
                  id="comments" 
                  name="comments" 
                  rows="3" 
                  placeholder="Дополнительные пожелания..."
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-submit">Отправить заявку</button>
                <button type="button" className="btn-cancel" onClick={() => setShowContactForm(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}