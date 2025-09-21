'use client';

import { useState, useEffect, useCallback } from 'react';
import './PricingCalculatorImproved.css';

export default function PricingCalculatorImproved() {
  // Состояние для выбранных услуг
  const [selectedServices, setSelectedServices] = useState([]);
  const [businessType, setBusinessType] = useState('startup');
  const [urgency, setUrgency] = useState('standard');
  const [showDetails, setShowDetails] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Каталог услуг с ценами
  const services = {
    websites: {
      title: 'Сайты и веб-приложения',
      items: [
        {
          id: 'landing',
          name: 'Лендинг с AI-консультантом',
          description: 'Продающая страница с умным помощником',
          basePrice: 79900,
          timeline: '5-7 дней',
          features: ['AI чат 24/7', 'Конверсия до 15%', 'Адаптивный дизайн', 'SEO оптимизация']
        },
        {
          id: 'corporate',
          name: 'Корпоративный сайт',
          description: 'Полноценный сайт компании с CMS',
          basePrice: 149900,
          timeline: '10-14 дней',
          features: ['До 20 страниц', 'Панель управления', 'Мультиязычность', 'Интеграции']
        },
        {
          id: 'ecommerce',
          name: 'Интернет-магазин',
          description: 'E-commerce платформа с AI',
          basePrice: 299900,
          timeline: '21-30 дней',
          features: ['Каталог товаров', 'AI рекомендации', 'Платежи онлайн', 'Личный кабинет']
        }
      ]
    },
    automation: {
      title: 'Автоматизация и AI',
      items: [
        {
          id: 'ai-assistant',
          name: 'AI Ассистент для бизнеса',
          description: 'Умный помощник для автоматизации',
          basePrice: 49900,
          timeline: '3-5 дней',
          isMonthly: true,
          features: ['Обработка заявок', 'Ответы на вопросы', 'Интеграция с CRM', 'Обучение на данных']
        },
        {
          id: 'process-automation',
          name: 'Автоматизация процессов',
          description: 'Оптимизация рабочих процессов',
          basePrice: 99900,
          timeline: '7-10 дней',
          features: ['Анализ процессов', 'Внедрение RPA', 'Интеграции', 'Обучение команды']
        },
        {
          id: 'analytics-system',
          name: 'Система аналитики',
          description: 'BI система с AI инсайтами',
          basePrice: 149900,
          timeline: '14-21 день',
          features: ['Дашборды', 'Прогнозирование', 'Отчеты', 'API для данных']
        }
      ]
    },
    mobile: {
      title: 'Мобильные решения',
      items: [
        {
          id: 'mobile-app',
          name: 'Мобильное приложение',
          description: 'iOS и Android приложение',
          basePrice: 399900,
          timeline: '30-45 дней',
          features: ['Нативная разработка', 'Push уведомления', 'Офлайн режим', 'Аналитика']
        },
        {
          id: 'pwa',
          name: 'Progressive Web App',
          description: 'Веб-приложение как мобильное',
          basePrice: 199900,
          timeline: '14-21 день',
          features: ['Работает офлайн', 'Установка на телефон', 'Push уведомления', 'Быстрая загрузка']
        }
      ]
    },
    additional: {
      title: 'Дополнительные услуги',
      items: [
        {
          id: 'design',
          name: 'UI/UX дизайн',
          description: 'Проектирование интерфейсов',
          basePrice: 59900,
          timeline: '5-7 дней',
          features: ['Исследование', 'Прототипы', 'Дизайн-система', 'Тестирование']
        },
        {
          id: 'seo',
          name: 'SEO продвижение',
          description: 'Комплексное продвижение',
          basePrice: 39900,
          timeline: 'Ежемесячно',
          isMonthly: true,
          features: ['Аудит сайта', 'Оптимизация', 'Контент-план', 'Отчеты']
        },
        {
          id: 'support',
          name: 'Техподдержка Premium',
          description: 'Поддержка и развитие',
          basePrice: 29900,
          timeline: 'Ежемесячно',
          isMonthly: true,
          features: ['24/7 поддержка', 'Обновления', 'Мониторинг', 'Консультации']
        }
      ]
    }
  };

  // Коэффициенты для типа бизнеса
  const businessTypeCoef = {
    startup: { coef: 1, name: 'Стартап', discount: 0 },
    small: { coef: 1.2, name: 'Малый бизнес', discount: 5 },
    medium: { coef: 1.5, name: 'Средний бизнес', discount: 10 },
    enterprise: { coef: 2, name: 'Крупный бизнес', discount: 15 }
  };

  // Коэффициенты срочности
  const urgencyCoef = {
    standard: { coef: 1, name: 'Стандартные сроки', bonus: 0 },
    fast: { coef: 1.3, name: 'Ускоренная разработка', bonus: 30 },
    urgent: { coef: 1.5, name: 'Срочный заказ', bonus: 50 }
  };

  // Добавление/удаление услуги
  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  // Расчет общей стоимости
  const calculateTotal = useCallback(() => {
    let subtotal = 0;
    let monthlyTotal = 0;
    let oneTimeTotal = 0;

    selectedServices.forEach(service => {
      const price = service.basePrice * businessTypeCoef[businessType].coef * urgencyCoef[urgency].coef;
      if (service.isMonthly) {
        monthlyTotal += price;
      } else {
        oneTimeTotal += price;
      }
      subtotal += price;
    });

    // Применяем скидку для типа бизнеса
    const discount = businessTypeCoef[businessType].discount;
    const discountAmount = oneTimeTotal * (discount / 100);
    const finalOneTime = oneTimeTotal - discountAmount;

    return {
      subtotal,
      monthlyTotal,
      oneTimeTotal,
      finalOneTime,
      discountAmount,
      discount,
      totalServices: selectedServices.length
    };
  }, [selectedServices, businessType, urgency]);

  const totals = calculateTotal();

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(price));
  };

  // Обработчик заказа
  const handleOrder = () => {
    if (selectedServices.length === 0) {
      alert('Пожалуйста, выберите хотя бы одну услугу');
      return;
    }
    setShowContactForm(true);
  };

  // Отправка формы
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('Заказ:', {
      ...data,
      services: selectedServices,
      businessType,
      urgency,
      totals
    });
    
    alert('Спасибо за заявку! Мы свяжемся с вами в течение 30 минут.');
    setShowContactForm(false);
  };

  return (
    <div className="pricing-calculator-improved">
      <div className="calculator-header">
        <h2>Калькулятор стоимости услуг</h2>
        <p>Выберите нужные услуги и получите точный расчет стоимости</p>
      </div>

      {/* Шаг 1: Тип бизнеса */}
      <div className="calculator-step">
        <h3>
          <span className="step-number">1</span>
          Расскажите о вашем бизнесе
        </h3>
        <div className="business-type-selector">
          {Object.entries(businessTypeCoef).map(([key, value]) => (
            <label key={key} className={`type-option ${businessType === key ? 'selected' : ''}`}>
              <input
                type="radio"
                name="businessType"
                value={key}
                checked={businessType === key}
                onChange={(e) => setBusinessType(e.target.value)}
              />
              <div className="type-content">
                <h4>{value.name}</h4>
                {value.discount > 0 && (
                  <span className="discount-badge">Скидка {value.discount}%</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Шаг 2: Срочность */}
      <div className="calculator-step">
        <h3>
          <span className="step-number">2</span>
          Когда нужен результат?
        </h3>
        <div className="urgency-selector">
          {Object.entries(urgencyCoef).map(([key, value]) => (
            <label key={key} className={`urgency-option ${urgency === key ? 'selected' : ''}`}>
              <input
                type="radio"
                name="urgency"
                value={key}
                checked={urgency === key}
                onChange={(e) => setUrgency(e.target.value)}
              />
              <div className="urgency-content">
                <h4>{value.name}</h4>
                {value.bonus > 0 && (
                  <span className="bonus">+{value.bonus}% к стоимости</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Шаг 3: Выбор услуг */}
      <div className="calculator-step">
        <h3>
          <span className="step-number">3</span>
          Выберите услуги
        </h3>
        
        {Object.entries(services).map(([category, categoryData]) => (
          <div key={category} className="service-category">
            <h4 className="category-title">{categoryData.title}</h4>
            <div className="services-grid">
              {categoryData.items.map(service => {
                const isSelected = selectedServices.find(s => s.id === service.id);
                const price = service.basePrice * businessTypeCoef[businessType].coef * urgencyCoef[urgency].coef;
                
                return (
                  <div
                    key={service.id}
                    className={`service-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleService(service)}
                  >
                    <div className="service-header">
                      <h5>{service.name}</h5>
                      <div className="service-price">
                        <span className="price">₽{formatPrice(price)}</span>
                        {service.isMonthly && <span className="period">/мес</span>}
                      </div>
                    </div>
                    <p className="service-description">{service.description}</p>
                    <div className="service-timeline">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {service.timeline}
                    </div>
                    <ul className="service-features">
                      {service.features.map((feature, index) => (
                        <li key={index}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className={`selection-indicator ${isSelected ? 'show' : ''}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 6L9 17l-5-5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Итоговый расчет */}
      <div className="calculator-summary">
        <div className="summary-header">
          <h3>Итоговая стоимость</h3>
          <button 
            className="details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Скрыть детали' : 'Показать детали'}
          </button>
        </div>

        {showDetails && selectedServices.length > 0 && (
          <div className="summary-details">
            <h4>Выбранные услуги:</h4>
            {selectedServices.map(service => {
              const price = service.basePrice * businessTypeCoef[businessType].coef * urgencyCoef[urgency].coef;
              return (
                <div key={service.id} className="detail-line">
                  <span>{service.name}</span>
                  <span>
                    ₽{formatPrice(price)}
                    {service.isMonthly && '/мес'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="summary-totals">
          {totals.oneTimeTotal > 0 && (
            <>
              <div className="total-line">
                <span>Разовые услуги:</span>
                <span>₽{formatPrice(totals.oneTimeTotal)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="total-line discount">
                  <span>Скидка {totals.discount}%:</span>
                  <span>-₽{formatPrice(totals.discountAmount)}</span>
                </div>
              )}
              <div className="total-line final">
                <span>К оплате (разово):</span>
                <span>₽{formatPrice(totals.finalOneTime)}</span>
              </div>
            </>
          )}
          
          {totals.monthlyTotal > 0 && (
            <div className="total-line monthly">
              <span>Ежемесячная оплата:</span>
              <span>₽{formatPrice(totals.monthlyTotal)}/мес</span>
            </div>
          )}

          {totals.totalServices === 0 && (
            <div className="empty-state">
              <p>Выберите услуги для расчета стоимости</p>
            </div>
          )}
        </div>

        <button 
          className="order-button"
          onClick={handleOrder}
          disabled={totals.totalServices === 0}
        >
          Оформить заказ
        </button>

        <div className="summary-footer">
          <p>✅ Фиксированная цена • 💳 Поэтапная оплата • 🔄 Гарантия результата</p>
        </div>
      </div>

      {/* Модальное окно с формой */}
      {showContactForm && (
        <div className="contact-modal" onClick={() => setShowContactForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowContactForm(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <h3>Оформление заказа</h3>
            <p>Оставьте контакты, мы свяжемся в течение 30 минут</p>
            
            <form onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Ваше имя *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Иван Иванов"
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="phone">Телефон *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="ivan@company.ru"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="company">Компания</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  placeholder="ООО Рога и копыта"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="comment">Комментарий</label>
                <textarea 
                  id="comment" 
                  name="comment" 
                  rows="3" 
                  placeholder="Дополнительная информация о проекте..."
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">
                Отправить заявку
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}