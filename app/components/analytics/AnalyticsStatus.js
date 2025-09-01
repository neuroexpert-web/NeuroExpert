'use client';

import { useState, useEffect } from 'react';

export default function AnalyticsStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAnalyticsStatus();
  }, []);

  const checkAnalyticsStatus = async () => {
    try {
      const response = await fetch('/api/analytics/test');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error checking analytics status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-status-loading">
        <div className="spinner"></div>
        <p>Проверка статуса аналитики...</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="analytics-status-error">
        <p>Не удалось проверить статус аналитики</p>
      </div>
    );
  }

  return (
    <div className="analytics-status-container">
      <h3>📊 Статус подключения аналитики</h3>
      
      {/* Общий статус */}
      <div className={`status-summary ${status.status}`}>
        <div className="status-header">
          <span className="status-icon">
            {status.status === 'partial' ? '⚠️' : '❌'}
          </span>
          <span className="status-text">
            Настроено сервисов: {status.summary.configuredServices} из {status.summary.totalServices}
          </span>
        </div>
        
        <div className="services-grid">
          {Object.entries(status.summary.services).map(([service, serviceStatus]) => (
            <div key={service} className={`service-item ${serviceStatus.includes('✅') ? 'configured' : 'not-configured'}`}>
              <span className="service-name">{service}</span>
              <span className="service-status">{serviceStatus}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Детали по каждому сервису */}
      <div className="services-details">
        <h4>Детальная информация</h4>
        
        {Object.entries(status.details).map(([service, details]) => (
          <details key={service} className="service-details">
            <summary className={details.configured ? 'configured' : 'not-configured'}>
              {service.replace(/([A-Z])/g, ' $1').trim()}
              <span className="config-badge">
                {details.configured ? '✅ Настроен' : '❌ Не настроен'}
              </span>
            </summary>
            <div className="variables-list">
              {Object.entries(details.variables).map(([variable, varStatus]) => (
                <div key={variable} className="variable-item">
                  <code>{variable}</code>
                  <span>{varStatus}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* Результаты API тестов */}
      {Object.keys(status.apiTests).length > 0 && (
        <div className="api-tests">
          <h4>API тесты</h4>
          {Object.entries(status.apiTests).map(([service, test]) => (
            <div key={service} className="api-test-item">
              <span className="test-service">{service}</span>
              <span className="test-status">{test.status}</span>
              {test.isRealData !== undefined && (
                <span className="test-data">
                  {test.isRealData ? '📊 Реальные данные' : '🎭 Демо данные'}
                </span>
              )}
              {test.message && <p className="test-message">{test.message}</p>}
              {test.error && <p className="test-error">{test.error}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Рекомендации */}
      {status.recommendations.length > 0 && (
        <div className="recommendations">
          <h4>🔧 Рекомендации по настройке</h4>
          {status.recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-item priority-${rec.priority}`}>
              <div className="rec-header">
                <span className="rec-service">{rec.service}</span>
                <span className={`rec-priority ${rec.priority}`}>
                  {rec.priority === 'critical' ? '🚨 Критично' : 
                   rec.priority === 'high' ? '⚠️ Важно' : '💡 Рекомендация'}
                </span>
              </div>
              <p className="rec-action">{rec.action}</p>
              {rec.docs && <p className="rec-docs">📖 {rec.docs}</p>}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .analytics-status-container {
          background: rgba(26, 26, 46, 0.9);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin: 2rem 0;
        }

        h3 {
          color: white;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        h4 {
          color: white;
          margin: 1.5rem 0 1rem;
          font-size: 1.2rem;
        }

        .status-summary {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .status-icon {
          font-size: 2rem;
        }

        .status-text {
          color: white;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .service-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }

        .service-item.configured {
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.05);
        }

        .service-item.not-configured {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .service-name {
          color: white;
          font-weight: 500;
        }

        .service-status {
          font-size: 0.9rem;
        }

        .services-details {
          margin-top: 2rem;
        }

        details {
          margin-bottom: 1rem;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          overflow: hidden;
        }

        summary {
          padding: 1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        summary:hover {
          background: rgba(139, 92, 246, 0.1);
        }

        summary.configured {
          border-left: 3px solid #10b981;
        }

        summary.not-configured {
          border-left: 3px solid #ef4444;
        }

        .config-badge {
          font-size: 0.875rem;
          font-weight: normal;
        }

        .variables-list {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
        }

        .variable-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .variable-item:last-child {
          border-bottom: none;
        }

        .variable-item code {
          color: #8b5cf6;
          font-size: 0.875rem;
        }

        .api-tests {
          margin-top: 2rem;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .api-test-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .api-test-item:last-child {
          border-bottom: none;
        }

        .test-service {
          color: white;
          font-weight: 500;
          min-width: 150px;
        }

        .test-status {
          font-weight: 500;
        }

        .test-data {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .test-message,
        .test-error {
          font-size: 0.875rem;
          margin: 0.5rem 0 0;
          padding-left: 150px;
        }

        .test-message {
          color: rgba(255, 255, 255, 0.7);
        }

        .test-error {
          color: #ef4444;
        }

        .recommendations {
          margin-top: 2rem;
        }

        .recommendation-item {
          background: rgba(139, 92, 246, 0.05);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid transparent;
        }

        .recommendation-item.priority-critical {
          border-color: rgba(239, 68, 68, 0.5);
          background: rgba(239, 68, 68, 0.1);
        }

        .recommendation-item.priority-high {
          border-color: rgba(245, 158, 11, 0.5);
          background: rgba(245, 158, 11, 0.1);
        }

        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .rec-service {
          color: white;
          font-weight: 500;
        }

        .rec-priority {
          font-size: 0.875rem;
        }

        .rec-action {
          color: rgba(255, 255, 255, 0.9);
          margin: 0.5rem 0;
        }

        .rec-docs {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin: 0.5rem 0;
        }

        .analytics-status-loading,
        .analytics-status-error {
          text-align: center;
          padding: 3rem;
          color: white;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(139, 92, 246, 0.3);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}