'use client';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Динамически импортируем компоненты без SSR для избежания ошибок
const NeuralNetworkBackground = dynamic(
  () => import('./components/NeuralNetworkBackground'),
  { 
    ssr: false,
    loading: () => <div className="bg-gradient-placeholder" />
  }
);

const SmartFloatingAI = dynamic(
  () => import('./components/SmartFloatingAI'),
  { ssr: false }
);

const AnalyticsTracker = dynamic(
  () => import('./components/AnalyticsTracker'),
  { ssr: false }
);

const ROICalculator = dynamic(
  () => import('./components/ROICalculator'),
  { ssr: false }
);

const ContactForm = dynamic(
  () => import('./components/ContactForm'),
  { ssr: false }
);

// Компонент загрузки
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Загружаем NeuroExpert...</p>
  </div>
);

export default function HomePage() {
  const [showAI, setShowAI] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Имитируем загрузку для плавного появления
    setTimeout(() => setIsLoading(false), 1000);
    
    // Показываем AI помощника через 3 секунды
    setTimeout(() => setShowAI(true), 3000);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app-container">
      {/* Фоновая анимация нейросети */}
      <NeuralNetworkBackground animationEnabled={true} />
      
      {/* Аналитика */}
      <AnalyticsTracker />
      
      {/* Навигация */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">NeuroExpert</span>
          </div>
          
          <div className="nav-links">
            <a href="#features" className="nav-link">Возможности</a>
            <a href="#calculator" className="nav-link">Калькулятор</a>
            <a href="#pricing" className="nav-link">Тарифы</a>
            <a href="#demo" className="nav-link">Демо</a>
            <a href="#contact" className="nav-link nav-cta">Начать</a>
          </div>
        </div>
      </nav>

      {/* Главный экран */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Цифровизация бизнеса</span>
            <br />
            на новом уровне с ИИ
          </h1>
          
          <p className="hero-subtitle">
            Первая в России платформа полной автоматизации бизнес-процессов
            с искусственным интеллектом. Экономия до 70% времени и ресурсов.
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Компаний</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">93%</div>
              <div className="stat-label">Эффективность</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Поддержка</div>
            </div>
          </div>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => setShowAI(true)}>
              <span>🚀</span> Попробовать бесплатно
            </button>
            <button className="btn-secondary">
              <span>📊</span> Посмотреть демо
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card">
            <div className="card-glow"></div>
            <div className="card-content">
              <h3>AI-аудит компании</h3>
              <ul className="feature-list">
                <li>✓ Анализ бизнес-процессов</li>
                <li>✓ Оценка эффективности</li>
                <li>✓ План цифровизации</li>
                <li>✓ ROI калькулятор</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Секция возможностей */}
      <section id="features" className="features-section">
        <div className="section-container">
          <h2 className="section-title">
            Что умеет <span className="gradient-text">NeuroExpert</span>
          </h2>
          
          <div className="features-grid">
            <FeatureCard
              icon="🤖"
              title="ИИ-управляющий"
              description="Виртуальный директор на базе Claude и Gemini для принятия решений"
              features={["Анализ данных", "Стратегическое планирование", "24/7 мониторинг"]}
            />
            
            <FeatureCard
              icon="📊"
              title="Умная аналитика"
              description="Полный цифровой аудит компании с рекомендациями по оптимизации"
              features={["Финансовый анализ", "KPI мониторинг", "Предиктивная аналитика"]}
            />
            
            <FeatureCard
              icon="🛠"
              title="Автоматизация"
              description="Создание сайтов, приложений и CRM систем без программистов"
              features={["No-code платформа", "Готовые шаблоны", "Интеграции API"]}
            />
            
            <FeatureCard
              icon="💬"
              title="Омниканальность"
              description="Единый центр управления всеми каналами коммуникации"
              features={["Telegram боты", "Email рассылки", "Голосовые ассистенты"]}
            />
          </div>
        </div>
      </section>

      {/* Калькулятор ROI */}
      <ROICalculator />

      {/* Секция тарифов */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <h2 className="section-title">
            Выберите подходящий <span className="gradient-text">тариф</span>
          </h2>
          
          <div className="pricing-grid">
            <PricingCard
              name="Старт"
              price="15,000"
              period="месяц"
              features={[
                "До 100 клиентов",
                "Базовая аналитика",
                "Email поддержка",
                "1 пользователь"
              ]}
              isPopular={false}
            />
            
            <PricingCard
              name="Бизнес"
              price="45,000"
              period="месяц"
              features={[
                "До 1000 клиентов",
                "Расширенная аналитика",
                "Приоритетная поддержка",
                "5 пользователей",
                "API доступ",
                "Кастомизация"
              ]}
              isPopular={true}
            />
            
            <PricingCard
              name="Корпорация"
              price="По запросу"
              period=""
              features={[
                "Неограниченно клиентов",
                "Полная аналитика",
                "Выделенный менеджер",
                "Неограниченно пользователей",
                "White Label",
                "On-premise установка"
              ]}
              isPopular={false}
            />
          </div>
        </div>
      </section>

      {/* Контактная форма */}
      <ContactForm />

      {/* AI Ассистент */}
      {showAI && <SmartFloatingAI />}

      {/* Футер */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>🧠 NeuroExpert</h3>
              <p>Платформа №1 по цифровизации бизнеса в России</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Продукт</h4>
                <a href="#features">Возможности</a>
                <a href="#pricing">Тарифы</a>
                <a href="#demo">Демо</a>
              </div>
              
              <div className="footer-column">
                <h4>Компания</h4>
                <a href="#about">О нас</a>
                <a href="#blog">Блог</a>
                <a href="#careers">Карьера</a>
              </div>
              
              <div className="footer-column">
                <h4>Поддержка</h4>
                <a href="#docs">Документация</a>
                <a href="#faq">FAQ</a>
                <a href="#contact">Контакты</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 NeuroExpert. Все права защищены.</p>
            <p>Сделано с ❤️ в России</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Компонент карточки возможности
function FeatureCard({ icon, title, description, features }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      <ul className="feature-list">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}

// Компонент карточки тарифа
function PricingCard({ name, price, period, features, isPopular }) {
  return (
    <div className={`pricing-card ${isPopular ? 'popular' : ''}`}>
      {isPopular && <div className="popular-badge">Популярный</div>}
      <h3 className="pricing-name">{name}</h3>
      <div className="pricing-price">
        <span className="price-currency">₽</span>
        <span className="price-amount">{price}</span>
        {period && <span className="price-period">/{period}</span>}
      </div>
      <ul className="pricing-features">
        {features.map((feature, index) => (
          <li key={index}>
            <span className="feature-check">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className="pricing-button">
        {price === "По запросу" ? "Связаться" : "Выбрать тариф"}
      </button>
    </div>
  );
}
