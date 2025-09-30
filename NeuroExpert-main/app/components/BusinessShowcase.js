// Витрина комплексных услуг для NeuroExpert - согласно ТЗ
'use client';
import { useState, useEffect } from 'react';
import { safeExecute, safeLocalStorage } from './ErrorLogPanel';

const servicePackages = {
  small: {
    title: "Малый бизнес",
    icon: "🏪",
    description: "Быстрый старт и основа для роста",
    services: [
      {
        id: 'audit-small',
        title: "Аудит и простая стратегия",
        description: "Оценка текущего состояния бизнеса и создание плана развития",
        task: "Выявить слабые места и определить точки роста",
        howWorks: "Анализируем ваши процессы, рынок и конкурентов за 5-7 дней",
        benefits: [
          "Понимание реального состояния бизнеса",
          "Четкий план действий на 6-12 месяцев",
          "Выявление скрытых возможностей роста"
        ],
        stages: [
          "Сбор и анализ данных о текущих процессах",
          "Исследование рынка и конкурентов",
          "Подготовка стратегии и рекомендаций"
        ],
        result: "Стратегический план с конкретными шагами и прогнозом ROI 200-300%",
        price: "от 50 000 ₽",
        duration: "5-7 дней",
        roi: "200-300%"
      },
      {
        id: 'website-small',
        title: "Сайт с AI-экспертом",
        description: "Современный сайт-визитка с интеллектуальным помощником",
        task: "Создать профессиональное онлайн-присутствие",
        howWorks: "Разрабатываем адаптивный сайт и настраиваем AI-ассистента за 2-3 недели",
        benefits: [
          "Профессиональный имидж в интернете",
          "24/7 консультации клиентов через AI",
          "Увеличение конверсии на 40-60%"
        ],
        stages: [
          "Проектирование структуры и дизайна",
          "Разработка и интеграция AI-эксперта",
          "Тестирование и запуск"
        ],
        result: "Готовый сайт с AI-консультантом, увеличение обращений на 300-500%",
        price: "от 120 000 ₽",
        duration: "2-3 недели",
        roi: "300-500%"
      },
      {
        id: 'ads-small',
        title: "Запуск рекламы и CRM",
        description: "Настройка эффективной рекламы и системы управления клиентами",
        task: "Привлечь новых клиентов и организовать работу с ними",
        howWorks: "Настраиваем Яндекс.Директ, Google Ads и простую CRM за 1-2 недели",
        benefits: [
          "Стабильный поток клиентов",
          "Организованная работа с заявками",
          "Контроль эффективности рекламы"
        ],
        stages: [
          "Анализ целевой аудитории",
          "Настройка рекламных кампаний",
          "Внедрение CRM и обучение"
        ],
        result: "Работающие рекламные кампании и организованные продажи",
        price: "от 80 000 ₽",
        duration: "1-2 недели",
        roi: "250-400%"
      }
    ]
  },
  medium: {
    title: "Средний бизнес",
    icon: "🏢",
    description: "Системная автоматизация и масштабирование",
    services: [
      {
        id: 'analysis-medium',
        title: "Расширенный анализ процессов",
        description: "Глубокая диагностика бизнес-процессов и рыночной позиции",
        task: "Оптимизировать все ключевые процессы компании",
        howWorks: "Комплексный аудит всех подразделений с использованием BI-инструментов",
        benefits: [
          "Выявление узких мест в процессах",
          "Оптимизация операционных затрат",
          "Повышение общей эффективности на 30-50%"
        ],
        stages: [
          "Аудит всех бизнес-процессов",
          "Анализ данных и метрик",
          "Разработка плана оптимизации"
        ],
        result: "Детальная карта процессов с планом оптимизации и внедрения BI",
        price: "от 200 000 ₽",
        duration: "2-3 недели",
        roi: "300-450%"
      },
      {
        id: 'digital-strategy-medium',
        title: "Сквозная digital-стратегия",
        description: "Комплексная цифровая трансформация всех направлений",
        task: "Создать единую цифровую экосистему",
        howWorks: "Разрабатываем стратегию интеграции всех digital-каналов",
        benefits: [
          "Единая система управления",
          "Автоматизация рутинных процессов",
          "Увеличение прибыли на 50-80%"
        ],
        stages: [
          "Анализ текущей digital-зрелости",
          "Проектирование целевой архитектуры",
          "Поэтапное внедрение решений"
        ],
        result: "Полностью интегрированная digital-экосистема",
        price: "от 500 000 ₽",
        duration: "1-3 месяца",
        roi: "400-600%"
      },
      {
        id: 'automation-medium',
        title: "BI и оптимизация рекламы",
        description: "Внедрение аналитики и автоматизация маркетинга",
        task: "Создать систему управления на основе данных",
        howWorks: "Настраиваем BI-дашборды и автоматизируем рекламные кампании",
        benefits: [
          "Принятие решений на основе данных",
          "Снижение стоимости привлечения на 40%",
          "Увеличение ROAS в 2-3 раза"
        ],
        stages: [
          "Настройка сбора и обработки данных",
          "Создание BI-дашбордов",
          "Автоматизация маркетинговых процессов"
        ],
        result: "Работающая система аналитики и автоматического маркетинга",
        price: "от 350 000 ₽",
        duration: "3-6 недель",
        roi: "350-550%"
      }
    ]
  },
  large: {
    title: "Крупный бизнес",
    icon: "🏭",
    description: "Корпоративная трансформация и инновации",
    services: [
      {
        id: 'transformation-large',
        title: "Цифровая трансформация",
        description: "Полная модернизация корпоративной IT-архитектуры",
        task: "Создать технологическую основу для масштабирования",
        howWorks: "Поэтапная трансформация всех систем с сохранением бизнес-процессов",
        benefits: [
          "Повышение операционной эффективности",
          "Готовность к быстрому масштабированию",
          "Конкурентное преимущество за счет технологий"
        ],
        stages: [
          "Аудит IT-ландшафта и архитектуры",
          "Проектирование целевой архитектуры",
          "Миграция систем и интеграция"
        ],
        result: "Современная IT-инфраструктура готовая к росту",
        price: "от 1 500 000 ₽",
        duration: "3-12 месяцев",
        roi: "600-1200%"
      },
      {
        id: 'erp-integration-large',
        title: "ERP/CRM/Big Data интеграция",
        description: "Единая экосистема корпоративных систем",
        task: "Объединить все корпоративные системы",
        howWorks: "Интегрируем ERP, CRM и системы аналитики в единое решение",
        benefits: [
          "Единое информационное пространство",
          "Автоматизация межсистемного взаимодействия",
          "Возможность принятия решений в реальном времени"
        ],
        stages: [
          "Анализ существующих систем",
          "Проектирование интеграционной шины",
          "Поэтапная интеграция и тестирование"
        ],
        result: "Полностью интегрированная корпоративная система",
        price: "от 2 000 000 ₽",
        duration: "6-12 месяцев",
        roi: "400-800%"
      },
      {
        id: 'ai-products-large',
        title: "Собственные AI-продукты",
        description: "Разработка уникальных AI-решений для бизнеса",
        task: "Создать конкурентное преимущество через AI",
        howWorks: "Разрабатываем кастомные AI-решения под специфику бизнеса",
        benefits: [
          "Уникальные продукты на рынке",
          "Автоматизация сложных процессов",
          "Новые источники дохода"
        ],
        stages: [
          "Исследование возможностей AI",
          "Разработка MVP и тестирование",
          "Промышленное внедрение"
        ],
        result: "Собственные AI-продукты и платформы",
        price: "от 1 000 000 ₽",
        duration: "4-8 месяцев",
        roi: "500-1000%"
      }
    ]
  }
};

