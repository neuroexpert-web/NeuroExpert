'use client';
import { useState } from 'react';

// Компонент анимированной нейросети
function NeuralNetwork() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Анимированные связи между нейронами */}
        <defs>
          <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(125, 211, 252, 0.3)" />
            <stop offset="100%" stopColor="rgba(125, 211, 252, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Горизонтальные связи */}
        <line x1="150" y1="200" x2="450" y2="180" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="150" y1="300" x2="450" y2="320" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="150" y1="400" x2="450" y2="420" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="5s" repeatCount="indefinite" />
        </line>
        
        <line x1="450" y1="180" x2="750" y2="160" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.1;0.7;0.1" dur="6s" repeatCount="indefinite" />
        </line>
        <line x1="450" y1="320" x2="750" y2="300" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4.5s" repeatCount="indefinite" />
        </line>
        <line x1="450" y1="420" x2="750" y2="440" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.8s" repeatCount="indefinite" />
        </line>
        
        <line x1="750" y1="160" x2="1050" y2="250" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5.2s" repeatCount="indefinite" />
        </line>
        <line x1="750" y1="300" x2="1050" y2="250" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.7;0.4;0.7" dur="4.2s" repeatCount="indefinite" />
        </line>
        <line x1="750" y1="440" x2="1050" y2="250" stroke="url(#connectionGrad)" strokeWidth="1">
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3.5s" repeatCount="indefinite" />
        </line>
        
        {/* Диагональные связи */}
        <line x1="150" y1="200" x2="450" y2="320" stroke="url(#connectionGrad)" strokeWidth="0.8" opacity="0.4">
          <animate attributeName="opacity" values="0.1;0.6;0.1" dur="7s" repeatCount="indefinite" />
        </line>
        <line x1="150" y1="300" x2="450" y2="180" stroke="url(#connectionGrad)" strokeWidth="0.8" opacity="0.3">
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="6.5s" repeatCount="indefinite" />
        </line>
        <line x1="450" y1="180" x2="750" y2="440" stroke="url(#connectionGrad)" strokeWidth="0.8" opacity="0.2">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="8s" repeatCount="indefinite" />
        </line>
        <line x1="450" y1="420" x2="750" y2="160" stroke="url(#connectionGrad)" strokeWidth="0.8" opacity="0.3">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="5.8s" repeatCount="indefinite" />
        </line>
        
        {/* Нейроны (узлы) */}
        <circle cx="150" cy="200" r="6" fill="rgba(125, 211, 252, 0.8)">
          <animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="300" r="5" fill="rgba(125, 211, 252, 0.6)">
          <animate attributeName="r" values="5;7;5" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="400" r="6" fill="rgba(125, 211, 252, 0.7)">
          <animate attributeName="r" values="6;9;6" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="450" cy="180" r="8" fill="rgba(125, 211, 252, 0.9)">
          <animate attributeName="r" values="8;10;8" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;1;0.9" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="450" cy="320" r="7" fill="rgba(125, 211, 252, 0.8)">
          <animate attributeName="r" values="7;9;7" dur="4.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="450" cy="420" r="6" fill="rgba(125, 211, 252, 0.7)">
          <animate attributeName="r" values="6;8;6" dur="3.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.95;0.7" dur="3.8s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="750" cy="160" r="7" fill="rgba(125, 211, 252, 0.8)">
          <animate attributeName="r" values="7;9;7" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="750" cy="300" r="8" fill="rgba(125, 211, 252, 0.9)">
          <animate attributeName="r" values="8;11;8" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;1;0.9" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="750" cy="440" r="6" fill="rgba(125, 211, 252, 0.7)">
          <animate attributeName="r" values="6;8;6" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.9;0.7" dur="5.5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="1050" cy="250" r="10" fill="rgba(125, 211, 252, 1)">
          <animate attributeName="r" values="10;14;10" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.8;1" dur="2.8s" repeatCount="indefinite" />
        </circle>
        
        {/* Дополнительные мелкие нейроны */}
        <circle cx="300" cy="100" r="3" fill="rgba(125, 211, 252, 0.5)">
          <animate attributeName="r" values="3;5;3" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="500" r="4" fill="rgba(125, 211, 252, 0.6)">
          <animate attributeName="r" values="4;6;4" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="900" cy="100" r="3" fill="rgba(125, 211, 252, 0.4)">
          <animate attributeName="r" values="3;5;3" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

