// Витрина комплексных услуг для NeuroExpert
'use client';
import { useState, useEffect } from 'react';
import { safeExecute, safeLocalStorage } from './ErrorLogPanel';

const servicePackages = {
  small: [
    {
      id: 'audit-small',
      title: "Аудит текущего состояния",
      description: "Оценка маркетинга, IT и производительности для выявления слабых мест.",
      steps: [
        "Сбор данных о текущих процессах",
        "Анализ собранной информации", 
        "Подготовка отчета с рекомендациями"
      ],
      benefits: "Понимание текущих проблем и возможностей для улучшения.",
      exampleResult: "Отчет с рекомендациями по улучшению процессов.",
      price: "от 50,000₽",
      roi: "200-300%"
    },
    {
      id: 'strategy-small',
      title: "Разработка стратегии развития",
      description: "Создание простой и эффективной стратегии для роста бизнеса.",
      steps: [
        "Определение целей бизнеса",
        "Анализ рынка и конкурентов",
        "Разработка плана действий"
      ],
      benefits: "Четкое понимание направления развития и шагов для достижения целей.",
      exampleResult: "Стратегический план с конкретными действиями.",
      price: "от 80,000₽",
      roi: "250-400%"
    },
    {
      id: 'website-small',
      title: "Создание сайта с AI-экспертом",
      description: "Разработка сайта, который включает AI-эксперта для взаимодействия с клиентами.",
      steps: [
        "Определение требований к сайту",
        "Дизайн и разработка сайта",
        "Интеграция AI-эксперта"
      ],
      benefits: "Улучшение взаимодействия с клиентами и повышение конверсии.",
      exampleResult: "Функционирующий сайт с AI-экспертом.",
      price: "от 120,000₽",
      roi: "300-500%"
    }
  ],
  medium: [
    {
      id: 'analysis-medium',
      title: "Расширенный анализ процессов",
      description: "Глубокий анализ текущих бизнес-процессов и рыночной ситуации.",
      steps: [
        "Сбор данных о текущих процессах",
        "Анализ рыночной ситуации",
        "Подготовка отчета с рекомендациями"
      ],
      benefits: "Поможет выявить слабые места и возможности для оптимизации.",
      exampleResult: "Отчет с рекомендациями по улучшению процессов.",
      price: "от 200,000₽",
      roi: "300-450%"
    },
    {
      id: 'digital-strategy-medium',
      title: "Внедрение digital-стратегии",
      description: "Создание и реализация комплексной стратегии цифровой трансформации.",
      steps: [
        "Анализ текущей стратегии",
        "Разработка новой digital-стратегии",
        "Внедрение и мониторинг результатов"
      ],
      benefits: "Увеличение эффективности и конкурентоспособности бизнеса.",
      exampleResult: "Успешно реализованная digital-стратегия.",
      price: "от 350,000₽",
      roi: "400-600%"
    },
    {
      id: 'ecommerce-medium', 
      title: "Корпоративный лендинг с AI",
      description: "Создание современного лендинга или интернет-магазина с AI-ассистентом.",
      steps: [
        "Разработка дизайна и структуры сайта",
        "Интеграция AI-ассистента",
        "Запуск и тестирование"
      ],
      benefits: "Увеличение конверсии и улучшение пользовательского опыта.",
      exampleResult: "Запущенный лендинг с AI-ассистентом.",
      price: "от 500,000₽",
      roi: "350-550%"
    }
  ],
  large: [
    {
      id: 'audit-large',
      title: "Аудит бизнес-единиц",
      description: "Комплексный аудит бизнес-единиц для выявления областей улучшения.",
      steps: [
        "Первичная консультация для понимания потребностей бизнеса",
        "Сбор и анализ данных",
        "Представление результатов и рекомендаций"
      ],
      benefits: "Повышение операционной эффективности и стратегическое выравнивание.",
      exampleResult: "Детальный отчет с практическими рекомендациями.",
      price: "от 1,000,000₽",
      roi: "500-800%"
    },
    {
      id: 'transformation-large',
      title: "Стратегия цифровой трансформации",
      description: "Разработка индивидуальной стратегии цифровой трансформации.",
      steps: [
        "Оценка текущих цифровых возможностей",
        "Определение ключевых цифровых инициатив",
        "Создание дорожной карты внедрения"
      ],
      benefits: "Повышение конкурентоспособности и отзывчивости к рынку.",
      exampleResult: "Стратегический план с определенными вехами.",
      price: "от 1,500,000₽",
      roi: "600-1000%"
    },
    {
      id: 'integration-large',
      title: "Интеграционные проекты (ERP, CRM)",
      description: "Внедрение интегрированных систем для улучшения управления данными.",
      steps: [
        "Оценка потребностей и выбор системы",
        "Планирование и выполнение интеграции",
        "Обучение и поддержка"
      ],
      benefits: "Улучшение управления данными и операционной эффективности.",
      exampleResult: "Полностью интегрированные системы с обученным персоналом.",
      price: "от 2,000,000₽",
      roi: "700-1200%"
    }
  ]
};

