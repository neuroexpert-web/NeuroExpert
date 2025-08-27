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
        <p>Показатели KPI и AI-рекомендации</p>
      </header>
        {/* KPI карточки */}
        <div className="kpi-cards">
          <div className="kpi-card glass-card" id="kpi-revenue">
            <div className="kpi-header">
              <span className="kpi-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="kpi-title">Выручка</span>
            </div>
            <div className="kpi-value">₽ 7 128,4K</div>
            <div className="kpi-trend positive">
              <span className="trend-icon">↑</span>
              <span>+5.2% vs. прошлый месяц</span>
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
            </div>
            <div className="kpi-value">162</div>
            <div className="kpi-trend positive">
              <span className="trend-icon">↑</span>
              <span>+12% за месяц</span>
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
            </div>
            <div className="kpi-value">4.85/5</div>
            <div className="kpi-trend negative">
              <span className="trend-icon">↓</span>
              <span>-0.15 пунктов</span>
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
            </div>
            <div className="kpi-value">3.13%</div>
            <div className="kpi-trend positive">
              <span className="trend-icon">↑</span>
              <span>+0.5% рост</span>
            </div>
            <div className="kpi-sparkline" id="conversion-sparkline"></div>
          </div>
        </div>
        
        {/* Контейнер для графиков */}
        <div className="charts-container">
          <div className="chart-card glass-card" id="chart-revenue">
            <h3>Динамика выручки (30 дней)</h3>
            <div className="chart-wrapper">
              <canvas id="revenueChart"></canvas>
            </div>
          </div>
          
          <div className="chart-card glass-card" id="chart-traffic">
            <h3>Источники трафика</h3>
            <div className="chart-wrapper">
              <canvas id="trafficChart"></canvas>
            </div>
          </div>
          
          <div className="chart-card glass-card" id="chart-funnel">
            <h3>Воронка продаж</h3>
            <div className="chart-wrapper">
              <canvas id="funnelChart"></canvas>
            </div>
          </div>
        </div>

        {/* AI рекомендации */}
        <section className="ai-recommendations">
          <h3>AI-рекомендации для роста бизнеса</h3>
          <div className="recommendations-grid">
            <div className="recommendation-card glass-card">
              <div className="rec-header">
                <div className="rec-icon idea">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="rec-priority high">Высокий приоритет</div>
              </div>
              <h4>Оптимизируйте мобильную версию</h4>
              <p>72% новых пользователей приходят с мобильных устройств. Улучшение UX на смартфонах может повысить конверсию на 15%.</p>
              <div className="rec-actions">
                <button className="rec-action-button primary">Начать оптимизацию</button>
                <button className="rec-action-button secondary">Подробнее</button>
              </div>
            </div>
            
            <div className="recommendation-card glass-card">
              <div className="rec-header">
                <div className="rec-icon warning">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="rec-priority medium">Средний приоритет</div>
              </div>
              <h4>Риск оттока клиентов</h4>
              <p>Сегмент "Малый бизнес" показывает снижение активности на 25%. Рекомендуется запустить для них email-кампанию.</p>
              <div className="rec-actions">
                <button className="rec-action-button primary">Создать кампанию</button>
                <button className="rec-action-button secondary">Анализ сегмента</button>
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
      </Suspense>
    </section>,

    // 3. Аудитория
    <section key="audience" id="page-audience" className="full-page">
      <div className="page-header">
        <h2>Портрет вашей аудитории</h2>
        <p>Изучайте, сегментируйте и взаимодействуйте с вашими клиентами</p>
      </div>

      <div className="audience-container">
        {/* Левая панель: Выбор сегмента */}
        <div className="segment-selector-panel">
          <h4>Сегменты клиентов</h4>
          <ul>
            <li 
              className={`segment-item ${activeSegment === 'loyal' ? 'active' : ''}`}
              onClick={() => handleSegmentChange('loyal')}
            >
              <span className="segment-icon loyal-icon"></span>
              <span>Лояльные клиенты</span>
            </li>
            <li 
              className={`segment-item ${activeSegment === 'new' ? 'active' : ''}`}
              onClick={() => handleSegmentChange('new')}
            >
              <span className="segment-icon new-icon"></span>
              <span>Новые пользователи</span>
            </li>
            <li 
              className={`segment-item ${activeSegment === 'vip' ? 'active' : ''}`}
              onClick={() => handleSegmentChange('vip')}
            >
              <span className="segment-icon vip-icon"></span>
              <span>VIP-сегмент</span>
            </li>
            <li 
              className={`segment-item ${activeSegment === 'churn-risk' ? 'active' : ''}`}
              onClick={() => handleSegmentChange('churn-risk')}
            >
              <span className="segment-icon churn-icon"></span>
              <span>На грани оттока</span>
            </li>
            <li className="segment-item add-new">
              <span className="segment-icon add-icon"></span>
              <span>Создать свой сегмент</span>
            </li>
          </ul>
        </div>

        {/* Правая панель: Детали сегмента */}
        <div className="segment-details-panel">
          {/* Контент для "Лояльные клиенты" */}
          <div className={`segment-content ${activeSegment === 'loyal' ? 'active' : ''}`}>
            <div className="segment-header">
              <h3>Лояльные клиенты</h3>
              <p>3,450 пользователей (28% от всей базы)</p>
            </div>
            <div className="details-grid">
              <div className="detail-card demographics-card">
                <h4>Демография</h4>
                <div className="chart-placeholder small">
                  <canvas id="loyalDemographicsChart"></canvas>
                </div>
              </div>
              <div className="detail-card behavior-card">
                <h4>Поведение</h4>
                <div className="behavior-metric">
                  <span>Средний чек</span>
                  <strong>₽ 4,800</strong>
                </div>
                <div className="behavior-metric">
                  <span>Частота покупок</span>
                  <strong>3.5 раз/мес</strong>
                </div>
              </div>
              <div className="detail-card ltv-card">
                <h4>Lifetime Value (LTV)</h4>
                <span className="ltv-value">₽ 45,900</span>
                <p>На 120% выше среднего</p>
              </div>
            </div>
            <div className="ai-recommendation-for-segment">
              <div className="rec-icon idea-icon"></div>
              <p><strong>AI-совет:</strong> Удерживайте этот сегмент с помощью эксклюзивных предложений. Они наиболее чувствительны к программам лояльности.</p>
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
    </section>,

    // 4. Процессы
    <section key="processes" id="page-processes" className="full-page">
      <div className="page-header">
        <h2>Управление бизнес-процессами</h2>
        <p>Оптимизируйте и автоматизируйте работу с AI-аналитикой</p>
      </div>

      <div className="processes-container">
        {/* Блок 1: Приоритетные задачи и оповещения */}
        <aside className="task-priorities">
          <h3>Приоритетные задачи</h3>
          <ul>
            <li>
              <span className="priority-icon high"></span>
              <strong>Обновить CRM</strong> — интеграция с новым AI-модулем
              <small>Срок: 30 Августа</small>
            </li>
            <li>
              <span className="priority-icon medium"></span>
              <strong>Анализ клиентской базы</strong> — подготовка сегментов VIP
              <small>Срок: 5 Сентября</small>
            </li>
            <li>
              <span className="priority-icon low"></span>
              <strong>Тестирование новых сценариев AI-бота</strong>
              <small>Срок: 15 Сентября</small>
            </li>
            <li>
              <span className="priority-icon high"></span>
              <strong>Миграция данных</strong> — перенос на новую платформу
              <small>Срок: 28 Августа</small>
            </li>
            <li>
              <span className="priority-icon medium"></span>
              <strong>Оптимизация воронки продаж</strong> — A/B тестирование
              <small>Срок: 10 Сентября</small>
            </li>
          </ul>
        </aside>

        {/* Блок 2: Дашборд KPI и процессов */}
        <div className="process-dashboard">
          <div className="process-metrics">
            <div className="metric-card">
              <h4>Автоматизация</h4>
              <div className="metric-value">85%</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '85%'}}></div>
              </div>
            </div>
            <div className="metric-card">
              <h4>Время обработки заявки</h4>
              <div className="metric-value">2ч 45м</div>
              <p className="metric-trend positive">-15% за месяц</p>
            </div>
            <div className="metric-card">
              <h4>Успешные сделки</h4>
              <div className="metric-value">93%</div>
              <p className="metric-trend positive">+3% за квартал</p>
            </div>
          </div>

          <div className="process-graph">
            <h4>Загрузка ресурсов (по отделам)</h4>
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

          <div className="ai-insights">
            <h4>AI-инсайты по процессам</h4>
            <div className="insight-card">
              <div className="rec-icon idea-icon"></div>
              <p><strong>Оптимизация:</strong> Перераспределите 2 сотрудника из HR в отдел маркетинга для балансировки нагрузки.</p>
            </div>
            <div className="insight-card">
              <div className="rec-icon warning-icon"></div>
              <p><strong>Внимание:</strong> Отдел разработки близок к перегрузке. Рассмотрите автоматизацию тестирования.</p>
            </div>
          </div>
        </div>
      </div>
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