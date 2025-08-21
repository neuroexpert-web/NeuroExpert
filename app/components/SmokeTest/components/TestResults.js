/**
 * Компонент отображения результатов тестов
 */

import React, { useState } from 'react';
import { TEST_STATUS } from '../constants/testConstants';

export function TestResults({ results, recommendations }) {
  const [expandedTests, setExpandedTests] = useState(new Set());

  const toggleExpanded = (testId) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedTests(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case TEST_STATUS.PASSED: return '✅';
      case TEST_STATUS.FAILED: return '❌';
      case TEST_STATUS.SKIPPED: return '⏭️';
      case TEST_STATUS.ERROR: return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TEST_STATUS.PASSED: return '#22c55e';
      case TEST_STATUS.FAILED: return '#ef4444';
      case TEST_STATUS.SKIPPED: return '#f97316';
      case TEST_STATUS.ERROR: return '#eab308';
      default: return '#64748b';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#64748b';
    }
  };

  return (
    <div className="test-results">
      {recommendations && recommendations.length > 0 && (
        <div className="recommendations">
          <h3>💡 Рекомендации</h3>
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation ${rec.level.toLowerCase()}`}>
              <div className="rec-message">{rec.message}</div>
              {rec.tests && (
                <ul className="rec-tests">
                  {rec.tests.map((test, idx) => (
                    <li key={idx}>{typeof test === 'string' ? test : `${test.name}: ${test.duration}`}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="results-list">
        <h3>📋 Детальные результаты</h3>
        {results.map((result) => {
          const isExpanded = expandedTests.has(result.testId);
          
          return (
            <div key={result.testId} className="test-result">
              <div 
                className="result-header"
                onClick={() => toggleExpanded(result.testId)}
              >
                <div className="result-info">
                  <span className="status-icon">{getStatusIcon(result.status)}</span>
                  <span className="test-name">{result.testName}</span>
                  <span 
                    className="priority-badge"
                    style={{ color: getPriorityColor(result.priority) }}
                  >
                    {result.priority}
                  </span>
                </div>
                <div className="result-meta">
                  <span className="steps-info">
                    {result.passedSteps}/{result.totalSteps} шагов
                  </span>
                  <span className="duration">{result.duration}</span>
                  <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </div>

              {isExpanded && result.failedSteps && (
                <div className="result-details">
                  <h4>Проваленные шаги:</h4>
                  {result.failedSteps.map((step, index) => (
                    <div key={index} className="failed-step">
                      <div className="step-header">
                        <span className="step-action">{step.action}</span>
                      </div>
                      <div className="step-details">
                        <div className="step-expected">
                          <span className="label">Ожидалось:</span>
                          <span className="value">{step.expected}</span>
                        </div>
                        <div className="step-actual">
                          <span className="label">Получено:</span>
                          <span className="value">{step.actual || 'null'}</span>
                        </div>
                        {step.error && (
                          <div className="step-error">
                            <span className="label">Ошибка:</span>
                            <span className="value">{step.error}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {result.errors && result.errors.length > 0 && (
                    <div className="errors-section">
                      <h4>Ошибки:</h4>
                      <ul className="error-list">
                        {result.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .test-results {
          margin-top: 24px;
        }

        .recommendations {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .recommendations h3 {
          margin: 0 0 16px 0;
          color: #fbbf24;
          font-size: 18px;
          font-weight: 600;
        }

        .recommendation {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 12px;
        }

        .recommendation.critical {
          border-left: 4px solid #dc2626;
        }

        .recommendation.high {
          border-left: 4px solid #f97316;
        }

        .recommendation.medium {
          border-left: 4px solid #eab308;
        }

        .rec-message {
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.5;
        }

        .rec-tests {
          margin: 8px 0 0 20px;
          padding: 0;
          list-style: disc;
        }

        .rec-tests li {
          color: #8892b0;
          font-size: 13px;
          margin: 4px 0;
        }

        .results-list h3 {
          margin: 0 0 16px 0;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
        }

        .test-result {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .result-header:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .result-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-icon {
          font-size: 18px;
        }

        .test-name {
          color: #e2e8f0;
          font-size: 15px;
          font-weight: 500;
        }

        .priority-badge {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .result-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .steps-info {
          color: #8892b0;
          font-size: 13px;
        }

        .duration {
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }

        .expand-icon {
          color: #8892b0;
          font-size: 12px;
        }

        .result-details {
          padding: 0 16px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .result-details h4 {
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 600;
          margin: 16px 0 12px;
        }

        .failed-step {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 8px;
        }

        .step-action {
          color: #f87171;
          font-size: 14px;
          font-weight: 600;
        }

        .step-details {
          margin-top: 8px;
          font-size: 13px;
        }

        .step-expected,
        .step-actual,
        .step-error {
          display: flex;
          gap: 8px;
          margin: 4px 0;
        }

        .label {
          color: #8892b0;
          min-width: 80px;
        }

        .value {
          color: #e2e8f0;
        }

        .step-error .value {
          color: #f87171;
        }

        .errors-section {
          margin-top: 16px;
        }

        .error-list {
          margin: 8px 0 0 20px;
          padding: 0;
          list-style: disc;
        }

        .error-list li {
          color: #f87171;
          font-size: 13px;
          margin: 4px 0;
        }

        @media (max-width: 768px) {
          .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .result-meta {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}