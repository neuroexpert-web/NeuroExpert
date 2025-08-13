'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Динамически импортируем компоненты без SSR
const BusinessShowcase = dynamic(() => import('./components/BusinessShowcase'), { 
  ssr: false,
  loading: () => <div>Загрузка...</div>
});

const VoiceFeedback = dynamic(() => import('./components/VoiceFeedback'), { 
  ssr: false 
});

const SmartFAQ = dynamic(() => import('./components/SmartFAQ'), { 
  ssr: false 
});

const PersonalizationModule = dynamic(() => import('./components/PersonalizationModule'), { 
  ssr: false 
});

const LearningPlatform = dynamic(() => import('./components/LearningPlatform'), { 
  ssr: false 
});

const NeuralNetworkBackground = dynamic(() => import('./components/NeuralNetworkBackground'), { 
  ssr: false,
  loading: () => <div className="neural-bg-placeholder" style={{height: '100vh', background: 'linear-gradient(45deg, #1a1a2e, #16213e)'}}></div>
});

const AnalyticsDashboard = dynamic(() => import('./components/CRMAnalytics').then(mod => ({ default: mod.AnalyticsDashboard })), { 
  ssr: false 
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), { 
  ssr: false 
});

const AutomationStatus = dynamic(() => import('./components/ContentAutomation').then(mod => ({ default: mod.AutomationStatus })), { 
  ssr: false 
});

const UXTestingPanel = dynamic(() => import('./components/UXTestingPanel'), { 
  ssr: false 
});

const MobileTestPanel = dynamic(() => import('./components/MobileTestPanel'), { 
  ssr: false 
});

const SmokeTestPanel = dynamic(() => import('./components/SmokeTestPanel'), { 
  ssr: false 
});

const PerformancePanel = dynamic(() => import('./components/PerformancePanel'), { 
  ssr: false 
});

const ErrorLogPanel = dynamic(() => import('./components/ErrorLogPanel'), { 
  ssr: false 
});

// Навигационная шапка
function Navigation() {
  const [currentSection, setCurrentSection] = useState('hero');

  const menuItems = [
    { id: 'hero', label: 'Главная', icon: '🏠' },
    { id: 'showcase', label: 'Услуги', icon: '🎯' },
    { id: 'calculator', label: 'Калькулятор', icon: '💰' },
    { id: 'faq', label: 'Вопросы', icon: '❓' },
    { id: 'contact', label: 'Контакты', icon: '📞' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(id);
    }
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="logo">
          <span className="logo-icon">🧠</span>
          <span className="logo-text">NeuroExpert</span>
        </div>
        
        <div className="nav-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="nav-actions">
          <button className="nav-phone">📞 +7 (800) 555-35-35</button>
          <button className="nav-cta">Бесплатная консультация</button>
        </div>
      </div>
    </nav>
  );
}

// Индикатор прогресса
function ProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="progress-indicator">
      <div 
        className="progress-bar" 
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// Упрощенный Hero-блок
function HeroSection() {
  const [animationEnabled, setAnimationEnabled] = useState(true);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <NeuralNetworkBackground animationEnabled={animationEnabled} />
      
      <div className="hero-content">
        <div className="hero-badge">
          🚀 #1 Платформа цифровизации в России
        </div>
        
        <div className="hero-text">
          <h1 className="hero-title">
            Увеличиваем прибыль вашего бизнеса с помощью ИИ
          </h1>
          
          <p className="hero-subtitle">
            Автоматизируем процессы, настраиваем аналитику и внедряем умные решения. 
            Результат уже через 30 дней.
          </p>
          
          <div className="hero-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <span>Быстрый старт за 1 неделю</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📈</span>
              <span>ROI от 200% гарантированно</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🛡️</span>
              <span>Поддержка 24/7</span>
            </div>
          </div>
          
          <div className="hero-cta">
            <button 
              className="cta-primary"
              onClick={() => scrollToSection('quiz')}
            >
              🎯 Узнать свою выгоду за 2 минуты
            </button>
            <button 
              className="cta-secondary"
              onClick={() => scrollToSection('showcase')}
            >
              📊 Примеры работ
            </button>
          </div>
          
          <div className="hero-trust">
            <span className="trust-text">Нам доверяют:</span>
            <div className="trust-companies">
              <span>500+ компаний</span>
              <span>2M+ рублей среднего ROI</span>
              <span>98% клиентов продлевают</span>
            </div>
          </div>
        </div>
        
        <div className="hero-controls">
          <label className="animation-toggle">
            <input
              type="checkbox"
              checked={animationEnabled}
              onChange={(e) => setAnimationEnabled(e.target.checked)}
            />
            <span>🎬 Анимация {animationEnabled ? 'вкл' : 'выкл'}</span>
          </label>
        </div>
      </div>
    </section>
  );
}

