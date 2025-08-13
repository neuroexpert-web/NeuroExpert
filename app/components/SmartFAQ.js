// Smart-FAQ с автообновлением и сегментацией для NeuroExpert
'use client';
import { useState, useEffect, useMemo } from 'react';

const smartFaqData = {
  small: [
    {
      id: 'cost-small',
      question: 'За сколько окупается цифровизация для малого бизнеса?',
      answer: 'Для малого бизнеса цифровизация окупается за 3-6 месяцев. ROI составляет 200-400%. Минимальные инвестиции от 50,000₽ уже дают ощутимый эффект.',
      category: 'стоимость',
      popularity: 95,
      lastUpdated: '2025-01-15',
      tags: ['окупаемость', 'ROI', 'инвестиции']
    },
    {
      id: 'start-small',
      question: 'С чего начать цифровизацию малого бизнеса?',
      answer: 'Начните с аудита текущих процессов (от 50,000₽), затем внедрите CRM-систему и создайте сайт с AI-ассистентом. Это даст первые результаты уже через месяц.',
      category: 'процесс',
      popularity: 88,
      lastUpdated: '2025-01-12',
      tags: ['аудит', 'CRM', 'сайт', 'AI']
    },
    {
      id: 'tools-small',
      question: 'Какие инструменты нужны малому бизнесу?',
      answer: 'Базовый пакет: простая CRM, сайт-визитка с AI, настройка Яндекс.Директ и Google Ads. Стоимость от 120,000₽, окупаемость 4-5 месяцев.',
      category: 'инструменты',
      popularity: 82,
      lastUpdated: '2025-01-10',
      tags: ['CRM', 'сайт', 'реклама', 'Яндекс.Директ']
    },
    {
      id: 'timeframe-small',
      question: 'Сколько времени занимает внедрение для малого бизнеса?',
      answer: 'Полный цикл внедрения: 1-3 месяца. Аудит - 1 неделя, создание сайта - 2-3 недели, настройка рекламы - 1-2 недели. Первые результаты видны через месяц.',
      category: 'сроки',
      popularity: 79,
      lastUpdated: '2025-01-14',
      tags: ['сроки', 'внедрение', 'результаты']
    }
  ],
  medium: [
    {
      id: 'integration-medium',
      question: 'Как интегрировать BI-инструменты в средний бизнес?',
      answer: 'Интеграция BI начинается с анализа текущих данных, выбора подходящих инструментов (Power BI, Tableau) и поэтапного внедрения. Стоимость от 350,000₽, ROI 400-600%.',
      category: 'интеграция',
      popularity: 91,
      lastUpdated: '2025-01-14',
      tags: ['BI', 'Power BI', 'Tableau', 'аналитика']
    },
    {
      id: 'strategy-medium',
      question: 'Что включает digital-стратегия для среднего бизнеса?',
      answer: 'Комплексная digital-стратегия включает: анализ рынка, автоматизацию процессов, корпоративный сайт с AI, настройку аналитики. От 200,000₽, окупаемость 6-8 месяцев.',
      category: 'стратегия',
      popularity: 87,
      lastUpdated: '2025-01-13',
      tags: ['стратегия', 'автоматизация', 'аналитика']
    },
    {
      id: 'ecommerce-medium',
      question: 'Нужен ли eCommerce среднему бизнесу?',
      answer: 'eCommerce увеличивает продажи на 30-50% для B2B и B2C. Корпоративный интернет-магазин с AI-ассистентом стоит от 500,000₽, окупается за 8-12 месяцев.',
      category: 'продажи',
      popularity: 84,
      lastUpdated: '2025-01-11',
      tags: ['eCommerce', 'продажи', 'B2B', 'B2C']
    },
    {
      id: 'crm-medium',
      question: 'Какую CRM выбрать для среднего бизнеса?',
      answer: 'Для среднего бизнеса подходят: AmoCRM, Битрикс24, HubSpot. Выбор зависит от отрасли и процессов. Внедрение 2-4 недели, стоимость от 150,000₽.',
      category: 'системы',
      popularity: 76,
      lastUpdated: '2025-01-09',
      tags: ['CRM', 'AmoCRM', 'Битрикс24', 'HubSpot']
    }
  ],
  large: [
    {
      id: 'transformation-large',
      question: 'Сколько стоит цифровая трансформация корпорации?',
      answer: 'Полная цифровая трансформация корпорации: от 1,500,000₽. Включает аудит всех бизнес-единиц, интеграцию ERP/CRM, Big Data аналитику. ROI 600-1200%.',
      category: 'трансформация',
      popularity: 93,
      lastUpdated: '2025-01-16',
      tags: ['трансформация', 'ERP', 'Big Data', 'корпорация']
    },
    {
      id: 'erp-large',
      question: 'Как выбрать ERP-систему для крупного бизнеса?',
      answer: 'Выбор ERP зависит от отрасли и масштаба. Мы анализируем требования, предлагаем SAP, Oracle или кастомные решения. Внедрение от 2,000,000₽, сроки 6-12 месяцев.',
      category: 'системы',
      popularity: 89,
      lastUpdated: '2025-01-15',
      tags: ['ERP', 'SAP', 'Oracle', 'кастомные решения']
    },
    {
      id: 'ai-large',
      question: 'Какие AI-решения подходят для корпораций?',
      answer: 'Для корпораций: предиктивная аналитика, чат-боты, автоматизация документооборота, машинное обучение для прогнозов. Комплексное внедрение от 1,000,000₽.',
      category: 'AI',
      popularity: 86,
      lastUpdated: '2025-01-14',
      tags: ['AI', 'машинное обучение', 'предиктивная аналитика', 'чат-боты']
    },
    {
      id: 'security-large',
      question: 'Как обеспечить безопасность при трансформации?',
      answer: 'Многоуровневая защита: шифрование AES-256, VPN, мониторинг угроз 24/7, соответствие ISO 27001. Аудит безопасности включен в план трансформации.',
      category: 'безопасность',
      popularity: 81,
      lastUpdated: '2025-01-13',
      tags: ['безопасность', 'шифрование', 'ISO 27001', 'мониторинг']
    }
  ],
  general: [
    {
      id: 'security',
      question: 'Насколько безопасны ваши решения?',
      answer: 'Все данные шифруются по стандарту AES-256, соответствуют GDPR и 152-ФЗ. Регулярные аудиты безопасности, резервное копирование, защита от DDoS-атак.',
      category: 'безопасность',
      popularity: 96,
      lastUpdated: '2025-01-16',
      tags: ['безопасность', 'GDPR', '152-ФЗ', 'шифрование']
    },
    {
      id: 'support',
      question: 'Какая поддержка предоставляется после внедрения?',
      answer: 'Техническая поддержка 24/7, обучение персонала, регулярные обновления, консультации экспертов. Гарантия на все решения 12 месяцев.',
      category: 'поддержка',
      popularity: 94,
      lastUpdated: '2025-01-15',
      tags: ['поддержка', 'обучение', 'гарантия', '24/7']
    },
    {
      id: 'payment',
      question: 'Какие варианты оплаты доступны?',
      answer: 'Оплата: предоплата 30%, 40% по этапам, 30% после завершения. Возможна рассрочка до 12 месяцев. Принимаем безналичный расчет и криптовалюты.',
      category: 'оплата',
      popularity: 88,
      lastUpdated: '2025-01-12',
      tags: ['оплата', 'рассрочка', 'этапы', 'криптовалюты']
    },
    {
      id: 'regions',
      question: 'В каких регионах вы работаете?',
      answer: 'Работаем по всей России и СНГ. Удаленное внедрение, выезд специалистов в регионы. Международные проекты в ЕС и Азии. Поддержка на русском и английском.',
      category: 'география',
      popularity: 71,
      lastUpdated: '2025-01-10',
      tags: ['регионы', 'СНГ', 'международные проекты', 'удаленно']
    }
  ]
};

