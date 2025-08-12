// Smart-FAQ с автообновлением и сегментацией для NeuroExpert
'use client';
import { useState, useEffect } from 'react';

const smartFaqData = {
  small: [
    {
      id: 'cost-small',
      question: 'За сколько окупается цифровизация для малого бизнеса?',
      answer: 'Для малого бизнеса цифровизация окупается за 3-6 месяцев. ROI составляет 200-400%. Минимальные инвестиции от 50,000₽ уже дают ощутимый эффект.',
      category: 'стоимость',
      popularity: 95,
      lastUpdated: '2025-01-15'
    },
    {
      id: 'start-small',
      question: 'С чего начать цифровизацию малого бизнеса?',
      answer: 'Начните с аудита текущих процессов (от 50,000₽), затем внедрите CRM-систему и создайте сайт с AI-ассистентом. Это даст первые результаты уже через месяц.',
      category: 'процесс',
      popularity: 88,
      lastUpdated: '2025-01-12'
    },
    {
      id: 'tools-small',
      question: 'Какие инструменты нужны малому бизнесу?',
      answer: 'Базовый пакет: простая CRM, сайт-визитка с AI, настройка Яндекс.Директ и Google Ads. Стоимость от 120,000₽, окупаемость 4-5 месяцев.',
      category: 'инструменты',
      popularity: 82,
      lastUpdated: '2025-01-10'
    }
  ],
  medium: [
    {
      id: 'integration-medium',
      question: 'Как интегрировать BI-инструменты в средний бизнес?',
      answer: 'Интеграция BI начинается с анализа текущих данных, выбора подходящих инструментов (Power BI, Tableau) и поэтапного внедрения. Стоимость от 350,000₽, ROI 400-600%.',
      category: 'интеграция',
      popularity: 91,
      lastUpdated: '2025-01-14'
    },
    {
      id: 'strategy-medium',
      question: 'Что включает digital-стратегия для среднего бизнеса?',
      answer: 'Комплексная digital-стратегия включает: анализ рынка, автоматизацию процессов, корпоративный сайт с AI, настройку аналитики. От 200,000₽, окупаемость 6-8 месяцев.',
      category: 'стратегия',
      popularity: 87,
      lastUpdated: '2025-01-13'
    },
    {
      id: 'ecommerce-medium',
      question: 'Нужен ли eCommerce среднему бизнесу?',
      answer: 'eCommerce увеличивает продажи на 30-50% для B2B и B2C. Корпоративный интернет-магазин с AI-ассистентом стоит от 500,000₽, окупается за 8-12 месяцев.',
      category: 'продажи',
      popularity: 84,
      lastUpdated: '2025-01-11'
    }
  ],
  large: [
    {
      id: 'transformation-large',
      question: 'Сколько стоит цифровая трансформация корпорации?',
      answer: 'Полная цифровая трансформация корпорации: от 1,500,000₽. Включает аудит всех бизнес-единиц, интеграцию ERP/CRM, Big Data аналитику. ROI 600-1200%.',
      category: 'трансформация',
      popularity: 93,
      lastUpdated: '2025-01-16'
    },
    {
      id: 'erp-large',
      question: 'Как выбрать ERP-систему для крупного бизнеса?',
      answer: 'Выбор ERP зависит от отрасли и масштаба. Мы анализируем требования, предлагаем SAP, Oracle или кастомные решения. Внедрение от 2,000,000₽, сроки 6-12 месяцев.',
      category: 'системы',
      popularity: 89,
      lastUpdated: '2025-01-15'
    },
    {
      id: 'ai-large',
      question: 'Какие AI-решения подходят для корпораций?',
      answer: 'Для корпораций: предиктивная аналитика, чат-боты, автоматизация документооборота, машинное обучение для прогнозов. Комплексное внедрение от 1,000,000₽.',
      category: 'AI',
      popularity: 86,
      lastUpdated: '2025-01-14'
    }
  ],
  general: [
    {
      id: 'security',
      question: 'Насколько безопасны ваши решения?',
      answer: 'Все данные шифруются по стандарту AES-256, соответствуют GDPR и 152-ФЗ. Регулярные аудиты безопасности, резервное копирование, защита от DDoS-атак.',
      category: 'безопасность',
      popularity: 96,
      lastUpdated: '2025-01-16'
    },
    {
      id: 'support',
      question: 'Какая поддержка предоставляется после внедрения?',
      answer: 'Техническая поддержка 24/7, обучение персонала, регулярные обновления, консультации экспертов. Гарантия на все решения 12 месяцев.',
      category: 'поддержка',
      popularity: 94,
      lastUpdated: '2025-01-15'
    }
  ]
};

