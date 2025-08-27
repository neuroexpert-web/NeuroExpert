'use client';

import { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import SwipeContainer from './components/SwipeContainer';

// Динамические импорты для аналитики
const AnalyticsCharts = dynamic(() => import('./components/AnalyticsCharts'), {
  ssr: false,
  loading: () => null
});

const RealtimeUpdates = dynamic(() => import('./components/RealtimeUpdates'), {
  ssr: false,
  loading: () => null
});

const TooltipManager = dynamic(() => import('./components/TooltipManager'), {
  ssr: false,
  loading: () => null
});

const OnboardingTour = dynamic(() => import('./components/OnboardingTour'), {
  ssr: false,
  loading: () => null
});

// Динамические импорты для страницы аудитории
const SegmentManager = dynamic(() => import('./components/SegmentManager'), {
  ssr: false,
  loading: () => null
});

const AudienceTooltips = dynamic(() => import('./components/AudienceTooltips'), {
  ssr: false,
  loading: () => null
});

// Динамические импорты для страницы процессов
const ProcessManager = dynamic(() => import('./components/ProcessManager'), {
  ssr: false,
  loading: () => null
});

const ProcessTooltips = dynamic(() => import('./components/ProcessTooltips'), {
  ssr: false,
  loading: () => null
});

// Динамические импорты для страницы решений
const SolutionsManager = dynamic(() => import('./components/SolutionsManager'), {
  ssr: false,
  loading: () => null
});

const SolutionsComparison = dynamic(() => import('./components/SolutionsComparison'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [activeSegment, setActiveSegment] = useState('loyal');
  
  // Определение разделов для навигации
  const sections = [
    'Главная',
    'Аналитика',
    'Аудитория',
    'Процессы'
  ];

  // Обработка смены секции
  const handleSectionChange = useCallback((index) => {
    setCurrentSection(index);
  }, []);

  // Обработка смены сегмента
  const handleSegmentChange = useCallback((segment) => {
    setActiveSegment(segment);
  }, []);

  // Компоненты для каждого раздела
  const sectionComponents = [
    // 1. Главная
    <section key="home" className="full-page">
      <div className="background-animation"></div>
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">NeuroExpert</h1>
          <p className="descriptor">
            Цифровая трансформация<br/>бизнеса с помощью AI
          </p>
          <button className="cta-button">
            Начать бесплатно
          </button>
        </div>
        <div className="swipe-hint">
          <span className="swipe-hint-desktop">Листайте, чтобы узнать больше →</span>
          <div className="swipe-hint-mobile"></div>
        </div>
      </main>
    </section>,
    
    // 2. Аналитика - улучшенная с живыми KPI и графиками
    <section key="analytics" id="analytics-dashboard" className="full-page scrollable-section">
      <header className="page-header">
        <h2>Аналитика в реальном времени</h2>
        <p>Ваши ключевые показатели и умные рекомендации для роста бизнеса</p>
      </header>
      
      {/* Панель фильтров */}
      <div className="filters-panel glass-card">
        <div className="filter-group">
          <label htmlFor="date-filter">Период:</label>
          <select id="date-filter" className="filter-select">
            <option value="today">Сегодня</option>
            <option value="week" selected>Последние 7 дней</option>
            <option value="month">Последние 30 дней</option>
            <option value="quarter">Квартал</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="segment-filter">Сегмент:</label>
          <select id="segment-filter" className="filter-select">
            <option value="all">Все клиенты</option>
            <option value="new">Новые</option>
            <option value="returning">Постоянные</option>
            <option value="vip">VIP</option>
          </select>
        </div>
        <button className="refresh-button" aria-label="Обновить данные">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Обновить</span>
        </button>
      </div>
        {/* KPI карточки с пояснениями */}
        <div className="kpi-cards">
          <div className="kpi-card glass-card" id="kpi-revenue">
            <div className="kpi-header">
              <span className="kpi-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="kpi-title">Выручка</span>
              <button className="help-icon" aria-describedby="tooltip-revenue" tabIndex="0">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </button>
              <div id="tooltip-revenue" className="tooltip" role="tooltip" hidden>
                Общая выручка за выбранный период от всех каналов продаж. Включает все успешные транзакции.
              </div>
            </div>
            <div className="kpi-value">₽ 7 128,4K</div>
            <div className="kpi-description">За последние 7 дней</div>
            <div className="kpi-trend positive">
              <span className="trend-icon">↑</span>
              <span>+5.2% по сравнению с прошлой неделей</span>
            </div>
            <div className="kpi-sparkline" id="revenue-sparkline"></div>
          </div>

          <div className="kpi-card glass-card" id="kpi-clients">
            <div className="kpi-header">
              <span className="kpi-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="kpi-title">Новые клиенты</span>
              <button className="help-icon" aria-describedby="tooltip-clients" tabIndex="0">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </button>
              <div id="tooltip-clients" className="tooltip" role="tooltip" hidden>
                Количество новых уникальных пользователей, которые совершили первую покупку или регистрацию.
              </div>
            </div>
            <div className="kpi-value">162</div>
            <div className="kpi-description">Зарегистрировались за неделю</div>
            <div className="kpi-trend positive">
              <span className="trend-icon">↑</span>
              <span>+12% больше обычного</span>
            </div>
            <div className="kpi-sparkline" id="clients-sparkline"></div>
          </div>

          <div className="kpi-card glass-card" id="kpi-satisfaction">
            <div className="kpi-header">
              <span className="kpi-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="kpi-title">Удовлетворенность</span>
              <button className="help-icon" aria-describedby="tooltip-satisfaction" tabIndex="0">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </button>
              <div id="tooltip-satisfaction" className="tooltip" role="tooltip" hidden>
                Средняя оценка клиентов на основе отзывов и NPS-опросов.
              </div>
            </div>
            <div className="kpi-value">4.85/5</div>
            <div className="kpi-description">Средняя оценка клиентов</div>
            <div className="kpi-trend negative">
              <span className="trend-icon">↓</span>
              <span>Небольшое снижение (-0.15)</span>
            </div>
            <div className="kpi-sparkline" id="satisfaction-sparkline"></div>
          </div>
          
          <div className="kpi-card glass-card" id="kpi-conversion">
            <div className="kpi-header">
              <span className="kpi-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="kpi-title">Конверсия</span>
              <button className="help-icon" aria-describedby="tooltip-conversion" tabIndex="0">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </button>
              <div id="tooltip-conversion" className="tooltip" role="tooltip" hidden>
                Процент посетителей, совершивших целевое действие (покупка, регистрация, подписка).
              </div>
            </div>
            <div className="kpi-value">3.13%</div>
            <div className="kpi-description">Из посетителей в клиенты</div>
            <div className="kpi-trend positive">
              <span className="trend-icon">↑</span>
              <span>Растёт (+0.5%)</span>
            </div>
            <div className="kpi-sparkline" id="conversion-sparkline"></div>
          </div>
        </div>
        
        {/* Контейнер для графиков с заголовками */}
        <div className="charts-section">
          <h3 className="section-title">Детальная аналитика</h3>
          <div className="charts-container">
            <div className="chart-card glass-card" id="chart-revenue">
              <div className="chart-header">
                <h4>Динамика выручки</h4>
                <div className="chart-filters">
                  <button className="filter-btn active" data-period="7d">7 дней</button>
                  <button className="filter-btn" data-period="30d">30 дней</button>
                  <button className="filter-btn" data-period="90d">90 дней</button>
                </div>
              </div>
              <div className="chart-wrapper">
                <canvas id="revenueChart"></canvas>
              </div>
            </div>
          
          <div className="chart-card glass-card" id="chart-traffic">
            <div className="chart-header">
              <h4>Источники трафика</h4>
              <button className="info-btn" aria-label="Подробнее об источниках">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </button>
            </div>
            <div className="chart-wrapper">
              <canvas id="trafficChart"></canvas>
            </div>
          </div>
          
          <div className="chart-card glass-card" id="chart-funnel">
            <div className="chart-header">
              <h4>Воронка продаж</h4>
              <span className="chart-subtitle">Путь клиента от первого касания до покупки</span>
            </div>
            <div className="chart-wrapper">
              <canvas id="funnelChart"></canvas>
            </div>
          </div>
          </div>
        </div>

        {/* AI рекомендации с пояснениями */}
        <section className="ai-recommendations">
          <div className="section-header">
            <h3>Умные рекомендации для вашего бизнеса</h3>
            <p>AI проанализировал ваши данные и нашёл возможности для роста</p>
          </div>
          <div className="recommendations-grid">
            <div className="recommendation-card glass-card">
              <div className="rec-header">
                <div className="rec-icon idea">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="rec-priority high">
                  <span className="priority-dot"></span>
                  Высокий приоритет
                </div>
              </div>
              <h4>Улучшите мобильный опыт</h4>
              <div className="rec-metric">
                <span className="metric-label">Потенциальный рост:</span>
                <span className="metric-value">+15% конверсии</span>
              </div>
              <p>Мы заметили, что 72% ваших новых пользователей заходят с телефонов, но конверсия на мобильных ниже на 40%. Оптимизация интерфейса решит эту проблему.</p>
              <div className="rec-actions">
                <button className="rec-action-button primary">Начать оптимизацию</button>
                <button className="rec-action-button secondary">Узнать детали</button>
              </div>
            </div>
            
            <div className="recommendation-card glass-card">
              <div className="rec-header">
                <div className="rec-icon warning">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="rec-priority medium">
                  <span className="priority-dot"></span>
                  Требует внимания
                </div>
              </div>
              <h4>Удержите ценных клиентов</h4>
              <div className="rec-metric">
                <span className="metric-label">В зоне риска:</span>
                <span className="metric-value warning">312 клиентов</span>
              </div>
              <p>Клиенты из сегмента "Малый бизнес" стали реже совершать покупки (-25% за месяц). Персонализированная email-кампания поможет их вернуть.</p>
              <div className="rec-actions">
                <button className="rec-action-button primary">Создать кампанию</button>
                <button className="rec-action-button secondary">Посмотреть список</button>
              </div>
            </div>

            <div className="recommendation-card glass-card">
              <div className="rec-header">
                <div className="rec-icon success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="rec-priority low">Возможность роста</div>
              </div>
              <h4>Увеличьте частоту покупок</h4>
              <p>Внедрение программы лояльности может увеличить повторные покупки на 30% и средний чек на 20%.</p>
              <div className="rec-actions">
                <button className="rec-action-button primary">Запустить программу</button>
                <button className="rec-action-button secondary">Изучить варианты</button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Индикатор скролла */}
        <div className="scroll-indicator">
          <span>Прокрутите для большего</span>
          <div className="scroll-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M7 10l5 5 5-5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      
      {/* Компоненты для графиков и обновлений в реальном времени */}
      <Suspense fallback={null}>
        <AnalyticsCharts />
        <RealtimeUpdates />
        <TooltipManager />
        <OnboardingTour />
      </Suspense>
    </section>,

    // 3. Аудитория - улучшенная с интерактивными сегментами
    <section key="audience" id="page-audience" className="full-page">
      <div className="page-header">
        <h2>Портрет вашей аудитории</h2>
        <p>Понимайте своих клиентов, чтобы предлагать им то, что действительно нужно</p>
      </div>

      <div className="audience-container">
        {/* Левая панель: Выбор сегмента */}
        <div className="segment-selector-panel glass-card">
          <div className="panel-header">
            <h4>Сегменты клиентов</h4>
            <button className="info-btn" aria-label="Подробнее о сегментации">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </button>
          </div>
          <ul role="tablist" aria-label="Список сегментов клиентов">
            <li 
              className={`segment-item ${activeSegment === 'loyal' ? 'active' : ''}`}
              onClick={() => handleSegmentChange('loyal')}
              onKeyDown={(e) => e.key === 'Enter' && handleSegmentChange('loyal')}
              role="tab"
              tabIndex={activeSegment === 'loyal' ? 0 : -1}
              aria-selected={activeSegment === 'loyal'}
              aria-controls="segment-loyal-content"
              data-segment="loyal"
            >
              <span className="segment-icon loyal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
                </svg>
              </span>
              <div className="segment-info">
                <span className="segment-name">Лояльные клиенты</span>
                <span className="segment-count">3,450 человек</span>
              </div>
              <span className="segment-percentage">28%</span>
            </li>
            <li 
              className={`segment-item ${activeSegment === 'new' ? 'active' : ''}`}
              onClick={() => handleSegmentChange('new')}
              onKeyDown={(e) => e.key === 'Enter' && handleSegmentChange('new')}
              role="tab"
              tabIndex={activeSegment === 'new' ? 0 : -1}
              aria-selected={activeSegment === 'new'}
              aria-controls="segment-new-content"
              data-segment="new"
            >
              <span className="segment-icon new-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" strokeWidth="2"/>
                </svg>
              </span>
              <div className="segment-info">
                <span className="segment-name">Новые пользователи</span>
                <span className="segment-count">892 человека</span>
              </div>
              <span className="segment-percentage">12%</span>
            </li>
            <li 
              className={`segment-item ${activeSegment === 'vip' ? 'active' : ''}`}
              onClick={() => handleSegmentChange('vip')}
              onKeyDown={(e) => e.key === 'Enter' && handleSegmentChange('vip')}
              role="tab"
              tabIndex={activeSegment === 'vip' ? 0 : -1}
              aria-selected={activeSegment === 'vip'}
              aria-controls="segment-vip-content"
              data-segment="vip"
            >
              <span className="segment-icon vip-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2"/>
                </svg>
              </span>
              <div className="segment-info">
                <span className="segment-name">VIP-сегмент</span>
                <span className="segment-count">412 человек</span>
              </div>
              <span className="segment-percentage">7%</span>
            </li>
            <li 
              className={`segment-item ${activeSegment === 'churn-risk' ? 'active' : ''}`}
              onClick={() => handleSegmentChange('churn-risk')}
              onKeyDown={(e) => e.key === 'Enter' && handleSegmentChange('churn-risk')}
              role="tab"
              tabIndex={activeSegment === 'churn-risk' ? 0 : -1}
              aria-selected={activeSegment === 'churn-risk'}
              aria-controls="segment-churn-content"
              data-segment="churn-risk"
            >
              <span className="segment-icon churn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" strokeWidth="2"/>
                </svg>
              </span>
              <div className="segment-info">
                <span className="segment-name">На грани оттока</span>
                <span className="segment-count">1,289 человек</span>
              </div>
              <span className="segment-percentage">21%</span>
            </li>
            <li className="segment-item add-new" tabIndex={-1}>
              <span className="segment-icon add-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <div className="segment-info">
                <span className="segment-name">Создать свой сегмент</span>
                <span className="segment-count">Настроить параметры</span>
              </div>
            </li>
          </ul>
          
          {/* Общая статистика */}
          <div className="total-stats">
            <div className="stat-item">
              <span className="stat-label">Всего клиентов:</span>
              <span className="stat-value">12,043</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Активных за месяц:</span>
              <span className="stat-value">8,721</span>
            </div>
          </div>
        </div>

        {/* Правая панель: Детали сегмента */}
        <div className="segment-details-panel" role="tabpanel">
          {/* Контент для "Лояльные клиенты" */}
          <div 
            id="segment-loyal-content"
            className={`segment-content ${activeSegment === 'loyal' ? 'active' : ''}`}
            aria-hidden={activeSegment !== 'loyal'}
          >
            <div className="segment-header">
              <div>
                <h3>Лояльные клиенты</h3>
                <p className="segment-description">Ваши самые ценные и постоянные покупатели</p>
              </div>
              <div className="segment-badges">
                <span className="badge badge-success">Активные</span>
                <span className="badge badge-premium">Высокий LTV</span>
              </div>
            </div>
            
            <div className="segment-stats-overview glass-card">
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div>
                  <h4>3,450</h4>
                  <p>пользователей</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📈</span>
                <div>
                  <h4>28%</h4>
                  <p>от всей базы</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div>
                  <h4>₽45,900</h4>
                  <p>средний LTV</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🔄</span>
                <div>
                  <h4>3.5</h4>
                  <p>покупок в месяц</p>
                </div>
              </div>
            </div>
            <div className="details-grid">
              <div className="detail-card demographics-card glass-card">
                <div className="card-header">
                  <h4>Демография</h4>
                  <button className="help-icon" aria-describedby="demo-tooltip" tabIndex="0">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </button>
                  <div id="demo-tooltip" className="tooltip" role="tooltip" hidden>
                    Распределение клиентов по возрасту, полу и географии
                  </div>
                </div>
                <div className="chart-wrapper">
                  <canvas id="loyalDemographicsChart"></canvas>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{background: '#8b5cf6'}}></span>
                    <span>25-34 лет (45%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{background: '#ec4899'}}></span>
                    <span>35-44 лет (30%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{background: '#3b82f6'}}></span>
                    <span>45+ лет (25%)</span>
                  </div>
                </div>
              </div>
              <div className="detail-card behavior-card glass-card">
                <div className="card-header">
                  <h4>Поведение покупателей</h4>
                </div>
                <div className="behavior-metrics">
                  <div className="behavior-metric">
                    <div className="metric-header">
                      <span className="metric-icon">💵</span>
                      <span className="metric-label">Средний чек</span>
                    </div>
                    <div className="metric-value">
                      <strong>₽ 4,800</strong>
                      <span className="metric-trend positive">+12%</span>
                    </div>
                  </div>
                  <div className="behavior-metric">
                    <div className="metric-header">
                      <span className="metric-icon">🛒</span>
                      <span className="metric-label">Частота покупок</span>
                    </div>
                    <div className="metric-value">
                      <strong>3.5 раз/мес</strong>
                      <span className="metric-subtext">выше среднего на 40%</span>
                    </div>
                  </div>
                  <div className="behavior-metric">
                    <div className="metric-header">
                      <span className="metric-icon">📱</span>
                      <span className="metric-label">Любимый канал</span>
                    </div>
                    <div className="metric-value">
                      <strong>Мобильное приложение</strong>
                      <span className="metric-subtext">78% покупок</span>
                    </div>
                  </div>
                  <div className="behavior-metric">
                    <div className="metric-header">
                      <span className="metric-icon">⏰</span>
                      <span className="metric-label">Активное время</span>
                    </div>
                    <div className="metric-value">
                      <strong>19:00 - 22:00</strong>
                      <span className="metric-subtext">будние дни</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail-card ltv-card glass-card">
                <div className="card-header">
                  <h4>Ценность клиента (LTV)</h4>
                  <button className="help-icon" aria-describedby="ltv-tooltip" tabIndex="0">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </button>
                  <div id="ltv-tooltip" className="tooltip" role="tooltip" hidden>
                    Прогнозируемая прибыль от клиента за всё время сотрудничества
                  </div>
                </div>
                <div className="ltv-content">
                  <div className="ltv-main">
                    <span className="ltv-value">₽ 45,900</span>
                    <div className="ltv-comparison">
                      <span className="comparison-icon">📊</span>
                      <span>На 120% выше среднего</span>
                    </div>
                  </div>
                  <div className="ltv-breakdown">
                    <h5>Структура LTV:</h5>
                    <div className="ltv-item">
                      <span>Первая покупка:</span>
                      <strong>₽ 3,200</strong>
                    </div>
                    <div className="ltv-item">
                      <span>Повторные покупки:</span>
                      <strong>₽ 38,500</strong>
                    </div>
                    <div className="ltv-item">
                      <span>Рефералы:</span>
                      <strong>₽ 4,200</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI рекомендации для сегмента */}
            <div className="ai-recommendation-for-segment glass-card">
              <div className="rec-header">
                <div className="rec-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2"/>
                  </svg>
                </div>
                <h4>Умные рекомендации для работы с сегментом</h4>
              </div>
              <div className="recommendations-list">
                <div className="rec-item">
                  <span className="rec-number">1</span>
                  <div className="rec-content">
                    <h5>Программа привилегий</h5>
                    <p>Запустите VIP-программу с эксклюзивными предложениями. Эти клиенты готовы платить больше за особое отношение.</p>
                    <button className="rec-action">Создать программу</button>
                  </div>
                </div>
                <div className="rec-item">
                  <span className="rec-number">2</span>
                  <div className="rec-content">
                    <h5>Персональные рекомендации</h5>
                    <p>Используйте историю покупок для персонализированных предложений. Повысьте средний чек на 15-20%.</p>
                    <button className="rec-action">Настроить AI</button>
                  </div>
                </div>
                <div className="rec-item">
                  <span className="rec-number">3</span>
                  <div className="rec-content">
                    <h5>Реферальная программа</h5>
                    <p>Лояльные клиенты - лучшие адвокаты бренда. Предложите им бонусы за привлечение друзей.</p>
                    <button className="rec-action">Запустить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Контент для "Новые пользователи" */}
          <div className={`segment-content ${activeSegment === 'new' ? 'active' : ''}`}>
            <div className="segment-header">
              <h3>Новые пользователи</h3>
              <p>1,256 пользователей (10.2% от всей базы)</p>
            </div>
            <div className="details-grid">
              <div className="detail-card demographics-card">
                <h4>Демография</h4>
                <div className="chart-placeholder small">
                  <canvas id="newDemographicsChart"></canvas>
                </div>
              </div>
              <div className="detail-card behavior-card">
                <h4>Поведение</h4>
                <div className="behavior-metric">
                  <span>Средний чек</span>
                  <strong>₽ 2,300</strong>
                </div>
                <div className="behavior-metric">
                  <span>Конверсия в покупателя</span>
                  <strong>23%</strong>
                </div>
              </div>
              <div className="detail-card ltv-card">
                <h4>Потенциальная ценность</h4>
                <span className="ltv-value">₽ 12,400</span>
                <p>Прогноз на 6 месяцев</p>
              </div>
            </div>
            <div className="ai-recommendation-for-segment">
              <div className="rec-icon idea-icon"></div>
              <p><strong>AI-совет:</strong> Фокусируйтесь на onboarding. Первые 30 дней критичны для удержания. Создайте welcome-серию писем.</p>
            </div>
          </div>

          {/* Контент для "VIP-сегмент" */}
          <div className={`segment-content ${activeSegment === 'vip' ? 'active' : ''}`}>
            <div className="segment-header">
              <h3>VIP-сегмент</h3>
              <p>432 пользователя (3.5% от всей базы)</p>
            </div>
            <div className="details-grid">
              <div className="detail-card demographics-card">
                <h4>Демография</h4>
                <div className="chart-placeholder small">
                  <canvas id="vipDemographicsChart"></canvas>
                </div>
              </div>
              <div className="detail-card behavior-card">
                <h4>Поведение</h4>
                <div className="behavior-metric">
                  <span>Средний чек</span>
                  <strong>₽ 15,600</strong>
                </div>
                <div className="behavior-metric">
                  <span>Частота покупок</span>
                  <strong>5.2 раз/мес</strong>
                </div>
              </div>
              <div className="detail-card ltv-card">
                <h4>Lifetime Value (LTV)</h4>
                <span className="ltv-value">₽ 187,200</span>
                <p>Топ 3.5% по доходности</p>
              </div>
            </div>
            <div className="ai-recommendation-for-segment">
              <div className="rec-icon idea-icon"></div>
              <p><strong>AI-совет:</strong> Персональный подход критичен. Назначьте dedicated manager и предложите early access к новинкам.</p>
            </div>
          </div>

          {/* Контент для "На грани оттока" */}
          <div className={`segment-content ${activeSegment === 'churn-risk' ? 'active' : ''}`}>
            <div className="segment-header">
              <h3>На грани оттока</h3>
              <p>892 пользователя (7.2% от всей базы)</p>
            </div>
            <div className="details-grid">
              <div className="detail-card demographics-card">
                <h4>Причины оттока</h4>
                <div className="chart-placeholder small">
                  <canvas id="churnReasonsChart"></canvas>
                </div>
              </div>
              <div className="detail-card behavior-card">
                <h4>Последняя активность</h4>
                <div className="behavior-metric">
                  <span>Дней без покупок</span>
                  <strong className="negative">45-90</strong>
                </div>
                <div className="behavior-metric">
                  <span>Снижение активности</span>
                  <strong className="negative">-78%</strong>
                </div>
              </div>
              <div className="detail-card ltv-card">
                <h4>Потери при оттоке</h4>
                <span className="ltv-value negative">₽ 2.1M</span>
                <p>Потенциальные потери/год</p>
              </div>
            </div>
            <div className="ai-recommendation-for-segment">
              <div className="rec-icon warning-icon"></div>
              <p><strong>AI-совет:</strong> Срочная реактивация! Запустите win-back кампанию с персональными скидками 20-30%. Время критично.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Компоненты для управления сегментами и подсказками */}
      <Suspense fallback={null}>
        <SegmentManager />
        <AudienceTooltips />
      </Suspense>
    </section>,

    // 4. Процессы - улучшенная с UX акцентом
    <section key="processes" id="page-processes" className="full-page">
      <div className="page-header">
        <h2>Управление бизнес-процессами</h2>
        <p>Контролируйте задачи, ресурсы и эффективность в одном месте</p>
      </div>

      <div className="processes-container">
        {/* Левая панель: Приоритетные задачи */}
        <aside className="task-priorities glass-card">
          <div className="panel-header">
            <h3>Приоритетные задачи</h3>
            <div className="task-filters">
              <button className="filter-btn active" data-filter="all">Все</button>
              <button className="filter-btn" data-filter="high">Высокий</button>
              <button className="filter-btn" data-filter="today">Сегодня</button>
            </div>
          </div>
          
          <div className="tasks-stats">
            <div className="stat-mini">
              <span className="stat-value">12</span>
              <span className="stat-label">активных</span>
            </div>
            <div className="stat-mini">
              <span className="stat-value">3</span>
              <span className="stat-label">срочных</span>
            </div>
            <div className="stat-mini">
              <span className="stat-value">85%</span>
              <span className="stat-label">выполнено</span>
            </div>
          </div>
          
          <ul className="tasks-list" role="list">
            <li className="task-item high-priority" data-priority="high">
              <div className="task-indicator">
                <span className="priority-icon high">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z"/>
                  </svg>
                </span>
                <div className="priority-line"></div>
              </div>
              <div className="task-content">
                <div className="task-header">
                  <strong>Обновить CRM систему</strong>
                  <span className="task-status in-progress">В работе</span>
                </div>
                <p className="task-description">Интеграция с новым AI-модулем для автоматизации продаж</p>
                <div className="task-meta">
                  <span className="task-deadline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeWidth="2"/>
                    </svg>
                    30 августа
                  </span>
                  <span className="task-assignee">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth="2"/>
                    </svg>
                    IT отдел
                  </span>
                </div>
              </div>
            </li>
            <li className="task-item medium-priority" data-priority="medium">
              <div className="task-indicator">
                <span className="priority-icon medium">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z"/>
                  </svg>
                </span>
                <div className="priority-line"></div>
              </div>
              <div className="task-content">
                <div className="task-header">
                  <strong>Анализ клиентской базы</strong>
                  <span className="task-status pending">Ожидает</span>
                </div>
                <p className="task-description">Подготовка сегментов VIP для персонализированных предложений</p>
                <div className="task-meta">
                  <span className="task-deadline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeWidth="2"/>
                    </svg>
                    5 сентября
                  </span>
                  <span className="task-assignee">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth="2"/>
                    </svg>
                    Маркетинг
                  </span>
                </div>
              </div>
            </li>
            <li className="task-item low-priority" data-priority="low">
              <div className="task-indicator">
                <span className="priority-icon low">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z"/>
                  </svg>
                </span>
                <div className="priority-line"></div>
              </div>
              <div className="task-content">
                <div className="task-header">
                  <strong>Тестирование AI-бота</strong>
                  <span className="task-status planned">Запланировано</span>
                </div>
                <p className="task-description">Проверка новых сценариев для улучшения клиентского опыта</p>
                <div className="task-meta">
                  <span className="task-deadline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeWidth="2"/>
                    </svg>
                    15 сентября
                  </span>
                  <span className="task-assignee">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth="2"/>
                    </svg>
                    QA команда
                  </span>
                </div>
              </div>
            </li>
          </ul>
          
          <button className="add-task-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Добавить задачу
          </button>
        </aside>

        {/* Правая панель: Дашборд KPI и процессов */}
        <div className="process-dashboard">
          <div className="process-metrics">
            <div className="metric-card glass-card">
              <div className="metric-header">
                <div className="metric-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2"/>
                  </svg>
                </div>
                <h4>Автоматизация процессов</h4>
              </div>
              <div className="metric-main">
                <div className="metric-value">85%</div>
                <span className="metric-change positive">+5% за месяц</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '85%'}}>
                  <span className="progress-label">85%</span>
                </div>
              </div>
              <p className="metric-description">Процессов работают без участия человека</p>
            </div>
            <div className="metric-card glass-card">
              <div className="metric-header">
                <div className="metric-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v10l4 2M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth="2"/>
                  </svg>
                </div>
                <h4>Среднее время обработки</h4>
              </div>
              <div className="metric-main">
                <div className="metric-value">2ч 45м</div>
                <span className="metric-change positive">-15% быстрее</span>
              </div>
              <div className="time-breakdown">
                <div className="time-item">
                  <span className="time-label">Приём:</span>
                  <span className="time-value">15 мин</span>
                </div>
                <div className="time-item">
                  <span className="time-label">Обработка:</span>
                  <span className="time-value">2ч 30м</span>
                </div>
              </div>
              <p className="metric-description">От поступления до завершения</p>
            </div>
            <div className="metric-card glass-card">
              <div className="metric-header">
                <div className="metric-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h4>Успешные сделки</h4>
              </div>
              <div className="metric-main">
                <div className="metric-value">93%</div>
                <span className="metric-change positive">+3% рост</span>
              </div>
              <div className="success-stats">
                <div className="success-item">
                  <span className="success-count">247</span>
                  <span className="success-label">закрыто</span>
                </div>
                <div className="success-item">
                  <span className="success-count">18</span>
                  <span className="success-label">в работе</span>
                </div>
              </div>
              <p className="metric-description">Конверсия в закрытые сделки</p>
            </div>
          </div>

          <div className="process-graph glass-card">
            <div className="graph-header">
              <h4>Загрузка ресурсов по отделам</h4>
              <div className="graph-controls">
                <button className="control-btn active" data-view="chart">График</button>
                <button className="control-btn" data-view="table">Таблица</button>
                <button className="refresh-btn" aria-label="Обновить данные">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="chart-container">
              <canvas id="resourceChart"></canvas>
            </div>
            
            <div className="department-loads">
              <div className="department-item">
                <span className="department-name">Продажи</span>
                <div className="load-bar">
                  <div className="load-fill sales" style={{width: '78%'}}></div>
                  <span className="load-percent">78%</span>
                </div>
              </div>
              <div className="department-item">
                <span className="department-name">Маркетинг</span>
                <div className="load-bar">
                  <div className="load-fill marketing" style={{width: '92%'}}></div>
                  <span className="load-percent">92%</span>
                </div>
              </div>
              <div className="department-item">
                <span className="department-name">Поддержка</span>
                <div className="load-bar">
                  <div className="load-fill support" style={{width: '65%'}}></div>
                  <span className="load-percent">65%</span>
                </div>
              </div>
              <div className="department-item">
                <span className="department-name">Разработка</span>
                <div className="load-bar">
                  <div className="load-fill dev" style={{width: '88%'}}></div>
                  <span className="load-percent">88%</span>
                </div>
              </div>
              <div className="department-item">
                <span className="department-name">HR</span>
                <div className="load-bar">
                  <div className="load-fill hr" style={{width: '45%'}}></div>
                  <span className="load-percent">45%</span>
                </div>
              </div>
            </div>
            <div className="chart-placeholder">
              <canvas id="resourceLoadChart"></canvas>
            </div>
          </div>

          <div className="ai-insights glass-card">
            <div className="insights-header">
              <div className="insights-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>AI-рекомендации по оптимизации процессов</h4>
            </div>
            <div className="insights-list">
              <div className="insight-card">
                <div className="insight-priority high">
                  <span className="priority-dot"></span>
                  Критично
                </div>
                <div className="insight-content">
                  <h5>Перегрузка маркетинга</h5>
                  <p>Отдел работает на 92% мощности. Рекомендуем перераспределить задачи или нанять 2 специалистов.</p>
                  <div className="insight-actions">
                    <button className="action-btn primary">Создать вакансии</button>
                    <button className="action-btn secondary">Анализ задач</button>
                  </div>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-priority medium">
                  <span className="priority-dot"></span>
                  Важно
                </div>
                <div className="insight-content">
                  <h5>Резерв в поддержке</h5>
                  <p>Загрузка 65% позволяет взять дополнительные задачи. Можно расширить функционал отдела.</p>
                  <div className="insight-actions">
                    <button className="action-btn primary">Предложить задачи</button>
                    <button className="action-btn secondary">Оптимизировать</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Компоненты для управления процессами */}
      <Suspense fallback={null}>
        <ProcessManager />
        <ProcessTooltips />
      </Suspense>
    </section>,

    // 5. Решения - каталог услуг и пакетов
    <section key="solutions" id="solutions-section" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Решения для вашего бизнеса</h2>
        <p>Выберите готовое решение или создадим индивидуальное под ваши задачи</p>
      </div>

      <div className="solutions-container">
        {/* Фильтры по отраслям */}
        <div className="filter-section glass-card">
          <h3>Фильтр по отраслям</h3>
          <div className="industry-filters">
            <label className="filter-checkbox">
              <input type="checkbox" name="industry" value="all" defaultChecked />
              <span className="checkbox-label">Все отрасли</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" name="industry" value="retail" />
              <span className="checkbox-label">Ритейл</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" name="industry" value="finance" />
              <span className="checkbox-label">Финансы</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" name="industry" value="manufacturing" />
              <span className="checkbox-label">Производство</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" name="industry" value="logistics" />
              <span className="checkbox-label">Логистика</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" name="industry" value="healthcare" />
              <span className="checkbox-label">Здравоохранение</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" name="industry" value="it" />
              <span className="checkbox-label">IT</span>
            </label>
          </div>
        </div>

        {/* Каталог решений */}
        <div className="solutions-grid">
          {/* Автоматизация продаж */}
          <article className="solution-card glass-card" data-industry="retail finance">
            <div className="solution-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2"/>
              </svg>
            </div>
            <div className="solution-badge popular">Популярное</div>
            <h3>Автоматизация продаж</h3>
            <p className="solution-description">AI-модули для увеличения конверсии и оптимизации воронки продаж</p>
            
            <div className="solution-metrics">
              <div className="metric">
                <span className="metric-value">+45%</span>
                <span className="metric-label">Рост конверсии</span>
              </div>
              <div className="metric">
                <span className="metric-value">2-3 нед</span>
                <span className="metric-label">Внедрение</span>
              </div>
              <div className="metric">
                <span className="metric-value">ROI 320%</span>
                <span className="metric-label">За 6 мес</span>
              </div>
            </div>

            <div className="solution-tags">
              <span className="tag">AI</span>
              <span className="tag">CRM</span>
              <span className="tag">Analytics</span>
            </div>

            <button className="btn-details" aria-expanded="false">
              Подробнее
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <div className="solution-details" hidden>
              <h4>Что входит в решение:</h4>
              <ul>
                <li>AI-консультант для сайта 24/7</li>
                <li>Интеграция с CRM и мессенджерами</li>
                <li>Умная сегментация клиентов</li>
                <li>Предиктивная аналитика продаж</li>
                <li>A/B тестирование и оптимизация</li>
              </ul>
              <div className="clients-row">
                <span className="clients-label">Используют:</span>
                <div className="client-logos">
                  <span className="client-logo">🏪</span>
                  <span className="client-logo">🏦</span>
                  <span className="client-logo">🏭</span>
                </div>
              </div>
            </div>
          </article>

          {/* AI-маркетинг и сегментация */}
          <article className="solution-card glass-card" data-industry="retail it healthcare">
            <div className="solution-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2"/>
              </svg>
            </div>
            <h3>AI-маркетинг и сегментация</h3>
            <p className="solution-description">Персонализация коммуникаций и точечный таргетинг на основе ML</p>
            
            <div className="solution-metrics">
              <div className="metric">
                <span className="metric-value">+68%</span>
                <span className="metric-label">CTR email</span>
              </div>
              <div className="metric">
                <span className="metric-value">-40%</span>
                <span className="metric-label">CAC</span>
              </div>
              <div className="metric">
                <span className="metric-value">x3.2</span>
                <span className="metric-label">LTV</span>
              </div>
            </div>

            <div className="solution-tags">
              <span className="tag">ML</span>
              <span className="tag">BigData</span>
              <span className="tag">Personalization</span>
            </div>

            <button className="btn-details" aria-expanded="false">
              Подробнее
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </article>

          {/* Прогнозирование спроса */}
          <article className="solution-card glass-card" data-industry="retail manufacturing logistics">
            <div className="solution-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Прогнозирование спроса</h3>
            <p className="solution-description">Точное планирование закупок и оптимизация складских остатков</p>
            
            <div className="solution-metrics">
              <div className="metric">
                <span className="metric-value">-35%</span>
                <span className="metric-label">Излишки</span>
              </div>
              <div className="metric">
                <span className="metric-value">95%</span>
                <span className="metric-label">Точность</span>
              </div>
              <div className="metric">
                <span className="metric-value">-28%</span>
                <span className="metric-label">Затраты</span>
              </div>
            </div>

            <div className="solution-tags">
              <span className="tag">DeepLearning</span>
              <span className="tag">TimeSeries</span>
              <span className="tag">Supply Chain</span>
            </div>

            <button className="btn-details" aria-expanded="false">
              Подробнее
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </article>

          {/* Кредитный скоринг */}
          <article className="solution-card glass-card" data-industry="finance">
            <div className="solution-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2"/>
              </svg>
            </div>
            <div className="solution-badge new">Новое</div>
            <h3>Кредитный скоринг 2.0</h3>
            <p className="solution-description">AI-оценка платежеспособности с учетом 500+ параметров</p>
            
            <div className="solution-metrics">
              <div className="metric">
                <span className="metric-value">-60%</span>
                <span className="metric-label">Дефолты</span>
              </div>
              <div className="metric">
                <span className="metric-value">15 сек</span>
                <span className="metric-label">Решение</span>
              </div>
              <div className="metric">
                <span className="metric-value">+40%</span>
                <span className="metric-label">Одобрения</span>
              </div>
            </div>

            <div className="solution-tags">
              <span className="tag">AI</span>
              <span className="tag">RiskManagement</span>
              <span className="tag">FinTech</span>
            </div>

            <button className="btn-details" aria-expanded="false">
              Подробнее
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </article>

          {/* Мониторинг качества */}
          <article className="solution-card glass-card" data-industry="manufacturing">
            <div className="solution-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Мониторинг качества</h3>
            <p className="solution-description">Компьютерное зрение для контроля производства в реальном времени</p>
            
            <div className="solution-metrics">
              <div className="metric">
                <span className="metric-value">99.9%</span>
                <span className="metric-label">Точность</span>
              </div>
              <div className="metric">
                <span className="metric-value">-80%</span>
                <span className="metric-label">Брак</span>
              </div>
              <div className="metric">
                <span className="metric-value">24/7</span>
                <span className="metric-label">Контроль</span>
              </div>
            </div>

            <div className="solution-tags">
              <span className="tag">ComputerVision</span>
              <span className="tag">IoT</span>
              <span className="tag">RealTime</span>
            </div>

            <button className="btn-details" aria-expanded="false">
              Подробнее
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </article>

          {/* Персонализация UX */}
          <article className="solution-card glass-card" data-industry="retail it healthcare">
            <div className="solution-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Персонализация UX</h3>
            <p className="solution-description">Адаптивные интерфейсы под каждого пользователя на основе поведения</p>
            
            <div className="solution-metrics">
              <div className="metric">
                <span className="metric-value">+85%</span>
                <span className="metric-label">Retention</span>
              </div>
              <div className="metric">
                <span className="metric-value">+120%</span>
                <span className="metric-label">Engagement</span>
              </div>
              <div className="metric">
                <span className="metric-value">-50%</span>
                <span className="metric-label">Bounce Rate</span>
              </div>
            </div>

            <div className="solution-tags">
              <span className="tag">UX/UI</span>
              <span className="tag">A/B Testing</span>
              <span className="tag">Behavioral AI</span>
            </div>

            <button className="btn-details" aria-expanded="false">
              Подробнее
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </article>
        </div>

        {/* Пакетные предложения */}
        <section className="package-offers">
          <h3>Пакетные предложения</h3>
          <p className="package-subtitle">Комплексные решения с прозрачным ценообразованием</p>
          
          <div className="package-cards">
            <div className="package-card glass-card">
              <div className="package-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 15l-2 5v-5m2 0l2 5v-5m-2 0V9m-6 6v-5a2 2 0 012-2h8a2 2 0 012 2v5M12 9V3m0 0L9 6m3-3l3 3" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Старт</h4>
              <p className="package-description">Базовый набор для малого бизнеса</p>
              <div className="package-price">
                <span className="price-from">от</span>
                <span className="price-value">39 900</span>
                <span className="price-currency">₽/мес</span>
              </div>
              <ul className="package-features">
                <li>До 100 клиентов в CRM</li>
                <li>1 AI-консультант</li>
                <li>Базовая аналитика</li>
                <li>5 интеграций</li>
                <li>Поддержка 5/2</li>
              </ul>
              <button className="btn-select">Выбрать Старт</button>
            </div>

            <div className="package-card glass-card popular">
              <div className="package-badge">Рекомендуем</div>
              <div className="package-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Бизнес</h4>
              <p className="package-description">Расширенные возможности для роста</p>
              <div className="package-price">
                <span className="price-from">от</span>
                <span className="price-value">89 900</span>
                <span className="price-currency">₽/мес</span>
              </div>
              <ul className="package-features">
                <li>До 1000 клиентов в CRM</li>
                <li>3 AI-консультанта</li>
                <li>Продвинутая аналитика</li>
                <li>Неограниченные интеграции</li>
                <li>Поддержка 24/7</li>
                <li>Персональный менеджер</li>
              </ul>
              <button className="btn-select primary">Выбрать Бизнес</button>
            </div>

            <div className="package-card glass-card">
              <div className="package-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Энтерпрайз</h4>
              <p className="package-description">Полный контроль и кастомизация</p>
              <div className="package-price">
                <span className="price-from">от</span>
                <span className="price-value">199 900</span>
                <span className="price-currency">₽/мес</span>
              </div>
              <ul className="package-features">
                <li>Безлимит клиентов</li>
                <li>Безлимит AI-консультантов</li>
                <li>Кастомная разработка</li>
                <li>Выделенный сервер</li>
                <li>SLA 99.9%</li>
                <li>Команда разработки</li>
              </ul>
              <button className="btn-select">Обсудить Энтерпрайз</button>
            </div>
          </div>

          <div className="package-comparison">
            <button className="btn-compare">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2"/>
              </svg>
              Сравнить все возможности пакетов
            </button>
          </div>
        </section>

        {/* CTA секция */}
        <div className="solutions-cta glass-card">
          <div className="cta-content">
            <h3>Не нашли подходящее решение?</h3>
            <p>Создадим индивидуальное решение под ваши задачи. Расскажите о вашем проекте, и мы подготовим персональное предложение.</p>
            <div className="cta-buttons">
              <button className="btn-consult primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth="2"/>
                </svg>
                Получить консультацию
              </button>
              <button className="btn-calc">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2"/>
                </svg>
                Рассчитать стоимость
              </button>
            </div>
          </div>
          <div className="cta-illustration">
            <svg viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="url(#gradient)" strokeWidth="2" opacity="0.2"/>
              <circle cx="100" cy="100" r="60" stroke="url(#gradient)" strokeWidth="2" opacity="0.3"/>
              <circle cx="100" cy="100" r="40" stroke="url(#gradient)" strokeWidth="2" opacity="0.4"/>
              <circle cx="100" cy="100" r="20" fill="url(#gradient)" opacity="0.6"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#ec4899"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Компоненты для управления решениями */}
      <Suspense fallback={null}>
        <SolutionsManager />
        <SolutionsComparison />
      </Suspense>
    </section>
  ];

  return (
    <main className="premium-main">
      {/* Горизонтальный свайп контейнер */}
      <SwipeContainer 
        sections={sections}
        onSectionChange={handleSectionChange}
        initialSection={currentSection}
      >
        {sectionComponents}
      </SwipeContainer>
    </main>
  );
}