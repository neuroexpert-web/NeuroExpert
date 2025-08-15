'use client';
// Version: 2.0 - Updated with new design and features
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

const AnimatedLogo = dynamic(
  () => import('./components/AnimatedLogo'),
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
    // Скрываем основной loader после загрузки
    setTimeout(() => setIsLoading(false), 1000);
    
    // Убираем автоматическое открытие AI помощника
    // setTimeout(() => setShowAI(true), 3000);
  }, []);

  // Принудительно скрываем загрузчик после монтирования
  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 300);
      }, 500);
    }
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
          <div className="logo animated-nav-logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">
              <span className="logo-neuro">Neuro</span>
              <span className="logo-expert">Expert</span>
            </span>
          </div>
          
          <div className="nav-links">
            <a href="#features" className="nav-link">Возможности</a>
            <a href="#development" className="nav-link">Разработка</a>
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
          
          {/* Анимированный логотип вместо обычного заголовка */}
          <AnimatedLogo />
          
          <p className="hero-description">
            Мы не просто подключаем AI-чат. Мы создаем <strong>полноценные сайты, 
            приложения и интернет-магазины</strong> с встроенными AI-специалистами,<br/>
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
            <a 
              href="tel:+79040476383" 
              className="btn btn-outline btn-large"
            >
              <span>📞</span>
              +7 (904) 047-63-83
            </a>
          </div>
          
          {/* Честное обещание */}
          <div className="hero-promise">
            <p className="promise-text">
              <span className="promise-icon">🤝</span>
              Мы молодая команда, которая верит в силу AI. 
              Станьте одним из первых клиентов и получите 
              <button 
                className="special-conditions-link"
                onClick={() => {
                  const contact = document.getElementById('contact');
                  contact?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                особые условия
              </button>.
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
                  <span className="price-value old">от 150 000₽/мес</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Наш AI:</span>
                  <span className="price-value new">от 39 900₽/мес</span>
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
              <div className="feature-icon">🚀</div>
              <h3>Быстрый запуск проекта</h3>
              <p>От идеи до работающего решения за 2-4 недели</p>
              <ul className="feature-list">
                <li>✓ Полный цикл разработки</li>
                <li>✓ Готовые шаблоны решений</li>
                <li>✓ Обучение вашей команды</li>
              </ul>
              <div className="feature-status">
                <span className="status-badge status-ready">Проверенная методология</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Новая секция - Что мы создаем */}
      <section id="development" className="development-section">
        <div className="container">
          <h2 className="section-title">
            Создаем <span className="gradient-text">умные решения</span> под ключ
          </h2>
          <p className="section-subtitle">
            Не просто AI-чат, а полноценные проекты с встроенным искусственным интеллектом
          </p>
          
          <div className="development-grid">
            <div className="dev-card">
              <div className="dev-icon">🛍️</div>
              <h3>Интернет-магазины с AI</h3>
              <p>Магазин, где AI-консультант знает всё о товарах</p>
              <ul className="dev-features">
                <li>✓ Персональные рекомендации</li>
                <li>✓ Помощь в выборе размера</li>
                <li>✓ Оформление заказа голосом</li>
                <li>✓ Автоматические скидки</li>
              </ul>
              <div className="dev-price">от 149 900₽</div>
            </div>
            
            <div className="dev-card">
              <div className="dev-icon">📱</div>
              <h3>Мобильные приложения</h3>
              <p>Приложения с AI-ассистентом внутри</p>
              <ul className="dev-features">
                <li>✓ iOS и Android</li>
                <li>✓ Голосовой помощник</li>
                <li>✓ Умные уведомления</li>
                <li>✓ Офлайн режим</li>
              </ul>
              <div className="dev-price">от 299 900₽</div>
            </div>
            
            <div className="dev-card">
              <div className="dev-icon">🚀</div>
              <h3>Landing Page с AI</h3>
              <p>Продающие страницы с умным консультантом</p>
              <ul className="dev-features">
                <li>✓ Конверсия до 40%</li>
                <li>✓ A/B тестирование</li>
                <li>✓ Квалификация лидов</li>
                <li>✓ Запись на встречу</li>
              </ul>
              <div className="dev-price">от 79 900₽</div>
            </div>
            
            <div className="dev-card">
              <div className="dev-icon">🏢</div>
              <h3>Корпоративные сайты</h3>
              <p>Сайты компаний с AI-отделом продаж</p>
              <ul className="dev-features">
                <li>✓ Многоязычность</li>
                <li>✓ База знаний</li>
                <li>✓ CRM интеграция</li>
                <li>✓ Аналитика поведения</li>
              </ul>
              <div className="dev-price">от 199 900₽</div>
            </div>
            
            <div className="dev-card">
              <div className="dev-icon">🎓</div>
              <h3>Образовательные платформы</h3>
              <p>LMS с персональным AI-преподавателем</p>
              <ul className="dev-features">
                <li>✓ Адаптивное обучение</li>
                <li>✓ Проверка заданий</li>
                <li>✓ Мотивация студентов</li>
                <li>✓ Отчеты прогресса</li>
              </ul>
              <div className="dev-price">от 349 900₽</div>
            </div>
            
            <div className="dev-card">
              <div className="dev-icon">💼</div>
              <h3>SaaS платформы</h3>
              <p>Сервисы с AI в основе бизнес-логики</p>
              <ul className="dev-features">
                <li>✓ Автоматизация процессов</li>
                <li>✓ Умная аналитика</li>
                <li>✓ API для партнеров</li>
                <li>✓ Масштабирование</li>
              </ul>
              <div className="dev-price">от 499 900₽</div>
            </div>
          </div>
          
          <div className="development-cta">
            <h3>Все проекты включают:</h3>
            <div className="included-features">
              <div className="included-item">
                <span className="included-icon">🤖</span>
                <span>AI-специалист обученный под ваш бизнес</span>
              </div>
              <div className="included-item">
                <span className="included-icon">📊</span>
                <span>Полная аналитика и CRM функции</span>
              </div>
              <div className="included-item">
                <span className="included-icon">🔧</span>
                <span>3 месяца поддержки бесплатно</span>
              </div>
              <div className="included-item">
                <span className="included-icon">🚀</span>
                <span>Запуск за 2-4 недели</span>
              </div>
            </div>
            
            <button 
              className="btn btn-primary btn-large"
              onClick={() => {
                const contact = document.getElementById('contact');
                contact?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Обсудить проект
            </button>
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
              price="39,900"
              period="месяц"
              features={[
                "AI-ассистент для вашего бизнеса",
                "До 1000 диалогов/месяц",
                "Лендинг или сайт-визитка",
                "Базовая CRM функция",
                "Email поддержка",
                "Обучение AI под ваш продукт"
              ]}
              isPopular={false}
            />
            
            <PricingCard
              name="Бизнес"
              price="89,900"
              period="месяц"
              features={[
                "Всё из тарифа Старт",
                "До 10 000 диалогов/месяц",
                "Интернет-магазин или корп. сайт",
                "Мобильное приложение (iOS/Android)",
                "Полная замена CRM системы",
                "Поддержка 24/7",
                "API интеграция"
              ]}
              isPopular={true}
            />
            
            <PricingCard
              name="Enterprise"
              price="От 199,900"
              period="месяц"
              features={[
                "Безлимитные диалоги",
                "SaaS платформа или маркетплейс",
                "Кроссплатформенные приложения",
                "White label решение",
                "Выделенная инфраструктура",
                "Персональная команда разработки",
                "Приоритетные обновления"
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
      
      {/* Тур для новых пользователей */}
      <OnboardingTour />
      
      {/* Футер с контактами */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🧠</span>
                <span className="logo-text">
                  <span className="logo-neuro">Neuro</span>
                  <span className="logo-expert">Expert</span>
                </span>
              </div>
              <p className="footer-description">
                Стартап, который делает AI-технологии доступными для каждого бизнеса
              </p>
            </div>
            
            <div className="footer-contacts">
              <h3 className="footer-title">Контакты</h3>
              <div className="footer-contact-list">
                <a href="tel:+79040476383" className="footer-contact">
                  <span className="footer-icon">📞</span>
                  +7 (904) 047-63-83
                </a>
                <a href="mailto:aineuroexpert@gmail.com" className="footer-contact">
                  <span className="footer-icon">✉️</span>
                  aineuroexpert@gmail.com
                </a>
              </div>
            </div>
            
            <div className="footer-cta">
              <h3 className="footer-title">Готовы начать?</h3>
              <p className="footer-text">
                Получите персонального AI-ассистента для вашего бизнеса уже сегодня
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const contact = document.getElementById('contact');
                  contact?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Начать сейчас
              </button>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 NeuroExpert. Все права защищены.
            </p>
            <p className="footer-made">
              Сделано с ❤️ и AI в России
            </p>
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
