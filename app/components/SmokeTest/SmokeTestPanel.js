/**
 * Главный компонент панели smoke-тестов
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { SmokeTestRunner } from './core/SmokeTestRunner';
import { TestControls } from './components/TestControls';
import { TestResults } from './components/TestResults';
import { TestProgress } from './components/TestProgress';
import { TestSummary } from './components/TestSummary';
import { performanceMonitor } from './utils/performanceMonitor';

export default function SmokeTestPanel() {
  const [runner] = useState(() => new SmokeTestRunner());
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Запуск всех тестов
  const handleRunAllTests = useCallback(async () => {
    setIsRunning(true);
    setResults(null);
    performanceMonitor.startMonitoring();

    try {
      const report = await runner.runAllTests();
      setResults(report);
    } catch (error) {
      console.error('Ошибка при выполнении тестов:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
      performanceMonitor.stopMonitoring();
    }
  }, [runner]);

  // Запуск тестов по приоритету
  const handleRunByPriority = useCallback(async (priority) => {
    setIsRunning(true);
    setResults(null);

    try {
      const testResults = await runner.runTestsByPriority(priority);
      const report = runner.reporter.generateReport(testResults);
      setResults(report);
    } catch (error) {
      console.error('Ошибка при выполнении тестов:', error);
    } finally {
      setIsRunning(false);
    }
  }, [runner]);

  // Обновление прогресса
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const status = runner.getTestStatus();
      setCurrentTest(status.currentTest);
      setProgress({
        current: status.completedTests,
        total: status.totalTests
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, runner]);

  return (
    <div className="smoke-test-panel">
      <div className="panel-header">
        <h2>🚬 Smoke Tests</h2>
        <p className="panel-description">
          Автоматическое тестирование критически важных функций системы
        </p>
      </div>

      <TestControls
        isRunning={isRunning}
        onRunAll={handleRunAllTests}
        onRunByPriority={handleRunByPriority}
      />

      {isRunning && (
        <TestProgress
          current={progress.current}
          total={progress.total}
          currentTest={currentTest}
        />
      )}

      {results && (
        <>
          <TestSummary summary={results.summary} />
          <TestResults 
            results={results.results} 
            recommendations={results.recommendations}
          />
        </>
      )}

      <style jsx>{`
        .smoke-test-panel {
          background: linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%);
          border-radius: 16px;
          padding: 32px;
          margin: 20px 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .panel-header {
          margin-bottom: 24px;
        }

        .panel-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .panel-description {
          color: #8892b0;
          font-size: 16px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .smoke-test-panel {
            padding: 20px;
            margin: 10px;
          }

          .panel-header h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}