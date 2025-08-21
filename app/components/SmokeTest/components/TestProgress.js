/**
 * Компонент прогресса выполнения тестов
 */

import React from 'react';

export function TestProgress({ current, total, currentTest }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="test-progress">
      <div className="progress-header">
        <span className="progress-label">Прогресс выполнения</span>
        <span className="progress-count">{current} из {total}</span>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {currentTest && (
        <div className="current-test">
          <span className="current-test-label">Текущий тест:</span>
          <span className="current-test-name">{currentTest.name}</span>
        </div>
      )}

      <style jsx>{`
        .test-progress {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .progress-label {
          color: #8892b0;
          font-size: 14px;
          font-weight: 500;
        }

        .progress-count {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .current-test {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .current-test-label {
          color: #8892b0;
          font-size: 13px;
        }

        .current-test-name {
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .test-progress {
            padding: 16px;
          }

          .current-test {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
}