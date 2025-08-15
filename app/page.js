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

const RealtimeStats = dynamic(
  () => import('./components/RealtimeStats'),
  { ssr: false }
);

const QuickActions = dynamic(
  () => import('./components/QuickActions'),
  { ssr: false }
);

const OnboardingTour = dynamic(
  () => import('./components/OnboardingTour'),
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
      
      {/* Онбординг для новых пользователей */}
      <OnboardingTour />
      
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
          {/* Простой и понятный заголовок */}
          <div className="hero-badge">
            <span className="badge badge-primary">🚀 Новинка 2024</span>
          </div>
          
          <h1 className="hero-title">
            <span className="gradient-text">Увеличьте продажи на 40%</span>
            <br />
            <span className="hero-subtitle">с помощью искусственного интеллекта</span>
          </h1>
          
          <p className="hero-description">
            Мы поможем автоматизировать рутинные задачи, найти новых клиентов 
            и увеличить прибыль вашего бизнеса. Без сложностей, просто и эффективно.
          </p>
          
          {/* Четкие действия */}
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => {
                const calc = document.getElementById('calculator');
                calc?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>💰</span>
              Рассчитать мою выгоду
            </button>
            
            <button 
              className="btn btn-secondary btn-large"
              onClick={() => setShowAI(true)}
            >
              <span>💬</span>
              Получить консультацию
            </button>
          </div>
          
          {/* Социальное доказательство */}
          <div className="hero-trust">
            <div className="trust-item">
              <span className="trust-number">500+</span>
              <span className="trust-label">компаний уже с нами</span>
            </div>
            <div className="trust-divider">•</div>
            <div className="trust-item">
              <span className="trust-number">4.9</span>
              <span className="trust-label">рейтинг клиентов</span>
            </div>
            <div className="trust-divider">•</div>
            <div className="trust-item">
              <span className="trust-number">24/7</span>
              <span className="trust-label">поддержка</span>
            </div>
          </div>
        </div>
        
        {/* Визуальная демонстрация */}
        <div className="hero-visual">
          <div className="demo-preview">
            <div className="demo-screen">
              <div className="demo-header">
                <span>📊 Ваша прибыль через 6 месяцев</span>
              </div>
              <div className="demo-chart">
                <div className="chart-bar" style={{height: '40%'}}>До</div>
                <div className="chart-bar chart-bar-success" style={{height: '80%'}}>После</div>
              </div>
              <div className="demo-result">
                <span className="result-label">Рост:</span>
                <span className="result-value">+40%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция "Как это работает" - новая */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Как это работает?</h2>
          <p className="section-subtitle">Всего 3 простых шага к успеху</p>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📊</div>
              <h3>Анализируем ваш бизнес</h3>
              <p>Рассказываете о вашей компании, мы находим точки роста</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">🤖</div>
              <h3>Внедряем AI-решения</h3>
              <p>Автоматизируем продажи, маркетинг и работу с клиентами</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">💰</div>
              <h3>Получаете результат</h3>
              <p>Видите рост продаж и экономию времени уже через месяц</p>
            </div>
          </div>
          
          <div className="cta-center">
            <button className="btn btn-primary">
              Начать прямо сейчас →
            </button>
          </div>
        </div>
      </section>

      {/* Обновленная секция возможностей */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Что вы получите?</h2>
          <p className="section-subtitle">
            Конкретные инструменты для роста вашего бизнеса
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Умные продажи</h3>
              <p>AI-помощник сам обзванивает клиентов, отвечает на вопросы и продает 24/7</p>
              <ul className="feature-benefits">
                <li>✓ Экономия на менеджерах</li>
                <li>✓ Продажи круглосуточно</li>
                <li>✓ Конверсия выше на 30%</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Автоматический маркетинг</h3>
              <p>Система сама запускает рекламу, пишет посты и привлекает клиентов</p>
              <ul className="feature-benefits">
                <li>✓ Без маркетолога</li>
                <li>✓ Дешевле в 5 раз</li>
                <li>✓ Результат через 7 дней</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Клиентский сервис</h3>
              <p>AI отвечает клиентам мгновенно, решает проблемы и повышает лояльность</p>
              <ul className="feature-benefits">
                <li>✓ Ответ за 1 секунду</li>
                <li>✓ Довольные клиенты</li>
                <li>✓ Больше повторных продаж</li>
              </ul>
            </div>
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
