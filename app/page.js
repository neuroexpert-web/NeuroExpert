'use client';

import { useState, useCallback } from 'react';
import SwipeContainer from './components/SwipeContainer';

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
    // 1. Главная - улучшенный дизайн с анимацией нейросети
    <section key="home" className="full-page">
      <div className="background-animation"></div>
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">NeuroExpert</h1>
          <p className="descriptor">
            Цифровая трансформация<br/>бизнеса с помощью AI
          </p>
          <button className="cta-button" aria-label="Начать бесплатно">
            Начать бесплатно
          </button>
        </div>
        <div className="swipe-hint">
          <span className="swipe-hint-desktop">Листайте, чтобы узнать больше</span>
          <div className="swipe-hint-mobile" aria-label="Свайпните вверх"></div>
        </div>
      </main>
    </section>,
    
    // 2. Аналитика
    <section key="analytics" id="page-analytics" className="full-page">
      <div className="page-header">
        <h2>Аналитика в реальном времени</h2>
        <p>Ключевые показатели и AI-рекомендации для вашего бизнеса</p>
      </div>

      {/* Контейнер для скролла */}
      <div className="dashboard-scroll-container">
        
        {/* Блок 1: Ключевые метрики (KPI) */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="card-header">
              <span className="kpi-title">Выручка</span>
              <span className="kpi-icon revenue-icon"></span>
            </div>
            <div className="kpi-value">₽ 7 128,4K</div>
            <div className="kpi-trend positive">
              <span className="arrow-up"></span> +5.2% vs. прошлый месяц
            </div>
          </div>

          <div className="kpi-card">
            <div className="card-header">
              <span className="kpi-title">Новые клиенты</span>
              <span className="kpi-icon clients-icon"></span>
            </div>
            <div className="kpi-value">162</div>
            <div className="kpi-trend positive">
              <span className="arrow-up"></span> +12%
            </div>
          </div>

          <div className="kpi-card">
            <div className="card-header">
              <span className="kpi-title">Удовлетворенность</span>
              <span className="kpi-icon satisfaction-icon"></span>
            </div>
            <div className="kpi-value">4.85/5</div>
            <div className="kpi-trend negative">
              <span className="arrow-down"></span> -0.15
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="card-header">
              <span className="kpi-title">Конверсия</span>
              <span className="kpi-icon conversion-icon"></span>
            </div>
            <div className="kpi-value">3.13%</div>
            <div className="kpi-trend positive">
              <span className="arrow-up"></span> +0.5%
            </div>
          </div>
        </div>

        {/* Блок 2: Главный дашборд с графиками */}
        <div className="main-dashboard-grid">
          <div className="chart-card large-card">
            <h3>Динамика выручки (Последние 30 дней)</h3>
            <div className="chart-placeholder">
              <canvas id="revenueChart"></canvas>
            </div>
          </div>

          <div className="chart-card">
            <h3>Источники трафика</h3>
            <div className="chart-placeholder">
              <canvas id="trafficChart"></canvas>
            </div>
          </div>
          <div className="chart-card">
            <h3>Воронка продаж</h3>
            <div className="chart-placeholder">
              <canvas id="funnelChart"></canvas>
            </div>
          </div>
        </div>
        
        {/* Блок 3: AI-Рекомендации */}
        <div className="ai-recommendations">
          <h3>AI-рекомендации для вашего бизнеса</h3>
          <div className="recommendation-card">
            <div className="rec-icon idea-icon"></div>
            <div className="rec-content">
              <h4>Оптимизируйте мобильную версию</h4>
              <p>72% новых пользователей приходят с мобильных устройств. Улучшение UX на смартфонах может повысить конверсию на 15%.</p>
            </div>
            <button className="rec-action-button">Подробнее</button>
          </div>
          <div className="recommendation-card">
            <div className="rec-icon warning-icon"></div>
            <div className="rec-content">
              <h4>Риск оттока клиентов</h4>
              <p>Сегмент "Малый бизнес" показывает снижение активности на 25%. Рекомендуется запустить для них email-кампанию.</p>
            </div>
            <button className="rec-action-button">Создать кампанию</button>
          </div>
        </div>

      </div>
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