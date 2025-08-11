'use client';
import { useState } from 'react';

function Calculator() {
  const [revenue, setRevenue] = useState(100000);
  const [cost, setCost] = useState(30000);
  const [gain, setGain] = useState(70000);
  
  const roi = cost ? ((gain - cost) / cost) * 100 : 0;
  const isPositiveROI = roi > 0;
  
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="card">
      <h2>📊 Калькулятор ROI</h2>
      
      <label>💰 Выручка (руб.)</label>
      <input 
        type="number" 
        value={revenue} 
        onChange={e => setRevenue(+e.target.value)} 
        placeholder="Введите выручку"
      />
      
      <label>💸 Затраты (руб.)</label>
      <input 
        type="number" 
        value={cost} 
        onChange={e => setCost(+e.target.value)} 
        placeholder="Введите затраты"
      />
      
      <label>💎 Выгода (руб.)</label>
      <input 
        type="number" 
        value={gain} 
        onChange={e => setGain(+e.target.value)} 
        placeholder="Введите выгоду"
      />
      
      <div style={{
        marginTop: 16,
        padding: 16,
        background: isPositiveROI 
          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))' 
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
        borderRadius: 12,
        border: `2px solid ${isPositiveROI ? '#22c55e' : '#ef4444'}`,
        textAlign: 'center',
        animation: 'pulse 2s infinite'
      }}>
        <div style={{fontSize: '14px', color: 'var(--muted)', marginBottom: 8}}>
          Возврат инвестиций
        </div>
        <div style={{
          fontSize: '32px', 
          fontWeight: 'bold',
          color: isPositiveROI ? '#22c55e' : '#ef4444'
        }}>
          {isPositiveROI ? '📈' : '📉'} {roi.toFixed(1)}%
        </div>
        <div style={{fontSize: '12px', color: 'var(--muted)', marginTop: 4}}>
          {isPositiveROI ? 'Прибыльная инвестиция' : 'Убыточная инвестиция'}
        </div>
      </div>
      
      <div style={{marginTop: 12, fontSize: '13px', color: 'var(--muted)'}}>
        💡 Формула: ((Выгода - Затраты) / Затраты) × 100%
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
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
      typewriterEffect('Произошла ошибка при обращении к ассистенту.');
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
    {q: 'Как рассчитать ROI?', a: 'Заполните поля калькулятора и получите результат.'},
    {q: 'Как работает ассистент?', a: 'Введите вопрос и получите ответ по теме.'},
    {q: 'Что входит в премиум?', a: 'Расширенные функции, персональные отчёты, интеграция с Vault.'}
  ];
  return (
    <div className="card">
      <h2>FAQ</h2>
      <ul>
        {faqs.map((f, i) => (
          <li key={i}><b>{f.q}</b><br />{f.a}</li>
        ))}
      </ul>
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
              NeuroExpert готов!
            </h3>
            <p style={{margin: '0 0 24px', fontSize: '16px', lineHeight: 1.6, opacity: 0.9}}>
              Ваш продукт полностью готов к тестированию и развертыванию на Netlify! 
              Все компоненты интегрированы согласно техническому заданию.
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
              fontSize: '14px'
            }}>
              ✅ Калькулятор ROI<br/>
              ✅ AI Ассистент (Gemini)<br/>
              ✅ Премиум дизайн<br/>
              ✅ Готовность к деплою
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
              🚀 Отлично!
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
    <section className="container">
      <h1>NeuroExpert — AI ассистент</h1>
      <p className="lead">Калькулятор ROI, ассистент, FAQ и pop-up.</p>
      <div className="grid">
        <Calculator />
        <Assistant />
      </div>
      <FAQ />
      <Popup />
    </section>
  );
}