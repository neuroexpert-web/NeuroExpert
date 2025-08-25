'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PricingCalculator.module.css';

// Типы услуг из прайс-листа
interface Service {
  id: string;
  category: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  description?: string;
}

// Коэффициенты для расчета
interface Coefficients {
  complexity: number;
  urgency: number;
  integration: number;
  inflation: number;
}

// Параметры проекта
interface ProjectParams {
  businessSize: 'small' | 'medium' | 'large';
  industry: string;
  urgency: 'normal' | 'urgent' | 'veryUrgent';
  integrations: string[];
}

export default function PricingCalculator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [projectParams, setProjectParams] = useState<ProjectParams>({
    businessSize: 'medium',
    industry: 'retail',
    urgency: 'normal',
    integrations: []
  });
  const [showROI, setShowROI] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [roi, setRoi] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  // Каталог услуг из прайс-листа (обновленный согласно бизнес-логике)
  const services: Service[] = [
    // Аудит и Аналитика
    { id: 'digital-audit', category: 'Аудит и Аналитика', name: 'Цифровой аудит вашего бизнеса', minPrice: 25500, maxPrice: 90000 },
    { id: 'competitor-analysis', category: 'Аудит и Аналитика', name: 'Анализ конкурентов', minPrice: 20000, maxPrice: 70000 },
    { id: 'digital-maturity', category: 'Аудит и Аналитика', name: 'Насколько ваш бизнес готов к цифровизации', minPrice: 30000, maxPrice: 85000 },
    { id: 'data-analytics', category: 'Аудит и Аналитика', name: 'Аналитика данных и отчетность', minPrice: 25000, maxPrice: 80000 },
    
    // Стратегия и Консалтинг
    { id: 'digital-strategy', category: 'Стратегия и Консалтинг', name: 'План цифровой трансформации', minPrice: 85000, maxPrice: 270000 },
    { id: 'roi-model', category: 'Стратегия и Консалтинг', name: 'Расчёт окупаемости инвестиций', minPrice: 40000, maxPrice: 120000 },
    { id: 'process-optimization', category: 'Стратегия и Консалтинг', name: 'Оптимизация бизнес-процессов', minPrice: 60000, maxPrice: 150000 },
    { id: 'digital-consulting', category: 'Стратегия и Консалтинг', name: 'Консультации по внедрению цифровых технологий', minPrice: 50000, maxPrice: 180000 },
    
    // Дизайн и UX/UI
    { id: 'ux-ui-design', category: 'Дизайн и UX/UI', name: 'Красивый и удобный дизайн интерфейса', minPrice: 57800, maxPrice: 162000 },
    { id: 'landing-design', category: 'Дизайн и UX/UI', name: 'Дизайн лендинга', minPrice: 42500, maxPrice: 108000 },
    { id: 'corporate-design', category: 'Дизайн и UX/UI', name: 'Дизайн корпоративного сайта', minPrice: 90000, maxPrice: 240000 },
    { id: 'design-system', category: 'Дизайн и UX/UI', name: 'Разработка дизайн-системы', minPrice: 70000, maxPrice: 200000 },
    
    // Разработка
    { id: 'landing-dev', category: 'Разработка', name: 'Разработка лендинга', minPrice: 50000, maxPrice: 120000 },
    { id: 'corporate-dev', category: 'Разработка', name: 'Разработка корпоративного сайта', minPrice: 127500, maxPrice: 360000 },
    { id: 'ecommerce-dev', category: 'Разработка', name: 'Разработка интернет-магазина', minPrice: 255000, maxPrice: 720000 },
    { id: 'mobile-dev', category: 'Разработка', name: 'Разработка мобильного приложения', minPrice: 340000, maxPrice: 900000 },
    { id: 'custom-dev', category: 'Разработка', name: 'Кастомная разработка ПО', minPrice: 300000, maxPrice: 1000000 },
    
    // Интеграция и Автоматизация
    { id: 'ai-integration', category: 'Интеграция и Автоматизация', name: 'Интеграция AI агентов', minPrice: 85000, maxPrice: 315000 },
    { id: 'chatbot-integration', category: 'Интеграция и Автоматизация', name: 'Внедрение чат-ботов', minPrice: 70000, maxPrice: 250000 },
    { id: 'ads-integration', category: 'Интеграция и Автоматизация', name: 'Подключение и внедрение рекламы', minPrice: 25500, maxPrice: 81000 },
    { id: 'analytics-integration', category: 'Интеграция и Автоматизация', name: 'Интеграция аналитики', minPrice: 17000, maxPrice: 54000 },
    { id: 'marketing-automation', category: 'Интеграция и Автоматизация', name: 'Автоматизация маркетинга и продаж', minPrice: 40000, maxPrice: 120000 },
    
    // Поддержка и обучение
    { id: 'tech-support', category: 'Поддержка и обучение', name: 'Техническая поддержка проекта', minPrice: 20000, maxPrice: 70000 },
    { id: 'staff-training', category: 'Поддержка и обучение', name: 'Обучение сотрудников', minPrice: 15000, maxPrice: 50000 },
    { id: 'consulting', category: 'Поддержка и обучение', name: 'Консультации и сопровождение', minPrice: 10000, maxPrice: 40000 }
  ];

  // Коэффициенты согласно бизнес-логике
  const getCoefficients = (): Coefficients => {
    let complexity = 1.0;
    let urgency = 1.0;
    let integration = 1.0;
    const inflation = 0.10; // 10% инфляция

    // Коэффициент сложности по размеру бизнеса
    switch (projectParams.businessSize) {
      case 'small': complexity = 0.8; break;
      case 'medium': complexity = 1.0; break;
      case 'large': complexity = 1.3; break;
    }

    // Коэффициент срочности
    switch (projectParams.urgency) {
      case 'normal': urgency = 1.0; break;
      case 'urgent': urgency = 1.3; break;
      case 'veryUrgent': urgency = 1.6; break;
    }

    // Коэффициент интеграций
    if (projectParams.integrations.length > 0) {
      integration = 1 + (projectParams.integrations.length * 0.1);
    }

    return { complexity, urgency, integration, inflation };
  };

  // Расчет стоимости по формуле из бизнес-логики
  const calculatePrice = () => {
    const coefficients = getCoefficients();
    let totalPrice = 0;

    selectedServices.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        // Берем среднюю цену между min и max
        const basePrice = (service.minPrice + service.maxPrice) / 2;
        
        // Применяем формулу из бизнес-логики
        const finalPrice = basePrice * 
          coefficients.complexity * 
          coefficients.urgency * 
          coefficients.integration * 
          (1 + coefficients.inflation);
        
        totalPrice += finalPrice;
      }
    });

    setCalculatedPrice(Math.round(totalPrice));

    // Расчет ROI согласно бизнес-логике
    if (totalPrice > 0) {
      const investment = totalPrice;
      
      // Отраслевые мультипликаторы из бизнес-логики
      const industryMultipliers: Record<string, { economy: number; revenue: number }> = {
        retail: { economy: 2.5, revenue: 1.8 },
        production: { economy: 3.2, revenue: 2.1 },
        services: { economy: 2.8, revenue: 2.3 },
        restaurant: { economy: 2.2, revenue: 1.9 },
        logistics: { economy: 3.5, revenue: 2.0 }
      };
      
      const multiplier = industryMultipliers[projectParams.industry] || { economy: 2.0, revenue: 1.5 };
      
      const expectedRevenue = investment * multiplier.revenue;
      const savings = investment * (multiplier.economy - 1); // economy включает сами инвестиции
      const calculatedRoi = ((expectedRevenue + savings - investment) / investment) * 100;
      
      setRoi(Math.round(calculatedRoi));
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [selectedServices, projectParams]);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const integrationOptions = [
    { id: 'crm', name: 'CRM система' },
    { id: 'analytics', name: 'Аналитика' },
    { id: 'payment', name: 'Платежные системы' },
    { id: 'marketing', name: 'Email маркетинг' },
    { id: 'social', name: 'Социальные сети' },
    { id: 'erp', name: 'ERP система' }
  ];

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  // Функция для открытия контактной формы с предзаполненными данными
  const handleGetProposal = () => {
    // Формируем текст с выбранными услугами
    const selectedServiceNames = selectedServices.map(id => {
      const service = services.find(s => s.id === id);
      return service?.name;
    }).filter(Boolean).join(', ');

    // Открываем AI чат с контекстом
    import('@/app/utils/aiChat').then(({ openAIChat }) => {
      const message = `Здравствуйте! Я рассчитал стоимость услуг в вашем калькуляторе. 
      
Мои параметры:
- Размер бизнеса: ${projectParams.businessSize === 'small' ? 'малый' : projectParams.businessSize === 'medium' ? 'средний' : 'крупный'}
- Отрасль: ${projectParams.industry}
- Срочность: ${projectParams.urgency === 'normal' ? 'обычная' : projectParams.urgency === 'urgent' ? 'срочно' : 'очень срочно'}
- Интеграции: ${projectParams.integrations.length > 0 ? projectParams.integrations.join(', ') : 'не выбраны'}

Выбранные услуги: ${selectedServiceNames}

Расчетная стоимость: ${calculatedPrice.toLocaleString('ru-RU')} ₽
Прогнозируемый ROI: ${roi}%

Хочу получить детальное коммерческое предложение.`;
      
      openAIChat(message);
    });
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={styles.titleIcon}>💰</span>
          Калькулятор стоимости услуг
        </motion.h1>
        <p className={styles.subtitle}>
          Рассчитайте точную стоимость вашего проекта с учетом всех параметров
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.configurator}>
          {/* Параметры проекта */}
          <motion.div 
            className={`${styles.section} ${styles.glassCard}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className={styles.sectionTitle}>📊 Параметры проекта</h2>
            
            {/* Размер бизнеса */}
            <div className={styles.paramGroup}>
              <label className={styles.paramLabel}>Размер бизнеса</label>
              <div className={styles.radioGroup}>
                {[
                  { value: 'small', label: 'Малый (до 50 сотр.)' },
                  { value: 'medium', label: 'Средний (50-250 сотр.)' },
                  { value: 'large', label: 'Крупный (250+ сотр.)' }
                ].map(option => (
                  <label key={option.value} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="businessSize"
                      value={option.value}
                      checked={projectParams.businessSize === option.value}
                      onChange={(e) => setProjectParams({...projectParams, businessSize: e.target.value as any})}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Отрасль */}
            <div className={styles.paramGroup}>
              <label className={styles.paramLabel}>Отрасль</label>
              <select 
                value={projectParams.industry}
                onChange={(e) => setProjectParams({...projectParams, industry: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}
              >
                <option value="retail">Розничная торговля</option>
                <option value="production">Производство</option>
                <option value="services">Услуги</option>
                <option value="restaurant">Ресторанный бизнес</option>
                <option value="logistics">Логистика</option>
                <option value="it">IT и технологии</option>
                <option value="finance">Финансы</option>
                <option value="healthcare">Здравоохранение</option>
                <option value="education">Образование</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Срочность */}
            <div className={styles.paramGroup}>
              <label className={styles.paramLabel}>Срочность проекта</label>
              <div className={styles.radioGroup}>
                {[
                  { value: 'normal', label: 'Обычная', description: 'Стандартные сроки' },
                  { value: 'urgent', label: 'Срочно', description: '+30% к стоимости' },
                  { value: 'veryUrgent', label: 'Очень срочно', description: '+60% к стоимости' }
                ].map(option => (
                  <label key={option.value} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={projectParams.urgency === option.value}
                      onChange={(e) => setProjectParams({...projectParams, urgency: e.target.value as any})}
                    />
                    <div>
                      <span>{option.label}</span>
                      <small style={{ display: 'block', opacity: 0.7, fontSize: '0.8rem' }}>
                        {option.description}
                      </small>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Интеграции */}
            <div className={styles.paramGroup}>
              <label className={styles.paramLabel}>Необходимые интеграции (+10% за каждую)</label>
              <div className={styles.checkboxGroup}>
                {integrationOptions.map(option => (
                  <label key={option.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={projectParams.integrations.includes(option.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProjectParams({
                            ...projectParams, 
                            integrations: [...projectParams.integrations, option.id]
                          });
                        } else {
                          setProjectParams({
                            ...projectParams,
                            integrations: projectParams.integrations.filter(id => id !== option.id)
                          });
                        }
                      }}
                    />
                    <span>{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Выбор услуг */}
          <motion.div 
            className={`${styles.section} ${styles.glassCard}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={styles.sectionTitle}>🛠️ Выберите услуги</h2>
            
            {selectedServices.length === 0 && (
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 159, 28, 0.1)',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 159, 28, 0.3)'
              }}>
                ⚠️ Выберите хотя бы одну услугу для расчета стоимости
              </div>
            )}
            
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category} className={styles.serviceCategory}>
                <h3 className={styles.categoryTitle}>{category}</h3>
                <div className={styles.serviceGrid}>
                  {categoryServices.map(service => (
                    <motion.div
                      key={service.id}
                      className={`${styles.serviceCard} ${selectedServices.includes(service.id) ? styles.selected : ''}`}
                      onClick={() => toggleService(service.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.serviceName}>{service.name}</div>
                      <div className={styles.servicePrice}>
                        {service.minPrice.toLocaleString('ru-RU')} - {service.maxPrice.toLocaleString('ru-RU')} ₽
                      </div>
                      {selectedServices.includes(service.id) && (
                        <motion.div 
                          className={styles.checkmark}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Результаты расчета */}
        <div className={styles.results}>
          <motion.div 
            className={`${styles.resultCard} ${styles.glassCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className={styles.resultTitle}>💎 Результат расчета</h2>
            
            {selectedServices.length > 0 ? (
              <>
                <div className={styles.priceDisplay}>
                  <div className={styles.priceLabel}>Итоговая стоимость:</div>
                  <motion.div 
                    className={styles.priceValue}
                    key={calculatedPrice}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {calculatedPrice.toLocaleString('ru-RU')} ₽
                  </motion.div>
                </div>

                <div className={styles.coefficients}>
                  <h3>Применённые коэффициенты:</h3>
                  <ul>
                    <li>
                      <span>Сложность ({projectParams.businessSize}):</span>
                      <span>×{getCoefficients().complexity}</span>
                    </li>
                    <li>
                      <span>Срочность:</span>
                      <span>×{getCoefficients().urgency}</span>
                    </li>
                    <li>
                      <span>Интеграции ({projectParams.integrations.length}):</span>
                      <span>×{getCoefficients().integration.toFixed(1)}</span>
                    </li>
                    <li>
                      <span>Инфляция 2025:</span>
                      <span>+{(getCoefficients().inflation * 100).toFixed(0)}%</span>
                    </li>
                  </ul>
                </div>

                <button 
                  className={styles.roiButton}
                  onClick={() => setShowROI(!showROI)}
                >
                  {showROI ? 'Скрыть прогноз ROI' : '📈 Показать прогноз ROI'}
                </button>

                <AnimatePresence>
                  {showROI && (
                    <motion.div 
                      className={styles.roiSection}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className={styles.roiValue}>
                        <span className={styles.roiLabel}>Прогнозируемый ROI:</span>
                        <span className={styles.roiPercent}>{roi}%</span>
                      </div>
                      <p className={styles.roiDescription}>
                        При инвестициях {calculatedPrice.toLocaleString('ru-RU')} ₽ 
                        вы можете ожидать возврат инвестиций в размере {roi}% 
                        за первый год работы
                      </p>
                      
                      {/* Детализация ROI */}
                      {projectParams.industry && (
                        <div style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}>
                          <strong>Для отрасли "{
                            projectParams.industry === 'retail' ? 'Розничная торговля' :
                            projectParams.industry === 'production' ? 'Производство' :
                            projectParams.industry === 'services' ? 'Услуги' :
                            projectParams.industry === 'restaurant' ? 'Ресторанный бизнес' :
                            projectParams.industry === 'logistics' ? 'Логистика' :
                            projectParams.industry
                          }":</strong>
                          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                            <li>Экономия на автоматизации процессов</li>
                            <li>Увеличение конверсии и среднего чека</li>
                            <li>Снижение операционных расходов</li>
                            <li>Рост повторных продаж</li>
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button 
                  className={styles.ctaButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetProposal}
                >
                  Получить коммерческое предложение
                  <span className={styles.ctaArrow}>→</span>
                </motion.button>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                opacity: 0.6
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <p>Выберите услуги для расчета стоимости</p>
              </div>
            )}
          </motion.div>

          {/* Рекомендации */}
          {selectedServices.length > 0 && (
            <motion.div 
              className={`${styles.recommendations} ${styles.glassCard}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className={styles.recommendTitle}>💡 Персональные рекомендации</h3>
              <ul className={styles.recommendList}>
                {/* Динамические рекомендации на основе выбора */}
                {selectedServices.includes('corporate-dev') && !selectedServices.includes('analytics-integration') && (
                  <li>Рекомендуем добавить <strong>интеграцию аналитики</strong> для отслеживания эффективности сайта</li>
                )}
                {selectedServices.includes('ecommerce-dev') && !selectedServices.includes('marketing-automation') && (
                  <li>Добавьте <strong>автоматизацию маркетинга</strong> для увеличения продаж на 30-40%</li>
                )}
                {selectedServices.includes('ai-integration') && !selectedServices.includes('staff-training') && (
                  <li>Важно провести <strong>обучение сотрудников</strong> для эффективной работы с AI</li>
                )}
                {selectedServices.length >= 5 && (
                  <li>При заказе комплексного решения вы получаете <strong>скидку до 15%</strong></li>
                )}
                {projectParams.businessSize === 'small' && selectedServices.length > 3 && (
                  <li>Для малого бизнеса рекомендуем <strong>поэтапное внедрение</strong> для оптимизации бюджета</li>
                )}
                {projectParams.urgency !== 'normal' && (
                  <li>При срочной реализации предоставляем <strong>выделенную команду</strong> разработчиков</li>
                )}
              </ul>
              
              {/* Контактная информация */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(74, 158, 255, 0.1)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  Остались вопросы? Наш AI-менеджер Алексей ответит за 30 секунд!
                </p>
                <small style={{ opacity: 0.7 }}>
                  Или позвоните: +7 (800) 555-35-35
                </small>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}