'use client';

import { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import SwipeContainer from './components/SwipeContainer';
import EnhancedFloatingAI from './components/EnhancedFloatingAI';

// Динамические импорты
const AgentList = dynamic(() => import('./components/AgentList'), {
  ssr: false,
  loading: () => <div className="loading">Загрузка агентов...</div>
});

const PricingCalculator = dynamic(() => import('./components/PricingCalculator'), {
  ssr: false,
  loading: () => <div className="loading">Загрузка...</div>
});

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);

  const sections = ['Главная', 'Агенты', 'Баланс', 'FAQ', 'Контакты'];

  const handleSectionChange = useCallback((index) => {
    setCurrentSection(index);
  }, []);

  const handleCTAClick = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const aiButton = document.querySelector('.ai-chat-button, .floating-ai-btn');
      if (aiButton) aiButton.click();
      setLoading(false);
    }, 300);
  }, []);

  const sectionComponents = [
    // 1. ГЛАВНАЯ - Hero + О проекте
    <section key="home" className="full-page">
      <div className="background-animation"></div>
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">NeuroExpert</h1>
          <p className="descriptor">
            Автономные ИИ-агенты,<br/>которые работают для вас 24/7
          </p>
          <p className="subdescriptor">
            Платите только за результат через протокол x402.<br/>
            Прозрачно. Справедливо. Безопасно.
          </p>
          
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <span className="feature-text">Автономные агенты</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span className="feature-text">Работают 24/7</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💎</span>
              <span className="feature-text">Оплата за результат</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span className="feature-text">Протокол x402</span>
            </div>
          </div>

          <button 
            className={`hero-cta-button neon-gradient ${loading ? 'loading' : ''}`}
            onClick={handleCTAClick}
            disabled={loading}
          >
            <span className="button-glow"></span>
            <span className="button-content">
              <span className="cta-icon">🚀</span>
              <span className="cta-text">{loading ? 'Загрузка...' : 'Начать работу с агентами'}</span>
              <span className="cta-arrow">→</span>
            </span>
          </button>
        </div>

        {/* О проекте */}
        <div className="about-brief glass-card">
          <h2>Новая экономика ИИ-агентов</h2>
          <p>
            NeuroExpert — это платформа автономных ИИ-агентов, которые специализируются 
            на различных задачах: от рекламы до аналитики. Каждый агент работает независимо, 
            выполняя свои функции 24/7.
          </p>
          <p>
            Благодаря протоколу x402 вы платите только за реальные результаты. 
            Никаких абонентских плат — только прозрачная оплата через блокчейн.
          </p>
          
          <div className="stats-row">
            <div className="stat">
              <span className="stat-value">3+</span>
              <span className="stat-label">Специализированных агента</span>
            </div>
            <div className="stat">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Непрерывная работа</span>
            </div>
            <div className="stat">
              <span className="stat-value">x402</span>
              <span className="stat-label">Блокчейн платежи</span>
            </div>
          </div>
        </div>
      </main>
    </section>,

    // 2. АГЕНТЫ - Управление и статистика
    <section key="agents" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Ваши ИИ-агенты</h2>
        <p>Управляйте агентами, отслеживайте их работу и результаты</p>
      </div>
      
      <Suspense fallback={<div className="loading">Загрузка агентов...</div>}>
        <AgentList />
      </Suspense>
    </section>,

    // 3. БАЛАНС И ОПЛАТА - Интеграция x402
    <section key="balance" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Баланс и оплата</h2>
        <p>Управляйте балансом и оплачивайте услуги агентов через протокол x402</p>
      </div>
      
      <Suspense fallback={<div className="loading">Загрузка...</div>}>
        <PricingCalculator />
      </Suspense>

      {/* Преимущества x402 */}
      <div className="x402-benefits">
        <h3>Почему протокол x402?</h3>
        <div className="benefits-grid">
          <div className="benefit-card glass-card">
            <div className="benefit-icon">🔒</div>
            <h4>Безопасность</h4>
            <p>Все транзакции защищены блокчейном Base. Ваши средства в безопасности.</p>
          </div>
          
          <div className="benefit-card glass-card">
            <div className="benefit-icon">⚡</div>
            <h4>Скорость</h4>
            <p>Мгновенные платежи без посредников. Комиссии сети Base минимальны.</p>
          </div>
          
          <div className="benefit-card glass-card">
            <div className="benefit-icon">📊</div>
            <h4>Прозрачность</h4>
            <p>Все транзакции публичны и проверяемы в блокчейн explorer.</p>
          </div>
          
          <div className="benefit-card glass-card">
            <div className="benefit-icon">🌍</div>
            <h4>Доступность</h4>
            <p>Платежи из любой точки мира. Без ограничений и блокировок.</p>
          </div>
        </div>
      </div>
    </section>,

    // 4. FAQ - Ответы на вопросы
    <section key="faq" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Часто задаваемые вопросы</h2>
        <p>Всё, что нужно знать о платформе и агентах</p>
      </div>

      <div className="faq-container">
        <div className="faq-category">
          <h3>Об ИИ-агентах</h3>
          
          <details className="faq-item glass-card">
            <summary>
              <span>Что такое ИИ-агенты?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              ИИ-агенты — это автономные программы на базе искусственного интеллекта, 
              которые выполняют специализированные задачи без участия человека. Каждый 
              агент обучен для определенной роли: рекламный агент создает и оптимизирует 
              рекламные кампании, аналитик обрабатывает данные и строит прогнозы, 
              цифровой управляющий координирует работу других агентов.
            </p>
          </details>

          <details className="faq-item glass-card">
            <summary>
              <span>Как агенты монетизируют свои услуги?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              Агенты работают по модели "оплата за результат". Вы платите только за 
              реальные выполненные задачи: за созданную рекламную кампанию, за аналитический 
              отчет, за обработанные данные. Никаких абонентских плат или скрытых комиссий.
            </p>
          </details>

          <details className="faq-item glass-card">
            <summary>
              <span>Можно ли управлять агентами?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              Да! Вы можете активировать/деактивировать агентов, назначать им задачи, 
              устанавливать приоритеты и отслеживать их работу в реальном времени. 
              Все управление доступно в разделе "Агенты".
            </p>
          </details>
        </div>

        <div className="faq-category">
          <h3>О протоколе x402</h3>
          
          <details className="faq-item glass-card">
            <summary>
              <span>Что такое протокол x402?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              x402 — это открытый протокол для платежей в блокчейне, разработанный 
              Coinbase. Он обеспечивает быстрые, безопасные и недорогие транзакции 
              для оплаты цифровых услуг. Протокол работает на сети Base и поддерживает 
              стейблкоины (USDC, USDT).
            </p>
          </details>

          <details className="faq-item glass-card">
            <summary>
              <span>Как пополнить баланс?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              1. Подключите Web3 кошелек (MetaMask или Coinbase Wallet)<br/>
              2. Перейдите в раздел "Баланс и оплата"<br/>
              3. Нажмите "Пополнить баланс"<br/>
              4. Выберите сумму и подтвердите транзакцию в кошельке<br/>
              Средства поступят мгновенно после подтверждения в блокчейне.
            </p>
          </details>

          <details className="faq-item glass-card">
            <summary>
              <span>Какие сети и токены поддерживаются?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              Поддерживаемые сети:<br/>
              • Base (mainnet) - рекомендуется, низкие комиссии<br/>
              • Ethereum (mainnet) - для совместимости<br/>
              • Base Sepolia (testnet) - для тестирования<br/>
              <br/>
              Поддерживаемые токены:<br/>
              • USDC (основной)<br/>
              • USDT<br/>
              Лимиты: от $1 до $10,000 за транзакцию
            </p>
          </details>

          <details className="faq-item glass-card">
            <summary>
              <span>Безопасно ли это?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              Да, абсолютно безопасно. Протокол x402 использует:<br/>
              • Шифрование AES-256 для всех данных<br/>
              • Смарт-контракты, проверенные аудиторами<br/>
              • Facilitator от Coinbase для верификации<br/>
              • Все транзакции публичны и проверяемы в блокчейне<br/>
              • Ваши приватные ключи остаются только у вас
            </p>
          </details>
        </div>

        <div className="faq-category">
          <h3>Об оплате и тарифах</h3>
          
          <details className="faq-item glass-card">
            <summary>
              <span>Сколько стоят услуги агентов?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              Цены зависят от типа агента и задачи:<br/>
              • Рекламный агент: от $0.10 за клик, от $5 за кампанию<br/>
              • Аналитик: от $0.50 за отчет, от $10 за глубокий анализ<br/>
              • Цифровой управляющий: от $1 за сессию координации<br/>
              <br/>
              Вы видите точную стоимость перед запуском любой задачи.
            </p>
          </details>

          <details className="faq-item glass-card">
            <summary>
              <span>Как отслеживать расходы?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              В разделе "Баланс и оплата" доступны:<br/>
              • Текущий баланс<br/>
              • История всех транзакций<br/>
              • Статистика потребления по каждому агенту<br/>
              • Графики расходов<br/>
              • Экспорт отчетов<br/>
              Все данные обновляются в реальном времени.
            </p>
          </details>

          <details className="faq-item glass-card">
            <summary>
              <span>Есть ли возвраты?</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </summary>
            <p>
              Да, если агент не выполнил задачу или выполнил с ошибками, вы можете 
              запросить возврат в течение 24 часов. Средства вернутся на ваш баланс 
              автоматически после проверки. Мы гарантируем качество работы агентов.
            </p>
          </details>
        </div>

        {/* История основателя */}
        <div className="founder-story glass-card">
          <h3>О создателе платформы</h3>
          <div className="story-content">
            <div className="founder-avatar">
              <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" fill="url(#avatarGradient)"/>
                <defs>
                  <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="story-text">
              <h4>Вячеслав - основатель NeuroExpert</h4>
              <p>
                "Я верю, что каждый человек имеет право на равный доступ к современным 
                технологиям и благам человечества. ИИ не должен быть привилегией крупных 
                корпораций - он должен служить всем."
              </p>
              <p>
                "С протоколом x402 и автономными агентами мы создаем новую экономическую 
                модель, где технологии работают для людей, а не наоборот. Прозрачность, 
                справедливость и доступность - вот наши главные ценности."
              </p>
              <div className="mission-statement">
                <strong>Наша миссия:</strong>
                <p>
                  Сделать передовые ИИ-технологии доступными для всех через прозрачную 
                  и справедливую модель оплаты на базе блокчейна.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>,

    // 5. КОНТАКТЫ - Простая форма
    <section key="contacts" className="full-page scrollable-section">
      <div className="page-header">
        <h2>Связаться с нами</h2>
        <p>Есть вопросы? Напишите нам!</p>
      </div>

      <div className="contacts-simple">
        <div className="contact-form-wrapper glass-card">
          <h3>Отправить сообщение</h3>
          <form className="contact-form-simple">
            <div className="form-group">
              <input type="text" placeholder="Ваше имя *" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email *" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Ваше сообщение *" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn-submit">
              Отправить
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2"/>
              </svg>
            </button>
          </form>
        </div>

        <div className="contact-info-simple">
          <div className="contact-card glass-card">
            <div className="contact-icon">📧</div>
            <h4>Email</h4>
            <a href="mailto:hello@neuroexpert.ru">hello@neuroexpert.ru</a>
          </div>

          <div className="contact-card glass-card">
            <div className="contact-icon">💬</div>
            <h4>Telegram</h4>
            <a href="#">@neuroexpert_support</a>
          </div>

          <div className="contact-card glass-card">
            <div className="contact-icon">🌐</div>
            <h4>Discord</h4>
            <a href="#">NeuroExpert Community</a>
          </div>

          <div className="support-hours glass-card">
            <h4>Время работы</h4>
            <p>Понедельник - Пятница: 9:00 - 18:00 МСК</p>
            <p>Техподдержка агентов: 24/7</p>
          </div>
        </div>
      </div>
    </section>
  ];

  return (
    <main className="premium-main">
      <SwipeContainer 
        sections={sections}
        onSectionChange={handleSectionChange}
        initialSection={currentSection}
      >
        {sectionComponents}
      </SwipeContainer>
      
      <EnhancedFloatingAI />
    </main>
  );
}