// Категории для фильтрации
const categories = [
  { id: 'all', name: 'Все категории', icon: '📋' },
  { id: 'стоимость', name: 'Стоимость', icon: '💰' },
  { id: 'процесс', name: 'Процессы', icon: '⚙️' },
  { id: 'инструменты', name: 'Инструменты', icon: '🛠️' },
  { id: 'сроки', name: 'Сроки', icon: '⏰' },
  { id: 'интеграция', name: 'Интеграция', icon: '🔗' },
  { id: 'стратегия', name: 'Стратегия', icon: '🎯' },
  { id: 'продажи', name: 'Продажи', icon: '📈' },
  { id: 'системы', name: 'Системы', icon: '💻' },
  { id: 'трансформация', name: 'Трансформация', icon: '🔄' },
  { id: 'AI', name: 'Искусственный интеллект', icon: '🤖' },
  { id: 'безопасность', name: 'Безопасность', icon: '🔒' },
  { id: 'поддержка', name: 'Поддержка', icon: '🛟' },
  { id: 'оплата', name: 'Оплата', icon: '💳' },
  { id: 'география', name: 'География', icon: '🌍' }
];

// Сегменты бизнеса
const segments = [
  { id: 'all', name: 'Все сегменты', icon: '🏢' },
  { id: 'small', name: 'Малый бизнес', icon: '🏪' },
  { id: 'medium', name: 'Средний бизнес', icon: '🏢' },
  { id: 'large', name: 'Крупный бизнес', icon: '🏭' },
  { id: 'general', name: 'Общие вопросы', icon: '❓' }
];

function SmartFAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, date, alphabetical

  // Объединяем все FAQ для поиска
  const allFaqs = useMemo(() => {
    const combined = [];
    Object.entries(smartFaqData).forEach(([segment, faqs]) => {
      faqs.forEach(faq => {
        combined.push({ ...faq, segment });
      });
    });
    return combined;
  }, []);

  // Фильтрация и поиск
  const filteredFaqs = useMemo(() => {
    let filtered = allFaqs;

    // Фильтр по сегменту
    if (selectedSegment !== 'all') {
      filtered = filtered.filter(faq => faq.segment === selectedSegment);
    }

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Поиск по тексту
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'date':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'alphabetical':
          return a.question.localeCompare(b.question);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allFaqs, selectedSegment, selectedCategory, searchQuery, sortBy]);

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSegment('all');
    setSelectedCategory('all');
    setExpandedItems(new Set());
  };

  const getSegmentName = (segmentId) => {
    const segment = segments.find(s => s.id === segmentId);
    return segment ? segment.name : segmentId;
  };

  return (
    <section id="faq" className="smart-faq-section">
      <div className="container">
        <h2>❓ Smart FAQ</h2>
        <p className="faq-subtitle">
          Быстрые ответы на часто задаваемые вопросы по сегментам и услугам
        </p>

        {/* Поиск */}
        <div className="faq-search">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Поиск по вопросам, ответам и тегам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            🎛️ Фильтры {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {/* Фильтры */}
        {showFilters && (
          <div className="faq-filters">
            <div className="filter-group">
              <label>Сегмент бизнеса:</label>
              <div className="filter-options">
                {segments.map(segment => (
                  <button
                    key={segment.id}
                    className={`filter-btn ${selectedSegment === segment.id ? 'active' : ''}`}
                    onClick={() => setSelectedSegment(segment.id)}
                  >
                    {segment.icon} {segment.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Категория:</label>
              <div className="filter-options">
                {categories.slice(0, 8).map(category => (
                  <button
                    key={category.id}
                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
              
              <details className="more-categories">
                <summary>Еще категории...</summary>
                <div className="filter-options">
                  {categories.slice(8).map(category => (
                    <button
                      key={category.id}
                      className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </details>
            </div>

            <div className="filter-group">
              <label>Сортировка:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popularity">По популярности</option>
                <option value="date">По дате обновления</option>
                <option value="alphabetical">По алфавиту</option>
              </select>
              
              <button className="clear-filters" onClick={clearFilters}>
                🗑️ Очистить фильтры
              </button>
            </div>
          </div>
        )}

        {/* Результаты поиска */}
        <div className="faq-results">
          <div className="results-header">
            <span className="results-count">
              Найдено {filteredFaqs.length} вопросов
            </span>
            {(searchQuery || selectedSegment !== 'all' || selectedCategory !== 'all') && (
              <span className="active-filters">
                {searchQuery && <span className="filter-tag">🔍 "{searchQuery}"</span>}
                {selectedSegment !== 'all' && <span className="filter-tag">📊 {getSegmentName(selectedSegment)}</span>}
                {selectedCategory !== 'all' && <span className="filter-tag">📋 {categories.find(c => c.id === selectedCategory)?.name}</span>}
              </span>
            )}
          </div>

          {/* FAQ Items */}
          <div className="faq-items">
            {filteredFaqs.length === 0 ? (
              <div className="no-results">
                <h3>🔍 Ничего не найдено</h3>
                <p>Попробуйте изменить параметры поиска или обратитесь к менеджеру</p>
                <button className="contact-manager">💬 Спросить управляющего</button>
              </div>
            ) : (
              filteredFaqs.map(faq => (
                <div key={faq.id} className="faq-item">
                  <div 
                    className="faq-question"
                    onClick={() => toggleExpanded(faq.id)}
                  >
                    <h3>{faq.question}</h3>
                    <div className="faq-meta">
                      <span className="segment-badge">{getSegmentName(faq.segment)}</span>
                      <span className="category-badge">{categories.find(c => c.id === faq.category)?.icon} {faq.category}</span>
                      <span className="popularity">👥 {faq.popularity}%</span>
                      <span className={`expand-icon ${expandedItems.has(faq.id) ? 'expanded' : ''}`}>▼</span>
                    </div>
                  </div>
                  
                  {expandedItems.has(faq.id) && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                      
                      {faq.tags && (
                        <div className="faq-tags">
                          <span className="tags-label">Теги:</span>
                          {faq.tags.map(tag => (
                            <span key={tag} className="tag" onClick={() => setSearchQuery(tag)}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="faq-actions">
                        <button className="helpful-btn">👍 Полезно</button>
                        <button className="not-helpful-btn">👎 Не помогло</button>
                        <button className="ask-manager">💬 Задать вопрос менеджеру</button>
                      </div>
                      
                      <div className="faq-footer">
                        <span className="last-updated">Обновлено: {faq.lastUpdated}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Помощь */}
        <div className="faq-help">
          <h3>Не нашли ответ?</h3>
          <div className="help-actions">
            <button className="help-btn primary">💬 Спросить управляющего</button>
            <button className="help-btn secondary">📞 Заказать звонок</button>
            <button className="help-btn tertiary">📧 Написать на почту</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SmartFAQ;