function SmartFAQ() {
  const [selectedSegment, setSelectedSegment] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [filteredFAQs, setFilteredFAQs] = useState([]);

  const segments = {
    general: '🔄 Общие вопросы',
    small: '👥 Малый бизнес',
    medium: '🏢 Средний бизнес',
    large: '🏭 Крупный бизнес'
  };

  // Фильтрация FAQ по поисковому запросу
  useEffect(() => {
    const currentFAQs = smartFaqData[selectedSegment] || [];
    
    if (!searchQuery.trim()) {
      setFilteredFAQs(currentFAQs.sort((a, b) => b.popularity - a.popularity));
      return;
    }

    const filtered = currentFAQs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredFAQs(filtered.sort((a, b) => b.popularity - a.popularity));
  }, [selectedSegment, searchQuery]);

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getPopularityBadge = (popularity) => {
    if (popularity >= 90) return { text: '🔥 Популярный', color: '#ef4444' };
    if (popularity >= 80) return { text: '⭐ Частый', color: '#f59e0b' };
    return { text: '💡 Полезный', color: '#10b981' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="smart-faq">
      <div className="faq-header">
        <h2>🧠 Smart-FAQ</h2>
        <p className="faq-subtitle">
          Умная база знаний с автообновлением по реальным вопросам клиентов
        </p>
      </div>

      {/* Поиск */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Поиск по вопросам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Селектор сегментов */}
      <div className="segment-selector">
        {Object.entries(segments).map(([key, label]) => (
          <button
            key={key}
            className={`segment-btn ${selectedSegment === key ? 'active' : ''}`}
            onClick={() => setSelectedSegment(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="faq-list">
        {filteredFAQs.length === 0 ? (
          <div className="no-results">
            <p>🤔 По вашему запросу ничего не найдено</p>
            <p>Попробуйте изменить поисковый запрос или выбрать другой сегмент</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedItems.has(faq.id);
            const badge = getPopularityBadge(faq.popularity);
            
            return (
              <div 
                key={faq.id} 
                className={`faq-item ${isExpanded ? 'expanded' : ''}`}
              >
                <div 
                  className="faq-question"
                  onClick={() => toggleExpanded(faq.id)}
                >
                  <div className="question-content">
                    <h3>{faq.question}</h3>
                    <div className="question-meta">
                      <span 
                        className="popularity-badge"
                        style={{ color: badge.color }}
                      >
                        {badge.text}
                      </span>
                      <span className="update-date">
                        Обновлено {formatDate(faq.lastUpdated)}
                      </span>
                    </div>
                  </div>
                  <div className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>
                    ▼
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                    <div className="answer-actions">
                      <button className="helpful-btn">
                        👍 Полезно
                      </button>
                      <button className="contact-btn">
                        💬 Нужна консультация
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Статистика */}
      <div className="faq-stats">
        <div className="stats-item">
          <span className="stats-number">{filteredFAQs.length}</span>
          <span className="stats-label">вопросов</span>
        </div>
        <div className="stats-item">
          <span className="stats-number">95%</span>
          <span className="stats-label">решений</span>
        </div>
        <div className="stats-item">
          <span className="stats-number">24/7</span>
          <span className="stats-label">доступность</span>
        </div>
      </div>

      <style jsx>{`
        .smart-faq {
          margin: 40px 0;
          padding: 32px;
          background: var(--card);
          border-radius: 16px;
          border: 1px solid rgba(125, 211, 252, 0.2);
        }
        
        .faq-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .faq-header h2 {
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .faq-subtitle {
          color: var(--muted);
          margin: 0;
        }
        
        .search-section {
          margin-bottom: 24px;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 20px;
          border: 2px solid rgba(125, 211, 252, 0.3);
          border-radius: 25px;
          background: rgba(125, 211, 252, 0.05);
          color: var(--text);
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.1);
        }
        
        .segment-selector {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        
        .segment-btn {
          padding: 8px 16px;
          border: 1px solid rgba(125, 211, 252, 0.3);
          background: transparent;
          color: var(--text);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
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
        
        .faq-list {
          margin-bottom: 32px;
        }
        
        .faq-item {
          border: 1px solid rgba(125, 211, 252, 0.2);
          border-radius: 12px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .faq-item:hover {
          border-color: var(--accent);
          box-shadow: 0 4px 12px rgba(125, 211, 252, 0.2);
        }
        
        .faq-question {
          padding: 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(125, 211, 252, 0.03);
          transition: all 0.3s ease;
        }
        
        .faq-question:hover {
          background: rgba(125, 211, 252, 0.08);
        }
        
        .question-content {
          flex: 1;
        }
        
        .question-content h3 {
          margin: 0 0 8px 0;
          color: var(--text);
          font-size: 16px;
          line-height: 1.4;
        }
        
        .question-meta {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .popularity-badge {
          font-size: 12px;
          font-weight: bold;
        }
        
        .update-date {
          font-size: 12px;
          color: var(--muted);
        }
        
        .expand-icon {
          color: var(--accent);
          transition: transform 0.3s ease;
          font-size: 12px;
        }
        
        .expand-icon.rotated {
          transform: rotate(180deg);
        }
        
        .faq-answer {
          padding: 20px;
          border-top: 1px solid rgba(125, 211, 252, 0.1);
          background: rgba(125, 211, 252, 0.02);
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .faq-answer p {
          margin: 0 0 16px 0;
          color: var(--text);
          line-height: 1.6;
        }
        
        .answer-actions {
          display: flex;
          gap: 12px;
        }
        
        .helpful-btn,
        .contact-btn {
          padding: 8px 16px;
          border: 1px solid rgba(125, 211, 252, 0.3);
          background: transparent;
          color: var(--accent);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        
        .helpful-btn:hover {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
          color: #22c55e;
        }
        
        .contact-btn:hover {
          background: rgba(125, 211, 252, 0.1);
          border-color: var(--accent);
        }
        
        .no-results {
          text-align: center;
          padding: 40px 20px;
          color: var(--muted);
        }
        
        .faq-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          padding: 20px 0;
          border-top: 1px solid rgba(125, 211, 252, 0.2);
        }
        
        .stats-item {
          text-align: center;
        }
        
        .stats-number {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: var(--accent);
        }
        
        .stats-label {
          font-size: 14px;
          color: var(--muted);
        }
        
        @media (max-width: 768px) {
          .smart-faq {
            padding: 20px;
          }
          
          .segment-selector {
            flex-direction: column;
            align-items: center;
          }
          
          .segment-btn {
            width: 100%;
            max-width: 250px;
          }
          
          .question-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .answer-actions {
            flex-direction: column;
          }
          
          .faq-stats {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default SmartFAQ;
