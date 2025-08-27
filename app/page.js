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