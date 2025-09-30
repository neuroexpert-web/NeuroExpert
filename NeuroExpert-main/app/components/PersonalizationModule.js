// Модуль персонализации и предиктивной аналитики для NeuroExpert
'use client';
import { useState, useEffect } from 'react';

// Симуляция определения сегмента пользователя
function detectUserSegment() {
  // В реальном проекте здесь анализ поведения, источника трафика, cookies и т.д.
  const segments = ['small', 'medium', 'large'];
  const sources = ['google', 'yandex', 'direct', 'social'];
  const behaviors = ['calculator', 'faq', 'assistant', 'packages'];
  
  return {
    segment: segments[Math.floor(Math.random() * segments.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    interests: behaviors.slice(0, Math.floor(Math.random() * 3) + 1),
    visitCount: Math.floor(Math.random() * 10) + 1,
    lastVisit: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  };
}

// Генерация персональных рекомендаций
function generateRecommendations(userProfile) {
  const recommendations = {
    small: [
      {
        id: 'audit-rec',
        title: '🔍 Рекомендуем: Аудит для малого бизнеса',
        description: 'Начните с оценки текущего состояния за 50 000 ₽',
        roi: '200-300%',
        timeframe: '1-2 месяца',
        reason: 'Подходит для первого знакомства с цифровизацией'
      },
      {
        id: 'website-rec',
        title: '🌐 Популярно: Сайт с AI-экспертом',
        description: 'Увеличьте конверсию с помощью AI-ассистента',
        roi: '300-500%',
        timeframe: '2-3 месяца',
        reason: 'Быстрая окупаемость для малого бизнеса'
      }
    ],
    medium: [
      {
        id: 'digital-strategy-rec',
        title: '📈 Рекомендуем: Digital-стратегия',
        description: 'Комплексная цифровая трансформация бизнеса',
        roi: '400-600%',
        timeframe: '3-6 месяцев',
        reason: 'Оптимальное решение для растущего бизнеса'
      },
      {
        id: 'bi-tools-rec',
        title: '📊 Трендовое: BI-инструменты',
        description: 'Аналитика для принятия data-driven решений',
        roi: '350-550%',
        timeframe: '2-4 месяца',
        reason: 'Повышает эффективность на 30-50%'
      }
    ],
    large: [
      {
        id: 'transformation-rec',
        title: '🚀 Эксклюзивно: Полная трансформация',
        description: 'Комплексная цифровая трансформация корпорации',
        roi: '600-1200%',
        timeframe: '6-12 месяцев',
        reason: 'Стратегическое преимущество на рынке'
      },
      {
        id: 'erp-integration-rec',
        title: '⚙️ Enterprise: ERP-интеграция',
        description: 'Внедрение корпоративных систем управления',
        roi: '700-1000%',
        timeframe: '6-18 месяцев',
        reason: 'Масштабируемость и эффективность'
      }
    ]
  };
  
  return recommendations[userProfile.segment] || recommendations.small;
}

// Расчет предполагаемой выгоды
function calculatePredictedBenefit(userProfile, service) {
  const baseROI = {
    small: { min: 200, max: 400 },
    medium: { min: 350, max: 600 },
    large: { min: 500, max: 1200 }
  };
  
  const roi = baseROI[userProfile.segment];
  const investment = Math.floor(Math.random() * 500000) + 100000;
  const returnAmount = investment * (roi.min + Math.random() * (roi.max - roi.min)) / 100;
  
  return {
    investment,
    returnAmount: Math.floor(returnAmount),
    roi: Math.floor((returnAmount - investment) / investment * 100),
    paybackMonths: Math.floor(Math.random() * 6) + 3
  };
}

function PersonalizationModule() {
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showPersonalization, setShowPersonalization] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  useEffect(() => {
    // Симуляция загрузки профиля пользователя
    setTimeout(() => {
      const profile = detectUserSegment();
      setUserProfile(profile);
      setRecommendations(generateRecommendations(profile));
    }, 1000);
  }, []);

  const handleRecommendationClick = (rec) => {
    const benefit = calculatePredictedBenefit(userProfile, rec);
    setSelectedRecommendation({ ...rec, benefit });
  };

  const getSegmentLabel = (segment) => {
    const labels = {
      small: '👥 Малый бизнес',
      medium: '🏢 Средний бизнес',
      large: '🏭 Крупный бизнес'
    };
    return labels[segment] || '🤔 Определяем...';
  };

  const getSourceLabel = (source) => {
    const labels = {
      google: '🌐 Google',
      yandex: '🔍 Яндекс',
      direct: '🔗 Прямой переход',
      social: '📱 Соцсети'
    };
    return labels[source] || '❓ Неизвестно';
  };

  if (!showPersonalization || !userProfile) {
    return null;
  }

  return (
    <div className="personalization-module">
      <div className="personalization-header">
        <div className="header-content">
          <h2>🎯 Персональные рекомендации</h2>
          <button 
            className="close-btn"
            onClick={() => setShowPersonalization(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="user-profile">
          <div className="profile-item">
            <span className="profile-label">Сегмент:</span>
            <span className="profile-value">{getSegmentLabel(userProfile.segment)}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Источник:</span>
            <span className="profile-value">{getSourceLabel(userProfile.source)}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Визитов:</span>
            <span className="profile-value">{userProfile.visitCount}</span>
          </div>
        </div>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((rec) => (
          <div 
            key={rec.id} 
            className="recommendation-card"
            onClick={() => handleRecommendationClick(rec)}
          >
            <h3>{rec.title}</h3>
            <p className="rec-description">{rec.description}</p>
            
            <div className="rec-metrics">
              <div className="metric">
                <span className="metric-label">ROI:</span>
                <span className="metric-value roi">{rec.roi}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Срок:</span>
                <span className="metric-value">{rec.timeframe}</span>
              </div>
            </div>
            
            <div className="rec-reason">
              <small>💡 {rec.reason}</small>
            </div>
            
            <button className="rec-action">
              📈 Рассчитать выгоду
            </button>
          </div>
        ))}
      </div>

      {selectedRecommendation && (
        <div className="benefit-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>💰 Предполагаемая выгода</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedRecommendation(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="benefit-details">
              <h4>{selectedRecommendation.title}</h4>
              
              <div className="benefit-grid">
                <div className="benefit-item">
                  <span className="benefit-label">Инвестиции:</span>
                  <span className="benefit-value">
                    {selectedRecommendation.benefit.investment.toLocaleString()}₽
                  </span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-label">Возврат:</span>
                  <span className="benefit-value profit">
                    {selectedRecommendation.benefit.returnAmount.toLocaleString()}₽
                  </span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-label">ROI:</span>
                  <span className="benefit-value roi">
                    {selectedRecommendation.benefit.roi}%
                  </span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-label">Окупаемость:</span>
                  <span className="benefit-value">
                    {selectedRecommendation.benefit.paybackMonths} мес.
                  </span>
                </div>
              </div>
              
              <div className="benefit-actions">
                <button className="consult-btn">
                  💬 Получить консультацию
                </button>
                <button className="calculate-btn">
                  🧮 Точный расчет
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .personalization-module {
          position: fixed;
          top: 20px;
          left: 20px;
          background: var(--card);
          border: 2px solid var(--accent);
          border-radius: 16px;
          padding: 24px;
          width: 400px;
          max-width: calc(100vw - 40px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(125, 211, 252, 0.3);
          z-index: 1000;
          animation: slideInLeft 0.5s ease-out;
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .personalization-header {
          margin-bottom: 20px;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .header-content h2 {
          margin: 0;
          color: var(--accent);
          font-size: 18px;
        }
        
        .close-btn {
          background: transparent;
          border: 1px solid rgba(125, 211, 252, 0.3);
          color: var(--muted);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        
        .user-profile {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: rgba(125, 211, 252, 0.05);
          border-radius: 8px;
        }
        
        .profile-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        
        .profile-label {
          color: var(--muted);
        }
        
        .profile-value {
          color: var(--text);
          font-weight: 600;
        }
        
        .recommendations-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .recommendation-card {
          background: rgba(125, 211, 252, 0.05);
          border: 1px solid rgba(125, 211, 252, 0.2);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .recommendation-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent);
          box-shadow: 0 8px 20px rgba(125, 211, 252, 0.2);
        }
        
        .recommendation-card h3 {
          margin: 0 0 8px 0;
          color: var(--text);
          font-size: 16px;
        }
        
        .rec-description {
          color: var(--muted);
          margin: 0 0 12px 0;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .rec-metrics {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
        }
        
        .metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .metric-label {
          font-size: 12px;
          color: var(--muted);
        }
        
        .metric-value {
          font-weight: bold;
          font-size: 14px;
          color: var(--text);
        }
        
        .metric-value.roi {
          color: #22c55e;
        }
        
        .rec-reason {
          margin-bottom: 12px;
          color: var(--muted);
        }
        
        .rec-action {
          width: 100%;
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          color: #03101a;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        
        .rec-action:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(125, 211, 252, 0.4);
        }
        
        .benefit-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        
        .modal-content {
          background: var(--card);
          border: 2px solid var(--accent);
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          max-width: 500px;
          animation: modalAppear 0.3s ease-out;
        }
        
        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .modal-header h3 {
          margin: 0;
          color: var(--accent);
        }
        
        .modal-close {
          background: transparent;
          border: 1px solid rgba(125, 211, 252, 0.3);
          color: var(--muted);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-close:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        
        .benefit-details h4 {
          margin: 0 0 16px 0;
          color: var(--text);
        }
        
        .benefit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .benefit-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          background: rgba(125, 211, 252, 0.05);
          border-radius: 8px;
        }
        
        .benefit-label {
          font-size: 12px;
          color: var(--muted);
        }
        
        .benefit-value {
          font-weight: bold;
          font-size: 16px;
          color: var(--text);
        }
        
        .benefit-value.profit {
          color: #22c55e;
        }
        
        .benefit-value.roi {
          color: #22c55e;
        }
        
        .benefit-actions {
          display: flex;
          gap: 12px;
        }
        
        .consult-btn,
        .calculate-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .consult-btn {
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          color: #03101a;
        }
        
        .calculate-btn {
          background: transparent;
          color: var(--accent);
          border: 2px solid var(--accent);
        }
        
        .consult-btn:hover,
        .calculate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(125, 211, 252, 0.3);
        }
        
        @media (max-width: 768px) {
          .personalization-module {
            top: 10px;
            left: 10px;
            right: 10px;
            width: auto;
          }
          
          .benefit-grid {
            grid-template-columns: 1fr;
          }
          
          .benefit-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default PersonalizationModule;
