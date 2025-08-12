'use client';
import { useState } from 'react';
import BusinessShowcase from './components/BusinessShowcase';
import VoiceFeedback from './components/VoiceFeedback';
import SmartFAQ from './components/SmartFAQ';
import PersonalizationModule from './components/PersonalizationModule';
import LearningPlatform from './components/LearningPlatform';
import NeuralNetworkBackground from './components/NeuralNetworkBackground';
import { AnalyticsDashboard } from './components/CRMAnalytics';
import AdminPanel from './components/AdminPanel';
import { AutomationStatus } from './components/ContentAutomation';
import UXTestingPanel from './components/UXTestingPanel';
import MobileTestPanel from './components/MobileTestPanel';
import SmokeTestPanel from './components/SmokeTestPanel';
import PerformancePanel from './components/PerformancePanel';
import ErrorLogPanel from './components/ErrorLogPanel';

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
        typewriterEffect('⚠️ Управляющий временно недоступен. Проверьте настройку GEMINI_API_KEY в Netlify Environment Variables. Пока что используйте FAQ или калькулятор ROI.');
      } else {
        typewriterEffect('Произошла ошибка при обращении к управляющему. Попробуйте позже или обратитесь к FAQ.');
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
      {/* Заголовок безопасности */}
      <div style={{
        marginBottom: 20,
        padding: 16,
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
        borderRadius: 12,
        border: '1px solid rgba(34, 197, 94, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent)',
          animation: 'securityScan 3s ease-in-out infinite'
        }}></div>
        
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
          <div style={{
            fontSize: '24px',
            animation: 'securityPulse 2s ease-in-out infinite'
          }}>🔒</div>
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #22c55e, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Гарантия безопасности данных</h3>
        </div>
        
        <div style={{fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5}}>
          🛡️ Все данные шифруются по стандарту AES-256<br/>
          🌐 Соответствие требованиям GDPR и 152-ФЗ<br/>
          ✅ Данные не передаются третьим лицам
        </div>
      </div>

      {/* Управляющий с аватаром */}
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16}}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          border: '3px solid var(--accent)',
          boxShadow: '0 4px 15px rgba(125, 211, 252, 0.3)',
          animation: 'managerPulse 2s ease-in-out infinite',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid var(--accent)',
            animation: 'managerRing 3s linear infinite'
          }}></div>
          👨‍💼
        </div>
        
        <div>
          <h2 style={{margin: '0 0 4px', fontSize: '18px'}}>🎯 AI Управляющий</h2>
          <div style={{fontSize: '12px', color: 'var(--muted)'}}>
            Персональный консультант по цифровизации
          </div>
        </div>
      </div>
      
      <input 
        placeholder="Задайте вопрос управляющему..." 
        value={q} 
        onChange={e => setQ(e.target.value)} 
        onKeyPress={handleKeyPress}
        disabled={loading}
        style={{
          marginBottom: 12,
          border: '2px solid var(--accent)',
          background: 'rgba(125, 211, 252, 0.05)'
        }}
      />
      <button onClick={ask} disabled={loading || !q}>
        {loading ? '🔄 Анализирую...' : '💬 Консультация'}
      </button>
      
      <div style={{fontSize: '12px', color: 'var(--muted)', marginTop: 8}}>
        💡 Если управляющий не отвечает, проверьте настройку API ключа в Netlify
      </div>
      
      {(a || typing) && (
        <div style={{
          marginTop: 16, 
          padding: 16, 
          background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.1), rgba(125, 211, 252, 0.05))', 
          borderRadius: 12, 
          borderLeft: '4px solid var(--accent)',
          position: 'relative'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
            <div style={{fontSize: '16px'}}>👨‍💼</div>
            <strong style={{color: 'var(--accent)'}}>Рекомендация управляющего:</strong>
          </div>
          <div style={{lineHeight: 1.6}}>{a}</div>
          {typing && <span style={{animation: 'blink 1s infinite', color: 'var(--accent)'}}>|</span>}
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
  return (
    <>
      <NeuralNetworkBackground />
      <PersonalizationModule />
      <section className="container">
        <h1>NeuroExpert — Платформа цифровизации бизнеса</h1>
        <p className="lead">Рассчитайте ROI от цифровизации, получите консультацию AI-управляющего и узнайте как увеличить прибыль.</p>
        <div className="grid">
          <Calculator />
          <Assistant />
        </div>
        <BusinessShowcase />
        <SmartFAQ />
        <LearningPlatform />
        <Popup />
      </section>
      <VoiceFeedback />
      <PersonalizationModule />
      
      {/* Системы мониторинга и управления */}
      <AnalyticsDashboard />
      <AutomationStatus />
      <AdminPanel />
      <UXTestingPanel />
      <MobileTestPanel />
      <SmokeTestPanel />
      <PerformancePanel />
      <ErrorLogPanel />
    </>
  );
}
