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

// Динамические импорты для личного кабинета
const WorkspaceLayout = dynamic(() => import('./components/workspace/WorkspaceLayoutFixed'), {
  ssr: false,
  loading: () => null
});

const SmartFloatingAIPremium = dynamic(() => import('./components/SmartFloatingAIPremium'), {
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

// Динамические импорты для страницы безопасности
const SecurityAccordion = dynamic(() => import('./components/SecurityAccordion'), {
  ssr: false,
  loading: () => null
});

const SecurityTooltips = dynamic(() => import('./components/SecurityTooltips'), {
  ssr: false,
  loading: () => null
});

const CertificatesModal = dynamic(() => import('./components/CertificatesModal'), {
  ssr: false,
  loading: () => null
});

// Динамические импорты для страницы "О нас"
const TeamModal = dynamic(() => import('./components/TeamModal'), {
  ssr: false,
  loading: () => null
});

const ValuesTooltips = dynamic(() => import('./components/ValuesTooltips'), {
  ssr: false,
  loading: () => null
});

const AboutAnimations = dynamic(() => import('./components/AboutAnimations'), {
  ssr: false,
  loading: () => null
});

// Динамические импорты для страницы калькулятора цен
const PricingCalculator = dynamic(() => import('./components/PricingCalculator'), {
  ssr: false,
  loading: () => null
});

const PricingComparison = dynamic(() => import('./components/PricingComparison'), {
  ssr: false,
  loading: () => null
});

const PricingTooltips = dynamic(() => import('./components/PricingTooltips'), {
  ssr: false,
  loading: () => null
});

// Динамические импорты для страницы контактов
const ContactFormHandler = dynamic(() => import('./components/ContactFormHandler'), {
  ssr: false,
  loading: () => null
});

const ContactValidation = dynamic(() => import('./components/ContactValidation'), {
  ssr: false,
  loading: () => null
});

const ContactMap = dynamic(() => import('./components/ContactMap'), {
  ssr: false,
  loading: () => null
});

// Динамические импорты для workspace компонентов
const WorkspaceManager = dynamic(() => import('./components/WorkspaceManager'), {
  ssr: false,
  loading: () => null
});

const WindowManager = dynamic(() => import('./components/WindowManager'), {
  ssr: false,
  loading: () => null
});

const WidgetSystem = dynamic(() => import('./components/WidgetSystem'), {
  ssr: false,
  loading: () => null
});

const RealtimeEngine = dynamic(() => import('./components/RealtimeEngine'), {
  ssr: false,
  loading: () => null
});

const AIPersonalization = dynamic(() => import('./components/AIPersonalization'), {
  ssr: false,
  loading: () => null
});

const GamificationHub = dynamic(() => import('./components/GamificationHub'), {
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
    'Процессы',
    'Решения',
    'Безопасность',
    'О нас',
    'Цены',
    'Контакты',
    'Кабинет'
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
          <button className="cta-button" onClick={() => {
            if (window.openAIAssistant) {
              window.openAIAssistant();
            } else {
              // Fallback - отправляем событие
              window.dispatchEvent(new CustomEvent('openAIChat'));
            }
          }}>
            <span>Начать бесплатно</span>
            <div className="particles">
              {[...Array(6)].map((_, i) => (
                <span 
                  key={i} 
                  className="particle" 
                  style={{
                    '--x': `${(Math.random() - 0.5) * 100}px`,
                    '--y': `${(Math.random() - 0.5) * 100}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </button>
        </div>
        <div className="swipe-hint">
          <span className="swipe-hint-desktop">
            Листайте, чтобы узнать больше 
            <span className="swipe-arrow"></span>
          </span>
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
    </section>,

    // 6. Безопасность - демонстрация надежности платформы
    <section key="security" id="security-section" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Безопасность превыше всего</h2>
        <p>Ваши данные под надежной защитой современных технологий</p>
      </div>

      <div className="security-container">
        {/* Уровень безопасности */}
        <div className="security-level glass-card">
          <div className="level-indicator">
            <svg viewBox="0 0 200 100" className="level-gauge">
              <path d="M 20 80 A 60 60 0 0 1 180 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15"/>
              <path d="M 20 80 A 60 60 0 0 1 180 80" fill="none" stroke="url(#securityGradient)" strokeWidth="15" strokeDasharray="251" strokeDashoffset="25" className="level-fill"/>
              <defs>
                <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="level-text">
              <span className="level-value">98%</span>
              <span className="level-label">Уровень защиты</span>
            </div>
          </div>
          <div className="level-details">
            <div className="detail-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/>
              </svg>
              <span>Защита 24/7</span>
            </div>
            <div className="detail-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2"/>
              </svg>
              <span>Шифрование AES-256</span>
            </div>
            <div className="detail-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
              </svg>
              <span>Сертифицировано</span>
            </div>
          </div>
        </div>

        {/* Технологии защиты */}
        <div className="security-technologies">
          <h3>Технологии защиты данных</h3>
          <div className="tech-grid">
            <article className="tech-card glass-card">
              <div className="tech-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Шифрование данных</h4>
              <p>End-to-end шифрование всех передаваемых данных с использованием AES-256 и RSA-4096</p>
              <button className="tech-details-btn" aria-expanded="false" data-section="encryption">
                Подробнее
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="tech-details" hidden>
                <ul>
                  <li>Шифрование в состоянии покоя (at rest)</li>
                  <li>Шифрование при передаче (in transit)</li>
                  <li>Управление ключами через HSM</li>
                  <li>Perfect Forward Secrecy</li>
                  <li>Квантово-устойчивые алгоритмы</li>
                </ul>
              </div>
            </article>

            <article className="tech-card glass-card">
              <div className="tech-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Многофакторная аутентификация</h4>
              <p>Защита аккаунтов с помощью 2FA/MFA, биометрии и аппаратных ключей</p>
              <button className="tech-details-btn" aria-expanded="false" data-section="auth">
                Подробнее
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="tech-details" hidden>
                <ul>
                  <li>SMS и Email коды</li>
                  <li>Google/Microsoft Authenticator</li>
                  <li>Поддержка FIDO2/WebAuthn</li>
                  <li>Биометрическая аутентификация</li>
                  <li>SSO через SAML 2.0</li>
                </ul>
              </div>
            </article>

            <article className="tech-card glass-card">
              <div className="tech-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>AI-мониторинг угроз</h4>
              <p>Машинное обучение для обнаружения аномалий и предотвращения атак в реальном времени</p>
              <button className="tech-details-btn" aria-expanded="false" data-section="monitoring">
                Подробнее
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="tech-details" hidden>
                <ul>
                  <li>Анализ поведения пользователей (UEBA)</li>
                  <li>Обнаружение DDoS атак</li>
                  <li>Защита от SQL-инъекций</li>
                  <li>Предотвращение утечек данных (DLP)</li>
                  <li>Threat Intelligence в реальном времени</li>
                </ul>
              </div>
            </article>

            <article className="tech-card glass-card">
              <div className="tech-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Резервное копирование</h4>
              <p>Автоматическое резервирование с географическим распределением и мгновенным восстановлением</p>
              <button className="tech-details-btn" aria-expanded="false" data-section="backup">
                Подробнее
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="tech-details" hidden>
                <ul>
                  <li>Ежедневные автоматические бэкапы</li>
                  <li>Географическая репликация (3+ региона)</li>
                  <li>Версионирование данных</li>
                  <li>RPO &lt; 1 час, RTO &lt; 4 часа</li>
                  <li>Тестирование восстановления</li>
                </ul>
              </div>
            </article>
          </div>
        </div>

        {/* Сертификаты и соответствие */}
        <div className="security-certificates">
          <h3>Сертификаты и стандарты</h3>
          <div className="certificates-grid">
            <div className="certificate-card glass-card">
              <div className="cert-logo">
                <img src="/api/placeholder/80/80" alt="ISO 27001" />
              </div>
              <h4>ISO 27001</h4>
              <p>Международный стандарт информационной безопасности</p>
              <button className="cert-view-btn" data-cert="iso27001">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/>
                </svg>
                Просмотр сертификата
              </button>
            </div>

            <div className="certificate-card glass-card">
              <div className="cert-logo">
                <img src="/api/placeholder/80/80" alt="GDPR" />
              </div>
              <h4>GDPR Compliant</h4>
              <p>Соответствие европейскому регламенту защиты данных</p>
              <button className="cert-view-btn" data-cert="gdpr">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/>
                </svg>
                Политика GDPR
              </button>
            </div>

            <div className="certificate-card glass-card">
              <div className="cert-logo">
                <img src="/api/placeholder/80/80" alt="SOC 2" />
              </div>
              <h4>SOC 2 Type II</h4>
              <p>Аудит безопасности, доступности и конфиденциальности</p>
              <button className="cert-view-btn" data-cert="soc2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeWidth="2"/>
                </svg>
                Отчет аудита
              </button>
            </div>

            <div className="certificate-card glass-card">
              <div className="cert-logo">
                <img src="/api/placeholder/80/80" alt="PCI DSS" />
              </div>
              <h4>PCI DSS Level 1</h4>
              <p>Стандарт безопасности для обработки платежных данных</p>
              <button className="cert-view-btn" data-cert="pcidss">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth="2"/>
                </svg>
                Сертификат PCI
              </button>
            </div>
          </div>
        </div>

        {/* Гарантии безопасности */}
        <div className="security-guarantees">
          <h3>Наши гарантии</h3>
          <div className="guarantees-grid">
            <div className="guarantee-card glass-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>SLA 99.9%</h4>
              <p>Гарантированное время доступности сервиса с финансовыми компенсациями</p>
              <a href="#" className="guarantee-link">Условия SLA →</a>
            </div>

            <div className="guarantee-card glass-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Прозрачность</h4>
              <p>Публичные отчеты об инцидентах и регулярные аудиты безопасности</p>
              <a href="#" className="guarantee-link">Отчеты безопасности →</a>
            </div>

            <div className="guarantee-card glass-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Поддержка 24/7</h4>
              <p>Круглосуточная служба безопасности для быстрого реагирования на инциденты</p>
              <a href="#" className="guarantee-link">Связаться с командой →</a>
            </div>

            <div className="guarantee-card glass-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Страхование данных</h4>
              <p>Полное страховое покрытие рисков кибербезопасности до $10 млн</p>
              <a href="#" className="guarantee-link">Условия страхования →</a>
            </div>
          </div>
        </div>

        {/* Политики и документы */}
        <div className="security-policies glass-card">
          <h3>Политики и документы</h3>
          <div className="policies-grid">
            <a href="#" className="policy-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/>
              </svg>
              <span>Политика конфиденциальности</span>
            </a>
            <a href="#" className="policy-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2"/>
              </svg>
              <span>Политика безопасности</span>
            </a>
            <a href="#" className="policy-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/>
              </svg>
              <span>График аудитов</span>
            </a>
            <a href="#" className="policy-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/>
              </svg>
              <span>Условия использования</span>
            </a>
          </div>
        </div>

        {/* CTA секция */}
        <div className="security-cta glass-card">
          <div className="cta-content">
            <h3>Есть вопросы о безопасности?</h3>
            <p>Наша команда безопасности готова ответить на любые вопросы и предоставить дополнительную информацию о защите ваших данных.</p>
            <div className="cta-buttons">
              <button className="btn-security-audit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2"/>
                </svg>
                Запросить аудит
              </button>
              <button className="btn-security-contact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/>
                </svg>
                security@neuroexpert.com
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Компоненты для управления безопасностью */}
      <Suspense fallback={null}>
        <SecurityAccordion />
        <SecurityTooltips />
        <CertificatesModal />
      </Suspense>
    </section>,

    // 7. О нас - презентация компании и команды
    <section key="about" id="about-section" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Кто мы такие</h2>
        <p>Команда экспертов, объединенная миссией трансформировать бизнес с помощью AI</p>
      </div>

      <div className="about-container">
        {/* Миссия и история */}
        <div className="mission-block glass-card">
          <div className="mission-content">
            <h3>Наша миссия</h3>
            <p className="mission-text">
              Мы делаем искусственный интеллект доступным для каждого бизнеса, превращая сложные технологии в простые и эффективные решения. 
              NeuroExpert — это не просто платформа, это ваш партнер в цифровой трансформации.
            </p>
            <div className="mission-stats">
              <div className="stat-item">
                <span className="stat-value">2019</span>
                <span className="stat-label">Год основания</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">500+</span>
                <span className="stat-label">Компаний-клиентов</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">98%</span>
                <span className="stat-label">Удовлетворенность</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Поддержка</span>
              </div>
            </div>
          </div>
          <div className="mission-visual">
            <div className="animated-brain">
              <svg viewBox="0 0 200 200" className="brain-svg">
                <defs>
                  <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
                <path d="M100 40 C60 40, 30 70, 30 110 C30 150, 60 180, 100 180 C140 180, 170 150, 170 110 C170 70, 140 40, 100 40" 
                      fill="none" stroke="url(#brainGradient)" strokeWidth="2" className="brain-outline"/>
                <circle cx="70" cy="80" r="15" fill="url(#brainGradient)" opacity="0.3" className="neuron"/>
                <circle cx="130" cy="80" r="15" fill="url(#brainGradient)" opacity="0.3" className="neuron"/>
                <circle cx="100" cy="110" r="20" fill="url(#brainGradient)" opacity="0.3" className="neuron"/>
                <circle cx="80" cy="140" r="12" fill="url(#brainGradient)" opacity="0.3" className="neuron"/>
                <circle cx="120" cy="140" r="12" fill="url(#brainGradient)" opacity="0.3" className="neuron"/>
                <path d="M70 80 L100 110 M130 80 L100 110 M100 110 L80 140 M100 110 L120 140" 
                      stroke="url(#brainGradient)" strokeWidth="1" opacity="0.5" className="connections"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Наши ценности */}
        <div className="values-section">
          <h3>Наши ценности</h3>
          <div className="values-grid">
            <article className="value-card glass-card" data-value="innovation">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Инновации</h4>
              <p>Используем передовые технологии AI и машинного обучения для создания решений будущего</p>
              <button className="value-learn-more" aria-label="Узнать больше об инновациях">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>

            <article className="value-card glass-card" data-value="transparency">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Прозрачность</h4>
              <p>Открыто рассказываем о наших процессах, технологиях и результатах работы</p>
              <button className="value-learn-more" aria-label="Узнать больше о прозрачности">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>

            <article className="value-card glass-card" data-value="responsibility">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Ответственность</h4>
              <p>Гарантируем безопасность данных и этичное использование искусственного интеллекта</p>
              <button className="value-learn-more" aria-label="Узнать больше об ответственности">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>

            <article className="value-card glass-card" data-value="partnership">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Партнерство</h4>
              <p>Строим долгосрочные отношения с клиентами, становимся частью их команды</p>
              <button className="value-learn-more" aria-label="Узнать больше о партнерстве">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>
          </div>
        </div>

        {/* Наша команда */}
        <div className="team-section">
          <h3>Наша команда</h3>
          <p className="team-subtitle">Эксперты, объединенные страстью к технологиям и желанием менять мир к лучшему</p>
          
          <div className="team-grid">
            <article className="team-member glass-card" data-member="ceo">
              <div className="member-avatar">
                <img src="/api/placeholder/120/120" alt="Александр Петров" />
                <div className="member-badge">CEO</div>
              </div>
              <h4>Александр Петров</h4>
              <p className="member-role">Основатель и CEO</p>
              <p className="member-bio">15+ лет в IT, эксперт в области AI и бизнес-стратегии</p>
              <div className="member-skills">
                <span className="skill-tag">AI Strategy</span>
                <span className="skill-tag">Business Development</span>
                <span className="skill-tag">Leadership</span>
              </div>
              <button className="member-details-btn" aria-label="Подробнее об Александре">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>

            <article className="team-member glass-card" data-member="cto">
              <div className="member-avatar">
                <img src="/api/placeholder/120/120" alt="Елена Иванова" />
                <div className="member-badge">CTO</div>
              </div>
              <h4>Елена Иванова</h4>
              <p className="member-role">Технический директор</p>
              <p className="member-bio">PhD в Machine Learning, автор 20+ научных публикаций</p>
              <div className="member-skills">
                <span className="skill-tag">Machine Learning</span>
                <span className="skill-tag">Neural Networks</span>
                <span className="skill-tag">Python</span>
              </div>
              <button className="member-details-btn" aria-label="Подробнее о Елене">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>

            <article className="team-member glass-card" data-member="head-ai">
              <div className="member-avatar">
                <img src="/api/placeholder/120/120" alt="Михаил Соколов" />
                <div className="member-badge">Head of AI</div>
              </div>
              <h4>Михаил Соколов</h4>
              <p className="member-role">Руководитель AI-департамента</p>
              <p className="member-bio">10+ лет разработки AI-решений для Fortune 500</p>
              <div className="member-skills">
                <span className="skill-tag">Deep Learning</span>
                <span className="skill-tag">NLP</span>
                <span className="skill-tag">Computer Vision</span>
              </div>
              <button className="member-details-btn" aria-label="Подробнее о Михаиле">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>

            <article className="team-member glass-card" data-member="head-ux">
              <div className="member-avatar">
                <img src="/api/placeholder/120/120" alt="Анна Морозова" />
                <div className="member-badge">Head of UX</div>
              </div>
              <h4>Анна Морозова</h4>
              <p className="member-role">Руководитель UX/UI</p>
              <p className="member-bio">Создала дизайн-системы для 50+ AI-продуктов</p>
              <div className="member-skills">
                <span className="skill-tag">UX Research</span>
                <span className="skill-tag">Design Systems</span>
                <span className="skill-tag">Figma</span>
              </div>
              <button className="member-details-btn" aria-label="Подробнее об Анне">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>

            <article className="team-member glass-card" data-member="head-data">
              <div className="member-avatar">
                <img src="/api/placeholder/120/120" alt="Дмитрий Волков" />
                <div className="member-badge">Head of Data</div>
              </div>
              <h4>Дмитрий Волков</h4>
              <p className="member-role">Руководитель Data Science</p>
              <p className="member-bio">Эксперт в Big Data и предиктивной аналитике</p>
              <div className="member-skills">
                <span className="skill-tag">Big Data</span>
                <span className="skill-tag">Analytics</span>
                <span className="skill-tag">SQL/NoSQL</span>
              </div>
              <button className="member-details-btn" aria-label="Подробнее о Дмитрии">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>

            <article className="team-member glass-card" data-member="head-security">
              <div className="member-avatar">
                <img src="/api/placeholder/120/120" alt="Ольга Белова" />
                <div className="member-badge">CISO</div>
              </div>
              <h4>Ольга Белова</h4>
              <p className="member-role">Директор по безопасности</p>
              <p className="member-bio">Certified Ethical Hacker, 12+ лет в кибербезопасности</p>
              <div className="member-skills">
                <span className="skill-tag">Cybersecurity</span>
                <span className="skill-tag">Compliance</span>
                <span className="skill-tag">Risk Management</span>
              </div>
              <button className="member-details-btn" aria-label="Подробнее об Ольге">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </button>
            </article>
          </div>

          <div className="team-cta">
            <p>Хотите присоединиться к нашей команде?</p>
            <a href="#careers" className="btn-careers">
              Открытые вакансии
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Достижения и награды */}
        <div className="achievements-section">
          <h3>Наши достижения</h3>
          <div className="achievements-grid">
            <div className="achievement-card glass-card">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>AI Excellence Award 2023</h4>
              <p>Лучшая платформа для бизнес-аналитики</p>
            </div>

            <div className="achievement-card glass-card">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>500+ клиентов</h4>
              <p>Доверяют нам цифровую трансформацию</p>
            </div>

            <div className="achievement-card glass-card">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>ISO сертификация</h4>
              <p>Международные стандарты качества</p>
            </div>

            <div className="achievement-card glass-card">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>10M+ обработано запросов</h4>
              <p>Ежедневно через нашу платформу</p>
            </div>

            <div className="achievement-card glass-card">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>30+ стран</h4>
              <p>География наших клиентов</p>
            </div>

            <div className="achievement-card glass-card">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                </svg>
              </div>
              <h4>NPS 72</h4>
              <p>Высокий уровень лояльности клиентов</p>
            </div>
          </div>
        </div>

        {/* Партнеры и клиенты */}
        <div className="partners-section">
          <h3>Нам доверяют</h3>
          <div className="partners-carousel glass-card">
            <div className="partners-track">
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 1" />
              </div>
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 2" />
              </div>
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 3" />
              </div>
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 4" />
              </div>
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 5" />
              </div>
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 6" />
              </div>
              {/* Дублируем для бесшовной анимации */}
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 1" />
              </div>
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 2" />
              </div>
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 3" />
              </div>
              <div className="partner-logo">
                <img src="/api/placeholder/150/60" alt="Partner 4" />
              </div>
            </div>
          </div>

          <div className="testimonials-grid">
            <article className="testimonial-card glass-card">
              <div className="testimonial-quote">
                <svg viewBox="0 0 24 24" fill="currentColor" className="quote-icon">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p>"NeuroExpert помог нам увеличить конверсию на 45% за 3 месяца. Это лучшее решение для data-driven маркетинга."</p>
                <div className="testimonial-author">
                  <strong>Иван Кузнецов</strong>
                  <span>CEO, TechStart</span>
                </div>
              </div>
            </article>

            <article className="testimonial-card glass-card">
              <div className="testimonial-quote">
                <svg viewBox="0 0 24 24" fill="currentColor" className="quote-icon">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p>"AI-рекомендации платформы сэкономили нам миллионы рублей на оптимизации процессов. Невероятный ROI!"</p>
                <div className="testimonial-author">
                  <strong>Мария Федорова</strong>
                  <span>CDO, RetailPro</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* CTA секция */}
        <div className="about-cta glass-card">
          <h3>Готовы начать трансформацию?</h3>
          <p>Присоединяйтесь к сотням компаний, которые уже используют силу AI для роста бизнеса</p>
          <div className="cta-buttons">
            <button className="btn-demo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2"/>
              </svg>
              Запланировать демо
            </button>
            <button className="btn-partnership">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2"/>
              </svg>
              Стать партнером
            </button>
          </div>
        </div>
      </div>
      
      {/* Компоненты для управления страницей О нас */}
      <Suspense fallback={null}>
        <TeamModal />
        <ValuesTooltips />
        <AboutAnimations />
      </Suspense>
    </section>,

    // 8. Калькулятор цен - интерактивный расчет стоимости
    <section key="pricing" id="pricing-section" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Выберите свой пакет</h2>
        <p>Прозрачные цены и гибкие тарифы для любого бизнеса</p>
      </div>

      <div className="pricing-container">
        {/* Основные тарифные планы */}
        <div className="pricing-plans">
          <article className="pricing-plan glass-card" data-plan="start">
            <div className="plan-badge">Для старта</div>
            <h3 className="plan-title">Старт</h3>
            <div className="plan-price">
              <span className="price-from">от</span>
              <span className="price-value">39 900</span>
              <span className="price-currency">₽</span>
              <span className="price-period">/месяц</span>
            </div>
            <p className="plan-description">Аудит, базовый сайт, CRM, поддержка</p>
            
            <ul className="plan-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Глубокий аудит бизнеса
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Базовый сайт или лендинг
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                CRM-система на 100 клиентов
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Интеграция с мессенджерами
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Базовая автоматизация продаж
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Обучение команды
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Поддержка 5 дней в неделю
              </li>
            </ul>
            
            <button className="plan-select-btn" data-plan="start">
              Выбрать Старт
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </article>

          <article className="pricing-plan glass-card popular" data-plan="business">
            <div className="plan-badge popular-badge">Популярный выбор</div>
            <h3 className="plan-title">Бизнес</h3>
            <div className="plan-price">
              <span className="price-from">от</span>
              <span className="price-value">89 900</span>
              <span className="price-currency">₽</span>
              <span className="price-period">/месяц</span>
            </div>
            <p className="plan-description">Всё из Старт + интернет-магазин, приложение, расширенная CRM</p>
            
            <ul className="plan-features">
              <li className="feature-highlight">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Всё из тарифа Старт
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Интернет-магазин или корпоративный сайт
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Мобильное приложение (iOS/Android)
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                CRM на 1000+ клиентов
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                AI-аналитика и прогнозирование
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Омниканальность (10+ каналов)
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Приоритетная поддержка 24/7
              </li>
            </ul>
            
            <button className="plan-select-btn popular-btn" data-plan="business">
              Выбрать Бизнес
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </article>

          <article className="pricing-plan glass-card" data-plan="enterprise">
            <div className="plan-badge">Для корпораций</div>
            <h3 className="plan-title">Enterprise</h3>
            <div className="plan-price">
              <span className="price-from">от</span>
              <span className="price-value">199 900</span>
              <span className="price-currency">₽</span>
              <span className="price-period">/месяц</span>
            </div>
            <p className="plan-description">Безлимит, SaaS, выделенный сервер</p>
            
            <ul className="plan-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Безлимитные возможности
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Собственная SaaS платформа
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Выделенный сервер и инфраструктура
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Кастомная разработка под ваши задачи
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Интеграция с любыми системами
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Персональная команда разработки
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                SLA 99.9% и гарантии
              </li>
            </ul>
            
            <button className="plan-select-btn" data-plan="enterprise">
              Выбрать Enterprise
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </article>
        </div>

        {/* Интерактивный калькулятор */}
        <div className="pricing-calculator glass-card">
          <h3>Калькулятор стоимости</h3>
          <p className="calculator-subtitle">Настройте параметры под ваши потребности</p>
          
          <form className="calculator-form">
            {/* Выбор базового тарифа */}
            <div className="form-group">
              <label htmlFor="base-plan">Базовый тариф</label>
              <div className="plan-selector">
                <input type="radio" name="base-plan" id="plan-start" value="39900" defaultChecked />
                <label htmlFor="plan-start" className="plan-option">
                  <span className="plan-name">Старт</span>
                  <span className="plan-price">39 900₽</span>
                </label>
                
                <input type="radio" name="base-plan" id="plan-business" value="89900" />
                <label htmlFor="plan-business" className="plan-option">
                  <span className="plan-name">Бизнес</span>
                  <span className="plan-price">89 900₽</span>
                </label>
                
                <input type="radio" name="base-plan" id="plan-enterprise" value="199900" />
                <label htmlFor="plan-enterprise" className="plan-option">
                  <span className="plan-name">Enterprise</span>
                  <span className="plan-price">199 900₽</span>
                </label>
              </div>
            </div>

            {/* Количество пользователей */}
            <div className="form-group">
              <label htmlFor="users-slider">
                Количество пользователей
                <span className="value-display" id="users-value">10</span>
              </label>
              <input 
                type="range" 
                id="users-slider" 
                name="users" 
                min="1" 
                max="1000" 
                value="10" 
                className="custom-slider"
                data-tooltip="Количество сотрудников, которые будут использовать платформу"
              />
              <div className="slider-labels">
                <span>1</span>
                <span>500</span>
                <span>1000+</span>
              </div>
            </div>

            {/* Объем данных */}
            <div className="form-group">
              <label htmlFor="data-slider">
                Объем данных (ГБ)
                <span className="value-display" id="data-value">100</span>
              </label>
              <input 
                type="range" 
                id="data-slider" 
                name="data" 
                min="10" 
                max="10000" 
                value="100" 
                className="custom-slider"
                data-tooltip="Объем хранилища для ваших данных и файлов"
              />
              <div className="slider-labels">
                <span>10 ГБ</span>
                <span>5 ТБ</span>
                <span>10 ТБ</span>
              </div>
            </div>

            {/* Количество интеграций */}
            <div className="form-group">
              <label htmlFor="integrations-slider">
                Количество интеграций
                <span className="value-display" id="integrations-value">5</span>
              </label>
              <input 
                type="range" 
                id="integrations-slider" 
                name="integrations" 
                min="0" 
                max="50" 
                value="5" 
                className="custom-slider"
                data-tooltip="Подключение внешних сервисов и API"
              />
              <div className="slider-labels">
                <span>0</span>
                <span>25</span>
                <span>50+</span>
              </div>
            </div>

            {/* Период использования */}
            <div className="form-group">
              <label>Период оплаты</label>
              <div className="period-selector">
                <input type="radio" name="period" id="period-month" value="1" defaultChecked />
                <label htmlFor="period-month" className="period-option">
                  <span className="period-name">Месяц</span>
                  <span className="period-discount">0%</span>
                </label>
                
                <input type="radio" name="period" id="period-quarter" value="3" />
                <label htmlFor="period-quarter" className="period-option">
                  <span className="period-name">Квартал</span>
                  <span className="period-discount">-5%</span>
                </label>
                
                <input type="radio" name="period" id="period-year" value="12" />
                <label htmlFor="period-year" className="period-option">
                  <span className="period-name">Год</span>
                  <span className="period-discount">-15%</span>
                </label>
              </div>
            </div>

            {/* Дополнительные опции */}
            <div className="form-group">
              <label>Дополнительные опции</label>
              <div className="options-grid">
                <label className="option-checkbox">
                  <input type="checkbox" name="option-support" value="10000" />
                  <span className="option-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                      <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/>
                    </svg>
                    <span className="option-name">Расширенная поддержка 24/7</span>
                    <span className="option-price">+10 000₽/мес</span>
                  </span>
                </label>

                <label className="option-checkbox">
                  <input type="checkbox" name="option-api" value="15000" />
                  <span className="option-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="option-name">Расширенный API</span>
                    <span className="option-price">+15 000₽/мес</span>
                  </span>
                </label>

                <label className="option-checkbox">
                  <input type="checkbox" name="option-custom" value="25000" />
                  <span className="option-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                      <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth="2"/>
                    </svg>
                    <span className="option-name">Кастомные интеграции</span>
                    <span className="option-price">+25 000₽/мес</span>
                  </span>
                </label>

                <label className="option-checkbox">
                  <input type="checkbox" name="option-training" value="30000" />
                  <span className="option-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2"/>
                    </svg>
                    <span className="option-name">Обучение команды</span>
                    <span className="option-price">+30 000₽ разово</span>
                  </span>
                </label>
              </div>
            </div>
          </form>

          {/* Итоговый расчет */}
          <div className="calculator-result">
            <div className="result-breakdown">
              <div className="breakdown-item">
                <span>Базовый тариф:</span>
                <span id="base-cost">39 900₽</span>
              </div>
              <div className="breakdown-item">
                <span>Дополнительные опции:</span>
                <span id="options-cost">0₽</span>
              </div>
              <div className="breakdown-item discount-item">
                <span>Скидка за период:</span>
                <span id="discount-amount">0₽</span>
              </div>
            </div>
            
            <div className="total-price">
              <span className="total-label">Итого в месяц:</span>
              <span className="total-value" id="total-cost">39 900₽</span>
            </div>
            
            <div className="calculator-actions">
              <button className="btn-get-offer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeWidth="2"/>
                </svg>
                Получить индивидуальное предложение
              </button>
              <button className="btn-contact-sales">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2"/>
                </svg>
                Связаться с отделом продаж
              </button>
            </div>
          </div>
        </div>

        {/* Сравнение тарифов */}
        <div className="pricing-comparison glass-card">
          <h3>Сравнение тарифов</h3>
          <button className="btn-compare-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2"/>
            </svg>
            Подробное сравнение всех возможностей
          </button>
          
          <div className="quick-comparison">
            <div className="comparison-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
              </svg>
              <div>
                <strong>Экономия до 40%</strong>
                <p>По сравнению с классическими CRM системами</p>
              </div>
            </div>
            
            <div className="comparison-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2"/>
              </svg>
              <div>
                <strong>В 3 раза больше функций</strong>
                <p>AI-автоматизация включена во все тарифы</p>
              </div>
            </div>
            
            <div className="comparison-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
              </svg>
              <div>
                <strong>Поддержка 24/7</strong>
                <p>Включена в тарифы Бизнес и Enterprise</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ секция */}
        <div className="pricing-faq">
          <h3>Часто задаваемые вопросы</h3>
          <div className="faq-grid">
            <details className="faq-item glass-card">
              <summary>
                <span>Можно ли изменить тариф в любое время?</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </summary>
              <p>Да, вы можете повысить или понизить тариф в любой момент. При повышении тарифа новые возможности станут доступны сразу, при понижении — с начала следующего расчетного периода.</p>
            </details>

            <details className="faq-item glass-card">
              <summary>
                <span>Есть ли бесплатный пробный период?</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </summary>
              <p>Мы предоставляем 14 дней бесплатного доступа к тарифу Бизнес. Это позволит вам оценить все возможности платформы без рисков.</p>
            </details>

            <details className="faq-item glass-card">
              <summary>
                <span>Что входит в поддержку?</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </summary>
              <p>Техническая поддержка включает: консультации по работе с платформой, помощь в настройке, решение технических проблем, обновления и улучшения системы.</p>
            </details>

            <details className="faq-item glass-card">
              <summary>
                <span>Как происходит оплата?</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </summary>
              <p>Оплата производится банковским переводом на основании выставленного счета. Мы также принимаем карты и электронные платежи. Для Enterprise доступна постоплата.</p>
            </details>
          </div>
        </div>
      </div>
      
      {/* Компоненты для управления калькулятором */}
      <Suspense fallback={null}>
        <PricingCalculator />
        <PricingComparison />
        <PricingTooltips />
      </Suspense>
    </section>,

    // 9. Контакты - форма обратной связи и контактная информация
    <section key="contacts" id="contacts-section" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Свяжитесь с нами</h2>
        <p>Мы готовы ответить на все ваши вопросы и помочь с внедрением</p>
      </div>

      <div className="contacts-container">
        {/* Левая часть - форма */}
        <div className="contact-form-wrapper glass-card">
          <h3>Оставьте заявку</h3>
          <p className="form-subtitle">Мы свяжемся с вами в течение 15 минут</p>
          
          <form className="contact-form" id="mainContactForm">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Ваше имя *</label>
                <input 
                  type="text" 
                  id="contact-name" 
                  name="name" 
                  required 
                  placeholder="Иван Иванов"
                  aria-label="Ваше имя"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contact-company">Компания</label>
                <input 
                  type="text" 
                  id="contact-company" 
                  name="company" 
                  placeholder="ООО Название"
                  aria-label="Название компании"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-email">Email *</label>
                <input 
                  type="email" 
                  id="contact-email" 
                  name="email" 
                  required 
                  placeholder="your@email.com"
                  aria-label="Email адрес"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contact-phone">Телефон *</label>
                <input 
                  type="tel" 
                  id="contact-phone" 
                  name="phone" 
                  required 
                  placeholder="+7 (999) 123-45-67"
                  aria-label="Номер телефона"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-topic">Тема обращения</label>
              <select id="contact-topic" name="topic" aria-label="Выберите тему обращения">
                <option value="">Выберите тему</option>
                <option value="demo">Демонстрация платформы</option>
                <option value="pricing">Вопросы по тарифам</option>
                <option value="integration">Интеграция и внедрение</option>
                <option value="support">Техническая поддержка</option>
                <option value="partnership">Партнерство</option>
                <option value="other">Другое</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Интересующие решения</label>
              <div className="solutions-checkboxes">
                <label className="checkbox-label">
                  <input type="checkbox" name="solutions" value="crm" />
                  <span className="checkbox-box"></span>
                  <span>CRM-система</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="solutions" value="analytics" />
                  <span className="checkbox-box"></span>
                  <span>AI-аналитика</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="solutions" value="automation" />
                  <span className="checkbox-box"></span>
                  <span>Автоматизация</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="solutions" value="integration" />
                  <span className="checkbox-box"></span>
                  <span>Интеграции</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-message">Сообщение</label>
              <textarea 
                id="contact-message" 
                name="message" 
                rows="4" 
                placeholder="Расскажите о вашей задаче или задайте вопрос"
                aria-label="Ваше сообщение"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="privacy-checkbox">
                <input type="checkbox" name="privacy" required />
                <span className="checkbox-box"></span>
                <span>Согласен с <a href="#" className="privacy-link">политикой конфиденциальности</a> *</span>
              </label>
            </div>
            
            <button type="submit" className="btn-submit-form">
              <span>Отправить заявку</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
        
        {/* Правая часть - контактная информация */}
        <div className="contact-info-wrapper">
          {/* Быстрые контакты */}
          <div className="quick-contacts glass-card">
            <h3>Быстрая связь</h3>
            
            <div className="contact-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/>
                </svg>
              </div>
              <div className="contact-details">
                <span className="contact-label">Email</span>
                <a href="mailto:hello@neuroexpert.ru" className="contact-value">hello@neuroexpert.ru</a>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2"/>
                </svg>
              </div>
              <div className="contact-details">
                <span className="contact-label">Телефон</span>
                <a href="tel:+74951234567" className="contact-value">+7 (495) 123-45-67</a>
                <span className="contact-note">Пн-Пт с 9:00 до 18:00 МСК</span>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/>
                </svg>
              </div>
              <div className="contact-details">
                <span className="contact-label">Офис</span>
                <span className="contact-value">Москва, ул. Тверская, 1</span>
                <a href="#map" className="contact-link">Показать на карте ↓</a>
              </div>
            </div>
          </div>
          
          {/* Мессенджеры */}
          <div className="messengers glass-card">
            <h3>Мессенджеры и соцсети</h3>
            <div className="messenger-buttons">
              <a href="#" className="messenger-btn telegram" aria-label="Telegram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56c-.21 2.27-1.13 7.75-1.6 10.27-.2 1.07-.59 1.43-.96 1.47-.82.08-1.44-.54-2.24-.92-1.24-.73-1.94-1.19-3.14-1.9-1.39-.83-.49-1.28.3-2.03.21-.2 3.82-3.5 3.89-3.8.01-.04.01-.18-.07-.25s-.2-.05-.29-.03c-.12.03-2.09 1.33-5.91 3.9-.56.38-1.07.57-1.52.56-.5-.01-1.47-.28-2.19-.52-.88-.29-1.58-.44-1.52-.93.03-.26.38-.52 1.06-.8 4.16-1.81 6.93-3.01 8.32-3.59 3.96-1.66 4.79-1.95 5.32-1.96.12 0 .38.03.55.18.15.13.19.3.21.44-.01.06.01.24 0 .38z"/>
                </svg>
                <span>Telegram</span>
              </a>
              
              <a href="#" className="messenger-btn whatsapp" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
              
              <a href="#" className="messenger-btn vk" aria-label="VKontakte">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.033-1.49-1.173-1.743-1.173-.357 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.335-3.202C4.624 10.857 4 8.777 4 8.425c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.895c0 .373.17.508.271.508.22 0 .407-.135.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
                </svg>
                <span>VKontakte</span>
              </a>
              
              <a href="#" className="messenger-btn linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Время работы */}
          <div className="work-hours glass-card">
            <h3>Время работы</h3>
            <div className="schedule">
              <div className="schedule-row">
                <span className="day">Понедельник - Пятница</span>
                <span className="time">9:00 - 18:00 МСК</span>
              </div>
              <div className="schedule-row">
                <span className="day">Суббота</span>
                <span className="time">10:00 - 16:00 МСК</span>
              </div>
              <div className="schedule-row weekend">
                <span className="day">Воскресенье</span>
                <span className="time">Выходной</span>
              </div>
            </div>
            <div className="support-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
              </svg>
              <span>Техподдержка работает 24/7 для клиентов тарифа Бизнес и Enterprise</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Карта */}
      <div className="map-section" id="map">
        <div className="map-container glass-card">
          <div className="map-placeholder">
            {/* Здесь будет интегрирована карта */}
            <div className="map-overlay">
              <h3>Наш офис в Москве</h3>
              <p>ул. Тверская, 1</p>
              <button className="btn-build-route">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2"/>
                </svg>
                Построить маршрут
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ по контактам */}
      <div className="contact-faq">
        <h3>Часто задаваемые вопросы</h3>
        <div className="faq-items">
          <details className="faq-item glass-card">
            <summary>
              <span>Как быстро вы отвечаете на заявки?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>В рабочее время мы отвечаем в течение 15-30 минут. Заявки, отправленные в нерабочее время, обрабатываются на следующий рабочий день.</p>
          </details>
          
          <details className="faq-item glass-card">
            <summary>
              <span>Можно ли приехать к вам в офис?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>Да, мы всегда рады видеть вас в нашем офисе. Рекомендуем заранее согласовать время встречи через форму или по телефону.</p>
          </details>
          
          <details className="faq-item glass-card">
            <summary>
              <span>Проводите ли вы онлайн-демонстрации?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>Конечно! Мы проводим персональные демонстрации через Zoom, Google Meet или любую удобную для вас платформу.</p>
          </details>
        </div>
      </div>
      
      {/* Компоненты для управления страницей контактов */}
      <Suspense fallback={null}>
        <ContactFormHandler />
        <ContactValidation />
        <ContactMap />
      </Suspense>
    </section>,

    // 10. Личный кабинет - полнофункциональная версия согласно ТЗ
    <section key="workspace" id="workspace-section" className="workspace-container">
      <Suspense fallback={
        <div className="workspace-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка рабочего пространства...</p>
        </div>
      }>
        <WorkspaceLayout />
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
      
      {/* AI Управляющий с неоновым дизайном */}
      <SmartFloatingAIPremium />
    </main>
  );
}