/**
 * Контролы для управления тестами
 */

import React from 'react';
import { TEST_PRIORITY } from '../constants/testConstants';

export function TestControls({ isRunning, onRunAll, onRunByPriority }) {
  return (
    <div className="test-controls">
      <div className="main-controls">
        <button
          className="run-all-button"
          onClick={onRunAll}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Выполняется...' : '🚀 Запустить все тесты'}
        </button>
      </div>

      <div className="priority-controls">
        <span className="controls-label">По приоритету:</span>
        
        <button
          className="priority-button critical"
          onClick={() => onRunByPriority(TEST_PRIORITY.CRITICAL)}
          disabled={isRunning}
        >
          🔴 Критические
        </button>
        
        <button
          className="priority-button high"
          onClick={() => onRunByPriority(TEST_PRIORITY.HIGH)}
          disabled={isRunning}
        >
          🟠 Высокие
        </button>
        
        <button
          className="priority-button medium"
          onClick={() => onRunByPriority(TEST_PRIORITY.MEDIUM)}
          disabled={isRunning}
        >
          🟡 Средние
        </button>
        
        <button
          className="priority-button low"
          onClick={() => onRunByPriority(TEST_PRIORITY.LOW)}
          disabled={isRunning}
        >
          🟢 Низкие
        </button>
      </div>

      <style jsx>{`
        .test-controls {
          margin-bottom: 24px;
        }

        .main-controls {
          margin-bottom: 16px;
        }

        .run-all-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          max-width: 300px;
        }

        .run-all-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .run-all-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .priority-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .controls-label {
          color: #8892b0;
          font-size: 14px;
          font-weight: 500;
        }

        .priority-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .priority-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .priority-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .priority-button.critical:hover:not(:disabled) {
          border-color: #ef4444;
          color: #ef4444;
        }

        .priority-button.high:hover:not(:disabled) {
          border-color: #f97316;
          color: #f97316;
        }

        .priority-button.medium:hover:not(:disabled) {
          border-color: #eab308;
          color: #eab308;
        }

        .priority-button.low:hover:not(:disabled) {
          border-color: #22c55e;
          color: #22c55e;
        }

        @media (max-width: 768px) {
          .priority-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .priority-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}