// Быстрый опрос вместо сложного калькулятора
function QuickQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: 'business_size',
      question: 'Какой у вас бизнес?',
      options: [
        { value: 'small', label: '🏪 Малый (до 10 сотрудников)', emoji: '👥' },
        { value: 'medium', label: '🏢 Средний (10-100 сотрудников)', emoji: '👥👥' },
        { value: 'large', label: '🏭 Крупный (100+ сотрудников)', emoji: '👥👥👥' }
      ]
    },
    {
      id: 'main_problem',
      question: 'Главная проблема прямо сейчас?',
      options: [
        { value: 'leads', label: '📉 Мало клиентов', emoji: '😟' },
        { value: 'process', label: '⚙️ Хаос в процессах', emoji: '🤯' },
        { value: 'data', label: '📊 Нет аналитики', emoji: '🔍' },
        { value: 'costs', label: '💸 Высокие расходы', emoji: '😰' }
      ]
    },
    {
      id: 'budget',
      question: 'Готовы инвестировать в решение?',
      options: [
        { value: 'low', label: '💰 До 100 тыс. руб.', emoji: '💸' },
        { value: 'medium', label: '💰 100-500 тыс. руб.', emoji: '💰' },
        { value: 'high', label: '💰 500+ тыс. руб.', emoji: '💎' }
      ]
    }
  ];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateROI = () => {
    const baseROI = {
      small: { min: 200, max: 400 },
      medium: { min: 300, max: 600 },
      large: { min: 500, max: 1200 }
    };
    
    const size = answers.business_size || 'small';
    const roi = baseROI[size];
    
    return {
      min: roi.min,
      max: roi.max,
      avgMonthly: Math.round((roi.min + roi.max) / 2 * 1000),
      payback: size === 'small' ? 3 : size === 'medium' ? 6 : 9
    };
  };

  if (showResult) {
    const result = calculateROI();
    return (
      <section id="quiz" className="quiz-section">
        <div className="container">
          <div className="quiz-result">
            <h2>🎉 Ваш потенциал роста:</h2>
            
            <div className="result-cards">
              <div className="result-card main">
                <h3>💰 Дополнительная прибыль</h3>
                <div className="big-number">{result.avgMonthly.toLocaleString()} ₽/мес</div>
              </div>
              
              <div className="result-card">
                <h4>📈 ROI</h4>
                <div className="number">{result.min}-{result.max}%</div>
              </div>
              
              <div className="result-card">
                <h4>⏱ Окупаемость</h4>
                <div className="number">{result.payback} мес.</div>
              </div>
            </div>
            
            <div className="result-actions">
              <button className="cta-primary large">
                📞 Получить подробный план бесплатно
              </button>
              <button className="cta-secondary" onClick={() => setShowResult(false)}>
                🔄 Пройти заново
              </button>
            </div>
            
            <div className="next-steps">
              <h3>📋 Что дальше?</h3>
              <div className="steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <span>Бесплатная консультация 30 мин</span>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <span>Экспресс-аудит вашего бизнеса</span>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <span>Персональный план внедрения</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentQ = questions[currentQuestion];
  
  return (
    <section id="quiz" className="quiz-section">
      <div className="container">
        <div className="quiz-container">
          <div className="quiz-progress">
            <div className="progress-steps">
              {questions.map((_, index) => (
                <div 
                  key={index}
                  className={`step ${index <= currentQuestion ? 'active' : ''}`}
                />
              ))}
            </div>
            <span className="progress-text">
              Вопрос {currentQuestion + 1} из {questions.length}
            </span>
          </div>
          
          <div className="quiz-content">
            <h2>{currentQ.question}</h2>
            
            <div className="quiz-options">
              {currentQ.options.map((option, index) => (
                <button
                  key={option.value}
                  className="quiz-option"
                  onClick={() => handleAnswer(option.value)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-text">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [industry, setIndustry] = useState('');
  const [investment, setInvestment] = useState(500000);
  const [adBudget, setAdBudget] = useState(100000);
  
  // Мультипликаторы эффективности по отраслям (обновленные согласно ТЗ)
  const multipliers = {
    retail: { saving: 2.5, revenue: 1.8, payback: 4, name: '🛍️ Розничная торговля' },
    manufacturing: { saving: 3.2, revenue: 2.1, payback: 6, name: '🏭 Производство' },
    services: { saving: 2.8, revenue: 2.3, payback: 3, name: '💼 Услуги/Консалтинг' },
    restaurant: { saving: 2.2, revenue: 1.9, payback: 5, name: '🍽️ Ресторанный бизнес' },
    logistics: { saving: 3.5, revenue: 2.0, payback: 8, name: '🚚 Логистика/Доставка' },
    finance: { saving: 3.8, revenue: 2.5, payback: 4, name: '💳 Финансовые услуги' },
    healthcare: { saving: 3.0, revenue: 2.2, payback: 6, name: '🏥 Здравоохранение' },
    education: { saving: 2.6, revenue: 1.7, payback: 5, name: '📚 Образование' }
  };

  const currentMultiplier = multipliers[industry];
  
  // Расчеты ROI для цифровизации
  const annualSaving = investment * (currentMultiplier?.saving || 0);
  const additionalRevenue = investment * (currentMultiplier?.revenue || 0) + adBudget * 2.5;
  const totalBenefit = annualSaving + additionalRevenue;
  const roi = ((totalBenefit - investment - adBudget) / (investment + adBudget)) * 100;
  const paybackMonths = currentMultiplier?.payback || 0;
  
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <section id="calculator" className="calculator-section">
      <div className="container">
        <h2>💰 ROI‑калькулятор эффективности цифровизации</h2>
        
        <div className="calculator-steps">
          <div className="step-indicator">
            {[1, 2, 3].map(step => (
              <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
                {step}
              </div>
            ))}
          </div>
          
          {currentStep === 1 && (
            <div className="step-content">
              <h3>Шаг 1: Выберите отрасль</h3>
              <div className="industry-grid">
                {Object.entries(multipliers).map(([key, data]) => (
                  <button
                    key={key}
                    className={`industry-card ${industry === key ? 'selected' : ''}`}
                    onClick={() => setIndustry(key)}
                  >
                    {data.name}
                  </button>
                ))}
              </div>
              {industry && (
                <button className="step-btn" onClick={nextStep}>
                  Далее →
                </button>
              )}
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="step-content">
              <h3>Шаг 2: Инвестиции</h3>
              
              <div className="input-group">
                <label>Сумма вложений в цифровизацию:</label>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                />
                <span className="value">{formatNumber(investment)} ₽</span>
              </div>
              
              <div className="input-group">
                <label>Бюджет на рекламу (месячный):</label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={adBudget}
                  onChange={(e) => setAdBudget(Number(e.target.value))}
                />
                <span className="value">{formatNumber(adBudget)} ₽</span>
              </div>
              
              <div className="step-navigation">
                <button className="step-btn secondary" onClick={prevStep}>
                  ← Назад
                </button>
                <button className="step-btn" onClick={nextStep}>
                  Рассчитать →
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && currentMultiplier && (
            <div className="step-content">
              <h3>Шаг 3: Результат</h3>
              
              <div className="results-grid">
                <div className="result-card">
                  <h4>💸 Экономия на автоматизации</h4>
                  <div className="result-value">{formatNumber(annualSaving)} ₽/год</div>
                </div>
                
                <div className="result-card">
                  <h4>📈 Потенциальная доп. прибыль</h4>
                  <div className="result-value">{formatNumber(additionalRevenue)} ₽/год</div>
                </div>
                
                <div className="result-card highlight">
                  <h4>🎯 Общая прибыль/эффект</h4>
                  <div className="result-value">{formatNumber(totalBenefit)} ₽/год</div>
                </div>
                
                <div className="result-card">
                  <h4>⚡ ROI</h4>
                  <div className="result-value">{Math.round(roi)}%</div>
                </div>
                
                <div className="result-card">
                  <h4>⏰ Срок окупаемости</h4>
                  <div className="result-value">{paybackMonths} мес.</div>
                </div>
              </div>
              
              <div className="roi-explanation">
                <details>
                  <summary>❓ Как считается ROI?</summary>
                  <p>
                    ROI рассчитывается по формуле: (Общая выгода - Инвестиции) / Инвестиции × 100%.
                    Учитываются экономия от автоматизации процессов, увеличение выручки от 
                    оптимизации рекламы и улучшения конверсии сайта.
                  </p>
                </details>
              </div>
              
              <div className="step-navigation">
                <button className="step-btn secondary" onClick={prevStep}>
                  ← Изменить данные
                </button>
                <button className="step-btn primary">
                  📞 Получить детальный расчет и консультацию
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Улучшенная секция AI-управляющего
function ManagerSection() {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const typewriterEffect = (text) => {
    setA('');
    setTyping(true);
    let i = 0;
    const timer = setInterval(() => {
      setA(prev => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setTyping(false);
      }
    }, 30);
  };

  const ask = async () => {
    if (!q || loading) return;
    
    const userQuestion = q;
    setQ('');
    setLoading(true);
    setA('');
    
    // Добавляем вопрос пользователя в историю
    setChatHistory(prev => [...prev, { type: 'user', text: userQuestion }]);
    
    try {
      const res = await fetch('/.netlify/functions/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      typewriterEffect(data.answer);
      
      // Добавляем ответ в историю после завершения печатания
      setTimeout(() => {
        setChatHistory(prev => [...prev, { type: 'assistant', text: data.answer }]);
      }, data.answer.length * 30 + 100);
      
    } catch (error) {
      console.error("Failed to fetch assistant's response:", error);
      const errorMessage = error.message.includes('500') 
        ? '⚠️ Управляющий временно недоступен. Проверьте настройку GEMINI_API_KEY в Netlify. Пока используйте FAQ или калькулятор.'
        : 'Произошла ошибка. Попробуйте позже или воспользуйтесь FAQ.';
      
      typewriterEffect(errorMessage);
      setChatHistory(prev => [...prev, { type: 'assistant', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && q.trim()) {
      ask();
    }
  };

  const quickQuestions = [
    "Сколько стоит цифровизация моего бизнеса?",
    "Какой ROI я могу ожидать?",
    "Сколько времени займет внедрение?",
    "Какие услуги подходят малому бизнесу?",
    "Как начать цифровую трансформацию?"
  ];

  return (
    <section id="manager" className="manager-section">
      <div className="container">
        <div className="manager-content">
          <div className="manager-header">
            <div className="manager-avatar">
              <div className="avatar-ring"></div>
              <span className="avatar-emoji">👨‍💼</span>
              <div className="online-status">●</div>
            </div>
            
            <div className="manager-info">
              <h2>🎯 AI Управляющий NeuroExpert</h2>
              <p>Персональный консультант по цифровизации бизнеса</p>
              <div className="manager-stats">
                <span className="stat">📊 500+ проектов</span>
                <span className="stat">⚡ Отвечает за 30 сек</span>
                <span className="stat">🎯 95% точность</span>
              </div>
            </div>
          </div>

          <div className="chat-interface">
            {/* История чата */}
            {chatHistory.length > 0 && (
              <div className="chat-history">
                {chatHistory.map((message, index) => (
                  <div key={index} className={`chat-message ${message.type}`}>
                    <div className="message-avatar">
                      {message.type === 'user' ? '👤' : '👨‍💼'}
                    </div>
                    <div className="message-content">
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Текущий ответ */}
            {(a || typing) && (
              <div className="current-response">
                <div className="response-header">
                  <span className="response-avatar">👨‍💼</span>
                  <span className="response-title">Рекомендация управляющего:</span>
                </div>
                <div className="response-content">
                  {a}
                  {typing && <span className="typing-cursor">|</span>}
                </div>
              </div>
            )}

            {/* Быстрые вопросы */}
            <div className="quick-questions">
              <h4>💡 Популярные вопросы:</h4>
              <div className="questions-grid">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="quick-question"
                    onClick={() => setQ(question)}
                    disabled={loading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Поле ввода */}
            <div className="input-section">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Задайте вопрос управляющему..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="question-input"
                />
                <button
                  onClick={ask}
                  disabled={loading || !q.trim()}
                  className="ask-button"
                >
                  {loading ? '🔄' : '💬'}
                </button>
              </div>
              
              <div className="input-help">
                💡 Спросите о цифровизации, ROI, сроках или подходящих решениях
              </div>
            </div>

            {/* Безопасность */}
            <div className="security-notice">
              <div className="security-icon">🔒</div>
              <div className="security-text">
                <strong>Гарантия безопасности данных</strong>
                <div>Все данные шифруются AES-256 • GDPR • 152-ФЗ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Секция контактов
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/.netlify/functions/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'contact_form'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Успешная отправка
        alert(data.message);
        setFormData({ name: '', phone: '', company: '', message: '' });
        
        // Отслеживание в аналитике (если доступно)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: 'contact_form'
          });
        }
      } else {
        // Ошибка валидации или сервера
        alert(data.error || 'Произошла ошибка при отправке формы');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Произошла ошибка при отправке. Попробуйте позже или позвоните нам напрямую.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>📞 Получите бесплатную консультацию</h2>
            <p>
              Обсудим ваш бизнес, проанализируем возможности роста 
              и составим персональный план внедрения ИИ.
            </p>
            
            <div className="contact-features">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <div>
                  <h4>Быстро</h4>
                  <p>Перезвоним в течение 15 минут</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <div>
                  <h4>Персонально</h4>
                  <p>Решения под ваш бизнес</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">💰</span>
                <div>
                  <h4>Бесплатно</h4>
                  <p>Консультация ничего не стоит</p>
                </div>
              </div>
            </div>
            
            <div className="contact-methods">
              <a href="tel:+78005553535" className="contact-method">
                <span className="method-icon">📞</span>
                <div>
                  <div className="method-title">Позвонить сейчас</div>
                  <div className="method-value">+7 (800) 555-35-35</div>
                </div>
              </a>
              
              <a href="mailto:hello@neuroexpert.ru" className="contact-method">
                <span className="method-icon">📧</span>
                <div>
                  <div className="method-title">Написать email</div>
                  <div className="method-value">hello@neuroexpert.ru</div>
                </div>
              </a>
            </div>
          </div>
          
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Название компании"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <textarea
                  placeholder="Расскажите о вашем бизнесе и задачах"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  disabled={isSubmitting}
                  rows="4"
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? '📤 Отправляем...' : '📞 Получить консультацию бесплатно'}
              </button>
              
              <div className="form-note">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {q: 'За сколько окупается цифровизация?', a: 'В зависимости от отрасли: от 3 до 8 месяцев. Используйте калькулятор для точного расчета.'},
    {q: 'Какой ROI можно ожидать?', a: 'Средний ROI составляет 150-350% в зависимости от типа бизнеса и бюджета инвестиций.'},
    {q: 'Что делает AI-управляющий?', a: 'Консультирует по вопросам цифровизации, анализирует потребности бизнеса и рекомендует оптимальные решения.'},
    {q: 'Безопасны ли мои данные?', a: 'Да! Все данные шифруются по стандарту AES-256, соответствуют GDPR и 152-ФЗ. Данные не передаются третьим лицам.'},
    {q: 'Что включает цифровизация?', a: 'Автоматизация процессов, CRM/ERP системы, интернет-магазин, аналитика, AI-решения.'},
    {q: 'Подходит ли малому бизнесу?', a: 'Да! Минимальный бюджет от 100,000₽ уже дает ощутимый эффект для малого бизнеса.'}
  ];
  return (
    <div className="card">
      <h2>❓ Часто задаваемые вопросы</h2>
      <div style={{fontSize: '14px', lineHeight: 1.6}}>
        {faqs.map((f, i) => (
          <div key={i} style={{marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
            <div style={{fontWeight: 'bold', marginBottom: 6, color: 'var(--accent)'}}>{f.q}</div>
            <div style={{color: 'var(--muted)'}}>{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Popup() {
  const [show, setShow] = useState(false);
  
  return (
    <div>
      <button 
        onClick={() => setShow(true)} 
        style={{
          marginBottom: 10,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '25px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        ✨ Показать премиум pop-up
      </button>
      
      {show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: 40,
            borderRadius: 20,
            minWidth: 400,
            maxWidth: 500,
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            position: 'relative',
            animation: 'slideIn 0.4s ease'
          }}>
            <div style={{fontSize: '48px', marginBottom: 20}}>🎉</div>
            <h3 style={{margin: '0 0 16px', fontSize: '24px', fontWeight: 'bold'}}>
              🎉 Добро пожаловать в NeuroExpert!
            </h3>
            <p style={{margin: '0 0 24px', fontSize: '16px', lineHeight: 1.6, opacity: 0.9}}>
              Платформа для автоматизации аудита и ROI-расчетов успешно развернута! 
              Используйте все функции для анализа эффективности ваших проектов.
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
              fontSize: '14px'
            }}>
              ✅ Калькулятор цифровизации — точный ROI по отраслям<br/>
              ✅ AI Консультант — экспертные ответы по бизнесу<br/>
              ✅ Прогнозы окупаемости — сроки возврата инвестиций<br/>
              ✅ Отраслевая аналитика — данные по 5 сферам бизнеса
            </div>
            <button 
              onClick={() => setShow(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '12px 32px',
                borderRadius: '25px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🎯 Начать работу!
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('main');

  if (activeTab === 'main') {
    return (
      <div className="app">
        <Navigation />
        <ProgressIndicator />
        <HeroSection />
        
        <main className="main-content">
          <QuickQuiz />
          <BusinessShowcase />
          <Calculator />
          <ManagerSection />
          <SmartFAQ />
          <ContactSection />
        </main>
        
        <VoiceFeedback />
        
        {/* Админские функции скрыты в обычном режиме */}
        <div className="admin-access" style={{position: 'fixed', bottom: '10px', right: '10px', opacity: 0.1}}>
          <button onClick={() => setActiveTab('admin')} title="Админка">⚙️</button>
        </div>
      </div>
    );
  }

  if (activeTab === 'admin') {
    return (
      <div className="admin-app">
        <AdminPanel />
        <button className="back-btn" onClick={() => setActiveTab('main')}>
          ← Вернуться на сайт
        </button>
      </div>
    );
  }

  if (activeTab === 'analytics') {
    return (
      <div className="analytics-app">
        <AnalyticsDashboard />
        <AutomationStatus />
        <button className="back-btn" onClick={() => setActiveTab('main')}>
          ← Вернуться на сайт
        </button>
      </div>
    );
  }

  if (activeTab === 'testing') {
    return (
      <div className="testing-app">
        <UXTestingPanel />
        <MobileTestPanel />
        <SmokeTestPanel />
        <PerformancePanel />
        <ErrorLogPanel />
        <button className="back-btn" onClick={() => setActiveTab('main')}>
          ← Вернуться на сайт
        </button>
      </div>
    );
  }

  return null;
}
