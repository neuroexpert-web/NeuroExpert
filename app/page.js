'use client';

import { useState, useCallback } from 'react';
import SwipeContainer from './components/SwipeContainer';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  
  // Определение разделов для навигации
  const sections = [
    'Главная',
    'Аналитика'
  ];

  // Обработка смены секции
  const handleSectionChange = useCallback((index) => {
    setCurrentSection(index);
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