const packageFAQ = {
  small: [
    {
      question: "Подойдет ли это для интернет-магазина?",
      answer: "Да, особенно пакет 'Сайт с AI-экспертом' идеально подходит для eCommerce. AI поможет консультировать покупателей 24/7."
    },
    {
      question: "Сколько времени займет внедрение?",
      answer: "От 1 недели (реклама) до 3 недель (сайт). Полный комплекс услуг - 1-2 месяца."
    }
  ],
  medium: [
    {
      question: "Что включает сквозная аналитика?",
      answer: "BI-дашборды, интеграция всех систем, автоматические отчеты, прогнозирование и рекомендации на основе данных."
    },
    {
      question: "Как происходит интеграция с существующими системами?",
      answer: "Поэтапно, без остановки работы. Сначала анализируем архитектуру, затем создаем план миграции."
    }
  ],
  large: [
    {
      question: "Подходит ли для международных компаний?",
      answer: "Да, мы работаем с мультинациональными корпорациями. Решения адаптируются под различные юрисдикции."
    },
    {
      question: "Какие гарантии предоставляете?",
      answer: "12 месяцев гарантии, SLA 99.5%, техподдержка 24/7, возврат средств при невыполнении KPI."
    }
  ]
};

function BusinessShowcase() {
  const [activeSegment, setActiveSegment] = useState('small');
  const [selectedService, setSelectedService] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);

  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const createLead = (serviceData) => {
    // Имитация отправки лида в CRM
    const leadData = {
      service: serviceData.title,
      segment: activeSegment,
      timestamp: new Date().toISOString(),
      source: 'showcase'
    };
    
    safeExecute(() => {
      const leads = JSON.parse(safeLocalStorage.getItem('leads') || '[]');
      leads.push(leadData);
      safeLocalStorage.setItem('leads', JSON.stringify(leads));
    }, 'createLead');
    
    alert(`Заявка на "${serviceData.title}" отправлена! Менеджер свяжется с вами в течение 2 часов.`);
  };

  const segments = Object.keys(servicePackages);
  const currentSegment = servicePackages[activeSegment];

  return (
    <section id="showcase" className="showcase-section">
      <div className="container">
        <h2>🎯 Витрина готовых решений</h2>
        <p className="showcase-subtitle">
          Выберите ваш сегмент и познакомьтесь с пакетными решениями
        </p>
        
        {/* Табы для сегментов */}
        <div className="segment-tabs">
          {segments.map(segment => {
            const segmentData = servicePackages[segment];
            return (
              <button
                key={segment}
                className={`segment-tab ${activeSegment === segment ? 'active' : ''}`}
                onClick={() => setActiveSegment(segment)}
              >
                <span className="tab-icon">{segmentData.icon}</span>
                <span className="tab-title">{segmentData.title}</span>
                <span className="tab-description">{segmentData.description}</span>
              </button>
            );
          })}
        </div>

        {/* Карточки услуг для выбранного сегмента */}
        <div className="services-grid">
          {currentSegment.services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <h3>{service.title}</h3>
                <div className="service-meta">
                  <span className="price">{service.price}</span>
                  <span className="duration">{service.duration}</span>
                  <span className="roi">ROI: {service.roi}</span>
                </div>
              </div>
              
              <p className="service-description">{service.description}</p>
              
              <div className="service-details">
                <div className="detail-section">
                  <h4>🎯 Задача</h4>
                  <p>{service.task}</p>
                </div>
                
                <div className="detail-section">
                  <h4>⚙️ Как работаем</h4>
                  <p>{service.howWorks}</p>
                </div>
                
                <div className="detail-section">
                  <h4>✅ Выгоды</h4>
                  <ul>
                    {service.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-section">
                  <h4>📋 Этапы</h4>
                  <ol>
                    {service.stages.map((stage, index) => (
                      <li key={index}>{stage}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="detail-section highlight">
                  <h4>🏆 Результат</h4>
                  <p>{service.result}</p>
                </div>
              </div>
              
              <div className="service-actions">
                <button 
                  className="cta-primary"
                  onClick={() => createLead(service)}
                >
                  📞 Заказать услугу
                </button>
                <button 
                  className="cta-secondary"
                  onClick={scrollToCalculator}
                >
                  💰 Рассчитать выгоду
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Мини-FAQ по пакетам */}
        <div className="package-faq">
          <button 
            className="faq-toggle"
            onClick={() => setShowFAQ(!showFAQ)}
          >
            ❓ Часто задаваемые вопросы по пакетам {currentSegment.title.toLowerCase()}
            <span className={`faq-arrow ${showFAQ ? 'open' : ''}`}>▼</span>
          </button>
          
          {showFAQ && (
            <div className="faq-content">
              {packageFAQ[activeSegment]?.map((faq, index) => (
                <details key={index} className="faq-item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
              
              <button 
                className="calculate-benefit-btn"
                onClick={scrollToCalculator}
              >
                💰 Рассчитать выгоду от пакета
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BusinessShowcase;