function ServicePackageCard({ package: pkg, onSelect }) {
  return (
    <div className="service-package-card">
      <div className="package-header">
        <h3>{pkg.title}</h3>
        <div className="package-price">{pkg.price}</div>
        <div className="package-roi">ROI: {pkg.roi}</div>
      </div>
      
      <p className="package-description">{pkg.description}</p>
      
      <div className="package-steps">
        <h4>📋 Этапы работы:</h4>
        <ul>
          {pkg.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>
      
      <div className="package-benefits">
        <h4>✅ Выгоды:</h4>
        <p>{pkg.benefits}</p>
      </div>
      
      <div className="package-result">
        <h4>🎯 Результат:</h4>
        <p>{pkg.exampleResult}</p>
      </div>
      
      <button 
        className="package-cta" 
        onClick={() => onSelect(pkg)}
      >
        💬 Запросить консультацию
      </button>
    </div>
  );
}

function BusinessShowcase() {
  const [activeSegment, setActiveSegment] = useState('small');
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  const segments = {
    small: '👥 Малый бизнес',
    medium: '🏢 Средний бизнес', 
    large: '🏭 Крупный бизнес'
  };

  const handlePackageSelect = (pkg) => {
    safeExecute(() => {
      setSelectedPackage(pkg);
      
      // Сохраняем выбранный пакет для аналитики
      safeLocalStorage('set', 'selected_package', {
        id: pkg.id,
        title: pkg.title,
        segment: activeSegment,
        timestamp: Date.now()
      });
      
      // Уведомляем о выборе пакета
      alert(`Заявка на "${pkg.title}" отправлена! Мы свяжемся с вами в течение 2 часов.`);
      
      // Отправляем событие для аналитики если доступно
      if (window.gtag) {
        window.gtag('event', 'package_selected', {
          package_id: pkg.id,
          package_title: pkg.title,
          business_segment: activeSegment
        });
      }
    }, null, 'handlePackageSelect');
  };

  return (
    <div className="business-showcase">
      <h2>🎯 Витрина комплексных услуг</h2>
      <p className="showcase-subtitle">
        Готовые решения "под ключ" для вашего типа бизнеса
      </p>
      
      {/* Селектор сегментов */}
      <div className="segment-selector">
        {Object.entries(segments).map(([key, label]) => (
          <button
            key={key}
            className={`segment-btn ${activeSegment === key ? 'active' : ''}`}
            onClick={() => setActiveSegment(key)}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Карточки пакетов */}
      <div className="packages-grid">
        {servicePackages[activeSegment].map((pkg) => (
          <ServicePackageCard 
            key={pkg.id} 
            package={pkg}
            onSelect={handlePackageSelect}
          />
        ))}
      </div>
      
      <style jsx>{`
        .business-showcase {
          margin: 40px 0;
          padding: 32px;
          background: var(--card);
          border-radius: 16px;
          border: 1px solid rgba(125, 211, 252, 0.2);
        }
        
        .showcase-subtitle {
          text-align: center;
          color: var(--muted);
          margin-bottom: 32px;
        }
        
        .segment-selector {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        
        .segment-btn {
          padding: 12px 24px;
          border: 2px solid rgba(125, 211, 252, 0.3);
          background: transparent;
          color: var(--text);
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .segment-btn:hover {
          border-color: var(--accent);
          background: rgba(125, 211, 252, 0.1);
        }
        
        .segment-btn.active {
          background: var(--accent);
          color: #03101a;
          border-color: var(--accent);
        }
        
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }
        
        .service-package-card {
          background: rgba(125, 211, 252, 0.05);
          border: 1px solid rgba(125, 211, 252, 0.2);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .service-package-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(125, 211, 252, 0.3);
          border-color: var(--accent);
        }
        
        .package-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        
        .package-header h3 {
          margin: 0;
          color: var(--accent);
          flex: 1;
          min-width: 200px;
        }
        
        .package-price {
          font-weight: bold;
          color: #4ade80;
          font-size: 18px;
        }
        
        .package-roi {
          font-size: 14px;
          color: var(--accent);
          margin-top: 4px;
        }
        
        .package-description {
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .package-steps,
        .package-benefits,
        .package-result {
          margin-bottom: 20px;
        }
        
        .package-steps h4,
        .package-benefits h4,
        .package-result h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: var(--accent);
        }
        
        .package-steps ul {
          margin: 0;
          padding-left: 20px;
          color: var(--muted);
        }
        
        .package-steps li {
          margin-bottom: 4px;
        }
        
        .package-benefits p,
        .package-result p {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.5;
        }
        
        .package-cta {
          width: 100%;
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          color: #03101a;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
        }
        
        .package-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(125, 211, 252, 0.4);
        }
        
        @media (max-width: 768px) {
          .business-showcase {
            padding: 20px;
          }
          
          .packages-grid {
            grid-template-columns: 1fr;
          }
          
          .segment-selector {
            flex-direction: column;
            align-items: center;
          }
          
          .segment-btn {
            width: 100%;
            max-width: 300px;
          }
          
          .package-header {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default BusinessShowcase;
