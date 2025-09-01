'use client';

import { memo } from 'react';

const HomePage = memo(function HomePage({ 
  activeFilter, 
  onFilterClick, 
  onCTAClick 
}) {
  return (
    <section key="home" id="home-section" className="full-page">
      {/* Hero секция с анимированным фоном */}
      <div className="hero-section">
        <div className="animated-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">NeuroExpert</span>
            <br />
            <span className="subtitle">AI-платформа для роста бизнеса</span>
          </h1>
          
          <p className="hero-description">
            Увеличьте прибыль на 40% за 3 месяца с помощью искусственного интеллекта
          </p>
          
          <div className="hero-cta">
            <button 
              className="btn-primary glow-effect"
              onClick={onCTAClick}
              aria-label="Запустить демонстрацию платформы"
            >
              <span className="btn-text">Запустить демо</span>
              <span className="btn-shine"></span>
            </button>
            <button className="btn-secondary">
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                <path d="M9 12l2 2 4-4" strokeWidth="2"/>
              </svg>
              Посмотреть кейсы
            </button>
          </div>
          
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-number">500+</span>
              <span className="trust-label">компаний</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">97%</span>
              <span className="trust-label">довольных клиентов</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">2.5x</span>
              <span className="trust-label">средний ROI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры индустрий */}
      <div className="industry-filters-section">
        <h2 className="filters-title">Выберите вашу индустрию</h2>
        <div className="industry-filters-grid">
          {[
            { id: 'retail', icon: '🛍️', name: 'Ритейл', growth: '+45%' },
            { id: 'finance', icon: '💰', name: 'Финансы', growth: '+38%' },
            { id: 'manufacturing', icon: '🏭', name: 'Производство', growth: '+52%' },
            { id: 'healthcare', icon: '🏥', name: 'Медицина', growth: '+41%' },
            { id: 'logistics', icon: '🚚', name: 'Логистика', growth: '+35%' },
            { id: 'education', icon: '🎓', name: 'Образование', growth: '+48%' }
          ].map(industry => (
            <button
              key={industry.id}
              className={`industry-filter-card ${activeFilter === industry.id ? 'active' : ''}`}
              onClick={() => onFilterClick(industry.id)}
            >
              <div className="industry-icon">{industry.icon}</div>
              <div className="industry-info">
                <h3>{industry.name}</h3>
                <p className="industry-growth">Рост прибыли {industry.growth}</p>
              </div>
              <div className="industry-badge">12 кейсов</div>
            </button>
          ))}
        </div>
      </div>

      {/* Статистика в реальном времени */}
      <div className="realtime-stats">
        <div className="stats-grid">
          <div className="stat-card live">
            <div className="stat-header">
              <span className="live-indicator"></span>
              <span className="stat-label">Сейчас онлайн</span>
            </div>
            <div className="stat-value">1,247</div>
            <div className="stat-change positive">+12% за час</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Обработано данных</div>
            <div className="stat-value">2.3 TB</div>
            <div className="stat-change">За сегодня</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">AI-рекомендаций</div>
            <div className="stat-value">45,892</div>
            <div className="stat-change positive">+234 за час</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Сэкономлено клиентам</div>
            <div className="stat-value">₽14.2M</div>
            <div className="stat-change">За месяц</div>
          </div>
        </div>
      </div>

      {/* Превью функций */}
      <div className="features-preview">
        <h2 className="preview-title">Что умеет NeuroExpert</h2>
        <div className="features-carousel">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Предиктивная аналитика</h3>
            <p>Прогнозирование продаж с точностью 94%</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Умная сегментация</h3>
            <p>AI определяет ценность каждого клиента</p>
          </div>
          
          <div className="feature-card active">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Автоматизация процессов</h3>
            <p>Экономия 20 часов в неделю на рутине</p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HomePage;