function Calculator() {
  const [investment, setInvestment] = useState(500000);
  const [businessType, setBusinessType] = useState('retail');
  
  // Мультипликаторы эффективности по типам бизнеса
  const multipliers = {
    retail: { saving: 2.5, revenue: 1.8, payback: 4 },      // Розничная торговля
    manufacturing: { saving: 3.2, revenue: 2.1, payback: 6 }, // Производство  
    services: { saving: 2.8, revenue: 2.3, payback: 3 },    // Услуги
    restaurant: { saving: 2.2, revenue: 1.9, payback: 5 },  // Ресторанный бизнес
    logistics: { saving: 3.5, revenue: 2.0, payback: 8 }    // Логистика
  };

  const currentMultiplier = multipliers[businessType];
  
  // Расчеты ROI для цифровизации
  const annualSaving = investment * currentMultiplier.saving;     // Экономия в год
  const additionalRevenue = investment * currentMultiplier.revenue; // Доп. выручка в год
  const totalBenefit = annualSaving + additionalRevenue;
  const roi = ((totalBenefit - investment) / investment) * 100;
  const paybackMonths = currentMultiplier.payback;
  
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
  };

  const businessTypes = {
    retail: '🛍️ Розничная торговля',
    manufacturing: '🏭 Производство',
    services: '💼 Услуги/Консалтинг', 
    restaurant: '🍽️ Ресторанный бизнес',
    logistics: '🚚 Логистика/Доставка'
  };

  return (
    <div className="card">
      <h2>💰 Калькулятор эффективности цифровизации</h2>
      
      <label>🏢 Тип вашего бизнеса</label>
      <select 
        value={businessType} 
        onChange={e => setBusinessType(e.target.value)}
        style={{
          width: '100%',
          margin: '6px 0 12px',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #253141',
          background: '#0c1320',
          color: 'var(--text)',
          fontSize: '14px'
        }}
      >
        {Object.entries(businessTypes).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      
      <label>💵 Бюджет на цифровизацию (руб.)</label>
      <input 
        type="number" 
        value={investment} 
        onChange={e => setInvestment(+e.target.value)} 
        placeholder="Введите бюджет на внедрение"
        step="50000"
      />
      
      {/* Результаты расчета */}
      <div style={{
        marginTop: 20,
        padding: 20,
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
        borderRadius: 16,
        border: '2px solid #22c55e'
      }}>
        <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: 16, textAlign: 'center'}}>
          📊 Прогнозируемый эффект от инвестиций
        </div>
        
        <div style={{display: 'grid', gap: '12px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
            <span>💾 Экономия на автоматизации:</span>
            <strong style={{color: '#22c55e'}}>+{formatNumber(annualSaving)}₽/год</strong>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
            <span>📈 Дополнительная выручка:</span>
            <strong style={{color: '#22c55e'}}>+{formatNumber(additionalRevenue)}₽/год</strong>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
            <span>💎 Общая выгода в год:</span>
            <strong style={{color: '#22c55e', fontSize: '18px'}}>+{formatNumber(totalBenefit)}₽</strong>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0'}}>
            <span style={{fontSize: '16px'}}>🎯 ROI (рентабельность):</span>
            <strong style={{color: '#22c55e', fontSize: '24px'}}>{roi.toFixed(0)}%</strong>
          </div>
        </div>
        
        <div style={{
          marginTop: 16,
          padding: 12,
          background: 'rgba(125, 211, 252, 0.1)',
          borderRadius: 8,
          textAlign: 'center',
          fontSize: '14px'
        }}>
          ⏱️ <strong>Окупаемость: {paybackMonths} месяцев</strong><br/>
          💰 Чистая прибыль за год: <strong style={{color: '#22c55e'}}>+{formatNumber(totalBenefit - investment)}₽</strong>
        </div>
      </div>
      
      <div style={{marginTop: 12, fontSize: '12px', color: 'var(--muted)', textAlign: 'center'}}>
        💡 Расчет основан на средних показателях цифровизации для {businessTypes[businessType].toLowerCase()}
      </div>
    </div>
  );
}

function Assistant() {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

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
    setLoading(true);
    setA('');
    try {
      const res = await fetch('/.netlify/functions/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      typewriterEffect(data.answer);
    } catch (error) {
      console.error("Failed to fetch assistant's response:", error);
      if (error.message.includes('500')) {
        typewriterEffect('⚠️ AI ассистент временно недоступен. Проверьте настройку GEMINI_API_KEY в Netlify Environment Variables. Пока что используйте FAQ или калькулятор ROI.');
      } else {
        typewriterEffect('Произошла ошибка при обращении к ассистенту. Попробуйте позже или обратитесь к FAQ.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      ask();
    }
  };

  return (
    <div className="card">
      <h2>🤖 AI Ассистент</h2>
      <input 
        placeholder="Спроси про услуги / ROI" 
        value={q} 
        onChange={e => setQ(e.target.value)} 
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      <button onClick={ask} disabled={loading || !q}>
        {loading ? '🔄 Обработка...' : '💬 Спросить'}
      </button>
      
      <div style={{fontSize: '12px', color: 'var(--muted)', marginTop: 8}}>
        💡 Если ассистент не отвечает, проверьте настройку API ключа в Netlify
      </div>
      
      {(a || typing) && (
        <div style={{
          marginTop: 12, 
          padding: 12, 
          background: 'rgba(125, 211, 252, 0.1)', 
          borderRadius: 8, 
          borderLeft: '3px solid var(--accent)'
        }}>
          <strong>Ответ:</strong> {a}
          {typing && <span style={{animation: 'blink 1s infinite'}}>|</span>}
        </div>
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {q: 'За сколько окупается цифровизация?', a: 'В зависимости от отрасли: от 3 до 8 месяцев. Используйте калькулятор для точного расчета.'},
    {q: 'Какой ROI можно ожидать?', a: 'Средний ROI составляет 150-350% в зависимости от типа бизнеса и бюджета инвестиций.'},
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
  return (
    <>
      <NeuralNetwork />
      <section className="container">
        <h1>NeuroExpert — Платформа цифровизации бизнеса</h1>
        <p className="lead">Рассчитайте ROI от цифровизации, получите AI-консультацию и узнайте как увеличить прибыль.</p>
        <div className="grid">
          <Calculator />
          <Assistant />
        </div>
        <FAQ />
        <Popup />
      </section>
    </>
  );
}
