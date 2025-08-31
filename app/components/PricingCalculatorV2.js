'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './PricingCalculator.module.css';

export default function PricingCalculatorV2() {
  // Тип услуги: subscription (подписка) или development (разработка)
  const [serviceType, setServiceType] = useState('subscription');
  
  // Состояния для подписки
  const [selectedPlan, setSelectedPlan] = useState('plan-start');
  const [period, setPeriod] = useState(1);
  const [users, setUsers] = useState(10);
  const [dataVolume, setDataVolume] = useState(100);
  const [integrations, setIntegrations] = useState(5);
  
  // Состояния для разработки
  const [developmentType, setDevelopmentType] = useState('website');
  const [projectComplexity, setProjectComplexity] = useState('standard');
  const [designLevel, setDesignLevel] = useState('template');
  const [features, setFeatures] = useState({
    seo: true,
    analytics: false,
    crm: false,
    payment: false,
    multilang: false,
    mobile: false,
    admin: true,
    api: false
  });
  
  // Дополнительные опции для обоих типов
  const [options, setOptions] = useState({
    aiAssistant: false,
    premiumSupport: false,
    customization: false,
    training: false,
    maintenance: false
  });
  
  const [showContactForm, setShowContactForm] = useState(false);
  const [urgentDelivery, setUrgentDelivery] = useState(false);

  // Базовые цены для подписки
  const subscriptionPrices = {
    'plan-start': 39900,
    'plan-business': 89900,
    'plan-enterprise': 199900
  };

  // Базовые цены для разработки
  const developmentBasePrices = {
    website: {
      simple: 150000,    // Лендинг, визитка
      standard: 300000,  // Корпоративный сайт
      complex: 500000    // Портал, каталог
    },
    ecommerce: {
      simple: 250000,    // До 100 товаров
      standard: 500000,  // До 1000 товаров  
      complex: 1000000   // Маркетплейс
    },
    mobile: {
      simple: 500000,    // Одна платформа
      standard: 800000,  // iOS + Android
      complex: 1500000   // Кроссплатформенное с backend
    },
    webapp: {
      simple: 400000,    // SaaS MVP
      standard: 800000,  // Полноценное приложение
      complex: 1500000   // Enterprise решение
    }
  };

  // Цены за функции
  const featurePrices = {
    seo: 30000,
    analytics: 25000,
    crm: 50000,
    payment: 40000,
    multilang: 35000,
    mobile: 45000,
    admin: 20000,
    api: 60000
  };

  // Коэффициенты для дизайна
  const designMultipliers = {
    template: 1,      // Готовый шаблон
    custom: 1.5,      // Индивидуальный дизайн
    premium: 2        // Премиум дизайн с анимациями
  };

  // Цены дополнительных опций
  const optionPrices = {
    aiAssistant: 15000,
    premiumSupport: 10000,
    customization: 25000,
    training: 20000,
    maintenance: 30000
  };

  // Расчет стоимости подписки
  const calculateSubscriptionPrice = useCallback(() => {
    const basePrice = subscriptionPrices[selectedPlan];
    
    let usersCost = 0;
    if (users > 10) usersCost = (users - 10) * 500;
    
    let dataCost = 0;
    if (dataVolume > 100) dataCost = Math.floor((dataVolume - 100) / 100) * 1000;
    
    let integrationsCost = 0;
    if (integrations > 5) integrationsCost = (integrations - 5) * 2000;
    
    let optionsCost = 0;
    Object.entries(options).forEach(([key, value]) => {
      if (value && key !== 'maintenance') optionsCost += optionPrices[key];
    });
    
    const subtotal = basePrice + usersCost + dataCost + integrationsCost + optionsCost;
    
    let discount = 0;
    if (period === 3) discount = subtotal * 0.05;
    else if (period === 12) discount = subtotal * 0.15;
    
    const total = subtotal - discount;
    const monthlyPrice = total / period;
    
    return { basePrice, usersCost, dataCost, integrationsCost, optionsCost, subtotal, discount, total, monthlyPrice };
  }, [selectedPlan, period, users, dataVolume, integrations, options]);

  // Расчет стоимости разработки
  const calculateDevelopmentPrice = useCallback(() => {
    const basePrice = developmentBasePrices[developmentType][projectComplexity];
    
    // Применяем множитель за дизайн
    const designPrice = basePrice * designMultipliers[designLevel];
    
    // Считаем стоимость функций
    let featuresCost = 0;
    Object.entries(features).forEach(([key, value]) => {
      if (value) featuresCost += featurePrices[key];
    });
    
    // Считаем дополнительные опции (для разработки)
    let optionsCost = 0;
    Object.entries(options).forEach(([key, value]) => {
      if (value) {
        if (key === 'maintenance') {
          optionsCost += optionPrices[key] * 12; // Годовое обслуживание
        } else {
          optionsCost += optionPrices[key];
        }
      }
    });
    
    const subtotal = designPrice + featuresCost + optionsCost;
    
    // Срочная разработка +30%
    const urgentCost = urgentDelivery ? subtotal * 0.3 : 0;
    
    const total = subtotal + urgentCost;
    
    // Расчет сроков (в неделях)
    let deliveryTime = 4; // базовый срок
    if (projectComplexity === 'standard') deliveryTime = 8;
    if (projectComplexity === 'complex') deliveryTime = 12;
    if (urgentDelivery) deliveryTime = Math.floor(deliveryTime * 0.6);
    
    return { 
      basePrice, 
      designPrice, 
      featuresCost, 
      optionsCost, 
      subtotal, 
      urgentCost, 
      total, 
      deliveryTime 
    };
  }, [developmentType, projectComplexity, designLevel, features, options, urgentDelivery]);

  const prices = serviceType === 'subscription' ? calculateSubscriptionPrice() : calculateDevelopmentPrice();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price));
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleFeatureChange = (feature) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const handleOrder = () => {
    setShowContactForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('Заказ:', {
      ...data,
      serviceType,
      ...(serviceType === 'subscription' ? {
        plan: selectedPlan,
        period,
        users,
        dataVolume,
        integrations
      } : {
        developmentType,
        projectComplexity,
        designLevel,
        features,
        urgentDelivery,
        deliveryTime: prices.deliveryTime
      }),
      options,
      total: prices.total
    });
    
    alert('Спасибо за заказ! Наш менеджер свяжется с вами в течение часа.');
    setShowContactForm(false);
  };

  return (
    <section className="pricing-section" id="pricing">
      <header className="section-header">
        <h2>Калькулятор стоимости услуг NeuroExpert</h2>
        <p>Рассчитайте точную стоимость AI-решений или разработки под ваши задачи</p>
      </header>

      <div className="pricing-container">
        {/* Выбор типа услуги */}
        <div className="service-type-selector">
          <button 
            className={`type-btn ${serviceType === 'subscription' ? 'active' : ''}`}
            onClick={() => setServiceType('subscription')}
          >
            <span className="type-icon">🚀</span>
            <span className="type-label">AI-платформа</span>
            <span className="type-desc">Подписка на готовые решения</span>
          </button>
          <button 
            className={`type-btn ${serviceType === 'development' ? 'active' : ''}`}
            onClick={() => setServiceType('development')}
          >
            <span className="type-icon">💻</span>
            <span className="type-label">Разработка под ключ</span>
            <span className="type-desc">Сайты, приложения, магазины</span>
          </button>
        </div>

        {serviceType === 'subscription' ? (
          <>
            {/* Интерфейс для подписки (как было) */}
            <div className="pricing-plans">
              <h3>1. Выберите тариф AI-платформы</h3>
              <div className="plans-grid">
                <div 
                  className={`pricing-plan glass-card ${selectedPlan === 'plan-start' ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan('plan-start')}
                >
                  <h4>Start</h4>
                  <div className="plan-price">₽{formatPrice(subscriptionPrices['plan-start'])}/мес</div>
                  <ul className="plan-features">
                    <li>До 10 пользователей</li>
                    <li>100 ГБ хранилище</li>
                    <li>5 интеграций</li>
                    <li>Базовая аналитика</li>
                  </ul>
                </div>

                <div 
                  className={`pricing-plan glass-card recommended ${selectedPlan === 'plan-business' ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan('plan-business')}
                >
                  <div className="recommended-badge">Популярный</div>
                  <h4>Business</h4>
                  <div className="plan-price">₽{formatPrice(subscriptionPrices['plan-business'])}/мес</div>
                  <ul className="plan-features">
                    <li>До 50 пользователей</li>
                    <li>500 ГБ хранилище</li>
                    <li>15 интеграций</li>
                    <li>AI-рекомендации</li>
                  </ul>
                </div>

                <div 
                  className={`pricing-plan glass-card ${selectedPlan === 'plan-enterprise' ? 'selected' : ''}`}
                  onClick={() => setSelectedPlan('plan-enterprise')}
                >
                  <h4>Enterprise</h4>
                  <div className="plan-price">₽{formatPrice(subscriptionPrices['plan-enterprise'])}/мес</div>
                  <ul className="plan-features">
                    <li>Без ограничений</li>
                    <li>Персональный менеджер</li>
                    <li>Кастомизация</li>
                    <li>SLA 99.9%</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Период оплаты */}
            <div className="pricing-period">
              <h3>2. Период оплаты</h3>
              <div className="period-options">
                <label className={`period-option ${period === 1 ? 'selected' : ''}`}>
                  <input type="radio" value="1" checked={period === 1} onChange={() => setPeriod(1)} />
                  <span className="period-label">Месяц</span>
                  <span className="period-discount">Без скидки</span>
                </label>
                <label className={`period-option ${period === 3 ? 'selected' : ''}`}>
                  <input type="radio" value="3" checked={period === 3} onChange={() => setPeriod(3)} />
                  <span className="period-label">Квартал</span>
                  <span className="period-discount">-5%</span>
                </label>
                <label className={`period-option ${period === 12 ? 'selected' : ''}`}>
                  <input type="radio" value="12" checked={period === 12} onChange={() => setPeriod(12)} />
                  <span className="period-label">Год</span>
                  <span className="period-discount">-15%</span>
                </label>
              </div>
            </div>

            {/* Параметры подписки */}
            <div className="pricing-customization">
              <h3>3. Дополнительные ресурсы</h3>
              <div className="slider-group">
                <label>
                  <span className="slider-label">Пользователи: {users}</span>
                  <input type="range" min="1" max="100" value={users} onChange={(e) => setUsers(parseInt(e.target.value))} />
                  {users > 10 && <span className="extra-cost">+₽{formatPrice((users - 10) * 500)}/мес</span>}
                </label>
              </div>
              <div className="slider-group">
                <label>
                  <span className="slider-label">Хранилище: {dataVolume} ГБ</span>
                  <input type="range" min="10" max="1000" step="10" value={dataVolume} onChange={(e) => setDataVolume(parseInt(e.target.value))} />
                  {dataVolume > 100 && <span className="extra-cost">+₽{formatPrice(Math.floor((dataVolume - 100) / 100) * 1000)}/мес</span>}
                </label>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Интерфейс для разработки */}
            <div className="development-options">
              <h3>1. Что будем разрабатывать?</h3>
              <div className="dev-type-grid">
                <label className={`dev-type-card ${developmentType === 'website' ? 'selected' : ''}`}>
                  <input type="radio" checked={developmentType === 'website'} onChange={() => setDevelopmentType('website')} />
                  <div className="dev-type-content">
                    <span className="dev-icon">🌐</span>
                    <h4>Сайт</h4>
                    <p>От лендинга до корпоративного портала</p>
                    <span className="dev-price">от ₽150,000</span>
                  </div>
                </label>

                <label className={`dev-type-card ${developmentType === 'ecommerce' ? 'selected' : ''}`}>
                  <input type="radio" checked={developmentType === 'ecommerce'} onChange={() => setDevelopmentType('ecommerce')} />
                  <div className="dev-type-content">
                    <span className="dev-icon">🛒</span>
                    <h4>Интернет-магазин</h4>
                    <p>Полноценная e-commerce платформа</p>
                    <span className="dev-price">от ₽250,000</span>
                  </div>
                </label>

                <label className={`dev-type-card ${developmentType === 'mobile' ? 'selected' : ''}`}>
                  <input type="radio" checked={developmentType === 'mobile'} onChange={() => setDevelopmentType('mobile')} />
                  <div className="dev-type-content">
                    <span className="dev-icon">📱</span>
                    <h4>Мобильное приложение</h4>
                    <p>iOS, Android или кроссплатформа</p>
                    <span className="dev-price">от ₽500,000</span>
                  </div>
                </label>

                <label className={`dev-type-card ${developmentType === 'webapp' ? 'selected' : ''}`}>
                  <input type="radio" checked={developmentType === 'webapp'} onChange={() => setDevelopmentType('webapp')} />
                  <div className="dev-type-content">
                    <span className="dev-icon">💡</span>
                    <h4>Web-приложение</h4>
                    <p>SaaS, CRM, ERP системы</p>
                    <span className="dev-price">от ₽400,000</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Сложность проекта */}
            <div className="project-complexity">
              <h3>2. Сложность проекта</h3>
              <div className="complexity-options">
                <label className={`complexity-option ${projectComplexity === 'simple' ? 'selected' : ''}`}>
                  <input type="radio" checked={projectComplexity === 'simple'} onChange={() => setProjectComplexity('simple')} />
                  <span className="complexity-label">Простой</span>
                  <span className="complexity-desc">
                    {developmentType === 'website' && 'Лендинг, визитка'}
                    {developmentType === 'ecommerce' && 'До 100 товаров'}
                    {developmentType === 'mobile' && 'Одна платформа'}
                    {developmentType === 'webapp' && 'MVP версия'}
                  </span>
                </label>
                <label className={`complexity-option ${projectComplexity === 'standard' ? 'selected' : ''}`}>
                  <input type="radio" checked={projectComplexity === 'standard'} onChange={() => setProjectComplexity('standard')} />
                  <span className="complexity-label">Стандартный</span>
                  <span className="complexity-desc">
                    {developmentType === 'website' && 'Корпоративный сайт'}
                    {developmentType === 'ecommerce' && 'До 1000 товаров'}
                    {developmentType === 'mobile' && 'iOS + Android'}
                    {developmentType === 'webapp' && 'Полная версия'}
                  </span>
                </label>
                <label className={`complexity-option ${projectComplexity === 'complex' ? 'selected' : ''}`}>
                  <input type="radio" checked={projectComplexity === 'complex'} onChange={() => setProjectComplexity('complex')} />
                  <span className="complexity-label">Сложный</span>
                  <span className="complexity-desc">
                    {developmentType === 'website' && 'Портал, каталог'}
                    {developmentType === 'ecommerce' && 'Маркетплейс'}
                    {developmentType === 'mobile' && 'С backend API'}
                    {developmentType === 'webapp' && 'Enterprise'}
                  </span>
                </label>
              </div>
            </div>

            {/* Уровень дизайна */}
            <div className="design-level">
              <h3>3. Дизайн</h3>
              <div className="design-options">
                <label className={`design-option ${designLevel === 'template' ? 'selected' : ''}`}>
                  <input type="radio" checked={designLevel === 'template'} onChange={() => setDesignLevel('template')} />
                  <span className="design-label">Шаблон</span>
                  <span className="design-desc">Готовый дизайн с адаптацией</span>
                  <span className="design-multiplier">×1</span>
                </label>
                <label className={`design-option ${designLevel === 'custom' ? 'selected' : ''}`}>
                  <input type="radio" checked={designLevel === 'custom'} onChange={() => setDesignLevel('custom')} />
                  <span className="design-label">Индивидуальный</span>
                  <span className="design-desc">Уникальный дизайн под ваш бренд</span>
                  <span className="design-multiplier">×1.5</span>
                </label>
                <label className={`design-option ${designLevel === 'premium' ? 'selected' : ''}`}>
                  <input type="radio" checked={designLevel === 'premium'} onChange={() => setDesignLevel('premium')} />
                  <span className="design-label">Премиум</span>
                  <span className="design-desc">WOW-эффекты и анимации</span>
                  <span className="design-multiplier">×2</span>
                </label>
              </div>
            </div>

            {/* Дополнительные функции */}
            <div className="development-features">
              <h3>4. Дополнительные функции</h3>
              <div className="features-grid">
                <label className={`feature-card ${features.seo ? 'selected' : ''}`}>
                  <input type="checkbox" checked={features.seo} onChange={() => handleFeatureChange('seo')} />
                  <span className="feature-icon">🔍</span>
                  <span className="feature-name">SEO оптимизация</span>
                  <span className="feature-price">+₽{formatPrice(featurePrices.seo)}</span>
                </label>
                <label className={`feature-card ${features.analytics ? 'selected' : ''}`}>
                  <input type="checkbox" checked={features.analytics} onChange={() => handleFeatureChange('analytics')} />
                  <span className="feature-icon">📊</span>
                  <span className="feature-name">Аналитика</span>
                  <span className="feature-price">+₽{formatPrice(featurePrices.analytics)}</span>
                </label>
                <label className={`feature-card ${features.crm ? 'selected' : ''}`}>
                  <input type="checkbox" checked={features.crm} onChange={() => handleFeatureChange('crm')} />
                  <span className="feature-icon">👥</span>
                  <span className="feature-name">CRM интеграция</span>
                  <span className="feature-price">+₽{formatPrice(featurePrices.crm)}</span>
                </label>
                <label className={`feature-card ${features.payment ? 'selected' : ''}`}>
                  <input type="checkbox" checked={features.payment} onChange={() => handleFeatureChange('payment')} />
                  <span className="feature-icon">💳</span>
                  <span className="feature-name">Платежи онлайн</span>
                  <span className="feature-price">+₽{formatPrice(featurePrices.payment)}</span>
                </label>
                <label className={`feature-card ${features.multilang ? 'selected' : ''}`}>
                  <input type="checkbox" checked={features.multilang} onChange={() => handleFeatureChange('multilang')} />
                  <span className="feature-icon">🌍</span>
                  <span className="feature-name">Мультиязычность</span>
                  <span className="feature-price">+₽{formatPrice(featurePrices.multilang)}</span>
                </label>
                <label className={`feature-card ${features.mobile ? 'selected' : ''}`}>
                  <input type="checkbox" checked={features.mobile} onChange={() => handleFeatureChange('mobile')} />
                  <span className="feature-icon">📱</span>
                  <span className="feature-name">Мобильная версия</span>
                  <span className="feature-price">+₽{formatPrice(featurePrices.mobile)}</span>
                </label>
              </div>
            </div>

            {/* Срочность */}
            <div className="urgency-option">
              <label className={`urgency-card ${urgentDelivery ? 'selected' : ''}`}>
                <input type="checkbox" checked={urgentDelivery} onChange={() => setUrgentDelivery(!urgentDelivery)} />
                <div className="urgency-content">
                  <span className="urgency-icon">⚡</span>
                  <div>
                    <h4>Срочная разработка</h4>
                    <p>Сократим сроки на 40%, но это будет стоить +30% к цене</p>
                  </div>
                </div>
              </label>
            </div>
          </>
        )}

        {/* Общие дополнительные опции */}
        <div className="pricing-options">
          <h3>{serviceType === 'subscription' ? '4' : '5'}. Дополнительные услуги</h3>
          <div className="options-grid">
            <label className={`option-card ${options.aiAssistant ? 'selected' : ''}`}>
              <input type="checkbox" checked={options.aiAssistant} onChange={() => handleOptionChange('aiAssistant')} />
              <div className="option-content">
                <h5>AI-ассистент Pro</h5>
                <p>Интеграция AI в ваш проект</p>
                <span className="option-price">+₽{formatPrice(optionPrices.aiAssistant)}{serviceType === 'subscription' ? '/мес' : ''}</span>
              </div>
            </label>
            
            <label className={`option-card ${options.premiumSupport ? 'selected' : ''}`}>
              <input type="checkbox" checked={options.premiumSupport} onChange={() => handleOptionChange('premiumSupport')} />
              <div className="option-content">
                <h5>Premium поддержка</h5>
                <p>24/7 с гарантией ответа</p>
                <span className="option-price">+₽{formatPrice(optionPrices.premiumSupport)}{serviceType === 'subscription' ? '/мес' : ''}</span>
              </div>
            </label>

            {serviceType === 'development' && (
              <label className={`option-card ${options.maintenance ? 'selected' : ''}`}>
                <input type="checkbox" checked={options.maintenance} onChange={() => handleOptionChange('maintenance')} />
                <div className="option-content">
                  <h5>Техподдержка</h5>
                  <p>Обслуживание после запуска</p>
                  <span className="option-price">+₽{formatPrice(optionPrices.maintenance)}/мес</span>
                </div>
              </label>
            )}

            <label className={`option-card ${options.training ? 'selected' : ''}`}>
              <input type="checkbox" checked={options.training} onChange={() => handleOptionChange('training')} />
              <div className="option-content">
                <h5>Обучение</h5>
                <p>Научим пользоваться системой</p>
                <span className="option-price">+₽{formatPrice(optionPrices.training)}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Итоговый расчет */}
        <div className="pricing-summary glass-card">
          <h3>Итоговая стоимость</h3>
          <div className="summary-breakdown">
            {serviceType === 'subscription' ? (
              <>
                <div className="summary-line">
                  <span>Базовый тариф:</span>
                  <span>₽{formatPrice(prices.basePrice)}</span>
                </div>
                {(prices.usersCost > 0 || prices.dataCost > 0 || prices.integrationsCost > 0) && (
                  <div className="summary-line">
                    <span>Дополнительные ресурсы:</span>
                    <span>₽{formatPrice(prices.usersCost + prices.dataCost + prices.integrationsCost)}</span>
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
              </>
            ) : (
              <>
                <div className="summary-line">
                  <span>Базовая стоимость:</span>
                  <span>₽{formatPrice(prices.basePrice)}</span>
                </div>
                {designLevel !== 'template' && (
                  <div className="summary-line">
                    <span>Дизайн ({designLevel === 'custom' ? 'индивидуальный' : 'премиум'}):</span>
                    <span>₽{formatPrice(prices.designPrice - prices.basePrice)}</span>
                  </div>
                )}
                {prices.featuresCost > 0 && (
                  <div className="summary-line">
                    <span>Дополнительные функции:</span>
                    <span>₽{formatPrice(prices.featuresCost)}</span>
                  </div>
                )}
                {prices.optionsCost > 0 && (
                  <div className="summary-line">
                    <span>Дополнительные услуги:</span>
                    <span>₽{formatPrice(prices.optionsCost)}</span>
                  </div>
                )}
                {prices.urgentCost > 0 && (
                  <div className="summary-line urgent">
                    <span>Срочная разработка (+30%):</span>
                    <span>+₽{formatPrice(prices.urgentCost)}</span>
                  </div>
                )}
                <div className="summary-line total">
                  <span>Итого:</span>
                  <span>₽{formatPrice(prices.total)}</span>
                </div>
                <div className="summary-line delivery">
                  <span>Срок разработки:</span>
                  <span>{prices.deliveryTime} недель</span>
                </div>
              </>
            )}
          </div>
          
          <button className="order-button" onClick={handleOrder}>
            {serviceType === 'subscription' ? 'Оформить подписку' : 'Заказать разработку'}
          </button>
          
          <p className="summary-note">
            {serviceType === 'subscription' 
              ? '🔒 Безопасная оплата • Отмена в любое время • Гарантия 30 дней'
              : '🔒 Договор и гарантии • Поэтапная оплата • Техподдержка 3 месяца'
            }
          </p>
        </div>
      </div>

      {/* Модальное окно с формой контакта */}
      {showContactForm && (
        <div className="contact-form-modal" onClick={() => setShowContactForm(false)}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <h2>{serviceType === 'subscription' ? 'Оформление подписки' : 'Заказ разработки'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="company">Компания</label>
                <input type="text" id="company" name="company" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Ваше имя</label>
                <input type="text" id="name" name="name" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="comments">Дополнительная информация</label>
                <textarea id="comments" name="comments" rows="3"></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-submit">Отправить</button>
                <button type="button" className="btn-cancel" onClick={() => setShowContactForm(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}