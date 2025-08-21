/**
 * Компонент сводки результатов тестов
 */

import React from 'react';

export function TestSummary({ summary }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ALL_PASSED': return '#22c55e';
      case 'PARTIAL_FAILURE': return '#f97316';
      case 'HIGH_FAILURE': return '#ef4444';
      case 'CRITICAL_FAILURE': return '#dc2626';
      default: return '#64748b';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ALL_PASSED': return '✅ Все тесты пройдены';
      case 'PARTIAL_FAILURE': return '⚠️ Частичные проблемы';
      case 'HIGH_FAILURE': return '❌ Серьезные проблемы';
      case 'CRITICAL_FAILURE': return '🚨 Критические ошибки';
      default: return 'Неизвестный статус';
    }
  };

  return (
    <div className="test-summary">
      <div className="summary-header">
        <h3>📊 Сводка результатов</h3>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(summary.status) }}
        >
          {getStatusText(summary.status)}
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-card total">
          <div className="stat-value">{summary.total}</div>
          <div className="stat-label">Всего тестов</div>
        </div>

        <div className="stat-card passed">
          <div className="stat-value">{summary.passed}</div>
          <div className="stat-label">Пройдено</div>
        </div>

        <div className="stat-card failed">
          <div className="stat-value">{summary.failed}</div>
          <div className="stat-label">Провалено</div>
        </div>

        <div className="stat-card rate">
          <div className="stat-value">{summary.passRate}</div>
          <div className="stat-label">Успешность</div>
        </div>
      </div>

      <div className="priority-breakdown">
        <h4>Результаты по приоритетам:</h4>
        <div className="priority-stats">
          {Object.entries(summary.byPriority).map(([priority, stats]) => (
            stats.total > 0 && (
              <div key={priority} className={`priority-stat ${priority}`}>
                <span className="priority-name">{priority}:</span>
                <span className="priority-result">
                  {stats.passed}/{stats.total} ({stats.passRate})
                </span>
                {stats.failed > 0 && (
                  <span className="priority-failed">❌ {stats.failed}</span>
                )}
              </div>
            )
          ))}
        </div>
      </div>

      <style jsx>{`
        .test-summary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .summary-header h3 {
          margin: 0;
          color: #fff;
          font-size: 20px;
          font-weight: 600;
        }

        .status-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-card.total .stat-value {
          color: #64748b;
        }

        .stat-card.passed .stat-value {
          color: #22c55e;
        }

        .stat-card.failed .stat-value {
          color: #ef4444;
        }

        .stat-card.rate .stat-value {
          color: #3b82f6;
        }

        .stat-label {
          color: #8892b0;
          font-size: 13px;
          font-weight: 500;
        }

        .priority-breakdown h4 {
          color: #e2e8f0;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .priority-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .priority-stat {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          font-size: 14px;
        }

        .priority-name {
          color: #8892b0;
          text-transform: capitalize;
          min-width: 80px;
        }

        .priority-result {
          color: #e2e8f0;
          font-weight: 600;
        }

        .priority-failed {
          margin-left: auto;
          color: #ef4444;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .summary-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .summary-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}