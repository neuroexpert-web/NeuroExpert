import React from 'react';
import { TestResult, TestError } from './types';

interface TestResultsViewProps {
  results: TestResult[];
  onClearResults?: () => void;
  onExportResults?: () => void;
}

export default function TestResultsView({ 
  results, 
  onClearResults, 
  onExportResults 
}: TestResultsViewProps): JSX.Element {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return '✅';
      case 'failed':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '⏸️';
    }
  };

  const getStatusClass = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return 'status-passed';
      case 'failed':
        return 'status-failed';
      case 'warning':
        return 'status-warning';
      default:
        return 'status-pending';
    }
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const totalTests = results.length;
  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  const warningTests = results.filter(r => r.status === 'warning').length;

  return (
    <div className="test-results-view">
      <div className="results-header">
        <h3>Test Results</h3>
        <div className="results-summary">
          <span className="summary-item passed">
            ✅ Passed: {passedTests}
          </span>
          <span className="summary-item failed">
            ❌ Failed: {failedTests}
          </span>
          <span className="summary-item warning">
            ⚠️ Warnings: {warningTests}
          </span>
          <span className="summary-item total">
            Total: {totalTests}
          </span>
        </div>
        <div className="results-actions">
          {onClearResults && (
            <button 
              className="btn-secondary" 
              onClick={onClearResults}
            >
              Clear Results
            </button>
          )}
          {onExportResults && (
            <button 
              className="btn-primary" 
              onClick={onExportResults}
            >
              Export Results
            </button>
          )}
        </div>
      </div>

      <div className="results-list">
        {results.map((result, index) => (
          <div 
            key={`${result.testId}-${index}`} 
            className={`result-item ${getStatusClass(result.status)}`}
          >
            <div className="result-header">
              <span className="result-status">
                {getStatusIcon(result.status)}
              </span>
              <span className="result-id">
                Test #{result.testId}
              </span>
              <span className="result-duration">
                {formatDuration(result.duration)}
              </span>
              <span className="result-time">
                {result.timestamp.toLocaleTimeString()}
              </span>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="result-errors">
                {result.errors.map((error: TestError, errorIndex: number) => (
                  <div key={errorIndex} className="error-item">
                    <div className="error-message">{error.message}</div>
                    {error.element && (
                      <div className="error-element">
                        Element: {error.element}
                      </div>
                    )}
                    {error.stack && (
                      <details className="error-stack">
                        <summary>Stack Trace</summary>
                        <pre>{error.stack}</pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}