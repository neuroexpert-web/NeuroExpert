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
          {/* Честное позиционирование */}
          <div className="hero-badge">
            <span className="badge badge-warning">🚀 Стартап • Начинаем вместе</span>
          </div>
          
          <h1 className="hero-title">
            <span className="gradient-text">NeuroExpert</span>
            <br />
            <span className="hero-subtitle">Платформа AI-ассистентов нового поколения</span>
          </h1>
          
          <p className="hero-description">
            Мы только начинаем, но уже готовы предложить вам передовые технологии:<br/>
            <strong>персональные AI-эксперты</strong> прямо на вашем сайте или в приложении,<br/>
            которые заменят дорогие CRM-системы и целые отделы поддержки.
          </p>
          
          {/* Честные преимущества */}
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-emoji">💰</span>
              <span className="feature-text">Экономия до 80% на CRM</span>
            </div>
            <div className="hero-feature">
              <span className="feature-emoji">🤖</span>
              <span className="feature-text">AI-ассистент 24/7</span>
            </div>
            <div className="hero-feature">
              <span className="feature-emoji">🚀</span>
              <span className="feature-text">Внедрение за 3 дня</span>
            </div>
          </div>
          
          {/* Призыв к действию */}
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => setShowAI(true)}
            >
              <span>💬</span>
              Попробовать AI-ассистента
            </button>
            
            <button 
              className="btn btn-secondary btn-large"
              onClick={() => {
                const demo = document.getElementById('live-demo');
                demo?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>👀</span>
              Посмотреть демо
            </button>
          </div>
          
          {/* Честное обещание */}
          <div className="hero-promise">
            <p className="promise-text">
              <span className="promise-icon">🤝</span>
              Мы молодая команда, которая верит в силу AI. 
              Станьте одним из первых клиентов и получите <strong>особые условия</strong>.
            </p>
          </div>
        </div>
        
        {/* Демо технологии */}
        <div className="hero-visual">
          <div className="tech-showcase">
            <div className="showcase-header">
              <span className="live-indicator"></span>
              AI-ассистент в действии
            </div>
            <div className="showcase-chat">
              <div className="chat-message user">
                <span>Сколько стоит ваша CRM?</span>
              </div>
              <div className="chat-message ai">
                <span>Вам не нужна отдельная CRM! Наш AI-ассистент:</span>
                <ul>
                  <li>• Запоминает всех клиентов</li>
                  <li>• Ведет историю общения</li>
                  <li>• Анализирует и сегментирует базу</li>
                  <li>• Стоит в 10 раз дешевле</li>
                </ul>
              </div>
            </div>
            <div className="showcase-footer">
              Работает на Gemini Pro и Claude AI
            </div>
          </div>
        </div>
      </section>

      {/* Секция "Почему мы?" - новая */}
      <section className="why-us-section">
        <div className="container">
          <h2 className="section-title">Почему выбрать стартап?</h2>
          <p className="section-subtitle">
            Мы не корпорация с раздутыми ценами. Мы - энтузиасты AI.
          </p>
          
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">💸</div>
              <h3>Честные цены</h3>
              <p>Без наценок за бренд. Платите только за технологию.</p>
              <div className="price-comparison">
                <div className="price-item">
                  <span className="price-label">Обычная CRM:</span>
                  <span className="price-value old">50 000₽/мес</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Наш AI:</span>
                  <span className="price-value new">5 000₽/мес</span>
                </div>
              </div>
            </div>
            
            <div className="advantage-card">
              <div className="advantage-icon">🧠</div>
              <h3>Новейшие технологии</h3>
              <p>Используем самые передовые AI-модели без ограничений.</p>
              <div className="tech-stack">
                <span className="tech-badge">GPT-4</span>
                <span className="tech-badge">Claude 3</span>
                <span className="tech-badge">Gemini Pro</span>
              </div>
            </div>
            
            <div className="advantage-card">
              <div className="advantage-icon">🤝</div>
              <h3>Личный подход</h3>
              <p>Основатели лично участвуют в каждом проекте.</p>
              <div className="founder-note">
                "Мы растем вместе с вами"
                <span className="founder-name">- Команда NeuroExpert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция реальных возможностей */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Что умеет наш AI прямо сейчас</h2>
          <p className="section-subtitle">
            Без преувеличений. Только то, что работает.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>AI-консультант на сайте</h3>
              <p>Отвечает на вопросы клиентов мгновенно, 24/7</p>
              <ul className="feature-list">
                <li>✓ Понимает контекст вашего бизнеса</li>
                <li>✓ Обучается на ваших материалах</li>
                <li>✓ Говорит на языке ваших клиентов</li>
              </ul>
              <div className="feature-demo">
                <button className="btn btn-sm btn-primary" onClick={() => setShowAI(true)}>
                  Попробовать сейчас
                </button>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Замена CRM системы</h3>
              <p>AI запоминает и анализирует всех клиентов</p>
              <ul className="feature-list">
                <li>✓ Автоматическая сегментация</li>
                <li>✓ История всех обращений</li>
                <li>✓ Умные напоминания</li>
              </ul>
              <div className="feature-status">
                <span className="status-badge status-ready">Готово к использованию</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔌</div>
              <h3>Интеграция за 5 минут</h3>
              <p>Простая установка на любой сайт или приложение</p>
              <ul className="feature-list">
                <li>✓ Одна строка кода</li>
                <li>✓ Работает везде</li>
                <li>✓ Без программистов</li>
              </ul>
              <div className="feature-code">
                <code>&lt;script src="neuroexpert.ai/widget.js"&gt;&lt;/script&gt;</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Живая демонстрация */}
      <section id="live-demo" className="live-demo-section">
        <div className="container">
          <h2 className="section-title">Посмотрите, как это работает</h2>
          <p className="section-subtitle">
            Реальный пример AI-ассистента для интернет-магазина
          </p>
          
          <div className="demo-container">
            <div className="demo-screen">
              <div className="demo-browser">
                <div className="browser-header">
                  <span className="browser-dot"></span>
                  <span className="browser-dot"></span>
                  <span className="browser-dot"></span>
                  <span className="browser-url">your-shop.com</span>
                </div>
                <div className="browser-content">
                  <div className="shop-header">
                    <h3>Ваш интернет-магазин</h3>
                  </div>
                  
                  {/* AI виджет */}
                  <div className="ai-widget-demo">
                    <div className="widget-header">
                      <span className="widget-avatar">🤖</span>
                      <span className="widget-name">AI-помощник</span>
                      <span className="widget-status">Онлайн</span>
                    </div>
                    <div className="widget-messages">
                      <div className="demo-message ai">
                        Здравствуйте! Я AI-ассистент. Чем могу помочь?
                      </div>
                      <div className="demo-message user">
                        Какие у вас есть скидки?
                      </div>
                      <div className="demo-message ai">
                        Сейчас действуют скидки:
                        • 20% на весь каталог
                        • Бесплатная доставка от 3000₽
                        • Подарок при покупке от 5000₽
                        
                        Хотите, я помогу выбрать товар?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="demo-stats">
              <div className="stat-item">
                <span className="stat-value">0.5 сек</span>
                <span className="stat-label">Время ответа</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Доступность</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">∞</span>
                <span className="stat-label">Клиентов в час</span>
              </div>
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
